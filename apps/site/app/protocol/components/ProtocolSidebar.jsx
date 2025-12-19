'use client';

import { usePathname } from 'next/navigation';

const isActive = (pathname, href) => pathname === href;

export function ProtocolSidebar() {
  const pathname = usePathname();

  return (
    <aside className="side-nav">
      <div className="side-title">Protocol</div>
      <div className="side-group">
        <span className="side-label">Overview</span>
        <a href="/protocol" aria-current={isActive(pathname, '/protocol') ? 'page' : undefined} className={isActive(pathname, '/protocol') ? 'active' : ''}>
          Protocol hub
        </a>
      </div>
      <div className="side-group">
        <span className="side-label">Reference</span>
        <a
          href="/protocol/spec"
          aria-current={isActive(pathname, '/protocol/spec') ? 'page' : undefined}
          className={isActive(pathname, '/protocol/spec') ? 'active' : ''}
        >
          Specification
        </a>
        <a
          href="/protocol/changelog"
          aria-current={isActive(pathname, '/protocol/changelog') ? 'page' : undefined}
          className={isActive(pathname, '/protocol/changelog') ? 'active' : ''}
        >
          Changelog
        </a>
        <a
          href="/protocol/security"
          aria-current={isActive(pathname, '/protocol/security') ? 'page' : undefined}
          className={isActive(pathname, '/protocol/security') ? 'active' : ''}
        >
          Security policy
        </a>
      </div>
      <div className="side-note">
        Looking for operator guidance? <a href="/docs/security">Open security guide</a>
      </div>
    </aside>
  );
}
