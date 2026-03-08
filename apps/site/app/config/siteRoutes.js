/**
 * Single source of truth for site navigation and canonical routes.
 * Used by SiteHeader (nav) and sitemap.js (canonical URLs).
 */

const BASE = 'https://local-loop-io.github.io';

export const navigationSections = [
  {
    key: 'protocol',
    label: 'Protocol',
    href: '/protocol',
    matchPrefixes: ['/protocol'],
    items: [
      { href: '/protocol/spec', label: 'Specification' },
      { href: '/protocol/changelog', label: 'Changelog' },
      { href: '/protocol/security', label: 'Security' },
    ],
  },
  {
    key: 'platform',
    label: 'Platform',
    href: '/platform',
    matchPrefixes: ['/platform'],
    items: [
      { href: '/platform/materialdna', label: 'MaterialDNA' },
      { href: '/platform/productdna', label: 'ProductDNA' },
      { href: '/platform/city-portals', label: 'City Portals' },
      { href: '/platform/demo-city', label: 'DEMO City' },
    ],
  },
  {
    key: 'library',
    label: 'Library',
    href: '/library',
    matchPrefixes: ['/library'],
    items: [
      { href: '/library/schemas', label: 'Schemas' },
      { href: '/library/examples', label: 'Examples' },
    ],
  },
  {
    key: 'docs',
    label: 'Docs',
    href: '/docs',
    matchPrefixes: ['/docs'],
    align: 'end',
    groups: [
      {
        label: 'Guides',
        items: [
          { href: '/docs/implementation', label: 'Implementation' },
          { href: '/docs/lab-demo', label: 'Lab demo' },
          { href: '/docs/federation', label: 'Federation handshake' },
          { href: '/docs/security', label: 'Security guide' },
          { href: '/docs/secure-coding', label: 'Secure coding' },
          { href: '/docs/incident-response', label: 'Incident response' },
          { href: '/docs/api', label: 'API docs' },
          { href: '/docs/metrics', label: 'Metrics' },
          { href: '/docs/regulatory-alignment', label: 'Regulatory alignment' },
        ],
      },
      {
        label: 'Reference',
        items: [
          { href: '/docs/faq', label: 'FAQ' },
          { href: '/docs/glossary', label: 'Glossary' },
        ],
      },
    ],
  },
  {
    key: 'governance',
    label: 'Governance',
    href: '/governance',
    matchPrefixes: ['/governance'],
    align: 'end',
    items: [
      { href: '/governance/rfcs', label: 'RFC Guide' },
      { href: '/governance/template', label: 'RFC Template' },
      { href: '/governance/smart-contracts', label: 'Smart Contracts' },
    ],
  },
  {
    key: 'engage',
    label: 'Engage',
    href: '/interest',
    matchPrefixes: ['/interest', '/contribute', '/projects'],
    align: 'end',
    isCta: true,
    items: [
      { href: '/interest', label: 'Express interest' },
      { href: '/contribute', label: 'Contribute' },
      { href: '/projects', label: 'Project hub' },
    ],
  },
];

/** Collect all canonical paths from navigation (section hrefs + all item hrefs). */
function getCanonicalPaths() {
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
  return [...paths].sort((a, b) => a.localeCompare(b));
}

/** Full canonical URLs with trailing slash for sitemap (matches Next.js export). */
export function getCanonicalUrls() {
  return getCanonicalPaths().map((path) => ({
    path: path === '/' ? '/' : `${path}/`,
    url: path === '/' ? `${BASE}/` : `${BASE}${path}/`,
  }));
}
