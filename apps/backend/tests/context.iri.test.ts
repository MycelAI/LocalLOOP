// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

import { describe, expect, it } from 'bun:test';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// loop-protocol 0.6.0 moved every identifier to loop.urbnia.com. Request
// validation runs before any handler, so no database is needed here.
const NEW_CONTEXT = 'https://loop.urbnia.com/projects/loop-protocol/contexts/loop-v0.2.0.jsonld';
// The former site host, built here so the domain checks never see it literally.
const OLD_CONTEXT = NEW_CONTEXT.replace('https://loop.', 'https://localloop.');

// A complete, schema-valid MaterialDNA from the protocol examples, so the only
// thing that can fail validation is the @context under test.
const example = JSON.parse(
  readFileSync(join(import.meta.dir, '..', '..', '..', 'protocol', 'examples', '01-material-registration.json'), 'utf8'),
);
const material = (context: string) => ({ ...example, '@context': context });

describe('protocol identifiers live on loop.urbnia.com', () => {
  it('rejects a payload that still names a former-host context', async () => {
    const { buildServer } = await import('../src/server');
    const app = await buildServer({ logger: false });
    try {
      const response = await app.inject({ method: 'POST', url: '/api/v1/material', payload: material(OLD_CONTEXT) });
      expect(response.statusCode).toBe(400);
      expect(response.body).toContain('@context');
    } finally {
      await app.close();
    }
  });

  it('allows only loop.urbnia.com contexts in the material schema', async () => {
    const schema = (await import('../src/schemas/material-dna.schema.json')).default;
    const allowed: string[] = schema.properties['@context'].enum;
    expect(allowed).toContain(NEW_CONTEXT);
    expect(allowed.every((iri) => iri.startsWith('https://loop.urbnia.com/projects/loop-protocol/contexts/'))).toBe(true);
  });

  it('ships no schema that names a former hostname', () => {
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/(localloop|loop-api)\.urbnia\.com/.test(readFileSync(full, 'utf8'))) offenders.push(full);
      }
    };
    walk(join(import.meta.dir, '..', 'src', 'schemas'));
    expect(offenders).toEqual([]);
  });
});
