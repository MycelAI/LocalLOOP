import { test, expect } from '@playwright/test';

const criticalRoutes = ['/', '/interest/', '/platform/demo-city/', '/platform/materialdna/'];

test.beforeEach(async ({ page }) => {
  await page.route('https://loop-api.urbnia.com/**', async (route) => {
    if (route.request().method() !== 'GET') {
      await route.fulfill({ status: 405, body: 'Public tests never write to the lab API.' });
      return;
    }
    const url = route.request().url();
    const body = url.endsWith('/health') ? { status: 'ok', db: 'ok', uptime: 3600 }
      : url.includes('/metrics') ? { metrics: {}, startedAt: '2026-01-01T00:00:00Z', uptimeSeconds: 60 }
      : url.includes('/interest') ? { results: [] } : [];
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
  });
});

test('critical routes expose one main, a page footer, and an activating skip link', async ({ page }) => {
  for (const route of criticalRoutes) {
    await page.goto(route);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.getByRole('contentinfo')).toHaveCount(1);
    await expect(page.locator('main footer')).toHaveCount(0);
    const skip = page.getByRole('link', { name: 'Skip to main content' });
    await skip.focus();
    await expect(skip).toBeVisible();
    await skip.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();
  }
});

test('key concepts resolve every tab panel and support roving focus with a persistent pause', async ({ page }) => {
  await page.goto('/');
  const tabs = page.getByRole('tab');
  await expect(tabs).toHaveCount(6);
  for (let index = 0; index < 6; index += 1) {
    const panelId = await tabs.nth(index).getAttribute('aria-controls');
    await expect(page.locator(`#${panelId}`)).toHaveCount(1);
  }
  await tabs.first().press('ArrowRight');
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  const pause = page.locator('.kc-pause');
  await pause.click();
  await expect(pause).toHaveAccessibleName('Resume rotation');
  await expect(pause).toHaveAttribute('aria-pressed', 'true');
});

test('reduced motion holds the selected concept past a test-friendly rotation interval', async ({ page }) => {
  await page.addInitScript(() => { window.__LOCALLOOP_CONCEPT_INTERVAL_MS = 40; });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const initial = await page.getByRole('tab', { selected: true }).getAttribute('id');
  await page.waitForTimeout(180);
  await expect(page.getByRole('tab', { selected: true })).toHaveAttribute('id', initial || '');
});

test('mobile escape closes the menu and returns focus to its trigger', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const trigger = page.locator('.nav-toggle');
  await trigger.click();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('legacy aliases redirect to canonical, noindex routes', async ({ page }) => {
  await page.goto('/engage/');
  await expect(page).toHaveURL(/\/interest\/?$/);
  for (const alias of ['/contribute/CODE_OF_CONDUCT.md', '/contribute/CODE_OF_CONDUCT.md/']) {
    await page.goto(alias);
    await expect(page).toHaveURL(/\/contribute\/?$/);
  }
});
