// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

import { config } from '../config';
import type { InterestInput } from '../validation';
import { pool } from './pool';

export type InterestRecord = {
  id: number;
  name: string;
  organization: string | null;
  role: string | null;
  country: string | null;
  city: string | null;
  website: string | null;
  email: string | null;
  message: string | null;
  is_demo: boolean;
  created_at: string;
};

type InterestRow = {
  // pg returns BIGINT/BIGSERIAL as a string to avoid precision loss.
  id: number | string;
  name: string;
  organization: string | null;
  role: string | null;
  country: string | null;
  city: string | null;
  website: string | null;
  email: string | null;
  message: string | null;
  is_demo: boolean;
  created_at: string | Date;
};

const mapInterestRow = (row: InterestRow): InterestRecord => ({
  id: Number(row.id),
  name: row.name,
  organization: row.organization,
  role: row.role,
  country: row.country,
  city: row.city,
  website: row.website,
  email: row.email,
  message: row.message,
  is_demo: Boolean(row.is_demo),
  created_at: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
});

export async function refreshInterestSearch() {
  // CONCURRENTLY keeps readers of GET /api/interest?search= unblocked while the
  // view rebuilds (a plain REFRESH takes an ACCESS EXCLUSIVE lock for the whole
  // rebuild). Requires the unique index created in 003_search.sql, and must run
  // outside a transaction block — pool.query is autocommit, do not wrap it.
  await pool.query('REFRESH MATERIALIZED VIEW CONCURRENTLY interests_search');
}

export async function insertInterest(input: InterestInput, refreshSearch: () => Promise<void> = refreshInterestSearch) {
  const { rows } = await pool.query(
    `INSERT INTO interests
       (name, organization, role, country, city, website, email, message,
        share_email, public_listing, consent_public)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE, TRUE)
     RETURNING id, created_at`,
    [
      input.name,
      input.organization ?? null,
      input.role ?? null,
      input.country ?? null,
      input.city ?? null,
      input.website ?? null,
      input.email ?? null,
      input.message ?? null,
      Boolean(input.shareEmail),
    ],
  );
  const created = rows[0] as { id: string; created_at: Date };

  // The row is already committed: a failed refresh (lock or statement timeout,
  // a connection blip) only delays search visibility until the next refresh,
  // so it must not turn the submission into a 500 that invites a duplicate.
  if (config.refreshSearchOnWrite) {
    try {
      await refreshSearch();
    } catch (error) {
      console.error('Interest search refresh failed after insert', error);
    }
  }

  return { id: Number(created.id), created_at: created.created_at.toISOString() };
}

export async function listInterests(limit: number, search?: string) {
  // CASE … share_email: public listings never leak an unshared address.
  if (search) {
    const { rows } = await pool.query(
      `SELECT i.id, i.name, i.organization, i.role, i.country, i.city, i.website,
              CASE WHEN i.share_email THEN i.email ELSE NULL END AS email,
              i.message, i.is_demo, i.created_at
       FROM interests_search s
       JOIN interests i ON i.id = s.id
       WHERE s.document @@ plainto_tsquery('simple', $1)
       ORDER BY ts_rank(s.document, plainto_tsquery('simple', $1)) DESC, i.created_at DESC
       LIMIT $2`,
      [search, limit],
    );
    return (rows as InterestRow[]).map(mapInterestRow);
  }

  const { rows } = await pool.query(
    `SELECT id, name, organization, role, country, city, website,
            CASE WHEN share_email THEN email ELSE NULL END AS email,
            message, is_demo, created_at
     FROM interests
     WHERE public_listing
     ORDER BY created_at DESC
     LIMIT $1`,
    [limit],
  );
  return (rows as InterestRow[]).map(mapInterestRow);
}

export async function countInterests(search?: string) {
  const { rows } = search
    ? await pool.query(
        `SELECT COUNT(*)::int AS total
         FROM interests_search
         WHERE document @@ plainto_tsquery('simple', $1)`,
        [search],
      )
    : await pool.query('SELECT COUNT(*)::int AS total FROM interests WHERE public_listing');
  return Number(rows[0]?.total ?? 0);
}
