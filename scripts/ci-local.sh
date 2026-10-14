#!/usr/bin/env bash
# SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
# SPDX-License-Identifier: MIT

# Fast local equivalent of the root CI workflows (no DB-backed backend tests,
# no Playwright). Usage: scripts/ci-local.sh [backend|site|protocol|conformance|org-profile|reuse|links|domains]...
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NPM="${NPM:-$(command -v /home/alphin/.volta/bin/npm || command -v npm)}"
targets=("$@")
[[ ${#targets[@]} -eq 0 ]] && targets=(protocol conformance backend site org-profile reuse links domains)

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
      step "backend: shipped legal files in sync with the root"
      bash "$ROOT/scripts/sync-legal.sh" --check
      ;;
    site)
      cd "$ROOT/apps/site"
      step "site: domains, lint, typecheck"
      node scripts/check-domains.cjs
      [[ -d node_modules ]] || bun install --frozen-lockfile
      bun run lint
      bun run typecheck
      step "site: published legal files (public/licenses) in sync with the root"
      bash "$ROOT/scripts/sync-legal.sh" --check
      ;;
    org-profile)
      cd "$ROOT/ops/org-profile"
      step "org-profile: policy checks"
      bash scripts/check-policy.sh
      bash scripts/check-security-pointer.sh
      ;;
    domains)
      cd "$ROOT"
      step "domains: former hostnames appear only where allowed (repo-wide)"
      # loop.urbnia.com and loop.urbnia.com/api/ are the only canonical hosts.
      # Allowed: changelog history, internal ledger records, domain policies and
      # checks, the Traefik redirect labels, and docs describing those redirects.
      if git grep --untracked -n -E 'localloop\.urbnia\.com|loop-api\.urbnia\.com' -- . \
          ':!*CHANGELOG.md' ':!ops/ledger' ':!*DOMAIN-POLICY.md' ':!*check-domains*' \
          ':!apps/site/docker-compose.yml' ':!scripts/ci-local.sh' ':!CLAUDE.md' ':!AGENTS.md' \
          ':!README.md' ':!SECURITY.md' ':!CONTRIBUTING.md' ':!docs/assets/diagrams'; then
        echo "Former hostnames found: use https://loop.urbnia.com or https://loop.urbnia.com/api/" >&2
        exit 1
      fi
      echo "former hostnames only in allowed places"
      ;;
    links)
      cd "$ROOT"
      step "links: relative links and anchors in Markdown"
      node scripts/check-links.mjs
      ;;
    reuse)
      cd "$ROOT"
      step "reuse: every file has copyright and licence information (REUSE 3.3)"
      if command -v reuse >/dev/null 2>&1; then
        reuse lint
      elif command -v uvx >/dev/null 2>&1; then
        uvx reuse lint
      else
        echo "SKIP: neither reuse nor uvx is installed (pipx install reuse, or install uv)"
      fi
      ;;
    *) echo "unknown target: $t" >&2; exit 2 ;;
  esac
done
printf '\nAll requested checks passed.\n'
