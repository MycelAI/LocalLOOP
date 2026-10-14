-- SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
-- SPDX-License-Identifier: MIT

CREATE TABLE IF NOT EXISTS cities (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  country TEXT,
  center GEOMETRY(Point, 4326),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO cities (slug, name, country, center)
VALUES (
  'demo-city',
  'DEMO City',
  'N/A',
  ST_SetSRID(ST_MakePoint(0, 0), 4326)
)
ON CONFLICT (slug) DO NOTHING;
