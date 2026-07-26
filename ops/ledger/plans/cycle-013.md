# Cycle 013 — Dockerfile COPY --chown for faster rebuilds

## Status
DONE

## Hypothesis
Full-tree chown after src copy dominated image build time

## Repos in scope
- `localloop-backend`

## Files / diff (from git)
### localloop-backend
- SHA: `b1467bca9b242ad63947155788d61d2e5cd8cc1a`
- Source: tag:agent-cycle-013
- Subject: perf(docker): COPY --chown src instead of full-tree chown after (#57)
- Diff: CHANGELOG.md                   |  3 +++; Dockerfile                     |  6 +++---; tests/dockerfile.chown.test.ts | 13 +++++++++++++; 3 files changed, 19 insertions(+), 3 deletions(-)

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
