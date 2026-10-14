#!/usr/bin/env bash
# SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
# SPDX-License-Identifier: MIT

set -euo pipefail

REPOS_INPUT="${DOCS_REPOS:-loop-protocol}"

IFS=',' read -r -a REPOS <<< "$REPOS_INPUT"

# apps/site, regardless of the caller's working directory
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MONOREPO_ROOT="$(cd "$ROOT_DIR/../.." && pwd)"

sync_file() {
  local src="$1"
  local dest="$2"
  if [[ -f "$src" ]]; then
    mkdir -p "$(dirname "$dest")"
    cp "$src" "$dest"
  fi
}

sync_dir() {
  local src="$1"
  local dest="$2"
  if [[ -d "$src" ]]; then
    rm -rf "$dest"
    mkdir -p "$dest"
    cp -R "$src"/. "$dest/"
  fi
}

# Source schemas live at /schemas/v0.2.0/ (their canonical $id). When we copy them
# into another versioned alias directory, rewrite that path segment so each alias
# self-describes the version it is actually served under (previously the v0.1.1
# and v1 aliases inherited the v0.2.0 $id, which never resolved).
SOURCE_SCHEMA_VERSION="v0.2.0"

rewrite_schema_id_version() {
  local dir="$1"
  local target_version="$2"
  if [[ "$target_version" == "$SOURCE_SCHEMA_VERSION" ]]; then
    return 0
  fi
  find "$dir" -name '*.schema.json' -type f -exec \
    sed -i "s#/projects/loop-protocol/schemas/${SOURCE_SCHEMA_VERSION}/#/projects/loop-protocol/schemas/${target_version}/#g" {} +
}

publish_versioned_schema_aliases() {
  local schemas_dir="$1"
  local v011_dir="$schemas_dir/v0.1.1"
  local v020_dir="$schemas_dir/v0.2.0"
  local v1_dir="$schemas_dir/v1"

  rm -rf "$v011_dir" "$v020_dir" "$v1_dir"
  mkdir -p "$v011_dir" "$v020_dir" "$v1_dir"

  for schema in material-dna product-dna offer match transfer material-status handshake federate-accepted loopcoin loopsignal node-info transaction; do
    sync_file "$schemas_dir/${schema}.schema.json" "$v020_dir/${schema}.schema.json"
  done

  for schema in material-dna offer match transfer material-status handshake; do
    sync_file "$schemas_dir/${schema}.schema.json" "$v011_dir/${schema}.schema.json"
  done
  rewrite_schema_id_version "$v011_dir" "v0.1.1"

  for schema in loopcoin loopsignal node-info transaction; do
    sync_file "$schemas_dir/${schema}.schema.json" "$v1_dir/${schema}.schema.json"
  done
  rewrite_schema_id_version "$v1_dir" "v1"
}

# Mirrored repo name -> path of its source tree inside the LocalLOOP monorepo.
# The mirror keeps its historical public URL (/projects/loop-protocol/...).
monorepo_path() {
  case "$1" in
    loop-protocol) printf '%s\n' "$MONOREPO_ROOT/protocol" ;;
    *) printf '%s\n' "$MONOREPO_ROOT/$1" ;;
  esac
}

resolve_local_source() {
  local repo_name="$1"
  local configured_root="${DOCS_LOCAL_ROOT:-}"
  local candidate=""

  if [[ -n "$configured_root" ]]; then
    candidate="${configured_root%/}/$repo_name"
    if [[ -d "$candidate" && -f "$candidate/README.md" ]]; then
      printf '%s\n' "$candidate"
      return 0
    fi
  fi

  candidate="$(monorepo_path "$repo_name")"
  if [[ -d "$candidate" && -f "$candidate/README.md" ]]; then
    printf '%s\n' "$candidate"
    return 0
  fi

  return 1
}

for repo in "${REPOS[@]}"; do
  repo_trimmed="$(echo "$repo" | xargs)"
  if [[ -z "$repo_trimmed" ]]; then
    continue
  fi

  if ! SRC="$(resolve_local_source "$repo_trimmed")"; then
    echo "Cannot find the source for $repo_trimmed in the monorepo ($(monorepo_path "$repo_trimmed")) or DOCS_LOCAL_ROOT." >&2
    exit 1
  fi
  echo "Syncing $repo_trimmed from $SRC"
  DEST="$ROOT_DIR/public/projects/$repo_trimmed"
  mkdir -p "$DEST"

  sync_file "$SRC/README.md" "$DEST/README.md"
  sync_file "$SRC/SPECIFICATION.md" "$DEST/SPECIFICATION.md"
  sync_file "$SRC/CHANGELOG.md" "$DEST/CHANGELOG.md"
  sync_file "$SRC/CONTRIBUTING.md" "$DEST/CONTRIBUTING.md"
  sync_file "$SRC/CODE_OF_CONDUCT.md" "$DEST/CODE_OF_CONDUCT.md"
  sync_file "$SRC/SECURITY.md" "$DEST/SECURITY.md"
  sync_file "$SRC/DOMAIN-POLICY.md" "$DEST/DOMAIN-POLICY.md"
  sync_file "$SRC/LICENSE" "$DEST/LICENSE"
  # LICENSE points at LICENSES/ for the full texts, so ship them together.
  sync_dir "$SRC/LICENSES" "$DEST/LICENSES"
  sync_file "$SRC/PROJECT_STRUCTURE.md" "$DEST/PROJECT_STRUCTURE.md"
  sync_file "$SRC/openapi.json" "$DEST/openapi.json"

  sync_dir "$SRC/docs" "$DEST/docs"
  sync_dir "$SRC/contexts" "$DEST/contexts"
  sync_dir "$SRC/schemas" "$DEST/schemas"
  sync_dir "$SRC/examples" "$DEST/examples"
  sync_dir "$SRC/rfcs" "$DEST/rfcs"
  sync_dir "$SRC/profiles" "$DEST/profiles"
  publish_versioned_schema_aliases "$DEST/schemas"

done

echo "Documentation sync complete."
