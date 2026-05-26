# Changelog

All notable changes to the localLOOP website will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/local-loop-io/local-loop-io.github.io/compare/v0.2.1...HEAD
[0.2.1]: https://github.com/local-loop-io/local-loop-io.github.io/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/local-loop-io/local-loop-io.github.io/compare/v0.1.1-demo...v0.2.0
[0.1.1]: https://github.com/local-loop-io/local-loop-io.github.io/releases/tag/v0.1.1-demo
