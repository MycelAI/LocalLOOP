// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

import { getCanonicalUrls } from './config/siteRoutes.js';

export const dynamic = 'force-static';

// Hand-written static pages served from public/ (outside the App Router).
const STATIC_PAGES = ['https://loop.urbnia.com/projects/loop-protocol/'];

export default function sitemap() {
  const now = new Date();
  const urls = [...getCanonicalUrls().map(({ url }) => url), ...STATIC_PAGES];
  return urls.map((url) => ({
    url,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: url === 'https://loop.urbnia.com/' ? 1 : 0.8,
  }));
}
