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
              <a href="/" aria-current={pathnameLower === '/' ? 'page' : undefined} className={pathnameLower === '/' ? 'active' : ''}>Overview</a>
              <a href="/materialDNA" aria-current={pathnameLower === '/materialdna' ? 'page' : undefined} className={pathnameLower === '/materialdna' ? 'active' : ''}>MaterialDNA</a>
              <a href="/cities" aria-current={pathnameLower === '/cities' ? 'page' : undefined} className={pathnameLower === '/cities' ? 'active' : ''}>City Portals</a>
              <a href="/DEMO-City" aria-current={pathnameLower === '/demo-city' ? 'page' : undefined} className={pathnameLower === '/demo-city' ? 'active' : ''}>DEMO City</a>
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
              <a href="/protocol" aria-current={pathnameLower === '/protocol' ? 'page' : undefined} className={pathnameLower === '/protocol' ? 'active' : ''}>Overview</a>
              <a href="/protocol/spec" aria-current={pathnameLower === '/protocol/spec' ? 'page' : undefined} className={pathnameLower === '/protocol/spec' ? 'active' : ''}>Specification</a>
              <a href="/protocol/changelog" aria-current={pathnameLower === '/protocol/changelog' ? 'page' : undefined} className={pathnameLower === '/protocol/changelog' ? 'active' : ''}>Changelog</a>
              <a href="/protocol/security" aria-current={pathnameLower === '/protocol/security' ? 'page' : undefined} className={pathnameLower === '/protocol/security' ? 'active' : ''}>Security</a>
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
              <a href="/library/schemas" aria-current={pathnameLower === '/library/schemas' ? 'page' : undefined} className={pathnameLower === '/library/schemas' ? 'active' : ''}>Schemas</a>
              <a href="/library/examples" aria-current={pathnameLower === '/library/examples' ? 'page' : undefined} className={pathnameLower === '/library/examples' ? 'active' : ''}>Examples</a>
              <a href="/library" aria-current={pathnameLower === '/library' ? 'page' : undefined} className={pathnameLower === '/library' ? 'active' : ''}>All resources</a>
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
              <a href="/governance/rfcs" aria-current={pathnameLower === '/governance/rfcs' ? 'page' : undefined} className={pathnameLower === '/governance/rfcs' ? 'active' : ''}>RFC Guide</a>
              <a href="/governance/template" aria-current={pathnameLower === '/governance/template' ? 'page' : undefined} className={pathnameLower === '/governance/template' ? 'active' : ''}>RFC Template</a>
              <a href="/governance/smart-contracts" aria-current={pathnameLower === '/governance/smart-contracts' ? 'page' : undefined} className={pathnameLower === '/governance/smart-contracts' ? 'active' : ''}>Smart Contracts</a>
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
              <a href="/docs/implementation" aria-current={pathnameLower === '/docs/implementation' ? 'page' : undefined} className={pathnameLower === '/docs/implementation' ? 'active' : ''}>Implementation</a>
              <a href="/docs/lab-demo" aria-current={pathnameLower === '/docs/lab-demo' ? 'page' : undefined} className={pathnameLower === '/docs/lab-demo' ? 'active' : ''}>Lab demo</a>
              <a href="/docs/federation" aria-current={pathnameLower === '/docs/federation' ? 'page' : undefined} className={pathnameLower === '/docs/federation' ? 'active' : ''}>Federation</a>
              <a href="/docs/security" aria-current={pathnameLower === '/docs/security' ? 'page' : undefined} className={pathnameLower === '/docs/security' ? 'active' : ''}>Security Guide</a>
              <a href="/docs/secure-coding" aria-current={pathnameLower === '/docs/secure-coding' ? 'page' : undefined} className={pathnameLower === '/docs/secure-coding' ? 'active' : ''}>Secure Coding</a>
              <a href="/docs/incident-response" aria-current={pathnameLower === '/docs/incident-response' ? 'page' : undefined} className={pathnameLower === '/docs/incident-response' ? 'active' : ''}>Incident Response</a>
              <a href="/docs/api" aria-current={pathnameLower === '/docs/api' ? 'page' : undefined} className={pathnameLower === '/docs/api' ? 'active' : ''}>API Docs</a>
              <a href="/docs/metrics" aria-current={pathnameLower === '/docs/metrics' ? 'page' : undefined} className={pathnameLower === '/docs/metrics' ? 'active' : ''}>Metrics</a>
              <a href="/docs/faq" aria-current={pathnameLower === '/docs/faq' ? 'page' : undefined} className={pathnameLower === '/docs/faq' ? 'active' : ''}>FAQ</a>
              <a href="/docs/glossary" aria-current={pathnameLower === '/docs/glossary' ? 'page' : undefined} className={pathnameLower === '/docs/glossary' ? 'active' : ''}>Glossary</a>
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
              <a href="/interest" aria-current={pathnameLower === '/interest' ? 'page' : undefined} className={pathnameLower === '/interest' ? 'active' : ''}>Express Interest</a>
              <a href="/projects" aria-current={pathnameLower === '/projects' ? 'page' : undefined} className={pathnameLower === '/projects' ? 'active' : ''}>Project Hub</a>
              <a href="/contribute" aria-current={pathnameLower === '/contribute' ? 'page' : undefined} className={pathnameLower === '/contribute' ? 'active' : ''}>Contribute</a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
