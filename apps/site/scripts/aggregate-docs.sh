#!/usr/bin/env bash
set -euo pipefail

ORG="${DOCS_ORG:-local-loop-io}"
REPOS_INPUT="${DOCS_REPOS:-loop-protocol}"

IFS=',' read -r -a REPOS <<< "$REPOS_INPUT"

ROOT_DIR="$(pwd)"
WORK_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "$WORK_DIR"
}
trap cleanup EXIT

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

publish_versioned_schema_aliases() {
  local schemas_dir="$1"
  local v011_dir="$schemas_dir/v0.1.1"
  local v020_dir="$schemas_dir/v0.2.0"
  local v1_dir="$schemas_dir/v1"

  rm -rf "$v011_dir" "$v020_dir" "$v1_dir"
  mkdir -p "$v011_dir" "$v020_dir" "$v1_dir"

  for schema in material-dna product-dna offer match transfer material-status handshake loopcoin loopsignal node-info transaction; do
    sync_file "$schemas_dir/${schema}.schema.json" "$v020_dir/${schema}.schema.json"
  done

  for schema in material-dna offer match transfer material-status handshake; do
    sync_file "$schemas_dir/${schema}.schema.json" "$v011_dir/${schema}.schema.json"
  done

  for schema in loopcoin loopsignal node-info transaction; do
    sync_file "$schemas_dir/${schema}.schema.json" "$v1_dir/${schema}.schema.json"
  done
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

  candidate="$ROOT_DIR/../$repo_name"
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

  if SRC="$(resolve_local_source "$repo_trimmed")"; then
    echo "Syncing $ORG/$repo_trimmed from local source: $SRC"
  else
    echo "Syncing $ORG/$repo_trimmed from GitHub"
    clone_log="$WORK_DIR/${repo_trimmed}.clone.log"
    if [[ -n "${DOCS_SYNC_TOKEN:-}" ]]; then
      clone_url="https://x-access-token:${DOCS_SYNC_TOKEN}@github.com/${ORG}/${repo_trimmed}.git"
      if ! GIT_TERMINAL_PROMPT=0 git clone --depth 1 "$clone_url" "$WORK_DIR/$repo_trimmed" >"$clone_log" 2>&1; then
        echo "Failed to clone $ORG/$repo_trimmed using DOCS_SYNC_TOKEN" >&2
        exit 1
      fi
    else
      if ! GIT_TERMINAL_PROMPT=0 git clone --depth 1 "https://github.com/${ORG}/${repo_trimmed}.git" "$WORK_DIR/$repo_trimmed" >"$clone_log" 2>&1; then
        echo "Skipping $ORG/$repo_trimmed: DOCS_SYNC_TOKEN not set or repo inaccessible." >&2
        continue
      fi
    fi

    SRC="$WORK_DIR/$repo_trimmed"
  fi
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
  sync_file "$SRC/PROJECT_STRUCTURE.md" "$DEST/PROJECT_STRUCTURE.md"
  sync_file "$SRC/openapi.json" "$DEST/openapi.json"

  sync_dir "$SRC/docs" "$DEST/docs"
  sync_dir "$SRC/contexts" "$DEST/contexts"
  sync_dir "$SRC/schemas" "$DEST/schemas"
  sync_dir "$SRC/examples" "$DEST/examples"
  sync_dir "$SRC/rfcs" "$DEST/rfcs"
  publish_versioned_schema_aliases "$DEST/schemas"

done

echo "Documentation sync complete."
