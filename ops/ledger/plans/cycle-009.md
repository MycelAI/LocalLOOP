# Cycle 009 — CORS allows Idempotency-Key header

## Status
DONE

## Hypothesis
Browser write retries would fail preflight without Idempotency-Key allowed

## Repos in scope
- `localloop-backend`

## Files / diff (from git)
### localloop-backend
- SHA: `f74f7156fb2074bee246d12f01e603588c8fa742`
- Source: tag:agent-cycle-009
- Subject: fix(cors): allow Idempotency-Key request header (#53)
- Diff: CHANGELOG.md       |  4 ++++; src/server.ts      |  2 +-; tests/cors.test.ts | 11 +++++++++++; 3 files changed, 16 insertions(+), 1 deletion(-)

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
