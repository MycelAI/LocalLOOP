import { describe, expect, it } from 'bun:test';
import { existsSync } from 'node:fs';
import path from 'node:path';

// The monorepo's protocol/ tree is the canonical source these checks compare
// against. If the backend is ever built in isolation (no protocol/ next to it),
// the case is reported as skipped rather than passing vacuously.
const siblingPresent = existsSync(path.join(import.meta.dirname, '..', '..', '..', 'protocol', 'schemas'));

describe('spec conformance gate (backend <-> loop-protocol <-> docs hub)', () => {
  it.skipIf(!siblingPresent)('passes with no drift and a fully implemented spec route surface', () => {
    const cwd = path.join(import.meta.dirname, '..');
    const result = Bun.spawnSync(['bun', 'run', 'scripts/check-conformance.ts'], { cwd });
    if (result.exitCode !== 0) {
      console.error(result.stdout.toString());
      console.error(result.stderr.toString());
    }
    expect(result.exitCode).toBe(0);
  });
});
