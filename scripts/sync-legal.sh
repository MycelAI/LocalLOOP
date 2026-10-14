#!/usr/bin/env bash
# SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
# SPDX-License-Identifier: MIT

# Copies the root legal files into the places that ship them:
#   apps/site/public/licenses/  -> published by the site under /licenses/
#                                  (fonts, icons and the OSM basemap are served
#                                  publicly, so their licence texts must be too)
#   apps/backend/               -> copied into the backend image by its Dockerfile
#   protocol/LICENSES/          -> shipped with the protocol tree and its site mirror
# The root files are the source of truth; edit those, then run this script.
# Usage: scripts/sync-legal.sh [--check]   (--check: exit 1 on drift, change nothing)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SITE_LEGAL="$ROOT/apps/site/public/licenses"
check=0
[[ "${1:-}" == "--check" ]] && check=1

# Licence texts published with the site: everything in LICENSES/ except the
# internal-records notice, which covers nothing the site serves.
site_texts=()
for f in "$ROOT"/LICENSES/*.txt; do
  [[ "$(basename "$f")" == "LicenseRef-Mycel-Proprietary.txt" ]] && continue
  site_texts+=("$(basename "$f")")
done

# "source destination" pairs, relative to the repository root.
pairs=(
  "LICENSE apps/site/public/licenses/LICENSE.txt"
  "NOTICE apps/site/public/licenses/NOTICE.txt"
  "THIRD_PARTY_NOTICES.md apps/site/public/licenses/THIRD_PARTY_NOTICES.md"
  "NOTICE apps/backend/NOTICE"
  "THIRD_PARTY_NOTICES.md apps/backend/THIRD_PARTY_NOTICES.md"
  "LICENSES/CC-BY-SA-4.0.txt protocol/LICENSES/CC-BY-SA-4.0.txt"
  "LICENSES/LicenseRef-Mycel-Brand.txt protocol/LICENSES/LicenseRef-Mycel-Brand.txt"
)
for t in "${site_texts[@]}"; do
  pairs+=("LICENSES/$t apps/site/public/licenses/LICENSES/$t")
done

drift=0
for pair in "${pairs[@]}"; do
  read -r src dest <<<"$pair"
  if cmp -s "$ROOT/$src" "$ROOT/$dest"; then
    continue
  fi
  if (( check )); then
    echo "legal copy out of date: $dest (source: $src)" >&2
    drift=1
  else
    mkdir -p "$(dirname "$ROOT/$dest")"
    cp "$ROOT/$src" "$ROOT/$dest"
    echo "updated $dest"
  fi
done

# Texts that are no longer in LICENSES/ must not linger in the site copy.
if [[ -d "$SITE_LEGAL/LICENSES" ]]; then
  for f in "$SITE_LEGAL"/LICENSES/*; do
    [[ -e "$f" ]] || continue
    name="$(basename "$f")"
    if [[ ! " ${site_texts[*]} " == *" $name "* ]]; then
      if (( check )); then
        echo "stale legal copy: ${f#"$ROOT"/}" >&2
        drift=1
      else
        rm "$f"
        echo "removed ${f#"$ROOT"/}"
      fi
    fi
  done
fi

if (( check )); then
  if (( drift )); then
    echo "Run scripts/sync-legal.sh to refresh the copies." >&2
    exit 1
  fi
  echo "legal copies in sync"
fi
