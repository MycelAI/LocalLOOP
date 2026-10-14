# Domain Policy

To avoid confusion and broken links, this project uses a single set of canonical domains.

## Canonical domains

- Home (site / docs hub): https://loop.urbnia.com
- Backend API: https://loop.urbnia.com/api/ (same origin; the shared Traefik
  routes `/api/*` to the API container)

Former hostnames, kept only as permanent (308) redirects at Traefik:

- https://localloop.urbnia.com/<path> → https://loop.urbnia.com/<path>
- https://loop-api.urbnia.com/<path> → https://loop.urbnia.com/api/<path>

Nothing else may reference the former hostnames: the protocol namespace,
JSON-LD contexts, schema `$id`s, examples, code, tests and docs all use
`loop.urbnia.com`. The only permitted occurrences are the Traefik redirect
labels (`apps/site/docker-compose.yml`), the domain policies and checks
themselves, and changelog history.

## Disallowed domains

Do not introduce or reference the following domains in code, docs, or tests:

- local-loop-io.github.io
- loop-protocol.org
- localloop.org
- local-loop.io
- api.local-loop.io
- local-loop.eu
- materialdna.eu
- localloop.urbnia.com and loop-api.urbnia.com (former hostnames; redirect only)

## JSON-LD / Schema namespace

All JSON-LD `@context` and schema `$id` references must live under:

- https://loop.urbnia.com/projects/loop-protocol

If a new context is needed, add it under:

- https://loop.urbnia.com/projects/loop-protocol/contexts/

## Enforcement

The CI workflow runs `scripts/check-domains.cjs` on every push and PR.
If a disallowed domain is detected, the build will fail.
