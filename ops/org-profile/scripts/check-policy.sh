#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

fail=0
content_files=(README.md profile/README.md)

regulatory_claim_pattern='(EU[[:space:][:punct:]]*DPP|ESPR|DIWASS|Battery[[:space:][:punct:]]*Passport|PPWR)[[:space:][:punct:]]*(aligned|ready)'
current_release_pattern='current[[:space:][:punct:]]*(protocol[[:space:][:punct:]]*)?release[[:space:][:punct:]]*v[0-9]+(\.[0-9]+)*|current[[:space:][:punct:]]*v[0-9]+(\.[0-9]+)*[[:space:][:punct:]]*release|release[[:space:][:punct:]]*v[0-9]+(\.[0-9]+)*'
core_dp_shipping_pattern='core[[:space:][:punct:]]*dp[[:space:][:punct:]]*((has|have|is|are|was|were|will([[:space:]]+be)?)[[:space:][:punct:]]*)?ship(ped|s)?|core[[:space:][:punct:]]*dp[[:space:][:punct:]]*((has|have|is|are|was|were)[[:space:][:punct:]]*)?(released|production[[:space:][:punct:]]*ready|conformant|compliant|certified|deployed)'

assert_rejected_fixture() {
  local pattern="$1" fixture="$2"
  if ! printf '%s\n' "$fixture" | grep -Eiq "$pattern"; then
    echo "Policy pattern no longer rejects fixture: $fixture" >&2
    exit 2
  fi
}

assert_rejected_fixture "$regulatory_claim_pattern" 'EU DPP/ESPR aligned'
assert_rejected_fixture "$regulatory_claim_pattern" 'EU DPP aligned'
assert_rejected_fixture "$regulatory_claim_pattern" 'DIWASS ready'
assert_rejected_fixture "$regulatory_claim_pattern" 'Battery Passport aligned'
assert_rejected_fixture "$regulatory_claim_pattern" 'PPWR ready'
assert_rejected_fixture "$current_release_pattern" 'Current release v1.0'
assert_rejected_fixture "$current_release_pattern" 'Current v1.0 release'
assert_rejected_fixture "$current_release_pattern" 'Release v1.0'
assert_rejected_fixture "$core_dp_shipping_pattern" 'Core-DP has shipped'
assert_rejected_fixture "$core_dp_shipping_pattern" 'Core-DP is production ready'
assert_rejected_fixture "$core_dp_shipping_pattern" 'Core-DP will ship'

if ! printf '%s\n' 'api.local-loop.io' | grep -q 'api\.local-loop\.io'; then
  echo "Non-canonical domain pattern no longer matches its literal fixture." >&2
  exit 2
fi

if grep -n '/api/health' AGENTS.md CLAUDE.md "${content_files[@]}"; then
  echo "Found stale /api/health reference; use /health." >&2
  fail=1
fi

if grep -n 'api\.local-loop\.io' AGENTS.md CLAUDE.md "${content_files[@]}" | grep -Evi 'not.*exist|does[[:space:]]+not[[:space:]]+exist'; then
  echo "Found non-canonical api.local-loop.io wording." >&2
  fail=1
fi

if grep -n -Ei "$regulatory_claim_pattern" "${content_files[@]}"; then
  echo "Found unsupported regulatory ready/aligned strapline." >&2
  fail=1
fi

if grep -n -Ei "$current_release_pattern" "${content_files[@]}"; then
  echo "Found hard-coded current release wording; link canonical release metadata instead." >&2
  fail=1
fi

for required_posture in \
  "Early-stage, low-TRL" \
  "Lab demo only" \
  "No public pilots or production deployments"; do
  if ! grep -q -F "$required_posture" profile/README.md; then
    echo "Missing required lab-only posture: $required_posture" >&2
    fail=1
  fi
done

if grep -n -Ei "$core_dp_shipping_pattern" "${content_files[@]}"; then
  echo "Found Core-DP wording that presents it as shipped." >&2
  fail=1
fi

exit "$fail"
