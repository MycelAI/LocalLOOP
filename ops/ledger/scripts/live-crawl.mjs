import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const base = 'https://localloop.urbnia.com';
const outDir = process.env.OUT_DIR;
const routes = ['/', '/docs/', '/protocol/', '/interest/', '/platform/demo-city/', '/docs/metrics/'];
const report = { base, startedAt: new Date().toISOString(), routes: [] };

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();

const consoleErrors = [];
const failedRequests = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push({ url: page.url(), text: msg.text() });
});
page.on('response', (res) => {
  if (res.status() >= 400) failedRequests.push({ url: res.url(), status: res.status() });
});

for (const route of routes) {
  const entry = { route, consoleErrors: [], failed: [], status: null, screenshot: null };
  const beforeConsole = consoleErrors.length;
  const beforeFailed = failedRequests.length;
  try {
    const res = await page.goto(base + route, { waitUntil: 'networkidle', timeout: 45000 });
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
  console.log(JSON.stringify(entry));
}

report.endedAt = new Date().toISOString();
report.totalConsoleErrors = consoleErrors.length;
report.totalFailedRequests = failedRequests.length;
fs.writeFileSync(path.join(outDir, 'crawl-report.json'), JSON.stringify(report, null, 2));
await browser.close();
if (report.totalConsoleErrors > 0 || report.routes.some((r) => (r.status || 0) >= 400)) {
  console.error('CRAWL_ISSUES', report.totalConsoleErrors, report.totalFailedRequests);
  process.exitCode = 0; // capture issues without failing evidence collection
}
console.log('CRAWL_OK', report.routes.length, 'routes');
