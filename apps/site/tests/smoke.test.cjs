const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const read = (segments) =>
  fs.readFileSync(path.join(process.cwd(), ...segments), 'utf8');

test('interest page wires interest form hooks', () => {
  const content = read(['app', '(engage)', 'interest', 'page.jsx']);
  assert.ok(content.includes('data-interest-form'));
  assert.ok(content.includes('data-interest-list'));
  assert.ok(content.includes('data-interest-status'));
});

test('viewer uses absolute asset paths', () => {
  const content = read(['public', 'viewer.html']);
  assert.ok(content.includes('href="/assets/css/site.css"'));
  assert.ok(content.includes('src="/assets/js/viewer.js"'));
});

test('viewer sanitizes markdown urls before rendering', () => {
  const content = read(['public', 'assets', 'js', 'viewer.js']);
  assert.ok(content.includes('function sanitizeUrl(rawHref, allowedProtocols)'));
  assert.ok(content.includes('function isSafeRelativePath(rawPath)'));
  assert.ok(content.includes("value.includes(':')"));
  assert.ok(content.includes("sanitizeUrl(link.getAttribute('href'), new Set(['http:', 'https:', 'mailto:']))"));
  assert.ok(content.includes("sanitizeUrl(image.getAttribute('src'), new Set(['http:', 'https:']))"));
  assert.ok(content.includes("container.querySelectorAll('a[href]')"));
  assert.ok(content.includes("container.querySelectorAll('img[src]')"));
});

test('public projects directory exists', () => {
  const projectsPath = path.join(process.cwd(), 'public', 'projects', 'loop-protocol');
  assert.ok(fs.existsSync(projectsPath));
});

test('metrics page wires live metrics panel', () => {
  const content = read(['app', 'docs', 'metrics', 'page.jsx']);
  assert.ok(content.includes('data-metrics-panel'));
});

test('api docs page links to the live docs instead of embedding an iframe', () => {
  const content = read(['app', 'docs', 'api', 'page.jsx']);
  assert.ok(content.includes('Open live Redoc'));
  assert.ok(content.includes('https://loop-api.urbnia.com/openapi.json'));
});

test('federation docs page renders handshake guide', () => {
  const content = read(['app', 'docs', 'federation', 'page.jsx']);
  assert.ok(content.includes('NodeHandshake'));
});

test('versioned protocol schema aliases exist', () => {
  const schemaPath = path.join(
    process.cwd(),
    'public',
    'projects',
    'loop-protocol',
    'schemas',
    'v0.1.1',
    'material-dna.schema.json',
  );
  assert.ok(fs.existsSync(schemaPath));
});
