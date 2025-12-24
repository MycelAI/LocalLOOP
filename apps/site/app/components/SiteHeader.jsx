'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const normalizePath = (value) => (value ? value.toLowerCase() : '');

const matchesPath = (pathname, prefixes) => {
  const current = normalizePath(pathname);
  return prefixes.some((prefix) => {
    const normalizedPrefix = prefix.toLowerCase();
    if (normalizedPrefix === '/') {
      return current === '/';
    }
    return current === normalizedPrefix || current.startsWith(`${normalizedPrefix}/`);
  });
};

export function SiteHeader({ subtitle = '' }) {
  const pathname = usePathname();
  const headerRef = useRef(null);
  const closeTimer = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const pathnameLower = normalizePath(pathname);
  const platformActive = matchesPath(pathname, ['/', '/materialDNA', '/cities', '/DEMO-City', '/platform']);
  const protocolActive = matchesPath(pathname, ['/protocol']);
  const libraryActive = matchesPath(pathname, ['/library']);
  const governanceActive = matchesPath(pathname, ['/governance']);
  const docsActive = matchesPath(pathname, ['/docs']);
  const engageActive = matchesPath(pathname, ['/interest', '/projects', '/contribute', '/engage']);

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        setOpenMenu(null);
      }
    };
    const handleClick = (event) => {
      if (!headerRef.current) return;
      if (!headerRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('keydown', handleKey);
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openMenuPanel = (menuKey) => {
    cancelClose();
    setOpenMenu(menuKey);
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      setOpenMenu(null);
    }, 260);
  };

  const handleBlur = (event) => {
    if (event.currentTarget.contains(event.relatedTarget)) {
      return;
    }
    scheduleClose();
  };

  return (
    <header ref={headerRef} className="site-header">
      <nav className="nav-container">
        <a href="/" className="nav-brand">
          <span className="nav-logo" aria-hidden="true">
            <i className="ph-bold ph-infinity"></i>
          </span>
          <span className="nav-wordmark">LocalLoop</span>
        </a>

        <button
          className="nav-toggle"
          type="button"
          aria-controls="site-nav-links"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((value) => !value)}
        >
          <i className={`ph-bold ${mobileOpen ? 'ph-x' : 'ph-list'}`} aria-hidden="true"></i>
          <span className="visually-hidden">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
        </button>

        <div className="nav-links" id="site-nav-links" data-open={mobileOpen}>
          <div
            className="nav-group"
            data-open={openMenu === 'platform'}
            onMouseEnter={() => openMenuPanel('platform')}
            onMouseLeave={scheduleClose}
            onFocusCapture={() => openMenuPanel('platform')}
            onBlurCapture={handleBlur}
          >
            <button
              className={`nav-trigger${platformActive ? ' active' : ''}`}
              type="button"
              aria-haspopup="true"
              aria-expanded={openMenu === 'platform'}
              aria-controls="nav-menu-platform"
            >
              Platform
              <i className="ph ph-caret-down" aria-hidden="true"></i>
            </button>
            <div className="nav-menu" id="nav-menu-platform">
              <a href="/" className={pathnameLower === '/' ? 'active' : ''}>Overview</a>
              <a href="/materialDNA" className={pathnameLower === '/materialdna' ? 'active' : ''}>MaterialDNA</a>
              <a href="/cities" className={pathnameLower === '/cities' ? 'active' : ''}>City Portals</a>
              <a href="/DEMO-City" className={pathnameLower === '/demo-city' ? 'active' : ''}>DEMO City</a>
            </div>
          </div>

          <div
            className="nav-group"
            data-open={openMenu === 'protocol'}
            onMouseEnter={() => openMenuPanel('protocol')}
            onMouseLeave={scheduleClose}
            onFocusCapture={() => openMenuPanel('protocol')}
            onBlurCapture={handleBlur}
          >
            <button
              className={`nav-trigger${protocolActive ? ' active' : ''}`}
              type="button"
              aria-haspopup="true"
              aria-expanded={openMenu === 'protocol'}
              aria-controls="nav-menu-protocol"
            >
              Protocol
              <i className="ph ph-caret-down" aria-hidden="true"></i>
            </button>
            <div className="nav-menu" id="nav-menu-protocol">
              <a href="/protocol" className={pathnameLower === '/protocol' ? 'active' : ''}>Overview</a>
              <a href="/protocol/spec" className={pathnameLower === '/protocol/spec' ? 'active' : ''}>Specification</a>
              <a href="/protocol/changelog" className={pathnameLower === '/protocol/changelog' ? 'active' : ''}>Changelog</a>
              <a href="/protocol/security" className={pathnameLower === '/protocol/security' ? 'active' : ''}>Security</a>
            </div>
          </div>

          <a href="/library" className={`nav-link${libraryActive ? ' active' : ''}`}>
            Library
          </a>

          <a href="/docs" className={`nav-link${docsActive ? ' active' : ''}`}>
            Docs
          </a>

          <a href="/governance" className={`nav-link${governanceActive ? ' active' : ''}`}>
            Governance
          </a>
        </div>

        <a href="/interest" className="nav-cta">
          Get Started
          <i className="ph-bold ph-arrow-right" aria-hidden="true"></i>
        </a>
      </nav>
    </header>
  );
}
