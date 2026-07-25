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

