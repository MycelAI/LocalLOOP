# LocalLoop GitHub Pages

Documentation hub for the LOOP Protocol. This site mirrors protocol artifacts (specs, schemas, RFCs, examples) and provides a lightweight viewer for markdown and JSON files.

> Early-stage, low-TRL concept. No public pilots or deployments. Lab demo only.

## At a glance
| Item | Details |
| --- | --- |
| Stack | Next.js (static export) |
| Publish | https://local-loop-io.github.io |
| Content | `public/projects/loop-protocol/` |

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

## Repo layout
- `app/`: Next.js App Router pages.
- `public/viewer.html`: markdown/JSON viewer.
- `public/projects/loop-protocol/`: mirrored assets from `loop-protocol`.
- `public/assets/`: site styling and scripts.
- `public/assets/js/interest.js`: Expression of Interest form.

## Updating content
If you add new docs or schemas in the protocol repo, copy them into `public/projects/loop-protocol/` or use the aggregation workflow when configured.

## Links
- Protocol spec: https://github.com/local-loop-io/loop-protocol
- Backend API: https://loop-api.urbnia.com

## Contributing
- See `../AGENTS.md` for org context and domain policy.
