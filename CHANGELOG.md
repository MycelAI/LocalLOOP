# Changelog

Repository-wide changes to the localLOOP monorepo: layout, shared tooling,
hosting and documentation that span more than one tree.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Entries here are **not versioned**: the monorepo itself is never released.
Each tree is versioned with [Semantic Versioning](https://semver.org/spec/v2.0.0.html),
tagged as `<tree>/vX.Y.Z`, and keeps its own release notes:

| Tree | Changelog | Tag prefix |
| --- | --- | --- |
| Backend API | [`apps/backend/CHANGELOG.md`](apps/backend/CHANGELOG.md) | `backend/` |
| Documentation site | [`apps/site/CHANGELOG.md`](apps/site/CHANGELOG.md) | `site/` |
| LOOP protocol | [`protocol/CHANGELOG.md`](protocol/CHANGELOG.md) | `protocol/` |
| Org profile (historical) | [`ops/org-profile/CHANGELOG.md`](ops/org-profile/CHANGELOG.md) | `org-profile/` |

A change that ships in a tree is recorded in that tree's changelog; this file
only notes it when it affects the repository as a whole. Dated sections below
use the date the change landed on `main`.

## Unreleased

## 2026-10-15

### Changed
- The repository is public: https://github.com/MycelAI/LocalLOOP. Before
  the switch the full history was scanned (gitleaks, plus a check that no
  production secret value appears in any blob); the only hits were test
  fixtures. Contributor docs, the licence notice, the site (footer, API page,
  contribute page, `llms.txt`, `SoftwareSourceCode` structured data, site
  0.12.0) and every `package.json` point to it.
- GitHub Actions runs again (free for public repositories). A new
  always-running `Gate` workflow runs `scripts/ci-local.sh` on every pull
  request and push and is the required check for `main`, which is now
  protected (pull requests only, linear history, no force pushes or
  deletion). `conformance.yml` had a duplicated `working-directory` key that
  made GitHub reject the whole workflow; fixed.
- Secret scanning with push protection, Dependabot alerts and security
  updates, and private vulnerability reporting are on.
- The archived `local-loop-io` repositories and organization profile now
  point to this repository.
- `main` accepts pushes and merges from @alpha912 only; everyone else
  contributes by pull request (forks for outside contributors). `CONTRIBUTING.md`
  documents the fork, Gate and rebase-merge flow; `SECURITY.md` and the issue
  chooser offer GitHub's private vulnerability reporting next to email.

### Changed
- Site performance, SEO and GEO (site 0.11.0): Lighthouse 100 for
  accessibility, best practices and SEO, and desktop performance 99-100
  (mobile 84-93); a small logo and a subset icon font, bundled
  stylesheets, Markdown rendered at build time, a social card,
  `Organization`/`WebSite`/`TechArticle` structured data and `llms.txt`.
  The full Phosphor icon source moved to `apps/site/assets-src/phosphor/`
  (listed in `REUSE.toml` and the third-party notices).

### Security
- Production hardening after a deployment audit (backend 0.10.0, site 0.10.0):
  the API sits on a dedicated `localloop-edge` network shared only with
  Traefik and trusts forwarded client addresses only from it; Traefik rate
  limits every localLOOP router; the relay and federation ingest routes
  always need the API key; per-IP stream caps; unprivileged, read-only
  containers with process limits; images pinned by digest; owner-only
  backups. The shared Traefik compose file lists the new network.

## 2026-10-14

### Changed
- Every dependency, runtime and image at its latest stable release (backend
  0.9.1, site 0.9.0; protocol was already current); host Bun 1.4.3.
- The backend uses plain parameterized SQL through `pg` only; Prisma is
  removed (backend 0.9.0) and `ci-local.sh` no longer runs `prisma generate`.
- Routing: the shared Traefik sends `loop.urbnia.com/api/*` straight to the
  backend (router `localloop-api`) and everything else to the site's nginx,
  which no longer proxies the API; the `storage-proxy` nginx in front of
  SeaweedFS and the unused bare-metal nginx example are removed (backend
  0.8.0, site 0.8.0). The architecture diagrams show the new routing.
- **`loop.urbnia.com` and `loop.urbnia.com/api/` are the only canonical hosts,
  across every tree.** Protocol identifiers (JSON-LD contexts, `@vocab`, schema
  `$id`s, examples, conformance vectors) moved off `localloop.urbnia.com` in
  loop-protocol 0.6.0, backend 0.7.0 and site 0.7.0. The former hostnames only
  308-redirect; `scripts/ci-local.sh domains` and the per-tree domain checks
  reject them outside changelog history, the domain policies, the Traefik
  redirect labels and descriptions of those redirects. Historical lab records
  in production keep the IRIs they were registered with (covered by
  append-only evidence hashes).
- Copyright line unified as "2025-2026 Alphin Tom / Mycel UG
  (haftungsbeschränkt)". The protocol licence split now covers every file
  (code and machine-readable files MIT, prose CC BY-SA 4.0). The logo,
  favicons, the localLOOP/LOOP names and the concept images are reserved
  (`LicenseRef-Mycel-Brand`); `ops/ledger` is internal
  (`LicenseRef-Mycel-Proprietary`). The site footer states this instead of
  "All rights reserved".
- `protocol/LICENSES/CC-BY-SA-4.0.txt` is the full legal code instead of a
  summary, and the site mirror now includes `protocol/LICENSES/`.
- Per-tree READMEs, changelog link references and protocol documentation now
  point at the monorepo paths and at `loop.urbnia.com` instead of the archived
  repositories and the former hostnames.
- `https://loop.urbnia.com` is the home of localLOOP: the site serves the
  documentation hub and proxies the API under `/api/` on the same origin.
  `localloop.urbnia.com` and `loop-api.urbnia.com` now answer with 308
  redirects. Protocol identifiers followed later the same day (see the first entry).
- Consolidated the former `local-loop-io` repositories into this monorepo with
  full history: `localloop-backend` → `apps/backend`, `localloop-site` →
  `apps/site`, `loop-protocol` → `protocol`, `.github` → `ops/org-profile`,
  and the local `localloop-agent` ledger → `ops/ledger`. Former tags carry a
  tree prefix (`backend/v0.6.4`, `site/v0.6.0`, `protocol/v0.5.2`,
  `org-profile/v0.2.1`); the original repositories are archived.
- Cross-repository paths rewired for the monorepo layout; CI workflows moved
  to the root `.github/` and are path-filtered per tree.

### Added
- Root README rewritten: project overview, live screenshots, light and dark
  architecture diagram, requirements, verified per-tree quickstarts, examples,
  limitations, documentation map and licensing summary. New artwork lives in
  `docs/assets/`.
- Licensing metadata following REUSE 3.3: SPDX headers in source files,
  `REUSE.toml` for everything else, full licence texts in `LICENSES/`, and a
  root `LICENSE` mapping each path to its terms. `NOTICE` lists the
  attribution obligations; `THIRD_PARTY_NOTICES.md` (generated by
  `scripts/third-party-notices.mjs`) lists vendored assets and every npm
  package shipped in the site and backend images.
- Legal material ships with the artefacts: `scripts/sync-legal.sh` copies it
  to `apps/site/public/licenses/` (served at `/licenses/`, with a
  `/docs/licenses/` page) and into the backend image; `--check` guards drift.
- `scripts/release-sbom.sh`: CycloneDX 1.6 SBOMs per tree into `dist/sbom/`.
- Community files at the repository root: `CONTRIBUTING.md`, `SECURITY.md`,
  `SUPPORT.md`, Contributor Covenant 3.0 `CODE_OF_CONDUCT.md`, GitHub issue
  forms and a pull-request template; `CODEOWNERS` lists every tree.
- `scripts/check-links.mjs`: dependency-free offline checker for relative
  links and heading anchors in all Markdown files; `--external` also probes
  http(s) links.
- `scripts/ci-local.sh` gains `reuse` and `links` targets (both in the
  default run) and legal-copy drift checks in the backend and site targets.
- This root changelog.
- `scripts/ci-local.sh`, the local gate covering every tree. GitHub Actions is
  disabled for this repository (organisation billing), so this script is the
  check to run before pushing.
