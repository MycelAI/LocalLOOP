# LocalLOOP

Monorepo for **localLOOP**: the LOOP protocol (spec + schemas), the public
documentation hub, and the lab-only backend API that powers the interest
registry and minimal interop demo flows.

> Early-stage (low TRL), **lab demo only** — no public pilots or deployments.

## Layout

```
apps/
  backend/        Bun + Fastify 5 API (Prisma 7, PostGIS, Valkey, SeaweedFS)  → https://loop-api.urbnia.com
  site/           Next.js 16 static docs hub served by nginx                 → https://localloop.urbnia.com
protocol/         LOOP specification, JSON Schemas, JSON-LD contexts, RFCs, profiles, openapi.json
ops/
  ledger/         Agent ledger, repo manifest, verification evidence, plans
  org-profile/    Source of the local-loop-io GitHub org profile (historical)
scripts/          Monorepo-wide tooling (ci-local.sh)
.github/          CI workflows (path-filtered per tree), Dependabot, CODEOWNERS
```

Each tree keeps its own toolchain and lockfile; there is no root package
manager workspace.

| Tree | Install | Check |
| --- | --- | --- |
| `apps/backend` | `bun install && bun run prisma:generate` | `bun run typecheck && bun run lint && bun run check:conformance && bun test` |
| `apps/site` | `bun install` | `bun run lint && bun run typecheck && bun run build && bun run test` |
| `protocol` | `npm ci` | `npm run test` |

`scripts/ci-local.sh` runs the fast checks for every tree.

## Cross-tree contracts

- `protocol/` is canonical. The backend keeps byte-identical schema copies in
  `apps/backend/src/schemas/` (`bun run sync:schemas`), and the site mirrors
  protocol artifacts into `apps/site/public/projects/loop-protocol/`
  (`bash apps/site/scripts/aggregate-docs.sh`). The mirror keeps its public
  URL path, so JSON-LD contexts stay at
  `https://localloop.urbnia.com/projects/loop-protocol/contexts/…`.
- `bun run check:conformance` (in `apps/backend`) fails on any drift between
  the three, and on spec endpoints missing from the API.

## Deployment

Both apps run with Docker Compose behind the host's shared Traefik. Compose
project names are pinned (`localloop-backend`, `localloop-site`), so
containers keep their historical names.

```bash
cd apps/backend && docker compose up -d --build   # API + Postgres + Valkey + SeaweedFS
cd apps/site    && docker compose up -d --build   # static site (nginx)
```

Backend secrets live in the git-ignored `apps/backend/.env` / `.env.docker`;
data in `apps/backend/data/`, nightly dumps in `apps/backend/backups/`.

## History

This repository consolidates the former `local-loop-io` repositories with
full history (each rewritten into its subdirectory):

| Former repo | Path | Tag prefix |
| --- | --- | --- |
| `local-loop-io/localloop-backend` | `apps/backend` | `backend/` |
| `local-loop-io/localloop-site` | `apps/site` | `site/` |
| `local-loop-io/loop-protocol` | `protocol` | `protocol/` |
| `local-loop-io/.github` | `ops/org-profile` | `org-profile/` |
| `localloop-agent` (local only) | `ops/ledger` | — |

The originals are archived. Unmerged work survives as `legacy/*` branches.
