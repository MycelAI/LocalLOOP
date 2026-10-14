// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

import { startServer } from './server';

startServer().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
