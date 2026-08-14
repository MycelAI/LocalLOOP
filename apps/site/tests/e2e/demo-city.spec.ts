import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/assets/js/config.js', (route) => route.fulfill({
    contentType: 'application/javascript',
    body: "window.LOCALLOOP_CONFIG = { apiBase: 'https://loop-api.urbnia.com' };",
  }));
  await page.route('https://loop-api.urbnia.com/**', (route) => {
    if (route.request().method() !== 'GET') throw new Error('DEMO City must not issue public writes');
    const url = route.request().url();
    const body = url.endsWith('/health') ? { status: 'ok', db: 'ok', uptime: 60 } : [];
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'access-control-allow-origin': '*' },
      body: JSON.stringify(body),
    });
  });
});

test('demo city page frames the sample portal', async ({ page }) => {
  await page.goto('/platform/demo-city/');

  await expect(
    page.getByRole('heading', { name: /DEMO City/i })
  ).toBeVisible();
  await expect(page.getByText(/no public deployment/i)).toBeVisible();
  await expect(page.getByText(/Public material registration is disabled/i)).toBeVisible();
  await expect(page.getByRole('tablist', { name: /Protocol flow data/i })).toBeVisible();
});

test('demo flow tabs support roving keyboard focus without API writes', async ({ page }) => {
  await page.goto('/platform/demo-city/');
  await expect(page.locator('[data-demo-city]')).toHaveAttribute('data-demo-ready', 'true');
  const offers = page.getByRole('tab', { name: 'Offers' });
  await offers.press('End');
  await expect(page.getByRole('tab', { name: 'Transfers' })).toBeFocused();
  await expect(page.getByRole('tabpanel', { name: 'Transfers' })).toBeVisible();
});

test('labels API rate limiting accurately instead of reporting an unreachable backend', async ({ page }) => {
  await page.unroute('https://loop-api.urbnia.com/**');
  await page.route('https://loop-api.urbnia.com/**', (route) => {
    if (route.request().url().endsWith('/health')) {
      return route.fulfill({
        status: 429,
        contentType: 'application/json',
        headers: { 'access-control-allow-origin': '*' },
        body: JSON.stringify({ error: 'Too Many Requests' }),
      });
    }
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'access-control-allow-origin': '*' },
      body: '[]',
    });
  });

  await page.goto('/platform/demo-city/');

  await expect(page.getByText(/API request limit reached/i)).toBeVisible();
  await expect(page.getByText(/^Backend unreachable$/i)).toHaveCount(0);
});

test('rate limiting produces the same actionable messaging for stats and collection panels, not just the heartbeat', async ({ page }) => {
  await page.unroute('https://loop-api.urbnia.com/**');
  await page.route('https://loop-api.urbnia.com/**', (route) => route.fulfill({
    status: 429,
    contentType: 'application/json',
    headers: { 'access-control-allow-origin': '*' },
    body: JSON.stringify({ error: 'Too Many Requests' }),
  }));

  await page.goto('/platform/demo-city/');

  await expect(page.locator('[data-demo-stats]').getByText(/API request limit reached/i)).toBeVisible();
  await expect(page.locator('[data-demo-materials]').getByText(/API request limit reached/i)).toBeVisible();
  await expect(page.locator('[data-demo-stats]').getByText(/^Stats unavailable\.$/i)).toHaveCount(0);
  await expect(page.locator('[data-demo-materials]').getByText(/^Materials unavailable\.$/i)).toHaveCount(0);
});

test('SSE created events refresh their matching panel and the stream indicator recovers after a transient error', async ({ page }) => {
  await page.addInitScript(() => {
    class TestEventSource {
      static instances: TestEventSource[] = [];
      listeners = new Map<string, ((event: MessageEvent) => void)[]>();
      onmessage: ((event: MessageEvent) => void) | null = null;
      onerror: (() => void) | null = null;
      onopen: (() => void) | null = null;
      constructor() { TestEventSource.instances.push(this); }
      addEventListener(type: string, listener: (event: MessageEvent) => void) {
        this.listeners.set(type, [...(this.listeners.get(type) || []), listener]);
      }
      emit(type: string, data: unknown) {
        const event = { data: JSON.stringify(data) } as MessageEvent;
        this.listeners.get(type)?.forEach((listener) => listener(event));
      }
      close() {}
    }
    window.EventSource = TestEventSource as unknown as typeof EventSource;
    (window as typeof window & { testEventSource: typeof TestEventSource }).testEventSource = TestEventSource;
  });

  const requestCounts: Record<string, number> = {};
  await page.unroute('https://loop-api.urbnia.com/**');
  await page.route('https://loop-api.urbnia.com/**', (route) => {
    const pathname = new URL(route.request().url()).pathname;
    requestCounts[pathname] = (requestCounts[pathname] || 0) + 1;
    const body = pathname === '/health' ? { status: 'ok', db: 'ok', uptime: 60 } : [];
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'access-control-allow-origin': '*' },
      body: JSON.stringify(body),
    });
  });

  await page.goto('/platform/demo-city/');
  await expect(page.locator('[data-demo-city]')).toHaveAttribute('data-demo-ready', 'true');

  const dot = page.locator('.demo-stream-dot');
  await expect(dot).toHaveClass(/demo-stream-dot-live/);

  const offerBefore = requestCounts['/api/v1/offer'] || 0;
  const matchBefore = requestCounts['/api/v1/match'] || 0;
  const transferBefore = requestCounts['/api/v1/transfer'] || 0;

  await page.evaluate(() => {
    const stream = (window as any).testEventSource.instances.at(-1);
    stream.emit('offer.created', { entity_id: 'offer-1' });
    stream.emit('match.created', { entity_id: 'match-1' });
    stream.emit('transfer.created', { entity_id: 'transfer-1' });
  });

  await expect.poll(() => requestCounts['/api/v1/offer'] || 0).toBeGreaterThan(offerBefore);
  await expect.poll(() => requestCounts['/api/v1/match'] || 0).toBeGreaterThan(matchBefore);
  await expect.poll(() => requestCounts['/api/v1/transfer'] || 0).toBeGreaterThan(transferBefore);
  await expect(page.locator('.demo-stream-entry')).toHaveCount(3);

  await page.evaluate(() => (window as any).testEventSource.instances.at(-1).onerror?.());
  await expect(dot).toHaveClass(/demo-stream-dot-offline/);

  await page.evaluate(() => (window as any).testEventSource.instances.at(-1).onopen?.());
  await expect(dot).toHaveClass(/demo-stream-dot-live/);
});
