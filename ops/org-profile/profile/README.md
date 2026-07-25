<div align="center">

[<img src="https://localloop.urbnia.com/assets/local-loop-logo.png" width="180" alt="localLOOP" />](https://localloop.urbnia.com)

# localLOOP

**Local Optimization with Overflow Protocol**

Circular economy infrastructure for cities - federated, open, and sovereignty-preserving.
Open research protocol for lab-only exploration.

[![Spec](https://img.shields.io/badge/LOOP_spec-canonical_metadata-2563eb?style=flat-square)](https://localloop.urbnia.com/protocol/spec)
[![Website](https://img.shields.io/badge/website-localloop.urbnia.com-16a34a?style=flat-square)](https://localloop.urbnia.com)
[![API](https://img.shields.io/badge/lab_API-loop--api.urbnia.com-ea580c?style=flat-square)](https://loop-api.urbnia.com/docs)
[![Status](https://img.shields.io/badge/status-lab_demo_only-f59e0b?style=flat-square)](https://localloop.urbnia.com/protocol/spec)

</div>

---

## What is localLOOP?

localLOOP is a research and protocol project building the open infrastructure for **federated municipal material exchange**. The core idea: cities should be able to track, offer, match, and transfer surplus materials and products across boundaries - without surrendering data sovereignty or locking into a single platform.

We're designing this as an **open protocol** (LOOP), not a product. The schemas, spec, and governance are public. The lab backend is intended to support lab-only exploration of these flows. Cities, researchers, and builders are welcome to engage.

> **Early-stage, low-TRL.** Lab demo only. No public pilots or production deployments yet.

---

## The LOOP protocol

LOOP - *Local Optimization with Overflow Protocol* - defines how autonomous city nodes discover each other, register materials, post offers, compute matches, and settle transfers. Key concepts:

| Concept | What it is |
|:---|:---|
| **MaterialDNA** | Data model for identifying a material batch - category, quantity, and availability |
| **ProductDNA** | Data model for a digital product passport for finished goods |
| **LoopCoin (LC)** | Local digital currency with built-in expiry to incentivise circulation |
| **LoopSignal** | Community preference weight for material categories |
| **Offer -> Match -> Transfer** | The minimal interop flow across federated nodes |
| **Federation handshake** | How two LOOP nodes discover and register each other |

For exact protocol versions and release status, see the [canonical specification](https://localloop.urbnia.com/protocol/spec) and [release metadata](https://github.com/local-loop-io/loop-protocol/releases).

**vNext direction:** Core-DP implementer preview is a proposed working label for future protocol exploration, not a version commitment.

---

## Repositories

| Repo | What's inside |
|:---|:---|
| [**loop-protocol**](https://github.com/local-loop-io/loop-protocol) | Normative specification, JSON schemas, JSON-LD contexts, examples, and governance RFCs |
| [**localloop.urbnia.com**](https://github.com/local-loop-io/localloop-site) | Official website - protocol spec, platform docs, schema library, guides, governance, interest registry |
| [**localloop-backend**](https://github.com/local-loop-io/localloop-backend) | Lab REST API - interest registry, demo flows, SSE streams, federation handshake, city data |

---

## Where to start

| Goal | Go here |
|:---|:---|
| **Register your city's interest** | [localloop.urbnia.com/interest](https://localloop.urbnia.com/interest) |
| Read the protocol spec | [localloop.urbnia.com/protocol/spec](https://localloop.urbnia.com/protocol/spec) |
| Regulatory context and research notes | [localloop.urbnia.com/docs/regulatory-alignment](https://localloop.urbnia.com/docs/regulatory-alignment) |
| Implementation guide (city decision-maker summary) | [localloop.urbnia.com/docs/implementation](https://localloop.urbnia.com/docs/implementation) |
| Browse schemas & examples | [localloop.urbnia.com/library](https://localloop.urbnia.com/library) |
| Understand MaterialDNA | [localloop.urbnia.com/platform/materialdna](https://localloop.urbnia.com/platform/materialdna) |
| Understand ProductDNA | [localloop.urbnia.com/platform/productdna](https://localloop.urbnia.com/platform/productdna) |
| Explore governance & RFCs | [localloop.urbnia.com/governance](https://localloop.urbnia.com/governance) |
| Run the lab API | [loop-api.urbnia.com/docs](https://loop-api.urbnia.com/docs) |

---

## Get involved

**Read** the [specification](https://localloop.urbnia.com/protocol/spec) and [examples](https://github.com/local-loop-io/loop-protocol/tree/main/examples).
**Raise ideas** via issues or draft an RFC in the [protocol repo](https://github.com/local-loop-io/loop-protocol).
**Express interest** if you represent a city, research group, or operator - [register here](https://localloop.urbnia.com/interest).

---

## Contact & citation

**Mycel UG (haftungsbeschränkt)**
[@alpha912](https://github.com/alpha912) / [dev@mycel-ai.de](mailto:dev@mycel-ai.de) / [mycel-ai.de](https://mycel-ai.de)

```bibtex
@misc{localloop_org_2025,
  author    = {Mycel UG (haftungsbeschränkt)},
  title     = {localLOOP - Local Optimization with Overflow Protocol},
  year      = {2025},
  publisher = {GitHub},
  url       = {https://github.com/local-loop-io},
  note      = {Lab demo only. No public pilots or deployments.}
}
```

## Security contact

Vulnerability reports: see `https://localloop.urbnia.com/.well-known/security.txt` (agent-cycle-028).
