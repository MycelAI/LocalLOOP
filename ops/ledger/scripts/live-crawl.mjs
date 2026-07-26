import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const base = 'https://localloop.urbnia.com';
const outDir = process.env.OUT_DIR;
const routes = ['/', '/docs/', '/protocol/', '/interest/', '/platform/demo-city/', '/docs/metrics/'];
const report = { base, startedAt: new Date().toISOString(), routes: [], notes: [] };

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();

const consoleErrors = [];
const failedRequests = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push({ url: page.url(), text: msg.text() });
});
page.on('response', (res) => {
  // only count document/page failures on our origin, not third-party noise
  if (res.status() >= 400 && res.url().startsWith(base)) {
    failedRequests.push({ url: res.url(), status: res.status() });
  }
});

for (const route of routes) {
  const entry = { route, consoleErrors: [], failed: [], status: null, screenshot: null };
  const beforeConsole = consoleErrors.length;
  const beforeFailed = failedRequests.length;
  try {
    // domcontentloaded: SSE/metrics polling pages never reach networkidle
    const res = await page.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(1500);
    entry.status = res ? res.status() : null;
    const name = route === '/' ? 'home' : route.replace(/\//g, '_').replace(/^_|_$/g, '');
    const shot = path.join(outDir, `${name}.png`);
    await page.screenshot({ path: shot, fullPage: true });
    entry.screenshot = shot;
  } catch (e) {
    entry.error = String(e);
  }
  entry.consoleErrors = consoleErrors.slice(beforeConsole);
  entry.failed = failedRequests.slice(beforeFailed);
  report.routes.push(entry);
  console.log(JSON.stringify({ route: entry.route, status: entry.status, err: entry.error || null }));
}

report.endedAt = new Date().toISOString();
report.totalConsoleErrors = consoleErrors.length;
report.totalFailedRequests = failedRequests.length;
report.notes.push('waitUntil=domcontentloaded (networkidle hangs on SSE/polling pages)');
fs.writeFileSync(path.join(outDir, 'crawl-report.json'), JSON.stringify(report, null, 2));
await browser.close();
const bad = report.routes.filter((r) => !r.status || r.status >= 400 || r.error);
if (bad.length) {
  console.error('BAD_ROUTES', bad.map((b) => b.route));
  process.exit(1);
}
console.log('CRAWL_OK', report.routes.length);
