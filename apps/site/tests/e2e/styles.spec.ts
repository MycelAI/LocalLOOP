import { test, expect } from '@playwright/test';

test('site styles are applied', async ({ page }) => {
  await page.goto('/');

  const background = await page.evaluate(() =>
    window.getComputedStyle(document.body).backgroundImage
  );
  expect(background).toContain('linear-gradient');

  const flowStep = page.locator('.flow-step').first();
  await expect(flowStep).toBeVisible();
  const padding = await flowStep.evaluate((el) =>
    window.getComputedStyle(el).padding
  );
  expect(padding).not.toBe('0px');
});

test('fonts and icons are served from the site origin (no third-party requests)', async ({ page }) => {
  const external: string[] = [];
  const firstParty = new Set(['127.0.0.1', 'localhost', 'loop-api.urbnia.com', 'localloop.urbnia.com']);
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (!firstParty.has(url.hostname)) {
      external.push(request.url());
    }
  });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  expect(external).toEqual([]);

  const fontFamily = await page.evaluate(() => window.getComputedStyle(document.querySelector('h1')!).fontFamily);
  expect(fontFamily).toMatch(/Fraunces|Space Grotesk/);
  const iconReady = await page.evaluate(() => document.fonts.check('16px "Phosphor-Bold"'));
  expect(iconReady).toBe(true);
});
