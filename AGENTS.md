# AGENTS.md - AI Agent Instructions

`CLAUDE.md` is the full guide; this is the short version for any agent.

## Layout
- `apps/backend` — Bun + Fastify API → `https://loop.urbnia.com/api/` (Traefik router `localloop-api` on the same host)
- `apps/site` — Next.js static docs hub (nginx) → `https://loop.urbnia.com`
- `localloop.urbnia.com` / `loop-api.urbnia.com` are 308 redirects to the above
- `protocol/` — LOOP spec, schemas, contexts, RFCs, `openapi.json` (canonical)
- `ops/ledger` — agent ledger + evidence; `ops/org-profile` — historical org profile

## Rules
- **This host is production.** The compose stacks in `apps/backend` and `apps/site` serve the live domains. Never `docker compose down`, touch `apps/backend/data/`, or run backend `bun test` against the default `.env` (production DB) — use a scratch `localloop_test` DB.
- `protocol/` is canonical. After changing it run `bash apps/site/scripts/aggregate-docs.sh` (and `bun run sync:schemas` in `apps/backend` for schemas), then `bun run check:conformance` in `apps/backend`. Check `git status --short` for unexpected deletions.
- Keep outward messaging “lab demo only”; never claim pilots or deployments.
- Allowed domains only (see each tree's `DOMAIN-POLICY.md`); `api.local-loop.io` and `local-loop-io.github.io` do not exist.
- Never commit secrets or `.env` files.
- Commit messages must not mention Claude/Anthropic/AI tools and carry no co-author trailers.

## Checks
- Fast, all trees: `scripts/ci-local.sh`
- Backend: `bun run typecheck && bun run lint && bun run check:conformance`
- Site: `bun run lint && bun run typecheck && bun run build && bun run test`
- Protocol: `npm ci && npm run test` (real npm: `/home/alphin/.volta/bin/npm`)

## Key files
- `apps/backend/src/server.ts`, `src/config.ts`, `src/routes/loop.ts`
- `apps/backend/docs/SPEC-COMPLIANCE.md` — spec coverage (authoritative)
- `protocol/SPECIFICATION.md`
- `apps/site/app/layout.jsx`
