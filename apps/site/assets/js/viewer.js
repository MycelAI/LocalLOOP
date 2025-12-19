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
      contentEl.innerHTML = '';
    }
  }

  if (!path) {
    setError('No file selected. Use the navigation links to open a document.');
    return;
  }

  if (path.includes('..') || path.startsWith('http') || path.startsWith('//') || path.startsWith('/')) {
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
        contentEl.innerHTML = window.marked.parse(text);
        return;
      }

      if (isJson) {
        try {
          const parsed = JSON.parse(text);
          contentEl.innerHTML = `<pre>${JSON.stringify(parsed, null, 2)}</pre>`;
          return;
        } catch (error) {
          contentEl.innerHTML = `<pre>${text}</pre>`;
          return;
        }
      }

      contentEl.innerHTML = `<pre>${text}</pre>`;
    })
    .catch((error) => {
      setError(error.message);
    });
})();
