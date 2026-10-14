// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

import { describe, expect, it } from 'bun:test';
import { VERSION, PROTOCOL_VERSION } from '../src/version';

describe('docs routes Cache-Control', () => {
  it('returns public short cache on GET /openapi.json', async () => {
    const { buildServer } = await import('../src/server');
    const app = await buildServer({ logger: false });

    try {
      const response = await app.inject({ method: 'GET', url: '/openapi.json' });
      expect(response.statusCode).toBe(200);
      expect(response.headers['cache-control']).toBe('public, max-age=30');
      const doc = response.json();
      expect(doc.openapi).toBeDefined();
      // One version source: the OpenAPI document reports the package version
      // (previously a hard-coded, stale '0.2.0-lab') plus the spec baseline.
      expect(doc.info.version).toBe(VERSION);
      expect(doc.info['x-protocol-version']).toBe(PROTOCOL_VERSION);
    } finally {
      await app.close();
    }
  });

  it('returns public short cache on GET /docs', async () => {
    const { buildServer } = await import('../src/server');
    const app = await buildServer({ logger: false });

    try {
      const response = await app.inject({ method: 'GET', url: '/docs' });
      expect(response.statusCode).toBe(200);
      expect(response.headers['cache-control']).toBe('public, max-age=30');
      expect(response.body).toContain('redoc');
    } finally {
      await app.close();
    }
  });

  it('serves Redoc from a pinned, same-origin bundle under a strict CSP', async () => {
    const { buildServer } = await import('../src/server');
    const { DOCS_CSP, REDOC_BUNDLE } = await import('../src/routes/docs');
    const app = await buildServer({ logger: false });

    try {
      const page = await app.inject({ method: 'GET', url: '/api/docs' });
      expect(page.statusCode).toBe(200);
      expect(page.headers['content-security-policy']).toBe(DOCS_CSP);
      expect(DOCS_CSP).toContain("connect-src 'self'");
      expect(page.body).toContain(`<script type="module" src="docs/assets/${REDOC_BUNDLE}"></script>`);
      expect(page.body).toContain('disable-telemetry="true"');
      expect(page.body).not.toMatch(/https?:\/\//);

      // The relative bundle path resolves under both /docs and /api/docs.
      for (const url of [`/docs/assets/${REDOC_BUNDLE}`, `/api/docs/assets/${REDOC_BUNDLE}`]) {
        const bundle = await app.inject({ method: 'GET', url });
        expect(bundle.statusCode).toBe(200);
        expect(bundle.headers['content-type']).toContain('text/javascript');
        expect(bundle.headers['cache-control']).toBe('public, max-age=31536000, immutable');
        expect(bundle.body.length).toBeGreaterThan(1_000_000);
      }
    } finally {
      await app.close();
    }
  });

  it('documents the public /api/ aliases, not the root routes', async () => {
    const { buildServer } = await import('../src/server');
    const app = await buildServer({ logger: false });

    try {
      const doc = (await app.inject({ method: 'GET', url: '/api/openapi.json' })).json();
      expect(Object.keys(doc.paths)).toEqual(expect.arrayContaining(['/api/health', '/api/docs', '/api/openapi.json']));
      expect(doc.paths['/health']).toBeUndefined();
      expect(doc.paths['/docs']).toBeUndefined();
    } finally {
      await app.close();
    }
  });
});
