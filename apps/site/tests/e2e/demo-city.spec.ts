import { test, expect } from '@playwright/test';

test('demo city page frames the sample portal', async ({ page }) => {
  await page.goto('/DEMO-City/');

  await expect(
    page.getByRole('heading', { name: /DEMO City: how a LocalLoop city portal could look/i })
  ).toBeVisible();
  await expect(page.getByText(/no active deployments yet/i)).toBeVisible();
});
