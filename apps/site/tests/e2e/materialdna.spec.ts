import { test, expect } from '@playwright/test';

test('materialDNA page highlights the concept', async ({ page }) => {
  await page.goto('/materialdna/');

  await expect(
    page.getByRole('heading', { name: /MaterialDNA & ProductDNA: shared identities for the circular economy/i })
  ).toBeVisible();
  await expect(page.getByText('No public pilots or deployments yet.', { exact: true })).toBeVisible();
});
