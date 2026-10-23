// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

import { describe, expect, it } from 'bun:test';
import Fastify from 'fastify';
import { registerLoopProtocolParsers } from '../src/protocol';

// application/ld+json bodies must be parsed exactly like application/json:
// a client's malformed body is a 400 (it used to surface as a logged 500),
// and prototype-poisoning keys are rejected rather than reaching handlers.
async function post(contentType: string, payload: string) {
  const app = Fastify({ logger: false });
  registerLoopProtocolParsers(app);
  app.post('/echo', async (request) => ({ body: request.body }));
  try {
    return await app.inject({ method: 'POST', url: '/echo', headers: { 'content-type': contentType }, payload });
  } finally {
    await app.close();
  }
}

describe('application/ld+json parser', () => {
  it('parses valid JSON-LD, with or without parameters', async () => {
    for (const contentType of ['application/ld+json', 'application/ld+json; charset=utf-8']) {
      const response = await post(contentType, '{"@type":"MaterialDNA"}');
      expect(response.statusCode).toBe(200);
      expect(response.json().body).toEqual({ '@type': 'MaterialDNA' });
    }
  });

  it('answers malformed and empty bodies with 400, like application/json', async () => {
    for (const payload of ['{bad', '']) {
      const ldJson = await post('application/ld+json', payload);
      expect(ldJson.statusCode).toBe(400);
    }
    expect((await post('application/json', '{bad')).statusCode).toBe(400);
  });

  it('rejects __proto__ and constructor.prototype keys', async () => {
    expect((await post('application/ld+json', '{"__proto__":{"polluted":true}}')).statusCode).toBe(400);
    expect((await post('application/ld+json', '{"constructor":{"prototype":{"polluted":true}}}')).statusCode).toBe(400);
  });
});

describe('application/ld+json parse errors through the server error handler', () => {
  it('return the §8.3 INVALID_REQUEST envelope, not INTERNAL_ERROR', async () => {
    const { buildServer } = await import('../src/server');
    const app = await buildServer({ logger: false });
    try {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/material',
        headers: { 'content-type': 'application/ld+json' },
        payload: '{bad',
      });
      expect(response.statusCode).toBe(400);
      expect(response.json().error.code).toBe('INVALID_REQUEST');
    } finally {
      await app.close();
    }
  });
});
