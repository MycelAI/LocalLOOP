// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

import { afterEach, describe, expect, it } from 'bun:test';
import Fastify from 'fastify';
import { config } from '../src/config';
import { registerLoopProtocolParsers } from '../src/protocol';
import { registerFederateRoutes } from '../src/routes/federate';
import { registerLoopRoutes } from '../src/routes/loop';
import { registerLoopSchemas } from '../src/schemas/loopSchemas';
import { TEST_API_KEY } from './testApiKey';

// The lab relay and the federation ingest routes require an API key even while
// API_KEY_ENABLED is off (the default for the public lab writes).
const original = { ...config.auth };
afterEach(() => {
  config.auth.apiKey = original.apiKey;
  config.auth.apiKeyEnabled = original.apiKeyEnabled;
});

const relayBody = {
  event_type: 'material.created',
  entity_type: 'material',
  entity_id: 'MAT-DE-MUC-2025-PLASTIC-B847F3',
  payload: { hello: 'world' },
};
const announcement = {
  '@context': 'https://loop.urbnia.com/projects/loop-protocol/contexts/loop-v0.2.0.jsonld',
  '@type': 'MaterialAnnouncement',
  material: 'MAT-DE-MUC-2025-FOOD-B847F3',
  origin: 'munich.loop',
  available: true,
};
const offer = {
  '@context': 'https://loop.urbnia.com/projects/loop-protocol/contexts/loop-v0.2.0.jsonld',
  '@type': 'MaterialOffer',
  material: 'MAT-DE-MUC-2025-FOOD-B847F3',
  from: 'vienna.loop',
  base_price: 60,
  loop_cost: 104,
  valid_until: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
};
const nodeHeaders = () => ({
  'x-node-id': 'munich.loop',
  'x-node-signature': 'lab-signature-placeholder',
  'x-timestamp': new Date().toISOString(),
});

async function buildApp() {
  const app = Fastify({ logger: false });
  registerLoopProtocolParsers(app);
  registerLoopSchemas(app);
  const insertLoopEvent = async () => ({ id: 1, created_at: new Date().toISOString() });
  await registerLoopRoutes(app, { insertLoopEvent, broadcastLoopEvent: () => undefined } as never);
  await registerFederateRoutes(app, {
    insertLoopEvent,
    getLoopMaterial: async (id: string) => ({ id }),
    broadcastLoopEvent: () => undefined,
  } as never);
  return app;
}

const routes = [
  ['relay', '/api/v1/relay', relayBody, {}],
  ['federate/announce', '/api/v1/federate/announce', announcement, nodeHeaders()],
  ['federate/offer', '/api/v1/federate/offer', offer, nodeHeaders()],
] as const;

describe('always-on API key for relay and federation ingest', () => {
  it.each(routes)('%s: 401 without a key while API_KEY_ENABLED is off', async (_label, url, payload, headers) => {
    config.auth.apiKeyEnabled = false;
    config.auth.apiKey = TEST_API_KEY;
    const app = await buildApp();
    try {
      const response = await app.inject({ method: 'POST', url, payload, headers });
      expect(response.statusCode).toBe(401);
      expect(response.json().error.code).toBe('UNAUTHORIZED');
    } finally {
      await app.close();
    }
  });

  it.each(routes)('%s: 401 with a wrong key', async (_label, url, payload, headers) => {
    config.auth.apiKeyEnabled = false;
    config.auth.apiKey = TEST_API_KEY;
    const app = await buildApp();
    try {
      const response = await app.inject({ method: 'POST', url, payload, headers: { ...headers, 'x-api-key': 'wrong-key-0123456789abcdef' } });
      expect(response.statusCode).toBe(401);
    } finally {
      await app.close();
    }
  });

  it.each(routes)('%s: 503, not open, when no API_KEY is configured', async (_label, url, payload, headers) => {
    config.auth.apiKeyEnabled = false;
    config.auth.apiKey = undefined;
    const app = await buildApp();
    try {
      const response = await app.inject({ method: 'POST', url, payload, headers });
      expect(response.statusCode).toBe(503);
    } finally {
      await app.close();
    }
  });

  it.each(routes)('%s: 202 with the key (header or Bearer)', async (_label, url, payload, headers) => {
    config.auth.apiKeyEnabled = false;
    config.auth.apiKey = TEST_API_KEY;
    const app = await buildApp();
    try {
      const viaHeader = await app.inject({ method: 'POST', url, payload, headers: { ...headers, 'x-api-key': TEST_API_KEY } });
      expect(viaHeader.statusCode).toBe(202);
      const viaBearer = await app.inject({ method: 'POST', url, payload, headers: { ...headers, authorization: `Bearer ${TEST_API_KEY}` } });
      expect(viaBearer.statusCode).toBe(202);
    } finally {
      await app.close();
    }
  });
});
