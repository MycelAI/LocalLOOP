#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

fail=0

if rg -n "/api/health" AGENTS.md CLAUDE.md README.md profile/README.md; then
  echo "Found stale /api/health reference; use /health." >&2
  fail=1
fi

if rg -n "api\\.local-loop\\.io" AGENTS.md CLAUDE.md README.md profile/README.md | rg -vi "not.*exist|does not exist"; then
  echo "Found non-canonical api.local-loop.io wording." >&2
  fail=1
fi

exit "$fail"
