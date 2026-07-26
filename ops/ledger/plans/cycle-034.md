# Cycle 034 — feat(site): change-password well-known (#79)

## Status
DONE

## Hypothesis
Change selected in automated batch from prior residual/queue: feat(site): change-password well-known (#79)

## Repos in scope
- `localloop-site`

## Files / diff (from git)
### localloop-site
- SHA: `9d05f25df2a22b1c19c745e4e5c2fd272d0947f4`
- Source: tag:agent-cycle-034
- Subject: feat(site): change-password well-known (#79)
- Diff: CHANGELOG.md                       | 3 +++; public/.well-known/change-password | 1 +; tests/smoke.test.cjs               | 5 +++++; 3 files changed, 9 insertions(+)

## Acceptance criteria
- Change is present at recorded SHA/tag for each in-scope repo.
- Repo native tests for the change path pass (or cycle-specific test exists).
- Live estate remains healthy after deploy (or deploy=none documented).

## Cross-repo contract impact
- Additive-only preferred; no contract removals without expand-then-contract.

## Deploy order
1. see per-repo tags

## Rollback
- Reverse deploy order: rebuild previous image/SHA for each touched service.
- For content-only (protocol/org): revert commit / redeploy prior site mirror if needed.

## Quality class
`medium`
