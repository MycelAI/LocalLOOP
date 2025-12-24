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
