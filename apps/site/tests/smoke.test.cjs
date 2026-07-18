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

test('markdown doc component exists', () => {
  const content = read(['app', 'components', 'docs', 'MarkdownDoc.jsx']);
  assert.ok(content.includes('MarkdownRenderer'));
  assert.ok(content.includes('filePath'));
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
  assert.ok(content.includes('https://localloop.urbnia.com/projects/loop-protocol/openapi.json'));
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

test('all MarkdownDoc filePaths referenced by the site exist in the mirror', () => {
  const appFiles = walk(path.join(process.cwd(), 'app')).filter((filePath) => filePath.endsWith('.js') || filePath.endsWith('.jsx'));
  const referencedTargets = new Set();

  for (const filePath of appFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    for (const match of content.matchAll(/filePath="(projects\/loop-protocol\/[^"]+)"/g)) {
      referencedTargets.add(match[1]);
    }
  }

  const missingTargets = [...referencedTargets]
    .filter((target) => !fs.existsSync(path.join(process.cwd(), 'public', target)))
    .sort();

  assert.deepEqual(missingTargets, []);
});

test('spec and regulatory pages render their canonical drafts inline via MarkdownDoc', () => {
  const pages = [
    {
      content: read(['app', 'protocol', 'spec', 'page.jsx']),
      filePath: 'projects/loop-protocol/SPECIFICATION.md',
    },
    {
      content: read(['app', 'docs', 'regulatory-alignment', 'page.jsx']),
      filePath: 'projects/loop-protocol/docs/regulatory-alignment-roadmap.md',
    },
  ];

  for (const { content, filePath } of pages) {
    assert.ok(content.includes('MarkdownDoc'));
    assert.ok(content.includes(`filePath="${filePath}"`));
  }
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

test('canonical route inventory includes hidden docs and generated library details', async () => {
  const routes = await import(path.join(process.cwd(), 'app', 'config', 'siteRoutes.js'));
  const paths = routes.getCanonicalPaths();
  for (const expected of [
    '/docs/threat-model',
    '/docs/dpia-lite',
    '/library/schemas/material-dna',
    '/library/examples/product-registration',
  ]) assert.ok(paths.includes(expected), expected);
  for (const alias of routes.nonCanonicalAliases) assert.ok(!paths.includes(alias), alias);
});

test('public demo remains read-only and unsafe claims do not return', () => {
  const demoPage = read(['app', '(platform)', 'platform', 'demo-city', 'page.jsx']);
  const demoScript = read(['public', 'assets', 'js', 'demo-city.js']);
  const platformCopy = [
    read(['app', '(platform)', 'platform', 'materialdna', 'page.jsx']),
    read(['app', '(platform)', 'platform', 'productdna', 'page.jsx']),
    read(['app', '(platform)', 'platform', 'loopcost', 'page.jsx']),
  ].join('\n').toLowerCase();
  assert.ok(demoPage.includes('Public material registration is disabled'));
  assert.ok(demoPage.includes('no backing, currency operation, or settlement is provided'));
  assert.ok(demoPage.includes('would need to define how community-voted signals are proposed, approved, and published'));
  assert.ok(!demoPage.includes('backed by EUR, 6-month expiry'));
  assert.ok(!demoPage.includes('a real node would publish'));
  assert.ok(!demoScript.includes("method: 'POST'"));
  assert.ok(!platformCopy.includes('always cheaper'));
  assert.ok(!platformCopy.includes('fraud prevention'));
  assert.ok(!platformCopy.includes('dpp readiness'));
});

test('interest success copy does not claim immediate public listing', () => {
  const interest = read(['public', 'assets', 'js', 'interest.js']);
  assert.ok(interest.includes('Submission received. Public-list visibility depends on consent and service processing.'));
  assert.ok(!interest.includes('Your submission is now public.'));
});

test('root layout and feature scripts provide the accessibility and route-scoping primitives', () => {
  const layout = read(['app', 'layout.jsx']);
  const routeScripts = read(['app', 'components', 'RouteScripts.jsx']);
  const concepts = read(['app', 'components', 'KeyConceptsShowcase.jsx']);
  assert.ok(layout.includes('Skip to main content'));
  assert.ok(routeScripts.includes("pathname === '/interest'"));
  assert.ok(routeScripts.includes("pathname === '/platform/demo-city'"));
  assert.ok(concepts.includes('role="tablist"'));
  assert.ok(concepts.includes("prefers-reduced-motion"));
});

test('claim audit and route metadata guards reject known unsupported live claims', () => {
  const appFiles = walk(path.join(process.cwd(), 'app'))
    .filter((filePath) => /\.(js|jsx)$/.test(filePath))
    .filter((filePath) => !filePath.includes(`${path.sep}public${path.sep}projects${path.sep}loop-protocol${path.sep}`));
  const siteCopy = appFiles.map((filePath) => fs.readFileSync(filePath, 'utf8')).join('\n').toLowerCase();
  for (const claim of [
    'democratically approved loopsignal',
    'verify that routing decisions are fair',
    'clears net balances between nodes',
    'keeping local exchanges cheapest',
    'dpp-aligned digital passport',
    'espr art. 9-10 aligned',
    'stable, verifiable identifiers',
  ]) assert.ok(!siteCopy.includes(claim), claim);

  const metadata = read(['app', 'config', 'metadata.js']);
  const aliases = [
    read(['app', '(engage)', 'engage', 'page.jsx']),
    read(['app', '(engage)', 'contribute', 'CODE_OF_CONDUCT.md', 'page.jsx']),
  ].join('\n');
  assert.ok(metadata.includes('createAliasMetadata'));
  assert.ok(metadata.includes('index: false'));
  assert.ok(aliases.includes('to="/interest"'));
  assert.ok(aliases.includes('to="/contribute"'));
});

test('feature scripts have an idempotent cleanup contract', () => {
  const loader = read(['app', 'components', 'RouteScripts.jsx']);
  const demo = read(['public', 'assets', 'js', 'demo-city.js']);
  const interest = read(['public', 'assets', 'js', 'interest.js']);
  const metrics = read(['public', 'assets', 'js', 'metrics.js']);
  assert.ok(loader.includes('feature.init()'));
  assert.ok(loader.includes('cleanup?.()'));
  assert.ok(loader.includes('script.remove()'));
  assert.ok(loader.includes('delete features[name]'));
  for (const script of [demo, interest, metrics]) {
    assert.ok(script.includes('activeCleanup()'));
    assert.ok(script.includes('controller.abort()'));
  }
  assert.ok(demo.includes('stream?.close()'));
  assert.ok(demo.includes('clearInterval(refreshTimer)'));
  assert.ok(interest.includes('clearTimeout(retryTimer)'));
});

test('feature scripts reject stale evaluation-time tokens before registration', () => {
  for (const name of ['demo-city.js', 'interest.js', 'metrics.js']) {
    const script = read(['public', 'assets', 'js', name]);
    assert.ok(script.includes('const featureTokens = window.__LOCALLOOP_FEATURE_TOKENS'));
    assert.ok(script.includes('if (featureTokens[NAME] !== featureToken) return;'));
    assert.ok(script.indexOf('if (featureTokens[NAME] !== featureToken) return;') < script.indexOf('features[NAME] = {'));
  }
});

test('every canonical filesystem page owns title and correct canonical path metadata', async () => {
  const routes = await import(path.join(process.cwd(), 'app', 'config', 'siteRoutes.js'));
  const staticPages = walk(path.join(process.cwd(), 'app'))
    .filter((filePath) => filePath.endsWith(`${path.sep}page.jsx`))
    .filter((filePath) => !filePath.includes(`${path.sep}[`))
    .map((filePath) => {
      const segments = path.relative(path.join(process.cwd(), 'app'), path.dirname(filePath))
        .split(path.sep)
        .filter((segment) => !/^\(.+\)$/.test(segment));
      return { filePath, route: segments.length ? `/${segments.join('/')}` : '/' };
    })
    .filter(({ route }) => !routes.nonCanonicalAliases.includes(route));

  const canonicalPaths = new Set(routes.getCanonicalPaths());
  for (const { filePath, route } of staticPages) {
    const content = fs.readFileSync(filePath, 'utf8');
    const calls = [...content.matchAll(/createMetadata\(\s*\{([\s\S]*?)\}\s*\)/g)].map((match) => match[1]);
    const metadata = calls.find((call) => new RegExp(`path\\s*:\\s*['\"]${route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['\"]`).test(call));
    assert.ok(canonicalPaths.has(route), `canonical route inventory is missing ${route}`);
    assert.ok(metadata, `${route} must define its own createMetadata path in ${filePath}`);
    assert.match(metadata, /title\s*:/, `${route} is missing a metadata title`);
  }

  const rootLayout = read(['app', 'layout.jsx']);
  assert.ok(rootLayout.includes('metadataBase'));
  assert.ok(!rootLayout.includes('createMetadata'));
});
