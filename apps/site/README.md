# LocalLoop GitHub Pages

This repository hosts the LocalLoop documentation hub for the LOOP Protocol. It mirrors
protocol artifacts (specification, schemas, RFCs, examples) and provides a lightweight
viewer for markdown and JSON files. The site is built with Next.js (static export) and
published via GitHub Pages. The project is an early, low-TRL concept with no public
pilots or deployments yet.

## Structure
- `app/`: Next.js App Router pages
- `public/viewer.html`: markdown/JSON viewer
- `public/projects/loop-protocol/`: mirrored assets from `loop-protocol`
- `public/assets/`: site styling and scripts
- `public/assets/js/interest.js`: public Expression of Interest form and list

## Updating content
If you add new docs or schemas in the protocol repo, copy them into
`public/projects/loop-protocol/` (or use the aggregation workflow once configured).

## Local development
```bash
bun install
bun run dev
```

## Build
```bash
bun run build
```
The static export is written to `out/` and deployed via GitHub Pages.

## GitHub Pages
This repository is intended to be published via GitHub Pages. If the GitHub org is
`local-loop-io`, the default URL will be `https://local-loop-io.github.io`.

## How to Cite

If you reference this repository, please cite:
Alphin Tom. "LocalLoop Docs Hub." LocalLoop, GitHub repository, 2025-2026. https://github.com/local-loop-io/local-loop-io.github.io

```bibtex
@misc{localloop_docs_hub_2025,
  author = {Alphin Tom},
  title = {LocalLoop Docs Hub},
  year = {2025},
  howpublished = {GitHub repository},
  url = {https://github.com/local-loop-io/local-loop-io.github.io},
  note = {Accessed 2025-12-19}
}
```
