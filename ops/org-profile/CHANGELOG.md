# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Changelog tracking began at 0.2.1. The 0.2.0 entry was reconstructed later
from the git history and tag; this tree is historical (see `README.md`).

## [Unreleased]

### Changed
- Documentation: `README.md` opens with a note that this tree is the
  historical source of the archived organization profile; licensing metadata
  (SPDX headers, REUSE) and the code of conduct updated for the monorepo.
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

## [0.2.0] - 2026-05-26

> Reconstructed on 2026-10-14 from the commit history up to the `v0.2.0` tag
> (tag message: "Release v0.2.0"); there was no changelog at the time. It
> covers everything since the profile was created on 2025-12-19.

### Added
- Organization profile `profile/README.md`, repository `README.md`, MIT
  `LICENSE` and code of conduct.
- "How to cite" sections in both READMEs.
- Contributor context file (`AGENTS.md`) with organization domains and
  runbooks.
- Live endpoints listed in the profile; `scripts/check-policy.sh` and a policy
  check workflow guarding the lab-only posture.

### Changed
- Rebranded to "localLOOP"; JSON-LD context references prefer v0.2.0 (v0.1.1
  stays valid) and API paths use `/api/v1/`.
- Profile README fully rewritten with a concept table and repository and
  navigation tables.
- Personal contact details replaced with the organization identity
  (`dev@mycel-ai.de`).
- Code of conduct upgraded to Contributor Covenant 3.0.

### Fixed
- Non-ASCII hyphen in the profile README.

[Unreleased]: https://github.com/MycelAI/LocalLOOP/compare/org-profile/v0.2.1...HEAD
[0.2.1]: https://github.com/local-loop-io/.github/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/local-loop-io/.github/releases/tag/v0.2.0
