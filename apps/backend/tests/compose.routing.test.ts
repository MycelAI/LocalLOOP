// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

import { describe, expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const compose = readFileSync(join(import.meta.dir, '..', 'docker-compose.yml'), 'utf8');

describe('docker-compose routing', () => {
  it('routes https://loop.urbnia.com/api/* to the api service through Traefik', () => {
    expect(compose).toContain('traefik.http.routers.localloop-api.rule=Host(`loop.urbnia.com`) && PathPrefix(`/api/`)');
    expect(compose).toContain('traefik.http.routers.localloop-api.tls.certresolver=letsencrypt');
    expect(compose).toContain('traefik.http.services.localloop-api.loadbalancer.server.port=8088');
    expect(compose).not.toContain('traefik.enable=false');
  });

  it('joins only the dedicated edge network for Traefik, not the shared proxy network', () => {
    expect(compose).toContain('traefik.docker.network=localloop-edge');
    expect(compose).toMatch(/networks:\n {6}- default\n {6}- localloop-edge\n/);
    expect(compose).not.toMatch(/^\s+- proxy$/m);
    expect(compose).toMatch(/localloop-edge:\n {4}external: true/);
  });

  it('applies the edge rate limit and SSE-safe compression to the API router', () => {
    expect(compose).toContain('traefik.http.routers.localloop-api.middlewares=localloop-api-ratelimit,localloop-api-compress');
    expect(compose).toContain('traefik.http.middlewares.localloop-api-ratelimit.ratelimit.average=20');
    expect(compose).toContain('traefik.http.middlewares.localloop-api-compress.compress.excludedcontenttypes=text/event-stream');
  });

  it('hardens the api container and caps processes everywhere', () => {
    const api = compose.slice(compose.indexOf('  api:'), compose.indexOf('  postgres:'));
    expect(api).toContain('read_only: true');
    expect(api).toContain('cap_drop:\n      - ALL');
    expect(api).toContain('no-new-privileges:true');
    expect(api).toContain("BUN_RUNTIME_TRANSPILER_CACHE_PATH: \"0\"");
    expect(compose.match(/^ {10}pids: \d+$/gm)?.length).toBe(4);
  });

  it('pins every image by digest and keeps the Valkey password out of argv', () => {
    for (const line of compose.match(/^\s+image: .+$/gm) ?? []) {
      expect(line).toMatch(/@sha256:[0-9a-f]{64}$/);
    }
    expect(compose).not.toContain('--requirepass');
    expect(compose).toContain('/tmp/valkey-auth.conf');
  });

  it('talks to SeaweedFS directly (no storage-proxy nginx)', () => {
    expect(compose).not.toContain('storage-proxy');
    expect(compose).toContain('127.0.0.1:9200:8333');
  });
});
