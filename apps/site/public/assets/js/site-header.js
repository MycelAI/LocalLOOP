(function () {
  const host = document.querySelector('[data-site-header]');
  if (!host) return;

  const subtitle = host.dataset.siteSubtitle || '';
  const sectionMap = {
    platform: ['/', '/materialDNA', '/cities', '/DEMO-City'],
    protocol: ['/protocol'],
    library: ['/library'],
    governance: ['/governance'],
    docs: ['/docs'],
    engage: ['/interest', '/projects', '/contribute'],
  };

  const normalizePath = (value) => {
    if (!value) return '/';
    if (value !== '/' && value.endsWith('/')) {
      return value.slice(0, -1);
    }
    return value;
  };

  const currentPath = normalizePath(window.location.pathname);

  const matchesPath = (prefixes) =>
    prefixes.some((prefix) => {
      if (prefix === '/') {
        return currentPath === '/';
      }
      return currentPath === prefix || currentPath.startsWith(`${prefix}/`);
    });

  fetch('/assets/partials/site-header.html')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load site header (${response.status})`);
      }
      return response.text();
    })
    .then((markup) => {
      host.innerHTML = markup;
      const subtitleEl = host.querySelector('[data-nav-subtitle]');
      if (subtitleEl) {
        if (subtitle) {
          subtitleEl.textContent = subtitle;
        } else {
          subtitleEl.remove();
        }
      }

      host.querySelectorAll('a[href]').forEach((link) => {
        const href = link.getAttribute('href');
        if (!href || !href.startsWith('/')) return;
        const target = normalizePath(href);
        if (target === currentPath) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        }
      });

      host.querySelectorAll('[data-nav-section]').forEach((trigger) => {
        const section = trigger.getAttribute('data-nav-section');
        if (!section) return;
        const prefixes = sectionMap[section];
        if (prefixes && matchesPath(prefixes)) {
          trigger.classList.add('active');
        }
      });
    })
    .catch((error) => {
      console.error(error);
    });
})();
