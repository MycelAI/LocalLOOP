<div align="center">

[<img src="https://local-loop-io.github.io/assets/local-loop-logo.png" width="180" alt="localLOOP" />](https://local-loop-io.github.io)

# localLOOP

**Local Optimization with Overflow Protocol**

Circular economy infrastructure for cities — federated, open, and sovereignty-preserving.

[![Spec](https://img.shields.io/badge/LOOP_spec-v0.2.0-2563eb?style=flat-square)](https://local-loop-io.github.io/protocol/spec)
[![Website](https://img.shields.io/badge/website-local--loop--io.github.io-16a34a?style=flat-square)](https://local-loop-io.github.io)
[![API](https://img.shields.io/badge/lab_API-loop--api.urbnia.com-ea580c?style=flat-square)](https://loop-api.urbnia.com/docs)
[![Status](https://img.shields.io/badge/status-lab_demo_only-f59e0b?style=flat-square)](https://local-loop-io.github.io/protocol/spec)

</div>

---

## What is localLOOP?

localLOOP is a research and protocol project building the open infrastructure for **federated municipal material exchange**. The core idea: cities should be able to track, offer, match, and transfer surplus materials and products across boundaries — without surrendering data sovereignty or locking into a single platform.

We're designing this as an **open protocol** (LOOP), not a product. The schemas, spec, and governance are public. The lab backend demonstrates the flows. Cities, researchers, and builders are welcome to engage.

> **Early-stage.** Lab demo only. No public pilots or production deployments yet.

---

## The LOOP protocol

LOOP — *Local Optimization with Overflow Protocol* — defines how autonomous city nodes discover each other, register materials, post offers, compute matches, and settle transfers. Key concepts:

| Concept | What it is |
|:---|:---|
| **MaterialDNA** | Globally unique identity for a material batch — category, quantity, provenance, availability |
| **ProductDNA** | Digital product passport for finished goods — EU DPP/ESPR Art. 9-10 aligned |
| **LoopCoin (LC)** | Local digital currency with built-in expiry to incentivise circulation |
| **LoopSignal** | Community preference weight for material categories |
| **Offer → Match → Transfer** | The minimal interop flow across federated nodes |
| **Federation handshake** | How two LOOP nodes discover and register each other |

Current release: **v0.2.0** (lab baseline). Schemas validated with AJV.

---

## Repositories

| Repo | What's inside |
|:---|:---|
| [**loop-protocol**](https://github.com/local-loop-io/loop-protocol) | Normative spec, 11 JSON schemas, JSON-LD contexts (v0.1.1 + v0.2.0), 15+ examples, governance RFCs |
| [**local-loop-io.github.io**](https://github.com/local-loop-io/local-loop-io.github.io) | Official website — protocol spec, platform docs, schema library, guides, governance, interest registry |
| [**localloop-backend**](https://github.com/local-loop-io/localloop-backend) | Lab REST API — interest registry, demo flows, SSE streams, federation handshake, city data |

---

## Where to start

| Goal | Go here |
|:---|:---|
| Read the protocol spec | [local-loop-io.github.io/protocol/spec](https://local-loop-io.github.io/protocol/spec) |
| Browse schemas & examples | [local-loop-io.github.io/library](https://local-loop-io.github.io/library) |
| Understand MaterialDNA | [local-loop-io.github.io/platform/materialdna](https://local-loop-io.github.io/platform/materialdna) |
| Understand ProductDNA | [local-loop-io.github.io/platform/productdna](https://local-loop-io.github.io/platform/productdna) |
| Read implementation guides | [local-loop-io.github.io/docs](https://local-loop-io.github.io/docs) |
| Explore governance & RFCs | [local-loop-io.github.io/governance](https://local-loop-io.github.io/governance) |
| Run the lab API | [loop-api.urbnia.com/docs](https://loop-api.urbnia.com/docs) |
| **Express interest** | [local-loop-io.github.io/interest](https://local-loop-io.github.io/interest) |

---

## Get involved

**Read** the [specification](https://local-loop-io.github.io/protocol/spec) and [examples](https://github.com/local-loop-io/loop-protocol/tree/main/examples).
**Raise ideas** via issues or draft an RFC in the [protocol repo](https://github.com/local-loop-io/loop-protocol).
**Express interest** if you represent a city, research group, or operator — [register here](https://local-loop-io.github.io/interest).

---

## Contact & citation

**Alphin Tom** — Co-founder & CEO, Mycel UG (haftungsbeschränkt)
[@alpha912](https://github.com/alpha912) · [alphin@mycel-ai.de](mailto:alphin@mycel-ai.de) · [mycel-ai.de](https://mycel-ai.de)

```bibtex
@misc{localloop_org_2025,
  author    = {Alphin Tom and Mycel UG (haftungsbeschränkt)},
  title     = {localLOOP — Local Optimization with Overflow Protocol},
  year      = {2025},
  publisher = {GitHub},
  url       = {https://github.com/local-loop-io},
  note      = {Lab demo only. No public pilots or deployments.}
}
```
