# Domain Policy

To avoid confusion and broken links, this project uses a single set of canonical domains.

## Canonical domains

- Public site / docs hub: https://localloop.urbnia.com
- Backend API: https://loop-api.urbnia.com

## Disallowed domains

Do not introduce or reference the following domains in code, docs, or tests:

- local-loop-io.github.io
- loop-protocol.org
- localloop.org
- local-loop.io
- api.local-loop.io
- local-loop.eu
- materialdna.eu

## JSON-LD / Schema namespace

All JSON-LD `@context` and schema `$id` references must live under:

- https://localloop.urbnia.com/projects/loop-protocol

If a new context is needed, add it under:

- https://localloop.urbnia.com/projects/loop-protocol/contexts/

## Enforcement

The CI workflow runs `scripts/check-domains.cjs` on every push and PR.
If a disallowed domain is detected, the build will fail.
