import { test, expect } from '@playwright/test';

const getSectionLink = (page, label) =>
  page.locator('#site-nav-links .nav-section-link', { hasText: new RegExp(`^${label}$`) }).first();

test('desktop header links navigate and dropdowns stay aligned', async ({ page }) => {
  await page.goto('/');

  const docsLink = getSectionLink(page, 'Docs');
  await docsLink.hover();
  await expect(page.locator('#nav-menu-docs')).toBeVisible();
  await expect(page.locator('#nav-menu-docs a', { hasText: 'API Docs' })).toBeVisible();

  const governanceLink = getSectionLink(page, 'Governance');
  await governanceLink.hover();
  const governanceMenu = page.locator('#nav-menu-governance');
  await expect(governanceMenu).toBeVisible();

  const menuBox = await governanceMenu.boundingBox();
  const viewport = page.viewportSize();
  if (!menuBox || !viewport) {
    throw new Error('Expected governance menu and viewport dimensions to be available.');
  }

  expect(menuBox.x + menuBox.width).toBeLessThanOrEqual(viewport.width + 1);

  await docsLink.click();
  await expect(page).toHaveURL(/\/docs\/?$/);
  await expect(getSectionLink(page, 'Docs')).toHaveClass(/active/);

  await page.goto('/docs/implementation/');
  await expect(getSectionLink(page, 'Docs')).toHaveClass(/active/);
  const activeDocsChild = page.locator('#nav-menu-docs a.active');
  await expect(activeDocsChild).toHaveText('Implementation');

  await getSectionLink(page, 'Governance').click();
  await expect(page).toHaveURL(/\/governance\/?$/);
  await expect(getSectionLink(page, 'Governance')).toHaveClass(/active/);
});

test('mobile header separates submenu toggles from section navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await page.locator('.nav-toggle').click();
  await expect(page.locator('.nav-links')).toHaveAttribute('data-open', 'true');

  const docsToggle = page.locator('[aria-controls="nav-menu-docs"]').last();

  await docsToggle.click();
  await expect(docsToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('#nav-menu-docs a', { hasText: 'FAQ' })).toBeVisible();

  await getSectionLink(page, 'Docs').click();
  await expect(page).toHaveURL(/\/docs\/?$/);
});

test('static headers use the same navigation model', async ({ page }) => {
  await page.goto('/projects/loop-protocol/');

  const staticHeader = page.locator('.site-header');
  await expect(staticHeader.locator('.nav-group')).toHaveCount(6);
  await expect(staticHeader.locator('.nav-subtitle')).toHaveText('Protocol Repository');
  await expect(staticHeader.locator('.nav-section-link', { hasText: 'Protocol' }).first()).toHaveClass(/active/);

  await page.goto('/viewer.html?path=projects/loop-protocol/SPECIFICATION.md&title=LOOP%20Protocol%20Specification');

  const viewerHeader = page.locator('.site-header');
  await expect(viewerHeader.locator('.nav-subtitle')).toHaveText('Document Viewer');

  const docsLink = viewerHeader.locator('.nav-section-link', { hasText: 'Docs' }).first();
  await expect(docsLink).toBeVisible();
  await docsLink.hover();
  await expect(page.locator('#nav-menu-docs')).toBeVisible();

  await viewerHeader.locator('.nav-section-link', { hasText: 'Library' }).first().click();
  await expect(page).toHaveURL(/\/library\/?$/);
});
