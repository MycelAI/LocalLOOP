import { test, expect } from '@playwright/test';

// Runs meaningfully only against the nginx image (PLAYWRIGHT_BASE_URL pointing
// at a container built from the Dockerfile), where the Content-Security-Policy
// header is actually sent. Against the plain static server it still verifies
// that nothing on these pages is blocked or logs a CSP violation.
const routes = ['/', '/interest/', '/platform/demo-city/', '/docs/', '/protocol/spec/', '/protocol/what-is-loop/', '/library/schemas/material-dna/', '/docs/metrics/'];

test.beforeEach(async ({ page }) => {
  // In production the pages talk to https://loop-api.urbnia.com (allowed by
  // connect-src); on a localhost origin config.js would pick the local dev API
  // instead, which the policy rightly blocks — stub the production base and
  // answer its reads locally so the pages exercise their real fetch paths.
  await page.route('**/assets/js/config.js', (route) => route.fulfill({
    contentType: 'application/javascript',
    body: "window.LOCALLOOP_CONFIG = { apiBase: 'https://loop-api.urbnia.com' };",
  }));
  await page.route('https://loop-api.urbnia.com/**', (route) => {
    const url = route.request().url();
    const body = url.endsWith('/health') ? { status: 'ok', db: 'ok', redis: 'ok', uptime: 60 }
      : url.includes('/metrics') ? { metrics: {}, startedAt: '2026-01-01T00:00:00Z', uptimeSeconds: 60 }
      : url.includes('/interest') ? { results: [], total: 0 } : [];
    return route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) });
  });
});

test('pages render without Content-Security-Policy violations', async ({ page }) => {
  const violations: string[] = [];
  page.on('console', (message) => {
    if (/Content Security Policy|Refused to/i.test(message.text())) violations.push(`${page.url()}: ${message.text()}`);
  });
  await page.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', (event) => {
      console.error(`CSP violation: ${event.violatedDirective} blocked ${event.blockedURI}`);
    });
  });
  for (const route of routes) {
    await page.goto(route);
    await page.waitForLoadState('networkidle');
  }
  expect(violations).toEqual([]);
});

// The plain static test server returns its own 404 body; only the nginx image
// (Dockerfile) serves the export's 404.html via error_page.
test('custom 404 page is served for unknown paths', async ({ page }) => {
  test.skip(!process.env.PLAYWRIGHT_BASE_URL, 'requires the nginx image (set PLAYWRIGHT_BASE_URL)');
  const response = await page.goto('/this-path-does-not-exist/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  await expect(page).toHaveTitle(/Page not found/);
});
