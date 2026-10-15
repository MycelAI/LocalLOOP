// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

import { describe, expect, it } from 'bun:test';

// X-Forwarded-For is trusted only from Traefik's dedicated edge network
// (TRUSTED_PROXY_CIDRS, default 10.250.250.0/29). Any other peer -- e.g. another
// container on the shared `proxy` network -- must not be able to choose its
// own request.ip and so sidestep the per-IP rate limits.
async function ipFor(remoteAddress: string, forwardedFor?: string) {
  const { buildServer } = await import('../src/server');
  const app = await buildServer({ logger: false });
  app.get('/__ip', async (request) => ({ ip: request.ip }));
  try {
    const response = await app.inject({
      method: 'GET',
      url: '/__ip',
      remoteAddress,
      headers: forwardedFor ? { 'x-forwarded-for': forwardedFor } : {},
    });
    expect(response.statusCode).toBe(200);
    return response.json().ip as string;
  } finally {
    await app.close();
  }
}

describe('reverse-proxy trust', () => {
  it('uses the client address Traefik forwards from the edge network', async () => {
    expect(await ipFor('10.250.250.2', '198.51.100.7')).toBe('198.51.100.7');
  });

  it('ignores X-Forwarded-For from peers outside the edge network', async () => {
    // A container on the shared proxy network spoofing a fresh address.
    expect(await ipFor('172.18.0.42', '198.51.100.7')).toBe('172.18.0.42');
    expect(await ipFor('127.0.0.1', '203.0.113.9')).toBe('127.0.0.1');
  });

  it('stops at the first untrusted hop of a forged chain', async () => {
    // Client-injected entries left of Traefik's own entry are never used.
    expect(await ipFor('10.250.250.2', '203.0.113.9, 198.51.100.7')).toBe('198.51.100.7');
  });
});
