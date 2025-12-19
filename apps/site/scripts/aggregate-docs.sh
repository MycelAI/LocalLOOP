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

for repo in "${REPOS[@]}"; do
  repo_trimmed="$(echo "$repo" | xargs)"
  if [[ -z "$repo_trimmed" ]]; then
    continue
  fi

  echo "Syncing $ORG/$repo_trimmed"
  git clone --depth 1 "https://github.com/${ORG}/${repo_trimmed}.git" "$WORK_DIR/$repo_trimmed" >/dev/null 2>&1 || {
    echo "Failed to clone $ORG/$repo_trimmed" >&2
    exit 1
  }

  SRC="$WORK_DIR/$repo_trimmed"
  DEST="$ROOT_DIR/projects/$repo_trimmed"
  mkdir -p "$DEST"

  sync_file "$SRC/README.md" "$DEST/README.md"
  sync_file "$SRC/SPECIFICATION.md" "$DEST/SPECIFICATION.md"
  sync_file "$SRC/CHANGELOG.md" "$DEST/CHANGELOG.md"
  sync_file "$SRC/CONTRIBUTING.md" "$DEST/CONTRIBUTING.md"
  sync_file "$SRC/CODE_OF_CONDUCT.md" "$DEST/CODE_OF_CONDUCT.md"
  sync_file "$SRC/SECURITY.md" "$DEST/SECURITY.md"
  sync_file "$SRC/LICENSE" "$DEST/LICENSE"
  sync_file "$SRC/PROJECT_STRUCTURE.md" "$DEST/PROJECT_STRUCTURE.md"

  sync_dir "$SRC/docs" "$DEST/docs"
  sync_dir "$SRC/schemas" "$DEST/schemas"
  sync_dir "$SRC/examples" "$DEST/examples"
  sync_dir "$SRC/rfcs" "$DEST/rfcs"

done

echo "Documentation sync complete."
