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

test('key concepts resolve every tab panel and support roving focus', async ({ page }) => {
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
});

test('key concepts scroll-links the active tab to scroll position on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const wrapper = page.locator('.kc-scroll-wrapper');
  const initial = await page.getByRole('tab', { selected: true }).getAttribute('id');

  // Scroll to the middle of the tall wrapper — the active tab should advance
  // without ever calling preventDefault on the scroll (a plain mouse-wheel
  // scroll drives this, not a click).
  const box = await wrapper.boundingBox();
  await page.mouse.move(720, 450);
  const steps = Math.ceil((box.height) / 300);
  for (let i = 0; i < steps; i += 1) {
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(30);
  }
  await expect(page.getByRole('tab', { selected: true })).not.toHaveAttribute('id', initial || '');
});

test('key concepts content never overflows the panel at common desktop widths', async ({ page }) => {
  // Regression test: at ~1024px width the description column used to
  // compress enough that the CTA button rendered ~200px below the visible
  // panel (and the viewport). Check the actual worst-offender width plus
  // neighbors, using the longest description in CONCEPTS (LOOP's, index 0,
  // which is active by default) as the stress case.
  for (const width of [905, 1024, 1280, 1366, 1920]) {
    await page.setViewportSize({ width, height: 768 });
    await page.goto('/');
    const content = page.locator('.kc-panel-face.is-active .kc-panel-content');
    const cta = page.locator('.kc-panel-face.is-active .kc-panel-cta');
    const contentBox = await content.boundingBox();
    const ctaBox = await cta.boundingBox();
    expect(ctaBox.y + ctaBox.height).toBeLessThanOrEqual(contentBox.y + contentBox.height + 1);
  }
});

test('reduced motion disables scroll-linked pinning for key concepts', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.kc-sticky')).toHaveCSS('position', 'static');
  const initial = await page.getByRole('tab', { selected: true }).getAttribute('id');
  await page.mouse.wheel(0, 2000);
  await page.waitForTimeout(100);
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
