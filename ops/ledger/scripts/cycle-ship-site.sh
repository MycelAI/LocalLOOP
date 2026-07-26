#!/usr/bin/env bash
set -euo pipefail
CYCLE="${1:?cycle}"
TITLE="${2:?title}"
DEPLOY="${3:-yes}"
WS=/home/alphin/code/local-loop-io/localloop-site
TAG="agent-cycle-${CYCLE}"
cd "$WS"
git push -u origin "agent/cycle-${CYCLE}"
gh pr create --base main --head "agent/cycle-${CYCLE}" --title "$TITLE" --body "Refs: ${TAG}." || true
gh pr merge --squash --admin --delete-branch
git fetch origin
git checkout main
git pull --ff-only origin main
SHA=$(git rev-parse HEAD)
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
  sudo docker compose up -d --build
  sleep 2
  curl -sS -o /dev/null -w "site:%{http_code}\n" https://localloop.urbnia.com/
fi
echo "SHIPPED site cycle=${CYCLE} sha=${SHA}"
