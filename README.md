# [ii](https://ii.disktree.net/)

Personal index of [disktree](https://disktree.net). Hugo, no theme.

## Sections

| path | | |
|---|---|---|
| `/a/` | archive | projects, one bundle per project. Nested sections (`znn`, `archillect`) list their own children |
| `/c/` | code | **generated** from github activity: `./ii.sh code` (see `scripts/update-code.mjs`) |
| `/s/` | screenshots | one bundle per image: `./ii.sh s image.png "optional title"` |
| `/theprocess/` | | built, but excluded from the stream, the feed, the sitemap and search engines |

The home page is the stream of `a` and `c`, newest first. Screenshots are built but not listed. One combined RSS feed at `/index.xml`.

## Code activity

`scripts/update-code.mjs` reads the public events of the accounts in `params.yml` (`github_accounts`) and writes one file per repository per day into `content/c/` (JSON front matter). Files are merged, never deleted: the events API only covers the last 90 days, so run it regularly to accumulate history. `--backfill` adds a "created repository" entry for every public repository. Uses `$GITHUB_TOKEN` or the `gh` login.

## Design

The stylesheet pretends not to exist: one monospace face at one size (JetBrains Mono, variable, from `@fontsource-variable/jetbrains-mono`, mounted to `/font/` via `module.mounts`), CSS system colors (`Canvas`, `CanvasText`, `LinkText`, …, light/dark follows the OS), underlined links. Underneath: one CSS grid (`edge | meta | text | aside | edge`) shared through `subgrid`, a fixed rhythm, monospaced metadata, one accent color. See `/styleguide/`.

SCSS in `style/`, compiled with dart-sass to `static/style.css`. Uses [enron](https://github.com/tong/enron) as a git submodule (`git submodule update --init`).

```sh
npm install
./ii.sh dev     # or: npm start
./ii.sh build
./ii.sh publish
```
