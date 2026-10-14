# Cycle 002 — Baseline nginx security headers on static site

## Status
DONE

## Hypothesis
Live site responses lacked nosniff/frame-options/referrer/permissions headers

## Repos in scope
- `localloop-site`

## Files / diff (from git)
### localloop-site
- SHA: `4d1d92ae964a130908b1a9003777be6913e906eb`
- Source: tag:agent-cycle-002
- Subject: fix(security): nginx security headers (agent-cycle-002) (#73)
- Diff: CHANGELOG.md                               | 26 +++++++++-; nginx.conf                                 | 15 ++++++; package.json                               |  2 +-; public/assets/js/demo-city.js              | 23 +++++++--; public/projects/loop-protocol/openapi.json | 82 +++++++++++++++++++++++++++++-; tests/e2e/demo-city.spec.ts                | 36 ++++++++++++-; tests/smoke.test.cjs                       | 15 ++++++; 7 files changed, 191 insertions(+), 8 deletions(-)

## Acceptance criteria
- Change is present at recorded SHA/tag for each in-scope repo.
- Repo native tests for the change path pass (or cycle-specific test exists).
- Live estate remains healthy after deploy (or deploy=none documented).

## Cross-repo contract impact
- Additive-only preferred; no contract removals without expand-then-contract.

## Deploy order
1. site only

## Rollback
- Reverse deploy order: rebuild previous image/SHA for each touched service.
- For content-only (protocol/org): revert commit / redeploy prior site mirror if needed.

## Quality class
`high`

## Fresh re-verify
Acceptance re-checked at skeptic remediation; see evidence/cycles/002/reverify.txt.
