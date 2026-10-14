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

  it('talks to SeaweedFS directly (no storage-proxy nginx)', () => {
    expect(compose).not.toContain('storage-proxy');
    expect(compose).toContain('127.0.0.1:9200:8333');
  });
});
