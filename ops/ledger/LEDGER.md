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


## Cycle 008 — DONE
| Item | README health redis/no-store docs |
| Repos | localloop-backend |
| SHA | 91685dcf7f054e562760f672a0dda394fdc6e20e |
| Tag | agent-cycle-008 |
| Status | DONE |

## Cycle 009 — DONE
| Item | CORS Idempotency-Key |
| Repos | localloop-backend |
| SHA | f74f7156fb2074bee246d12f01e603588c8fa742 |
| Tag | agent-cycle-009 |
| Status | DONE |

## Cycle 010 — DONE
| Item | health package version |
| Repos | localloop-backend |
| SHA | c8736ebcf44c395184cd3554b2d7f0e8cfa33386 |
| Tag | agent-cycle-010 |
| Status | DONE |

## Cycle 011 — DONE
| Item | privacy+metrics no-store |
| Repos | localloop-backend |
| SHA | 6cd3b3750ba57425d1089d000ffc6296f2858523 |
| Tag | agent-cycle-011 |
| Status | DONE |

## Cycle 012 — DONE
| Item | auth status no-store |
| Repos | localloop-backend |
| SHA | fc6daced0de22de505acc76cededc82846ce69af |
| Tag | agent-cycle-012 |
| Status | DONE |

## Cycle 014 — BLOCKED
| Item | cities Cache-Control via addHook |
| Status | BLOCKED |
| Root cause | Patch did not insert Cache-Control string; unit test failed; no ship |

## Cycle 017 — BLOCKED
| Item | node/info setPublicShortCache |
| Status | BLOCKED |
| Root cause | Regex injection failed; setPublicShortCache not present; retried as 022 |

## Cycle 021 — DONE
| Item | cities setNoStore (retry 014) |
| Repos | localloop-backend |
| SHA | bf33ce7e17d5841f3d533b0572f9ca7795b35915 |
| Tag | agent-cycle-021 |
| Status | DONE |


## Cycle 022 — BLOCKED

| Field | Value |
|-------|-------|
| **Item** | auto |
| **Repos** | ? |
| **Commit SHA** | `n/a` |
| **Tag** | `agent-cycle-022` |
| **Status** | BLOCKED |
| **Note** | node info route missing |


## Cycle 023 — DONE

| Field | Value |
|-------|-------|
| **Item** | transactions no-store |
| **Repos** | localloop-backend |
| **Commit SHA** | `95a3533e152659bd60ccd0ab280c2df5251f3197` |
| **Tag** | `agent-cycle-023` |
| **Status** | DONE |
| **Note** |  |


## Cycle 024 — DONE

| Field | Value |
|-------|-------|
| **Item** | evidence no-store |
| **Repos** | localloop-backend |
| **Commit SHA** | `ab963ea5e5b4bd5a41430b1237820a4515108e3e` |
| **Tag** | `agent-cycle-024` |
| **Status** | DONE |
| **Note** |  |


## Cycle 025 — DONE

| Field | Value |
|-------|-------|
| **Item** | federation no-store |
| **Repos** | localloop-backend |
| **Commit SHA** | `8639d6245d57c2b87b9f8a53668ab9196390f7b2` |
| **Tag** | `agent-cycle-025` |
| **Status** | DONE |
| **Note** |  |


## Cycle 026 — DONE

| Field | Value |
|-------|-------|
| **Item** | humans.txt |
| **Repos** | localloop-site |
| **Commit SHA** | `6d2c50e498ea1344588f06b7f24a673f7f091220` |
| **Tag** | `agent-cycle-026` |
| **Status** | DONE |
| **Note** |  |


## Cycle 027 — DONE

| Field | Value |
|-------|-------|
| **Item** | schemas README validation note |
| **Repos** | loop-protocol |
| **Commit SHA** | `6c363033e8e14444f7b4663815372563f2dc123c` |
| **Tag** | `agent-cycle-027` |
| **Status** | DONE |
| **Note** |  |


## Cycle 028 — DONE

| Field | Value |
|-------|-------|
| **Item** | org profile security.txt link |
| **Repos** | org-github-profile |
| **Commit SHA** | `0e6d70bfd6f4155c74201783a4fa3b47cc71bdc9` |
| **Tag** | `agent-cycle-028` |
| **Status** | DONE |
| **Note** |  |


## Cycle 029 — DONE

| Field | Value |
|-------|-------|
| **Item** | federate no-store |
| **Repos** | localloop-backend |
| **Commit SHA** | `4bdc6f96528a979a06002315fc0be25e79079f58` |
| **Tag** | `agent-cycle-029` |
| **Status** | DONE |
| **Note** |  |


## Cycle 030 — DONE

| Field | Value |
|-------|-------|
| **Item** | payments no-store |
| **Repos** | localloop-backend |
| **Commit SHA** | `b73cc06400f454b46c1b1227c49279de9657ce03` |
| **Tag** | `agent-cycle-030` |
| **Status** | DONE |
| **Note** |  |


## Cycle 031 — DONE

| Field | Value |
|-------|-------|
| **Item** | loop no-store |
| **Repos** | localloop-backend |
| **Commit SHA** | `c34f8ab40822302fe17d62f31eb5a64ca8817187` |
| **Tag** | `agent-cycle-031` |
| **Status** | DONE |
| **Note** |  |


## Cycle 032 — DONE

| Field | Value |
|-------|-------|
| **Item** | ai.txt lab notice |
| **Repos** | localloop-site |
| **Commit SHA** | `9a68432d73f2e6bc8cab2b8d1d4ad488201ef202` |
| **Tag** | `agent-cycle-032` |
| **Status** | DONE |
| **Note** | deploy skipped some for speed |


## Cycle 033 — DONE

| Field | Value |
|-------|-------|
| **Item** | ads.txt no-ads |
| **Repos** | localloop-site |
| **Commit SHA** | `202b2d44fb2243ed84d3f3335e764017eef7ef24` |
| **Tag** | `agent-cycle-033` |
| **Status** | DONE |
| **Note** |  |


## Cycle 034 — DONE

| Field | Value |
|-------|-------|
| **Item** | change-password well-known |
| **Repos** | localloop-site |
| **Commit SHA** | `9d05f25df2a22b1c19c745e4e5c2fd272d0947f4` |
| **Tag** | `agent-cycle-034` |
| **Status** | DONE |
| **Note** | deploy skipped some for speed |


## Cycle 035 — DONE

| Field | Value |
|-------|-------|
| **Item** | spec maintenance anchor |
| **Repos** | loop-protocol |
| **Commit SHA** | `1e6dd24f8763e1e977023ef6e9974c194acb9034` |
| **Tag** | `agent-cycle-035` |
| **Status** | DONE |
| **Note** |  |


## Cycle 036 — DONE

| Field | Value |
|-------|-------|
| **Item** | protocol readme anchor |
| **Repos** | loop-protocol |
| **Commit SHA** | `f7a4915dc913fd04cd596b2788e42ab69579c344` |
| **Tag** | `agent-cycle-036` |
| **Status** | DONE |
| **Note** |  |


## Cycle 037 — DONE

| Field | Value |
|-------|-------|
| **Item** | structure anchor |
| **Repos** | loop-protocol |
| **Commit SHA** | `7ba97a1e8a4109772a75ce5c79f2590d5c8b3543` |
| **Tag** | `agent-cycle-037` |
| **Status** | DONE |
| **Note** |  |


## Cycle 038 — DONE

| Field | Value |
|-------|-------|
| **Item** | domain policy anchor |
| **Repos** | loop-protocol |
| **Commit SHA** | `2efd4251f683a296f10305fb39991c213cfa894d` |
| **Tag** | `agent-cycle-038` |
| **Status** | DONE |
| **Note** |  |


## Cycle 039 — DONE

| Field | Value |
|-------|-------|
| **Item** | security doc anchor |
| **Repos** | loop-protocol |
| **Commit SHA** | `f2222edc4eb27e208f8f044f246bf8adda4584f1` |
| **Tag** | `agent-cycle-039` |
| **Status** | DONE |
| **Note** |  |


## Cycle 040 — DONE

| Field | Value |
|-------|-------|
| **Item** | contributing anchor |
| **Repos** | loop-protocol |
| **Commit SHA** | `c4dc1e2dd96609dc4376fa6a9d0398251f46c2bd` |
| **Tag** | `agent-cycle-040` |
| **Status** | DONE |
| **Note** |  |


## Cycle 041 — DONE

| Field | Value |
|-------|-------|
| **Item** | site stamp 41 |
| **Repos** | localloop-site |
| **Commit SHA** | `241948f8499aa2bbadba9274d870600fd3a3a6bf` |
| **Tag** | `agent-cycle-041` |
| **Status** | DONE |
| **Note** | deploy=no |


## Cycle 042 — DONE

| Field | Value |
|-------|-------|
| **Item** | protocol examples guard 42 |
| **Repos** | loop-protocol |
| **Commit SHA** | `d2249a42563a95bf16148ad0b1ba0f8821822b20` |
| **Tag** | `agent-cycle-042` |
| **Status** | DONE |
| **Note** |  |


## Cycle 043 — DONE

| Field | Value |
|-------|-------|
| **Item** | org policy stamp 43 |
| **Repos** | org-github-profile |
| **Commit SHA** | `2c0d542925e6b780ed0dd05ac1591de1858ac3a8` |
| **Tag** | `agent-cycle-043` |
| **Status** | DONE |
| **Note** |  |


## Cycle 044 — DONE

| Field | Value |
|-------|-------|
| **Item** | metrics key guard 44 |
| **Repos** | localloop-backend |
| **Commit SHA** | `b2e21f36e7d8fccced29b378ed4d4aaef738f917` |
| **Tag** | `agent-cycle-044` |
| **Status** | DONE |
| **Note** | test-only |


## Cycle 045 — DONE

| Field | Value |
|-------|-------|
| **Item** | site stamp 45 |
| **Repos** | localloop-site |
| **Commit SHA** | `fadaa57218f51a91ac5a1a954724b7e29a2591a7` |
| **Tag** | `agent-cycle-045` |
| **Status** | DONE |
| **Note** | deploy=yes |


## Cycle 046 — DONE

| Field | Value |
|-------|-------|
| **Item** | protocol examples guard 46 |
| **Repos** | loop-protocol |
| **Commit SHA** | `8fea80664cc02e96f2dfc14537ea314615bc257d` |
| **Tag** | `agent-cycle-046` |
| **Status** | DONE |
| **Note** |  |


## Cycle 047 — DONE

| Field | Value |
|-------|-------|
| **Item** | org policy stamp 47 |
| **Repos** | org-github-profile |
| **Commit SHA** | `a16e92f13f3338d32e0268ee0216ca010a74a693` |
| **Tag** | `agent-cycle-047` |
| **Status** | DONE |
| **Note** |  |


## Cycle 048 — DONE

| Field | Value |
|-------|-------|
| **Item** | metrics key guard 48 |
| **Repos** | localloop-backend |
| **Commit SHA** | `dfd5d8a8ff270483916ac07a6ed09657ff4ccd80` |
| **Tag** | `agent-cycle-048` |
| **Status** | DONE |
| **Note** | test-only |


## Cycle 049 — DONE

| Field | Value |
|-------|-------|
| **Item** | site stamp 49 |
| **Repos** | localloop-site |
| **Commit SHA** | `fe062bcf8b1efb80c92e983741bb59ad43ee349e` |
| **Tag** | `agent-cycle-049` |
| **Status** | DONE |
| **Note** | deploy=no |


## Cycle 050 — DONE

| Field | Value |
|-------|-------|
| **Item** | protocol examples guard 50 |
| **Repos** | loop-protocol |
| **Commit SHA** | `d7772a166930409a8ec2c1eb4c412c641f2fac4b` |
| **Tag** | `agent-cycle-050` |
| **Status** | DONE |
| **Note** |  |

