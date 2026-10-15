# Security Policy

localLOOP is an early-stage (low TRL) project and a **lab demo only**, with no
public pilots or deployments. We still take security reports seriously. The
lab services run on a real host and store submissions from the public.

## Reporting a vulnerability

Use either private channel:

- GitHub's private vulnerability reporting:
  [Report a vulnerability](https://github.com/MycelAI/LocalLOOP/security/advisories/new)
  (only you and the maintainers see the report), or
- email **dev@mycel-ai.de** (maintainer: GitHub @alpha912, Mycel UG
  (haftungsbeschränkt)).

- **Do not** open a public issue, pull request or other public post for a
  security problem.
- Include a description of the issue, the affected tree, version, URL or
  endpoint, steps to reproduce, the potential impact, a suggested fix if you
  have one, and how to reach you.
- No PGP key is published at the moment. If you need an encrypted channel, say
  so in your first email, without including the details.

The same contact is published in
[`security.txt`](https://loop.urbnia.com/.well-known/security.txt), whose
source is `apps/site/public/.well-known/security.txt`.

## Response targets

These targets come from a single maintainer and are best effort:

- **Initial response:** within 48 hours
- **Status update:** within 5 business days
- **Resolution target:** 30 to 90 days, depending on severity

## Supported versions

Each tree is versioned and released independently. Security fixes go into the
latest release of each tree and into the lab services at `loop.urbnia.com`.
Older versions do not receive fixes.

| Tree | Supported | Not supported |
| --- | --- | --- |
| Backend (`apps/backend`) | 0.10.0 (latest) | < 0.10.0 |
| Site (`apps/site`) | 0.12.0 (latest) | < 0.12.0 |
| Protocol (`protocol`) | 0.6.0 (latest) | < 0.6.0 |
| Archived `github.com/local-loop-io/*` repositories | none (read-only) | all |

If you find an issue in an archived repository, check whether it also affects
the current code. If it does, report it as described above.

## Scope

In scope:

- The code in this repository: the backend API, the documentation site and its
  nginx configuration, and the protocol schemas, contexts and `openapi.json`.
- The lab services at `https://loop.urbnia.com` and
  `https://loop.urbnia.com/api/`, including the redirecting hostnames
  `localloop.urbnia.com` and `loop-api.urbnia.com`.
- Security weaknesses in the LOOP specification itself, for example in
  federation or handshake rules.

Out of scope:

- Other services that share the host but are not part of localLOOP.
- Denial-of-service, load or volumetric testing, and social engineering.
- Vulnerabilities in third-party dependencies that are already public and have
  no localLOOP-specific impact. Please report those upstream.

When testing the lab services, use only your own test data. Stay within the
published rate limits, and don't access, change or delete data that isn't
yours. The interest registry stores submissions from the public. If you come
across personal data, stop, don't keep a copy, and tell us.

## Disclosure

We follow coordinated disclosure. Please give us a reasonable chance to fix
the issue before you publish details, and we'll agree on a disclosure date
with you. With your permission, we'll credit you in the release notes of the
affected tree.

## More security documentation

- [Protocol security policy and node operator guidance](protocol/SECURITY.md)
- [Backend security notes](apps/backend/SECURITY.md)
- [Threat model](protocol/docs/compliance/threat-model.md),
  [incident response](protocol/docs/incident-response.md),
  [secure coding](protocol/docs/secure-coding.md)

*Last reviewed: 2026-10-14. Next review: 2027-04-14.*
