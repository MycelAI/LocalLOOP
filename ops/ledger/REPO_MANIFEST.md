# REPO_MANIFEST — localLOOP multi-repo estate

> **Historical (pre-2026-10-14).** The repos below were merged into the
> `MycelAI/LocalLOOP` monorepo (`apps/backend`, `apps/site`, `protocol`,
> `ops/org-profile`, `ops/ledger`) and the originals archived. See the root
> `README.md` / `CLAUDE.md` for the current layout.

Generated: 2026-07-25 (bootstrap); last refreshed 2026-09-05 (estate defect sweep). Update HEAD SHAs after each successful deploy cycle.

Workspace root: `/home/alphin/code/local-loop-io/`

Live public endpoints:

| Surface | URL |
|---------|-----|
| Public site | https://localloop.urbnia.com |
| Backend API | https://loop-api.urbnia.com |

Canonical note: `api.local-loop.io` does **not** exist.

---

## Product repositories

### 1. `localloop-backend`

| Field | Value |
|-------|-------|
| **Name** | `localloop-backend` (`@local-loop/localloop-backend`) |
| **Purpose** | Lab-only control-plane API: interest registry, LOOP protocol surface (materials/products/offers/matches/transfers/transactions/signals), federation, evidence, metrics |
| **Language / framework** | TypeScript (ESM), Bun runtime, Fastify 5, Prisma 7 + `pg`, Zod, BullMQ + ioredis, better-auth (optional); Biome lint. Object storage is SeaweedFS behind an nginx `storage-proxy` (S3-compatible, `MINIO_*` env names retained, unused by routes) |
| **Version (package)** | `0.6.4` (2026-09-05) |
| **Branch (bootstrap)** | `main` |
| **HEAD SHA (bootstrap)** | `573917215e6b91f04129e44ec57590d234207678` |
| **Remote** | `https://github.com/local-loop-io/localloop-backend.git` |
| **Build** | `bun install --frozen-lockfile`; `bun run prisma:generate`; Docker image from `Dockerfile` (`oven/bun:1.4.0`) |
| **Test / typecheck** | `bun test` (DB-backed cases skip without Postgres; export a scratch `DATABASE_URL` on this host — the default `.env` is production); `bun run typecheck`; `bun run lint`; `bun run check:schemas`; `bun run check:conformance` |
| **Deploy target** | Docker Compose on VPS: service `api` (+ `postgres`, `redis` [Valkey 9.0], `seaweedfs`, `storage-proxy`) via `docker-compose.yml` |
| **VPS containers** | `localloop-backend-api-1`, `localloop-backend-postgres-1`, `localloop-backend-redis-1`, `localloop-backend-seaweedfs-1`, `localloop-backend-storage-proxy-1` |
| **Traefik host** | `loop-api.urbnia.com` → container port `8088` |
| **Published interfaces** | HTTP JSON / JSON-LD: `/health`, `/docs`, `/api/metrics`, `/api/privacy`, `/api/auth/status`, `/api/interest`, `/api/interest/stream`, `/api/cities*`, `/api/v1/*` (material, product, offer, match, transfer, transaction, signals, node/info, stream, relay, federate/*, federation/*, evidence, payments) |
| **Schema ownership** | Postgres schema via Prisma (`prisma/`); Fastify route schemas; **mirrored copies** of loop-protocol JSON Schemas under `src/schemas/` (synced via `scripts/sync-schemas.ts`) |
| **Consumers** | `localloop-site` (browser → public API for DEMO City, interest form, metrics panel); external lab clients; conformance scripts |
| **Sibling dependencies** | **Reads** `loop-protocol` schemas (sibling path `../loop-protocol/schemas` + Core-DP profiles); OpenAPI three-way check also mirrors site `public/projects/loop-protocol/openapi.json` |
| **Env contracts** | `DATABASE_URL`, `REDIS_URL`/`REDIS_PASSWORD`, `STORAGE_*` (SeaweedFS S3; legacy `MINIO_*` accepted), `PUBLIC_BASE_URL=https://loop-api.urbnia.com`, `ALLOWED_ORIGINS=https://localloop.urbnia.com`, optional `API_KEY`, `AUTH_ENABLED` |
| **Co-deploy** | Deploy **with** its data plane (postgres/redis/seaweedfs). Independent of site image. Protocol is not a runtime container. |
| **Independent?** | Runtime-independent of site; contract-coupled to protocol schemas and site CORS origin |

### 2. `localloop-site`

| Field | Value |
|-------|-------|
| **Name** | `localloop-site` |
| **Purpose** | Public docs hub, platform pages, protocol mirror, interest UX, DEMO City (static Next.js export served by nginx) |
| **Language / framework** | Next.js 16 (App Router, `output: 'export'`, `trailingSlash: true`), React 19, Bun for build, nginx runtime |
| **Version (package)** | `0.5.3` (2026-09-05) |
| **Branch (bootstrap)** | `fix/openapi-mirror-sync` at bootstrap (long since merged; `main` is the working branch) |
| **HEAD SHA (bootstrap)** | `cf62c0b9e79331f83b5317d71d313ec5de8bc581` |
| **Remote** | `https://github.com/local-loop-io/localloop-site.git` |
| **Build** | `bun install --frozen-lockfile` → `bun run build` → static `out/` |
| **Test** | `bun run test` (smoke; rendered-output checks need `bun run build` first); `bun run lint`; `bun run typecheck`; `bun run test:e2e` (Playwright; set `PLAYWRIGHT_BASE_URL` to test the nginx image); `bun run check:domains` |
| **Deploy target** | Docker Compose service `site` (`docker-compose.yml`); Traefik on `localloop.urbnia.com` |
| **VPS container** | `localloop-site-site-1` |
| **Published interfaces** | Static HTTP pages (`/`, `/protocol/*`, `/platform/*`, `/docs/*`, `/library/*`, `/governance/*`, `/interest/`, …); mirrored protocol assets under `/projects/loop-protocol/**` including JSON-LD contexts and `openapi.json` |
| **Schema ownership** | None (mirrors protocol assets into `public/projects/loop-protocol/`) |
| **Consumers** | Public browsers; protocol JSON-LD context consumers (`https://localloop.urbnia.com/projects/loop-protocol/contexts/loop-v0.2.0.jsonld`) |
| **Sibling dependencies** | Calls live `https://loop-api.urbnia.com` from client scripts (DEMO City, interest, metrics); mirrors content from `loop-protocol` |
| **Co-deploy** | Independently rebuildable; must keep CORS origin allowlisted on backend |
| **Independent?** | Yes for image deploy; content-coupled to protocol mirror; runtime-coupled to API for interactive lab pages |

### 3. `loop-protocol`

| Field | Value |
|-------|-------|
| **Name** | `loop-protocol` (`@local-loop/loop-protocol`) |
| **Purpose** | LOOP specification, JSON Schema, JSON-LD contexts, OpenAPI contract, Core-DP profile, examples, RFCs |
| **Language / framework** | Spec/docs + JSON Schema; Node scripts (`ajv`) for validation; no runtime service |
| **Version (package)** | `0.5.2` (2026-09-05; OpenAPI info version `0.2.0`, 14 paths) |
| **Branch (bootstrap)** | `main` |
| **HEAD SHA (bootstrap)** | `e130bd31bb824b101f240ccdf2ac0f13f9c6c3fc` |
| **Remote** | `https://github.com/local-loop-io/loop-protocol.git` |
| **Build / test** | `npm run test` (never bare `npm test`: where `npm` is aliased to bun it runs Bun's test runner); `npm run check:domains`; `npm run conformance:*` |
| **Deploy target** | **Not a VPS container.** Consumed as source of truth; mirrored into site `public/projects/loop-protocol/` and backend `src/schemas/` |
| **Published interfaces** | Files: `schemas/*.schema.json`, `contexts/*.jsonld`, `openapi.json`, `SPECIFICATION.md`, profiles under `profiles/core-dp/` |
| **Consumers** | `localloop-backend` (schema sync + conformance), `localloop-site` (static mirror + docs) |
| **Sibling dependencies** | None (upstream of both) |
| **Co-deploy** | Content publish path: protocol change → sync backend schemas + site mirror → deploy backend and/or site as needed |
| **Independent?** | Spec-only; never “deployed” alone to Docker |

### 4. `org-github-profile`

| Field | Value |
|-------|-------|
| **Name** | `org-github-profile` (GitHub special repo `.github`) |
| **Purpose** | GitHub org profile README and org-level policy docs |
| **Language / framework** | Markdown + bash policy check (`scripts/check-policy.sh`) |
| **Branch (bootstrap)** | `main` |
| **HEAD SHA (bootstrap)** | `bab3b679c13344ec3b6f3ea45e4afa0ed64d8864` |
| **Remote** | `https://github.com/local-loop-io/.github.git` |
| **Deploy target** | GitHub org profile only (no VPS service) |
| **Published interfaces** | `profile/README.md` rendered at https://github.com/local-loop-io |
| **Consumers** | Humans / GitHub UI |
| **Sibling dependencies** | Documents live URLs for site + API; domain policy alignment |
| **Co-deploy** | Independent; rare edits |
| **Independent?** | Fully independent of Docker stack |

### 5. `localloop-agent` (this repo)

| Field | Value |
|-------|-------|
| **Purpose** | Agent ledger, plans, baselines, evidence — **no product code** |
| **Deploy** | None |

---

## Deploy ordering (derived)

When multiple services must change:

1. **`loop-protocol`** (if schemas/OpenAPI/spec changed) — land commits first; no container.
2. **`localloop-backend`** — rebuild/restart `api` (and run migrations if Prisma schema changed) **after** additive protocol/schema landings; expand-then-contract for API.
3. **`localloop-site`** — rebuild/restart `site` after API is compatible (or after mirror updates); CORS/origin already fixed on backend.
4. **`org-github-profile`** — anytime; never blocks runtime.

**Single-service cycles:** only rebuild the touched service.

**Safe intermediate states (compatibility matrix):**

| Consumer state | Provider state | Expected |
|----------------|----------------|----------|
| Old site | New backend (additive API/health fields) | OK |
| New site | Old backend | OK if site does not require new endpoints |
| Old backend schemas | New protocol (not yet synced) | Backend `check:schemas` fails in CI; do not ship protocol-breaking without backend sync in same cycle |
| New backend | Old protocol checkout on disk | Runtime OK if backend embeds schemas; CI parity may skip without sibling |

### Typical VPS commands (host already runs Docker)

```bash
# Backend (from localloop-backend)
sudo docker compose up -d --build --no-deps api
# or full stack deps:
sudo docker compose up -d --build

# Site (from localloop-site)
sudo docker compose up -d --build
```

Health gate after API: `curl -fsS https://loop-api.urbnia.com/health`
Smoke site: `curl -fsSIL https://localloop.urbnia.com/`

---

## Cross-repo contracts that must never break

1. **JSON Schema parity** — Backend `src/schemas/**` must match `loop-protocol/schemas/**` and Core-DP schemas (`bun run check:schemas`).
2. **OpenAPI three-way parity** — `loop-protocol/openapi.json` ↔ backend conformance ↔ site `public/projects/loop-protocol/openapi.json`.
3. **JSON-LD context URLs** — Preferred: `https://localloop.urbnia.com/projects/loop-protocol/contexts/loop-v0.2.0.jsonld` (v0.1.1 remains valid).
4. **CORS / origin** — Backend `ALLOWED_ORIGINS` must include `https://localloop.urbnia.com`.
5. **Public API base** — Site client code and docs must use `https://loop-api.urbnia.com` (not `api.local-loop.io`).
6. **Health contract** — `GET /health` returns 200 with `{ status, time, uptime, db }` when DB ok; 503 when degraded. Additive fields only (expand-then-contract).
7. **Domain policy** — Canonical domains only; keep `DOMAIN-POLICY.md` + check scripts aligned across repos.
8. **Lab messaging** — No public-pilot claims in site, org profile, or API privacy copy.
9. **Idempotency + Core-DP error shapes** — Write routes conflict behavior (409 Core-DP body) and spec error envelopes.
10. **Trailing-slash site routes** — Site is static export with `trailingSlash: true`; deep links without slash 301 to slash form.

---

## Branch protection note (GitHub)

`main` on `localloop-backend` and `localloop-site` requires PR + 1 approving review; push restricted to `alpha912`. Agent cycles push feature branches `agent/cycle-NNN`, open PRs, and merge only when reviews/admin rights allow — never force-push. Local VPS deploys may build from the agent branch for live verification before merge.

---

## Bootstrap version set (2026-07-25)

| Repo | Branch | SHA | Container / note |
|------|--------|-----|------------------|
| localloop-backend | main | 573917215e6b91f04129e44ec57590d234207678 | localloop-backend-api-1 healthy |
| localloop-site | fix/openapi-mirror-sync | cf62c0b9e79331f83b5317d71d313ec5de8bc581 | localloop-site-site-1 up |
| loop-protocol | main | e130bd31bb824b101f240ccdf2ac0f13f9c6c3fc | content only |
| org-github-profile | main | bab3b679c13344ec3b6f3ea45e4afa0ed64d8864 | GitHub profile only |
| localloop-agent | main | (see git) | bookkeeping only |

Live probe at bootstrap: `GET https://loop-api.urbnia.com/health` → `{"status":"ok","db":"ok"}`; site `/` → 200.

## Final version set after 100 cycles + residual

| Repo | Branch | SHA |
|------|--------|-----|
| localloop-backend | main | `69afb143102fbd34889fdf7a5ad22a597794d21a` |
| localloop-site | main | `388cc9265d8850c32cffe6524315124da42a183c` |
| loop-protocol | main | `066dc41772b88c3ab5efac237ce21ffbc3d118bf` |
| org-github-profile | main | `ee59cce5b788198773b7c4d322fe9f220c50a24f` |
| localloop-agent | main | `a09e86ccb9eaac05e49c1ed19e013b19606aba5d` |

## Version set after the 2026-09-04/05 estate defect sweep

| Repo | Branch | Tag | SHA | Deployed |
|------|--------|-----|-----|----------|
| loop-protocol | main | `v0.5.2` | `38ec14d` | content only (mirrored into site + backend) |
| localloop-backend | main | `v0.6.4` | `dadd7d1` (tag at `17d0379`; backup-unit fixes after) | `api` + `redis` (Valkey 9.0.6) recreated 2026-09-05; migrations 018-020 applied |
| localloop-site | main | `v0.5.3` | `8ad629a` | `localloop-site-site-1` rebuilt 2026-09-05 (hash-based script CSP) |
| org-github-profile | main | — | `de4c107` | GitHub profile |
| localloop-agent | main | — | (see git) | bookkeeping only |

Also: the stranded `v0.6.1` backend release commit (it lived only on the merged
`fix/loop-transfer-duplicate-state-error` branch) was merged into `main` with a
`--no-ff` merge before v0.6.2, so all tags are reachable from `main`.
