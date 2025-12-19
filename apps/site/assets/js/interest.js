(function () {
  const config = window.LOCALLOOP_CONFIG || {};
  const apiBase = config.apiBase || 'https://api.local-loop.io';

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

  function formatEntry(entry) {
    const name = entry.name || 'Anonymous';
    const org = entry.organization ? ` • ${entry.organization}` : '';
    const role = entry.role ? ` (${entry.role})` : '';
    const location = [entry.city, entry.country].filter(Boolean).join(', ');
    const website = entry.website ? ` • ${entry.website}` : '';
    const email = entry.email ? ` • ${entry.email}` : '';
    const meta = [location, entry.created_at ? new Date(entry.created_at).toLocaleDateString() : null]
      .filter(Boolean)
      .join(' • ');

    return `
      <div class="interest-card">
        <h4>${name}${org}${role}</h4>
        <p>${meta}${website}${email}</p>
        ${entry.message ? `<p>${entry.message}</p>` : ''}
      </div>
    `;
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
      listEl.innerHTML = data.results.map(formatEntry).join('');
    } catch (error) {
      listEl.innerHTML = `<div class="notice">${error.message}</div>`;
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
})();
