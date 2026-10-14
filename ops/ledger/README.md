# localloop-agent

Agent bookkeeping for localLOOP. Formerly the standalone `localloop-agent`
repo; since 2026-10-14 it lives at `ops/ledger/` in the LocalLOOP monorepo,
and entries written before then refer to the old multi-repo paths.

**Product code never lives here.** This repo holds:

- `REPO_MANIFEST.md` — inventory of sibling product repos, deploy order, contracts
- `LEDGER.md` — append-only cycle log (1..100)
- `plans/cycle-NNN.md` — per-cycle plans
- `baselines/` — Playwright visual baselines
- `evidence/` — verification captures

Monorepo root: `/home/alphin/code/MycelAI/localLOOP/` (this directory is `ops/ledger/`; the former multi-repo workspace was `/home/alphin/code/local-loop-io/`).
