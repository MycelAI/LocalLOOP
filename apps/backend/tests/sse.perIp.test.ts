// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

import { describe, expect, it } from 'bun:test';

// One client address may hold at most SSE_MAX_CLIENTS_PER_IP streams per
// endpoint, so it cannot take every SSE_MAX_CLIENTS slot. This file runs
// isolated, so the env below is read fresh by the config module.
process.env.SSE_MAX_CLIENTS_PER_IP = '2';
process.env.SSE_KEEPALIVE_MS = '0';

async function withServer(run: (base: string) => Promise<void>) {
  const { buildServer } = await import('../src/server');
  const app = await buildServer({ logger: false });
  await app.listen({ port: 0, host: '127.0.0.1' });
  const { port } = app.server.address() as { port: number };
  try {
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await app.close();
  }
}

const open = (url: string) => {
  const controller = new AbortController();
  return fetch(url, { signal: controller.signal }).then((response) => ({ response, close: () => controller.abort() }));
};

const settle = () => new Promise((resolve) => setTimeout(resolve, 200));

describe('per-IP SSE cap', () => {
  for (const path of ['/api/v1/stream', '/api/interest/stream']) {
    it(`${path}: allows the cap, rejects the next, and frees a slot on close`, async () => {
      await withServer(async (base) => {
        const first = await open(base + path);
        const second = await open(base + path);
        expect(first.response.status).toBe(200);
        expect(second.response.status).toBe(200);

        const third = await open(base + path);
        expect(third.response.status).toBe(429);
        expect((await third.response.json()).error.message).toContain('from this address');

        second.close();
        await settle();
        const again = await open(base + path);
        expect(again.response.status).toBe(200);

        first.close();
        again.close();
        await settle();
      });
    }, 10_000);
  }

  it('counts each endpoint separately', async () => {
    await withServer(async (base) => {
      const loops = [await open(`${base}/api/v1/stream`), await open(`${base}/api/v1/stream`)];
      const interest = await open(`${base}/api/interest/stream`);
      expect(interest.response.status).toBe(200);
      for (const stream of [...loops, interest]) stream.close();
      await settle();
    });
  }, 10_000);
});
