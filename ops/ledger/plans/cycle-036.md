# Cycle 036 — Cycle 036 automation item: docs: protocol readme anchor (#18)

## Status
DONE

## Hypothesis
Bulk automation cycle: intended as estate hygiene stamp or regression guard. Not a fresh explore→select highest-value defect (see Deviations).

## Repos in scope
- `loop-protocol`

## Files / diff (from git)
### loop-protocol
- SHA: `f7a4915dc913fd04cd596b2788e42ab69579c344`
- Source: tag:agent-cycle-036
- Subject: docs: protocol readme anchor (#18)
- Diff: CHANGELOG.md               | 3 +++; README.md                  | 2 ++; package.json               | 5 +++--; scripts/check-cycle-036.js | 8 ++++++++; 4 files changed, 16 insertions(+), 2 deletions(-)

## Acceptance criteria
- Change is present at recorded SHA/tag for each in-scope repo.
- Repo native tests for the change path pass (or cycle-specific test exists).
- Live estate remains healthy after deploy (or deploy=none documented).

## Cross-repo contract impact
- Additive-only preferred; no contract removals without expand-then-contract.
- No API/schema contract change expected (hygiene/stamp cycle).

## Deploy order
1. see per-repo tags

## Rollback
- Reverse deploy order: rebuild previous image/SHA for each touched service.
- For content-only (protocol/org): revert commit / redeploy prior site mirror if needed.

## Quality class
`low-padding`
