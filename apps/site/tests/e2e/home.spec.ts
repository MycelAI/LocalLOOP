import { test, expect } from '@playwright/test';

test('home page loads primary navigation', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: /Circular Economy Infrastructure for Cities/i })
  ).toBeVisible();

  await expect(page.locator('.nav-group')).toHaveCount(5);
  await expect(page.locator('.nav-section-link', { hasText: 'Platform' })).toBeVisible();
  await expect(page.locator('.nav-section-link', { hasText: 'Protocol' })).toBeVisible();
  await expect(page.locator('.nav-section-link', { hasText: 'Library' })).toBeVisible();
  await expect(page.locator('.nav-section-link', { hasText: 'Docs' })).toBeVisible();
  await expect(page.locator('.nav-section-link', { hasText: 'Governance' })).toBeVisible();
  await expect(page.locator('.nav-cta')).toContainText('Get Started');

  await expect(page.getByRole('heading', { name: /How LOOP Works/i })).toBeVisible();
});
