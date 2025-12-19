'use client';

import { usePathname } from 'next/navigation';

const isActive = (pathname, href) => pathname === href;

export function EngageSidebar() {
  const pathname = usePathname();

  return (
    <aside className="side-nav">
      <div className="side-title">Engage</div>
      <div className="side-group">
        <span className="side-label">Engage</span>
        <a href="/interest" aria-current={isActive(pathname, '/interest') ? 'page' : undefined} className={isActive(pathname, '/interest') ? 'active' : ''}>
          Expression of interest
        </a>
        <a href="/projects" aria-current={isActive(pathname, '/projects') ? 'page' : undefined} className={isActive(pathname, '/projects') ? 'active' : ''}>
          Project hub
        </a>
        <a href="/contribute" aria-current={isActive(pathname, '/contribute') ? 'page' : undefined} className={isActive(pathname, '/contribute') ? 'active' : ''}>
          Contribute
        </a>
      </div>
      <div className="side-note">
        Need protocol context? <a href="/protocol">Open protocol overview</a>
      </div>
    </aside>
  );
}
