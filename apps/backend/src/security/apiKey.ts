// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

import { timingSafeEqual } from 'node:crypto';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { config } from '../config';
import { sendSpecError, sendSpecErrorForStatus } from '../specErrors';

const extractApiKey = (request: FastifyRequest) => {
  const direct = request.headers['x-api-key'];
  if (typeof direct === 'string' && direct.trim()) {
    return direct.trim();
  }

  const authHeader = request.headers.authorization;
  if (typeof authHeader === 'string' && authHeader.toLowerCase().startsWith('bearer ')) {
    return authHeader.slice(7).trim();
  }

  return null;
};

const safeCompare = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }
  return timingSafeEqual(leftBuffer, rightBuffer);
};

/**
 * Gate a route on X-API-Key / Bearer. By default only when API_KEY_ENABLED is
 * on; `always: true` enforces it regardless, for routes that must never be
 * anonymous (lab relay, federation ingest) — those answer 503 when no API_KEY
 * is configured rather than falling open.
 */
export function requireApiKey(
  request: FastifyRequest,
  reply: FastifyReply,
  options: { always?: boolean } = {},
) {
  if (!config.auth.apiKeyEnabled && !options.always) return true;

  if (!config.auth.apiKey) {
    sendSpecErrorForStatus(
      reply,
      503,
      options.always
        ? 'This route requires an API key and no API_KEY is configured'
        : 'API key protection is enabled but no API_KEY is configured',
    );
    return false;
  }

  const provided = extractApiKey(request);
  if (!provided || !safeCompare(provided, config.auth.apiKey)) {
    sendSpecError(reply, 'UNAUTHORIZED', 'Unauthorized');
    return false;
  }

  return true;
}
