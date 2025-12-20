(function () {
  const config = window.LOCALLOOP_CONFIG || {};
  const apiBase = config.apiBase || 'https://loop-api.urbnia.com';

  const form = document.querySelector('[data-interest-form]');
  const listEl = document.querySelector('[data-interest-list]');
  const statusEl = document.querySelector('[data-interest-status]');

  if (!listEl) {
    return;
  }

  function setStatus(message, isError) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.style.color = isError ? '#b3261e' : '#234058';
  }

  function escapeHtml(value) {
    if (!value) return '';
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatEntry(entry) {
    const name = escapeHtml(entry.name || 'Anonymous');
    const demoBadge = entry.is_demo ? '<span class="interest-badge">DEMO</span>' : '';
    const org = entry.organization ? ` • ${escapeHtml(entry.organization)}` : '';
    const role = entry.role ? ` (${escapeHtml(entry.role)})` : '';
    const location = [entry.city, entry.country].filter(Boolean).map(escapeHtml).join(', ');
    const website = entry.website ? ` • ${escapeHtml(entry.website)}` : '';
    const email = entry.email ? ` • ${escapeHtml(entry.email)}` : '';
    const meta = [location, entry.created_at ? new Date(entry.created_at).toLocaleDateString() : null]
      .filter(Boolean)
      .join(' • ');

    return `
      <div class="interest-card">
        <h4>${name}${demoBadge}${org}${role}</h4>
        <p>${meta}${website}${email}</p>
        ${entry.message ? `<p>${escapeHtml(entry.message)}</p>` : ''}
      </div>
    `;
  }

  const demoEntries = [
    {
      name: 'Lucia Torres',
      organization: 'GreenLoop Collective',
      role: 'Partnerships',
      country: 'ES',
      city: 'Valencia',
      website: 'https://example.org/greenloop',
      email: null,
      message: 'Exploring circularity pilots for civic materials.',
      is_demo: true,
      created_at: '2025-12-12T09:00:00Z',
    },
    {
      name: 'Jonas Becker',
      organization: 'CircularFoundry',
      role: 'Innovation Director',
      country: 'DE',
      city: 'Hamburg',
      website: 'https://example.org/circularfoundry',
      email: null,
      message: 'Interested in inter-city material exchange research.',
      is_demo: true,
      created_at: '2025-12-14T12:00:00Z',
    },
    {
      name: 'Priya Nair',
      organization: 'Urban Materials Office',
      role: 'Program Manager',
      country: 'IN',
      city: 'Pune',
      website: 'https://example.org/urban-materials',
      email: null,
      message: 'Looking to join a future city cohort once pilots open.',
      is_demo: true,
      created_at: '2025-12-16T15:30:00Z',
    },
    {
      name: 'Malik Chen',
      organization: 'LoopLab Studio',
      role: 'Research Fellow',
      country: 'SG',
      city: 'Singapore',
      website: 'https://example.org/looplab',
      email: null,
      message: 'Interested in schema alignment and data interoperability.',
      is_demo: true,
      created_at: '2025-12-18T08:20:00Z',
    },
    {
      name: 'Ava Reyes',
      organization: 'Circular Works',
      role: 'City Sustainability Lead',
      country: 'US',
      city: 'Austin',
      website: 'https://example.org/circular-works',
      email: null,
      message: 'Exploring a pilot partnership for material traceability.',
      is_demo: true,
      created_at: '2025-12-19T11:45:00Z',
    },
  ];

  function renderEntries(entries, notice) {
    const cards = entries.map(formatEntry).join('');
    const noticeHtml = notice ? `<div class="notice">${notice}</div>` : '';
    listEl.innerHTML = `${noticeHtml}${cards}`;
  }

  async function loadList() {
    try {
      const response = await fetch(`${apiBase}/api/interest`);
      if (!response.ok) {
        throw new Error('Unable to load interest list.');
      }
      const data = await response.json();
      if (!data.results || data.results.length === 0) {
        listEl.innerHTML = '<div class="notice">No public expressions of interest yet.</div>';
        return;
      }
      renderEntries(data.results);
    } catch (error) {
      renderEntries(demoEntries, 'Public list unavailable — showing demo entries.');
    }
  }

  let stream = null;
  let retryTimer = null;

  function scheduleReconnect() {
    if (retryTimer) return;
    retryTimer = setTimeout(() => {
      retryTimer = null;
      connectStream();
    }, 5000);
  }

  function connectStream() {
    if (!('EventSource' in window) || stream) return;
    const streamUrl = `${apiBase}/api/interest/stream`;
    stream = new EventSource(streamUrl);

    stream.onmessage = () => {
      loadList();
    };

    stream.onerror = () => {
      if (stream) {
        stream.close();
        stream = null;
      }
      scheduleReconnect();
    };
  }

  function disconnectStream() {
    if (stream) {
      stream.close();
      stream = null;
    }
    if (retryTimer) {
      clearTimeout(retryTimer);
      retryTimer = null;
    }
  }

  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      setStatus('Submitting...', false);

      const formData = new FormData(form);
      const payload = {
        name: formData.get('name')?.toString().trim(),
        organization: formData.get('organization')?.toString().trim(),
        role: formData.get('role')?.toString().trim(),
        country: formData.get('country')?.toString().trim(),
        city: formData.get('city')?.toString().trim(),
        website: formData.get('website')?.toString().trim(),
        email: formData.get('email')?.toString().trim(),
        message: formData.get('message')?.toString().trim(),
        shareEmail: formData.get('shareEmail') === 'on',
        consentPublic: formData.get('consentPublic') === 'on',
        honey: formData.get('honey')?.toString().trim(),
      };

      try {
        const response = await fetch(`${apiBase}/api/interest`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({}));
          const message = errorBody?.error || 'Submission failed.';
          throw new Error(message);
        }

        form.reset();
        setStatus('Thanks for your interest! Your submission is now public.', false);
        loadList();
      } catch (error) {
        setStatus(error.message, true);
      }
    });
  }

  loadList();
  connectStream();

  window.addEventListener('beforeunload', () => {
    disconnectStream();
  });
})();
