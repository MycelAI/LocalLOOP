<div align="center">

# localLOOP

**The official website of localLOOP and home of the LOOP protocol, MaterialDNA, ProductDNA, city portals, and governance.**

[![Site](https://img.shields.io/badge/site-loop.urbnia.com-4f46e5?logo=github)](https://loop.urbnia.com)
[![Protocol](https://img.shields.io/badge/protocol-spec%20v0.2.0-10b981)](../../protocol/README.md)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](#licensing)
[![Low TRL](https://img.shields.io/badge/status-lab%20demo%20only-orange)](https://loop.urbnia.com/protocol/spec)

> **Early-stage, low-TRL concept.** No public pilots or deployments. Lab demo only.

</div>

---

## What this is

This directory is the source for **[loop.urbnia.com](https://loop.urbnia.com)** (formerly localloop.urbnia.com, now redirected) — the official website of the localLOOP project and the canonical home for everything LOOP.

It does three things:

1. **Is the home of LOOP** — spec, changelog, schemas, JSON-LD contexts, and examples for the LOOP protocol, MaterialDNA, ProductDNA, and governance RFCs
2. **Documents lab concepts** — MaterialDNA, ProductDNA, city-portal concepts, implementation notes, regulatory research, and governance drafts
3. **Collects consent-based interest** — a public expression-of-interest form backed by the lab backend API in [`apps/backend`](../backend/README.md) (served same-origin under `/api/`); do not submit sensitive information

---

## Site map

| Section | URL | Description |
|---|---|---|
| Home | `/` | Project overview |
| **Protocol** | `/protocol` | Spec, changelog, security policy |
| **Platform** | `/platform` | Platform hub |
| └ MaterialDNA | `/platform/materialdna` | Material identity layer |
| └ ProductDNA | `/platform/productdna` | Draft product-identity and passport-style fields for research (not ESPR-aligned) |
| └ City Portals | `/platform/city-portals` | City landing pages |
| └ DEMO City | `/platform/demo-city` | Sample city portal |
| **Library** | `/library` | Schemas and payload examples |
| **Docs** | `/docs` | 13 implementation + reference guides |
| **Governance** | `/governance` | RFC guide, template, smart contract RFC |
| **Engage** | `/interest` | Expression of interest form |

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, static export) |
| Runtime | Bun |
| Styling | Vanilla CSS (custom design system) |
| Testing | Playwright (E2E) + Node smoke tests |
| Deploy | Docker + Traefik on VPS |
| Protocol artifacts | Mirrored from [`protocol/`](../../protocol/README.md) into `public/projects/loop-protocol/` by `scripts/aggregate-docs.sh` |

---

## Getting started

```bash
# Install dependencies
bun install

# Start dev server (http://localhost:3000)
bun run dev

# Static export → out/
bun run build

# Domain policy checks
bun run check:domains
```

---

## Testing

```bash
# Smoke tests
bun run test

# Playwright E2E (builds first, then runs against the export)
bun run test:e2e

# Single spec
bunx playwright test tests/e2e/accessibility.spec.ts
```

---

## Repo layout

```
app/
  (platform)/         # Platform section — MaterialDNA, ProductDNA, cities
  (engage)/           # Interest form, contribute, projects
  docs/               # Guides + reference pages
  governance/         # RFC guide, template, smart contracts
  library/            # Schemas + examples
  protocol/           # Spec, changelog, security
  config/
    siteRoutes.js     # Single source of truth for nav + sitemap
    sections.js       # Sidebar config for all sections
  components/         # SiteHeader, SiteFooter, Sidebar, Cards, …

public/
  projects/loop-protocol/   # Mirrored protocol artifacts (schemas, docs, contexts)
  assets/                   # CSS, JS, fonts

tests/
  e2e/                      # Playwright specs (one per key page)
  smoke.test.cjs            # Node smoke tests
```

---

## Keeping protocol content in sync

Protocol artifacts (spec, schemas, docs, JSON-LD contexts, examples, RFCs, profiles) live in the monorepo's [`protocol/`](../../protocol/README.md) tree, which is canonical. They are mirrored here under `public/projects/loop-protocol/`; never edit the mirror by hand. After any protocol change, regenerate it from the repository root and review the result:

```bash
bash apps/site/scripts/aggregate-docs.sh
git status --short    # look for unexpected deletions (D) before committing
```

The mirror keeps its public URL path, so JSON-LD contexts stay resolvable at `https://localloop.urbnia.com/projects/loop-protocol/contexts/…` (via the redirect to `loop.urbnia.com`). In `apps/backend`, `bun run check:conformance` fails if the mirror drifts from `protocol/`.

`bun run check:domains` (`scripts/check-domains.cjs`) enforces the canonical domain policy (`loop.urbnia.com`, API under `/api/`); see [`DOMAIN-POLICY.md`](DOMAIN-POLICY.md).

---

## Contributing

1. `bun install && bun run dev`
2. Follow the route + sidebar pattern in `app/config/`
3. Add a Playwright spec in `tests/e2e/` for any new interactive or critical page
4. Before opening a PR, run `bun run lint && bun run typecheck && bun run build && bun run test` (and `bun run test:e2e` for UI changes). GitHub Actions is currently disabled for the monorepo, so `scripts/ci-local.sh site` at the repository root is the gate.

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the full workflow and [`DOMAIN-POLICY.md`](DOMAIN-POLICY.md) for the canonical-domain policy.

---

## Related trees

This site is one tree of the localLOOP monorepo (formerly the standalone `local-loop-io/localloop-site` repository, now archived).

| Path | Description |
|---|---|
| [`protocol/`](../../protocol/README.md) | Protocol source — schemas, spec, RFCs, JSON-LD contexts |
| [`apps/backend/`](../backend/README.md) | Lab backend API — interest registry, demo flows, SSE, federation |
| [Monorepo root](../../README.md) | Overview, architecture, checks, licensing |

---

## Licensing

The site's source code is released under the [MIT License](LICENSE). Mirrored protocol content under `public/projects/loop-protocol/` keeps the protocol's licensing (specification prose CC BY-SA 4.0; schemas, contexts and code MIT). The localLOOP and LOOP names, the logo, favicons and the six concept images in `public/assets/images/` are reserved brand assets and are not covered by the MIT License. Per-file details are recorded with SPDX headers and the repository's `REUSE.toml`.

---

<div align="center">

Built with [Next.js](https://nextjs.org) · Deployed with Docker + Traefik · Part of the [localLOOP](https://loop.urbnia.com) project

</div>
