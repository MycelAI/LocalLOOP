# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.9.0] - 2026-10-14

### Removed
- **Prisma.** It backed only `src/db/interest.ts` (create/list/count) and the
  raw PostGIS queries in `src/db/cities.ts`; every other table already used
  parameterized SQL through the `pg` pool, the schema was owned by the SQL
  migrations, and `prisma/schema.prisma` was a drifting copy. Both modules,
  the readiness probe and shutdown now use the pool directly with the same
  queries and response shapes. Removed: `prisma/`, `prisma.config.ts`,
  `src/db/prisma.ts`, the `prisma:generate` script and Dockerfile step, and the
  `prisma`, `@prisma/client` and `@prisma/adapter-pg` dependencies, plus the
  `deepmerge-ts` and `mysql2` overrides that only applied to Prisma's tree.
  The production install drops from 268 to 148 packages, and the image no
  longer ships the EPL-2.0 `elkjs` that the Prisma CLI pulled in.

### Fixed
- `GET /api/cities`, `GET /api/cities/:slug` and `GET /api/cities/geojson`
  returned every city `center`, feature `geometry` and feature `properties`
  as `{}`: their response schemas declared bare objects, and Fastify's
  serializer drops undeclared properties. The schemas now declare the GeoJSON
  Point and feature-property shapes, and the route tests assert the
  serialized content.

### Added
- `tests/db.queries.test.ts`: real-database coverage for the cities (bbox,
  radius, distance, GeoJSON, by slug) and interest (insert, list, count)
  queries, which the route tests mock. It passes against both the previous
  Prisma implementation and the new one.

### Migration
- Drop `bun run prisma:generate` from local setup and scripts; `bun install`
  is all the backend needs. No database change: the schema and migrations are
  untouched.

## [0.8.1] - 2026-10-14

### Fixed
- **SSE streams were cut after 30 seconds.** Under Bun, Fastify's
  `connectionTimeout` (`REQUEST_TIMEOUT_MS`, 30 s) is an absolute deadline
  rather than an idle timer, so `GET /api/v1/stream` and
  `GET /api/interest/stream` were closed 30 s after opening even with
  keep-alives flowing; browsers silently reconnected, leaving gaps in which
  events were missed. Stream sockets now disable the timeout; dead peers are
  still dropped through the close/error handlers and failed keep-alive writes.
  A real-socket regression test covers both streams.

## [0.8.0] - 2026-10-14

### Changed
- **The API has its own Traefik router again.** `https://loop.urbnia.com/api/*`
  is routed by the shared Traefik straight to this container (router and
  service `localloop-api`, `Host(loop.urbnia.com) && PathPrefix(/api/)`,
  priority 100) instead of through the site's nginx. Restarting the site no
  longer interrupts the API, and requests skip one proxy hop. Traefik is the
  single trusted hop (`trustProxy` hop 0), so per-client rate limits still see
  the real client address.
- **`storage-proxy` removed.** The nginx container in front of SeaweedFS added
  nothing: the S3 gateway is now `seaweedfs:8333` inside the compose network
  and is published directly on `127.0.0.1:9200`, the host address it always
  had. `.env.docker.example` uses `STORAGE_ENDPOINT=seaweedfs` and
  `STORAGE_PORT=8333`. No route uses object storage yet.
- The unused bare-metal `deploy/nginx.conf` example is removed;
  `deploy/setup.sh` copies `vendor/` (the pinned Redoc bundle) instead of the
  removed `storage-proxy/` directory.

### Migration
- Deploy with `docker compose up -d --build --remove-orphans` so the old
  `storage-proxy` container is removed. Postgres and Valkey are not recreated.
- In `.env.docker`, set `STORAGE_ENDPOINT=seaweedfs` and `STORAGE_PORT=8333`.
- The Traefik router name `localloop-api` must stay unique on the host.

## [0.7.1] - 2026-10-14

### Fixed
- **`/api/docs` rendered a blank page.** It loaded the unversioned Redoc
  bundle from jsDelivr, which now serves Redoc 3 as an ES module and threw
  `Cannot use 'import.meta' outside a module`. Redoc 3.0.1 is now vendored
  (`vendor/redoc/`, MIT, byte-identical to the npm tarball), served
  same-origin at `/api/docs/assets/redoc-3.0.1.standalone.js` with an
  immutable cache, and loaded as a module.
- The OpenAPI document lists the public `/api/health`, `/api/docs` and
  `/api/openapi.json` paths instead of the root aliases, which are not
  reachable through `https://loop.urbnia.com`.

### Security
- The docs page sends its own Content-Security-Policy (same-origin scripts,
  styles, images and connections; `blob:` only for Redoc's workers) and sets
  `disable-telemetry`, so neither Redoc's optional telemetry endpoint nor the
  Redocly badge image is ever contacted, and no third-party script runs.

## [0.7.0] - 2026-10-14

### Changed
- **BREAKING: protocol identifiers on `loop.urbnia.com`** (loop-protocol
  0.6.0). The synced schemas only accept `@context` values under
  `https://loop.urbnia.com/projects/loop-protocol/contexts/`; payloads that
  still name `https://localloop.urbnia.com/...` contexts are rejected with
  400. Responses, the federation handshake, node info, signals and
  transactions emit the new context and schema IRIs, and `/api/openapi.json`
  references the new schema `$id`s.
- `ALLOWED_ORIGINS` defaults to `https://loop.urbnia.com` only; the former
  site origin (which only redirects and serves no pages) is no longer allowed.
- Lab seed and simulation scripts use the new context IRIs; the bare-metal
  `deploy/nginx.conf` example serves the API under `loop.urbnia.com/api/`.
- `scripts/check-domains.sh` rejects the former hostnames outside the domain
  policy and changelog history.

### Migration
- Clients and federation peers: send
  `https://loop.urbnia.com/projects/loop-protocol/contexts/loop-v0.2.0.jsonld`
  (or `loop-v0.1.1.jsonld`) as `@context`.
- Deployments with `ALLOWED_ORIGINS` / `AUTH_TRUSTED_ORIGINS` set explicitly
  should drop `https://localloop.urbnia.com`.
- Records stored before this release keep the context IRIs they were
  registered with: their payloads are covered by append-only evidence hashes
  (`loop_evidence.payload_hash_sha256`) and are intentionally not rewritten.

## [0.6.6] - 2026-10-14

### Added
- The image ships `LICENSE`, `NOTICE` and `THIRD_PARTY_NOTICES.md` in `/app`
  (copies kept in sync with the repository root by `scripts/sync-legal.sh`).

### Changed
- Documentation: README links point at the monorepo's `protocol/` tree and
  `loop.urbnia.com`, caution against DB-backed tests on a real database, and a
  licensing section; SPDX headers and REUSE metadata added; community files
  updated. No runtime behaviour change.

## [0.6.5] - 2026-10-14

### Changed
- **Served same-origin under `https://loop.urbnia.com/api/`.** The API no
  longer has a public Traefik router; the site's nginx proxies `/api/*` to
  `localloop-backend-api-1:8088` over the shared `proxy` network.
  `loop-api.urbnia.com/*` 308-redirects to `loop.urbnia.com/api/*` (labels in
  the site stack).
- `GET /api/health`, `GET /api/docs` and `GET /api/openapi.json` answer as
  aliases of the root routes so they work through the `/api/` proxy.
- `PUBLIC_BASE_URL` defaults to `https://loop.urbnia.com` (was
  `https://loop-api.urbnia.com`), so `GET /api/v1/node/info` advertises
  `https://loop.urbnia.com/api/v1` as the node endpoint.
- `ALLOWED_ORIGINS` defaults to
  `https://loop.urbnia.com,https://localloop.urbnia.com`.
- Source moved into the `MycelAI/LocalLOOP` monorepo (`apps/backend`); schema
  sync and the conformance gate read `protocol/` and the site mirror from the
  monorepo paths. Former tags are prefixed (`backend/v0.6.4`).

### Fixed
- `deploy/localloop-backend-backup.service` no longer tries to create the
  backups directory itself (systemd resolves `ReadWritePaths=` before any
  `Exec*` step, failing with `226/NAMESPACE`); `deploy/setup.sh` creates it.
- Timestamped `.env.bak-*` / `.env.docker.bak-*` files written by the deploy
  scripts are git-ignored; they contain live credentials.

### Security
- `bun audit` is clean again: `fastify` ^5.12.5 (GHSA-4mh8-r7rc-xpvc, HTTP/2
  trailer DoS), override `fast-uri` ^4.1.5 (GHSA-hrr3-gc8f-f4qj,
  GHSA-jvvf-x445-j334) and new override `ip-address` ^10.7.1 via
  `@fastify/rate-limit` (GHSA-rpw4-54j3-4h4q, GHSA-2vr4-cq9g-pvrc,
  GHSA-j6r3-76f7-8jcv, GHSA-h3mg-xc3c-68pw).

### Migration
- Deployments that set `PUBLIC_BASE_URL` or `ALLOWED_ORIGINS` explicitly are
  unaffected. Deployments that relied on the defaults now advertise and allow
  `loop.urbnia.com`; set the variables to keep the old values.
- Clients calling `https://loop-api.urbnia.com/...` keep working through the
  308 redirect, but should switch to `https://loop.urbnia.com/api/...`.
  Federation peers that pinned the old node endpoint should re-read
  `GET /api/v1/node/info`.

## [0.6.4] - 2026-09-05

### Changed
- **Valkey 9.0** for the queue/cache service (compose and CI pinned by digest),
  started and health-checked via `valkey-server`/`valkey-cli`; `deploy/backup.sh`
  uses `valkey-cli` too. The service name (`redis`) and `REDIS_URL`/`REDIS_PASSWORD`
  keep their names so existing environments are unaffected.
- Object-storage configuration is `STORAGE_ENDPOINT`/`STORAGE_PORT`/
  `STORAGE_ACCESS_KEY`/`STORAGE_SECRET_KEY`/`STORAGE_BUCKET`/`STORAGE_USE_SSL`
  (`config.storage`), matching the SeaweedFS deployment; the former `MINIO_*`
  names are still read as a fallback with a deprecation warning. Production
  requires `STORAGE_SECRET_KEY` (or the legacy name).
- `POST /api/v1/transaction` writes a `registered` entry to the append-only
  evidence log (subject type `transaction`, added to the Core-DP evidence
  schema in loop-protocol 0.5.2; migration `020_loop_evidence_transaction_subject.sql`
  widens the CHECK constraint). It was the only lifecycle write without one.
- Migration files have unique prefixes again: `004_interest_demo.sql` is
  `004b_interest_demo.sql`. The runner rewrites the recorded version for
  renamed files (`RENAMED_MIGRATIONS`) before computing the unapplied set, so
  databases that recorded the old name do not re-run it.

## [0.6.3] - 2026-09-05

### Security
- Dependency audit (`bun audit`, which gates CI) was red: `fastify` 5.12.0
  (GHSA-w2qp-rph6-63g4 schema-coercion bypass; GHSA-3m5p-2c4r-xxw2
  X-Forwarded-* spoofing under hop-count `trustProxy`), `fast-uri` 4.1.2 (four
  host-confusion/SSRF advisories), `mysql2` 3.15.3 via better-auth/prisma
  (credential downgrade, decompression DoS) and `deepmerge-ts` 7.1.5 via
  `@prisma/config` (stack exhaustion). Now `fastify` ^5.12.3 with overrides
  `fast-uri` ^4.1.3, `mysql2` ^3.24.3, `deepmerge-ts` ^8.0.2; audit is clean.
- Because Fastify 5.12.1+ removed the numeric hop-count `trustProxy` form as
  part of that fix (a number now fails closed and is rejected by the types),
  the 0.6.2 setting `trustProxy: 1` is replaced by the equivalent trust
  function that trusts only the immediate proxy peer; the regression test
  covering `request.ip` selection still passes.

### Fixed
- `tests/auth.enabled.test.ts` probed for the better-auth schema before any
  migration had run on a fresh database and therefore skipped itself; it now
  migrates first (importing the probe after its env setup so the config module
  is not cached early).

## [0.6.2] - 2026-09-04

### Fixed
- **Backups:** `deploy/backup.sh` issued `redis-cli SAVE` without authenticating
  against the compose Valkey service (which always runs with `--requirepass`);
  the command returned `NOAUTH` with exit status 0, so the copied `dump.rdb`
  was silently whatever the last automatic save had written. The script now
  authenticates, fails loudly if `SAVE` does not answer `OK`, and never deletes
  the run the `latest` symlink points at during retention cleanup.
- **Idempotency:** `loop_idempotency_keys` was keyed on `key` alone while
  lookups filtered on `(key, route)`, so reusing one `Idempotency-Key` on two
  routes overwrote the first route's cached response and a legitimate retry
  re-ran its handler (migration `018_loop_idempotency_route_scope.sql`).
  `withIdempotency` also held a pool client for its advisory lock while the
  handler waited for a second client, so `DB_POOL_SIZE` concurrent keyed writes
  stalled until the connection timeout; the lock client is now handed to the
  handler and reused for its transaction.
- **State machine:** a transfer for a match that already has an active transfer,
  and a match against an already-reserved offer, are `409 CONFLICT` again
  (0.6.1 had turned the transfer case into `400 INVALID_REQUEST`; the test that
  covered it stubbed a raw `23505` and could not catch the regression).
- **Foreign-key violations** on write routes returned `409 CONFLICT` with the
  message "Related resource was not found"; they are `400 INVALID_REQUEST`.
- **SSE streams** (`/api/v1/stream`, `/api/interest/stream`) call
  `reply.hijack()`, guard every write so a dead subscriber socket no longer
  turns the write request that triggered the broadcast into a `500`, and clean
  up on response-side `close`/`error` as well as request close.
- **Route encapsulation:** route groups are registered as encapsulated plugins,
  so the `Cache-Control: no-store` hooks they add no longer run globally (seven
  copies per request, including on `/openapi.json`).
- `trustProxy` trusts only the immediate proxy hop instead of `true`: only the single reverse-proxy hop is
  trusted, so a client can no longer choose its own `request.ip` via
  `X-Forwarded-For` and sidestep the per-IP rate limits.
- List routes rejected nothing: `GET /api/v1/material?limit=-1` reached
  `LIMIT -1` and answered `500`. `limit` must now be an integer ≥ 1 (values
  above the cap are clamped), on the loop list routes, `/api/v1/events`,
  `/api/interest`, and `/api/cities`.
- `POST /api/v1/material-status` was the only write route without
  `Idempotency-Key` support or database-error mapping; a retried update
  appended duplicate `loop_events` and duplicate append-only evidence rows.
- Core-DP search responses claimed `consistency.mode: snapshot` with a random
  `snapshot_id` although each page is an independent query; they now report
  `eventual` with `as_of`. Search routes use the read rate limit instead of the
  20-per-window write limit.
- `REFRESH MATERIALIZED VIEW interests_search` runs `CONCURRENTLY`, so
  `GET /api/interest?search=` is no longer blocked for the duration of every
  `POST /api/interest`.
- Migration runner: a session advisory lock serialises concurrent runners
  (compose `api` with `RUN_MIGRATIONS=true` racing `bun run migrate`); the
  constraint statements in migrations 011 and 016 are re-runnable.
- Shutdown: re-entrancy guard, 10 s force-exit, and the BullMQ connection,
  Prisma client, and better-auth pool are closed (the auth pool is no longer
  created at all when `AUTH_ENABLED=false`).
- §9.2: a missing or blank `X-Timestamp` is `400 INVALID_REQUEST` (malformed
  request); only a well-formed but stale timestamp is `401`.
- Health/metrics/node-info and the OpenAPI document derive their version from
  one `src/version.ts`; the OpenAPI `info.version` was a hard-coded, stale
  `0.2.0-lab` (the spec baseline is now `info.x-protocol-version`).
- `deploy/healthcheck-alert.sh` built its webhook payload by string
  interpolation (invalid JSON whenever the embedded `/health` body contained
  quotes) and treated the degraded `503` as "unreachable"; `deploy/setup.sh`
  did not copy `storage-proxy/` or `scripts/`, chmod'ed the source tree instead
  of the install, and installed units pointing at three different paths — the
  units now carry one placeholder path that `setup.sh` rewrites to
  `INSTALL_DIR`. `deploy/nginx.conf` disables buffering for the SSE routes.
- `.env.example` used Docker-internal hostnames (`postgres`, `redis`,
  `minio-proxy`) and an unauthenticated `REDIS_URL`, so following the README
  quickstart on the host overrode working defaults with unreachable ones;
  `.env.docker.example` referenced the retired `minio-proxy` service name
  (`storage-proxy`).
- `cities`: `radiusKm` guard matched its own error message (values below 1 are
  rejected); `payments`: AJV and Zod validators agree on `amount ≥ 0.01` and a
  3-letter `currency`.
- Tests: the ~30 DB/Redis-backed cases that silently *passed* when no service
  was reachable (`if (!dbReady) return;`) are declared with `it.skipIf(...)` and
  show up as skipped. New coverage: per-route idempotency scoping, pool
  exhaustion under concurrent keyed writes, concurrent migration runners,
  `trustProxy` hop handling, SSE dead-socket handling, list-limit validation,
  duplicate/reserved conflicts on the real state-error path.

### Changed
- `docs/SPEC-COMPLIANCE.md` gains the `POST /api/v1/offer|match|transfer`
  rows (listed in loop-protocol v0.5.1's §8.1/`openapi.json`), records the
  intentional Core-DP error-body exception for the search contract and
  evidence routes (the previous text claimed every lab surface used the §8.3
  envelope), and uses "locked lab scenario" wording in line with the claims
  policy. README documents the actual stack (Valkey, SeaweedFS), the
  host/container split of the two env examples, the eight tables without a
  Prisma model, and the evidence/payments/auth routes it omitted.
- Biome (`bun run lint`) added as the linter; CI runs it, installs with
  `--frozen-lockfile`, uses the same pinned Valkey image as `docker-compose.yml`
  (the old comment claimed parity while pinning Redis), and runs
  `check:schemas` (tolerant of the missing sibling checkout only via
  `SCHEMA_SYNC_ALLOW_MISSING=1`).
- `scripts/sync-schemas.ts` drift-checks `material-status.schema.json` (it was
  validated against but never compared) and self-checks the base schema
  directory the way it already did for Core-DP; `scripts/check-protocol-parity.sh`
  (unexecutable, unreferenced, diverging list) removed; `bun run check:domains`
  added.
- Dockerfile on `oven/bun:1.4.0`, `--frozen-lockfile`, no `.env.example` copy.
- `prisma/schema.prisma` declares the `updated_at` columns migration 012 added;
  `prisma.config.ts` no longer points at a non-existent `prisma/migrations`.
- New indexes for the Core-DP search filters (`origin_city`, prefix
  `text_pattern_ops` on category/id) and a cursor predicate that can use the
  `(updated_at, id)` index (migration `019_loop_search_indexes.sql`).

### Removed
- `@aws-sdk/client-s3` dependency and `src/storage/s3.ts` (no importers; the
  `MINIO_*` configuration and its production secret check remain in place for
  when object storage is wired in).
- CHANGELOG: releases 0.5.0 and 0.6.0 had no sections of their own — every entry
  sat under `[0.6.1]` with repeated headings; split by release, with the
  per-agent-cycle duplicates consolidated.

## [0.6.1] - 2026-08-21

### Fixed
- Duplicate active LOOP transfers now return a clean state error instead of
  creating conflicting transfer state.

## [0.6.0] - 2026-08-15

### Added
- `AUTH_ENABLED` (better-auth) end-to-end coverage: provisioned the missing
  core schema (`user`/`session`/`account`/`verification`,
  `src/db/migrations/017_better_auth_schema.sql` — previously AUTH_ENABLED
  was wired in code with no schema ever applied, so the first sign-up would
  have failed on a missing relation), set an explicit `baseURL` on the
  `betterAuth()` config (removes the "Base URL is not set" warning and
  hardens redirect/callback correctness), and added real sign-up/sign-in
  (including wrong-password rejection)/session-issuance/`get-session`
  coverage in `tests/auth.enabled.test.ts`.
- Docker Compose log rotation (`json-file`, 10m/5 files) on all 5 services —
  previously unbounded, so container logs could grow without limit on a
  long-lived VPS host.
- Basic health-check alerting: `deploy/healthcheck-alert.sh` polls `/health`
  on a 5-minute systemd timer (`deploy/localloop-backend-healthcheck.timer`),
  fails loudly (non-zero exit, visible in `systemctl --failed` /
  `journalctl`) on a down or degraded node, and optionally POSTs to a
  webhook if `ALERT_WEBHOOK_URL` is set.

### Fixed
- `deploy/localloop-backend-backup.service` and `deploy/localloop-backend.service`
  hardcoded `/opt/localloop-backend`, which was never actually this project's real
  deployment path — same bug already fixed in the health-check timer service.
  Also found and stopped a hand-customized copy of `localloop-backend.service`
  running live against a stale, 8-month-old checkout with an outdated DB
  password, crash-looping every ~15s for 35+ hours (harmless in practice —
  Docker exclusively held the app's port the entire time — but wasteful).
  `localloop-backend.service` is now documented as the legacy bare-metal
  alternative to the actual, current Docker Compose deployment.
- `deploy/backup.sh` referenced the retired `minio` service/`data/minio`
  path (renamed to `seaweedfs` in `docker-compose.yml` at some prior point)
  — under `set -euo pipefail` this aborted the entire nightly backup run
  after the Postgres/Redis dumps but before the manifest write, `latest`
  symlink update, or retention cleanup. Caught by an actual backup/restore
  drill against the local dev stack, not a documentation read — see
  `localloop-agent` `evidence/pilot-readiness-2026-08-14/backup-restore-drill.md`.
  Fixed and re-verified end to end (real run, scratch `BACKUP_ROOT`, exited 0
  with correctly sized dumps for all three stores).

## [0.5.0] - 2026-08-14

### Added
- `status-updated` evidence event type: `POST /api/v1/material-status` now also writes
  to the append-only `loop_evidence` log (migration `016_loop_evidence_status_updated.sql`),
  closing a gap where status changes reached only the mutable `loop_events` SSE feed. See
  `loop-protocol/docs/retention-and-evidence-guidance.md`.
- Shared `httpCache` helpers for public short cache and no-store (agent cycle 016).
- `GET /health` includes package `version` for deploy forensics (agent cycle 010).
- `GET /health` now reports a `redis` probe (`ok` | `error` | `skipped`) alongside
  the existing database check. Either probe failure yields HTTP 503 / `degraded`
  so Traefik and Docker healthchecks surface Redis outages (agent cycle 001).

### Changed
- loop routes set no-store (agent cycle 031).
- payments routes set no-store (agent cycle 030).
- federate routes set no-store (agent cycle 029).
- Federation routes set no-store (agent cycle 025).
- Evidence routes set no-store (agent cycle 024).
- Transaction routes set no-store (agent cycle 023).
- City routes call `setNoStore` (agent cycle 021; retries cycle 014).
- `GET /api/v1/signals` uses short public cache (30s) (agent cycle 018).
- `GET /api/v1/node/info` uses short public cache (30s) (agent cycle 017).
- Interest routes set `Cache-Control: no-store` (agent cycle 015).
- City routes set `Cache-Control: no-store` (agent cycle 014).
- Dockerfile copies `src` with `--chown=app:app` and avoids a second full-tree `chown` after source copy (agent cycle 013).
- `/api/auth/status` sends `Cache-Control: no-store` (agent cycle 012).
- `/api/privacy` and `/api/metrics` send `Cache-Control: no-store` (agent cycle 011).
- README documents Redis probe and `Cache-Control: no-store` on `/health` (agent cycle 008).
- `GET /api/metrics` always lists known metric keys at zero so dashboards do not
  treat a quiet node as missing metrics (agent cycle 006).
- `GET /health` sends `Cache-Control: no-store` so proxies never cache readiness (agent cycle 005).

### Fixed
- Replaced source-string "theater" cache/metrics tests with handler inject tests
  that assert real `Cache-Control` response headers and live metrics counters
  (agent residual: honest tests).
- Metrics expose package `version`; remove broken nodeInfo cache source test that
  asserted the wrong route file (residual after agent cycles 001-100).
- Metrics key regression guard (agent cycle 100).
- Metrics key regression guard (agent cycle 096).
- Metrics key regression guard (agent cycle 092).
- Metrics key regression guard (agent cycle 088).
- Metrics key regression guard (agent cycle 084).
- Metrics key regression guard (agent cycle 080).
- Metrics key regression guard (agent cycle 076).
- Metrics key regression guard (agent cycle 072).
- Metrics key regression guard (agent cycle 068).
- Metrics key regression guard (agent cycle 064).
- Metrics key regression guard (agent cycle 060).
- Metrics key regression guard (agent cycle 056).
- Metrics key regression guard (agent cycle 052).
- Metrics key regression guard (agent cycle 048).
- Metrics key regression guard (agent cycle 044).
- CORS `allowedHeaders` includes `Idempotency-Key` so browser clients can send
  write idempotency headers without preflight failure (agent cycle 009).
- Metrics response schema now allows numeric additionalProperties so Fastify
  serialization no longer strips counter keys to `{}` (agent cycle 007).
- Privacy regression test types compile under `tsc --noEmit` (`consentPublic`
  required on insertInterest fixture; agent cycle 004).
- Interest search (`GET /api/interest?search=`) now redacts `email` from the live
  `share_email` flag instead of the materialized view snapshot, so revoking
  email sharing is effective immediately without waiting for a view refresh
  (agent cycle 003).

## [0.4.4] - 2026-07-20

### Fixed
- `GET /api/v1/material/:id` and `GET /api/v1/product/:id` now answer with
  the stored canonical MaterialDNA / ProductDNA document over
  `application/ld+json`, as openapi.json contracts; previously they leaked
  the internal database row (snake_case columns, nested `payload`,
  `application/json`). Responses are now validated against the canonical
  material-dna / product-dna schemas in `tests/specResponses.test.ts`.

## [0.4.3] - 2026-07-20

### Fixed
- `POST /api/v1/transaction` now answers an `Idempotency-Key` reused with a
  different body with the Core-DP `conflict` body (409), matching the other
  write routes; previously the conflict fell through to the global error
  handler and surfaced as a 500 `INTERNAL_ERROR`. The route's declared 409
  response schema is now a passthrough so both the §8.3 envelope and the
  Core-DP body serialize correctly.

## [0.4.2] - 2026-07-20

### Changed
- All remaining lab surfaces migrated to the spec §8.3 error envelope
  (`{error: {code, message, details?}}`): legacy lab routes (loop CRUD,
  interest, cities, payments, auth/api-key guards, SSE stream limits), the
  global 404 handler, and Fastify schema-validation rejections (now
  `INVALID_REQUEST` with `details.validation`). HTTP statuses are unchanged;
  statuses outside the canonical six map to the nearest canonical code
  (429 → `INVALID_REQUEST`, 503 → `INTERNAL_ERROR`). Mixed write-route 409s
  can still carry the Core-DP error body for Idempotency-Key conflicts.

## [0.4.1] - 2026-07-19

### Fixed
- Raised the read-only route allowance to 600 requests per 15-minute window so
  the public DEMO City view remains available for shared-network visitors;
  write routes remain independently limited to 20 requests per window.

## [0.4.0] - 2026-07-19

### Added
- Spec-required endpoints implemented (SPECIFICATION §8 / openapi.json):
  - `GET /api/v1/signals` — LoopSignalConfig JSON-LD published by the node
    (migration 015 seeds the §6.1 example configuration).
  - `POST /api/v1/transaction` — records MaterialTransaction / Settlement /
    TransactionStatus payloads validated against the canonical transaction
    schema; responds with TransactionStatus and a resolvable `settlement_url`.
  - `GET /api/v1/transaction/:id` — TransactionStatus lookup.
  - `POST /api/v1/federate/announce` and `POST /api/v1/federate/offer` —
    spec §8.2 node-to-node endpoints enforcing the §9.2 headers
    (`X-Node-ID`, `X-Node-Signature`, `X-Timestamp` ±5 minutes; signature
    presence enforced, cryptographic verification remains a documented lab
    limitation).
- `POST /api/v1/material/search` now also serves the spec §8.1 protocol
  contract (`category` glob, `radius_km` via the node's published location,
  `min_quantity` → `{results, total}`) alongside the additive Core-DP
  contract; `max_loop_cost` is rejected explicitly (LoopCost requires offer
  pricing).
- Spec §8.3 error envelope (`{error: {code, message, details}}`) on all new
  protocol endpoints.
- Three-way conformance gate `bun run check:conformance` (backend ↔
  loop-protocol ↔ docs-hub mirror): schema byte-parity, mirrored artifacts,
  and the full openapi.json route surface are verified; wired into
  `tests/conformance.test.ts` and the `protocol-parity.yml` CI workflow.
- `tests/specResponses.test.ts` validates node/info, signals, and transaction
  responses against the canonical JSON schemas.
- `NODE_LAT`/`NODE_LON` (+ optional `NODE_CITY`/`NODE_COUNTRY`) config for the
  node location required by the canonical node-info schema.
- Production config now refuses a password-less `REDIS_URL`; compose redis
  service requires `REDIS_PASSWORD`.

### Changed
- `GET /api/v1/node/info` includes the required `location` object and
  `schema_version`, and validates against the canonical node-info schema.
- Default `NODE_CAPABILITIES` is now `material-registry,loopsignal`; values
  outside the canonical enum trigger a startup warning.
- Docker Compose hardening: API container drops all capabilities, all
  services set `no-new-privileges`, redis requires authentication.
- Schema sync now also covers `transaction`, `loopsignal`, and `node-info`
  canonical schemas.

### Fixed
- Docs-hub mirror drift: `localloop-site`'s `openapi.json` copy resynced to
  the canonical loop-protocol contract (caught by the new conformance gate).
- `GET /api/v1/events` responses carried empty `payload: {}` objects —
  fast-json-stringify was stripping event contents (missing
  `additionalProperties` on the response schema).

## [0.3.1] - 2026-07-18

### Added
- `Idempotency-Key` cache rows now expire after 24 hours; a request bearing an
  expired key runs fresh instead of replaying stale data or permanently
  conflicting. Bounds how long a key can be held, since this profile's
  single-shared-API-key auth model has no caller identity to scope keys to.
- `bun run cleanup:idempotency-keys` to purge idempotency cache rows past the
  retention window.

## [0.3.0] - 2026-07-18

### Added
- Core-DP local search for MaterialDNA/ProductDNA: `POST /api/v1/material/search`
  and `POST /api/v1/product/search`, with filters, opaque cursor pagination, and
  deterministic ordering.
- Append-only evidence log, enforced at the database level (rejects `UPDATE`,
  `DELETE`, and `TRUNCATE`), recorded automatically on every material/product/
  offer/match/transfer creation; exposed via `GET /api/v1/evidence/:event_id`,
  `GET /api/v1/evidence`, and `POST /api/v1/evidence/search`.
- Signed Core-DP message envelope (`src/envelope.ts`): Ed25519 sign/verify over
  a canonical signing input, replay-window validation, and peer-key trust-store
  lifecycle checks (active/rotated/revoked).
- `Idempotency-Key` header support on material/product/offer/match/transfer
  creation, safe under concurrent retries.
- Standardized Core-DP error response shape (`src/errors.ts`) for the new
  search and evidence endpoints.
- `bun run sync:schemas` / `check:schemas` to keep this repo's schema copies
  verified byte-identical against `loop-protocol`'s canonical source.

### Fixed
- `product-dna.schema.json`'s related-materials id pattern was missing the
  required `MAT-` prefix — a drift from the canonical `loop-protocol` schema,
  corrected by the new schema sync.

## [0.2.4] - 2026-05-27

### Fixed
- Federation handshake OpenAPI body/response schemas now register as standalone
  `$ref` targets instead of unresolved `#/definitions/` pointers.
- Offer, match, transfer, and material-status schemas now require the `MAT-`
  MaterialDNA id prefix, matching the protocol spec and material-dna schema.
- Test fixtures updated to canonical `localloop.urbnia.com` JSON-LD contexts and
  `MAT-` material ids; SSE CORS tests mutate `config.allowedOrigins` directly.

## [0.2.3] - 2026-05-26

### Added
- GET endpoints for all five Loop entity types: `GET /api/v1/material/:id`,
  `/material`, `/product/:id`, `/product`, `/offer/:id`, `/offer`,
  `/match/:id`, `/match`, `/transfer/:id`, `/transfer`.
- Minimal lab `GET /api/v1/node/info` endpoint for local node metadata.
- Backup automation artifacts: `deploy/backup.sh`, systemd backup service, and timer.
- `category` and `status` query filters on list endpoints.
- Migration `010_loop_indexes.sql`: performance indexes on all loop_* tables
  (category, status, city columns, FK columns, created_at DESC).
- Health endpoint now probes the database pool and returns `db: "ok"/"error"`;
  responds `503` if the DB is unreachable.
- Pool configuration: `DB_IDLE_TIMEOUT_MS`, `DB_CONNECTION_TIMEOUT_MS`,
  `REQUEST_TIMEOUT_MS` wired through config into Fastify and pg Pool.
- Docker Compose resource limits (CPU + memory) on all four services.
- Port `127.0.0.1:8088:8088` exposed in Docker Compose for local dev.

### Changed
- `DB_POOL_SIZE` default raised from 10 to 20.
- `.env.docker.example` documents new pool/timeout vars.
- Federation handshake responses now default to the preferred v0.2.0 context/version.
- Relay validation now restricts relayed event/entity combinations to supported lab event families.
- `deploy/setup.sh` now provisions `.env.docker` for Docker-based operations.

### Security
- Rotated all `.env.docker` secrets (postgres, minio, better-auth).

### Maintenance
- Upgraded all dependencies: TypeScript 6.0.3, Prisma 7.8.0, zod 4.4.3, better-auth 1.6.11, @aws-sdk/client-s3 latest, bullmq 5.77.3, fastify 5.8.5
- Upgraded Contributor Covenant to v3.0
- Replaced personal contact with org identity (dev@mycel-ai.de)

## [0.2.2] - 2025-12-19

### Added
- Prisma v7 ORM client and schema mappings for core tables.

### Changed
- Interest and city data access now go through Prisma (raw SQL for PostGIS/search).

## [0.2.1] - 2025-12-19

### Added
- City GIS filters (bbox/near/radius) and GeoJSON FeatureCollection endpoint.
- Route-level validation for city query parameters.

## [0.2.0] - 2025-12-19

> Historical note: this entry carries a date one day before `[0.1.1]` below; the
> dates are kept as originally recorded rather than rewritten.

### Added
- Bun + Fastify API stack with Postgres, Redis, MinIO scaffolding.
- Full-text search materialized view and demo city data.
- OpenAPI JSON and Redoc documentation routes.
- Real-time interest SSE stream and BullMQ queue hooks.

### Changed
- Migrated backend runtime from Node/Express to Bun/Fastify.
- Updated Docker Compose to include Postgres 18.1, Redis, and MinIO.
- Updated systemd service to run the Bun server.

## [0.1.1] - 2025-12-20

### Added
- Minimal interop lab demo endpoints (MaterialDNA → Offer → Match → Transfer).
- Loop event log + SSE stream for demo state updates.
- Lab demo scripts (seed + simulate + one-command runner).
- Privacy notice endpoint and in-memory metrics snapshot.

[Unreleased]: https://github.com/MycelAI/LocalLOOP/compare/backend/v0.9.0...HEAD
[0.9.0]: https://github.com/MycelAI/LocalLOOP/compare/backend/v0.8.1...backend/v0.9.0
[0.8.1]: https://github.com/MycelAI/LocalLOOP/compare/backend/v0.8.0...backend/v0.8.1
[0.8.0]: https://github.com/MycelAI/LocalLOOP/compare/backend/v0.7.1...backend/v0.8.0
[0.7.1]: https://github.com/MycelAI/LocalLOOP/compare/backend/v0.7.0...backend/v0.7.1
[0.7.0]: https://github.com/MycelAI/LocalLOOP/compare/backend/v0.6.6...backend/v0.7.0
[0.6.6]: https://github.com/MycelAI/LocalLOOP/compare/backend/v0.6.5...backend/v0.6.6
[0.6.5]: https://github.com/MycelAI/LocalLOOP/compare/backend/v0.6.4...backend/v0.6.5
[0.6.4]: https://github.com/local-loop-io/localloop-backend/compare/v0.6.3...v0.6.4
[0.6.3]: https://github.com/local-loop-io/localloop-backend/compare/v0.6.2...v0.6.3
[0.6.2]: https://github.com/local-loop-io/localloop-backend/compare/v0.6.1...v0.6.2
[0.6.1]: https://github.com/local-loop-io/localloop-backend/compare/v0.6.0...v0.6.1
[0.6.0]: https://github.com/local-loop-io/localloop-backend/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/local-loop-io/localloop-backend/compare/v0.4.4...v0.5.0
[0.4.4]: https://github.com/local-loop-io/localloop-backend/compare/v0.4.3...v0.4.4
[0.4.3]: https://github.com/local-loop-io/localloop-backend/compare/v0.4.2...v0.4.3
[0.4.2]: https://github.com/local-loop-io/localloop-backend/compare/v0.4.1...v0.4.2
[0.4.1]: https://github.com/local-loop-io/localloop-backend/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/local-loop-io/localloop-backend/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/local-loop-io/localloop-backend/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/local-loop-io/localloop-backend/compare/v0.2.4...v0.3.0
[0.2.4]: https://github.com/local-loop-io/localloop-backend/compare/v0.2.3...v0.2.4
[0.2.3]: https://github.com/local-loop-io/localloop-backend/compare/v0.1.1-demo...v0.2.3
[0.1.1]: https://github.com/local-loop-io/localloop-backend/releases/tag/v0.1.1-demo

<!-- 0.2.0, 0.2.1 and 0.2.2 were never tagged, so they have no link; the 0.2.3
     comparison starts at v0.1.1-demo and covers them. Versions up to 0.6.4 link
     to the archived local-loop-io/localloop-backend repository; later versions
     to the monorepo, where tags carry the backend/ prefix. -->
