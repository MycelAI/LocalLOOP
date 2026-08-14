(function () {
  const NAME = 'interest';
  const features = window.LOCALLOOP_FEATURES = window.LOCALLOOP_FEATURES || {};
  const featureToken = document.currentScript?.dataset.localLoopFeatureToken || null;
  const featureTokens = window.__LOCALLOOP_FEATURE_TOKENS = window.__LOCALLOOP_FEATURE_TOKENS || {};
  if (featureTokens[NAME] !== featureToken) return;
  let activeCleanup = () => {};
  const demoEntries = [{ name: 'Lucia Torres', organization: 'GreenLoop Collective', role: 'Partnerships', country: 'ES', city: 'Valencia', website: 'https://example.org/greenloop', message: 'Exploring circularity research for civic materials.', is_demo: true, created_at: '2025-12-12T09:00:00Z' }, { name: 'Jonas Becker', organization: 'CircularFoundry', role: 'Innovation Director', country: 'DE', city: 'Hamburg', website: 'https://example.org/circularfoundry', message: 'Interested in inter-city material exchange research.', is_demo: true, created_at: '2025-12-14T12:00:00Z' }];

  features[NAME] = {
    __localLoopToken: featureToken,
    init() {
      activeCleanup();
      const form = document.querySelector('[data-interest-form]');
      const listEl = document.querySelector('[data-interest-list]');
      const statusEl = document.querySelector('[data-interest-status]');
      const apiStatusEl = document.querySelector('[data-api-status]');
      if (!form && !listEl && !apiStatusEl) return;
      const config = window.LOCALLOOP_CONFIG || {};
      const apiBase = config.apiBase || 'https://loop-api.urbnia.com';
      const controller = new AbortController();
      const REQUEST_TIMEOUT_MS = 10000;
      const withTimeout = () => AbortSignal.any([controller.signal, AbortSignal.timeout(REQUEST_TIMEOUT_MS)]);
      const listeners = [];
      let stream = null; let retryTimer = null; let disposed = false;
      const on = (node, event, listener) => { node?.addEventListener(event, listener); if (node) listeners.push(() => node.removeEventListener(event, listener)); };
      const esc = (value) => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
      const format_iso = (value) => {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '';
        return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
      };
      const setStatus = (message, error) => {
        if (!statusEl || disposed) return;
        statusEl.textContent = message;
        statusEl.classList.remove('notice-success', 'notice-error');
        if (error === true) statusEl.classList.add('notice-error');
        else if (error === false) statusEl.classList.add('notice-success');
      };
      const renderEntries = (entries, notice = '') => {
        if (!listEl || disposed) return;
        listEl.innerHTML = `${notice ? `<div class="notice">${notice}</div>` : ''}${entries.map((entry) => {
          const location = [entry.city, entry.country].filter(Boolean).map(esc).join(', ');
          const details = [
            location,
            entry.created_at ? esc(format_iso(entry.created_at)) : '',
            entry.website ? `Website: ${esc(entry.website)}` : '',
            entry.email ? `Email: ${esc(entry.email)}` : '',
          ].filter(Boolean).join(' • ');
          return `<div class="interest-card"><h4>${esc(entry.name || 'Anonymous')}${entry.is_demo ? '<span class="chip chip--warm chip--mono">DEMO</span>' : ''}${entry.organization ? ` • ${esc(entry.organization)}` : ''}${entry.role ? ` (${esc(entry.role)})` : ''}</h4>${details ? `<p>${details}</p>` : ''}${entry.message ? `<p>${esc(entry.message)}</p>` : ''}</div>`;
        }).join('')}`;
      };
      const loadList = () => fetch(`${apiBase}/api/interest`, { signal: withTimeout() }).then((response) => response.ok ? response.json() : Promise.reject(new Error('interest'))).then((data) => renderEntries(data.results?.length ? data.results : [], data.results?.length ? '' : 'No public expressions of interest yet.')).catch((error) => { if (error.name !== 'AbortError') renderEntries(demoEntries, 'Public list unavailable — showing demo entries.'); });
      const updateStatus = () => { if (!apiStatusEl) return; apiStatusEl.textContent = 'Checking backend status…'; fetch(`${apiBase}/api/metrics`, { signal: withTimeout() }).then((response) => response.ok ? response.json() : Promise.reject(new Error('status'))).then((data) => { if (!disposed) apiStatusEl.textContent = `Backend online${data?.uptimeSeconds ? ` · uptime ${Math.round(data.uptimeSeconds / 60)}m` : ''} · ${apiBase}`; }).catch((error) => { if (!disposed && error.name !== 'AbortError') apiStatusEl.textContent = 'Backend unavailable — showing demo data from this page.'; }); };
      const disconnect = () => { stream?.close(); stream = null; if (retryTimer) clearTimeout(retryTimer); retryTimer = null; };
      const connect = () => { if (disposed || !listEl || !('EventSource' in window) || stream) return; stream = new EventSource(`${apiBase}/api/interest/stream`); stream.onmessage = loadList; stream.onerror = () => { stream?.close(); stream = null; if (!disposed && !retryTimer) retryTimer = setTimeout(() => { retryTimer = null; connect(); }, 5000); }; };
      if (form) on(form, 'submit', async (event) => {
        event.preventDefault();
        const button = form.querySelector('button[type="submit"]');
        const idle_label = button?.textContent?.trim() || 'Submit interest';
        if (button) {
          button.disabled = true;
          button.classList.add('is-busy');
          button.setAttribute('aria-busy', 'true');
          button.textContent = 'Submitting…';
        }
        setStatus('Submitting...', null);
        const data = new FormData(form);
        const payload = {};
        for (const key of ['name', 'organization', 'role', 'country', 'city', 'website', 'email', 'message', 'honey']) {
          const value = data.get(key)?.toString().trim();
          if (value) payload[key] = value;
        }
        payload.shareEmail = data.get('shareEmail') === 'on';
        payload.consentPublic = data.get('consentPublic') === 'on';
        try {
          const response = await fetch(`${apiBase}/api/interest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: withTimeout(),
          });
          if (!response.ok) throw new Error('submit');
          form.reset();
          setStatus('Submission received. Public-list visibility depends on consent and service processing.', false);
          loadList();
        } catch (error) {
          if (error.name !== 'AbortError') setStatus('We could not submit your interest. Please try again later.', true);
        } finally {
          if (!disposed && button) {
            button.disabled = false;
            button.classList.remove('is-busy');
            button.removeAttribute('aria-busy');
            button.textContent = idle_label;
          }
        }
      });
      updateStatus(); if (listEl) { loadList(); connect(); }
      activeCleanup = () => { disposed = true; controller.abort(); disconnect(); listeners.splice(0).forEach((remove) => remove()); activeCleanup = () => {}; };
    },
    cleanup() { activeCleanup(); },
  };
})();
