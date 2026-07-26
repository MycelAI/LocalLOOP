# Cycle 017 — node/info short public cache (attempt)

## Status
BLOCKED

## Hypothesis
Node info is stable enough for short public cache

## Repos in scope
- `localloop-backend`

## Files / diff (from git)

## Acceptance criteria
- Cycle abandoned or failed gates; see root-cause note.

## Cross-repo contract impact
- Additive-only preferred; no contract removals without expand-then-contract.

## Deploy order
1. none

## Rollback
- Reverse deploy order: rebuild previous image/SHA for each touched service.
- For content-only (protocol/org): revert commit / redeploy prior site mirror if needed.

## Quality class
`blocked`

## Notes
Regex injection failed; route lives in federation.ts not loop.ts

## Root cause (skeptic remediation)
Bulk/padding or insufficient per-cycle triple-verify evidence; not DONE under criterion 4.
