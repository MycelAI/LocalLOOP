import Script from 'next/script';

export const metadata = {
  title: 'LocalLoop Protocol Hub',
  description: 'LocalLoop documentation hub for the LOOP Protocol.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script src="/assets/js/main.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
