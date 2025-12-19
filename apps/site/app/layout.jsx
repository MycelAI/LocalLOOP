import Script from 'next/script';
import { StickyInterestCta } from './components/StickyInterestCta';

export const metadata = {
  title: 'LocalLoop Protocol Hub',
  description: 'LocalLoop documentation hub for the LOOP Protocol.',
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
      </head>
      <body>
        {children}
        <StickyInterestCta />
        <Script src="/assets/js/config.js" strategy="beforeInteractive" />
        <Script src="/assets/js/main.js" strategy="afterInteractive" />
        <Script src="/assets/js/interest.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
