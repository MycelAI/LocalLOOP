# Security Policy

The reporting process, response targets, supported versions and scope for all
of localLOOP are in the [root security policy](../../SECURITY.md).

## Reporting a vulnerability

Please report security issues by emailing **dev@mycel-ai.de** (GitHub: @alpha912).
Do not open public issues for security-sensitive reports.

## Scope

This tree contains the localLOOP backend API (lab demo only), served at
`https://loop.urbnia.com/api/`. Its code, configuration, container setup and
dependencies are in scope.

## Response timeline

- Initial response: within 48 hours
- Status update: within 5 business days

## Secure deployment notes

- Keep the API off the public internet. Compose publishes it only on
  `127.0.0.1:8088`; the only public path is the shared Traefik's
  `localloop-api` router (`https://loop.urbnia.com/api/*`, TLS terminated at
  Traefik).
- Keep `ALLOWED_ORIGINS` limited to the site origin, which by default is
  `https://loop.urbnia.com`.
- Run with `NODE_ENV=production`. The config then refuses missing or weak
  secrets (`DATABASE_URL` password, `STORAGE_SECRET_KEY`, `BETTER_AUTH_SECRET`
  and `API_KEY` when enabled) and a `REDIS_URL` without a password.
- PostgreSQL, Valkey and SeaweedFS listen on loopback ports only. Keep their
  data directories (`data/`) and nightly dumps (`backups/`) out of version
  control and readable only by the service owner.
- Keep `.env` and `.env.docker` git-ignored and never commit them.
- Never run the test suite against the production database. See the root
  [CONTRIBUTING.md](../../CONTRIBUTING.md#backend-tests-need-a-scratch-database).

*Last reviewed: 2026-10-14*
