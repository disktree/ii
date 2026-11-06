#!/bin/sh

ACCOUNT=tong
PER_PAGE=1000

[ -n "$1" ] && ACCOUNT="$1"

#gh api -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" --method GET "/users/$ACCOUNT/events" -F per_page=$PER_PAGE >"data/github/$ACCOUNT.json"
#gh api "/users/$ACCOUNT/gists" --json --paginate >"data/gist-$ACCOUNT.json"

request() {
  curl -L \
    -H "Accept: application/vnd.github+json" \
    "https://api.github.com/users/$ACCOUNT/$1?per_page=$PER_PAGE"
}

request "gists" >"data/gist.json"
request "events" >"data/github.json"
