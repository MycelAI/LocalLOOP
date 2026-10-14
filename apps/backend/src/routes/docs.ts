// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { FastifyInstance } from 'fastify';
import { setPublicShortCache } from '../httpCache';

// Redoc is vendored (vendor/redoc/, MIT, see THIRD_PARTY_NOTICES.md) and pinned:
// the docs page used to load the unversioned CDN bundle, which broke when
// Redoc 3 shipped an ES-module standalone build. The versioned file name makes
// the bundle URL safe to cache immutably.
export const REDOC_VERSION = '3.0.1';
export const REDOC_BUNDLE = `redoc-${REDOC_VERSION}.standalone.js`;
const redocBundle = readFileSync(join(import.meta.dir, '..', '..', 'vendor', 'redoc', REDOC_BUNDLE));

// Redoc renders with inline styles (styled-components) and runs its search
// worker and lazy chunks from blob: URLs. Everything else is same-origin; the
// "API docs by Redocly" badge image on cdn.redoc.ly is blocked, and Redoc hides
// it when it fails to load.
export const DOCS_CSP = [
  "default-src 'none'",
  "script-src 'self' blob:",
  "worker-src 'self' blob:",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-ancestors 'self'",
].join('; ');

// spec-url and the bundle path are relative so the page works at both /docs and
// /api/docs (the public path, routed here by Traefik).
const docsHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>localLOOP Lab API Docs</title>
    <style>body { margin: 0; }</style>
  </head>
  <body>
    <redoc spec-url="openapi.json" disable-telemetry="true"></redoc>
    <script type="module" src="docs/assets/${REDOC_BUNDLE}"></script>
  </body>
</html>`;

export async function registerDocsRoutes(app: FastifyInstance) {
  // Publicly the API is reached under /api/, so the OpenAPI document lists the
  // /api/ paths and hides the root aliases.
  for (const url of ['/openapi.json', '/api/openapi.json']) {
    app.get(url, { schema: { hide: url === '/openapi.json' } }, async (_request, reply) => {
      setPublicShortCache(reply, 30);
      const doc = app.swagger();
      reply.send(doc);
    });
  }

  for (const url of ['/docs', '/api/docs']) {
    app.get(url, { schema: { hide: url === '/docs' } }, async (_request, reply) => {
      setPublicShortCache(reply, 30);
      reply.header('Content-Security-Policy', DOCS_CSP);
      reply.type('text/html; charset=utf-8').send(docsHtml);
    });
  }

  for (const url of [`/docs/assets/${REDOC_BUNDLE}`, `/api/docs/assets/${REDOC_BUNDLE}`]) {
    app.get(url, { schema: { hide: true } }, async (_request, reply) => {
      reply.header('Cache-Control', 'public, max-age=31536000, immutable');
      reply.type('text/javascript; charset=utf-8').send(redocBundle);
    });
  }
}
