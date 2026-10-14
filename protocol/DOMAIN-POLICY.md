# Domain Policy

This repository defines the localLOOP protocol assets and example payloads.

## Canonical domains

- Public site / docs hub: https://loop.urbnia.com
- Backend API: https://loop.urbnia.com/api/

The former hostnames `localloop.urbnia.com` and `loop-api.urbnia.com` only
308-redirect to the above. Since protocol 0.6.0 no context, schema, example or
document uses them; changelog history is the only exception.

## Protocol namespace

All JSON-LD `@context` and schema `$id` references must live under:

- https://loop.urbnia.com/projects/loop-protocol

JSON-LD contexts are published here:

- https://loop.urbnia.com/projects/loop-protocol/contexts/

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

<!-- agent-cycle-038: domain policy anchor -->
