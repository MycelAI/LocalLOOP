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

# Non-canonical domains banned by loop-protocol/DOMAIN-POLICY.md (keep in sync
# with loop-protocol/scripts/check-domains.sh). Only api.local-loop.io was
# checked before; the org profile is the most-viewed page in the estate.
banned_domains=(
  "local-loop-io.github.io"
  "loop-protocol.org"
  "localloop.org"
  "local-loop.io"
  "api.local-loop.io"
  "local-loop.eu"
  "materialdna.eu"
)
banned_pattern=$(IFS='|'; echo "${banned_domains[*]//./\\.}")

if ! printf '%s\n' 'api.local-loop.io' | grep -Eq "$banned_pattern"; then
  echo "Non-canonical domain pattern no longer matches its literal fixture." >&2
  exit 2
fi
if ! printf '%s\n' 'local-loop-io.github.io' | grep -Eq "$banned_pattern"; then
  echo "Non-canonical domain pattern no longer matches local-loop-io.github.io." >&2
  exit 2
fi

if grep -n '/api/health' AGENTS.md CLAUDE.md "${content_files[@]}"; then
  echo "Found stale /api/health reference; use /health." >&2
  fail=1
fi

if grep -n -E "$banned_pattern" AGENTS.md CLAUDE.md "${content_files[@]}" | grep -Evi 'not.*exist|does[[:space:]]+not[[:space:]]+exist'; then
  echo "Found a non-canonical domain (see loop-protocol/DOMAIN-POLICY.md)." >&2
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

if [ "$fail" -eq 0 ]; then
  echo "policy check ok"
fi

exit "$fail"
