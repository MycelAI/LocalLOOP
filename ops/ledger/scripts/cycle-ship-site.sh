#!/usr/bin/env bash
set -euo pipefail
CYCLE="${1:?cycle}"
TITLE="${2:?title}"
DEPLOY="${3:-yes}"
WS=/home/alphin/code/local-loop-io/localloop-site
cd "$WS"
git push -u origin "agent/cycle-${CYCLE}"
gh pr create --base main --head "agent/cycle-${CYCLE}" --title "$TITLE" --body "Refs: agent-cycle-${CYCLE}." || true
gh pr merge --squash --admin --delete-branch
git fetch origin
git checkout main
git pull --ff-only origin main
SHA=$(git rev-parse HEAD)
git tag -f -a "agent-cycle-${CYCLE}" -m "agent-cycle-${CYCLE}" "$SHA"
git push origin "refs/tags/agent-cycle-${CYCLE}" --force
if [[ "$DEPLOY" == "yes" ]]; then
  sudo docker compose up -d --build
  sleep 2
  curl -sS -o /dev/null -w "site:%{http_code}\n" https://localloop.urbnia.com/
fi
echo "SHIPPED site cycle=${CYCLE} sha=${SHA}"
