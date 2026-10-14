# Cycle 011 — Cache-Control no-store on privacy and metrics

## Status
DONE

## Hypothesis
Privacy notice and metrics could be cached stale

## Repos in scope
- `localloop-backend`

## Files / diff (from git)
### localloop-backend
- SHA: `6cd3b3750ba57425d1089d000ffc6296f2858523`
- Source: tag:agent-cycle-011
- Subject: fix(cache): no-store on privacy and metrics (#55)
- Diff: CHANGELOG.md                 | 3 +++; src/routes/metrics.ts        | 6 +++++-; src/routes/privacy.ts        | 6 +++++-; tests/utility.routes.test.ts | 2 ++; 4 files changed, 15 insertions(+), 2 deletions(-)

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
`medium`

## Fresh re-verify
Acceptance re-checked at skeptic remediation; see evidence/cycles/011/reverify.txt.
