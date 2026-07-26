# Cycle 010 — Health includes package version

## Status
DONE

## Hypothesis
Ops could not tell which package version was live from /health alone

## Repos in scope
- `localloop-backend`

## Files / diff (from git)
### localloop-backend
- SHA: `c8736ebcf44c395184cd3554b2d7f0e8cfa33386`
- Source: tag:agent-cycle-010
- Subject: feat(health): include package version in /health (#54)
- Diff: CHANGELOG.md                |  3 +++; src/routes/health.ts        | 15 +++++++++++++++; tests/health.routes.test.ts |  2 ++; 3 files changed, 20 insertions(+)

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
