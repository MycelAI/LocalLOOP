# Cycle 028 — docs(profile): link security.txt (#8)

## Status
DONE

## Hypothesis
Change selected in automated batch from prior residual/queue: docs(profile): link security.txt (#8)

## Repos in scope
- `org-github-profile`

## Files / diff (from git)
### org-github-profile
- SHA: `0e6d70bfd6f4155c74201783a4fa3b47cc71bdc9`
- Source: tag:agent-cycle-028
- Subject: docs(profile): link security.txt (#8)
- Diff: CHANGELOG.md                      | 3 +++; profile/README.md                 | 4 ++++; scripts/check-security-pointer.sh | 4 ++++; 3 files changed, 11 insertions(+)

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

## Fresh re-verify
Acceptance re-checked at skeptic remediation; see evidence/cycles/028/reverify.txt.
