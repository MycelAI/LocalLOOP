# Contributing to localLOOP Backend

Thanks for your interest in contributing! This backend is intentionally small
and focused, and it powers a **lab demo only**.

The repository-wide guide, the [root CONTRIBUTING.md](../../CONTRIBUTING.md),
covers prerequisites, the `scripts/ci-local.sh` gate, branches and commit
style, changelogs, releases and licensing. This file only adds
backend-specific guidance.

## Ground Rules
- Create a feature branch for your work and open a pull request against `main`.
- All behaviour changes must include tests.
- Record user-visible changes under `## [Unreleased]` in `CHANGELOG.md`.

## Development Setup
```bash
bun install
cp .env.example .env          # local development machines only
docker compose up -d          # local Postgres, Valkey and SeaweedFS (development only)
bun run dev
```

On the production host, `.env` already holds production settings and the
compose stack serves the live site. Don't copy over it, and don't start or stop
that stack for development.

## Checks
```bash
bun run typecheck
bun run lint
bun run check:schemas         # schema copies match protocol/
bun run check:conformance     # backend <-> protocol <-> site-mirror drift gate
```

## Testing

Run the full suite with:

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/localloop_test \
REDIS_URL=redis://:PASSWORD@HOST:PORT \
bun run test
```

Always point the tests at a disposable database such as `localloop_test`. The
suite applies migrations to whatever `DATABASE_URL` points at, and Bun loads
`.env` automatically. Variables set on the command line take precedence. Without
a reachable database, the DB-backed tests are reported as skipped.

`bun run test` invokes `bun test --isolate` (see `package.json`). Per-file
isolation is required because Bun's default runner shares module state across
test files.

### Route deps injection (preferred)

For route-level tests that need to stub DB or side-effect calls, pass an
optional deps object to the route registrar instead of using `mock.module`.
Production defaults are unchanged when deps are omitted.

```typescript
const deps = {
  getLoopEvidenceByEventId: async (eventId: string) =>
    (eventId === sampleEntry.event_id ? sampleEntry : undefined),
  listLoopEvidence: async () => listResult,
};
await registerEvidenceRoutes(app, deps);
```

See `tests/evidence.cache.headers.test.ts` and
`tests/transactions.cache.headers.test.ts` for the canonical pattern.
All cache-header route tests use deps injection; the test suite has no
`mock.module` registrations (audited cycle 0034).

### `mock.module` (avoid)

Do not add new `mock.module` stubs for route tests — they leak across test
files even with `afterAll` restore when another file imports the same module
before restore runs. Prefer route deps injection above.

If you must mock a non-route module, register at file scope and restore in
`afterAll`, and rely on `bun test --isolate` (see `package.json`). Document
why deps injection is not viable.

### Metrics assertions

In-memory metrics counters (`src/metrics.ts`) are process-global. Do not
assert hardcoded zero values — other tests may have incremented counters
first. Capture a baseline with `getMetricsSnapshot()` and compare deltas:

```typescript
const baseline = getMetricsSnapshot();
// ... exercise route ...
expect(payload.metrics.loop_material_created).toBe(
  baseline.metrics.loop_material_created,
);
```

See `tests/utility.routes.test.ts`.

## Pull Request Checklist
- [ ] Tests added/updated (run against a scratch database)
- [ ] `bun run typecheck`, `bun run lint` and `bun run check:conformance` pass
- [ ] Documentation and `docs/SPEC-COMPLIANCE.md` updated if behaviour changes
- [ ] `CHANGELOG.md` `[Unreleased]` updated
- [ ] No secrets committed

## Contact
Questions? Email dev@mycel-ai.de.
