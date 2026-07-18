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
        <link rel="stylesheet" href="/assets/css/site.css" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/thin/style.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/bold/style.css"
        />
      </head>
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        {children}
        <JsonLd data={websiteJsonLd()} />
        <Script src="/assets/js/config.js" strategy="beforeInteractive" />
        <Script src="/assets/js/main.js" strategy="afterInteractive" />
        <RouteScripts />
      </body>
    </html>
  );
}
