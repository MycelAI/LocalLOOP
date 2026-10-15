// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

export const SITE_URL = 'https://loop.urbnia.com';

// 1200x630 social card (brand asset, LicenseRef-Mycel-Brand).
const OG_IMAGE = {
  url: '/assets/og-image.png',
  width: 1200,
  height: 630,
  alt: 'localLOOP: Local Optimization with Overflow Protocol. Lab demo only.',
};

const defaultDescription =
  'localLOOP is an early-stage, lab-only documentation hub for exploratory circular-economy interoperability work.';

export function createMetadata({ title, description = defaultDescription, path = '/', brandFirst = false } = {}) {
  const canonicalPath = path === '/' ? '/' : path.replace(/\/$/, '');
  const fullTitle = !title
    ? 'localLOOP | Lab-only interoperability research'
    : brandFirst
      ? `localLOOP | ${title}`
      : `${title} | localLOOP`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: 'website',
      url: canonicalPath,
      title: fullTitle,
      description,
      siteName: 'localLOOP',
      locale: 'en',
      images: [OG_IMAGE],
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images: [OG_IMAGE.url] },
  };
}

export function createAliasMetadata({ title, description, canonical }) {
  return {
    ...createMetadata({ title, description, path: canonical }),
    robots: { index: false, follow: true },
  };
}

const ORGANIZATION = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Mycel UG (haftungsbeschränkt)',
  url: 'https://mycel-ai.de',
  email: 'dev@mycel-ai.de',
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/assets/local-loop-logo-512.png`,
    width: 512,
    height: 512,
  },
  sameAs: ['https://github.com/MycelAI'],
};

export const REPOSITORY_URL = 'https://github.com/MycelAI/LocalLOOP';

// Site-wide structured data: the publisher and the site itself, linked by @id
// so search engines and AI answer engines attribute every page consistently.
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      ORGANIZATION,
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: 'localLOOP',
        alternateName: 'LOOP — Local Optimization with Overflow Protocol',
        url: `${SITE_URL}/`,
        description: defaultDescription,
        inLanguage: 'en',
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'SoftwareSourceCode',
        '@id': `${SITE_URL}/#source`,
        name: 'localLOOP',
        description:
          'Monorepo with the LOOP protocol (specification, JSON Schemas, JSON-LD contexts), this documentation site and the lab API. Lab demo only.',
        codeRepository: REPOSITORY_URL,
        license: 'https://spdx.org/licenses/MIT.html',
        programmingLanguage: ['JavaScript', 'TypeScript'],
        author: { '@id': `${SITE_URL}/#organization` },
        isPartOf: { '@id': `${SITE_URL}/#website` },
      },
    ],
  };
}

// The draft specification as a TechArticle (licence, version, publisher).
export function specificationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    '@id': `${SITE_URL}/protocol/spec#article`,
    headline: 'LOOP Specification v0.2.0 (draft)',
    alternativeHeadline: 'Local Optimization with Overflow Protocol',
    description:
      'Draft specification of the LOOP protocol: JSON-LD payloads and JSON Schemas for MaterialDNA, ProductDNA, offers, matches and transfers between federated city nodes. Lab demo only; no public pilots or deployments.',
    url: `${SITE_URL}/protocol/spec`,
    version: '0.2.0',
    inLanguage: 'en',
    license: 'https://creativecommons.org/licenses/by-sa/4.0/',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    author: { '@id': `${SITE_URL}/#organization` },
    image: `${SITE_URL}/assets/og-image.png`,
  };
}
