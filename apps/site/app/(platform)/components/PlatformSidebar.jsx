'use client';

import { usePathname } from 'next/navigation';

const isActive = (pathname, href) => pathname === href;

export function PlatformSidebar() {
  const pathname = usePathname();

  return (
    <aside className="side-nav">
      <div className="side-title">Platform</div>
      <div className="side-group">
        <span className="side-label">Overview</span>
        <a href="/" aria-current={isActive(pathname, '/') ? 'page' : undefined} className={isActive(pathname, '/') ? 'active' : ''}>
          Platform overview
        </a>
      </div>
      <div className="side-group">
        <span className="side-label">Portals</span>
        <a href="/materialDNA" aria-current={isActive(pathname, '/materialDNA') ? 'page' : undefined} className={isActive(pathname, '/materialDNA') ? 'active' : ''}>
          MaterialDNA
        </a>
        <a href="/cities" aria-current={isActive(pathname, '/cities') ? 'page' : undefined} className={isActive(pathname, '/cities') ? 'active' : ''}>
          City portals
        </a>
        <a href="/DEMO-City" aria-current={isActive(pathname, '/DEMO-City') ? 'page' : undefined} className={isActive(pathname, '/DEMO-City') ? 'active' : ''}>
          DEMO City
        </a>
      </div>
      <div className="side-note">
        Need protocol details? <a href="/protocol">Open protocol overview</a>
      </div>
    </aside>
  );
}
