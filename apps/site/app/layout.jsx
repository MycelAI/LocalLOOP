import Script from 'next/script';
import { JsonLd } from './components/JsonLd';
import { RouteScripts } from './components/RouteScripts';
import { SITE_URL, websiteJsonLd } from './config/metadata';

export const metadata = {
  metadataBase: new URL(SITE_URL),
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Fonts and icon fonts are self-hosted (no third-party requests). */}
        <link rel="preload" href="/assets/fonts/fraunces-700-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/assets/fonts/space-grotesk-400-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="stylesheet" href="/assets/css/fonts.css" />
        <link rel="stylesheet" href="/assets/icons/phosphor/bold/style.css" />
        <link rel="stylesheet" href="/assets/icons/phosphor/fill/style.css" />
        <link rel="stylesheet" href="/assets/css/site.css" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        {children}
        <JsonLd data={websiteJsonLd()} />
        <Script src="/assets/js/config.js" strategy="beforeInteractive" />
        <RouteScripts />
      </body>
    </html>
  );
}
