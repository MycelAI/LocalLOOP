# Cycle 006 — Metrics always emit known keys at zero

## Status
DONE

## Hypothesis
Empty metrics object confused dashboards on quiet nodes

## Repos in scope
- `localloop-backend`

## Files / diff (from git)
### localloop-backend
- SHA: `7ee4fe1d4baca6c9fe601fc200c5c2c50ba65b92`
- Source: tag:agent-cycle-006
- Subject: feat(metrics): always emit known keys at zero (#50)
- Diff: CHANGELOG.md                 |  4 ++++; src/metrics.ts               | 19 +++++++++++++++++--; tests/utility.routes.test.ts |  2 ++; 3 files changed, 23 insertions(+), 2 deletions(-)

## Acceptance criteria
- Change is present at recorded SHA/tag for each in-scope repo.
- Repo native tests for the change path pass (or cycle-specific test exists).
- Live estate remains healthy after deploy (or deploy=none documented).

## Cross-repo contract impact
- Additive-only preferred; no contract removals without expand-then-contract.

## Deploy order
1. backend api only

## Rollback
- Reverse deploy order: rebuild previous image/SHA for each touched service.
- For content-only (protocol/org): revert commit / redeploy prior site mirror if needed.

## Quality class
`high`
