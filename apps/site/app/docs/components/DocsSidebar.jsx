'use client';

import { usePathname } from 'next/navigation';

const isActive = (pathname, href) => pathname === href;

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="side-nav">
      <div className="side-title">Docs</div>
      <div className="side-group">
        <span className="side-label">Overview</span>
        <a href="/docs" aria-current={isActive(pathname, '/docs') ? 'page' : undefined} className={isActive(pathname, '/docs') ? 'active' : ''}>
          Documentation home
        </a>
      </div>
      <div className="side-group">
        <span className="side-label">Guides</span>
        <a
          href="/docs/implementation"
          aria-current={isActive(pathname, '/docs/implementation') ? 'page' : undefined}
          className={isActive(pathname, '/docs/implementation') ? 'active' : ''}
        >
          Implementation
        </a>
        <a
          href="/docs/security"
          aria-current={isActive(pathname, '/docs/security') ? 'page' : undefined}
          className={isActive(pathname, '/docs/security') ? 'active' : ''}
        >
          Security guide
        </a>
        <a
          href="/docs/secure-coding"
          aria-current={isActive(pathname, '/docs/secure-coding') ? 'page' : undefined}
          className={isActive(pathname, '/docs/secure-coding') ? 'active' : ''}
        >
          Secure coding
        </a>
        <a
          href="/docs/incident-response"
          aria-current={isActive(pathname, '/docs/incident-response') ? 'page' : undefined}
          className={isActive(pathname, '/docs/incident-response') ? 'active' : ''}
        >
          Incident response
        </a>
      </div>
      <div className="side-group">
        <span className="side-label">Reference</span>
        <a href="/docs/faq" aria-current={isActive(pathname, '/docs/faq') ? 'page' : undefined} className={isActive(pathname, '/docs/faq') ? 'active' : ''}>
          FAQ
        </a>
        <a
          href="/docs/glossary"
          aria-current={isActive(pathname, '/docs/glossary') ? 'page' : undefined}
          className={isActive(pathname, '/docs/glossary') ? 'active' : ''}
        >
          Glossary
        </a>
      </div>
      <div className="side-note">
        Need the protocol spec? <a href="/protocol/spec">Open specification</a>
      </div>
    </aside>
  );
}
