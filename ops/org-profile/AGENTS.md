# LocalLoop Org Agent Guide

This file documents the current LocalLoop multi‑repo organization, live domains,
VPS context, and operational runbooks. Keep it updated whenever domains, repos,
or infrastructure change.

## Org Overview (Repos)

- `localloop.github.io`  
  Public GitHub Pages site (Next.js static export).  
  Primary public domain: `https://local-loop-io.github.io`

- `loop-protocol`  
  Protocol spec, schemas, examples, RFCs, and JSON‑LD context source of truth.

- `localloop-backend`  
  Bun + Fastify API for interest registry, lab demo flows, metrics, SSE streams.

- `org-github-profile`  
  Organization profile docs (repo metadata/README).

## Live Domains / Endpoints

- **Public site:** `https://local-loop-io.github.io`
- **Backend API:** `https://loop-api.urbnia.com`
- **Note:** `api.local-loop.io` does **not** exist.

## VPS / Docker / Traefik

- VPS is the primary backend host; Traefik is running globally in Docker.
- Backend compose file: `localloop-backend/docker-compose.yml`
  - Containers: `localloop-backend-api`, `localloop-backend-postgres`,
    `localloop-backend-redis`, `localloop-backend-minio`.
- Typical rebuild:  
  `cd localloop-backend && docker compose up -d --build`

## Backend Quick Reference

- API base: `https://loop-api.urbnia.com`
- Health: `/api/health`
- Metrics: `/api/metrics`
- Interest list: `/api/interest`
- Interest SSE: `/api/interest/stream`
- Loop SSE: `/api/loop/stream`
- Auth status: `/api/auth/status`
- Swagger docs: `/docs`

### Config (env defaults)

See `.env.example` and `.env.docker.example`. Highlights:

- `ALLOWED_ORIGINS` (default: `https://local-loop-io.github.io`)
- `RATE_LIMIT_MAX`, `RATE_LIMIT_WRITE_MAX`
- `RATE_LIMIT_WINDOW`, `RATE_LIMIT_WRITE_WINDOW`
- `SSE_KEEPALIVE_MS`, `SSE_MAX_CLIENTS`
- `API_KEY_ENABLED`, `API_KEY`
- `AUTH_ENABLED`, `BETTER_AUTH_SECRET`

## Protocol Contexts (JSON‑LD)

- Primary JSON‑LD context:  
  `https://local-loop-io.github.io/projects/loop-protocol/contexts/loop-v0.1.1.jsonld`
- All `@context` references should point to this file (no `/v1` or `/v0.1.1` aliases).

## CI / Domain Consistency

All repos enforce domain consistency:

- Site: `localloop.github.io/scripts/check-domains.cjs`
- Protocol: `loop-protocol/scripts/check-domains.sh`
- Backend: `localloop-backend/scripts/check-domains.sh`

If you add or change domains, update:

- `DOMAIN-POLICY.md`
- Domain check scripts
- Any hardcoded URLs in spec/examples/schemas/docs

## BrowserLab

Use BrowserLab for smoke visual runs:

```bash
cd /path/to/project
browserlab run https://local-loop-io.github.io/
```

Artifacts:

- `/var/lib/browserlab/screenshots`
- `/var/lib/browserlab/reports`
- `/var/lib/browserlab/traces`
- `/var/lib/browserlab/storage-states`

## Developer Commands

### Site

```bash
cd localloop.github.io
bun install
bun run dev
bun run build
bun run test
```

### Backend

```bash
cd localloop-backend
bun install
bun test
bun run lab:demo
bun run lab:federation
```

### Protocol

```bash
cd loop-protocol
npm ci
npm test
```

## Content Claims Policy

The project is early‑stage (low TRL) with **no public pilots or deployments**.
All outward‑facing content must avoid pilot claims. Use “lab demo only” language.

## Contribution / PR Policy

Main branches are protected. Contributors must work on branches and open PRs;
only `alpha912` should merge.

## Security

Never commit secrets or credentials. Keep `.env` files local only.

