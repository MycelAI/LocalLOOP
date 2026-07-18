export const SITE_URL = 'https://localloop.urbnia.com';

const defaultDescription =
  'localLOOP is an early-stage, lab-only documentation hub for exploratory circular-economy interoperability work.';

export function createMetadata({ title, description = defaultDescription, path = '/' } = {}) {
  const canonicalPath = path === '/' ? '/' : path.replace(/\/$/, '');
  const fullTitle = title ? `${title} | localLOOP` : 'localLOOP | Lab-only interoperability research';

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
    },
    twitter: { card: 'summary', title: fullTitle, description },
  };
}

export function createAliasMetadata({ title, description, canonical }) {
  return {
    ...createMetadata({ title, description, path: canonical }),
    robots: { index: false, follow: true },
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'localLOOP',
    url: SITE_URL,
    description: defaultDescription,
  };
}
