# Cycle 020 — robots.txt with sitemap pointer

## Status
DONE

## Hypothesis
Crawlers lacked explicit allow + sitemap

## Repos in scope
- `localloop-site`

## Files / diff (from git)
### localloop-site
- SHA: `e7ce5356596bdd109f09de31fc4e1c20a1d35704`
- Source: tag:agent-cycle-020
- Subject: feat(seo): add robots.txt (#75)
- Diff: CHANGELOG.md         | 3 +++; public/robots.txt    | 1 -; tests/smoke.test.cjs | 7 +++++++; 3 files changed, 10 insertions(+), 1 deletion(-)

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
`medium`
