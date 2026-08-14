# Backup & Restore Drill — 2026-08-14

**Environment:** local dev docker-compose stack only
(`localloop-backend/docker-compose.yml`, on this workspace machine). **Not**
a production VPS drill — this session has no VPS access, and even if it did,
stopping/restoring live production services is a human-supervised action,
not something to run unsupervised inside an autonomous session. A production
drill is recorded as an open follow-up below, not claimed here.

**Runbook exercised:**
[loop-protocol/docs/backup-restore-runbook.md](https://github.com/local-loop-io/loop-protocol/blob/main/docs/backup-restore-runbook.md)
(as corrected during this drill — see Finding 1).

**Operator:** `alpha912` (autonomous session). **Status label per
CLAIMS-AND-MATURITY.md:** Demonstrated (ran in a controlled local
environment; not Operationally evidenced — that requires a real production
drill on a recurring schedule).

## Finding 1: the runbook itself was stale

Section 3 and 4.3 of the runbook referenced a `minio` service and
`./data/minio` path. Direct inspection of
`localloop-backend/docker-compose.yml` (this drill, 2026-08-14) confirmed no
`minio` service exists — it was renamed to `seaweedfs` (S3-compatible,
fronted by an nginx `storage-proxy`) at some prior point, and the runbook was
never updated. Following the runbook literally would have failed at the
object-storage backup step. **Fixed in the same PR as this evidence** —
see `loop-protocol` PR touching `docs/backup-restore-runbook.md`.

## Drill 1: Postgres

```
$ mkdir -p ./backups/postgres
$ sudo docker compose exec -T postgres pg_dump -U localloop -d localloop -Fc \
    > ./backups/postgres/localloop-2026-08-14.dump
```
Result: 692,338-byte custom-format dump, 175 TOC entries (`pg_restore -l`
inside the container), extensions (postgis, pgcrypto, pg_trgm, etc.) all
present.

**Restore verification** (into a scratch database, never touching the live
`localloop` database):
```
$ sudo docker compose exec -T postgres psql -U localloop -d postgres \
    -c "CREATE DATABASE localloop_restore_drill OWNER localloop;"
$ sudo docker compose exec -T postgres pg_restore -U localloop \
    -d localloop_restore_drill --no-owner < ./backups/postgres/localloop-2026-08-14.dump
```

Row counts, source (`localloop`) vs. restored (`localloop_restore_drill`) —
identical across every table checked:

| Table | Source | Restored |
| --- | --- | --- |
| interests | 5 | 5 |
| cities | 3 | 3 |
| loop_materials | 201 | 201 |
| loop_offers | 250 | 250 |
| loop_matches | 0 | 0 |
| loop_transfers | 0 | 0 |
| loop_evidence | 4486 | 4486 |
| federation_nodes | 2 | 2 |
| user (better-auth, new per item 2) | 1 | 1 |
| session (better-auth, new per item 2) | 2 | 2 |

**Content-level check** (not just counts): `md5(string_agg(event_type ||
event_id, ',' ORDER BY event_id))` over all 4,486 `loop_evidence` rows —
`5a6595d9782775f1c8976eeaf4f58721` on both source and restored copy. Exact
match.

Scratch database dropped immediately after verification
(`DROP DATABASE localloop_restore_drill`). Live `localloop` database never
stopped, modified, or touched beyond the read-only `pg_dump`.

## Drill 2: Redis (Valkey)

```
$ sudo docker compose exec -T redis redis-cli --no-auth-warning -a "$REDIS_PASSWORD" DBSIZE
12
$ sudo docker compose exec -T redis redis-cli --no-auth-warning -a "$REDIS_PASSWORD" SAVE
OK
$ sudo cp ./data/redis/dump.rdb ./backups/redis/dump-2026-08-14.rdb
```
Result: 3,101-byte RDB snapshot, 12 keys at source.

**Restore verification** (ephemeral, isolated container, never touching the
live `redis` container): copied the RDB into `/tmp/redis-restore-drill`,
started `valkey/valkey@sha256:a038175878d66b9d274fbf8be73c0305e93798b83917647f167e18cef3c71eec`
pointed at that directory, ran `DBSIZE` (12 — matches source) and `KEYS *`
(12 real BullMQ interest-queue keys, e.g. `bull:interest:1` through `:7`,
`bull:interest:meta`/`:wait`/`:marker`/`:events`/`:id`). Container removed
and scratch files deleted immediately after.

## Drill 3: Object storage (seaweedfs)

Corrected per Finding 1. `s3Client` has zero application-level importers as
of this review (`localloop-backend/docs/SPEC-COMPLIANCE.md`), so there is no
real application object data yet — this drill verifies the backup/restore
*mechanism* against seaweedfs's own internal state (872 KB, 96 files: volume
index/data files), not real uploaded content.

```
$ sudo tar -czf ./backups/seaweedfs/seaweedfs-data-2026-08-14.tar.gz ./data/seaweedfs
$ sudo tar -xzf ./backups/seaweedfs/seaweedfs-data-2026-08-14.tar.gz -C /tmp/seaweedfs-restore-drill
$ diff -rq ./data/seaweedfs /tmp/seaweedfs-restore-drill/data/seaweedfs
```
Result: no diff output — byte-for-byte identical. Scratch copy deleted
after verification; live `seaweedfs` container never stopped.

## Post-drill live-stack health check

Confirmed the live stack was never disrupted by any of the above:
```
$ curl -sf http://127.0.0.1:8088/health
{"status":"ok","time":"2026-08-14T22:49:26.351Z","uptime":4356.8,"db":"ok","redis":"ok","version":"0.5.0"}
```
`/api/interest` and `/api/v1/node/info` both returned real data after the
drill, confirming no disruption.

## What this drill does and does not prove

**Proves:** the documented backup commands produce valid, restorable
artifacts for all three data stores, verified at both row-count and
content-checksum granularity for Postgres, key-count granularity for Redis,
and byte-for-byte granularity for object storage. The runbook (once
corrected) is accurate against the current docker-compose service names.

**Does not prove:** that a production VPS restore under real operational
pressure (degraded disk, partial backup, concurrent write load, wrong
`.env` on the target host) goes as smoothly. That requires a real production
drill, ideally on the recurring `localloop-backend-backup.timer` schedule
with a periodic restore-drill companion, which is recorded here as an open
follow-up, not claimed as done.

## Backup artifacts

Left in place at `localloop-backend/backups/{postgres,redis,seaweedfs}/`
(now gitignored — `/backups` added to `.gitignore` in the same PR as this
drill, since the runbook instructs writing dumps into the repo directory and
that was previously untracked-but-not-ignored, one accidental `git add -A`
away from committing a database dump). These contain the same PII the live
`interests` table already holds (5 dev-seeded contact rows) — handle with
the same care as the live database, not as disposable scratch output.

## Open follow-ups (not done in this drill)

1. **Production VPS drill.** Requires a human operator with VPS access and
   a maintenance window; out of scope for an unsupervised session.
2. **Automated restore-drill scheduling.** The existing
   `localloop-backend-backup.timer` automates *backups*; there is no
   equivalent automated, periodic *restore* verification. A quarterly manual
   drill (repeating this procedure) is a reasonable lab-stage cadence until
   there's a real pilot to justify more automation.
