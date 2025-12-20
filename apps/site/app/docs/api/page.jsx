'use client';

import { useEffect, useState } from 'react';

export default function ApiDocsPage() {
  const [src, setSrc] = useState('https://loop-api.urbnia.com/docs');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const config = window.LOCALLOOP_CONFIG || {};
    if (config.apiBase) {
      setSrc(`${config.apiBase}/docs`);
    }
  }, []);

  return (
    <div className="content-stack">
      <div className="content-panel">
        <div className="badge">API reference</div>
        <h2>Redoc API documentation.</h2>
        <p>
          The public API documentation is served from the lab backend. If you are
          running locally, make sure the API is available at the configured base URL.
          Write endpoints may require an API key if enabled.
        </p>
        <div className="cta-row">
          <a className="button primary" href="/docs/metrics">View metrics</a>
          <a className="button secondary" href="/docs">Back to docs</a>
        </div>
      </div>

      <div className="content-panel">
        <div className="iframe-shell">
          <iframe
            title="LocalLoop API docs"
            src={src}
            className="api-iframe"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
