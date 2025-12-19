'use client';

import { usePathname } from 'next/navigation';

const isActive = (pathname, href) => pathname === href;

export function LibrarySidebar() {
  const pathname = usePathname();

  return (
    <aside className="side-nav">
      <div className="side-title">Library</div>
      <div className="side-group">
        <span className="side-label">Overview</span>
        <a href="/library" aria-current={isActive(pathname, '/library') ? 'page' : undefined} className={isActive(pathname, '/library') ? 'active' : ''}>
          Library hub
        </a>
      </div>
      <div className="side-group">
        <span className="side-label">Artifacts</span>
        <a
          href="/library/schemas"
          aria-current={isActive(pathname, '/library/schemas') ? 'page' : undefined}
          className={isActive(pathname, '/library/schemas') ? 'active' : ''}
        >
          Schemas
        </a>
        <a
          href="/library/examples"
          aria-current={isActive(pathname, '/library/examples') ? 'page' : undefined}
          className={isActive(pathname, '/library/examples') ? 'active' : ''}
        >
          Examples
        </a>
      </div>
      <div className="side-note">
        Need the protocol rules? <a href="/protocol/spec">Open specification</a>
      </div>
    </aside>
  );
}
