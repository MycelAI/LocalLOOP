import { test, expect } from '@playwright/test';

test('site styles are applied', async ({ page }) => {
  await page.goto('/');

  const background = await page.evaluate(() =>
    window.getComputedStyle(document.body).backgroundImage
  );
  expect(background).toContain('linear-gradient');

  const heroCard = page.locator('.hero-card').first();
  await expect(heroCard).toBeVisible();
  const radius = await heroCard.evaluate((el) =>
    window.getComputedStyle(el).borderRadius
  );
  expect(radius).not.toBe('0px');
});
