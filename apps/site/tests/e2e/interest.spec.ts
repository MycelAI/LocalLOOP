// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // config.js selects the local dev API on localhost hosts; point the page at the
  // production base (allowed by the nginx CSP connect-src) so the mocks below
  // are what the page actually talks to.
  await page.route('**/assets/js/config.js', (route) => route.fulfill({
    contentType: 'application/javascript',
    body: "window.LOCALLOOP_CONFIG = { apiBase: window.location.origin };",
  }));
  await page.route('**/api/metrics', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ metrics: {}, uptimeSeconds: 60 }) }));
  await page.route('**/api/interest/stream', (route) => route.fulfill({ status: 200, body: '' }));

  await page.route('**/api/interest', async (route) => {
    const method = route.request().method();
    if (method === 'POST') {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        results: [
          {
            name: 'Test Cooperative',
            organization: 'localLOOP Lab',
            role: 'Research',
            city: 'Testville',
            country: 'US',
            website: 'https://example.com',
            email: 'hello@example.com',
            message: 'Exploring the protocol.',
            is_demo: true,
            created_at: '2025-01-01T00:00:00Z',
          },
          {
            name: 'Private Contact Cooperative',
            city: 'Testville',
            country: 'US',
            message: 'This entry did not authorize contact details.',
          },
        ],
      }),
    });
  });
});

test('interest page loads list and form', async ({ page }) => {
  await page.goto('/interest/');

  await expect(page.getByRole('heading', { name: /Expression of Interest/i })).toBeVisible();
  await expect(page.locator('.interest-card')).toHaveCount(2);
  await expect(page.locator('.chip')).toHaveText('DEMO');
  await expect(page.getByText('Test Cooperative')).toBeVisible();
  await expect(page.getByText('2025-01-01T00:00:00Z')).toBeVisible();
  await expect(page.getByText('Website: https://example.com')).toBeVisible();
  await expect(page.getByText('Email: hello@example.com')).toBeVisible();
  await expect(page.locator('.interest-card').filter({ hasText: 'Private Contact Cooperative' })).not.toContainText('Email:');
  await expect(page.locator('.interest-card a')).toHaveCount(0);
});

test('interest form submits with required fields', async ({ page }) => {
  await page.goto('/interest/');

  await page.getByLabel('Name *').fill('Ada Example');
  await page.getByLabel('I agree my submission is listed publicly').check();
  await page.getByRole('button', { name: /Submit interest/i }).click();

  await expect(page.locator('[data-interest-status]')).toHaveText(
    'Submission received. Public-list visibility depends on consent and service processing.',
  );
});

test('interest form explains validation and rate-limit rejections instead of "try again later"', async ({ page }) => {
  let status = 400;
  await page.route('**/api/interest', async (route) => {
    if (route.request().method() !== 'POST') return route.fallback();
    await route.fulfill(status === 400
      ? { status, contentType: 'application/json', body: JSON.stringify({ error: { code: 'INVALID_REQUEST', message: 'Invalid request', details: { validation: { formErrors: [], fieldErrors: { website: ['Invalid URL'] } } } } }) }
      : { status, contentType: 'application/json', headers: { 'Retry-After': '600' }, body: JSON.stringify({ error: { code: 'INVALID_REQUEST', message: 'Rate limit exceeded' } }) });
  });
  await page.goto('/interest/');

  await page.getByLabel('Name *').fill('Ada Example');
  await page.getByLabel('I agree my submission is listed publicly').check();
  const submit = page.getByRole('button', { name: /Submit interest/i });
  const statusEl = page.locator('[data-interest-status]');

  await submit.click();
  await expect(statusEl).toHaveText('Please check these fields: website.');

  status = 429;
  await submit.click();
  await expect(statusEl).toHaveText('Too many submissions from your connection. Please wait about 10 minute(s) before trying again.');
  await expect(submit).toBeEnabled();
});

test('interest form mirrors the API field limits', async ({ page }) => {
  await page.goto('/interest/');
  await expect(page.getByLabel('Name *')).toHaveAttribute('minlength', '2');
  await expect(page.getByLabel('Name *')).toHaveAttribute('maxlength', '80');
  await expect(page.locator('#message')).toHaveAttribute('maxlength', '500');
});
