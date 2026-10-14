# Domain Policy

This backend serves the localLOOP lab demo and public APIs.

## Canonical domains

- Home (site / docs hub): https://loop.urbnia.com
- Backend API: https://loop.urbnia.com/api/ (same origin; the site's nginx
  proxies `/api/*` to the API container)

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

## Enforcement

The CI workflow runs `scripts/check-domains.sh` on every push and PR.
