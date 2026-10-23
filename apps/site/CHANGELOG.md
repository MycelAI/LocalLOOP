# Changelog

All notable changes to the localLOOP website will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.13.0] - 2026-10-23

### Fixed
- DEMO City's Offers, Matches, Transfers and Materials tables now refresh when
  the live stream reports a change. The page listened for named SSE events,
  but the API sends unnamed messages whose JSON carries the type, so only the
  stream log updated. The E2E fakes now send the real wire format.
- DEMO City's stat cards were capped at 20 (the list routes' default page
  size); they now request the maximum of 100 and show "100+" when full, and a
  failed list call shows "Stats unavailable" instead of counting as 0. A
  health answer of 503 with a JSON body shows "Node degraded" rather than
  "Backend unreachable".
- Heading links in mirrored documents work: headings get GitHub-style ids,
  so the specification's table of contents (16 links) resolves, and relative
  links are resolved against the mirrored file's folder instead of the page
  URL (24 links returned 404). A smoke test now fails on any broken internal
  link or `#anchor` in the build.
- The interest form enforces the API's field limits, says which fields the
  API rejected (400) or how long to wait after the write limit (429), and on
  a timeout warns that the submission may have been stored instead of
  inviting a duplicate.
- nginx makes browsers revalidate HTML and the unhashed `/assets/js/` and
  `/assets/css/` files (`Cache-Control: no-cache`, cheap 304s), so a deploy
  takes effect at once instead of after up to a week. Fonts and images keep
  the one-week cache.

## [0.12.0] - 2026-10-15

### Added
- The contribute page links to the public repository
  (https://github.com/MycelAI/LocalLOOP) with "Open an issue" and "View the
  repository" actions; site-wide structured data adds a `SoftwareSourceCode`
  entity with `codeRepository`, and the publisher links its GitHub
  organization (`sameAs`); `llms.txt` lists the source repository.

### Changed
- The footer's GitHub link and the API page's compliance-matrix link point to
  MycelAI/LocalLOOP (the latter to the current
  `apps/backend/docs/SPEC-COMPLIANCE.md` instead of the archived v0.6.4 copy).
  The published licence notice says the repository is public. A smoke test
  fails if a page links to the archived `local-loop-io` organization.

## [0.11.2] - 2026-10-15

### Fixed
- Pages could load without their CSS or JavaScript. Next prefetched every
  header menu link on load (~115 of ~147 requests on desktop), so a second
  page load within a second or two, or several visitors behind one NAT,
  exceeded the per-IP rate limit added in 0.10.0, and Traefik answered
  content-hashed chunks with 429. Menu links no longer prefetch (30 requests
  per load; clicks still navigate client-side), and `/_next/static/` and
  `/assets/` have their own router (`localloop-site-static`) with a looser
  bucket (300/s, burst 1000).

## [0.11.1] - 2026-10-15

### Fixed
- The live metrics labels on `/docs/metrics/` use `--ink-soft` (7.6:1)
  instead of `#6a7a86` (4.42:1, below WCAG AA); the labels render only with
  live API data, so the local audit could not see them.

## [0.11.0] - 2026-10-15

### Changed
- **Performance.** Lighthouse mobile performance on the home page went from
  34 to about 90 and desktop from 56 to 99-100:
  - The header and footer logo is a 3 KB WebP (`local-loop-logo-96.webp`)
    instead of the 1.4 MB source PNG that every page downloaded.
  - Icons: the Phosphor bold font and stylesheet are a subset of the 83 icons
    the site uses (11 KB + 5 KB instead of 150 KB + 86 KB), built by
    `scripts/subset-phosphor.sh` from the full copy in `assets-src/phosphor/`;
    the unused fill weight (132 KB + 86 KB) is gone. The scan also covers the
    static HTML in `public/` (header partial, protocol mirror index).
  - Stylesheets are bundled by Next into content-hashed files instead of
    three separate render-blocking requests.
  - The three.js hero loads on the visitor's first interaction (pointer, key,
    touch, wheel or scroll) instead of with the page.
  - Markdown documents (the specification, the mirrored protocol docs) are
    rendered to HTML at build time and sent once as a string: the
    specification page shrank from 611 KB to 257 KB, and the browser no longer
    downloads the Markdown toolchain or re-renders the document on hydration.
    Mermaid diagrams load and render only when they scroll into view.
- **SEO and GEO.** A 1200x630 social card (`og-image.png`, Twitter
  `summary_large_image`); site-wide `Organization` + `WebSite` structured
  data and a `TechArticle` for the specification; `llms.txt` summarising the
  project and its canonical sources for AI assistants; `robots.txt` keeps API
  data out of the index while allowing its reference and OpenAPI document.

### Fixed
- Heading order on `/docs/`, `/library/`, `/protocol/`, `/governance/` and
  the protocol mirror index (an outline `<h2>` before the cards); a smoke
  test now fails if any built page skips a heading level. Also fixed: the
  colour contrast of the demo-city filter's active button, and generic
  "Learn more" link text (cards now say where they lead).
- Layout shift while fonts load: each web font has a metric-matched local
  fallback (`size-adjust` and ascent/descent overrides), icons reserve their
  1em box, and static pages hold the header's height until `site-header.js`
  fills it.
- Accessibility: GFM task-list checkboxes in rendered Markdown are labelled
  ("Done"/"Not done"); the loop-cost calculator's values use a darker teal
  (5.5:1 instead of 3.7:1).
- The protocol mirror index (`/projects/loop-protocol/`) is a complete page:
  indexable, with a description, canonical link, social card and a `<main>`
  landmark, and listed in the sitemap; its injected header uses the small logo.
- Remote images in mirrored Markdown (README badges) are shown as their alt
  text instead of being blocked by the CSP and logged as errors.
- `scripts/generate-csp-hashes.mjs` splits long per-page hash lists across
  several nginx variables: Next can emit 120+ inline scripts on long pages,
  which exceeded nginx's 4 KB token limit and stopped the container.

## [0.10.0] - 2026-10-15

### Security
- **Unprivileged, read-only container.** The image is
  `nginxinc/nginx-unprivileged:1.30-alpine` (pinned by digest) running as uid
  101 on port 8080, with no capabilities, `no-new-privileges`, a read-only
  root filesystem (`/tmp` tmpfs), CPU/memory/process limits and a
  healthcheck. The Bun builder image is pinned by digest too.
- `server_tokens off`: responses no longer reveal the nginx version.
- Traefik rate limit on the site and legacy-redirect routers (50 requests/s
  per client IP, burst 200).
- The site container can no longer reach the API: the API moved to its own
  `localloop-edge` network (backend 0.10.0).

### Migration
- Traefik's service port for the site is now 8080 (label updated).

## [0.9.0] - 2026-10-14

### Changed
- **Mermaid 12** (was 11). Diagrams keep their previous appearance through
  `layout: 'dagre'` and `look: 'classic'`; Mermaid 12 needs an ES2024 browser
  (Safari 17.4+), and older browsers show the diagram source via the existing
  fallback. It also moves KaTeX to 0.18, so `bun audit` is clean (the KaTeX
  advisory noted in 0.6.1 is resolved). Mermaid 12 bundles the ELK layout
  engine (`elkjs`, EPL-2.0), now listed in the third-party notices.
- Next.js 16.4.1, React 19.3.1, three 0.186.1; dev: Playwright 1.64.1,
  Biome 2.5.15 (config uses `"preset": "recommended"`), @types/node 26.6.5.
- Images: `oven/bun:1.4.3-alpine` builder and `nginx:1.30-alpine` (the current
  stable branch); Volta Node 24.21.0.

## [0.8.1] - 2026-10-14

### Changed
- `/licenses/THIRD_PARTY_NOTICES.md` reflects backend 0.9.0, which no longer
  ships Prisma or its dependencies (including the EPL-2.0 `elkjs`).

## [0.8.0] - 2026-10-14

### Changed
- **nginx no longer proxies the API.** The shared Traefik routes
  `https://loop.urbnia.com/api/*` to the backend directly (router
  `localloop-api` in the backend stack); this container only serves the static
  export. `api-proxy.conf` and the Docker DNS resolver setup are removed.
- `/api/*` requests that still reach this nginx -- only while the API
  container is stopped, restarting or unhealthy -- get a JSON 503 with
  `Retry-After: 30` instead of the site's HTML 404 page.

### Migration
- Deploy backend 0.8.0 (which adds the `localloop-api` Traefik router) before
  this release; with an older backend, `/api/*` would get the 503 fallback.

## [0.7.2] - 2026-10-14

### Changed
- `/licenses/` publishes the updated `LICENSE` and `THIRD_PARTY_NOTICES.md`:
  the backend's vendored Redoc 3.0.1 bundle is listed, and the basemap note
  quotes the current "© OpenStreetMap contributors" credit.

## [0.7.1] - 2026-10-14

### Fixed
- Core-DP profile schema `$id`s
  (`/projects/loop-protocol/profiles/core-dp/0.1.0-lab/schemas/*`) resolve:
  nginx serves them from the mirrored `profiles/core-dp/schemas/` files
  instead of answering 404.

## [0.7.0] - 2026-10-14

### Changed
- **Protocol identifiers on `loop.urbnia.com`** (loop-protocol 0.6.0): the
  mirrored contexts, schemas, examples, specification and conformance vectors
  served under `/projects/loop-protocol/` use
  `https://loop.urbnia.com/projects/loop-protocol/` throughout, including the
  `@vocab` terms namespace.
- Every page, script and README uses `loop.urbnia.com` and
  `loop.urbnia.com/api/` only; `scripts/check-domains.cjs` rejects the former
  hostnames outside the domain policy, changelog history and the Traefik
  redirect labels in `docker-compose.yml` (which keep redirecting them).

### Migration
- Anything that fetched contexts or schemas from `localloop.urbnia.com` keeps
  working through the 308 redirect but receives documents whose identifiers
  are on `loop.urbnia.com`.

## [0.6.2] - 2026-10-14

### Added
- Licence terms ship with the site: `/licenses/` serves the project
  `LICENSE`, `NOTICE`, `THIRD_PARTY_NOTICES.md` and the licence texts (synced
  from the repository root by `scripts/sync-legal.sh`), and `/docs/licenses/`
  explains which terms apply to what.

### Changed
- The footer states the actual terms ("Code MIT · Specification CC BY-SA 4.0 ·
  Brand assets reserved") with a link to `/docs/licenses/` instead of "All
  rights reserved"; the contribute page no longer says "MIT licensed" for
  everything.
- `/docs/api/` links the compliance matrix to the archived backend's tagged
  v0.6.4 snapshot instead of its moving `main` branch.
- Documentation: README describes the monorepo workflow and licensing; SPDX
  headers and REUSE metadata added; community files updated.

### Fixed
- HTML comments in mirrored protocol Markdown (the agent-cycle maintenance
  anchors) no longer render as visible text on `/protocol/spec/` and other
  mirrored pages.
- The hero basemap credit reads "© OpenStreetMap contributors", the
  attribution the OpenStreetMap licence asks for.

## [0.6.1] - 2026-10-14

### Changed
- **Home is `https://loop.urbnia.com`.** Canonical URLs, sitemap,
  `robots.txt`, `humans.txt`, `security.txt` and the API docs page point at the
  new host.
- The lab API is same-origin: nginx proxies `/api/*` to the backend container
  (`localloop-backend-api-1:8088`) over the shared `proxy` network
  (`api-proxy.conf`), the page scripts call `window.location.origin`, and the
  CSP narrows to `connect-src 'self'`.
- The site stack's Traefik labels 308-redirect `localloop.urbnia.com/*` to
  `loop.urbnia.com/*` and `loop-api.urbnia.com/*` to `loop.urbnia.com/api/*`.
- JSON-LD contexts (`*.jsonld`) are served as `application/ld+json` with
  `Access-Control-Allow-Origin: *` instead of `application/octet-stream`, and
  are gzip-compressed.
- Source moved into the `MycelAI/LocalLOOP` monorepo (`apps/site`);
  `scripts/aggregate-docs.sh` mirrors `protocol/` from the monorepo. Former tags
  are prefixed (`site/v0.6.0`).

### Security
- `next` 16.3.8 (GHSA-vcvr-r3jv-pc5j, GHSA-cjq9-62q9-8jv4 and five lower
  advisories; the static export does not run the affected server features, but
  the build host did). Overrides `dompurify` ^3.4.16, `sharp` ^0.35.5,
  `baseline-browser-mapping` ^2.11.0 and `source-map-js` ^1.2.2.
- Known residual: `katex` 0.16.x via `mermaid` (GHSA-238p-pmpm-9mq7, low;
  needs pre-existing prototype pollution). The fix is in `katex` 0.18.2, which
  `mermaid` 11 does not accept yet.

### Migration
- JSON-LD context and schema `$id` IRIs intentionally stay on
  `localloop.urbnia.com` and resolve through the redirect; no consumer change
  is required.
- Links and bookmarks to `localloop.urbnia.com` keep working through the 308
  redirect; update them to `loop.urbnia.com`.

## [0.6.0] - 2026-09-07

### Added
- New page `/protocol/what-is-loop`: a plain-language white paper on LOOP for
  city leaders and non-technical stakeholders. Covers the
  register/offer/match/transfer flow and its cross-entity invariants, the six
  core concepts with implemented and design-only clearly separated, identifier
  anatomy, a 22-term glossary, node cost and operation, data minimisation and
  residency, the regulatory landscape, current implementation status, and
  governance. Registered in the header menu, protocol sidebar and hub.
- First per-page structured data on the site: `TechArticle`, `FAQPage` and
  `BreadcrumbList` JSON-LD on that page, with the FAQ blocks and the schema
  built from one array so the two cannot drift.
- An interactive LoopCost model on the same page. Four range inputs and a
  same-city toggle drive the published formula, and the formula rows show
  their running figures. It replaces the static formula rather than sitting
  beside it, and its server-rendered default state is a readable table before
  hydration.
- A three.js motion graphic across the home hero: a looping five-chapter scene
  covering MaterialDNA, ProductDNA, LoopSignal, LoopCost and LoopCoin, with
  play/pause, restart and chapter controls. `three` is dynamically imported so
  it code-splits out of the initial bundle; rendering stops when the hero
  leaves the viewport, `prefers-reduced-motion` starts paused, and WebGL
  failure falls back to a static mark.
- A real OpenStreetMap basemap under that scene (`public/assets/loop-basemap.webp`,
  baked from zoom-5 tiles because the CSP allows `img-src 'self' data:` only).
  Munich anchors the scene origin and every node sits at its true Web Mercator
  offset, so Berlin is north, Vienna east and Milan south-west at correct
  bearings. Attributed in the map corner as ODbL requires.

### Changed
- The home hero's primary CTA and the key-concepts showcase CTA both read
  "Read the spec" while linking to `/protocol/`, the section hub rather than
  the specification. They now point at the new introduction.
- The lab-only banner is removed from the home hero. The posture is still
  carried by the hero stat strip, `humans.txt`, `ai.txt`, and the
  `MaturityStatus` block on the protocol, platform and What is LOOP pages.

### Removed
- Dead hero decoration CSS (`.hero-visual`, `.hero-orbit*`, `.hero-loop-icon`
  and their media-query variants), and the graph-paper grid from the landing
  hero.

## [0.5.3] - 2026-09-05

### Changed
- Content-Security-Policy no longer allows `'unsafe-inline'` scripts: the image
  build generates an nginx `map` of per-page SHA-256 hashes for the inline
  scripts Next.js's static export emits (`scripts/generate-csp-hashes.mjs`), so
  each HTML response allows exactly its own bootstrap scripts. Styles keep
  `'unsafe-inline'` because React style props and Mermaid's rendered SVG use
  inline style attributes.
- The two Biome rules left as warnings in 0.5.2 are fixed properly:
  `RouteScripts` keys its effect on a memoised script list, `SiteHeader` makes
  `clearCloseTimeout` stable with `useCallback` and lists it as a dependency, and
  the two intentional exceptions (route-change reset effect, hover-intent
  wrapper `<div>`) carry documented inline suppressions. Rules are back at
  their default severity.
- `next` 16.3.4 (supersedes Dependabot #107).
- Smoke test fails 60 days before `security.txt`'s `Expires` lapses so renewal
  is noticed in CI.
- Protocol mirror re-synced for loop-protocol 0.5.2 (`transaction` evidence
  subject type; pilot-readiness claim re-reviewed, expiry 2026-12-04).

## [0.5.2] - 2026-09-05

### Fixed
- Six dead links on the protocol-mirror index page (`/projects/loop-protocol/`)
  pointed at a `/viewer.html` that does not exist; they now open the rendered
  pages or the plain-text mirror files, and the page is `noindex` (it is not
  linked from the navigation or sitemap).
- nginx never served the export's `404.html` (no `error_page` directive), so
  unknown paths got nginx's bare default page.
- Four docs pages rendered literal backticks around paths and endpoints (JSX
  text is not Markdown); they are `<code>` elements now.
- The 404 page had no `<title>`, description or canonical.
- Homepage counted 11 schemas (there are 12) and labelled the spec version as a
  protocol version; the schema library lists all 12 schemas (`federate-accepted`,
  `node-info`, `transaction`, `loopsignal`, `loopcoin` were missing).
- Every content page's `<h1>` was the section name ("Docs", "Protocol", …) and
  the real page title an `<h2>`; the page title is the `<h1>` now, panel
  headings follow as `<h2>`/`<h3>`, the hub cards no longer skip from `<h2>` to
  `<h4>`, mirrored Markdown documents render their headings one level down so a
  page keeps a single `<h1>`, and DEMO City (which had no `<h1>` at all) gets one.
- The Key Concepts "LOOP" description read as a live capability claim ("an open,
  federated standard… enables municipalities…"); it is hedged like its siblings,
  in line with the lab-demo-only policy.
- The interest page collected personal data with no linked notice; the consent
  label, the "Privacy & retention" block and the footer now link the published
  data-protection assessment and the contact address. On API failure the public
  list no longer shows invented people — only the unavailability notice.
- `public/.well-known/security.txt` lacked the mandatory `Expires` field
  (RFC 9116); `/.well-known/change-password` is a 302 to the security page
  instead of a text file.
- The API docs page still described search, signals, transactions and the
  federated announce/offer routes as future work; all are implemented.
- Accessibility: decorative icons carry `aria-hidden`, the static maturity
  banner no longer announces itself as a live region on every load, and the
  `Card` icon is hidden from assistive tech like every hand-written equivalent.
- Playwright: two specs mocked `https://loop-api.urbnia.com` while the page
  under test called `http://127.0.0.1:8088` (the mocks never fired); the DEMO
  City spec's read-only guarantee used a `throw` inside a route handler, which
  cannot fail a test — writes are now collected and asserted empty.
- Vanilla header script matched the active section against its own stale prefix
  list; it uses `matchPrefixes` from `navigation.json` like the React header.
- Duplicate top-level CSS rules merged (`.card`, `.hero-section .hero-visual`,
  and the byte-identical second copies of `.notice-success`/`.notice-error`);
  dead `main.js` global include and the never-updated homepage API status dot
  removed; `Redirect` tautology, `MarkdownRenderer`'s obsolete `inline` prop,
  `MermaidBlock` unhandled rejection, `console.warn` in production and a stray
  `rel="noreferrer"` cleaned up; snake_case identifiers renamed.
- Copy: "the circular economy"; heading without trailing period; Code of
  Conduct card links to the Code of Conduct.

### Changed
- Fonts (Fraunces, Space Grotesk, IBM Plex Mono) and Phosphor icons are
  self-hosted under `public/assets/` instead of loading from Google Fonts and
  jsDelivr, so no visitor request leaves the origin except to the lab API —
  consistent with the published DPIA.
- nginx sends `Strict-Transport-Security` (Traefik did not) and a
  `Content-Security-Policy` (self-only, plus the lab API for `connect-src`);
  security headers live in one included file; `/_next/static/` is cached for a
  year as immutable and `/assets/` for a week; directory redirects are relative
  (`absolute_redirect off`) so they no longer name `http://` and drop the port
  behind the proxy.
- The six Key Concepts hero images are 1600px WebP (64–132 KB each instead of
  1.7–2.3 MB PNGs) with explicit dimensions.
- Biome (`bun run lint`) and a TypeScript 7 typecheck of the Playwright specs
  (`bun run typecheck`) added and run in CI; CI now also runs on pushes to
  `main`, not only on pull requests. Two rules (`useExhaustiveDependencies`,
  `noStaticElementInteractions`) report as warnings on the existing header and
  route-script effects rather than being rewritten in this pass.
- Dockerfile on `oven/bun:1.4.0-alpine` and `nginx:1.28-alpine`.
- Smoke tests assert against the built export (no literal backticks, exactly one
  `<h1>` per page, 404 title) in addition to source greps; a CSP spec and a
  no-third-party-request spec were added to the Playwright suite.

## [0.5.1] - 2026-08-21

### Changed
- Collapsed the 15 near-identical `agent stamp cycle NNN exists` smoke tests into
  one data-driven test that validates every file in `public/agent-stamps/`.
  Coverage is now the directory itself, so stamps added later are checked too —
  the per-cycle tests only ever covered the 15 cycles hard-coded at the time.

### Fixed
- `check:domains` reported a vacuous pass locally while failing in CI. The script
  chose ripgrep when available and grep otherwise, and the two branches were not
  equivalent: ripgrep was invoked with no path argument, so under `execSync`
  (stdin is a pipe) it searched empty stdin instead of the working tree. CI has
  no ripgrep, fell through to the grep branch, scanned properly, and failed on a
  historical `CHANGELOG.md` entry. The scan is now a deterministic Node walk, so
  local and CI agree; the repo's own changelog is exempt as a record *about* the
  policy, while mirrored changelogs under `public/` are still scanned.

### Fixed
- Resynced the docs-hub protocol mirror. Beyond the loop-protocol documentation
  anchors, the mirror was missing several protocol docs entirely: the governance
  set (`GOVERNANCE.md`, `CLAIMS-AND-MATURITY.md`, `RELEASE-CHECKLIST.md`),
  `backup-restore-runbook.md`, and `docs/audit/`.

### Added
- Agent cycle stamps 041-097 (agent cycles 041, 045, 049, 053, 057, 061, 065,
  069, 073, 077, 081, 085, 089, 093, 097).

### Added
- change-password well-known (agent cycle 034).

### Added
- ads.txt no-ads (agent cycle 033).

### Added
- ai.txt lab notice (agent cycle 032).

### Added
- `humans.txt` lab contact card (agent cycle 026).

### Added
- Root `robots.txt` with sitemap pointer (agent cycle 020).

### Added
- Published `/.well-known/security.txt` for vulnerability contact (agent cycle 019).

### Security
- Static nginx now emits baseline security headers (`X-Content-Type-Options`,
  `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) on HTML and
  mirrored markdown responses (agent cycle 002).

## [0.5.0] - 2026-08-14

> Reconstructed on 2026-10-14 from the `v0.5.0` tag message ("regulatory
> extension scenarios panel on DEMO City page") and the commit history between
> `v0.4.5` and `v0.5.0`; the release was tagged without a changelog entry.
> Changes that the tag also contained but that were recorded under `[0.5.1]`
> at the time (agent stamps, well-known files, security headers, the
> deterministic domain check, mirror resyncs) are not repeated here.

### Added
- Regulatory extension scenarios panel on the DEMO City page, describing the
  reusable-packaging and municipal-reuse lab demo scenarios as illustrations.
- Dependabot configuration for npm and GitHub Actions.

### Changed
- Docs mirror resynced with the loop-protocol Horizon 2 and Horizon 3 additions
  (access-scope, retention and category-classification guidance, the battery,
  packaging and waste-shipment profiles, conformance harnesses, roadmap).
- `SiteHeader.jsx` and `site-header.js` now share one navigation data file.
- Dependencies updated (Next.js 16.3.1, React 19.2.8, Playwright 1.62.1,
  highlight.js 11.12.0, mermaid 11.16.1); `engines`/Volta target Node 24 LTS
  (24.19.0) instead of 25.1.0.
- Docker builder image moved from Bun 1.2 to Bun 1.3.14, which fixes the
  Turbopack production build.

### Fixed
- `aggregate-docs.sh` now also syncs `profiles/`, so the Core-DP profile is
  mirrored for the first time; the sync fails when the anonymous clone fallback
  fails.
- Raw internal anchor links gained the trailing slash required by
  `trailingSlash: true`, removing a redirect hop on each click.
- DEMO City panels stay fresh, requests time out, and rate-limit gaps are
  closed.
- Screen-reader signal for the stream indicator; duplicate logo alt text
  removed.
- Two stale Playwright assertions, drifted README claims and a stale
  `SECURITY.md` date corrected; dead component and stale route prefixes
  removed.

## [0.4.5] - 2026-07-19

### Fixed
- DEMO City no longer exhausts the public API allowance through 30-second
  refreshes. Refreshes now run every five minutes, and a `429` response is
  labelled as an API request-limit pause rather than a backend outage.
- Browser tests now exercise the canonical API origin and cover the
  rate-limited DEMO City state.

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

[Unreleased]: https://github.com/MycelAI/LocalLOOP/compare/site/v0.13.0...HEAD
[0.13.0]: https://github.com/MycelAI/LocalLOOP/compare/site/v0.12.0...site/v0.13.0
[0.12.0]: https://github.com/MycelAI/LocalLOOP/compare/site/v0.11.2...site/v0.12.0
[0.11.2]: https://github.com/MycelAI/LocalLOOP/compare/site/v0.11.1...site/v0.11.2
[0.11.1]: https://github.com/MycelAI/LocalLOOP/compare/site/v0.11.0...site/v0.11.1
[0.11.0]: https://github.com/MycelAI/LocalLOOP/compare/site/v0.10.0...site/v0.11.0
[0.10.0]: https://github.com/MycelAI/LocalLOOP/compare/site/v0.9.0...site/v0.10.0
[0.9.0]: https://github.com/MycelAI/LocalLOOP/compare/site/v0.8.1...site/v0.9.0
[0.8.1]: https://github.com/MycelAI/LocalLOOP/compare/site/v0.8.0...site/v0.8.1
[0.8.0]: https://github.com/MycelAI/LocalLOOP/compare/site/v0.7.2...site/v0.8.0
[0.7.2]: https://github.com/MycelAI/LocalLOOP/compare/site/v0.7.1...site/v0.7.2
[0.7.1]: https://github.com/MycelAI/LocalLOOP/compare/site/v0.7.0...site/v0.7.1
[0.7.0]: https://github.com/MycelAI/LocalLOOP/compare/site/v0.6.2...site/v0.7.0
[0.6.2]: https://github.com/MycelAI/LocalLOOP/compare/site/v0.6.1...site/v0.6.2
[0.6.1]: https://github.com/MycelAI/LocalLOOP/compare/site/v0.6.0...site/v0.6.1
[0.6.0]: https://github.com/local-loop-io/localloop-site/compare/v0.5.3...v0.6.0
[0.5.3]: https://github.com/local-loop-io/localloop-site/compare/v0.5.2...v0.5.3
[0.5.2]: https://github.com/local-loop-io/localloop-site/compare/v0.5.1...v0.5.2
[0.5.1]: https://github.com/local-loop-io/localloop-site/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/local-loop-io/localloop-site/compare/v0.4.5...v0.5.0
[0.4.5]: https://github.com/local-loop-io/localloop-site/compare/v0.4.4...v0.4.5
[0.4.4]: https://github.com/local-loop-io/localloop-site/compare/v0.4.3...v0.4.4
[0.4.3]: https://github.com/local-loop-io/localloop-site/compare/v0.4.2...v0.4.3
[0.4.2]: https://github.com/local-loop-io/localloop-site/compare/v0.4.1...v0.4.2
[0.4.1]: https://github.com/local-loop-io/localloop-site/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/local-loop-io/localloop-site/compare/v0.3.4...v0.4.0
[0.3.4]: https://github.com/local-loop-io/localloop-site/compare/v0.3.3...v0.3.4
[0.3.3]: https://github.com/local-loop-io/localloop-site/compare/v0.3.2...v0.3.3
[0.3.2]: https://github.com/local-loop-io/localloop-site/compare/v0.3.1...v0.3.2
[0.3.1]: https://github.com/local-loop-io/localloop-site/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/local-loop-io/localloop-site/compare/v0.2.8...v0.3.0
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

<!-- Versions up to 0.6.0 link to the archived local-loop-io/localloop-site
     repository; later versions to the monorepo, where tags carry the site/
     prefix. -->
