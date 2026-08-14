'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigationSections } from '../config/siteRoutes.js';

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

const DROPDOWN_CLOSE_DELAY_MS = 280;
const VIEWPORT_EDGE_PAD = 20;
const VIEWPORT_COMFORT_PAD = 72;

const count_section_items = (section) => {
  if (section.groups) {
    return section.groups.reduce((sum, group) => sum + group.items.length, 0);
  }

  return section.items?.length ?? 0;
};

const menu_column_count = (item_count) => {
  if (item_count <= 1) return 1;
  if (item_count === 2) return 2;
  if (item_count === 3) return 3;
  if (item_count === 4) return 2;
  if (item_count >= 10) return 4;
  return 3;
};

const clear_mega_position = (menu) => {
  if (!menu) return;
  menu.style.left = '';
  menu.style.right = '';
};

const clamp_mega_menu_to_viewport = (group_el) => {
  const menu = group_el?.querySelector('.nav-menu--mega');
  if (!menu || window.matchMedia('(max-width: 1119px)').matches) {
    return;
  }

  clear_mega_position(menu);

  const prefer_end = group_el.classList.contains('nav-group--align-end');
  menu.style.left = prefer_end ? 'auto' : '0';
  menu.style.right = prefer_end ? '0' : 'auto';

  const group_rect = group_el.getBoundingClientRect();
  const menu_rect = menu.getBoundingClientRect();
  const menu_width = Math.max(menu_rect.width, menu.scrollWidth, 1);
  const viewport_w = document.documentElement.clientWidth || window.innerWidth;
  const max_right = viewport_w - VIEWPORT_EDGE_PAD;
  const min_left = VIEWPORT_EDGE_PAD;

  let left = prefer_end ? group_rect.right - menu_width : group_rect.left;

  // If a start-aligned panel would sit too close to / past the right edge,
  // flip it to the trigger's end so Platform/Library stay on-screen.
  if (!prefer_end && left + menu_width > viewport_w - VIEWPORT_COMFORT_PAD) {
    left = group_rect.right - menu_width;
  }

  if (left + menu_width > max_right) {
    left = max_right - menu_width;
  }
  if (left < min_left) {
    left = min_left;
  }

  menu.style.left = `${Math.round(left - group_rect.left)}px`;
  menu.style.right = 'auto';
};

function NavigationLink({ href, children, ...props }) {
  if (href.startsWith('/')) {
    return <Link href={href} {...props}>{children}</Link>;
  }

  return <a href={href} {...props}>{children}</a>;
}

function NavMenuCard({ item, active }) {
  return (
    <NavigationLink
      href={item.href}
      className={`nav-menu-card${active ? ' active' : ''}`}
      aria-current={active ? 'page' : undefined}
    >
      <span className="nav-menu-card-icon" aria-hidden="true">
        <i className={`ph-bold ${item.icon || 'ph-arrow-right'}`}></i>
      </span>
      <span className="nav-menu-card-body">
        <span className="nav-menu-card-title">{item.label}</span>
        {item.description ? (
          <span className="nav-menu-card-desc">{item.description}</span>
        ) : null}
      </span>
    </NavigationLink>
  );
}

export function SiteHeader({ subtitle = '' }) {
  const pathname = usePathname();
  const headerRef = useRef(null);
  const menuToggleRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMobileSection, setOpenMobileSection] = useState(null);
  const [hoverGroupKey, setHoverGroupKey] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const pathnameNormalized = normalizePath(pathname);

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleNavGroupEnter = (key, event) => {
    clearCloseTimeout();
    setHoverGroupKey(key);
    const group_el = event?.currentTarget;
    if (!group_el) return;

    // Open immediately for measurement (React state lags one frame).
    group_el.setAttribute('data-dropdown-open', 'true');
    requestAnimationFrame(() => {
      clamp_mega_menu_to_viewport(group_el);
      requestAnimationFrame(() => clamp_mega_menu_to_viewport(group_el));
    });
  };

  const handleNavGroupLeave = (event) => {
    const group_el = event?.currentTarget;
    closeTimeoutRef.current = setTimeout(() => {
      clear_mega_position(group_el?.querySelector('.nav-menu--mega'));
      group_el?.removeAttribute('data-dropdown-open');
      setHoverGroupKey(null);
      closeTimeoutRef.current = null;
    }, DROPDOWN_CLOSE_DELAY_MS);
  };

  useEffect(() => {
    if (!hoverGroupKey || !headerRef.current) return undefined;

    const group_el = headerRef.current.querySelector(
      `[data-nav-section="${hoverGroupKey}"]`
    )?.closest('.nav-group');

    const on_resize = () => clamp_mega_menu_to_viewport(group_el);
    window.addEventListener('resize', on_resize);
    on_resize();

    return () => window.removeEventListener('resize', on_resize);
  }, [hoverGroupKey]);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMobileSection(null);
  }, [pathname]);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        const wasOpen = mobileOpen;
        setMobileOpen(false);
        setOpenMobileSection(null);
        setHoverGroupKey(null);
        if (wasOpen) requestAnimationFrame(() => menuToggleRef.current?.focus());
      }
    };

    const handleClick = (event) => {
      if (!headerRef.current || headerRef.current.contains(event.target)) {
        return;
      }

      setMobileOpen(false);
      setOpenMobileSection(null);
      setHoverGroupKey(null);
    };

    document.addEventListener('keydown', handleKey);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('click', handleClick);
    };
  }, [mobileOpen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1120px)');

    const handleChange = (event) => {
      if (event.matches) {
        setMobileOpen(false);
        setOpenMobileSection(null);
      } else {
        setHoverGroupKey(null);
        clearCloseTimeout();
      }
    };

    handleChange(mediaQuery);
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => () => clearCloseTimeout(), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header ref={headerRef} className="site-header" data-scrolled={scrolled} data-nav-subtitle={subtitle || undefined}>
      <nav className="nav-container" aria-label="Primary">
        <Link href="/" className="nav-brand">
          <img
            src="/assets/local-loop-logo.png"
            alt=""
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
        </Link>

        <div className="nav-controls">
          <button
            className="nav-toggle"
            ref={menuToggleRef}
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
                const item_count = count_section_items(section);
                const cols = menu_column_count(item_count);

                return (
                <div
                  key={section.key}
                  className={`nav-group${section.align === 'end' ? ' nav-group--align-end' : ''}`}
                  data-mobile-open={mobileSectionOpen}
                  data-dropdown-open={hoverGroupKey === section.key}
                  onMouseEnter={(event) => handleNavGroupEnter(section.key, event)}
                  onMouseLeave={(event) => handleNavGroupLeave(event)}
                  onFocusCapture={(event) => handleNavGroupEnter(section.key, event)}
                >
                  <div className="nav-item">
                    <NavigationLink
                      href={section.href}
                      className={`nav-section-link${sectionActive ? ' active' : ''}${section.isCta ? ' nav-cta' : ''}`}
                      data-nav-section={section.key}
                      aria-current={exactSectionMatch ? 'page' : undefined}
                    >
                      <span>{section.label}</span>
                      <span className="nav-link-caret" aria-hidden="true"></span>
                    </NavigationLink>

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

                  <div
                    className="nav-menu nav-menu--mega"
                    id={`nav-menu-${section.key}`}
                    data-cols={cols}
                    data-section={section.key}
                  >
                    {section.groups
                      ? section.groups.map((group) => (
                          <div key={group.label} className="nav-menu-group">
                            <span className="nav-menu-group-label">{group.label}</span>
                            <div className="nav-menu-grid">
                              {group.items.map((item) => {
                                const itemActive = pathnameNormalized === normalizePath(item.href);
                                return (
                                  <NavMenuCard
                                    key={item.href}
                                    item={item}
                                    active={itemActive}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        ))
                      : (
                          <div className="nav-menu-grid">
                            {section.items.map((item) => {
                              const itemActive = pathnameNormalized === normalizePath(item.href);
                              return (
                                <NavMenuCard
                                  key={item.href}
                                  item={item}
                                  active={itemActive}
                                />
                              );
                            })}
                          </div>
                        )}
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
