import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/assets/js/config.js', (route) => route.fulfill({
    contentType: 'application/javascript',
    body: "window.LOCALLOOP_CONFIG = { apiBase: 'https://loop-api.urbnia.com' };",
  }));
  await page.route('https://loop-api.urbnia.com/**', (route) => {
    if (route.request().method() !== 'GET') throw new Error('DEMO City must not issue public writes');
    const url = route.request().url();
    const body = url.endsWith('/health') ? { status: 'ok', db: 'ok', uptime: 60 } : [];
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'access-control-allow-origin': '*' },
      body: JSON.stringify(body),
    });
  });
});

test('demo city page frames the sample portal', async ({ page }) => {
  await page.goto('/platform/demo-city/');

  await expect(
    page.getByRole('heading', { name: /DEMO City/i })
  ).toBeVisible();
  await expect(page.getByText(/no public deployment/i)).toBeVisible();
  await expect(page.getByText(/Public material registration is disabled/i)).toBeVisible();
  await expect(page.getByRole('tablist', { name: /Protocol flow data/i })).toBeVisible();
});

test('demo flow tabs support roving keyboard focus without API writes', async ({ page }) => {
  await page.goto('/platform/demo-city/');
  await expect(page.locator('[data-demo-city]')).toHaveAttribute('data-demo-ready', 'true');
  const offers = page.getByRole('tab', { name: 'Offers' });
  await offers.press('End');
  await expect(page.getByRole('tab', { name: 'Transfers' })).toBeFocused();
  await expect(page.getByRole('tabpanel', { name: 'Transfers' })).toBeVisible();
});

test('labels API rate limiting accurately instead of reporting an unreachable backend', async ({ page }) => {
  await page.unroute('https://loop-api.urbnia.com/**');
  await page.route('https://loop-api.urbnia.com/**', (route) => {
    if (route.request().url().endsWith('/health')) {
      return route.fulfill({
        status: 429,
        contentType: 'application/json',
        headers: { 'access-control-allow-origin': '*' },
        body: JSON.stringify({ error: 'Too Many Requests' }),
      });
    }
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'access-control-allow-origin': '*' },
      body: '[]',
    });
  });

  await page.goto('/platform/demo-city/');

  await expect(page.getByText(/API request limit reached/i)).toBeVisible();
  await expect(page.getByText(/^Backend unreachable$/i)).toHaveCount(0);
});
