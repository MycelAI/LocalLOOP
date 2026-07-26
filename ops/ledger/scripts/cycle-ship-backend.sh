#!/usr/bin/env bash
# Ship a backend agent cycle: push branch, PR, admin-merge, tag (immutable), optional deploy.
set -euo pipefail
CYCLE="${1:?cycle number e.g. 005}"
TITLE="${2:?pr title}"
DEPLOY="${3:-yes}" # yes|no
WS=/home/alphin/code/local-loop-io/localloop-backend
TAG="agent-cycle-${CYCLE}"
cd "$WS"
git push -u origin "agent/cycle-${CYCLE}"
gh pr create --base main --head "agent/cycle-${CYCLE}" --title "$TITLE" --body "Refs: ${TAG}." || true
gh pr merge --squash --admin --delete-branch
git fetch origin
git checkout main
git pull --ff-only origin main
SHA=$(git rev-parse HEAD)
# Immutable tag: create only if absent, or if already points at this SHA. Never force-push.
if git rev-parse "$TAG" >/dev/null 2>&1; then
  EXISTING=$(git rev-parse "$TAG^{}")
  if [[ "$EXISTING" != "$SHA" ]]; then
    echo "ERROR: tag $TAG already exists at $EXISTING, refusing to move to $SHA" >&2
    exit 1
  fi
  echo "tag $TAG already at $SHA"
else
  git tag -a "$TAG" -m "$TAG" "$SHA"
  git push origin "refs/tags/${TAG}"
fi
if [[ "$DEPLOY" == "yes" ]]; then
  sudo docker compose up -d --build --no-deps api
  for i in $(seq 1 20); do
    body=$(curl -sS -m 3 https://loop-api.urbnia.com/health || true)
    echo "$body" | grep -q '"status":"ok"' && echo "HEALTH $body" && break
    sleep 2
  done
fi
echo "SHIPPED cycle=${CYCLE} sha=${SHA}"
