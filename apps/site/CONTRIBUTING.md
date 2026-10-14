# Contributing to localLOOP Docs Hub

Thanks for your interest in helping with the localLOOP documentation hub, a
static Next.js site that presents a **lab demo only**.

The [root CONTRIBUTING.md](../../CONTRIBUTING.md) covers prerequisites, the
`scripts/ci-local.sh` gate, branches and commit style, changelogs, releases
and licensing. This file only adds site-specific guidance.

## Quick Start
```bash
bun install
bun run dev                    # development server
bun run lint && bun run typecheck
bun run build && bun run test  # static export to out/, then smoke tests
bun run test:e2e               # Playwright end-to-end tests (builds first)
```

Set `PLAYWRIGHT_BASE_URL` to run the end-to-end tests against a running nginx
image instead of the local build.

## Site Content
- Everything under `public/projects/loop-protocol/` is a generated mirror of
  the monorepo's `protocol/` tree. Don't edit it by hand. Change the source in
  `protocol/`, then run `bash scripts/aggregate-docs.sh` and commit the result
  together with the source change.
- Pages that render mirrored Markdown (for example `/contribute/` and
  `/protocol/security/`) pick up changes only after the mirror is re-synced and
  the site is rebuilt.
- Keep copy within the "lab demo only" claims policy and the allowed domains
  in `DOMAIN-POLICY.md` (`bun run check:domains`).
- Record user-visible changes under `## [Unreleased]` in `CHANGELOG.md`.

## Contact
Questions? Email dev@mycel-ai.de.
