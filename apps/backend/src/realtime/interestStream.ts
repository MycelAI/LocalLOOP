// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

import type { FastifyReply, FastifyRequest } from 'fastify';
import { config } from '../config';
import { sendSpecErrorForStatus } from '../specErrors';

const clients = new Set<FastifyReply>();
const heartbeatTimers = new Map<FastifyReply, ReturnType<typeof setInterval>>();

/** Forget a subscriber and stop its keep-alive timer. Safe to call more than once. */
function dropClient(reply: FastifyReply) {
  clients.delete(reply);
  const timer = heartbeatTimers.get(reply);
  if (timer) {
    clearInterval(timer);
    heartbeatTimers.delete(reply);
  }
}

/**
 * Write to one subscriber. A socket that has already gone away (client closed
 * the tab, proxy dropped the connection) throws or is no longer writable; that
 * must never propagate into the HTTP handler that triggered the broadcast —
 * the entity was already committed — so the dead subscriber is dropped instead.
 */
function safeWrite(reply: FastifyReply, message: string) {
  const raw = reply.raw as { destroyed?: boolean; writable?: boolean; write: (chunk: string) => unknown };
  if (raw.destroyed || raw.writable === false) {
    dropClient(reply);
    return;
  }
  try {
    raw.write(message);
  } catch {
    dropClient(reply);
  }
}

export function registerInterestStream(request: FastifyRequest, reply: FastifyReply) {
  if (clients.size >= config.sseMaxClients) {
    sendSpecErrorForStatus(reply, 429, 'Too many active stream connections');
    return;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  };

  const origin = request.headers.origin;
  if (origin && config.allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Credentials'] = 'true';
    headers.Vary = 'Origin';
  }

  // Take the response away from Fastify: the socket is written to directly for
  // the lifetime of the subscription, so Fastify must neither try to serialize
  // the handler's (undefined) return value nor log a "promise not fulfilled"
  // error for it.
  reply.hijack();
  // The server's connectionTimeout (REQUEST_TIMEOUT_MS) is an absolute deadline
  // under Bun, not an idle timer, so it cut every stream after 30 s even with
  // keep-alives flowing. Streams are long-lived by design; dead peers are still
  // dropped through the close/error handlers and failed keep-alive writes.
  request.raw.socket?.setTimeout(0);
  reply.raw.writeHead(200, headers);
  reply.raw.write('\n');

  clients.add(reply);

  if (config.sseKeepAliveMs > 0) {
    const timer = setInterval(() => safeWrite(reply, ': keep-alive\n\n'), config.sseKeepAliveMs);
    heartbeatTimers.set(reply, timer);
  }

  const cleanup = () => dropClient(reply);
  request.raw.on('close', cleanup);
  // An abruptly reset socket surfaces on the response side; listening there
  // too both releases the subscriber and keeps the 'error' event handled.
  reply.raw.on('close', cleanup);
  reply.raw.on('error', cleanup);
}

export function broadcastInterest(payload: unknown) {
  const message = `data: ${JSON.stringify(payload)}\n\n`;
  for (const reply of Array.from(clients)) {
    safeWrite(reply, message);
  }
}

/** Number of live subscribers (exposed for tests and metrics). */
export function countInterestStreams() {
  return clients.size;
}
