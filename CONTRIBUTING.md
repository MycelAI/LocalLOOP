# Contributing to localLOOP

Thanks for helping with localLOOP. This monorepo holds the LOOP protocol, the
public documentation hub and the lab-only backend API. The project is
early-stage (low TRL) and a **lab demo only**: there are no public pilots or
deployments, and contributions must not suggest otherwise.

By taking part you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
Security problems go to [SECURITY.md](SECURITY.md), never to a public issue.

## Who can contribute

This repository (`MycelAI/LocalLOOP`) is private, and contributions are by
invitation. The former public repositories under `github.com/local-loop-io/`
are archived and read-only. If you don't have access and want to propose
something, report a problem or ask a question, email **dev@mycel-ai.de**
(see [SUPPORT.md](SUPPORT.md)).

## Repository layout

| Path | What it is | Toolchain |
| --- | --- | --- |
| `apps/backend` | Bun + Fastify API, served under `https://loop.urbnia.com/api/` | Bun, `pg` (plain SQL), PostgreSQL/PostGIS, Valkey |
| `apps/site` | Next.js static documentation hub, served at `https://loop.urbnia.com` | Bun, Next.js, Playwright |
| `protocol` | LOOP specification, JSON Schemas, JSON-LD contexts, RFCs, profiles, `openapi.json` (canonical) | Node.js + npm, AJV |
| `ops/ledger` | Internal ledger, evidence and plans (proprietary, not for outside contributions) | none |
| `ops/org-profile` | Source of the historical `local-loop-io` GitHub org profile | Bash |
| `scripts/ci-local.sh` | The local check gate for all trees | Bash |

Each tree has its own toolchain and lockfile; there is no root workspace.
Tree-specific notes live in each tree's `CONTRIBUTING.md`:
[backend](apps/backend/CONTRIBUTING.md), [site](apps/site/CONTRIBUTING.md),
[protocol](protocol/CONTRIBUTING.md).

## Prerequisites

- **Bun 1.4.x**, the version used by the backend and site Dockerfiles
  (`oven/bun:1.4.0`).
- **Node.js 24.19 or newer**, as required by `engines` in every `package.json`.
  The backend and site pin `24.19.0` through Volta.
- **npm** for `protocol/`, which uses `package-lock.json`. If `npm` in your shell
  is an alias for Bun, call the real npm binary directly (for example the one
  installed by Volta).
- **Docker Compose**, only if you want to run the backend's PostgreSQL, Valkey
  and SeaweedFS services locally.

## Running the checks

GitHub Actions is disabled on this repository, so **`scripts/ci-local.sh` is
the gate. Run it before every push.**

```bash
bash scripts/ci-local.sh                     # all targets
bash scripts/ci-local.sh protocol site       # selected targets
```

The targets are `protocol`, `conformance`, `backend`, `site` and `org-profile`.
`conformance` re-runs `apps/site/scripts/aggregate-docs.sh` and fails if the
site mirror differs from the committed copy. Commit the regenerated mirror
together with the `protocol/` change that caused it.

Per tree (all of these scripts exist in the tree's `package.json`):

| Tree | Install | Fast checks | Full checks |
| --- | --- | --- | --- |
| `protocol` | `npm ci` | `npm test` (schemas, schemas README, doc markers) | plus `npm run check:domains` and `npm run conformance:core-dp` (or `:battery`, `:packaging`, `:waste-shipment`) |
| `apps/site` | `bun install` | `bun run lint && bun run typecheck` | `bun run build && bun run test`, then `bun run test:e2e` (Playwright) |
| `apps/backend` | `bun install` | `bun run typecheck && bun run lint` | `bun run check:conformance` and `bun run test` (see below) |
| `ops/org-profile` | none | `bash scripts/check-policy.sh && bash scripts/check-security-pointer.sh` | same |

### Backend tests need a scratch database

`bun run test` in `apps/backend` applies migrations to whatever
`DATABASE_URL` points at. Bun loads `apps/backend/.env` automatically, and on
the production host that file points at the **production** database. Never
run the backend tests against it. Point the run at a disposable database
(conventionally `localloop_test`) and an explicit, password-authenticated
`REDIS_URL`. Variables set on the command line override `.env`:

```bash
cd apps/backend
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/localloop_test \
REDIS_URL=redis://:PASSWORD@HOST:PORT \
bun run test
```

Without a reachable database, the DB-backed tests are reported as skipped,
not passed.

## Cross-tree sync rules

`protocol/` is the source of truth. The backend keeps byte-identical schema
copies, and the site mirrors protocol artifacts under
`apps/site/public/projects/loop-protocol/`. Never edit the mirror by hand.

1. After any change under `protocol/{schemas,contexts,docs,examples,rfcs,profiles}`,
   `protocol/openapi.json`, `protocol/SPECIFICATION.md` or the mirrored top-level
   protocol docs (`README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`,
   `CODE_OF_CONDUCT.md`, `SECURITY.md`, `DOMAIN-POLICY.md`, `LICENSE`,
   `PROJECT_STRUCTURE.md`), run `bash apps/site/scripts/aggregate-docs.sh`.
2. For schema changes, also run `bun run sync:schemas` in `apps/backend`.
3. Run `bun run check:conformance` in `apps/backend`.
4. Run `git status --short` and look for unexpected `D` (deleted) lines before
   committing.

If you add RFC 2119 clauses to `protocol/SPECIFICATION.md`, re-pin
`protocol/profiles/core-dp/requirements/spec-v0.2.0-normative-manifest.json`.

Every URL and identifier uses `https://loop.urbnia.com` (site, JSON-LD
contexts, schema `$id`s) and `https://loop.urbnia.com/api/` (API). The former
hosts `localloop.urbnia.com` and `loop-api.urbnia.com` only redirect; the
domain checks reject them outside changelog history and the redirect
configuration. See each tree's `DOMAIN-POLICY.md`.

## Branches, commits and pull requests

- Work on a feature branch and open a pull request against `main`. Only the
  project steward (@alpha912) merges.
- Keep pull requests focused, ideally on one tree. Fill in the
  [pull request template](.github/PULL_REQUEST_TEMPLATE.md).
- Use [Conventional Commits](https://www.conventionalcommits.org/) as in the
  existing history: `type(scope): short imperative summary`, where the scope is
  usually the tree (`backend`, `site`, `protocol`, `org-profile`) or a tool
  (`ci-local`). Common types are `feat`, `fix`, `docs`, `refactor`, `style`
  and `chore`. Examples: `fix(site): serve JSON-LD contexts as application/ld+json`,
  `chore(backend): release 0.6.5`.
- Commit messages describe the change as written by its human author. Do not
  add tool names, generated-by notes or co-author trailers for tools.
- Never commit secrets, `.env` files, database dumps or anything from
  `apps/backend/data/` or `apps/backend/backups/`.

## Changelogs, versions and releases

- Each tree has a `CHANGELOG.md` in [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
  format. Add user-visible changes under `## [Unreleased]` in the tree you
  touch, in the same pull request.
- Each tree is versioned independently with [Semantic Versioning](https://semver.org/)
  in its own `package.json`.
- A release moves the Unreleased entries to a dated version section, bumps
  `package.json`, is committed as `chore(<tree>): release X.Y.Z` and gets an
  annotated tag `<tree>/vX.Y.Z` (for example `backend/v0.6.5`). Releases are
  cut by the steward and follow
  [RELEASE-CHECKLIST.md](protocol/docs/governance/RELEASE-CHECKLIST.md).

## Protocol changes and RFCs

Changes to the protocol's schemas, API surface, interoperability rules or
security and governance requirements go through an RFC. Copy
`protocol/rfcs/0000-template.md` to `protocol/rfcs/NNNN-short-title.md`, fill
in every section and open a pull request. See the
[RFC index](protocol/rfcs/README.md) and
[GOVERNANCE.md §2](protocol/docs/governance/GOVERNANCE.md#2-rfc-and-decision-process)
for states and review windows.

## Governance and ownership

- [GOVERNANCE.md](protocol/docs/governance/GOVERNANCE.md) is the project
  charter. The project steward and merge authority is **@alpha912**. The
  protocol, backend and docs/site maintainer roles are currently **unassigned**.
- While there are fewer than two eligible maintainers, the quorum and
  independent-review rules are narrowly superseded by
  [RFC-0005](protocol/rfcs/0005-solo-operator-governance-override.md)
  (solo-operator override).
- [CODEOWNERS](.github/CODEOWNERS) requests review from @alpha912 for every path.

## Claims policy

All outward-facing text (docs, site copy, READMEs, release notes, commit
messages) must use "lab demo only" language. Do not claim or imply pilots,
deployments, production readiness, compliance, certification or regulatory
alignment. See
[CLAIMS-AND-MATURITY.md](protocol/docs/governance/CLAIMS-AND-MATURITY.md).

## Licensing of contributions

Contributions are accepted **inbound = outbound**: by submitting a
contribution you agree that it is licensed under the licence that already
applies to the part of the repository you change. There is no separate
contributor licence agreement or sign-off requirement.

- Code, scripts, JSON Schemas, JSON-LD contexts and `openapi.json`: MIT.
- Protocol specification prose under `protocol/`: CC-BY-SA-4.0.
- The localLOOP and LOOP names, the logo, the favicons and the concept images are
  reserved by Mycel UG (haftungsbeschränkt) and are not openly licensed.
- `ops/ledger` is proprietary internal material.

The licence files and per-file SPDX information (`LICENSE`, `LICENSES/`,
`REUSE.toml`) are authoritative. Only contribute work you have the right to
submit, and credit third-party sources.

## Questions

Email **dev@mycel-ai.de**. There is no GitHub Discussions forum for this
project.
