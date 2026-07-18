import { test, expect } from '@playwright/test';

test('demo feature cleans up and initializes once across header-driven client navigation', async ({ page }) => {
  await page.addInitScript(() => {
    class TestEventSource {
      static opened = 0;
      static closed = 0;
      static instances: TestEventSource[] = [];
      static active() { return TestEventSource.instances.filter((stream) => !stream.isClosed); }
      static latest() { return TestEventSource.instances.at(-1); }
      isClosed = false;
      listeners = new Map<string, ((event: MessageEvent) => void)[]>();
      onmessage: ((event: MessageEvent) => void) | null = null;
      onerror: (() => void) | null = null;
      constructor() { TestEventSource.opened += 1; TestEventSource.instances.push(this); }
      addEventListener(type: string, listener: (event: MessageEvent) => void) {
        this.listeners.set(type, [...(this.listeners.get(type) || []), listener]);
      }
      emit(type: string, data: unknown) {
        const event = { data: JSON.stringify(data) } as MessageEvent;
        this.listeners.get(type)?.forEach((listener) => listener(event));
      }
      close() { if (!this.isClosed) { this.isClosed = true; TestEventSource.closed += 1; } }
    }
    window.EventSource = TestEventSource as unknown as typeof EventSource;
    (window as typeof window & { testEventSource: typeof TestEventSource }).testEventSource = TestEventSource;
  });
  await page.route('https://loop-api.urbnia.com/**', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));

  await page.goto('/platform/demo-city/');
  await expect(page.locator('[data-demo-city]')).toHaveAttribute('data-demo-ready', 'true');
  await expect.poll(() => page.evaluate(() => (window as any).testEventSource.opened)).toBe(1);
  await expect.poll(() => page.evaluate(() => (window as any).testEventSource.active().length)).toBe(1);

  const staleEvaluation = await page.evaluate(async () => {
    const source = await fetch('/assets/js/demo-city.js').then((response) => response.text());
    const currentFeature = (window as any).LOCALLOOP_FEATURES['demo-city'];
    const streams = (window as any).testEventSource;
    const before = { opened: streams.opened, closed: streams.closed };
    const staleScript = document.createElement('script');
    staleScript.dataset.localLoopFeatureToken = 'demo-city-stale';
    staleScript.textContent = source;
    document.body.appendChild(staleScript);
    staleScript.remove();
    return {
      featureUnchanged: (window as any).LOCALLOOP_FEATURES['demo-city'] === currentFeature,
      opened: streams.opened - before.opened,
      closed: streams.closed - before.closed,
    };
  });
  expect(staleEvaluation).toEqual({ featureUnchanged: true, opened: 0, closed: 0 });

  const docsLink = page.locator('#site-nav-links .nav-section-link', { hasText: /^Docs$/ }).first();
  await Promise.all([
    page.waitForURL(/\/docs\/?$/),
    docsLink.click(),
  ]);
  await expect.poll(() => page.evaluate(() => (window as any).testEventSource.closed)).toBe(1);
  await expect.poll(() => page.evaluate(() => (window as any).testEventSource.active().length)).toBe(0);
  await expect(page.locator('#local-loop-feature-demo-city')).toHaveCount(0);
  await expect(page.locator('[data-demo-city]')).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => Boolean((window as any).LOCALLOOP_FEATURES?.['demo-city']))).toBe(false);

  const platformLink = page.locator('#site-nav-links .nav-section-link', { hasText: /^Platform$/ }).first();
  await platformLink.hover();
  const demoLink = page.locator('#nav-menu-platform a', { hasText: 'DEMO City' });
  await Promise.all([
    page.waitForURL(/\/platform\/demo-city\/?$/),
    demoLink.click(),
  ]);
  await expect.poll(() => page.evaluate(() => (window as any).testEventSource.opened)).toBe(2);
  await expect.poll(() => page.evaluate(() => (window as any).testEventSource.active().length)).toBe(1);
  await expect(page.locator('[data-demo-city]')).toHaveAttribute('data-demo-ready', 'true');
  await page.evaluate(() => (window as any).testEventSource.latest().emit('material.created', { entity_id: 'material-1' }));
  await expect(page.locator('.demo-stream-entry')).toHaveCount(1);
  await expect(page.locator('[data-demo-city]')).toHaveCount(1);
});
