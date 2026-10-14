// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

// This file assumes Prisma commands are run with Bun.
import { defineConfig } from 'prisma/config';

// Schema changes are applied by the hand-written SQL migrations in
// src/db/migrations (src/db/migrate.ts), not by `prisma migrate` — this config
// deliberately declares no migrations directory so Prisma cannot start a second,
// competing migration history.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL ?? 'postgresql://localloop:change-me@localhost:55432/localloop',
  },
});
