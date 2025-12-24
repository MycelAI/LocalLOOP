import { test, expect } from '@playwright/test';

test('home page loads primary navigation', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: /Circular Economy Infrastructure for Cities/i })
  ).toBeVisible();

  // Dropdown triggers
  await expect(page.locator('.nav-trigger', { hasText: 'Platform' })).toBeVisible();
  await expect(page.locator('.nav-trigger', { hasText: 'Protocol' })).toBeVisible();
  // Regular nav links
  await expect(page.locator('.nav-link', { hasText: 'Library' })).toBeVisible();
  await expect(page.locator('.nav-link', { hasText: 'Docs' })).toBeVisible();
  await expect(page.locator('.nav-link', { hasText: 'Governance' })).toBeVisible();

  await expect(page.getByRole('heading', { name: /How LOOP Works/i })).toBeVisible();
});
