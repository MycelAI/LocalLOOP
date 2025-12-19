'use client';

import { usePathname } from 'next/navigation';

const isActive = (pathname, href) => pathname === href;

export function GovernanceSidebar() {
  const pathname = usePathname();

  return (
    <aside className="side-nav">
      <div className="side-title">Governance</div>
      <div className="side-group">
        <span className="side-label">Overview</span>
        <a href="/governance" aria-current={isActive(pathname, '/governance') ? 'page' : undefined} className={isActive(pathname, '/governance') ? 'active' : ''}>
          Governance hub
        </a>
      </div>
      <div className="side-group">
        <span className="side-label">RFCs</span>
        <a
          href="/governance/rfcs"
          aria-current={isActive(pathname, '/governance/rfcs') ? 'page' : undefined}
          className={isActive(pathname, '/governance/rfcs') ? 'active' : ''}
        >
          RFC guide
        </a>
        <a
          href="/governance/template"
          aria-current={isActive(pathname, '/governance/template') ? 'page' : undefined}
          className={isActive(pathname, '/governance/template') ? 'active' : ''}
        >
          RFC template
        </a>
        <a
          href="/governance/smart-contracts"
          aria-current={isActive(pathname, '/governance/smart-contracts') ? 'page' : undefined}
          className={isActive(pathname, '/governance/smart-contracts') ? 'active' : ''}
        >
          Smart contract RFC
        </a>
      </div>
      <div className="side-note">
        Need protocol context? <a href="/protocol">Open protocol hub</a>
      </div>
    </aside>
  );
}
