// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

import { describe, expect, it } from 'bun:test';
import { existsSync } from 'node:fs';
import path from 'node:path';

// The monorepo's protocol/ tree is the canonical source these checks compare
// against. If the backend is ever built in isolation (no protocol/ next to it),
// the case is reported as skipped rather than passing vacuously.
const siblingPresent = existsSync(path.join(import.meta.dirname, '..', '..', '..', 'protocol', 'schemas'));

describe('schema sync (loop-protocol -> localloop-backend)', () => {
  it.skipIf(!siblingPresent)('backend schema copies match the canonical loop-protocol source', () => {
    const cwd = path.join(import.meta.dirname, '..');
    const result = Bun.spawnSync(['bun', 'run', 'scripts/sync-schemas.ts', '--check'], { cwd });
    if (result.exitCode !== 0) {
      console.error(result.stderr.toString());
    }
    expect(result.exitCode).toBe(0);
  });
});
