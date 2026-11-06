#!/usr/bin/env node
// Generates content/c/* from public GitHub activity.
//
//   node scripts/update-code.mjs [account ...] [--backfill] [--dry-run]
//
// One markdown file per repository per day (content/c/YYYY-MM-DD-owner-repo.md).
// Files are merged, never deleted: the events API only returns the last
// 90 days / 300 events, so running this regularly accumulates history.
//
// --backfill also adds a "created repository" entry for every public,
// non-fork repository of each account, back to the beginning.
//
// Auth: $GITHUB_TOKEN, or the token of the `gh` CLI if it is logged in.
// Without a token the API allows 60 requests/hour, which is not enough.

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
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
            return {
                summary: `pushed ${n} commit${n === 1 ? '' : 's'} to ${branch(p.ref)}`,
                url: `${repoUrl}/tree/${branch(p.ref)}`,
                commits,
            };
        }
        case 'CreateEvent':
            if (p.ref_type === 'repository') return { summary: 'created repository', url: repoUrl };
            return { summary: `created ${p.ref_type} ${p.ref}`, url: `${repoUrl}/tree/${p.ref}` };
        case 'PublicEvent':
            return { summary: 'made repository public', url: repoUrl };
        case 'ReleaseEvent':
            if (p.action !== 'published') return null;
            return { summary: `released ${p.release.name || p.release.tag_name}`, url: p.release.html_url };
        case 'ForkEvent':
            return { summary: `forked to ${p.forkee.full_name}`, url: p.forkee.html_url };
        case 'PullRequestEvent':
            if (p.action === 'closed' && p.pull_request?.merged) {
                return { summary: `merged #${p.number} ${p.pull_request.title}`, url: p.pull_request.html_url };
            }
            if (p.action !== 'opened') return null;
            return { summary: `opened #${p.number} ${p.pull_request?.title ?? ''}`.trim(), url: p.pull_request?.html_url };
        case 'IssuesEvent':
            if (p.action !== 'opened') return null;
            return { summary: `opened issue #${p.issue.number} ${p.issue.title}`, url: p.issue.html_url };
        default:
            return null; // stars, comments, deletes, wiki edits: not interesting enough
    }
}

// --- files

const entries = new Map(); // file → entry

function fileFor(day, repo) {
    return join(OUT, `${day}-${repo.replace('/', '-').toLowerCase()}.md`);
}

function load(file, repo, account) {
    if (entries.has(file)) return entries.get(file);
    let e;
    if (existsSync(file)) {
        e = parseFrontMatter(readFileSync(file, 'utf8'));
    }
    e ??= { title: repo, repo, account, repo_url: `https://github.com/${repo}`, events: [], commits: [] };
    e.events ??= [];
    e.commits ??= [];
    entries.set(file, e);
    return e;
}

function add(account, repo, created, id, info) {
    const day = created.slice(0, 10);
    const file = fileFor(day, repo);
    const entry = load(file, repo, account);
    if (entry.events.some((x) => x.id === id)) return false;
    const { commits = [], ...ev } = info;
    entry.events.push({ id, created, ...ev });
    for (const c of commits) {
        if (!entry.commits.some((x) => x.sha === c.sha)) entry.commits.push(c);
    }
    entry.events.sort((a, b) => a.created.localeCompare(b.created));
    entry.date = entry.events.at(-1).created;
    entry.description = summarize(entry);
    entry.dirty = true;
    return true;
}

function summarize(entry) {
    const parts = [];
    const n = entry.commits.length;
    if (n) parts.push(`${n} commit${n === 1 ? '' : 's'}`);
    for (const e of entry.events) {
        if (e.summary.startsWith('pushed ')) continue;
        if (!parts.includes(e.summary)) parts.push(e.summary);
    }
    return parts.join(', ');
}

// JSON front matter: Hugo reads it natively and it round-trips without a YAML lib.
function parseFrontMatter(text) {
    const m = text.match(/^(\{[\s\S]*?\n\})\n/);
    return m ? JSON.parse(m[1]) : null;
}

function write(file, entry) {
    const { dirty, ...data } = entry;
    const known = existsSync(file) ? readFileSync(file, 'utf8').replace(/^\{[\s\S]*?\n\}\n/, '') : '';
    writeFileSync(file, JSON.stringify(data, null, 2) + '\n' + known);
}

// --- main

async function main() {
    mkdirSync(OUT, { recursive: true });
    let added = 0;

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

        if (BACKFILL) {
            const kind = user.type === 'Organization' ? 'orgs' : 'users';
            const repos = await paginate(`/${kind}/${account}/repos?type=owner&sort=created`);
            for (const r of repos) {
                if (r.fork || r.private) continue;
                const id = `repo-${r.id}`;
                const info = { summary: 'created repository', url: r.html_url };
                if (add(account, r.full_name, r.created_at, id, info)) {
                    const entry = load(fileFor(r.created_at.slice(0, 10), r.full_name));
                    if (r.description) entry.about ??= r.description;
                    if (r.language) entry.language ??= r.language;
                    added++;
                }
            }
        }
    }

    let written = 0;
    for (const [file, entry] of entries) {
        if (!entry.dirty) continue;
        written++;
        if (DRY) console.log(`would write ${file.replace(ROOT, '')}: ${entry.description}`);
        else write(file, entry);
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
