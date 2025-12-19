import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/api/interest', async (route) => {
    const method = route.request().method();
    if (method === 'POST') {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        results: [
          {
            name: 'Test Cooperative',
            organization: 'LocalLoop Lab',
            role: 'Research',
            city: 'Testville',
            country: 'US',
            website: 'https://example.com',
            email: 'hello@example.com',
            message: 'Exploring the protocol.',
            created_at: '2025-01-01T00:00:00Z',
          },
        ],
      }),
    });
  });
});

test('home page loads and lists interest', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: /Host the entire LOOP Protocol stack in one place/i })
  ).toBeVisible();

  await expect(page.getByRole('heading', { name: /Expression of Interest/i })).toBeVisible();
  await expect(page.locator('.interest-card')).toHaveCount(1);
  await expect(page.getByText('Test Cooperative')).toBeVisible();
});

test('interest form submits with required fields', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Name *').fill('Ada Example');
  await page.getByLabel('I agree my submission is listed publicly').check();
  await page.getByRole('button', { name: /Submit interest/i }).click();

  await expect(page.locator('[data-interest-status]')).toHaveText(/Thanks for your interest/i);
});
