import { test, expect } from '@playwright/test';

test('site styles are applied', async ({ page }) => {
  await page.goto('/');

  const background = await page.evaluate(() =>
    window.getComputedStyle(document.body).backgroundImage
  );
  expect(background).toContain('linear-gradient');

  const heroPanel = page.locator('.hero-panel').first();
  await expect(heroPanel).toBeVisible();
  const radius = await heroPanel.evaluate((el) =>
    window.getComputedStyle(el).borderRadius
  );
  expect(radius).not.toBe('0px');
});
