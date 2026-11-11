#!/bin/sh
# ii — site helper
set -e
cd "$(dirname "$(readlink -f "$0")")" # works through a symlink too (~/.local/bin/ii)

usage() {
  cat <<USAGE
Usage: ii <cmd> [args]
  u <text>        new note
  s <image> [title]  new screenshot post
  code [--backfill]  update content/c from the github api
  dev             sass watch + hugo server
  build           build site
  clean           clean build
  publish         deploy public/
USAGE
}

stamp() { date +%Y-%m-%d-%H%M; }
now() { date +%Y-%m-%dT%H:%M:%S%:z; }

case "$1" in
u)
  shift
  [ -n "$*" ] || { echo "usage: ii u <text>"; exit 1; }
  f="content/u/$(stamp).md"
  printf -- '---\ndate: %s\n---\n%s\n' "$(now)" "$*" >"$f"
  echo "$f"
  ;;
s)
  [ -f "$2" ] || { echo "image not found: $2"; exit 1; }
  d="content/s/$(stamp)"
  mkdir -p "$d"
  cp "$2" "$d/"
  printf -- '---\ndate: %s\n' "$(now)" >"$d/index.md"
  [ -n "$3" ] && printf 'title: "%s"\n' "$3" >>"$d/index.md"
  printf -- '---\n' >>"$d/index.md"
  echo "$d"
  ;;
code)
  shift
  node scripts/update-code.mjs "$@"
  ;;
dev)
  npm run build:style
  npx sass --load-path=style/lib/enron style/main.scss static/style.css -w &
  trap 'kill $!' EXIT
  npx hugo server
  ;;
build) npm run build ;;
clean) npm run clean ;;
publish)
  [ -d public ] || { echo "Not built yet"; exit 1; }
  scripts/deploy.sh
  ;;
help | -h | --help | "") usage ;;
*)
  echo "Unknown command: $1"
  usage
  exit 1
  ;;
esac
