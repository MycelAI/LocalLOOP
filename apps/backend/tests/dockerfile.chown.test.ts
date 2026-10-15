// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

import { describe, expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('Dockerfile ownership', () => {
  it('copies src as app via --chown and drops full-tree chown after src', () => {
    const df = readFileSync(join(import.meta.dir, '..', 'Dockerfile'), 'utf8');
    expect(df).toContain('COPY --chown=app:app src');
    expect(df).toContain('USER app');
    expect(df).toContain('COPY --chown=app:app vendor ./vendor');
    expect(df).toMatch(/^FROM oven\/bun:[0-9.]+@sha256:[0-9a-f]{64}$/m);
    // expensive full-tree chown after src copy should be gone
    expect(df).not.toMatch(/COPY --chown=app:app src[\s\S]*RUN chown -R app:app \/app/);
  });
});
