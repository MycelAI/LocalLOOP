#!/usr/bin/env bash
# SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
# SPDX-License-Identifier: MIT

# Writes a CycloneDX (JSON) SBOM for a release into dist/sbom/ (git-ignored).
# Usage: scripts/release-sbom.sh <backend|site|protocol>...   (no argument: all three)
#
# Uses @cyclonedx/cyclonedx-npm, which reads the installed node_modules tree
# through `npm ls`; that works for the bun-installed trees as well as for
# protocol/ (npm). The tree's dependencies must be installed from its lockfile
# first (`bun install --frozen-lockfile` / `npm ci`); the script does that when
# node_modules is missing.
#   backend, site: production dependencies only (what the images ship; for the
#                  site, a superset of what the static export bundles).
#   protocol:      no runtime dependencies; its validation tooling (dev
#                  dependencies) is listed instead.
# Attach the output to the release together with LICENSE, NOTICE and
# THIRD_PARTY_NOTICES.md.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NPX="${NPX:-$(command -v /home/alphin/.volta/bin/npx || command -v npx)}"
NPM="${NPM:-$(command -v /home/alphin/.volta/bin/npm || command -v npm)}"
CYCLONEDX_NPM="${CYCLONEDX_NPM:-@cyclonedx/cyclonedx-npm@6.0.1}"
OUT_DIR="$ROOT/dist/sbom"
targets=("$@")
[[ ${#targets[@]} -eq 0 ]] && targets=(backend site protocol)

mkdir -p "$OUT_DIR"

for t in "${targets[@]}"; do
  case "$t" in
    backend|site)
      dir="$ROOT/apps/$t"
      [[ -d "$dir/node_modules" ]] || (cd "$dir" && bun install --frozen-lockfile)
      omit=(--omit dev)
      ;;
    protocol)
      dir="$ROOT/protocol"
      [[ -d "$dir/node_modules" ]] || (cd "$dir" && "$NPM" ci)
      omit=()
      ;;
    *) echo "unknown target: $t (expected backend, site or protocol)" >&2; exit 2 ;;
  esac
  version="$(node -p "require('$dir/package.json').version")"
  out="$OUT_DIR/localloop-$t-$version.cdx.json"
  (cd "$dir" && "$NPX" --yes "$CYCLONEDX_NPM" "${omit[@]}" \
    --spec-version 1.6 --output-reproducible \
    --output-format JSON --output-file "$out")
  count="$(node -p "(require('$out').components || []).length")"
  echo "$t $version: $count components -> ${out#"$ROOT"/}"
done
