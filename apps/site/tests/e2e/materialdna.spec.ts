import { test, expect } from '@playwright/test';

test('materialDNA page highlights the concept', async ({ page }) => {
  await page.goto('/materialDNA/');

  await expect(
    page.getByRole('heading', { name: /MaterialDNA: a shared identity for circular materials/i })
  ).toBeVisible();
  await expect(page.getByText('No public pilots or deployments yet.', { exact: true })).toBeVisible();
});
