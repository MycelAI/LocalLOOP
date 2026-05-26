# Changelog

All notable changes to the localLOOP website will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/local-loop-io/local-loop-io.github.io/compare/v0.2.4...HEAD
[0.2.4]: https://github.com/local-loop-io/local-loop-io.github.io/compare/v0.2.3...v0.2.4
[0.2.3]: https://github.com/local-loop-io/local-loop-io.github.io/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/local-loop-io/local-loop-io.github.io/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/local-loop-io/local-loop-io.github.io/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/local-loop-io/local-loop-io.github.io/compare/v0.1.1-demo...v0.2.0
[0.1.1]: https://github.com/local-loop-io/local-loop-io.github.io/releases/tag/v0.1.1-demo
