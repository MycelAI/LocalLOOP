# Changelog

All notable changes to the localLOOP website will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.4] - 2026-07-19

### Fixed
- Resynced the docs-hub mirror of the LOOP protocol `openapi.json` with the
  canonical loop-protocol contract (v0.2.0, including the Core-DP tagged
  components and node-signature security schemes). Future drift is gated by
  localloop-backend's three-way conformance check (backend ↔ loop-protocol ↔
  this mirror).

## [0.4.3] - 2026-07-18

### Changed
- Key Concepts active tab: replaced the solid near-black fill with a soft
  teal tint matching the CTA button's existing style — the previous fill
  read as too heavy against the section's light theme.
- Key Concepts side-by-side card (>=1200px): the card's height is now
  media's own natural (aspect-ratio-derived) height, not an independent
  value — this is a structural fix, not a tuning pass. Media's width was
  the deterministic input (unchanged from 0.4.2's fix), but the showcase
  height was still a separately-guessed value, which meant the true-16:9
  image either came up shorter than the card (a visible gap above/below
  it) or the card had to guess a height matching neither element well.
  Now the card is exactly as tall as the image wants: zero gap, and,
  since media's true 16:9 shape is never touched, zero crop either.
- The text column's typography is now fluid instead of fixed: it uses CSS
  container query units (cqh) to scale headline/subtitle/description/CTA
  to whatever height the image dictates at the current viewport width,
  within a legible minimum. This is what makes the height-matching above
  possible without the text column needing (and not getting) a guaranteed
  minimum height of its own — previously, giving text a fixed floor is
  what forced choosing between cropping the image or leaving a gap.
- The side-by-side tier's lower boundary moved from 1300px to 1200px
  (media/content columns re-tuned for the new width formula); the
  narrow-desktop stacked tier (image above text) now covers 901-1199px
  instead of 901-1299px, with its own crop behavior unchanged from 0.4.1.

## [0.4.2] - 2026-07-18

### Fixed
- Key Concepts media panel could overflow horizontally past its grid
  column and paint over the content column at wide desktop widths
  (confirmed at 1440px, where the description text was cut off behind
  the illustration). Root cause: the media box's width was derived from
  `height: 100%` + `aspect-ratio`, which grid's column-track
  intrinsic-sizing pass can't resolve (the row height is indeterminate
  at that point), so the "auto" track was sized far too narrow while the
  element itself rendered at its full aspect-ratio width. Fixed by
  giving the media panel an explicit, viewport-driven width (matching
  the grid track exactly) and deriving height from that instead —
  removing the circularity rather than just shrinking its symptom.
- The narrow-desktop stacked tier (901-1299px) could still overflow its
  panel at shorter viewport heights (confirmed at 1200x768 and
  1299x768): fixed by letting the media panel shrink first via
  `flex-shrink` instead of the content column absorbing the deficit as
  an internal scrollbar.
- Mobile (<=900px) tab strip: the base vertical-list rule's
  `justify-content: center` pushed the horizontally-overflowing tab row
  so its start bled into negative offsets a `scrollLeft: 0` container
  could never reach, leaving the first ("LOOP") tab partly off-screen
  with no way to scroll back to it. Separately, forcing all 6 tabs to
  equally shrink (`flex: 1`) left no room for longer labels like
  "MaterialDNA", so their text spilled into neighboring tabs instead of
  scrolling. Fixed by sizing tabs to their natural width and left-aligning
  the (now genuinely scrollable) strip.
- Trimmed remaining sub-10px vertical overflow in the content column
  across the wide-tier width range.
- Added e2e regression tests for the horizontal media/content overlap,
  the mobile tab strip's start position and label legibility, and the
  requirement that scrolling must surface all 6 concepts before the
  next homepage section comes into view.

## [0.4.1] - 2026-07-18

### Fixed
- Key Concepts panel content could overflow outside its visible box at
  common desktop widths (~1000-1300px): confirmed live at 1024px, where the
  CTA button rendered ~200px below the visible viewport and the panel's
  own bottom edge. Root cause was two-fold — the description column could
  be compressed by the raw `3fr 2fr` split, and `.kc-panel-content`, as a
  grid item, defaulted to `min-height: auto`, which silently defeats
  `overflow-y` and lets content grow past its box instead of respecting
  it or scrolling internally. Fixed by giving the content column a
  guaranteed minimum width, making the tab rail and panel padding/gaps
  fluid across viewport width, and setting `min-height: 0` so overflow
  handling actually engages as a safety net.
- Reduced the scroll distance required to move between concepts (100dvh
  per step down to 65dvh) — 6 full viewport-heights of cumulative scroll
  felt unresponsive.
- Added an e2e regression test checking the CTA button stays within its
  panel across five common desktop widths (905-1920px).

## [0.4.0] - 2026-07-18

### Changed
- Redesigned the homepage "Key Concepts" showcase:
  - Tab rail moved from a horizontal strip above the panel to a vertical
    list on the left, with the illustration and description together on
    the right.
  - Illustrations now fill their frame edge-to-edge (`object-fit: cover`,
    no padding) instead of being letterboxed inside a padded, light-gray
    box.
  - The description panel is no longer dark — recolored to match the
    site's light theme.
  - Replaced five separately-staggered entrance animations per tab switch
    with a single crossfade transition.
  - Removed the manual "Pause rotation" control and the timer-based
    auto-rotation it paused.
  - Scrolling now drives which concept is shown: the section pins in place
    (`position: sticky`) while you scroll through all six, then releases
    to continue scrolling normally. Implemented by reading scroll position
    passively (never intercepting wheel/scroll events), so trackpad
    momentum, keyboard paging, and screen readers all behave normally.
    Collapses to a normal (non-pinned, click-only) layout on narrow
    viewports and under `prefers-reduced-motion: reduce`.

## [0.3.4] - 2026-07-18

### Fixed
- Restored inline rendering (via `MarkdownDoc`) of the protocol spec and
  regulatory-alignment roadmap on their site pages. A prior release had
  replaced this with a link-out to the raw file and added a test asserting
  the link-out was correct; git history confirms both pages rendered inline
  before that change, matching every other doc-mirroring page on the site,
  so this was a regression rather than a deliberate design choice. The test
  now asserts the correct (inline) behavior.
- Fixed a duplicate `.hero-visual` CSS selector: a legacy rule (used by the
  static `loop-protocol` mirror's "loop sculpture" widget) was being
  silently overridden by a newer homepage-specific rule with conflicting
  `position`/`overflow` values, since both shared the same class name. The
  newer rule is now scoped to `.hero-section .hero-visual`.
- `app/docs/dpia-lite/page.jsx` asserted unqualified "GDPR alignment" with
  no nearby qualifier, unlike every other regulation mention on the site.
  Reworded to state it's a draft discussion aid, not an assessed or
  certified claim.

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
