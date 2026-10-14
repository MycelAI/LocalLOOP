import { getCanonicalUrls } from './config/siteRoutes.js';

export const dynamic = 'force-static';

export default function sitemap() {
  const now = new Date();
  return getCanonicalUrls().map(({ url }) => ({
    url,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: url === 'https://localloop.urbnia.com/' ? 1 : 0.8,
  }));
}
