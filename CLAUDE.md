# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
localLOOP is a monorepo (`MycelAI/LocalLOOP`, private) containing LOOP (spec + schemas), a public documentation hub, and a lab-only backend API that powers an interest registry and minimal interop demo flows. The project is early-stage (low TRL) with **no public pilots or deployments**.

Home: **https://loop.urbnia.com** (site) with the API same-origin under **https://loop.urbnia.com/api/**. It was consolidated on 2026-10-14 from the former `local-loop-io/*` GitHub repos (now archived) with full history; former tags are prefixed (`backend/v0.6.4`, `site/v0.6.0`, `protocol/v0.5.2`, `org-profile/…`).

## Tech Stack
- Site: Next.js 16 (App Router), React 19, Playwright
- Backend: Bun, Fastify 5, `pg` (plain parameterized SQL, no ORM), PostgreSQL (PostGIS), Valkey 9 (Redis-compatible) + BullMQ/ioredis, SeaweedFS (S3 gateway `seaweedfs:8333`, host `127.0.0.1:9200`; configured via `STORAGE_*`; no route uses the store yet)
- Protocol: JSON-LD + JSON Schema, AJV validation
- Infrastructure: Docker + Traefik on the VPS; optional systemd + Nginx config

## Architecture
- **Docs hub (`apps/site`)** serves static protocol docs, examples, and a public interest form. Static Next.js export served by nginx in Docker behind Traefik at `https://loop.urbnia.com`. nginx only serves files; it does not proxy the API.
- **Backend API (`apps/backend`)** handles interest submissions, lab demo flows, SSE streams, and metrics. It has no public Traefik router; it is reached only through the site's `/api/` proxy (`/health`, `/docs`, `/openapi.json` also answer under `/api/`).
- **Protocol (`protocol/`)** is the source of truth for schemas, spec, and RFCs.

## Directory Structure
```
/apps/backend
  /src - server, routes, db, realtime, schemas (mirrored from protocol/)
  /scripts - lab demo/federation scripts, sync-schemas, check-conformance
  /deploy - systemd units, backup/healthcheck scripts, setup.sh
  /vendor - pinned Redoc bundle for /api/docs
/apps/site
  /app - Next.js pages/layouts
  /public - static assets + mirrored protocol docs (public/projects/loop-protocol)
  /tests - smoke + e2e
/protocol
  /schemas - JSON schemas (canonical; mirrored into backend src/schemas and site public/projects)
  /contexts - JSON-LD contexts (v0.1.1, v0.2.0)
  /docs - governance/security/compliance guidance, pilot-readiness docs
  /examples - protocol payload examples
  /rfcs - RFC-0001..0005
  /profiles - Core-DP lab profile + battery/packaging/waste-shipment extension guidance
  /scripts - validate-schemas.js, check-domains.sh, marker/readme checks
  openapi.json - reference API contract (14 paths); SPECIFICATION.md - the spec
/ops/ledger - agent LEDGER.md, REPO_MANIFEST.md, evidence/, plans/, baselines/
/ops/org-profile - source of the local-loop-io GitHub org profile (historical)
/scripts/ci-local.sh - fast checks across all trees
/.github - CI workflows (path-filtered), Dependabot, CODEOWNERS
```

## Key Concepts & Domain Model
- **MaterialDNA** → **Offer** → **Match** → **Transfer** (minimal lab flow)
- **Node** (federation peer), **Node Handshake** (lab-only registry)
- **Interest** (public expressions of interest; non-protocol)
- **City** (seeded demo data for lab UI)

## Development Commands

### Backend (apps/backend)
```bash
bun install
cp .env.example .env          # First time setup (production .env already present on the VPS)
docker compose up -d          # Postgres, Valkey, SeaweedFS and the api container
bun run dev                   # Start API server (port 8088)
bun run typecheck             # TypeScript validation
bun run lint                  # Biome
bun run check:conformance     # backend <-> protocol <-> site-mirror drift gate
bun test                      # Run all tests (see warning below)
bun test tests/interest.routes.test.ts  # Run single test file
bun run lab:demo              # Full lab demo (migrate, seed, simulate)
bun run lab:federation        # Two-node federation demo
```

### Site (apps/site)
```bash
bun install
bun run dev                   # Dev server
bun run build                 # Static export to out/
bun run test                  # Smoke tests (rendered-output checks need a prior build)
bun run lint && bun run typecheck   # Biome + TS check of the Playwright specs
bun run test:e2e              # Playwright E2E (builds first); set PLAYWRIGHT_BASE_URL to test the nginx image
bunx playwright test tests/e2e/specific.spec.ts  # Single E2E test
bash scripts/aggregate-docs.sh  # Re-mirror protocol/ into public/projects/loop-protocol
```

### Protocol (protocol/)
```bash
npm ci                        # `npm` may be aliased to bun; use /home/alphin/.volta/bin/npm
npm run test                  # Validate schemas with AJV
```

## Production (this host IS the live VPS)
- This checkout runs on the production VPS. The shared Traefik routes `loop.urbnia.com/api/*` to the `apps/backend` api container (router `localloop-api`, priority 100) and everything else on `loop.urbnia.com` to the `apps/site` nginx (router `localloop-site`); the site nginx answers `/api/*` with a JSON 503 only while the API router is absent. The site stack's labels also 308-redirect `localloop.urbnia.com/*` → `loop.urbnia.com/*` and `loop-api.urbnia.com/*` → `loop.urbnia.com/api/*`. Compose project names are pinned, so containers are `localloop-backend-{api,postgres,redis,seaweedfs}-1` and `localloop-site-site-1`.
- `apps/backend/.env` and `.env.docker` hold production secrets (git-ignored). `apps/backend/data/` holds the live Postgres/Valkey/SeaweedFS data (root/container-owned); `apps/backend/backups/` holds nightly dumps.
- `bun test` in `apps/backend` applies migrations to whatever `DATABASE_URL` points at — the default `.env` is **production**. Use a scratch DB (`localloop_test`) and an explicit `REDIS_URL` with the password.
- systemd: `localloop-backend-backup.timer` (02:30 nightly) and `localloop-backend-healthcheck.timer` run `apps/backend/deploy/{backup.sh,healthcheck-alert.sh}` from this checkout.
- Rebuild/redeploy: `cd apps/backend && docker compose up -d --build` (same for `apps/site`). Traefik router/middleware/service names (`localloop-api` in the backend stack; `localloop-site`, `localloop-legacy-site`, `localloop-legacy-api`, `localloop-legacy-*-redirect` in the site stack) are global on this host — keep them unique. Each stack deploys independently; a site restart no longer interrupts the API.

## Environment Variables (Backend)
Source of truth: `apps/backend/src/config.ts` (Zod schema) and `.env.example`
(host-side values) / `.env.docker.example` (compose-network values). Every
variable has a development default; only `DATABASE_URL` and `STORAGE_SECRET_KEY`
are hard requirements, and only when `NODE_ENV=production` (which also rejects
weak/default secrets, secrets under 16 characters, and an unauthenticated `REDIS_URL`).

| Variable | Description | Default (dev) |
| --- | --- | --- |
| DATABASE_URL | Postgres connection string | `postgresql://localloop:localloop_dev@localhost:55432/localloop` |
| DB_POOL_SIZE | pg pool size | `10` |
| REDIS_URL | Valkey/Redis connection string (compose service requires a password) | `redis://localhost:6381` |
| REDIS_PASSWORD | Password the compose `redis` service starts with | (set in .env) |
| STORAGE_ENDPOINT / STORAGE_PORT | SeaweedFS S3 host/port (host: `localhost:9200`; compose: `seaweedfs:8333`) | `localhost` / `9200` |
| STORAGE_ACCESS_KEY / STORAGE_SECRET_KEY / STORAGE_BUCKET | Object-storage credentials (unused by routes today; former `MINIO_*` names still accepted) | `localloop` / `localloop_dev_secret` / `localloop-assets` |
| ALLOWED_ORIGINS | CORS allowlist (comma-separated) | `https://loop.urbnia.com` |
| PUBLIC_BASE_URL | External base URL (node endpoint = this + `/api/v1`) | `https://loop.urbnia.com` |
| PORT | Listen port | `8088` |
| NODE_ID / NODE_NAME / NODE_CAPABILITIES / NODE_LAT / NODE_LON | Node identity for `GET /api/v1/node/info` | `lab-hub.loop` / … / `48.1351` / `11.582` |
| RATE_LIMIT_MAX / RATE_LIMIT_WRITE_MAX | Read / write rate limits per window (`RATE_LIMIT_WINDOW`) | `600` / `20` per 15 min |
| SSE_KEEPALIVE_MS / SSE_MAX_CLIENTS | SSE heartbeat and subscriber cap | `25000` / `200` |
| RUN_MIGRATIONS | Apply `src/db/migrations` on start | `true` |
| SEARCH_REFRESH_ON_WRITE | Refresh the interest search view on each POST | `true` |
| AUTH_ENABLED / BETTER_AUTH_SECRET / AUTH_TRUSTED_ORIGINS | better-auth toggle and settings | `false` |
| API_KEY_ENABLED / API_KEY | Require `X-API-Key` on write routes | `false` |
| WORKER_ENABLED | Consume queued interest jobs | `false` |
| PAYMENTS_ENABLED | Payments intake routes | `false` |

## API Overview (Backend)
Authoritative list: `apps/backend/README.md` and `apps/backend/docs/SPEC-COMPLIANCE.md`.
- Health/ops: `GET /health`, `GET /api/metrics`, `GET /api/privacy`, `GET /api/auth/status`, `ALL /api/auth/*` (when enabled)
- Interest: `GET /api/interest`, `POST /api/interest`, `GET /api/interest/stream`
- Protocol §8.1: material, product (Core-DP), offer, match, transfer, node/info, signals, transaction
- Protocol §8.2: `POST /api/v1/federate/announce`, `POST /api/v1/federate/offer` (§9.2 headers)
- Lab extensions: list/read routes, `POST /api/v1/material-status`, `GET /api/v1/events`, `GET /api/v1/stream`, `POST /api/v1/relay`, `GET /api/v1/federation/nodes`, `POST /api/v1/federation/handshake`
- Evidence (Core-DP): `GET /api/v1/evidence`, `GET /api/v1/evidence/:event_id`, `POST /api/v1/evidence/search`
- Cities: `GET /api/cities`, `GET /api/cities/:slug`, `GET /api/cities/geojson`
- Payments: `POST /api/payments/intent`, `POST /api/payments/webhook` (when enabled)
- Docs: `GET /openapi.json`, `GET /docs`

## Domain & Context Requirements
- Home / site: `https://loop.urbnia.com`
- Backend API: `https://loop.urbnia.com/api/` (same origin)
- `loop.urbnia.com` and `loop.urbnia.com/api/` are the only canonical hosts — everywhere, including protocol identifiers (since protocol 0.6.0, 2026-10-14).
- Former hostnames `localloop.urbnia.com` and `loop-api.urbnia.com` only 308-redirect. Never use them in new content; the domain checks reject them everywhere except changelog history, `DOMAIN-POLICY.md` files, the Traefik redirect labels in `apps/site/docker-compose.yml`, and descriptions of those redirects.
- JSON-LD `@vocab`/term namespace: `https://loop.urbnia.com/projects/loop-protocol/terms/`
- JSON-LD context (v0.2.0): `https://loop.urbnia.com/projects/loop-protocol/contexts/loop-v0.2.0.jsonld`
- JSON-LD context (v0.1.1, still valid): `https://loop.urbnia.com/projects/loop-protocol/contexts/loop-v0.1.1.jsonld`
- Historical lab records in production (payloads registered before 2026-10-14) keep the old context IRIs: they are covered by append-only evidence hashes and must not be rewritten.
- `local-loop-io.github.io` and `api.local-loop.io` do **not** exist (do not reference).
- Public pages may still link to the archived (read-only, public) `github.com/local-loop-io/*` repos; this monorepo is private.

## Cross-tree sync rules
- Any change under `protocol/{schemas,contexts,docs,examples,rfcs}`, `openapi.json` or `SPECIFICATION.md` must be followed by `bash apps/site/scripts/aggregate-docs.sh` (and `bun run sync:schemas` in `apps/backend` for schemas). Then `git status --short` — scan for unexpected `D` lines before committing.
- Adding RFC2119 clauses to `SPECIFICATION.md` requires re-pinning `protocol/profiles/core-dp/requirements/spec-v0.2.0-normative-manifest.json`.

## Backend Source Patterns

### Adding API Routes
1. Create route file in `apps/backend/src/routes/` following Fastify plugin pattern
2. Register in `src/server.ts` via `fastify.register()`
3. Add request/response schemas to `src/validation.ts` (Zod)
4. Add tests in `tests/`

### Database Layer
- Query functions in `src/db/` modules (e.g., `src/db/interest.ts`)
- SQL migrations in `src/db/migrations/`
- The SQL migrations are the schema's source of truth (no ORM, no generate step)
- Connection pooling via `src/db/pool.ts`

### Real-time (SSE)
- Interest stream: `src/realtime/interestStream.ts`
- Loop events stream: `src/realtime/loopStream.ts`

## Testing Strategy
- Backend: Bun tests for routes, SSE, queue, auth toggles; conformance gate
- Site: Node smoke tests + Playwright E2E
- Protocol: AJV schema validation + profile conformance vectors
- CI: root `.github/workflows/*.yml`, path-filtered per tree. **GitHub Actions is disabled on this repo** (MycelAI org billing blocks private-repo runners, same as OmniScript, since 2026-10-14) — `scripts/ci-local.sh` is the gate; run it before every push. Re-enable with `gh api -X PUT repos/MycelAI/LocalLOOP/actions/permissions -F enabled=true` once billing is fixed.

## Known Issues & Technical Debt (Top)
- Protocol §8 endpoint implementation status: `apps/backend/docs/SPEC-COMPLIANCE.md`.
- Pilot-readiness claim (`protocol/docs/governance/pilot-readiness/`) expires 2026-12-04; renew by ~2026-11-20 (24 h cooling-off).
- Open follow-up: periodic backup **restore** drill; nothing is copied off-host.

## Claims Policy
No public pilots or deployments. Use “lab demo only” language for all outward-facing content.

## Release / Tag Convention
Per-tree releases keep their own `package.json` versions; tag as `<tree>/vX.Y.Z` (e.g. `backend/v0.6.5`) with an annotated tag.

## Commit Message Policy
Never include Claude, Anthropic, or any AI tool name or co-authorship trailer in commit messages. Commits must read as if written by the human developer. No `Co-Authored-By: Claude` or similar lines.
