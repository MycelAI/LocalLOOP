(function () {
  if (!document.querySelector('[data-demo-city]')) return;

  const config = window.LOCALLOOP_CONFIG || {};
  const apiBase = config.apiBase || 'https://loop-api.urbnia.com';

  const heartbeatEl = document.querySelector('[data-demo-heartbeat]');
  const statsEl = document.querySelector('[data-demo-stats]');
  const materialsEl = document.querySelector('[data-demo-materials]');
  const offersEl = document.querySelector('[data-demo-offers]');
  const matchesEl = document.querySelector('[data-demo-matches]');
  const transfersEl = document.querySelector('[data-demo-transfers]');
  const streamEl = document.querySelector('[data-demo-stream]');
  const registerFormEl = document.querySelector('[data-demo-register]');
  const registerStatusEl = document.querySelector('[data-demo-register-status]');
  const filterBtns = document.querySelectorAll('[data-demo-filter]');
  const tabBtns = document.querySelectorAll('[data-demo-tab]');

  function esc(v) {
    if (v === null || v === undefined) return '';
    return String(v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function fmtCat(cat) {
    if (!cat) return '—';
    return cat.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  function fmtDate(iso) {
    if (!iso) return '—';
    try { return new Date(iso).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' }); }
    catch { return esc(iso); }
  }

  function statusBadge(s) {
    const safe = esc(s || 'unknown');
    const cls = ['open','proposed','accepted','completed','scheduled','cancelled','rejected'].includes(s)
      ? s : 'unknown';
    return `<span class="demo-status demo-status-${cls}">${safe}</span>`;
  }

  function randomHex(n) {
    const c = '0123456789ABCDEF';
    let r = '';
    for (let i = 0; i < n; i++) r += c[Math.floor(Math.random() * 16)];
    return r;
  }

  // ── Heartbeat ─────────────────────────────────────────────────────────────
  async function loadHeartbeat() {
    if (!heartbeatEl) return;
    try {
      const r = await fetch(`${apiBase}/health`, { signal: AbortSignal.timeout(5000) });
      const d = await r.json();
      if (d.status === 'ok' && d.db === 'ok') {
        const upH = Math.round(Number(d.uptime) / 3600);
        heartbeatEl.innerHTML =
          `<span class="demo-status-dot demo-status-dot-live"></span>` +
          `Node online &nbsp;·&nbsp; DB: ${esc(d.db)} &nbsp;·&nbsp; Uptime: ${upH}h`;
        heartbeatEl.className = 'demo-heartbeat demo-heartbeat-live';
      } else throw new Error('degraded');
    } catch {
      heartbeatEl.innerHTML =
        `<span class="demo-status-dot demo-status-dot-offline"></span> Backend unreachable`;
      heartbeatEl.className = 'demo-heartbeat demo-heartbeat-offline';
    }
  }

  // ── Stats ──────────────────────────────────────────────────────────────────
  async function loadStats() {
    if (!statsEl) return;
    try {
      const [mats, offers, matches, transfers] = await Promise.all([
        fetch(`${apiBase}/api/v1/material`).then(r => r.ok ? r.json() : []).then(d => Array.isArray(d) ? d.length : 0),
        fetch(`${apiBase}/api/v1/offer`).then(r => r.ok ? r.json() : []).then(d => Array.isArray(d) ? d.length : 0),
        fetch(`${apiBase}/api/v1/match`).then(r => r.ok ? r.json() : []).then(d => Array.isArray(d) ? d.length : 0),
        fetch(`${apiBase}/api/v1/transfer`).then(r => r.ok ? r.json() : []).then(d => Array.isArray(d) ? d.length : 0),
      ]);
      statsEl.innerHTML =
        statCard(mats, 'Materials') +
        statCard(offers, 'Offers') +
        statCard(matches, 'Matches') +
        statCard(transfers, 'Transfers');
    } catch {
      statsEl.innerHTML = '<div class="notice">Stats unavailable.</div>';
    }
  }

  function statCard(val, label) {
    return `<div class="demo-stat-card">
      <span class="demo-stat-value">${esc(String(val))}</span>
      <span class="demo-stat-label">${esc(label)}</span>
    </div>`;
  }

  // ── Materials ──────────────────────────────────────────────────────────────
  let currentFilter = 'all';

  async function loadMaterials(filter) {
    if (!materialsEl) return;
    if (filter !== undefined) currentFilter = filter;
    materialsEl.innerHTML = '<div class="notice">Loading material registry…</div>';
    try {
      const data = await fetch(`${apiBase}/api/v1/material`).then(r => r.json());
      const filtered = currentFilter === 'all'
        ? data
        : data.filter(m => {
            const city = (m.origin_city || m.current_city || '').toLowerCase();
            return currentFilter === 'demo'
              ? city.includes('demo')
              : city.includes(currentFilter);
          });

      if (!filtered.length) {
        materialsEl.innerHTML = '<div class="notice">No materials match this filter.</div>';
        return;
      }

      const shown = filtered.slice(0, 25);
      const rows = shown.map(m => `<tr>
        <td class="demo-id">${esc(m.id)}</td>
        <td>${esc(fmtCat(m.category))}</td>
        <td>${esc(m.quantity_value)} <span class="demo-unit">${esc(m.quantity_unit || '')}</span></td>
        <td>${esc(m.origin_city || '—')}</td>
        <td>${fmtDate(m.created_at)}</td>
      </tr>`).join('');

      materialsEl.innerHTML = `<div class="demo-table-wrap"><table class="demo-table">
        <thead><tr><th>Material ID</th><th>Category</th><th>Quantity</th><th>City</th><th>Registered</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>` +
        (filtered.length > 25
          ? `<div class="demo-table-note">Showing 25 of ${filtered.length} records</div>` : '');
    } catch {
      materialsEl.innerHTML = '<div class="notice">Material registry unavailable — backend may be offline.</div>';
    }
  }

  // ── Offers ─────────────────────────────────────────────────────────────────
  async function loadOffers() {
    if (!offersEl) return;
    offersEl.innerHTML = '<div class="notice">Loading offers…</div>';
    try {
      const data = await fetch(`${apiBase}/api/v1/offer`).then(r => r.json());
      if (!data.length) { offersEl.innerHTML = '<div class="notice">No offers yet.</div>'; return; }
      const rows = data.slice(0, 15).map(o => `<tr>
        <td class="demo-id">${esc(o.id)}</td>
        <td class="demo-id">${esc(o.material_id || '—')}</td>
        <td>${esc(o.from_city || '—')} &rarr; ${esc(o.to_city || '—')}</td>
        <td>${esc(o.quantity_value || '—')} <span class="demo-unit">${esc(o.quantity_unit || '')}</span></td>
        <td>${statusBadge(o.status)}</td>
        <td>${fmtDate(o.available_until)}</td>
      </tr>`).join('');
      offersEl.innerHTML = `<div class="demo-table-wrap"><table class="demo-table">
        <thead><tr><th>Offer ID</th><th>Material</th><th>Route</th><th>Quantity</th><th>Status</th><th>Until</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>`;
    } catch {
      offersEl.innerHTML = '<div class="notice">Offers unavailable.</div>';
    }
  }

  // ── Matches ────────────────────────────────────────────────────────────────
  async function loadMatches() {
    if (!matchesEl) return;
    matchesEl.innerHTML = '<div class="notice">Loading matches…</div>';
    try {
      const data = await fetch(`${apiBase}/api/v1/match`).then(r => r.json());
      if (!data.length) { matchesEl.innerHTML = '<div class="notice">No matches yet.</div>'; return; }
      const rows = data.slice(0, 15).map(m => `<tr>
        <td class="demo-id">${esc(m.id)}</td>
        <td class="demo-id">${esc(m.material_id || '—')}</td>
        <td>${esc(m.from_city || '—')} &rarr; ${esc(m.to_city || '—')}</td>
        <td>${statusBadge(m.status)}</td>
        <td>${fmtDate(m.matched_at)}</td>
      </tr>`).join('');
      matchesEl.innerHTML = `<div class="demo-table-wrap"><table class="demo-table">
        <thead><tr><th>Match ID</th><th>Material</th><th>Route</th><th>Status</th><th>Matched At</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>`;
    } catch {
      matchesEl.innerHTML = '<div class="notice">Matches unavailable.</div>';
    }
  }

  // ── Transfers ──────────────────────────────────────────────────────────────
  async function loadTransfers() {
    if (!transfersEl) return;
    transfersEl.innerHTML = '<div class="notice">Loading transfers…</div>';
    try {
      const data = await fetch(`${apiBase}/api/v1/transfer`).then(r => r.json());
      if (!data.length) { transfersEl.innerHTML = '<div class="notice">No transfers yet.</div>'; return; }
      const rows = data.slice(0, 15).map(t => `<tr>
        <td class="demo-id">${esc(t.id)}</td>
        <td class="demo-id">${esc(t.material_id || '—')}</td>
        <td>${statusBadge(t.status)}</td>
        <td>${fmtDate(t.handoff_at)}</td>
        <td>${fmtDate(t.received_at)}</td>
      </tr>`).join('');
      transfersEl.innerHTML = `<div class="demo-table-wrap"><table class="demo-table">
        <thead><tr><th>Transfer ID</th><th>Material</th><th>Status</th><th>Handoff</th><th>Received</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>`;
    } catch {
      transfersEl.innerHTML = '<div class="notice">Transfers unavailable.</div>';
    }
  }

  // ── Live Event Stream ──────────────────────────────────────────────────────
  const STREAM_EVENTS = ['material.created','offer.created','match.created','transfer.created','material.status_updated'];
  let streamConnected = false;

  function connectStream() {
    if (!streamEl) return;
    try {
      const es = new EventSource(`${apiBase}/api/v1/stream`);
      streamConnected = true;

      STREAM_EVENTS.forEach(evtName => {
        es.addEventListener(evtName, e => {
          let data = {};
          try { data = JSON.parse(e.data); } catch {}
          appendEntry({ event: evtName, entity_id: data.entity_id || data.id });
        });
      });

      es.addEventListener('message', e => {
        let data = {};
        try { data = JSON.parse(e.data); } catch { data = { raw: e.data }; }
        if (data.type || data.event_type) {
          appendEntry({ event: data.type || data.event_type, entity_id: data.entity_id || data.id });
        }
      });

      es.onerror = () => {
        const dot = streamEl.querySelector('.demo-stream-dot');
        if (dot) { dot.className = 'demo-stream-dot demo-stream-dot-offline'; }
      };

      es.onopen = () => {
        const dot = streamEl.querySelector('.demo-stream-dot');
        if (dot) { dot.className = 'demo-stream-dot demo-stream-dot-live'; }
      };
    } catch {
      if (streamEl) streamEl.querySelector('.demo-stream-status') && (streamEl.querySelector('.demo-stream-status').textContent = 'SSE unavailable.');
    }
  }

  function appendEntry(data) {
    if (!streamEl) return;
    const idle = streamEl.querySelector('.demo-stream-idle');
    if (idle) idle.remove();

    const entry = document.createElement('div');
    entry.className = 'demo-stream-entry';
    const t = new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    entry.innerHTML =
      `<span class="demo-stream-time">${t}</span>` +
      `<span class="demo-stream-event">${esc(data.event || 'event')}</span>` +
      (data.entity_id ? `<span class="demo-stream-id">${esc(data.entity_id)}</span>` : '');

    streamEl.insertBefore(entry, streamEl.firstChild);
    const all = streamEl.querySelectorAll('.demo-stream-entry');
    if (all.length > 60) all[all.length - 1].remove();
  }

  async function loadRecentEvents() {
    if (!streamEl) return;
    try {
      const resp = await fetch(`${apiBase}/api/v1/events`);
      if (!resp.ok) return;
      const body = await resp.json();
      const events = Array.isArray(body) ? body : (body.results || []);
      if (!events.length) return;

      const idle = streamEl.querySelector('.demo-stream-idle');
      if (!streamEl.querySelector('.demo-stream-entry') && idle) {
        idle.remove();
        events.slice(0, 12).forEach(evt =>
          appendEntry({ event: evt.event_type, entity_id: evt.entity_id })
        );
        const note = document.createElement('div');
        note.className = 'demo-stream-note';
        note.textContent = 'Recent events — live stream appends new events above.';
        streamEl.appendChild(note);
      }
    } catch { /* silent */ }
  }

  // ── Register Material Form ─────────────────────────────────────────────────
  function initRegisterForm() {
    if (!registerFormEl) return;
    registerFormEl.addEventListener('submit', async e => {
      e.preventDefault();
      const fd = new FormData(registerFormEl);
      const category = (fd.get('category') || 'plastic-pet').slice(0, 40);
      const qty = parseFloat(fd.get('quantity'));
      const unit = (fd.get('unit') || 'kg').slice(0, 10);
      const city = (fd.get('city') || 'DEMO City').slice(0, 80);

      if (!Number.isFinite(qty) || qty <= 0 || qty > 1e6) {
        setRegStatus('Quantity must be a positive number (max 1,000,000).', 'error');
        return;
      }

      const catAbbrev = category.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 8) || 'MAT';
      const matId = `MAT-DE-DMO-2026-${catAbbrev}-${randomHex(6)}`;

      const payload = {
        '@context': 'https://local-loop-io.github.io/projects/loop-protocol/contexts/loop-v0.2.0.jsonld',
        '@type': 'MaterialDNA',
        schema_version: '0.2.0',
        id: matId,
        category,
        quantity: { value: qty, unit },
        origin_city: city,
        current_city: city,
        available_from: new Date().toISOString(),
      };

      const btn = registerFormEl.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;
      setRegStatus('Submitting…', '');

      try {
        const r = await fetch(`${apiBase}/api/v1/material`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!r.ok) throw new Error(`Server returned ${r.status}`);
        const result = await r.json();
        setRegStatus(`Registered: ${result.id || matId}`, 'success');
        registerFormEl.reset();
        setTimeout(() => { loadMaterials(); loadStats(); }, 800);
      } catch (err) {
        setRegStatus(`Failed: ${err.message}`, 'error');
      } finally {
        if (btn) btn.disabled = false;
      }
    });
  }

  function setRegStatus(msg, type) {
    if (!registerStatusEl) return;
    registerStatusEl.textContent = msg;
    registerStatusEl.className = 'notice' + (type ? ` notice-${type}` : '');
    registerStatusEl.hidden = false;
  }

  // ── Tabs ───────────────────────────────────────────────────────────────────
  function initTabs() {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.demoTab;
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('[data-panel]').forEach(p => {
          p.hidden = p.dataset.panel !== target;
        });
      });
    });
    // Activate first tab
    if (tabBtns[0]) tabBtns[0].click();
  }

  // ── Filter buttons ─────────────────────────────────────────────────────────
  function initFilters() {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        loadMaterials(btn.dataset.demoFilter);
      });
    });
  }

  // ── Auto-refresh every 30s ─────────────────────────────────────────────────
  function scheduleRefresh() {
    setInterval(() => {
      loadHeartbeat();
      loadStats();
      loadMaterials();
    }, 30000);
  }

  // ── Boot ───────────────────────────────────────────────────────────────────
  function init() {
    loadHeartbeat();
    loadStats();
    loadMaterials('all');
    connectStream();
    loadRecentEvents();
    initRegisterForm();
    initTabs();
    initFilters();
    scheduleRefresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
