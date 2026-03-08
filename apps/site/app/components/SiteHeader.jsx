'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const normalizePath = (value) => {
  if (!value) return '/';

  const normalized = value.toLowerCase();

  if (normalized !== '/' && normalized.endsWith('/')) {
    return normalized.slice(0, -1);
  }

  return normalized;
};

const matchesPath = (pathname, prefixes) => {
  const current = normalizePath(pathname);

  return prefixes.some((prefix) => {
    const normalizedPrefix = normalizePath(prefix);

    if (normalizedPrefix === '/') {
      return current === '/';
    }

    return current === normalizedPrefix || current.startsWith(`${normalizedPrefix}/`);
  });
};

const navigationSections = [
  {
    key: 'platform',
    label: 'Platform',
    href: '/',
    matchPrefixes: ['/', '/platform', '/materialdna', '/cities', '/demo-city'],
    items: [
      { href: '/materialdna', label: 'MaterialDNA' },
      { href: '/cities', label: 'City Portals' },
      { href: '/demo-city', label: 'DEMO City' },
    ],
  },
  {
    key: 'protocol',
    label: 'Protocol',
    href: '/protocol',
    matchPrefixes: ['/protocol'],
    items: [
      { href: '/protocol/spec', label: 'Specification' },
      { href: '/protocol/changelog', label: 'Changelog' },
      { href: '/protocol/security', label: 'Security' },
    ],
  },
  {
    key: 'library',
    label: 'Library',
    href: '/library',
    matchPrefixes: ['/library'],
    items: [
      { href: '/library/schemas', label: 'Schemas' },
      { href: '/library/examples', label: 'Examples' },
    ],
  },
  {
    key: 'docs',
    label: 'Docs',
    href: '/docs',
    matchPrefixes: ['/docs'],
    align: 'end',
    items: [
      { href: '/docs/implementation', label: 'Implementation' },
      { href: '/docs/api', label: 'API Docs' },
      { href: '/docs/security', label: 'Security Guide' },
      { href: '/docs/secure-coding', label: 'Secure Coding' },
      { href: '/docs/incident-response', label: 'Incident Response' },
      { href: '/docs/faq', label: 'FAQ' },
      { href: '/docs/glossary', label: 'Glossary' },
    ],
  },
  {
    key: 'governance',
    label: 'Governance',
    href: '/governance',
    matchPrefixes: ['/governance'],
    align: 'end',
    items: [
      { href: '/governance/rfcs', label: 'RFC Guide' },
      { href: '/governance/template', label: 'RFC Template' },
      { href: '/governance/smart-contracts', label: 'Smart Contracts' },
    ],
  },
];

export function SiteHeader({ subtitle = '' }) {
  const pathname = usePathname();
  const headerRef = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMobileSection, setOpenMobileSection] = useState(null);
  const pathnameNormalized = normalizePath(pathname);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMobileSection(null);
  }, [pathname]);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
        setOpenMobileSection(null);
      }
    };

    const handleClick = (event) => {
      if (!headerRef.current || headerRef.current.contains(event.target)) {
        return;
      }

      setMobileOpen(false);
      setOpenMobileSection(null);
    };

    document.addEventListener('keydown', handleKey);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 961px)');

    const handleChange = (event) => {
      if (event.matches) {
        setMobileOpen(false);
        setOpenMobileSection(null);
      }
    };

    handleChange(mediaQuery);
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return (
    <header ref={headerRef} className="site-header" data-nav-subtitle={subtitle || undefined}>
      <nav className="nav-container" aria-label="Primary">
        <a href="/" className="nav-brand">
          <img
            src="/assets/local-loop-logo.png"
            alt="localLOOP"
            className="nav-logo-img"
            width={32}
            height={32}
          />
          <span className="nav-brand-copy">
            <span className="nav-wordmark">
              local<span className="nav-wordmark-accent">LOOP</span>
            </span>
            <span className="nav-subtitle">{subtitle}</span>
          </span>
        </a>

        <div className="nav-controls">
          <button
            className="nav-toggle"
            type="button"
            aria-controls="site-nav-links"
            aria-expanded={mobileOpen}
            onClick={() => {
              setMobileOpen((value) => {
                const next = !value;
                if (!next) {
                  setOpenMobileSection(null);
                }
                return next;
              });
            }}
          >
            <i className={`ph-bold ${mobileOpen ? 'ph-x' : 'ph-list'}`} aria-hidden="true"></i>
            <span className="visually-hidden">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
          </button>

          <div className="nav-bar" data-open={mobileOpen}>
            <div className="nav-links" id="site-nav-links" data-open={mobileOpen}>
              {navigationSections.map((section) => {
                const sectionActive = matchesPath(pathname, section.matchPrefixes);
                const mobileSectionOpen = openMobileSection === section.key;
                const exactSectionMatch = pathnameNormalized === normalizePath(section.href);

                return (
                <div
                  key={section.key}
                  className={`nav-group${section.align === 'end' ? ' nav-group--align-end' : ''}`}
                  data-mobile-open={mobileSectionOpen}
                >
                  <div className="nav-item">
                    <a
                      href={section.href}
                      className={`nav-section-link${sectionActive ? ' active' : ''}`}
                      data-nav-section={section.key}
                      aria-current={exactSectionMatch ? 'page' : undefined}
                    >
                      <span>{section.label}</span>
                      <span className="nav-link-caret" aria-hidden="true"></span>
                    </a>

                    <button
                      className={`nav-group-toggle${mobileSectionOpen ? ' is-open' : ''}`}
                      type="button"
                      aria-label={`${mobileSectionOpen ? 'Collapse' : 'Expand'} ${section.label} menu`}
                      aria-controls={`nav-menu-${section.key}`}
                      aria-expanded={mobileSectionOpen}
                      onClick={() =>
                        setOpenMobileSection((current) => (current === section.key ? null : section.key))
                      }
                    >
                      <span className="nav-group-caret" aria-hidden="true"></span>
                    </button>
                  </div>

                  <div className="nav-menu" id={`nav-menu-${section.key}`}>
                    {section.items.map((item) => {
                      const itemActive = pathnameNormalized === normalizePath(item.href);

                      return (
                        <a
                          key={item.href}
                          href={item.href}
                          className={itemActive ? 'active' : ''}
                          aria-current={itemActive ? 'page' : undefined}
                        >
                          {item.label}
                        </a>
                      );
                    })}
                  </div>
                </div>
                );
              })}
            </div>

            <a href="/interest" className="nav-cta">
              <span>Get Started</span>
              <i className="ph-bold ph-arrow-right" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
