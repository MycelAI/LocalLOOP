const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const read = (segments) =>
  fs.readFileSync(path.join(process.cwd(), ...segments), 'utf8');

const walk = (dirPath) => {
  const results = [];
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...walk(fullPath));
      continue;
    }
    results.push(fullPath);
  }
  return results;
};

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
  assert.ok(content.includes('function normalizeRelativeDocumentPath(basePath, rawHref)'));
  assert.ok(content.includes('function buildViewerHref(documentPath, rawTitle)'));
  assert.ok(content.includes("const projectRoot = basePathSegments.length >= 2 && basePathSegments[0] === 'projects'"));
  assert.ok(content.includes("resolvedPath === projectRoot || resolvedPath.startsWith(`${projectRoot}/`)"));
  assert.ok(content.includes("value.includes(':')"));
  assert.ok(content.includes("link.setAttribute('href', buildViewerHref(relativeDocumentPath, link.textContent || 'Document Viewer'))"));
  assert.ok(content.includes("sanitizeUrl(rawHref, new Set(['http:', 'https:', 'mailto:']))"));
  assert.ok(content.includes("sanitizeUrl(image.getAttribute('src'), new Set(['http:', 'https:']))"));
  assert.ok(content.includes("container.querySelectorAll('a[href]')"));
  assert.ok(content.includes("container.querySelectorAll('img[src]')"));
});

test('react site header preserves subtitle rendering', () => {
  const content = read(['app', 'components', 'SiteHeader.jsx']);
  assert.ok(content.includes('className="nav-subtitle"'));
  assert.ok(content.includes('{subtitle}'));
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
  assert.ok(content.includes('https://local-loop-io.github.io/projects/loop-protocol/openapi.json'));
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

  const productSchemaPath = path.join(
    process.cwd(),
    'public',
    'projects',
    'loop-protocol',
    'schemas',
    'v0.2.0',
    'product-dna.schema.json',
  );
  assert.ok(fs.existsSync(productSchemaPath));
});

test('all protocol viewer targets referenced by the site exist in the mirror', () => {
  const appFiles = walk(path.join(process.cwd(), 'app')).filter((filePath) => filePath.endsWith('.js') || filePath.endsWith('.jsx'));
  const referencedTargets = new Set();

  for (const filePath of appFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    for (const match of content.matchAll(/\/viewer\.html\?path=([^"&]+)(?:&title=[^"]*)?/g)) {
      const target = decodeURIComponent(match[1]);
      if (target.startsWith('projects/loop-protocol/')) {
        referencedTargets.add(target);
      }
    }
  }

  const missingTargets = [...referencedTargets]
    .filter((target) => !fs.existsSync(path.join(process.cwd(), 'public', target)))
    .sort();

  assert.deepEqual(missingTargets, []);
});

test('protocol mirror includes required v0.2.0 contract assets', () => {
  const requiredFiles = [
    ['public', 'projects', 'loop-protocol', 'openapi.json'],
    ['public', 'projects', 'loop-protocol', 'DOMAIN-POLICY.md'],
    ['public', 'projects', 'loop-protocol', 'contexts', 'loop-v0.2.0.jsonld'],
    ['public', 'projects', 'loop-protocol', 'schemas', 'product-dna.schema.json'],
    ['public', 'projects', 'loop-protocol', 'schemas', 'v0.2.0', 'product-dna.schema.json'],
    ['public', 'projects', 'loop-protocol', 'examples', '14-product-reuse-registration.json'],
    ['public', 'projects', 'loop-protocol', 'examples', '15-product-offer-flow.json'],
  ];

  for (const segments of requiredFiles) {
    assert.ok(fs.existsSync(path.join(process.cwd(), ...segments)), segments.join('/'));
  }
});

test('aggregate docs script prefers a local source checkout when available', () => {
  const content = read(['scripts', 'aggregate-docs.sh']);
  assert.ok(content.includes('resolve_local_source()'));
  assert.ok(content.includes('DOCS_LOCAL_ROOT'));
  assert.ok(content.includes('ROOT_DIR/../$repo_name'));
  assert.ok(content.includes('from local source'));
});
