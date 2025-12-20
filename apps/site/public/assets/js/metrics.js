(function () {
  const config = window.LOCALLOOP_CONFIG || {};
  const apiBase = config.apiBase || 'https://loop-api.urbnia.com';

  const panel = document.querySelector('[data-metrics-panel]');
  if (!panel) return;

  const labelMap = {
    loop_material_created: 'Materials created',
    loop_offer_created: 'Offers published',
    loop_match_created: 'Matches accepted',
    loop_transfer_created: 'Transfers completed',
    loop_event_emitted: 'Events emitted',
    loop_event_relayed: 'Events relayed',
    federation_handshake: 'Federation handshakes',
    interest_submitted: 'Interest submissions',
  };

  const render = (payload, notice) => {
    if (!payload) {
      panel.innerHTML = `<div class="notice">${notice || 'Metrics unavailable.'}</div>`;
      return;
    }

    const metrics = payload.metrics || {};
    const cards = Object.entries(metrics).map(([key, value]) => {
      const label = labelMap[key] || key.replace(/_/g, ' ');
      return `
        <div class="metric-card">
          <div class="metric-label">${label}</div>
          <div class="metric-value">${value}</div>
        </div>
      `;
    }).join('');

    panel.innerHTML = `
      ${notice ? `<div class="notice">${notice}</div>` : ''}
      <div class="metrics-meta">
        <span>Started: ${new Date(payload.startedAt).toLocaleString()}</span>
        <span>Uptime: ${Math.round(payload.uptimeSeconds)}s</span>
      </div>
      <div class="metrics-grid">${cards || '<div class="notice">No metrics yet.</div>'}</div>
    `;
  };

  async function loadMetrics() {
    try {
      const response = await fetch(`${apiBase}/api/metrics`);
      if (!response.ok) {
        throw new Error('Metrics unavailable.');
      }
      const data = await response.json();
      render(data);
    } catch (error) {
      render(null, 'Metrics unavailable — connect the lab API to view live counts.');
    }
  }

  loadMetrics();
})();
