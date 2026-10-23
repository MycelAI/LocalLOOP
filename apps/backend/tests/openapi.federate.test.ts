// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

import { describe, expect, it } from 'bun:test';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import Fastify from 'fastify';
import { registerLoopProtocolParsers } from '../src/protocol';
import { registerFederateRoutes } from '../src/routes/federate';
import { apiKeyHeader, useTestApiKey } from './testApiKey';

useTestApiKey();

// protocol/openapi.json is the reference contract. The federation routes
// enforce the SPECIFICATION.md §9.2 headers, so the contract must declare each
// of them as a required header and list every status the route can answer;
// it used to declare neither, so a generated client always got an
// undocumented 401.
const openapiPath = join(import.meta.dir, '..', '..', '..', 'protocol', 'openapi.json');
const hasProtocol = existsSync(openapiPath);

type Operation = {
  parameters?: { $ref?: string }[];
  responses: Record<string, unknown>;
};

const openapi = hasProtocol
  ? (JSON.parse(readFileSync(openapiPath, 'utf8')) as {
      paths: Record<string, { post: Operation }>;
      components: { parameters: Record<string, { name: string; in: string; required?: boolean }> };
    })
  : undefined;

const requiredHeaders = (operation: Operation) =>
  (operation.parameters ?? [])
    .map((parameter) => openapi!.components.parameters[(parameter.$ref ?? '').split('/').pop() ?? ''])
    .filter((parameter) => parameter?.in === 'header' && parameter.required)
    .map((parameter) => parameter.name.toLowerCase());

const cases = [
  {
    path: '/api/v1/federate/announce',
    payload: {
      '@context': 'https://loop.urbnia.com/projects/loop-protocol/contexts/loop-v0.2.0.jsonld',
      '@type': 'MaterialAnnouncement',
      material: 'MAT-DE-MUC-2025-FOOD-B847F3',
      origin: 'munich.loop',
      available: true,
    },
  },
  {
    path: '/api/v1/federate/offer',
    payload: {
      '@context': 'https://loop.urbnia.com/projects/loop-protocol/contexts/loop-v0.2.0.jsonld',
      '@type': 'MaterialOffer',
      material: 'MAT-DE-MUC-2025-FOOD-B847F3',
      from: 'vienna.loop',
      base_price: 60,
      loop_cost: 104,
      valid_until: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    },
  },
];

const nodeHeaders = () => ({
  'x-node-id': 'munich.loop',
  'x-node-signature': 'lab-signature-placeholder',
  'x-timestamp': new Date().toISOString(),
});

async function post(path: string, payload: Record<string, unknown>, headers: Record<string, string>) {
  const app = Fastify({ logger: false });
  registerLoopProtocolParsers(app);
  await registerFederateRoutes(app, {
    insertLoopEvent: async () => ({ id: 1, created_at: new Date().toISOString() }),
    getLoopMaterial: async (id: string) => ({ id }),
    broadcastLoopEvent: () => undefined,
  });
  try {
    return await app.inject({ method: 'POST', url: path, headers: { ...apiKeyHeader, ...headers }, payload });
  } finally {
    await app.close();
  }
}

describe.skipIf(!hasProtocol)('openapi.json documents the §9.2 federation headers the routes enforce', () => {
  for (const { path, payload } of cases) {
    it(`${path} declares X-Node-ID, X-Node-Signature and X-Timestamp as required headers`, () => {
      expect(requiredHeaders(openapi!.paths[path]!.post).sort()).toEqual(['x-node-id', 'x-node-signature', 'x-timestamp']);
    });

    it(`${path} rejects a request missing any declared header, with a documented status`, async () => {
      const operation = openapi!.paths[path]!.post;
      expect((await post(path, payload, nodeHeaders())).statusCode).toBe(202);
      for (const header of requiredHeaders(operation)) {
        const headers: Record<string, string> = nodeHeaders();
        delete headers[header];
        const response = await post(path, payload, headers);
        expect([400, 401]).toContain(response.statusCode);
        expect(Object.keys(operation.responses)).toContain(String(response.statusCode));
      }
      const stale = await post(path, payload, { ...nodeHeaders(), 'x-timestamp': new Date(Date.now() - 10 * 60 * 1000).toISOString() });
      expect(stale.statusCode).toBe(401);
      expect(Object.keys(operation.responses)).toContain('401');
    });
  }
});
