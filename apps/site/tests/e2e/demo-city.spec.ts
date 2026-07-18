import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('https://loop-api.urbnia.com/**', (route) => {
    if (route.request().method() !== 'GET') throw new Error('DEMO City must not issue public writes');
    const url = route.request().url();
    const body = url.endsWith('/health') ? { status: 'ok', db: 'ok', uptime: 60 } : [];
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
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
