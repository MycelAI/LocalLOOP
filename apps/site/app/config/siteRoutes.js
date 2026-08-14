/**
 * Single source of truth for site navigation and canonical routes.
 *
 * The nav data itself (sections/items/descriptions) lives in
 * public/assets/navigation.json rather than inline here, because it has two
 * independent consumers that can't share a JS import: this file (bundled at
 * build time for SiteHeader.jsx / sitemap generation) and
 * public/assets/js/site-header.js (a vanilla script with no bundler, used by
 * the static protocol-mirror page, which fetches it at runtime). Keeping one
 * JSON file as the source for both avoids hand-syncing two copies of the nav
 * — which had already silently drifted (stale hrefs, missing items) before
 * this was unified.
 */

const BASE = 'https://localloop.urbnia.com';
import { schemas } from './schemas.js';
import { examples } from './examples.js';
import navigationSectionsData from '../../public/assets/navigation.json' with { type: 'json' };

export const nonCanonicalAliases = ['/engage', '/contribute/CODE_OF_CONDUCT.md'];

const documentationRoutes = [
  '/docs/threat-model',
  '/docs/dpia-lite',
];

export const navigationSections = navigationSectionsData;

/** Collect all canonical paths from navigation (section hrefs + all item hrefs). */
export function getCanonicalPaths() {
  const paths = new Set(['/']);
  for (const section of navigationSections) {
    if (section.href) paths.add(section.href);
    if (section.items) {
      for (const item of section.items) paths.add(item.href);
    }
    if (section.groups) {
      for (const group of section.groups) {
        for (const item of group.items) paths.add(item.href);
      }
    }
  }
  documentationRoutes.forEach((path) => paths.add(path));
  schemas.forEach(({ slug }) => paths.add(`/library/schemas/${slug}`));
  examples.forEach(({ slug }) => paths.add(`/library/examples/${slug}`));
  nonCanonicalAliases.forEach((path) => paths.delete(path));
  return [...paths].sort((a, b) => a.localeCompare(b));
}

/** Full canonical URLs with trailing slash for sitemap (matches Next.js export). */
export function getCanonicalUrls() {
  return getCanonicalPaths().map((path) => ({
    path: path === '/' ? '/' : `${path}/`,
    url: path === '/' ? `${BASE}/` : `${BASE}${path}/`,
  }));
}
