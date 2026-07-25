# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Changelog tracking begins at 0.2.1; earlier tags predate this file.

## [Unreleased]

### Changed
- Policy check stamp cycle 059.

### Changed
- Policy check stamp cycle 055.

### Changed
- Policy check stamp cycle 051.

### Changed
- Policy check stamp cycle 047.

### Changed
- Policy check stamp cycle 043.

### Added
- Profile links to site security.txt (agent cycle 028).

## [0.2.1] - 2026-07-18

### Changed
- Removed unsupported EU-regulatory-alignment claims ("ESPR aligned", "DPP ready",
  "DIWASS/Battery Passport/PPWR ready") from the org profile README; softened
  version-pinned wording in favor of linking canonical release metadata.

### Fixed
- Hardened `scripts/check-policy.sh` with regex guards (plus self-test fixtures)
  against unsupported regulatory-alignment claims, hard-coded "current release"
  wording, and language presenting Core-DP as already shipped.
