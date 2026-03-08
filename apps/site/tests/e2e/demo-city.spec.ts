import { test, expect } from '@playwright/test';

test('demo city page frames the sample portal', async ({ page }) => {
  await page.goto('/platform/demo-city/');

  await expect(
    page.getByRole('heading', { name: /DEMO City/i })
  ).toBeVisible();
  await expect(page.getByText(/no active deployments yet/i)).toBeVisible();
});
