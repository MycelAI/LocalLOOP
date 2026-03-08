import Script from 'next/script';
import { StickyInterestCta } from './components/StickyInterestCta';

export const metadata = {
  title: 'localLOOP | Circular Economy Infrastructure for Cities',
  description: 'localLOOP documentation hub for LOOP.',
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
        {children}
        <StickyInterestCta />
        <Script src="/assets/js/config.js" strategy="beforeInteractive" />
        <Script src="/assets/js/main.js" strategy="afterInteractive" />
        <Script src="/assets/js/interest.js" strategy="afterInteractive" />
        <Script src="/assets/js/metrics.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
