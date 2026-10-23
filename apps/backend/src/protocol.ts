// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

import type { FastifyInstance } from 'fastify';

export const loopContentType = 'application/ld+json';

export function registerLoopProtocolParsers(app: FastifyInstance) {
  // Fastify's own JSON parser, as for application/json: a malformed or empty
  // body is a 400 (FST_ERR_CTP_*), not a 500, and __proto__/constructor keys
  // are rejected instead of reaching the handlers.
  app.addContentTypeParser(
    /^application\/ld\+json(?:\s*;.*)?$/i,
    { parseAs: 'string' },
    app.getDefaultJsonParser('error', 'error'),
  );
}
