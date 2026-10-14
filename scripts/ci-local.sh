#!/usr/bin/env bash
# Fast local equivalent of the root CI workflows (no DB-backed backend tests,
# no Playwright). Usage: scripts/ci-local.sh [backend|site|protocol|conformance|org-profile]...
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NPM="${NPM:-$(command -v /home/alphin/.volta/bin/npm || command -v npm)}"
targets=("$@")
[[ ${#targets[@]} -eq 0 ]] && targets=(protocol conformance backend site org-profile)

step() { printf '\n==> %s\n' "$*"; }

for t in "${targets[@]}"; do
  case "$t" in
    protocol)
      cd "$ROOT/protocol"
      step "protocol: domains + schemas"
      ./scripts/check-domains.sh
      [[ -d node_modules ]] || "$NPM" ci
      "$NPM" run test
      ;;
    conformance)
      cd "$ROOT"
      step "conformance: site mirror in sync with protocol/"
      bash apps/site/scripts/aggregate-docs.sh >/dev/null
      git diff --exit-code -- apps/site/public/projects
      cd "$ROOT/apps/backend"
      [[ -d node_modules ]] || bun install --frozen-lockfile
      bun run prisma:generate >/dev/null
      bun run check:conformance
      ;;
    backend)
      cd "$ROOT/apps/backend"
      step "backend: domains, typecheck, lint, schema copies"
      ./scripts/check-domains.sh
      [[ -d node_modules ]] || bun install --frozen-lockfile
      bun run prisma:generate >/dev/null
      bun run typecheck
      bun run lint
      bun run check:schemas
      ;;
    site)
      cd "$ROOT/apps/site"
      step "site: domains, lint, typecheck"
      node scripts/check-domains.cjs
      [[ -d node_modules ]] || bun install --frozen-lockfile
      bun run lint
      bun run typecheck
      ;;
    org-profile)
      cd "$ROOT/ops/org-profile"
      step "org-profile: policy checks"
      bash scripts/check-policy.sh
      bash scripts/check-security-pointer.sh
      ;;
    *) echo "unknown target: $t" >&2; exit 2 ;;
  esac
done
printf '\nAll requested checks passed.\n'
