import { test, expect } from '@playwright/test';

const criticalRoutes = ['/', '/interest/', '/platform/demo-city/', '/platform/materialdna/'];

test.beforeEach(async ({ page }) => {
  await page.route('https://loop-api.urbnia.com/**', async (route) => {
    if (route.request().method() !== 'GET') {
      await route.fulfill({ status: 405, body: 'Public tests never write to the lab API.' });
      return;
    }
    const url = route.request().url();
    const body = url.endsWith('/health') ? { status: 'ok', db: 'ok', uptime: 3600 }
      : url.includes('/metrics') ? { metrics: {}, startedAt: '2026-01-01T00:00:00Z', uptimeSeconds: 60 }
      : url.includes('/interest') ? { results: [] } : [];
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
  });
});

test('critical routes expose one main, a page footer, and an activating skip link', async ({ page }) => {
  for (const route of criticalRoutes) {
    await page.goto(route);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.getByRole('contentinfo')).toHaveCount(1);
    await expect(page.locator('main footer')).toHaveCount(0);
    const skip = page.getByRole('link', { name: 'Skip to main content' });
    await skip.focus();
    await expect(skip).toBeVisible();
    await skip.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();
  }
});

test('key concepts resolve every tab panel and support roving focus', async ({ page }) => {
  await page.goto('/');
  const tabs = page.getByRole('tab');
  await expect(tabs).toHaveCount(6);
  for (let index = 0; index < 6; index += 1) {
    const panelId = await tabs.nth(index).getAttribute('aria-controls');
    await expect(page.locator(`#${panelId}`)).toHaveCount(1);
  }
  await tabs.first().press('ArrowRight');
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
});

test('key concepts scroll-links the active tab to scroll position on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const wrapper = page.locator('.kc-scroll-wrapper');
  const initial = await page.getByRole('tab', { selected: true }).getAttribute('id');

  // Scroll to the middle of the tall wrapper — the active tab should advance
  // without ever calling preventDefault on the scroll (a plain mouse-wheel
  // scroll drives this, not a click).
  const box = await wrapper.boundingBox();
  await page.mouse.move(720, 450);
  const steps = Math.ceil((box.height) / 300);
  for (let i = 0; i < steps; i += 1) {
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(30);
  }
  await expect(page.getByRole('tab', { selected: true })).not.toHaveAttribute('id', initial || '');
});

test('key concepts traverses all 6 tabs before the next section becomes visible', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const wrapper = page.locator('.kc-scroll-wrapper');
  const box = await wrapper.boundingBox();
  const nextHeading = page.getByRole('heading', { name: 'How LOOP Works' });

  await page.mouse.move(720, 450);
  const seen = new Set();
  // Extra viewport's worth of ticks beyond the wrapper's own height: the
  // pinned section releases at the wrapper's bottom edge, and the next
  // heading only scrolls into view after that release plus normal flow.
  const steps = Math.ceil((box.height + 900) / 120);
  let nextHeadingScrolledIntoView = false;
  for (let i = 0; i < steps; i += 1) {
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(15);
    const selected = await page.getByRole('tab', { selected: true }).getAttribute('id');
    seen.add(selected);
    const headingBox = await nextHeading.boundingBox();
    if (headingBox && headingBox.y < 900 && headingBox.y + headingBox.height > 0) {
      nextHeadingScrolledIntoView = true;
      break;
    }
  }

  // All 6 tabs must have been active at some point before "How LOOP Works"
  // scrolls into view — the whole point of pinning the section is that the
  // user scrolls through every concept before moving on.
  expect(seen.size).toBe(6);
  expect(nextHeadingScrolledIntoView).toBe(true);
});

test('key concepts content never overflows the panel at common desktop widths', async ({ page }) => {
  // Regression test: at ~1024px width the description column used to
  // compress enough that the CTA button rendered ~200px below the visible
  // panel (and the viewport). Check the actual worst-offender width plus
  // neighbors, using the longest description in CONCEPTS (LOOP's, index 0,
  // which is active by default) as the stress case. The content column's
  // typography is fluid (container query units, scaling to the card's own
  // height — see .kc-panel-content), so a few px of sub-visual rounding
  // slack at the narrowest widths is expected and fine; verified by hand
  // that anything under ~5px here doesn't visually clip the CTA.
  for (const width of [905, 1024, 1280, 1366, 1920]) {
    await page.setViewportSize({ width, height: 768 });
    await page.goto('/');
    const content = page.locator('.kc-panel-face.is-active .kc-panel-content');
    const cta = page.locator('.kc-panel-face.is-active .kc-panel-cta');
    const contentBox = await content.boundingBox();
    const ctaBox = await cta.boundingBox();
    expect(ctaBox.y + ctaBox.height).toBeLessThanOrEqual(contentBox.y + contentBox.height + 5);
  }
});

test('key concepts media never overlaps the content column at wide desktop widths', async ({ page }) => {
  // Regression test: the media panel's width used to be derived from
  // height:100% + aspect-ratio, which grid's column-track intrinsic-sizing
  // pass can't resolve (height is indeterminate at that point), so the
  // "auto" track was sized far too narrow while the element itself still
  // rendered at its full aspect-ratio width — overflowing straight over the
  // content column and hiding the left portion of every line of text. The
  // side-by-side (wide) tier only starts at 1200px — below that, media and
  // content stack vertically instead, so this check doesn't apply there.
  // The content column's own minimum (240px) is intentionally narrower than
  // it once was: its typography is fluid now (container query units) and
  // scales down rather than needing a wide, fixed-font column to stay
  // legible — see .kc-panel-content.
  for (const width of [1200, 1440, 1680, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const media = page.locator('.kc-panel-face.is-active .kc-panel-media');
    const content = page.locator('.kc-panel-face.is-active .kc-panel-content');
    const mediaBox = await media.boundingBox();
    const contentBox = await content.boundingBox();
    expect(mediaBox.x + mediaBox.width).toBeLessThanOrEqual(contentBox.x + 1);
    expect(contentBox.width).toBeGreaterThanOrEqual(239);
  }
});

test('key concepts media keeps its true 16:9 ratio and the card never letterboxes it', async ({ page }) => {
  // Regression test for the letterboxing/cropping tradeoff: the card's
  // height is media's own aspect-ratio-derived height (not an independent
  // value fought over with the text column — see .kc-panel-face), so media
  // should never be cropped away from 16:9, and at 1366px+ (where media's
  // natural height already exceeds the text column's minimum) there should
  // be no visible gap between the image and the card's edges either.
  for (const width of [1200, 1366, 1680, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const panel = page.locator('.kc-panel');
    const media = page.locator('.kc-panel-face.is-active .kc-panel-media');
    const panelBox = await panel.boundingBox();
    const mediaBox = await media.boundingBox();
    expect(mediaBox.width / mediaBox.height).toBeCloseTo(16 / 9, 1);
    if (width >= 1366) {
      expect(panelBox.height - mediaBox.height).toBeLessThanOrEqual(2);
    }
  }
});

test('reduced motion disables scroll-linked pinning for key concepts', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.kc-sticky')).toHaveCSS('position', 'static');
  const initial = await page.getByRole('tab', { selected: true }).getAttribute('id');
  await page.mouse.wheel(0, 2000);
  await page.waitForTimeout(100);
  await expect(page.getByRole('tab', { selected: true })).toHaveAttribute('id', initial || '');
});

test('key concepts mobile tab strip starts at the first tab and stays legible', async ({ page }) => {
  // Regression test: the base .kc-tabs rule sets justify-content:center for
  // the vertical desktop list, which never overflows. Once the mobile tier
  // switched tabs to natural width (so overflow-x:auto has something to
  // scroll), that same centering pushed the overflowing row so its start
  // bled into negative offsets a scrollLeft:0 container can never reach —
  // the first (active) tab rendered partly off-screen with no way back to
  // it. Separately, tab labels must not overlap each other (an earlier,
  // now-fixed variant of this bug forced all 6 tabs to equally shrink,
  // which left no room for "MaterialDNA"-length labels and let the text
  // spill into neighboring tabs instead of wrapping or scrolling).
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const tabsContainer = page.locator('.kc-tabs');
  const firstTab = page.locator('.kc-tab').first();
  const containerBox = await tabsContainer.boundingBox();
  const firstTabBox = await firstTab.boundingBox();
  expect(firstTabBox.x).toBeGreaterThanOrEqual(containerBox.x - 1);

  const tabs = page.locator('.kc-tab');
  const count = await tabs.count();
  const boxes = await Promise.all(Array.from({ length: count }, (_, i) => tabs.nth(i).boundingBox()));
  for (let i = 1; i < boxes.length; i += 1) {
    expect(boxes[i].x).toBeGreaterThanOrEqual(boxes[i - 1].x + boxes[i - 1].width - 1);
  }
});

test('mobile escape closes the menu and returns focus to its trigger', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const trigger = page.locator('.nav-toggle');
  await trigger.click();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('legacy aliases redirect to canonical, noindex routes', async ({ page }) => {
  await page.goto('/engage/');
  await expect(page).toHaveURL(/\/interest\/?$/);
  for (const alias of ['/contribute/CODE_OF_CONDUCT.md', '/contribute/CODE_OF_CONDUCT.md/']) {
    await page.goto(alias);
    await expect(page).toHaveURL(/\/contribute\/?$/);
  }
});
