// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import type { FastifyInstance } from 'fastify';
import { probeDatabase } from './dbReady';

// Client input that used to reach Postgres unchecked and come back as a
// retryable 500 internal_error carrying the raw engine message ("invalid
// input syntax for type bigint ..."). Each must be a 400 invalid request.
const dbReady = await probeDatabase('inputValidation');
const cursorOf = (parts: Record<string, unknown>) => `cur_${Buffer.from(`${JSON.stringify(parts)}                `).toString('base64url')}`;

let app: FastifyInstance;
beforeAll(async () => {
  const { buildServer } = await import('../src/server');
  app = await buildServer({ logger: false });
});
afterAll(async () => {
  await app?.close();
});

describe.skipIf(!dbReady)('evidence listing input', () => {
  for (const query of ['limit=2.5', 'since=garbage', `cursor=${cursorOf({ s: 'x' })}`]) {
    it(`GET /api/v1/evidence?${query.split('=')[0]}=<invalid> is a 400`, async () => {
      const response = await app.inject({ method: 'GET', url: `/api/v1/evidence?${query}` });
      expect(response.statusCode).toBe(400);
      expect(response.body).not.toContain('invalid input syntax');
    });
  }

  it('POST /api/v1/evidence/search rejects a fractional limit and a non-date since', async () => {
    for (const payload of [{ limit: 2.5 }, { since: 'garbage' }]) {
      const response = await app.inject({ method: 'POST', url: '/api/v1/evidence/search', payload });
      expect(response.statusCode).toBe(400);
    }
  });

  it('still accepts a valid since and limit', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/v1/evidence?since=2026-01-01T00:00:00Z&limit=5' });
    expect(response.statusCode).toBe(200);
  });
});

describe.skipIf(!dbReady)('Core-DP material search input', () => {
  for (const filter of ['available_from_gte', 'available_from_lt', 'updated_since']) {
    it(`a non-date ${filter} filter is a 400`, async () => {
      const response = await app.inject({ method: 'POST', url: '/api/v1/material/search', payload: { limit: 5, filters: { [filter]: 'garbage' } } });
      expect(response.statusCode).toBe(400);
      expect(response.body).not.toContain('invalid input syntax');
    });
  }

  it('a cursor with mistyped fields is a 400', async () => {
    const response = await app.inject({ method: 'POST', url: '/api/v1/material/search', payload: { limit: 5, cursor: cursorOf({ u: 'abc', i: 1 }) } });
    expect(response.statusCode).toBe(400);
    expect(response.json().error?.code ?? response.json().code).toBe('invalid_request');
  });

  it('still accepts date-time filters', async () => {
    const response = await app.inject({ method: 'POST', url: '/api/v1/material/search', payload: { limit: 5, filters: { updated_since: '2026-01-01T00:00:00Z' } } });
    expect(response.statusCode).toBe(200);
  });
});

describe('toCoreDpError', () => {
  it('logs an unexpected error but answers with a generic message', async () => {
    const { CoreDpError, toCoreDpError } = await import('../src/errors');
    const logged: unknown[] = [];
    const wrapped = toCoreDpError(new Error('invalid input syntax for type bigint: "3.5"'), { error: (obj) => logged.push(obj) });
    expect(wrapped.code).toBe('internal_error');
    expect(wrapped.message).toBe('Internal server error');
    expect(logged).toHaveLength(1);
    const own = new CoreDpError('invalid_request', 'Bad cursor');
    expect(toCoreDpError(own)).toBe(own);
  });
});
