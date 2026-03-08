(function () {
  var params = new URLSearchParams(window.location.search);
  var path = params.get('path');
  var title = params.get('title') || 'Document Viewer';

  var titleEl = document.querySelector('[data-title]');
  var contentEl = document.querySelector('[data-content]');
  var downloadEl = document.querySelector('[data-download]');
  var errorEl = document.querySelector('[data-error]');

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
    var pre = document.createElement('pre');
    pre.textContent = text;
    contentEl.appendChild(pre);
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function highlightCode(code, lang) {
    if (!window.hljs) return null;
    if (lang && window.hljs.getLanguage(lang)) {
      try {
        return window.hljs.highlight(code, { language: lang }).value;
      } catch (_) {
        /* fall through */
      }
    }
    try {
      return window.hljs.highlightAuto(code).value;
    } catch (_) {
      /* fall through */
    }
    return null;
  }

  function sanitizeUrl(rawHref, allowedProtocols) {
    if (typeof rawHref !== 'string' || rawHref.trim() === '') {
      return '';
    }
    var href = rawHref.trim();
    if (href.startsWith('#')) {
      return href;
    }
    try {
      var parsed = new URL(href, window.location.origin);
      return allowedProtocols.has(parsed.protocol) ? parsed.href : '';
    } catch (error) {
      return '';
    }
  }

  function isSafeRelativePath(rawPath) {
    if (typeof rawPath !== 'string') {
      return false;
    }

    var value = rawPath.trim();
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

  function normalizeRelativeDocumentPath(basePath, rawHref) {
    if (typeof rawHref !== 'string') {
      return '';
    }

    var value = rawHref.trim();
    if (!value || value.startsWith('#') || value.startsWith('?') || value.includes('\\')) {
      return '';
    }

    var hrefPath = value.split('#', 1)[0].split('?', 1)[0];
    if (!hrefPath) {
      return '';
    }

    const basePathSegments = basePath.split('/');
    const projectRoot = basePathSegments.length >= 2 && basePathSegments[0] === 'projects'
      ? `${basePathSegments[0]}/${basePathSegments[1]}`
      : '';
    if (!projectRoot) {
      return '';
    }

    const baseSegments = basePath.split('/');
    baseSegments.pop();

    const combinedSegments = [...baseSegments, ...hrefPath.split('/')];
    const normalized = [];

    for (const segment of combinedSegments) {
      if (!segment || segment === '.') {
        continue;
      }
      if (segment === '..') {
        if (normalized.length === 0) {
          return '';
        }
        normalized.pop();
        continue;
      }
      if (!/^[A-Za-z0-9._-]+$/.test(segment)) {
        return '';
      }
      normalized.push(segment);
    }

    const resolvedPath = normalized.join('/');
    return resolvedPath === projectRoot || resolvedPath.startsWith(`${projectRoot}/`) ? resolvedPath : '';
  }

  function buildViewerHref(documentPath, rawTitle) {
    var viewerTitle =
      typeof rawTitle === 'string' && rawTitle.trim()
        ? rawTitle.trim()
        : documentPath.split('/').pop() || 'Document Viewer';
    return (
      '/viewer.html?path=' +
      encodeURIComponent(documentPath) +
      '&title=' +
      encodeURIComponent(viewerTitle)
    );
  }

  var BARE_URL_RE = /https?:\/\/[^\s<>)}\]"']+/g;

  function linkifyCodeUrls(container) {
    container.querySelectorAll('code').forEach(function (el) {
      if (el.closest('pre') || el.closest('a')) return;
      var text = el.textContent.trim();
      if (/^https?:\/\/\S+$/.test(text)) {
        var a = document.createElement('a');
        a.href = text;
        a.rel = 'noopener noreferrer';
        el.parentNode.insertBefore(a, el);
        a.appendChild(el);
      }
    });
  }

  function linkifyTextUrls(container) {
    var walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
    var textNodes = [];
    var node;
    while ((node = walker.nextNode())) {
      if (node.parentElement && (node.parentElement.closest('a') || node.parentElement.closest('pre') || node.parentElement.closest('code'))) {
        continue;
      }
      BARE_URL_RE.lastIndex = 0;
      if (BARE_URL_RE.test(node.textContent)) {
        textNodes.push(node);
      }
    }

    textNodes.forEach(function (textNode) {
      var frag = document.createDocumentFragment();
      var text = textNode.textContent;
      var lastIndex = 0;
      var match;
      BARE_URL_RE.lastIndex = 0;
      while ((match = BARE_URL_RE.exec(text)) !== null) {
        if (match.index > lastIndex) {
          frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
        }
        var url = match[0].replace(/[.,;:!?)]+$/, '');
        var trailing = match[0].slice(url.length);
        var a = document.createElement('a');
        a.href = url;
        a.textContent = url;
        a.rel = 'noopener noreferrer';
        frag.appendChild(a);
        if (trailing) {
          frag.appendChild(document.createTextNode(trailing));
        }
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < text.length) {
        frag.appendChild(document.createTextNode(text.slice(lastIndex)));
      }
      textNode.parentNode.replaceChild(frag, textNode);
    });
  }

  if (window.marked) {
    window.marked.use({
      gfm: true,
      renderer: {
        html: function () {
          return '';
        },
        code: function (token) {
          var code = typeof token === 'string' ? token : token.text || '';
          var lang = typeof token === 'string' ? arguments[1] : token.lang || '';
          if (lang === 'mermaid') {
            return '<div class="mermaid">' + escapeHtml(code) + '</div>\n';
          }
          var highlighted = highlightCode(code, lang);
          if (highlighted !== null) {
            var cls = lang ? 'hljs language-' + lang : 'hljs';
            return '<pre><code class="' + cls + '">' + highlighted + '</code></pre>\n';
          }
          return '<pre><code>' + escapeHtml(code) + '</code></pre>\n';
        },
      },
    });
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
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Failed to load ' + path);
      }
      return response.text();
    })
    .then(function (text) {
      var isMarkdown = path.endsWith('.md');
      var isJson = path.endsWith('.json');

      if (!contentEl) {
        return;
      }

      if (isMarkdown && window.marked) {
        var rendered = window.marked.parse(text);
        var container = document.createElement('div');
        container.innerHTML = rendered;

        container.querySelectorAll('a[href]').forEach(function (link) {
          var rawHref = link.getAttribute('href');
          var relativeDocumentPath = normalizeRelativeDocumentPath(path, rawHref);
          if (relativeDocumentPath) {
            link.setAttribute('href', buildViewerHref(relativeDocumentPath, link.textContent || 'Document Viewer'));
            link.removeAttribute('rel');
            return;
          }

          var safeHref = sanitizeUrl(rawHref, new Set(['http:', 'https:', 'mailto:']));
          if (!safeHref) {
            var textNode = document.createTextNode(link.textContent || '');
            link.replaceWith(textNode);
            return;
          }
          link.setAttribute('href', safeHref);
          link.setAttribute('rel', 'noopener noreferrer');
        });

        container.querySelectorAll('img[src]').forEach(function (image) {
          var safeSrc = sanitizeUrl(image.getAttribute('src'), new Set(['http:', 'https:']));
          if (!safeSrc) {
            image.remove();
            return;
          }
          image.setAttribute('src', safeSrc);
          image.setAttribute('loading', 'lazy');
        });

        linkifyCodeUrls(container);
        linkifyTextUrls(container);

        contentEl.textContent = '';
        contentEl.appendChild(container);

        if (window.mermaid && container.querySelectorAll('.mermaid').length) {
          window.mermaid.run({ nodes: container.querySelectorAll('.mermaid') }).catch(function (err) {
            console.warn('Mermaid render failed:', err);
          });
        }
        return;
      }

      if (isJson) {
        try {
          var parsed = JSON.parse(text);
          renderPre(JSON.stringify(parsed, null, 2));
          return;
        } catch (error) {
          renderPre(text);
          return;
        }
      }

      renderPre(text);
    })
    .catch(function (error) {
      setError(error.message);
    });
})();
