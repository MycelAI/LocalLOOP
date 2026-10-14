// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

import { pool } from './pool';

export type CityRecord = {
  slug: string;
  name: string;
  country: string | null;
  center: { type: string; coordinates: [number, number] } | null;
  created_at: string;
};

export type CityGeoFeature = {
  type: 'Feature';
  geometry: { type: string; coordinates: [number, number] } | null;
  properties: {
    slug: string;
    name: string;
    country: string | null;
    created_at: string;
    distance_m: number | null;
  };
};

export type CityFilters = {
  limit?: number;
  bbox?: {
    minLon: number;
    minLat: number;
    maxLon: number;
    maxLat: number;
  };
  near?: {
    lon: number;
    lat: number;
    radiusKm: number;
  };
};

type CityRow = {
  slug: string;
  name: string;
  country: string | null;
  center: string | null;
  created_at: string | Date;
};

type QueryParts = {
  where: string;
  orderBy: string;
  distanceExpr: string;
  params: unknown[];
};

/**
 * Builds the filter/order fragments with positional parameters. Every value is
 * bound ($n) with an explicit float8 cast; the point expression reuses the same
 * placeholders in the WHERE, distance and ORDER BY parts.
 */
const buildQueryParts = (filters: CityFilters = {}): QueryParts => {
  const params: unknown[] = [];
  const bind = (value: number) => {
    params.push(value);
    return `$${params.length}::float8`;
  };
  const clauses: string[] = [];
  let orderBy = 'ORDER BY created_at DESC';
  let distanceExpr = 'NULL';

  if (filters.bbox) {
    const { minLon, minLat, maxLon, maxLat } = filters.bbox;
    clauses.push(
      `ST_Within(center, ST_MakeEnvelope(${bind(minLon)}, ${bind(minLat)}, ${bind(maxLon)}, ${bind(maxLat)}, 4326))`,
    );
  }

  if (filters.near) {
    const { lon, lat, radiusKm } = filters.near;
    const pointExpr = `ST_SetSRID(ST_MakePoint(${bind(lon)}, ${bind(lat)}), 4326)`;
    clauses.push(`ST_DWithin(center::geography, ${pointExpr}::geography, ${bind(radiusKm * 1000)})`);
    distanceExpr = `ST_Distance(center::geography, ${pointExpr}::geography)`;
    orderBy = `ORDER BY ${distanceExpr} ASC`;
  }

  return {
    where: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '',
    orderBy,
    distanceExpr,
    params,
  };
};

const mapCityRow = (row: CityRow): CityRecord => ({
  slug: row.slug,
  name: row.name,
  country: row.country,
  center: row.center ? JSON.parse(row.center) : null,
  created_at: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
});

export async function listCities(filters: CityFilters = {}) {
  const limit = filters.limit ?? 100;
  const { where, orderBy, params } = buildQueryParts(filters);

  const { rows } = await pool.query(
    `SELECT slug, name, country, ST_AsGeoJSON(center) AS center, created_at
     FROM cities
     ${where}
     ${orderBy}
     LIMIT $${params.length + 1}`,
    [...params, limit],
  );

  return (rows as CityRow[]).map(mapCityRow);
}

export async function listCitiesGeoJson(filters: CityFilters = {}) {
  const limit = filters.limit ?? 100;
  const { where, orderBy, distanceExpr, params } = buildQueryParts(filters);

  const { rows } = await pool.query(
    `SELECT json_build_object(
       'type', 'Feature',
       'geometry', ST_AsGeoJSON(center)::json,
       'properties', json_build_object(
         'slug', slug,
         'name', name,
         'country', country,
         'created_at', created_at,
         'distance_m', ${distanceExpr}
       )
     ) AS feature
     FROM cities
     ${where}
     ${orderBy}
     LIMIT $${params.length + 1}`,
    [...params, limit],
  );

  return {
    type: 'FeatureCollection' as const,
    features: (rows as { feature: CityGeoFeature }[]).map((row) => row.feature),
  };
}

export async function getCity(slug: string) {
  const { rows } = await pool.query(
    `SELECT slug, name, country, ST_AsGeoJSON(center) AS center, created_at
     FROM cities
     WHERE slug = $1`,
    [slug],
  );
  const row = rows[0] as CityRow | undefined;
  return row ? mapCityRow(row) : null;
}
