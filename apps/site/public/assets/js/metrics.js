(function () {
  const NAME = 'metrics';
  const features = window.LOCALLOOP_FEATURES = window.LOCALLOOP_FEATURES || {};
  const featureToken = document.currentScript?.dataset.localLoopFeatureToken || null;
  const featureTokens = window.__LOCALLOOP_FEATURE_TOKENS = window.__LOCALLOOP_FEATURE_TOKENS || {};
  if (featureTokens[NAME] !== featureToken) return;
  let activeCleanup = () => {};

  features[NAME] = {
    __localLoopToken: featureToken,
    init() {
      activeCleanup();
      const config = window.LOCALLOOP_CONFIG || {};
      const apiBase = config.apiBase || 'https://loop-api.urbnia.com';
      const panel = document.querySelector('[data-metrics-panel]');
      if (!panel) return;
      const controller = new AbortController();
      let disposed = false;

      const escapeHtml = (value) => String(value ?? '')
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
      const labels = { loop_material_created: 'Materials created', loop_offer_created: 'Offers published', loop_match_created: 'Matches accepted', loop_transfer_created: 'Transfers completed', loop_event_emitted: 'Events emitted', loop_event_relayed: 'Events relayed', federation_handshake: 'Federation handshakes', interest_submitted: 'Interest submissions' };
      const render = (payload, notice) => {
        if (disposed) return;
        if (!payload) { panel.innerHTML = `<div class="notice">${escapeHtml(notice || 'Metrics unavailable.')}</div>`; return; }
        const cards = Object.entries(payload.metrics || {}).map(([key, value]) => `<div class="metric-card"><div class="metric-label">${escapeHtml(labels[key] || key.replace(/_/g, ' '))}</div><div class="metric-value">${escapeHtml(value)}</div></div>`).join('');
        const started = escapeHtml(new Date(payload.startedAt).toLocaleString());
        const uptime = Number.isFinite(Number(payload.uptimeSeconds)) ? Math.round(Number(payload.uptimeSeconds)) : 0;
        panel.innerHTML = `${notice ? `<div class="notice">${escapeHtml(notice)}</div>` : ''}<div class="metrics-meta"><span>Started: ${started}</span><span>Uptime: ${uptime}s</span></div><div class="metrics-grid">${cards || '<div class="notice">No metrics yet.</div>'}</div>`;
      };
      fetch(`${apiBase}/api/metrics`, { signal: controller.signal })
        .then((response) => response.ok ? response.json() : Promise.reject(new Error('metrics')))
        .then((data) => render(data))
        .catch((error) => { if (error.name !== 'AbortError') render(null, 'Metrics unavailable — connect the lab API to view live counts.'); });
      activeCleanup = () => { disposed = true; controller.abort(); activeCleanup = () => {}; };
    },
    cleanup() { activeCleanup(); },
  };
})();
