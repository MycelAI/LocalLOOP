import type { FastifyInstance } from 'fastify';
import { setPublicShortCache } from '../httpCache';

export async function registerDocsRoutes(app: FastifyInstance) {
  // The /api/ aliases serve the same-origin deployment, where the site proxies
  // https://loop.urbnia.com/api/* to this service.
  for (const url of ['/openapi.json', '/api/openapi.json']) {
    app.get(url, { schema: { hide: url !== '/openapi.json' } }, async (_request, reply) => {
      setPublicShortCache(reply, 30);
      const doc = app.swagger();
      reply.send(doc);
    });
  }

  // spec-url is relative so the page works at both /docs and /api/docs.
  for (const url of ['/docs', '/api/docs']) {
    app.get(url, { schema: { hide: url !== '/docs' } }, async (_request, reply) => {
      setPublicShortCache(reply, 30);
      reply.type('text/html').send(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>localLOOP Lab API Docs</title>
    <style>body { margin: 0; }</style>
  </head>
  <body>
    <redoc spec-url="openapi.json"></redoc>
    <script src="https://cdn.jsdelivr.net/npm/redoc/bundles/redoc.standalone.js"></script>
  </body>
</html>`);
    });
  }
}
