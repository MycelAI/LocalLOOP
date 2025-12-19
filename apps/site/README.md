# LocalLoop GitHub Pages

This repository hosts the LocalLoop documentation hub for the LOOP Protocol. It mirrors
protocol artifacts (specification, schemas, RFCs, examples) and provides a lightweight
viewer for markdown and JSON files.

## Structure
- `index.html`: main hub landing page
- `viewer.html`: markdown/JSON viewer
- `projects/loop-protocol/`: mirrored assets from `loop-protocol`
- `assets/`: site styling and scripts

## Updating content
If you add new docs or schemas in the protocol repo, copy them into
`projects/loop-protocol/` (or use the aggregation workflow once configured).

## GitHub Pages
This repository is intended to be published via GitHub Pages. If the GitHub org is
`localloop`, the default URL is `https://localloop.github.io`. If the org is
`local-loop-io`, the default URL will be `https://local-loop-io.github.io`.
