/**
 * Single source of truth for site navigation and canonical routes.
 * Used by SiteHeader (nav) and sitemap.js (canonical URLs).
 */

const BASE = 'https://localloop.urbnia.com';
import { schemas } from './schemas.js';
import { examples } from './examples.js';

export const nonCanonicalAliases = ['/engage', '/contribute/CODE_OF_CONDUCT.md'];

const documentationRoutes = [
  '/docs/threat-model',
  '/docs/dpia-lite',
];

export const navigationSections = [
  {
    key: 'protocol',
    label: 'Protocol',
    href: '/protocol',
    matchPrefixes: ['/protocol'],
    items: [
      {
        href: '/protocol/spec',
        label: 'Specification',
        icon: 'ph-file-text',
        description: 'Core LOOP rules, entities, and interchange requirements.',
      },
      {
        href: '/protocol/changelog',
        label: 'Changelog',
        icon: 'ph-clock-countdown',
        description: 'Version history and what changed between releases.',
      },
      {
        href: '/protocol/security',
        label: 'Security',
        icon: 'ph-shield-check',
        description: 'Threat posture and security expectations for nodes.',
      },
    ],
  },
  {
    key: 'platform',
    label: 'Platform',
    href: '/platform',
    matchPrefixes: ['/platform'],
    items: [
      {
        href: '/platform/materialdna',
        label: 'MaterialDNA',
        icon: 'ph-dna',
        description: 'Draft identity model for material composition and custody.',
      },
      {
        href: '/platform/productdna',
        label: 'ProductDNA',
        icon: 'ph-package',
        description: 'Product-level identity linked to constituent materials.',
      },
      {
        href: '/platform/loopcoin',
        label: 'LoopCoin',
        icon: 'ph-coins',
        description: 'Lab settlement value model for local exchange scenarios.',
      },
      {
        href: '/platform/loopsignal',
        label: 'LoopSignal',
        icon: 'ph-broadcast',
        description: 'Preference signals used as illustrative routing inputs.',
      },
      {
        href: '/platform/loopcost',
        label: 'LoopCost',
        icon: 'ph-path',
        description: 'Routing cost function for local vs overflow decisions.',
      },
      {
        href: '/platform/city-portals',
        label: 'City Portals',
        icon: 'ph-buildings',
        description: 'Illustrative city portal patterns for material flows.',
      },
      {
        href: '/platform/demo-city',
        label: 'DEMO City',
        icon: 'ph-map-pin',
        description: 'Lab demo city surface for exploring LOOP flows.',
      },
    ],
  },
  {
    key: 'library',
    label: 'Library',
    href: '/library',
    matchPrefixes: ['/library'],
    items: [
      {
        href: '/library/schemas',
        label: 'Schemas',
        icon: 'ph-tree-structure',
        description: 'JSON Schema definitions for LOOP entities and payloads.',
      },
      {
        href: '/library/examples',
        label: 'Examples',
        icon: 'ph-code-block',
        description: 'Validated example payloads you can inspect and reuse.',
      },
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
          {
            href: '/docs/implementation',
            label: 'Implementation',
            icon: 'ph-hammer',
            description: 'How to stand up a lab node against the LOOP surface.',
          },
          {
            href: '/docs/lab-demo',
            label: 'Lab demo',
            icon: 'ph-flask',
            description: 'Walk through the MaterialDNA → Transfer demo flow.',
          },
          {
            href: '/docs/federation',
            label: 'Federation handshake',
            icon: 'ph-handshake',
            description: 'Peer discovery and handshake patterns between nodes.',
          },
          {
            href: '/docs/security',
            label: 'Security guide',
            icon: 'ph-lock-key',
            description: 'Operational guidance for securing lab deployments.',
          },
          {
            href: '/docs/secure-coding',
            label: 'Secure coding',
            icon: 'ph-code',
            description: 'Coding practices for LOOP-facing service code.',
          },
          {
            href: '/docs/incident-response',
            label: 'Incident response',
            icon: 'ph-siren',
            description: 'Response checklist for lab incidents and abuse.',
          },
          {
            href: '/docs/api',
            label: 'API docs',
            icon: 'ph-plugs-connected',
            description: 'Endpoint reference for the lab backend API.',
          },
          {
            href: '/docs/metrics',
            label: 'Metrics',
            icon: 'ph-chart-line-up',
            description: 'Observability signals exposed by the lab API.',
          },
          {
            href: '/docs/regulatory-alignment',
            label: 'Regulatory alignment',
            icon: 'ph-scales',
            description: 'How LOOP concepts map to emerging regulations.',
          },
          {
            href: '/docs/threat-model',
            label: 'Threat model',
            icon: 'ph-detective',
            description: 'Assets, actors, and risks considered for LOOP labs.',
          },
          {
            href: '/docs/dpia-lite',
            label: 'DPIA lite',
            icon: 'ph-identification-card',
            description: 'Lightweight privacy impact notes for demos.',
          },
        ],
      },
      {
        label: 'Reference',
        items: [
          {
            href: '/docs/faq',
            label: 'FAQ',
            icon: 'ph-chat-circle-dots',
            description: 'Common questions about scope, status, and usage.',
          },
          {
            href: '/docs/glossary',
            label: 'Glossary',
            icon: 'ph-book-open-text',
            description: 'Shared vocabulary for LOOP entities and flows.',
          },
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
      {
        href: '/governance/rfcs',
        label: 'RFC Guide',
        icon: 'ph-notebook',
        description: 'How proposals are written, discussed, and decided.',
      },
      {
        href: '/governance/template',
        label: 'RFC Template',
        icon: 'ph-article',
        description: 'Starter template for new LOOP change proposals.',
      },
      {
        href: '/governance/smart-contracts',
        label: 'Smart Contracts',
        icon: 'ph-file-dashed',
        description: 'Draft notes on contract-shaped settlement experiments.',
      },
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
      {
        href: '/interest',
        label: 'Express interest',
        icon: 'ph-hand-waving',
        description: 'Register interest for future lab discussions.',
      },
      {
        href: '/contribute',
        label: 'Contribute',
        icon: 'ph-git-pull-request',
        description: 'Ways to contribute specs, examples, and tooling.',
      },
      {
        href: '/projects',
        label: 'Project hub',
        icon: 'ph-squares-four',
        description: 'Overview of localLOOP projects and related work.',
      },
    ],
  },
];

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
