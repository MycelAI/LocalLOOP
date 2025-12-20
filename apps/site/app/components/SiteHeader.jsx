'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const matchesPath = (pathname, prefixes) =>
  prefixes.some((prefix) => {
    if (prefix === '/') {
      return pathname === '/';
    }
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  });

export function SiteHeader({ subtitle = '' }) {
  const pathname = usePathname();
  const headerRef = useRef(null);
  const closeTimer = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const platformActive = matchesPath(pathname, ['/', '/materialDNA', '/cities', '/DEMO-City']);
  const protocolActive = matchesPath(pathname, ['/protocol']);
  const libraryActive = matchesPath(pathname, ['/library']);
  const governanceActive = matchesPath(pathname, ['/governance']);
  const docsActive = matchesPath(pathname, ['/docs']);
  const engageActive = matchesPath(pathname, ['/interest', '/projects', '/contribute']);

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
    <header ref={headerRef}>
      <nav>
        <div className="nav-header">
          <div className="nav-brand">
            <span className="nav-logo" aria-hidden="true">
              <i className="ph-bold ph-infinity"></i>
            </span>
            <h1>localLOOP</h1>
            {subtitle ? <span className="nav-subtitle">{subtitle}</span> : null}
          </div>
          <button
            className="nav-toggle"
            type="button"
            aria-controls="site-nav-links"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((value) => !value)}
          >
            <span aria-hidden="true">
              <i className={`ph-bold ${mobileOpen ? 'ph-x' : 'ph-list'}`}></i>
            </span>
            <span>{mobileOpen ? 'Close' : 'Menu'}</span>
          </button>
        </div>
        <div className="nav-links" id="site-nav-links" data-open={mobileOpen}>
          <div
            className="nav-group"
            data-open={openMenu === 'platform'}
            onMouseEnter={() => openMenuPanel('platform')}
            onMouseLeave={scheduleClose}
            onFocusCapture={() => openMenuPanel('platform')}
            onBlurCapture={handleBlur}
          >
            <a
              className={`nav-trigger${platformActive ? ' active' : ''}`}
              href="/"
              aria-haspopup="true"
              aria-expanded={openMenu === 'platform'}
              aria-controls="nav-menu-platform"
            >
              Platform
            </a>
            <div className="nav-menu" id="nav-menu-platform">
              <span className="nav-eyebrow">Platform</span>
              <a href="/" aria-current={pathname === '/' ? 'page' : undefined} className={pathname === '/' ? 'active' : ''}>Overview</a>
              <a href="/materialDNA" aria-current={pathname === '/materialDNA' ? 'page' : undefined} className={pathname === '/materialDNA' ? 'active' : ''}>MaterialDNA</a>
              <a href="/cities" aria-current={pathname === '/cities' ? 'page' : undefined} className={pathname === '/cities' ? 'active' : ''}>City Portals</a>
              <a href="/DEMO-City" aria-current={pathname === '/DEMO-City' ? 'page' : undefined} className={pathname === '/DEMO-City' ? 'active' : ''}>DEMO City</a>
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
            <a
              className={`nav-trigger${protocolActive ? ' active' : ''}`}
              href="/protocol"
              aria-haspopup="true"
              aria-expanded={openMenu === 'protocol'}
              aria-controls="nav-menu-protocol"
            >
              Protocol
            </a>
            <div className="nav-menu" id="nav-menu-protocol">
              <span className="nav-eyebrow">Protocol</span>
              <a href="/protocol" aria-current={pathname === '/protocol' ? 'page' : undefined} className={pathname === '/protocol' ? 'active' : ''}>Overview</a>
              <a href="/protocol/spec" aria-current={pathname === '/protocol/spec' ? 'page' : undefined} className={pathname === '/protocol/spec' ? 'active' : ''}>Specification</a>
              <a href="/protocol/changelog" aria-current={pathname === '/protocol/changelog' ? 'page' : undefined} className={pathname === '/protocol/changelog' ? 'active' : ''}>Changelog</a>
              <a href="/protocol/security" aria-current={pathname === '/protocol/security' ? 'page' : undefined} className={pathname === '/protocol/security' ? 'active' : ''}>Security</a>
            </div>
          </div>
          <div
            className="nav-group"
            data-open={openMenu === 'library'}
            onMouseEnter={() => openMenuPanel('library')}
            onMouseLeave={scheduleClose}
            onFocusCapture={() => openMenuPanel('library')}
            onBlurCapture={handleBlur}
          >
            <a
              className={`nav-trigger${libraryActive ? ' active' : ''}`}
              href="/library"
              aria-haspopup="true"
              aria-expanded={openMenu === 'library'}
              aria-controls="nav-menu-library"
            >
              Library
            </a>
            <div className="nav-menu" id="nav-menu-library">
              <span className="nav-eyebrow">Library</span>
              <a href="/library/schemas" aria-current={pathname === '/library/schemas' ? 'page' : undefined} className={pathname === '/library/schemas' ? 'active' : ''}>Schemas</a>
              <a href="/library/examples" aria-current={pathname === '/library/examples' ? 'page' : undefined} className={pathname === '/library/examples' ? 'active' : ''}>Examples</a>
              <a href="/library" aria-current={pathname === '/library' ? 'page' : undefined} className={pathname === '/library' ? 'active' : ''}>All resources</a>
            </div>
          </div>
          <div
            className="nav-group"
            data-open={openMenu === 'governance'}
            onMouseEnter={() => openMenuPanel('governance')}
            onMouseLeave={scheduleClose}
            onFocusCapture={() => openMenuPanel('governance')}
            onBlurCapture={handleBlur}
          >
            <a
              className={`nav-trigger${governanceActive ? ' active' : ''}`}
              href="/governance"
              aria-haspopup="true"
              aria-expanded={openMenu === 'governance'}
              aria-controls="nav-menu-governance"
            >
              Governance
            </a>
            <div className="nav-menu" id="nav-menu-governance">
              <span className="nav-eyebrow">Governance</span>
              <a href="/governance/rfcs" aria-current={pathname === '/governance/rfcs' ? 'page' : undefined} className={pathname === '/governance/rfcs' ? 'active' : ''}>RFC Guide</a>
              <a href="/governance/template" aria-current={pathname === '/governance/template' ? 'page' : undefined} className={pathname === '/governance/template' ? 'active' : ''}>RFC Template</a>
              <a href="/governance/smart-contracts" aria-current={pathname === '/governance/smart-contracts' ? 'page' : undefined} className={pathname === '/governance/smart-contracts' ? 'active' : ''}>Smart Contracts</a>
            </div>
          </div>
          <div
            className="nav-group"
            data-open={openMenu === 'docs'}
            onMouseEnter={() => openMenuPanel('docs')}
            onMouseLeave={scheduleClose}
            onFocusCapture={() => openMenuPanel('docs')}
            onBlurCapture={handleBlur}
          >
            <a
              className={`nav-trigger${docsActive ? ' active' : ''}`}
              href="/docs"
              aria-haspopup="true"
              aria-expanded={openMenu === 'docs'}
              aria-controls="nav-menu-docs"
            >
              Docs
            </a>
            <div className="nav-menu" id="nav-menu-docs">
              <span className="nav-eyebrow">Docs</span>
              <a href="/docs/implementation" aria-current={pathname === '/docs/implementation' ? 'page' : undefined} className={pathname === '/docs/implementation' ? 'active' : ''}>Implementation</a>
              <a href="/docs/lab-demo" aria-current={pathname === '/docs/lab-demo' ? 'page' : undefined} className={pathname === '/docs/lab-demo' ? 'active' : ''}>Lab demo</a>
              <a href="/docs/federation" aria-current={pathname === '/docs/federation' ? 'page' : undefined} className={pathname === '/docs/federation' ? 'active' : ''}>Federation</a>
              <a href="/docs/security" aria-current={pathname === '/docs/security' ? 'page' : undefined} className={pathname === '/docs/security' ? 'active' : ''}>Security Guide</a>
              <a href="/docs/secure-coding" aria-current={pathname === '/docs/secure-coding' ? 'page' : undefined} className={pathname === '/docs/secure-coding' ? 'active' : ''}>Secure Coding</a>
              <a href="/docs/incident-response" aria-current={pathname === '/docs/incident-response' ? 'page' : undefined} className={pathname === '/docs/incident-response' ? 'active' : ''}>Incident Response</a>
              <a href="/docs/api" aria-current={pathname === '/docs/api' ? 'page' : undefined} className={pathname === '/docs/api' ? 'active' : ''}>API Docs</a>
              <a href="/docs/metrics" aria-current={pathname === '/docs/metrics' ? 'page' : undefined} className={pathname === '/docs/metrics' ? 'active' : ''}>Metrics</a>
              <a href="/docs/faq" aria-current={pathname === '/docs/faq' ? 'page' : undefined} className={pathname === '/docs/faq' ? 'active' : ''}>FAQ</a>
              <a href="/docs/glossary" aria-current={pathname === '/docs/glossary' ? 'page' : undefined} className={pathname === '/docs/glossary' ? 'active' : ''}>Glossary</a>
            </div>
          </div>
          <div
            className="nav-group"
            data-open={openMenu === 'engage'}
            onMouseEnter={() => openMenuPanel('engage')}
            onMouseLeave={scheduleClose}
            onFocusCapture={() => openMenuPanel('engage')}
            onBlurCapture={handleBlur}
          >
            <a
              className={`nav-trigger${engageActive ? ' active' : ''}`}
              href="/interest"
              aria-haspopup="true"
              aria-expanded={openMenu === 'engage'}
              aria-controls="nav-menu-engage"
            >
              Engage
            </a>
            <div className="nav-menu" id="nav-menu-engage">
              <span className="nav-eyebrow">Engage</span>
              <a href="/interest" aria-current={pathname === '/interest' ? 'page' : undefined} className={pathname === '/interest' ? 'active' : ''}>Express Interest</a>
              <a href="/projects" aria-current={pathname === '/projects' ? 'page' : undefined} className={pathname === '/projects' ? 'active' : ''}>Project Hub</a>
              <a href="/contribute" aria-current={pathname === '/contribute' ? 'page' : undefined} className={pathname === '/contribute' ? 'active' : ''}>Contribute</a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
