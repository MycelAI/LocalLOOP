(function () {
  const NAME = 'demo-city';
  const features = window.LOCALLOOP_FEATURES = window.LOCALLOOP_FEATURES || {};
  const featureToken = document.currentScript?.dataset.localLoopFeatureToken || null;
  const featureTokens = window.__LOCALLOOP_FEATURE_TOKENS = window.__LOCALLOOP_FEATURE_TOKENS || {};
  if (featureTokens[NAME] !== featureToken) return;
  let activeCleanup = () => {};

  features[NAME] = {
    __localLoopToken: featureToken,
    init() {
      activeCleanup();
      const root = document.querySelector('[data-demo-city]');
      if (!root) return;
      root.removeAttribute('data-demo-ready');
      const config = window.LOCALLOOP_CONFIG || {};
      const apiBase = config.apiBase || 'https://loop-api.urbnia.com';
      const controller = new AbortController();
      const listeners = [];
      let refreshTimer = null;
      let stream = null;
      let disposed = false;
      let currentFilter = 'all';
      const heartbeatEl = root.querySelector('[data-demo-heartbeat]');
      const statsEl = root.querySelector('[data-demo-stats]');
      const materialsEl = root.querySelector('[data-demo-materials]');
      const offersEl = root.querySelector('[data-demo-offers]');
      const matchesEl = root.querySelector('[data-demo-matches]');
      const transfersEl = root.querySelector('[data-demo-transfers]');
      const streamEl = root.querySelector('[data-demo-stream]');
      const filterBtns = [...root.querySelectorAll('[data-demo-filter]')];
      const tabBtns = [...root.querySelectorAll('[data-demo-tab]')];
      const on = (node, event, listener) => { node.addEventListener(event, listener); listeners.push(() => node.removeEventListener(event, listener)); };
      const esc = (value) => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
      const request = (path) => fetch(`${apiBase}${path}`, { signal: controller.signal });
      const notice = (element, message) => { if (!disposed && element) element.innerHTML = `<div class="notice">${message}</div>`; };
      const fmtDate = (iso) => { try { return iso ? new Date(iso).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' }) : '—'; } catch { return esc(iso); } };
      const statusBadge = (status) => `<span class="demo-status demo-status-${['open', 'proposed', 'accepted', 'completed', 'scheduled', 'cancelled', 'rejected'].includes(status) ? status : 'unknown'}">${esc(status || 'unknown')}</span>`;
      const rows = (data, type) => {
        if (type === 'materials') return data.slice(0, 25).map((item) => `<tr><td class="demo-id">${esc(item.id)}</td><td>${esc((item.category || '—').replace(/-/g, ' '))}</td><td>${esc(item.quantity_value)} <span class="demo-unit">${esc(item.quantity_unit)}</span></td><td>${esc(item.origin_city || '—')}</td><td>${fmtDate(item.created_at)}</td></tr>`).join('');
        if (type === 'offers') return data.slice(0, 15).map((item) => `<tr><td class="demo-id">${esc(item.id)}</td><td class="demo-id">${esc(item.material_id || '—')}</td><td>${esc(item.from_city || '—')} &rarr; ${esc(item.to_city || '—')}</td><td>${esc(item.quantity_value || '—')} <span class="demo-unit">${esc(item.quantity_unit)}</span></td><td>${statusBadge(item.status)}</td><td>${fmtDate(item.available_until)}</td></tr>`).join('');
        if (type === 'matches') return data.slice(0, 15).map((item) => `<tr><td class="demo-id">${esc(item.id)}</td><td class="demo-id">${esc(item.material_id || '—')}</td><td>${esc(item.from_city || '—')} &rarr; ${esc(item.to_city || '—')}</td><td>${statusBadge(item.status)}</td><td>${fmtDate(item.matched_at)}</td></tr>`).join('');
        return data.slice(0, 15).map((item) => `<tr><td class="demo-id">${esc(item.id)}</td><td class="demo-id">${esc(item.material_id || '—')}</td><td>${statusBadge(item.status)}</td><td>${fmtDate(item.handoff_at)}</td><td>${fmtDate(item.received_at)}</td></tr>`).join('');
      };
      const loadHeartbeat = async () => {
        try {
          const data = await request('/health').then((response) => response.ok ? response.json() : Promise.reject(new Error('health')));
          if (disposed || !heartbeatEl) return;
          if (data.status !== 'ok' || data.db !== 'ok') throw new Error('degraded');
          heartbeatEl.innerHTML = `<span class="demo-status-dot demo-status-dot-live"></span>Node online &nbsp;·&nbsp; DB: ${esc(data.db)} &nbsp;·&nbsp; Uptime: ${Math.round(Number(data.uptime) / 3600)}h`;
          heartbeatEl.className = 'demo-heartbeat demo-heartbeat-live';
        } catch (error) {
          if (!disposed && error.name !== 'AbortError' && heartbeatEl) { heartbeatEl.innerHTML = '<span class="demo-status-dot demo-status-dot-offline"></span> Backend unreachable'; heartbeatEl.className = 'demo-heartbeat demo-heartbeat-offline'; }
        }
      };
      const loadStats = async () => {
        try {
          const counts = await Promise.all(['/api/v1/material', '/api/v1/offer', '/api/v1/match', '/api/v1/transfer'].map((path) => request(path).then((response) => response.ok ? response.json() : []).then((data) => Array.isArray(data) ? data.length : 0)));
          if (!disposed && statsEl) statsEl.innerHTML = counts.map((count, index) => `<div class="demo-stat-card"><span class="demo-stat-value">${count}</span><span class="demo-stat-label">${['Materials', 'Offers', 'Matches', 'Transfers'][index]}</span></div>`).join('');
        } catch (error) { if (error.name !== 'AbortError') notice(statsEl, 'Stats unavailable.'); }
      };
      const loadCollection = async (type, path, element, headings) => {
        try {
          const data = await request(path).then((response) => response.ok ? response.json() : Promise.reject(new Error(type)));
          if (disposed || !element) return;
          const filtered = type === 'materials' && currentFilter !== 'all' ? data.filter((item) => ((item.origin_city || item.current_city || '').toLowerCase()).includes(currentFilter === 'demo' ? 'demo' : currentFilter)) : data;
          if (!filtered.length) return notice(element, `No ${type} available.`);
          element.innerHTML = `<div class="demo-table-wrap"><table class="demo-table"><thead><tr>${headings.map((heading) => `<th>${heading}</th>`).join('')}</tr></thead><tbody>${rows(filtered, type)}</tbody></table></div>`;
        } catch (error) { if (error.name !== 'AbortError') notice(element, `${type[0].toUpperCase()}${type.slice(1)} unavailable.`); }
      };
      const loadMaterials = () => loadCollection('materials', '/api/v1/material', materialsEl, ['Material ID', 'Category', 'Quantity', 'City', 'Registered']);
      const loadOffers = () => loadCollection('offers', '/api/v1/offer', offersEl, ['Offer ID', 'Material', 'Route', 'Quantity', 'Status', 'Until']);
      const loadMatches = () => loadCollection('matches', '/api/v1/match', matchesEl, ['Match ID', 'Material', 'Route', 'Status', 'Matched At']);
      const loadTransfers = () => loadCollection('transfers', '/api/v1/transfer', transfersEl, ['Transfer ID', 'Material', 'Status', 'Handoff', 'Received']);
      const appendEntry = (data) => {
        if (disposed || !streamEl) return;
        streamEl.querySelector('.demo-stream-idle')?.remove();
        const entry = document.createElement('div'); entry.className = 'demo-stream-entry';
        entry.innerHTML = `<span class="demo-stream-time">${new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span><span class="demo-stream-event">${esc(data.event || 'event')}</span>${data.entity_id ? `<span class="demo-stream-id">${esc(data.entity_id)}</span>` : ''}`;
        streamEl.insertBefore(entry, streamEl.firstChild);
        const entries = streamEl.querySelectorAll('.demo-stream-entry'); if (entries.length > 60) entries[entries.length - 1].remove();
      };
      const connectStream = () => {
        if (!streamEl || !('EventSource' in window)) return;
        stream = new EventSource(`${apiBase}/api/v1/stream`);
        ['material.created', 'offer.created', 'match.created', 'transfer.created', 'material.status_updated'].forEach((eventName) => stream.addEventListener(eventName, (event) => { try { const data = JSON.parse(event.data); appendEntry({ event: eventName, entity_id: data.entity_id || data.id }); } catch {} }));
        stream.onmessage = (event) => { try { const data = JSON.parse(event.data); if (data.type || data.event_type) appendEntry({ event: data.type || data.event_type, entity_id: data.entity_id || data.id }); } catch {} };
        stream.onerror = () => { streamEl.querySelector('.demo-stream-dot')?.classList.replace('demo-stream-dot-live', 'demo-stream-dot-offline'); };
      };
      const activateTab = (target, focus) => {
        const index = tabBtns.findIndex((button) => button.dataset.demoTab === target); if (index < 0) return;
        tabBtns.forEach((button, buttonIndex) => { const selected = index === buttonIndex; button.classList.toggle('active', selected); button.setAttribute('aria-selected', String(selected)); button.tabIndex = selected ? 0 : -1; });
        root.querySelectorAll('[data-panel]').forEach((panel) => { panel.hidden = panel.dataset.panel !== target; });
        if (focus) tabBtns[index].focus();
      };
      tabBtns.forEach((button, index) => on(button, 'click', () => activateTab(button.dataset.demoTab)));
      tabBtns.forEach((button, index) => on(button, 'keydown', (event) => { const delta = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : ['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 0; if (delta) { event.preventDefault(); activateTab(tabBtns[(index + delta + tabBtns.length) % tabBtns.length].dataset.demoTab, true); } else if (event.key === 'Home') { event.preventDefault(); activateTab(tabBtns[0].dataset.demoTab, true); } else if (event.key === 'End') { event.preventDefault(); activateTab(tabBtns.at(-1).dataset.demoTab, true); } }));
      filterBtns.forEach((button) => on(button, 'click', () => { currentFilter = button.dataset.demoFilter; filterBtns.forEach((item) => { const selected = item === button; item.classList.toggle('active', selected); item.setAttribute('aria-pressed', String(selected)); }); loadMaterials(); }));
      loadHeartbeat(); loadStats(); loadMaterials(); loadOffers(); loadMatches(); loadTransfers(); connectStream(); if (tabBtns[0]) activateTab(tabBtns[0].dataset.demoTab);
      refreshTimer = setInterval(() => { loadHeartbeat(); loadStats(); loadMaterials(); }, 30000);
      root.dataset.demoReady = 'true';
      activeCleanup = () => { disposed = true; root.removeAttribute('data-demo-ready'); controller.abort(); if (refreshTimer) clearInterval(refreshTimer); stream?.close(); listeners.splice(0).forEach((remove) => remove()); activeCleanup = () => {}; };
    },
    cleanup() { activeCleanup(); },
  };
})();
