# Changelog

All notable changes to the localLOOP website will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.3] - 2026-07-18

### Added
- `<MaturityStatus />` to the LoopCoin, LoopSignal, and City Portals pages,
  which were missing it despite every comparable platform page (MaterialDNA,
  ProductDNA, LoopCost) carrying it.

### Fixed
- The mirrored protocol markdown files (spec, regulatory-alignment roadmap,
  etc.) served as `application/octet-stream`, which forces a browser
  download instead of displaying the content. Now served as `text/plain`.
  (The pages themselves still deliberately link out rather than render this
  content inline — that's an intentional, test-enforced design choice, not a
  bug — but the link now actually shows you the content when you follow it.)

## [0.3.2] - 2026-07-18

### Changed
- Homepage title now reads "localLOOP | Circular Economy Infrastructure for
  Cities" (brand-first, matching common homepage convention) instead of
  "Lab-only interoperability research | localLOOP".
- Homepage hero copy simplified to one confident, factual sentence plus a
  single maturity caveat, replacing three stacked disclaimer clauses. Also
  drops an unearned "meeting emerging EU data and product passport
  requirements" claim reintroduced by an earlier edit, which the project's
  own Claims Policy prohibits without evidence.

### Fixed
- The global `:focus-visible` outline no longer matches `tabindex="-1"`
  elements (e.g. the `#main-content` skip-link target), which some browsers
  were treating as "always show a ring" even for ordinary mouse clicks —
  visible as an unexpected orange box around the page content. The
  `#main-content` highlight itself now uses `:focus-visible` instead of
  `:focus`, so it still appears for real keyboard/skip-link use.
- Removed a duplicate, conflicting `.card`/`.card:hover` rule block (a
  leftover from an earlier edit that was never removed) that fought the
  later "Enhanced card hover" rules over `transform` and `transition` timing,
  causing the jerky/jumpy card hover animation. Also fixed a stray hardcoded
  hover border color that didn't match the actual `--accent` variable.

## [0.3.1] - 2026-07-18

### Removed
- Deprecated GitHub Pages deployment workflow (`.github/workflows/pages.yml`).
  The site has been hosted at `https://localloop.urbnia.com` via Docker +
  Traefik for some time; the Pages workflow kept redeploying a stale mirror to
  `local-loop-io.github.io`, a domain this project's own `DOMAIN-POLICY.md`
  explicitly disallows. GitHub Pages is also disabled at the repo settings
  level so the stale mirror stops being served.

## [0.3.0] - 2026-07-18

### Changed
- Protocol specification and regulatory research now link to their repository-owned canonical draft artifacts instead of rendering the drafts inline, with a visible lab-only scope boundary.
- Reframed site-owned platform, DPP, routing, and demo claims as lab-only exploratory material; added a reusable visible lab-status treatment.
- DEMO City is now read-only in the public site. Public material registration was removed; write-capable evaluation is directed to the controlled local lab guide.
- Interest submission now communicates public consent, privacy/deletion guidance, disables the submit control while sending, and never renders raw server errors.
- A successful interest submission now confirms receipt only; public-list visibility remains dependent on consent and service processing.
- Added canonical-route coverage for section hubs and key lab/docs routes; legacy aliases now carry canonical noindex metadata plus a safe client-side redirect and fallback link for static hosting.

### Accessibility
- Added skip-to-main behavior, global visible focus and target treatment, one main landmark per primary template, keyboard tabs, pause controls, reduced-motion handling, and mobile-menu Escape focus return.
- Added deterministic browser coverage for landmark/heading/skip behavior, tabs, mobile focus return, reduced motion, aliases, and read-only demo interactions.

### Fixed
- Route-scoped feature scripts now load only for interest, metrics, and DEMO City routes, with abort/stream/timer/listener cleanup, script removal, and feature-global teardown on client navigation.
- Added reusable canonical, Open Graph, Twitter, and JSON-LD metadata primitives using `https://localloop.urbnia.com` as the canonical base.

## [0.2.8] - 2026-05-27

### Added
- Six 16:9 illustrated assets for the homepage Key Concepts showcase
  (`localloop-01` through `localloop-06`).

### Fixed
- API docs smoke test expects the canonical `localloop.urbnia.com` OpenAPI mirror
  URL instead of the deprecated GitHub Pages domain.

## [0.2.7] - 2026-05-26

### Fixed
- DEMO City E2E test selector updated to match new page content (`/no public deployment/i` replacing stale `/no active deployments yet/i`)

## [0.2.6] - 2026-05-26

> Historical release note: the following described the lab demo at that release. The current public DEMO City route is read-only and does not create records or perform settlement.

### Added
- `/platform/demo-city` fully wired city portal with live backend data:
  - Node heartbeat — fetches `/health`, shows live/offline status with pulsing dot
  - Activity stats — live counts of materials, offers, matches, transfers
  - Material registry — live table from `/api/v1/material` with city filter buttons (All / Munich / Berlin / DEMO nodes)
  - Protocol flows — tabbed live tables for Offers, Matches, and Transfers
  - Register Material form — POST to `/api/v1/material`, generates MAT- prefixed ID, refreshes registry on success
  - Live event stream — SSE connection to `/api/v1/stream`, pre-seeded with recent events from `/api/v1/events`
  - LoopSignal panel — visual bar chart of demo node signal values with explanation
  - Node capabilities summary with links to spec, portals, and interest form
- `public/assets/js/demo-city.js` — client-side wiring: fetch, SSE, form submit, tabs, filters, auto-refresh (30s)
- Demo city CSS — heartbeat, stat grid, filter/tab buttons, data tables, status badges, stream log, signal bar chart

## [0.2.5] - 2026-05-26

### Added
- `/platform/loopcoin` page: LoopCoin concept, how it works (issuance, transfers, inter-node settlement, expiry/decay), data model snapshot, schema viewer
- `/platform/loopsignal` page: LoopSignal concept, signal values, material categories, governance (SignalProposal → LoopVote), routing effect, data model snapshot, schema viewer
- `/platform/loopcost` page: LoopCost formula explanation, four components (base price, export penalty, import penalty, distance cost), why local-first routing works, relationship to LoopSignal and LoopCoin

### Changed
- Platform hub (`/platform`) restructured into three sections: Identity layers, Exchange mechanics (LoopCoin, LoopSignal, LoopCost), City portals
- Platform hub intro updated to mention all five protocol concepts

## [0.2.4] - 2026-05-26

### Added
- "Who is this for?" section on homepage with three audience cards: Cities & Municipalities, Operators & Logistics, Researchers & Labs — each linking to the relevant entry point
- "For city decision-makers" FAQ section: cost/investment, GDPR/data residency, governance model, and EU mandate timeline questions
- "City Operations Terms" glossary section: Node Operator, Audit Trail, Federation, Data Residency, Governance
- "Executive Summary for City Decision-Makers" at the top of the Implementation Guide: staffing, infrastructure, cost, and data residency overview
- City Action Timeline table in Regulatory Alignment Roadmap: maps DIWASS (May 2026), PPWR (Aug 2026), Green Claims (Sep 2026), ESPR DPP first wave (2026-2027), Battery Passport (Feb 2027) to city planning checkpoints
- City-facing intro note on Docs hub page with direct links to Regulatory Alignment and Implementation Guide
- CSS `.concept-card a` link style for homepage audience cards

### Changed
- Docs hub card order: Regulatory Alignment and Implementation Guide now lead; FAQ and Glossary promoted to top section
- FAQ card description updated to reflect new city-focused content
- Glossary card description updated to mention city operations terms
- GitHub org profile: spec badge updated to v0.2.2, EU DPP/ESPR alignment tagline added, "Register interest" elevated to top of Where to Start table, Regulatory Alignment and Implementation Guide rows added

## [0.2.3] - 2026-05-26

### Added
- `.status-notice` component (amber callout) used across Platform and City Portals pages to surface lab-demo status prominently
- "Why cities care" sections on MaterialDNA and ProductDNA pages with city-specific use cases (traceability, circular procurement, EPR, DPP readiness, fraud prevention)
- "What happens next" and direct contact pathway on Interest page
- Intro context panels on Threat Model and DPIA Lite docs pages (scope, method, applicability)

### Changed
- Homepage hero description rewritten for city decision-makers: clearer operational language, drops jargon
- Homepage CTA updated: "Register Interest" / "Explore the demo" replacing generic "Express Interest" / "Contribute"
- Homepage City Portals explore card updated to clarify no live deployments
- Platform Hub: "early-stage research" status notice added prominently below heading
- City Portals: status notice leads the page before any portal listings

### Fixed
- DEMO City "Review the protocol" card link corrected from `/projects` to `/protocol/spec`

## [0.2.2] - 2026-05-26

### Changed
- Mirrored loop-protocol v0.2.2 changes: MaterialDNA `id` pattern now requires `MAT-` prefix across all schemas; all 15 examples updated to `schema_version: "0.2.0"` and `loop-v0.2.0.jsonld` context
- Protocol spec viewer now includes §3.6 entity status-transition reference table

## [0.2.1] - 2026-05-26

### Fixed
- `/contribute/CODE_OF_CONDUCT.md` URL now redirects to `/contribute` instead of returning 404

### Changed
- 404 page redesigned: hero-style layout with large gradient "404", clean title/description, and 3-card quick links (Protocol, Docs, Library)

### Removed
- Floating "Express Interest" sticky CTA button and all associated CSS

## [0.2.0] - 2026-05-26

### Added
- Floating pill navigation with scroll-triggered morph to frosted glass sticky bar
- Hero section full-bleed background extending behind transparent header
- CTA section edge-to-edge full-width layout
- Protocol spec viewer with Mermaid diagram rendering and syntax highlighting
- ProductDNA documentation pages
- Lab API documentation refresh
- §2.1 canonical definitions and expanded glossary pages
- Scroll-based header behaviour with data-scrolled state and CSS transitions

### Changed
- Navigation restructured: Protocol-first, Platform section hub with sub-pages
- Header: transparent background, floating pill replaced header strip
- Logo icon vertical alignment fixed (centered, no descenders compensation)
- Site rebranded to localLOOP with updated wordmark and hero visual
- Homepage hero now fills to top edge; gradient background covers header area

### Fixed
- E2E test selectors updated for new heading and nav structure
- Materialdna E2E strict mode exact heading match

### Maintenance
- Upgraded Next.js to 16.2.6, React to 19.2.6, @playwright/test to 1.60.0
- Added dependency overrides to clear bun audit (dompurify, uuid, postcss, lodash-es)
- Upgraded Contributor Covenant to v3.0
- Replaced personal contact with org identity (dev@mycel-ai.de)

## [0.1.1] - 2025-12-20

### Added
- Initial localLOOP site with protocol documentation viewer
- Interest registry integration
- City portals and GeoJSON map data
- Lab demo federation documentation
- API docs and metrics dashboard

---

[Unreleased]: https://github.com/local-loop-io/localloop-site/compare/v0.2.8...HEAD
[0.2.8]: https://github.com/local-loop-io/localloop-site/compare/v0.2.7...v0.2.8
[0.2.7]: https://github.com/local-loop-io/localloop-site/compare/v0.2.6...v0.2.7
[0.2.6]: https://github.com/local-loop-io/localloop-site/compare/v0.2.5...v0.2.6
[0.2.5]: https://github.com/local-loop-io/localloop-site/compare/v0.2.4...v0.2.5
[0.2.4]: https://github.com/local-loop-io/localloop-site/compare/v0.2.3...v0.2.4
[0.2.3]: https://github.com/local-loop-io/localloop-site/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/local-loop-io/localloop-site/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/local-loop-io/localloop-site/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/local-loop-io/localloop-site/compare/v0.1.1-demo...v0.2.0
[0.1.1]: https://github.com/local-loop-io/localloop-site/releases/tag/v0.1.1-demo
