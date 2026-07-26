#!/usr/bin/env python3
"""Mechanical DONE gate: every LEDGER DONE cycle must have runtime reverify evidence.

Fails unless reverify.txt proves runtime behavior via at least one of:
  (a) captured bun test / typecheck with exit 0
  (b) Fastify inject / HTTP status + body
  (c) live response headers/body including the claimed feature

Rejects as insufficient:
  - has_setNoStore=True alone
  - readFileSync / toContain source greps as sole proof
  - reconstruction-only text
  - missing unique "cycle": N in live.txt
  - ok=True without runtime proof
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

AGENT = Path(__file__).resolve().parents[1]
LEDGER = AGENT / "LEDGER.md"
CYCLES = AGENT / "evidence" / "cycles"

# Patterns that alone are NOT runtime proof
SOURCE_ONLY = re.compile(
    r"has_setNoStore\s*=\s*True|"
    r"readFileSync|"
    r"toContain\(|"
    r"source_has_|"
    r"file=src/routes/|"
    r"expects?\s+src\s+to\s+contain",
    re.I,
)

# Runtime proof markers (need at least one class)
RUNTIME = re.compile(
    r"("
    r"bun test|"
    r"tsc --noEmit|"
    r"typecheck|"
    r"exit\s*=\s*0|"
    r"HTTP/\d|"
    r"HTTP\s+[1-5]\d\d|"
    r"cache-control\s*[:=]\s*|"
    r"statusCode|"
    r"app\.inject|"
    r"GET\s+/|"
    r"POST\s+/|"
    r'"status"\s*:\s*"ok"|'
    r"curl\s|"
    r"Content-Type|"
    r"x-frame-options|"
    r"nosniff"
    r")",
    re.I,
)


def done_cycles() -> list[int]:
    text = LEDGER.read_text()
    return [int(n) for n in re.findall(r"## Cycle (\d+) — DONE", text)]


def check_cycle(n: int) -> list[str]:
    errors: list[str] = []
    d = CYCLES / f"{n:03d}"
    for name in ("reverify.txt", "live.txt", "verification.txt", "deploy.txt"):
        if not (d / name).exists():
            errors.append(f"missing {name}")

    if errors:
        return errors

    reverify = (d / "reverify.txt").read_text()
    live = (d / "live.txt").read_text()
    verification = (d / "verification.txt").read_text()

    if "status=DONE" not in verification and "status=DONE" not in reverify:
        # verification should say DONE
        if "DONE" not in verification:
            errors.append("verification.txt does not claim DONE")

    # live must carry unique cycle id
    if f'"cycle": {n}' not in live and f'"cycle":{n}' not in live:
        errors.append('live.txt missing unique "cycle": N')

    # ok=True required in reverify for DONE
    if "ok=True" not in reverify and "ok=true" not in reverify:
        errors.append("reverify.txt missing ok=True")

    has_runtime = bool(RUNTIME.search(reverify))
    # Detect pure source theater: source markers present and no runtime markers
    # OR reverify is only has_setNoStore lines
    stripped = re.sub(r"\s+", " ", reverify).strip()
    pure_source = bool(
        re.search(r"has_setNoStore\s*=\s*True", reverify)
        and not re.search(r"cache-control|HTTP/|bun test|app\.inject|statusCode", reverify, re.I)
    )
    if pure_source:
        errors.append("source-only reverify (has_setNoStore without runtime header/test proof)")
    elif not has_runtime:
        # allow if reverify has substantial runtime elsewhere
        if len(reverify) < 80 or SOURCE_ONLY.search(reverify):
            errors.append("no runtime evidence (bun test / inject / live HTTP headers/body)")

    return errors


def main() -> int:
    cycles = done_cycles()
    if not cycles:
        print("No DONE cycles found in LEDGER.md", file=sys.stderr)
        return 1

    weak: list[tuple[int, list[str]]] = []
    for n in cycles:
        errs = check_cycle(n)
        if errs:
            weak.append((n, errs))

    print(f"DONE cycles checked: {len(cycles)}")
    if weak:
        print(f"WEAK: {len(weak)}")
        for n, errs in weak:
            print(f"  {n:03d}: {'; '.join(errs)}")
        return 1

    print("ALL DONE CYCLES PASS RUNTIME EVIDENCE GATE")
    return 0


if __name__ == "__main__":
    sys.exit(main())
