#!/usr/bin/env bash
# Ship a backend agent cycle: push branch, PR, admin-merge, tag, optional deploy.
set -euo pipefail
CYCLE="${1:?cycle number e.g. 005}"
TITLE="${2:?pr title}"
DEPLOY="${3:-yes}" # yes|no
WS=/home/alphin/code/local-loop-io/localloop-backend
cd "$WS"
git push -u origin "agent/cycle-${CYCLE}"
gh pr create --base main --head "agent/cycle-${CYCLE}" --title "$TITLE" --body "Refs: agent-cycle-${CYCLE}." || true
gh pr merge --squash --admin --delete-branch
git fetch origin
git checkout main
git pull --ff-only origin main
SHA=$(git rev-parse HEAD)
git tag -f -a "agent-cycle-${CYCLE}" -m "agent-cycle-${CYCLE}" "$SHA"
git push -f origin "agent/cycle-${CYCLE}" 2>/dev/null || git push origin "agent/cycle-${CYCLE}"
if [[ "$DEPLOY" == "yes" ]]; then
  sudo docker compose up -d --build --no-deps api
  for i in $(seq 1 20); do
    body=$(curl -sS -m 3 https://loop-api.urbnia.com/health || true)
    echo "$body" | grep -q '"status":"ok"' && echo "HEALTH $body" && break
    sleep 2
  done
fi
echo "SHIPPED cycle=${CYCLE} sha=${SHA}"
