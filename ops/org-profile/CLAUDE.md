# LocalLoop Org Context (for AI agents)

Use this file as a quick, canonical reference for repos, domains, and ops.
Keep it in sync with AGENTS.md.

## Repos

- `localloop.github.io` — GitHub Pages site (Next.js static export)
- `loop-protocol` — Spec, schemas, examples, RFCs, JSON‑LD context
- `localloop-backend` — Bun + Fastify API + lab demo flows
- `org-github-profile` — Org profile docs

## Live URLs

- Public site: `https://local-loop-io.github.io`
- Backend API: `https://loop-api.urbnia.com`
- Deprecated / invalid: `api.local-loop.io`

## VPS / Traefik

Traefik is running globally on the VPS via Docker. Backend uses:
`localloop-backend/docker-compose.yml`.

Rebuild backend:

```bash
cd localloop-backend
docker compose up -d --build
```

## API Endpoints

- `/api/health`
- `/api/metrics`
- `/api/interest`
- `/api/interest/stream` (SSE)
- `/api/loop/stream` (SSE)
- `/api/auth/status`
- `/docs` (Swagger)

## JSON‑LD Context

All `@context` values must resolve to:

`https://local-loop-io.github.io/projects/loop-protocol/contexts/loop-v0.1.1.jsonld`

## BrowserLab

```bash
browserlab run https://local-loop-io.github.io/
```

Artifacts:
`/var/lib/browserlab/{screenshots,reports,traces,storage-states}`

## CI Domain Policy

Update `DOMAIN-POLICY.md` and domain check scripts if domains change.

## Claims Policy

No public pilots or deployments. Keep all outward messaging “lab demo only.”

