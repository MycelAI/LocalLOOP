'use client';

import { useEffect } from 'react';

/**
 * Client-side redirect for static export (no server redirects).
 * Redirects to the canonical URL and shows a fallback link for no-JS/crawlers.
 */
export function Redirect({ to, label = 'Continue' }) {
  useEffect(() => {
    const target = to.startsWith('/') ? `${window.location.origin}${to}` : to;
    window.location.replace(target);
  }, [to]);

  const href = to.startsWith('/') ? to : to;
  return (
    <div className="content-stack">
      <div className="content-panel">
        <p>Redirecting…</p>
        <a href={href} className="button primary">
          {label}
        </a>
      </div>
    </div>
  );
}
