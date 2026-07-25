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

