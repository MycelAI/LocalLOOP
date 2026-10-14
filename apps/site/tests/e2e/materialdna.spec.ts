// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

import { test, expect } from '@playwright/test';

test('materialDNA page highlights the concept', async ({ page }) => {
  await page.goto('/platform/materialdna/');

  await expect(
    page.getByRole('heading', { name: 'MaterialDNA', exact: true })
  ).toBeVisible();
  await expect(page.getByText('No public pilots or deployments yet.', { exact: true })).toBeVisible();
});
