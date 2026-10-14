// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

import { describe, expect, it } from 'bun:test';

// Under Bun the server's connectionTimeout is an absolute deadline, so SSE
// streams used to be cut at REQUEST_TIMEOUT_MS (30 s in production) even while
// keep-alives were flowing. Use a short timeout here (this file runs isolated,
// so the env is read fresh) and check a real socket outlives it.
process.env.REQUEST_TIMEOUT_MS = '1500';
process.env.SSE_KEEPALIVE_MS = '400';

async function streamOutlivesTimeout(path: string) {
  const { buildServer } = await import('../src/server');
  const app = await buildServer({ logger: false });
  await app.listen({ port: 0, host: '127.0.0.1' });
  const { port } = app.server.address() as { port: number };
  const controller = new AbortController();
  try {
    const response = await fetch(`http://127.0.0.1:${port}${path}`, { signal: controller.signal });
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/event-stream');
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let received = '';
    const deadline = Date.now() + 3000; // twice the connection timeout
    while (Date.now() < deadline) {
      const { done, value } = await reader.read();
      if (done) throw new Error(`stream closed after ${3000 - (deadline - Date.now())} ms`);
      received += decoder.decode(value);
    }
    expect(received).toContain(': keep-alive');
  } finally {
    controller.abort();
    await app.close();
  }
}

describe('SSE streams are not cut by the connection timeout', () => {
  it('GET /api/v1/stream stays open past REQUEST_TIMEOUT_MS', async () => {
    await streamOutlivesTimeout('/api/v1/stream');
  }, 10_000);

  it('GET /api/interest/stream stays open past REQUEST_TIMEOUT_MS', async () => {
    await streamOutlivesTimeout('/api/interest/stream');
  }, 10_000);
});
