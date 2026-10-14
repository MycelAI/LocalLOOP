// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

import { getCanonicalUrls } from './config/siteRoutes.js';

export const dynamic = 'force-static';

export default function sitemap() {
  const now = new Date();
  return getCanonicalUrls().map(({ url }) => ({
    url,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: url === 'https://loop.urbnia.com/' ? 1 : 0.8,
  }));
}
