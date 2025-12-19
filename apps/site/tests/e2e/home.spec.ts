import { test, expect } from '@playwright/test';

test('home page loads primary navigation', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: /Host the entire LOOP Protocol stack in one place/i })
  ).toBeVisible();

  await expect(page.locator('.nav-trigger', { hasText: 'Protocol' })).toBeVisible();
  await expect(page.locator('.nav-trigger', { hasText: 'Docs' })).toBeVisible();
  await expect(page.locator('.nav-trigger', { hasText: 'Engage' })).toBeVisible();

  await expect(page.getByRole('heading', { name: /Navigate the platform/i })).toBeVisible();
});
