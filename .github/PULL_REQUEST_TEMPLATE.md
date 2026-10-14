<!--
Thanks for contributing to localLOOP. See CONTRIBUTING.md for the full guide.
Security fixes for undisclosed vulnerabilities: coordinate via dev@mycel-ai.de first (SECURITY.md).
-->

## Summary

<!-- What does this change and why? Link related issues (Fixes #123) or RFCs. -->

## Tree(s) touched

- [ ] `apps/backend`
- [ ] `apps/site`
- [ ] `protocol`
- [ ] `ops/org-profile`
- [ ] `ops/ledger`, `scripts/`, `.github/` or root files

## How was this tested?

<!-- Commands you ran and their results; screenshots for visible site changes. -->

## Checklist

- [ ] `bash scripts/ci-local.sh` (or the targets for the trees touched) passes locally. GitHub Actions is disabled, so this is the gate.
- [ ] Tests added or updated where behaviour changed. Backend tests were run against a scratch database (for example `localloop_test`), **never** the default `.env`.
- [ ] If `protocol/` changed: the site mirror was re-synced (`bash apps/site/scripts/aggregate-docs.sh`), schemas were synced to the backend (`bun run sync:schemas`) where relevant, `bun run check:conformance` passes, and `git status --short` shows no unexpected deletions.
- [ ] `CHANGELOG.md` `## [Unreleased]` updated in each affected tree (or not user-visible).
- [ ] No secrets, `.env` files, dumps or `apps/backend/data/` content included.
- [ ] Outward-facing wording stays "lab demo only": no claims of pilots, deployments, production readiness or compliance.
- [ ] Commit messages follow Conventional Commits and contain no tool attribution or co-author trailers for tools.
- [ ] Contributed under the licence of the area touched (inbound = outbound, see CONTRIBUTING.md).
