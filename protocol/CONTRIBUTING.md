# Contributing to LOOP

Thank you for your interest in the LOOP protocol. LOOP is early-stage (low
TRL) and a lab demo only. There are no public pilots or deployments, and
contributions must not suggest otherwise.

Please read the [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.
Report security problems privately to **dev@mycel-ai.de**, never in a public
issue (see the security policy at https://loop.urbnia.com/protocol/security/).

## Where the protocol lives

The protocol is developed in the `protocol/` directory of the public localLOOP
monorepo, https://github.com/MycelAI/LocalLOOP. Open issues and pull requests
there; protocol changes follow the RFC process described below. The former
repository `github.com/local-loop-io/loop-protocol` is archived and
read-only. You can also send proposals and questions to **dev@mycel-ai.de**.

Monorepo contributors: the root `CONTRIBUTING.md` covers prerequisites, the
`scripts/ci-local.sh` gate, branches and commit style, changelogs, releases
and licensing. This file only adds protocol-specific guidance.

## Setup and checks

Run these from `protocol/`. The tree uses npm and `package-lock.json`, and
needs Node.js 24.19 or newer.

```bash
npm ci
npm test                      # schema validation, schemas README, doc markers
npm run check:domains         # only the allowed domains (DOMAIN-POLICY.md)
npm run conformance:core-dp   # also :battery, :packaging, :waste-shipment
```

## Proposing changes

### Specification, schema and API changes (RFCs)

Use an RFC for protocol, schema, API surface, compatibility, interoperability,
security/privacy or governance changes:

1. Copy `rfcs/0000-template.md` to `rfcs/NNNN-short-title.md`, using the next
   free number.
2. Fill in every section, including `Status`.
3. Open a pull request with the RFC.
4. Review follows the states and windows in `docs/governance/GOVERNANCE.md`
   §2: `Draft`, `Review`, `Accepted`, `Rejected`, `Superseded`, `Withdrawn`,
   and at least 5 calendar days of review (48 hours for a documented urgent
   security/privacy response).

The RFC guide and template are also published at
https://loop.urbnia.com/governance/rfcs/ and
https://loop.urbnia.com/governance/template/.

### Documentation and examples

Make changes on a feature branch and open a pull request. Add or update
examples in `examples/` when behaviour changes, and keep the wording within
the claims policy (`docs/governance/CLAIMS-AND-MATURITY.md`).

## Protocol-specific rules

- `protocol/` is canonical. After changing schemas, contexts, docs, examples,
  RFCs, profiles, `openapi.json`, `SPECIFICATION.md` or this tree's top-level
  docs, re-sync the site mirror and the backend schema copies as described in
  the root `CONTRIBUTING.md`.
- Adding RFC 2119 clauses to `SPECIFICATION.md` requires re-pinning
  `profiles/core-dp/requirements/spec-v0.2.0-normative-manifest.json`.
- JSON-LD context URLs, `@vocab` and schema `$id`s live under
  `https://loop.urbnia.com/projects/loop-protocol/`. Changing them is a
  protocol versioning decision that needs an RFC.
- Some docs carry `agent-cycle-NNN` HTML comment markers that
  `npm run check:markers` requires. Keep them when you edit those files.
- Record changes under `## [Unreleased]` in `CHANGELOG.md`.

## Licensing

Contributions are licensed inbound = outbound under the licence of the files
you change: specification prose is CC-BY-SA-4.0, while schemas, JSON-LD
contexts, `openapi.json` and scripts are MIT. The LOOP and localLOOP names and
logos are not openly licensed.

## Questions

Email **dev@mycel-ai.de**.

<!-- agent-cycle-040: contributing anchor -->
