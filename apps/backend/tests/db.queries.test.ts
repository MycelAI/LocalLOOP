// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

import { afterAll, describe, expect, it } from 'bun:test';
import { probeDatabase } from './dbReady';
import { getCity, listCities, listCitiesGeoJson } from '../src/db/cities';
import { countInterests, insertInterest, listInterests } from '../src/db/interest';
import { pool } from '../src/db/pool';

// Real-database coverage for the query modules (the route tests mock them).
// Uses the DEMO City seeded by migration 004 at (0, 0).
const dbReady = await probeDatabase('db.queries');
const createdIds: number[] = [];

afterAll(async () => {
  if (!dbReady) return;
  for (const id of createdIds) {
    await pool.query('DELETE FROM interests WHERE id = $1', [id]).catch(() => undefined);
  }
});

describe('cities queries', () => {
  it.skipIf(!dbReady)('lists cities with GeoJSON centers and ISO timestamps', async () => {
    const cities = await listCities({ limit: 50 });
    const demo = cities.find((city) => city.slug === 'demo-city');
    expect(demo).toBeDefined();
    expect(demo?.center).toEqual({ type: 'Point', coordinates: [0, 0] });
    expect(Number.isNaN(Date.parse(demo!.created_at))).toBe(false);
  });

  it.skipIf(!dbReady)('filters by bbox', async () => {
    const inside = await listCities({ bbox: { minLon: -1, minLat: -1, maxLon: 1, maxLat: 1 } });
    expect(inside.some((city) => city.slug === 'demo-city')).toBe(true);
    const outside = await listCities({ bbox: { minLon: 10, minLat: 10, maxLon: 11, maxLat: 11 } });
    expect(outside.some((city) => city.slug === 'demo-city')).toBe(false);
  });

  it.skipIf(!dbReady)('filters by radius and reports distance in GeoJSON', async () => {
    const near = await listCitiesGeoJson({ near: { lon: 0.01, lat: 0, radiusKm: 5 } });
    const demo = near.features.find((feature) => feature.properties.slug === 'demo-city');
    expect(demo).toBeDefined();
    expect(demo?.properties.distance_m).toBeGreaterThan(1000);
    expect(demo?.properties.distance_m).toBeLessThan(1200);
    const far = await listCities({ near: { lon: 50, lat: 50, radiusKm: 1 } });
    expect(far.some((city) => city.slug === 'demo-city')).toBe(false);
  });

  it.skipIf(!dbReady)('combines bbox and radius filters with a limit', async () => {
    const result = await listCities({
      bbox: { minLon: -1, minLat: -1, maxLon: 1, maxLat: 1 },
      near: { lon: 0, lat: 0, radiusKm: 10 },
      limit: 1,
    });
    expect(result.length).toBeLessThanOrEqual(1);
  });

  it.skipIf(!dbReady)('gets one city by slug, or null', async () => {
    expect((await getCity('demo-city'))?.name).toBe('DEMO City');
    expect(await getCity('no-such-city')).toBeNull();
  });
});

describe('interest queries', () => {
  it.skipIf(!dbReady)('inserts, lists newest first with numeric ids, and counts', async () => {
    const before = await countInterests();
    const marker = `dbq-${Date.now()}`;
    const created = await insertInterest({
      name: marker,
      organization: undefined,
      role: undefined,
      country: 'DE',
      city: undefined,
      website: undefined,
      email: `${marker}@example.com`,
      message: undefined,
      shareEmail: false,
      consentPublic: true,
    });
    createdIds.push(created.id);
    expect(typeof created.id).toBe('number');
    expect(Number.isNaN(Date.parse(created.created_at))).toBe(false);

    expect(await countInterests()).toBe(before + 1);
    const listed = await listInterests(5);
    const hit = listed.find((row) => row.id === created.id);
    expect(hit).toBeDefined();
    expect(hit?.email).toBeNull(); // shareEmail false: never listed
    expect(hit?.is_demo).toBe(false);
  });

  it.skipIf(!dbReady)('returns the committed row when the search refresh after it fails', async () => {
    const marker = `dbq-refresh-${Date.now()}`;
    const created = await insertInterest(
      { name: marker, country: 'DE', shareEmail: false, consentPublic: true },
      async () => { throw new Error('canceling statement due to lock timeout'); },
    );
    createdIds.push(created.id);
    expect(typeof created.id).toBe('number');
    expect((await listInterests(5)).some((row) => row.id === created.id)).toBe(true);
  });
});
