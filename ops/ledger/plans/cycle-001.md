# Cycle 001 — Health reports Redis status

## Item
Add additive `redis` field to `GET /health` so operators can see queue/cache dependency status without scraping Docker logs.

## Hypothesis
Static: `/health` only probes Postgres (`pool.query('SELECT 1')`); Redis is required for interest enqueue/workers (`src/queue/index.ts`) but invisible to health.  
Local: unit tests can inject check failures.  
Live: `GET https://loop-api.urbnia.com/health` currently returns only `{status,time,uptime,db}` while redis container is healthy — field missing, not failing.

## Repos in scope
- `localloop-backend` only

## Files
- `src/routes/health.ts` — probe redis, extend response schema
- `tests/health.routes.test.ts` — new tests with injectable deps

## Acceptance criteria
1. Health JSON includes `redis` ∈ `ok|error|skipped`.
2. Existing clients still parse when only reading `status`/`db` (additive).
3. `db=error` or `redis=error` → HTTP 503 and `status=degraded`; both ok → 200/`ok`.
4. `bun test` + `bun run typecheck` pass.
5. After deploy, live `/health` includes `"redis":"ok"`.

## Cross-repo contract impact
- Expands health JSON (contract #6 in REPO_MANIFEST). Additive only; no removals.
- Old site/clients ignore unknown field → safe intermediate state.

## Migration
- No DB migration.
- Down-path: redeploy previous API image/commit (reverse of deploy order).

## Deploy order
1. `localloop-backend` api only (`docker compose up -d --build --no-deps api`)

## Rollback
1. `git checkout agent-cycle-001^` (or previous known SHA) in backend
2. Rebuild api container
3. Confirm `/health` returns 200 without requiring redis field

## Compatibility matrix
- Old consumer + new health: OK (extra field)
- New consumer expecting redis + old health: not shipped this cycle (no site change)
