<div align="center">

# localLOOP · Docs Hub

**The public face of the LOOP protocol — specification, schemas, governance, and an interest registry for the circular economy.**

[![Deploy](https://github.com/local-loop-io/local-loop-io.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/local-loop-io/local-loop-io.github.io/actions/workflows/deploy.yml)
[![Site](https://img.shields.io/badge/site-local--loop--io.github.io-4f46e5?logo=github)](https://local-loop-io.github.io)
[![Protocol](https://img.shields.io/badge/protocol-loop--protocol-10b981?logo=github)](https://github.com/local-loop-io/loop-protocol)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Low TRL](https://img.shields.io/badge/status-lab%20demo%20only-orange)](https://local-loop-io.github.io/protocol/spec)

> **Early-stage, low-TRL concept.** No public pilots or deployments. Lab demo only.

</div>

---

## What this is

This repository is the source for **[local-loop-io.github.io](https://local-loop-io.github.io)** — a statically exported Next.js site that serves as the public hub for the localLOOP project.

It does three things:

1. **Publishes the LOOP protocol** — spec, changelog, schemas, JSON-LD context, and examples, mirrored from [`loop-protocol`](https://github.com/local-loop-io/loop-protocol)
2. **Documents the platform** — MaterialDNA, ProductDNA, city portals, implementation guides, governance, and regulatory alignment
3. **Collects interest** — a public expression-of-interest form backed by the [localloop-backend](https://github.com/local-loop-io/localloop-backend) API

---

## Site map

| Section | URL | Description |
|---|---|---|
| Home | `/` | Project overview |
| **Protocol** | `/protocol` | Spec, changelog, security policy |
| **Platform** | `/platform` | Platform hub |
| └ MaterialDNA | `/platform/materialdna` | Material identity layer |
| └ ProductDNA | `/platform/productdna` | Product digital passport (ESPR Art. 9-10) |
| └ City Portals | `/platform/city-portals` | City landing pages |
| └ DEMO City | `/platform/demo-city` | Sample city portal |
| **Library** | `/library` | Schemas and payload examples |
| **Docs** | `/docs` | 9 implementation + reference guides |
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
| Deploy | GitHub Pages via Actions |
| Protocol artifacts | Mirrored from `loop-protocol` into `public/projects/loop-protocol/` |

---

## Getting started

```bash
# Install dependencies
bun install

# Start dev server (http://localhost:3000)
bun run dev

# Type-check
bun run typecheck

# Static export → out/
bun run build
```

---

## Testing

```bash
# Smoke tests
bun run test

# Playwright E2E (builds first, then runs against the export)
bun run test:e2e

# Single spec
bunx playwright test tests/e2e/platform.spec.ts
```

---

## Repo layout

```
app/
  (platform)/         # Platform section — MaterialDNA, ProductDNA, cities
  (engage)/           # Interest form, contribute, projects
  docs/               # 9 guides + reference pages
  governance/         # RFC guide, template, smart contracts
  library/            # Schemas + examples
  protocol/           # Spec, changelog, security
  config/
    siteRoutes.js     # Single source of truth for nav + sitemap
    sections.js       # Sidebar config for all sections
  components/         # SiteHeader, SiteFooter, Sidebar, Cards, …

public/
  projects/loop-protocol/   # Mirrored protocol artifacts (schemas, docs, contexts)
  viewer.html               # Lightweight markdown + JSON viewer
  assets/                   # CSS, JS, fonts

tests/
  e2e/                      # Playwright specs (one per key page)
  smoke/                    # Node smoke tests
```

---

## Keeping protocol content in sync

Protocol artifacts (schemas, docs, JSON-LD contexts) live in [`loop-protocol`](https://github.com/local-loop-io/loop-protocol) and are mirrored here under `public/projects/loop-protocol/`. When the protocol repo is updated, copy the changed files into that directory and commit.

The `Domain Consistency` CI workflow validates that all internal links respect the canonical domain policy (`local-loop-io.github.io` / `loop-api.urbnia.com`).

---

## Contributing

1. Fork and clone
2. `bun install && bun run dev`
3. Follow the route + sidebar pattern in `app/config/`
4. Add a Playwright spec in `tests/e2e/` for any new page
5. Open a PR — CI runs build + E2E before merge

For org-level context, domain policy, and agents guidance see [`AGENTS.md`](../AGENTS.md) in the monorepo root.

---

## Related repos

| Repo | Description |
|---|---|
| [`loop-protocol`](https://github.com/local-loop-io/loop-protocol) | Protocol source — schemas, spec, RFCs, JSON-LD contexts |
| [`localloop-backend`](https://github.com/local-loop-io/localloop-backend) | Lab backend API — interest registry, demo flows, SSE, federation |

---

<div align="center">

Built with [Next.js](https://nextjs.org) · Deployed on [GitHub Pages](https://pages.github.com) · Part of the [localLOOP](https://local-loop-io.github.io) project

</div>
