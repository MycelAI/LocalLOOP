# LOOP

[![Spec version](https://img.shields.io/badge/spec-v0.2.0-blue.svg)](SPECIFICATION.md)
[![Package version](https://img.shields.io/badge/package-0.5.2-475569.svg)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT%20%2B%20CC--BY--SA--4.0-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-lab%20demo%20only-c2410c.svg)](docs/governance/CLAIMS-AND-MATURITY.md)

Local Optimization with Overflow Protocol. A federated circular economy concept with shared schemas and interoperability notes.

> Early-stage, low-TRL concept. No public pilots or deployments. Lab demo only.

## What is here
- `SPECIFICATION.md`: core protocol spec.
- `schemas/`: JSON Schema definitions.
- `examples/`: sample payloads for interop.
- `contexts/`: JSON-LD contexts.
- `profiles/`: applicability profiles, including the lab-only Core-DP contract and conformance vectors.
- `docs/regulatory-alignment-roadmap.md`: long-horizon EU and German compatibility plan.
- `rfcs/`: RFCs and design notes.

## Quickstart
```bash
npm ci
npm run test
npm run check:domains
```

Use `npm run test`, not bare `npm test`: where `npm` is aliased to `bun`, the
bare form dispatches to Bun's built-in test runner instead of the validation
script. With Bun as your package manager, `bun install --frozen-lockfile` and
`bun run test` are the equivalents of the first two commands.

## Usage notes
- Specs and schemas are draft and subject to change.
- No certified implementations exist at this time.
- Use `examples/` to validate tooling and docs.
- Core-DP is a lab-only applicability profile, not a full LOOP conformance claim.

## Links
- Docs hub: https://loop.urbnia.com (rendered spec: https://loop.urbnia.com/protocol/spec/)
- Lab backend API: https://loop.urbnia.com/api/ (Redoc at https://loop.urbnia.com/api/docs)
- JSON-LD contexts keep their published identifiers, e.g.
  `https://localloop.urbnia.com/projects/loop-protocol/contexts/loop-v0.2.0.jsonld`
  (served via the redirect to `loop.urbnia.com`).

## Contributing
- Use `rfcs/` for feedback and proposals; see [CONTRIBUTING.md](CONTRIBUTING.md) and the [governance charter](docs/governance/GOVERNANCE.md).
- Report vulnerabilities as described in [SECURITY.md](SECURITY.md).
- Domain policy: [DOMAIN-POLICY.md](DOMAIN-POLICY.md).
- This tree lives at `protocol/` in the localLOOP monorepo (it was the standalone `local-loop-io/loop-protocol` repository, now archived). `protocol/` is canonical: the backend's schema copies and the docs-hub mirror are regenerated from it, and repository-wide contributor guidance (`AGENTS.md`, `CONTRIBUTING.md`) sits at the monorepo root.

## License
- Specification prose (`SPECIFICATION.md`, `docs/`, `rfcs/`, Markdown in `profiles/` and the top-level Markdown files): CC BY-SA 4.0.
- Code and machine-readable artifacts (`schemas/`, `examples/`, `contexts/`, `scripts/`, `openapi.json`, non-Markdown files in `profiles/`): MIT.
- The localLOOP and LOOP names and logos are reserved brand assets and are not covered by either licence.
- Full terms and the per-path breakdown: [LICENSE](LICENSE).

<!-- agent-cycle-036: protocol readme anchor -->
