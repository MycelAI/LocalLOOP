# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Changelog tracking begins at 0.2.1; earlier tags predate this file.

## [Unreleased]

### Changed
- `scripts/check-policy.sh` bans all seven non-canonical domains listed in
  `loop-protocol/DOMAIN-POLICY.md` (it only checked `api.local-loop.io`; the
  retired GitHub Pages host `local-loop-io.github.io` was never guarded).
- Removed the 15 per-cycle `scripts/check-cycle-NNN.sh` guards (cycles 043-099).
  All 15 were byte-identical apart from the cycle number and only asserted that
  `profile/README.md` exists and mentions "lab" or "localLOOP" — already covered
  far more strictly by `check-policy.sh`, which enforces the full lab-only
  posture strapline set and the non-canonical-domain and regulatory-claim bans.
- `policy-check.yml` uses `actions/checkout@v7`, matching the sibling repos.

### Added
- `check-security-pointer.sh` now runs in the policy-check workflow; previously
  it existed but was never executed by CI.
- Profile links to site security.txt.
- Repository table lists this `.github` repository itself.

### Fixed
- An internal agent-cycle marker ("(agent-cycle-028)") was rendered on the
  public org profile; `README.md` listed only two of the repository's files;
  self-citations carried an "Accessed" date and a stale year.

## [0.2.1] - 2026-07-18

### Changed
- Removed unsupported EU-regulatory-alignment claims ("ESPR aligned", "DPP ready",
  "DIWASS/Battery Passport/PPWR ready") from the org profile README; softened
  version-pinned wording in favor of linking canonical release metadata.

### Fixed
- Hardened `scripts/check-policy.sh` with regex guards (plus self-test fixtures)
  against unsupported regulatory-alignment claims, hard-coded "current release"
  wording, and language presenting Core-DP as already shipped.
