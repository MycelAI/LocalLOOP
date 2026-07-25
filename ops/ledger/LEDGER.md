# LEDGER — localLOOP agent improvement cycles

Append-only. One section per cycle. Status is `DONE` or `BLOCKED`.

## Backlog (ideas deferred mid-cycle)

_None yet._

---

## Cycle 001 — DONE

| Field | Value |
|-------|-------|
| **Item** | Additive Redis probe on `GET /health` |
| **Hypothesis** | Health only checked Postgres; Redis used by queue was invisible to ops/Docker |
| **Repos touched** | `localloop-backend` |
| **Diff summary** | `src/routes/health.ts` concurrent db+redis probes; `tests/health.routes.test.ts` (4 cases); CHANGELOG |
| **Verification** | `evidence/cycles/001/tests.txt` — typecheck OK, 175 tests pass; `evidence/cycles/001/deploy.txt` — live `{"status":"ok","db":"ok","redis":"ok"}` |
| **Deploy order** | backend api only |
| **Deploy result** | success; dependents site/metrics/nodeinfo 200 |
| **Commit SHA** | localloop-backend `880880a4d495104565ccf1b9242c3b369ad0d912` (PR #46 squash) |
| **Tag** | `agent-cycle-001` |
| **Status** | DONE |
| **Next candidate** | Site nginx security headers |


## Cycle 002 — DONE

| Field | Value |
|-------|-------|
| **Item** | Baseline nginx security headers on static site |
| **Hypothesis** | Live site lacked nosniff/frame-options/referrer/permissions headers |
| **Repos touched** | `localloop-site` |
| **Diff summary** | `nginx.conf` security headers; smoke test; CHANGELOG (PR also landed pending openapi-mirror commits from branch base) |
| **Verification** | `evidence/cycles/002/tests.txt` 21 pass; deploy shows live headers |
| **Deploy order** | site only |
| **Deploy result** | success; headers live; API health ok |
| **Commit SHA** | localloop-site `4d1d92ae964a130908b1a9003777be6913e906eb` (PR #73) |
| **Tag** | `agent-cycle-002` |
| **Status** | DONE |


## Cycle 003 — DONE

| Field | Value |
|-------|-------|
| **Item** | Interest search redacts email from live `share_email` (not stale MV) |
| **Hypothesis** | Search MV email lags after share_email revoke → privacy leak |
| **Repos touched** | `localloop-backend` |
| **Diff summary** | `listInterests` search JOIN interests + CASE; privacy DB test; CHANGELOG |
| **Verification** | 176 tests; privacy test pass; live search Curl user email=null |
| **Deploy** | api rebuilt; health ok |
| **Commit SHA** | `6c01cf5568894c66eab8b2053da4795948c6952f` PR#47 |
| **Tag** | `agent-cycle-003` |
| **Status** | DONE |

## Cycle 004 — DONE

| Field | Value |
|-------|-------|
| **Item** | Privacy test fixture typechecks under tsc |
| **Hypothesis** | Cycle 003 test failed tsc (missing consentPublic / null types) |
| **Repos touched** | `localloop-backend` |
| **Diff summary** | `tests/interest.privacy.test.ts` consentPublic; CHANGELOG |
| **Verification** | tsc clean; privacy test pass; live health ok (no runtime deploy) |
| **Commit SHA** | `1dd5be1d9cad610de6c51396e3d7bc2dc8a005d4` PR#48 |
| **Tag** | `agent-cycle-004` |
| **Status** | DONE |


## Cycle 005 — DONE
| Field | Value |
|-------|-------|
| **Item** | `Cache-Control: no-store` on GET /health |
| **Repos** | localloop-backend |
| **SHA** | a0f1ef64015104b92625cb1fc4e0c4a91ace4f5c |
| **Tag** | agent-cycle-005 |
| **Deploy** | live header confirmed |
| **Status** | DONE |

## Cycle 006 — DONE
| Field | Value |
|-------|-------|
| **Item** | Metrics always emit known keys at 0 |
| **Repos** | localloop-backend |
| **SHA** | 7ee4fe1d4baca6c9fe601fc200c5c2c50ba65b92 |
| **Tag** | agent-cycle-006 |
| **Note** | Live still empty until cycle 007 schema fix |
| **Status** | DONE |

## Cycle 007 — DONE
| Field | Value |
|-------|-------|
| **Item** | Metrics schema additionalProperties so Fastify does not strip counters |
| **Repos** | localloop-backend |
| **SHA** | 036a1bd1446f5470f4280954229c9954d804bfb8 |
| **Tag** | agent-cycle-007 |
| **Deploy** | live metrics has 12 keys |
| **Status** | DONE |


## Cycle 013 — DONE

| Field | Value |
|-------|-------|
| **Item** | Dockerfile COPY --chown for faster rebuilds |
| **Repos** | localloop-backend |
| **Commit SHA** | `b1467bca9b242ad63947155788d61d2e5cd8cc1a` |
| **Tag** | `agent-cycle-013` |
| **Status** | DONE |
| **Note** |  |


## Cycle 015 — DONE

| Field | Value |
|-------|-------|
| **Item** | Interest Cache-Control no-store |
| **Repos** | localloop-backend |
| **Commit SHA** | `0b1f2543efa19f5f6090bfb73e8dec8e328ee217` |
| **Tag** | `agent-cycle-015` |
| **Status** | DONE |
| **Note** |  |


## Cycle 016 — DONE

| Field | Value |
|-------|-------|
| **Item** | Shared httpCache helpers |
| **Repos** | localloop-backend |
| **Commit SHA** | `240346022ebd7103ea0222668ae47d6661edc318` |
| **Tag** | `agent-cycle-016` |
| **Status** | DONE |
| **Note** | no runtime deploy |


## Cycle 018 — DONE

| Field | Value |
|-------|-------|
| **Item** | signals short public cache |
| **Repos** | localloop-backend |
| **Commit SHA** | `c7c13343593b717dd9018c8224dc7b6ceaa4a053` |
| **Tag** | `agent-cycle-018` |
| **Status** | DONE |
| **Note** |  |


## Cycle 019 — DONE

| Field | Value |
|-------|-------|
| **Item** | Publish security.txt |
| **Repos** | localloop-site |
| **Commit SHA** | `5e49158676c585277b59bd58124c2478cbf1214c` |
| **Tag** | `agent-cycle-019` |
| **Status** | DONE |
| **Note** |  |


## Cycle 020 — DONE

| Field | Value |
|-------|-------|
| **Item** | robots.txt |
| **Repos** | localloop-site |
| **Commit SHA** | `e7ce5356596bdd109f09de31fc4e1c20a1d35704` |
| **Tag** | `agent-cycle-020` |
| **Status** | DONE |
| **Note** |  |

