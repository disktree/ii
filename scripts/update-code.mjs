#!/usr/bin/env node
// Generates content/c/* from public GitHub activity.
//
//   node scripts/update-code.mjs [account ...] [--backfill] [--dry-run]
//
// One markdown file per repository per day (content/c/YYYY-MM-DD-owner-repo.md).
// Files are merged, never deleted: the events API only returns the last
// 90 days / 300 events, so running this regularly accumulates history.
//
// --backfill also walks every public, non-fork repository of each account
// and adds its creation, all releases and all tags (dated by their commit),
// back to the beginning.
//
// Every run also writes data/archived.json: the archived repositories of all
// accounts, which the site leaves out of the home page.
//
// Auth: $GITHUB_TOKEN, or the token of the `gh` CLI if it is logged in.
// Without a token the API allows 60 requests/hour, which is not enough.

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const OUT = join(ROOT, 'content/c');
const API = 'https://api.github.com';

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
let accounts = args.filter((a) => !a.startsWith('--'));
if (accounts.length === 0) accounts = readAccounts();
const BACKFILL = flags.has('--backfill');
const DRY = flags.has('--dry-run');

const token = process.env.GITHUB_TOKEN || ghToken();
if (!token) console.warn('warning: no GITHUB_TOKEN and no gh login, rate limit is 60 requests/hour');

// --- github

async function api(path) {
    const res = await fetch(path.startsWith('http') ? path : API + path, {
        headers: {
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'User-Agent': 'ii-update-code',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
    if (res.status === 404 || res.status === 422) return null;
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} ${path}\n${await res.text()}`);
    return res.json();
}

async function paginate(path, max = 10) {
    const out = [];
    for (let page = 1; page <= max; page++) {
        const sep = path.includes('?') ? '&' : '?';
        const items = await api(`${path}${sep}per_page=100&page=${page}`);
        if (!items || items.length === 0) break;
        out.push(...items);
        if (items.length < 100) break;
    }
    return out;
}

async function events(account, type) {
    const path = type === 'Organization' ? `/orgs/${account}/events` : `/users/${account}/events/public`;
    return paginate(path, 3);
}

// Since Oct 2025 PushEvent payloads no longer carry commits; ask the compare API.
async function pushCommits(e) {
    const p = e.payload;
    if (Array.isArray(p.commits) && p.commits.length) {
        return p.commits.map((c) => ({
            sha: c.sha,
            message: firstLine(c.message),
            url: `https://github.com/${e.repo.name}/commit/${c.sha}`,
        }));
    }
    if (!p.before || !p.head || /^0+$/.test(p.before)) {
        return p.head ? [await singleCommit(e.repo.name, p.head)].filter(Boolean) : [];
    }
    const cmp = await api(`/repos/${e.repo.name}/compare/${p.before}...${p.head}`);
    if (!cmp) return [];
    return cmp.commits.map((c) => ({
        sha: c.sha,
        message: firstLine(c.commit.message),
        url: c.html_url,
    }));
}

async function singleCommit(repo, sha) {
    const c = await api(`/repos/${repo}/commits/${sha}`);
    return c && { sha: c.sha, message: firstLine(c.commit.message), url: c.html_url };
}

// --- events → entries

const branch = (ref) => (ref || '').replace(/^refs\/(heads|tags)\//, '');

async function describe(e) {
    const p = e.payload || {};
    const repoUrl = `https://github.com/${e.repo.name}`;
    switch (e.type) {
        case 'PushEvent': {
            const commits = await pushCommits(e);
            const n = commits.length;
            const b = branch(p.ref);
            return {
                kind: 'push',
                branch: b,
                summary: `pushed ${n} commit${n === 1 ? '' : 's'} to ${b}`,
                url: p.before && p.head && !/^0+$/.test(p.before) ? `${repoUrl}/compare/${p.before}...${p.head}` : `${repoUrl}/tree/${b}`,
                commits,
            };
        }
        case 'CreateEvent':
            if (p.ref_type === 'repository') return { kind: 'repository', summary: 'created repository', url: repoUrl };
            if (p.ref_type === 'tag') return { kind: 'tag', tag: p.ref, summary: `created tag ${p.ref}`, url: `${repoUrl}/releases/tag/${p.ref}` };
            return { kind: 'branch', branch: p.ref, summary: `created branch ${p.ref}`, url: `${repoUrl}/tree/${p.ref}` };
        case 'PublicEvent':
            return { kind: 'public', summary: 'made repository public', url: repoUrl };
        case 'ReleaseEvent':
            if (p.action !== 'published') return null;
            return release(p.release);
        case 'ForkEvent':
            return { kind: 'fork', summary: `forked to ${p.forkee.full_name}`, url: p.forkee.html_url };
        case 'PullRequestEvent':
            if (p.action === 'closed' && p.pull_request?.merged) {
                return { kind: 'pr', summary: `merged #${p.number} ${p.pull_request.title}`, url: p.pull_request.html_url };
            }
            if (p.action !== 'opened') return null;
            return { kind: 'pr', summary: `opened #${p.number} ${p.pull_request?.title ?? ''}`.trim(), url: p.pull_request?.html_url };
        case 'IssuesEvent':
            if (p.action !== 'opened') return null;
            return { kind: 'issue', summary: `opened issue #${p.issue.number} ${p.issue.title}`, url: p.issue.html_url };
        default:
            return null; // stars, comments, deletes, wiki edits: not interesting enough
    }
}

function release(r) {
    return { kind: 'release', tag: r.tag_name, summary: `released ${r.name || r.tag_name}`, url: r.html_url };
}

// Older files have no `kind`; derive it from the summary.
function kindOf(e) {
    if (e.kind) return e;
    let m;
    if ((m = e.summary.match(/^pushed \d+ commits? to (.+)$/))) return { ...e, kind: 'push', branch: m[1] };
    if ((m = e.summary.match(/^created tag (.+)$/))) return { ...e, kind: 'tag', tag: m[1] };
    if ((m = e.summary.match(/^created branch (.+)$/))) return { ...e, kind: 'branch', branch: m[1] };
    if (e.summary === 'created repository') return { ...e, kind: 'repository' };
    if (e.summary.startsWith('released ')) return { ...e, kind: 'release' };
    return { ...e, kind: 'other' };
}

// --- files

const entries = new Map(); // file → entry
const seen = new Set(); // "repo kind tag" of every known tag and release, across all days

function fileFor(day, repo) {
    return join(OUT, `${day}-${repo.replace('/', '-').toLowerCase()}.md`);
}

function load(file, repo, account) {
    if (entries.has(file)) return entries.get(file);
    let e;
    if (existsSync(file)) {
        e = parseFrontMatter(readFileSync(file, 'utf8'));
        if (e) e.original = JSON.stringify(e);
    }
    e ??= { title: repo, repo, account, repo_url: `https://github.com/${repo}`, events: [], commits: [] };
    e.events = (e.events ?? []).map(kindOf);
    e.commits ??= [];
    for (const ev of e.events) if (ev.tag) seen.add(`${e.repo} ${ev.kind} ${ev.tag}`);
    entries.set(file, e);
    return e;
}

function loadAll() {
    for (const name of readdirSync(OUT)) {
        if (!/^\d{4}-\d\d-\d\d-.+\.md$/.test(name)) continue;
        load(join(OUT, name));
    }
}

function add(account, repo, created, id, info) {
    if (info.tag && seen.has(`${repo} ${info.kind} ${info.tag}`)) return false;
    const file = fileFor(created.slice(0, 10), repo);
    const entry = load(file, repo, account);
    if (entry.events.some((x) => x.id === id)) return false;
    const { commits = [], ...ev } = info;
    entry.events.push({ id, created, ...ev });
    for (const c of commits) {
        if (!entry.commits.some((x) => x.sha === c.sha)) entry.commits.push(c);
    }
    if (info.tag) seen.add(`${repo} ${info.kind} ${info.tag}`);
    return true;
}

// The linked fragments shown in the stream: "3 commits, released v1.2, tag v1.1"
function summarize(entry) {
    const day = entry.events[0].created.slice(0, 10);
    const evs = entry.events;
    const parts = [];
    const has = (kind) => evs.some((e) => e.kind === kind);
    const releases = new Set(evs.filter((e) => e.kind === 'release').map((e) => e.tag));

    const n = entry.commits.length;
    if (n) {
        const b = evs.find((e) => e.kind === 'push')?.branch;
        const url = n === 1 ? entry.commits[0].url
            : b ? `${entry.repo_url}/commits/${b}?since=${day}&until=${day}`
            : `${entry.repo_url}/commits`;
        parts.push({ text: `${n} commit${n === 1 ? '' : 's'}`, url });
    }
    for (const e of evs) {
        let text;
        switch (e.kind) {
            case 'push': continue;
            case 'repository': text = 'new repository'; break;
            case 'branch': if (has('repository')) continue; text = `branch ${e.branch}`; break;
            case 'tag': if (releases.has(e.tag)) continue; text = `tag ${e.tag}`; break;
            default: text = e.summary;
        }
        if (!parts.some((p) => p.text === text)) parts.push({ text, url: e.url });
    }
    // releases and tags first, they matter more than commit counts
    const rank = (p) => (/^released |^tag /.test(p.text) ? 0 : 1);
    parts.sort((a, b) => rank(a) - rank(b));
    return parts;
}

function finish(entry) {
    entry.events.sort((a, b) => a.created.localeCompare(b.created));
    entry.date = entry.events.at(-1).created;
    entry.parts = summarize(entry);
    entry.description = entry.parts.map((p) => p.text).join(', ');
    const { original, ...data } = entry;
    return data;
}

// JSON front matter: Hugo reads it natively and it round-trips without a YAML lib.
function parseFrontMatter(text) {
    const m = text.match(/^(\{[\s\S]*?\n\})\n/);
    return m ? JSON.parse(m[1]) : null;
}

function write(file, data) {
    const body = existsSync(file) ? readFileSync(file, 'utf8').replace(/^\{[\s\S]*?\n\}\n/, '') : '';
    writeFileSync(file, JSON.stringify(data, null, 2) + '\n' + body);
}

// --- main

const repoLists = new Map();
async function reposOf(account, user) {
    if (!repoLists.has(account)) {
        const kind = user.type === 'Organization' ? 'orgs' : 'users';
        repoLists.set(account, await paginate(`/${kind}/${account}/repos?type=owner&sort=created`));
    }
    return repoLists.get(account);
}

async function backfill(account, user) {
    let added = 0;
    const repos = await reposOf(account, user);
    for (const r of repos) {
        if (r.fork || r.private) continue;
        if (add(account, r.full_name, r.created_at, `repo-${r.id}`, { kind: 'repository', summary: 'created repository', url: r.html_url })) {
            added++;
        }
        const entry = load(fileFor(r.created_at.slice(0, 10), r.full_name), r.full_name, account);
        if (r.description) entry.about ??= r.description;
        if (r.language) entry.language ??= r.language;

        for (const rel of await paginate(`/repos/${r.full_name}/releases`)) {
            if (rel.draft || !rel.published_at) continue;
            if (add(account, r.full_name, rel.published_at, `release-${rel.id}`, release(rel))) added++;
        }
        for (const t of await paginate(`/repos/${r.full_name}/tags`)) {
            if (seen.has(`${r.full_name} tag ${t.name}`)) continue;
            const c = await api(`/repos/${r.full_name}/commits/${t.commit.sha}`);
            const date = c?.commit?.committer?.date;
            if (!date) continue;
            const info = { kind: 'tag', tag: t.name, summary: `created tag ${t.name}`, url: `${r.html_url}/releases/tag/${encodeURIComponent(t.name)}` };
            if (add(account, r.full_name, date, `tag-${r.full_name}-${t.name}`, info)) added++;
        }
    }
    return added;
}

async function main() {
    mkdirSync(OUT, { recursive: true });
    loadAll();
    let added = 0;
    const archived = [];

    for (const account of accounts) {
        const user = await api(`/users/${account}`);
        if (!user) {
            console.warn(`unknown account ${account}`);
            continue;
        }
        const evs = await events(account, user.type);
        console.log(`${account} (${user.type.toLowerCase()}): ${evs.length} events`);

        for (const e of evs.reverse()) {
            const file = fileFor(e.created_at.slice(0, 10), e.repo.name);
            if (load(file, e.repo.name, account).events.some((x) => x.id === e.id)) continue;
            const info = await describe(e);
            if (info && add(account, e.repo.name, e.created_at, e.id, info)) added++;
        }

        for (const r of await reposOf(account, user)) if (r.archived && !r.private) archived.push(r.full_name);

        if (BACKFILL) added += await backfill(account, user);
    }

    archived.sort();
    const archivedFile = join(ROOT, 'data/archived.json');
    if (DRY) console.log(`archived: ${archived.join(', ') || 'none'}`);
    else {
        mkdirSync(join(ROOT, 'data'), { recursive: true });
        writeFileSync(archivedFile, JSON.stringify(archived, null, 2) + '\n');
    }

    let written = 0;
    for (const [file, entry] of entries) {
        if (entry.events.length === 0) continue;
        const data = finish(entry);
        if (entry.original === JSON.stringify(data)) continue;
        written++;
        if (DRY) console.log(`would write ${file.replace(ROOT, '')}: ${data.description}`);
        else write(file, data);
    }
    console.log(`${added} new events, ${written} files ${DRY ? 'to write' : 'written'}`);
}

// --- util

function firstLine(s) {
    return (s || '').split('\n')[0].trim();
}

function ghToken() {
    try {
        return execSync('gh auth token', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    } catch {
        return null;
    }
}

function readAccounts() {
    try {
        const yml = readFileSync(join(ROOT, 'config/_default/params.yml'), 'utf8');
        const m = yml.match(/^github_accounts:\s*\[(.*)\]/m);
        if (m) return m[1].split(',').map((s) => s.trim().replace(/['"]/g, '')).filter(Boolean);
    } catch {}
    return ['tong', 'disktree'];
}

main().catch((err) => {
    console.error(err.message);
    process.exit(1);
});
