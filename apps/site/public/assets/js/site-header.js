(function () {
  const host = document.querySelector('[data-site-header]');

  if (!host) return;

  const subtitle = host.dataset.siteSubtitle || '';
  const forcedSection = host.dataset.activeSection;
  const sectionOrder = [
    { key: 'platform', prefixes: ['/', '/platform', '/materialdna', '/cities', '/demo-city'] },
    { key: 'protocol', prefixes: ['/projects/loop-protocol', '/protocol'] },
    { key: 'library', prefixes: ['/library'] },
    { key: 'docs', prefixes: ['/docs'] },
    { key: 'governance', prefixes: ['/governance'] },
  ];

  const normalizePath = (value) => {
    if (!value) return '/';

    const normalized = value.toLowerCase();

    if (normalized !== '/' && normalized.endsWith('/')) {
      return normalized.slice(0, -1);
    }

    return normalized;
  };

  const currentPath = normalizePath(window.location.pathname);

  const matchesPath = (prefixes) =>
    prefixes.some((prefix) => {
      const normalizedPrefix = normalizePath(prefix);

      if (normalizedPrefix === '/') {
        return currentPath === '/';
      }

      return currentPath === normalizedPrefix || currentPath.startsWith(`${normalizedPrefix}/`);
    });

  fetch('/assets/partials/site-header.html')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load site header (${response.status})`);
      }

      return response.text();
    })
    .then((markup) => {
      host.classList.add('site-header');
      host.innerHTML = markup;

      const subtitleEl = host.querySelector('[data-nav-subtitle]');
      if (subtitleEl) {
        if (subtitle) {
          subtitleEl.textContent = subtitle;
        } else {
          subtitleEl.remove();
        }
      }

      host.querySelectorAll('.nav-menu a[href]').forEach((link) => {
        const href = link.getAttribute('href');
        if (!href || !href.startsWith('/')) return;

        const target = normalizePath(href);
        if (target === currentPath) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        }
      });

      const activeSection = forcedSection || sectionOrder.find((section) => matchesPath(section.prefixes))?.key;
      if (activeSection) {
        host.querySelectorAll('[data-nav-section]').forEach((link) => {
          if (link.getAttribute('data-nav-section') !== activeSection) return;

          link.classList.add('active');

          if (normalizePath(link.getAttribute('href')) === currentPath) {
            link.setAttribute('aria-current', 'page');
          }
        });
      }

      const navToggle = host.querySelector('.nav-toggle');
      const navToggleIcon = navToggle?.querySelector('i');
      const navToggleLabel = navToggle?.querySelector('.visually-hidden');
      const navLinks = host.querySelector('.nav-links');
      const navGroups = [...host.querySelectorAll('.nav-group')];
      const groupToggles = [...host.querySelectorAll('.nav-group-toggle')];

      const syncToggleButton = (button, expanded) => {
        const label = button.getAttribute('aria-label') || '';
        const openLabel = label.replace(/^Collapse/, 'Expand');
        const closeLabel = label.replace(/^Expand/, 'Collapse');

        button.setAttribute('aria-expanded', String(expanded));
        button.setAttribute('aria-label', expanded ? closeLabel : openLabel);
      };

      const closeMobileSections = () => {
        navGroups.forEach((group) => {
          group.dataset.mobileOpen = 'false';
        });

        groupToggles.forEach((button) => {
          syncToggleButton(button, false);
        });
      };

      const setMobileOpen = (expanded) => {
        if (!navToggle || !navLinks) return;

        navLinks.dataset.open = String(expanded);
        navToggle.setAttribute('aria-expanded', String(expanded));

        if (navToggleIcon) {
          navToggleIcon.className = expanded ? 'ph-bold ph-x' : 'ph-bold ph-list';
        }

        if (navToggleLabel) {
          navToggleLabel.textContent = expanded ? 'Close menu' : 'Open menu';
        }

        if (!expanded) {
          closeMobileSections();
        }
      };

      navToggle?.addEventListener('click', () => {
        setMobileOpen(navLinks?.dataset.open !== 'true');
      });

      groupToggles.forEach((button) => {
        button.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();

          const group = button.closest('.nav-group');
          if (!group) return;

          const isOpen = group.dataset.mobileOpen === 'true';

          closeMobileSections();

          if (!isOpen) {
            group.dataset.mobileOpen = 'true';
            syncToggleButton(button, true);
          }
        });
      });

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          setMobileOpen(false);
        }
      });

      document.addEventListener('click', (event) => {
        if (host.contains(event.target)) return;
        setMobileOpen(false);
      });

      const mediaQuery = window.matchMedia('(min-width: 961px)');
      const handleViewportChange = (event) => {
        if (event.matches) {
          setMobileOpen(false);
        }
      };

      handleViewportChange(mediaQuery);
      mediaQuery.addEventListener('change', handleViewportChange);
    })
    .catch((error) => {
      console.error(error);
    });
})();
