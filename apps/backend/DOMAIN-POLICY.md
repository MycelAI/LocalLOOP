# Domain Policy

This backend serves the localLOOP lab demo and public APIs.

## Canonical domains

- Home (site / docs hub): https://loop.urbnia.com
- Backend API: https://loop.urbnia.com/api/ (same origin; the site's nginx
  proxies `/api/*` to the API container)

Former hostnames, kept only as permanent (308) redirects at Traefik:

- https://localloop.urbnia.com/<path> → https://loop.urbnia.com/<path>
- https://loop-api.urbnia.com/<path> → https://loop.urbnia.com/api/<path>

The protocol namespace below deliberately still uses `localloop.urbnia.com`:
those URLs are published JSON-LD/schema identifiers and keep resolving via
the redirect. Moving them is a protocol versioning decision.

## Protocol namespace

All JSON-LD `@context` and schema `$id` references must live under:

- https://localloop.urbnia.com/projects/loop-protocol

JSON-LD contexts are published here:

- https://localloop.urbnia.com/projects/loop-protocol/contexts/

## Disallowed domains

Do not introduce or reference the following domains in code, docs, or tests:

- local-loop-io.github.io
- loop-protocol.org
- localloop.org
- local-loop.io
- api.local-loop.io
- local-loop.eu
- materialdna.eu

## Enforcement

The CI workflow runs `scripts/check-domains.sh` on every push and PR.
