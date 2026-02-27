(function () {
  const params = new URLSearchParams(window.location.search);
  const path = params.get('path');
  const title = params.get('title') || 'Document Viewer';

  const titleEl = document.querySelector('[data-title]');
  const contentEl = document.querySelector('[data-content]');
  const downloadEl = document.querySelector('[data-download]');
  const errorEl = document.querySelector('[data-error]');

  function setError(message) {
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.hidden = false;
    }
    if (contentEl) {
      contentEl.textContent = '';
    }
  }

  function renderPre(text) {
    if (!contentEl) return;
    contentEl.textContent = '';
    const pre = document.createElement('pre');
    pre.textContent = text;
    contentEl.appendChild(pre);
  }

  function sanitizeUrl(rawHref, allowedProtocols) {
    if (typeof rawHref !== 'string' || rawHref.trim() === '') {
      return '';
    }
    const href = rawHref.trim();
    if (href.startsWith('#')) {
      return href;
    }
    try {
      const parsed = new URL(href, window.location.origin);
      return allowedProtocols.has(parsed.protocol) ? parsed.href : '';
    } catch (error) {
      return '';
    }
  }

  function isSafeRelativePath(rawPath) {
    if (typeof rawPath !== 'string') {
      return false;
    }

    const value = rawPath.trim();
    if (!value) {
      return false;
    }

    if (
      value.includes('..') ||
      value.includes('\\') ||
      value.includes(':') ||
      value.startsWith('/') ||
      value.startsWith('#') ||
      value.startsWith('?')
    ) {
      return false;
    }

    return /^[A-Za-z0-9._/-]+$/.test(value);
  }

  if (!path) {
    setError('No file selected. Use the navigation links to open a document.');
    return;
  }

  if (!isSafeRelativePath(path)) {
    setError('Invalid document path.');
    return;
  }

  if (titleEl) {
    titleEl.textContent = title;
  }

  if (downloadEl) {
    downloadEl.href = path;
  }

  fetch(path)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load ${path}`);
      }
      return response.text();
    })
    .then((text) => {
      const isMarkdown = path.endsWith('.md');
      const isJson = path.endsWith('.json');

      if (!contentEl) {
        return;
      }

      if (isMarkdown && window.marked) {
        const renderer = new window.marked.Renderer();
        renderer.html = () => '';
        const rendered = window.marked.parse(text, { renderer });
        const container = document.createElement('div');
        container.innerHTML = rendered;

        container.querySelectorAll('a[href]').forEach((link) => {
          const safeHref = sanitizeUrl(link.getAttribute('href'), new Set(['http:', 'https:', 'mailto:']));
          if (!safeHref) {
            const textNode = document.createTextNode(link.textContent || '');
            link.replaceWith(textNode);
            return;
          }
          link.setAttribute('href', safeHref);
          link.setAttribute('rel', 'noopener noreferrer');
        });

        container.querySelectorAll('img[src]').forEach((image) => {
          const safeSrc = sanitizeUrl(image.getAttribute('src'), new Set(['http:', 'https:']));
          if (!safeSrc) {
            image.remove();
            return;
          }
          image.setAttribute('src', safeSrc);
          image.setAttribute('loading', 'lazy');
        });

        contentEl.textContent = '';
        contentEl.appendChild(container);
        return;
      }

      if (isJson) {
        try {
          const parsed = JSON.parse(text);
          renderPre(JSON.stringify(parsed, null, 2));
          return;
        } catch (error) {
          renderPre(text);
          return;
        }
      }

      renderPre(text);
    })
    .catch((error) => {
      setError(error.message);
    });
})();
