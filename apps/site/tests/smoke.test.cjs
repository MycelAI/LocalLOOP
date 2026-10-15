// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

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
  assert.ok(content.includes('https://loop.urbnia.com/api/openapi.json'));
  assert.ok(content.includes('https://loop.urbnia.com/projects/loop-protocol/openapi.json'));
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

test('aggregate docs script mirrors from the monorepo protocol/ tree', () => {
  const content = read(['scripts', 'aggregate-docs.sh']);
  assert.ok(content.includes('resolve_local_source()'));
  assert.ok(content.includes('DOCS_LOCAL_ROOT'));
  assert.ok(content.includes('loop-protocol) printf \'%s\\n\' "$MONOREPO_ROOT/protocol"'));
  assert.ok(!content.includes('git clone'), 'must not fall back to the archived public repo');
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
  assert.ok(demoScript.includes('const REFRESH_INTERVAL_MS = 5 * 60 * 1000'));
  assert.ok(demoScript.includes('API request limit reached'));
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
  assert.ok(aliases.includes('to="/interest/"'));
  assert.ok(aliases.includes('to="/contribute/"'));
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
    const metadata = calls.find((call) => new RegExp(`path\\s*:\\s*['"]${route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`).test(call));
    assert.ok(canonicalPaths.has(route), `canonical route inventory is missing ${route}`);
    assert.ok(metadata, `${route} must define its own createMetadata path in ${filePath}`);
    assert.match(metadata, /title\s*:/, `${route} is missing a metadata title`);
  }

  const rootLayout = read(['app', 'layout.jsx']);
  assert.ok(rootLayout.includes('metadataBase'));
  assert.ok(!rootLayout.includes('createMetadata'));
});

test('nginx static server declares baseline security headers', () => {
  const conf = read(['security-headers.conf']);
  assert.ok(conf.includes('X-Content-Type-Options'));
  assert.ok(conf.includes('nosniff'));
  assert.ok(conf.includes('X-Frame-Options'));
  assert.ok(conf.includes('SAMEORIGIN'));
  assert.ok(conf.includes('Referrer-Policy'));
  assert.ok(conf.includes('strict-origin-when-cross-origin'));
  assert.ok(conf.includes('Permissions-Policy'));
  assert.ok(conf.includes('camera=()'));
});



test('security.txt is published under .well-known', () => {
  const content = read(['public', '.well-known', 'security.txt']);
  assert.ok(content.includes('Contact: mailto:dev@mycel-ai.de'));
  assert.ok(content.includes('https://loop.urbnia.com'));
});


test('the served Phosphor subset covers every icon the site uses', () => {
  const subset = read(['public', 'assets', 'icons', 'phosphor', 'bold', 'style.css']);
  const sources = [
    ...walk(path.join(process.cwd(), 'app')).filter((file) => /\.(jsx?|mjs)$/.test(file)),
    ...walk(path.join(process.cwd(), 'public', 'assets', 'js')).filter((file) => /\.(jsx?|mjs)$/.test(file)),
    // Static pages served as-is (header partial, protocol mirror index).
    ...walk(path.join(process.cwd(), 'public')).filter((file) => file.endsWith('.html')),
  ];
  const used = new Set();
  for (const file of sources) {
    const text = fs.readFileSync(file, 'utf8');
    for (const match of text.matchAll(/\bph-[a-z0-9-]+/g)) used.add(match[0]);
    for (const match of text.matchAll(/icon="([a-z0-9-]+)"/g)) used.add(`ph-${match[1]}`);
  }
  for (const style of ['ph-bold', 'ph-fill', 'ph-light', 'ph-thin', 'ph-duotone', 'ph-regular']) used.delete(style);
  const missing = [...used].filter((name) => !subset.includes(`.ph-bold.${name}:before`));
  assert.deepEqual(missing, [], `icons missing from the subset (run scripts/subset-phosphor.sh): ${missing.join(', ')}`);
  const font = fs.statSync(path.join(process.cwd(), 'public', 'assets', 'icons', 'phosphor', 'bold', 'Phosphor-Bold.woff2'));
  assert.ok(font.size < 40_000, `icon font should be a subset, got ${font.size} bytes`);
  assert.ok(!fs.existsSync(path.join(process.cwd(), 'public', 'assets', 'icons', 'phosphor', 'fill')), 'the unused fill weight must not be served');
});

test('header and footer use the small logo, not the 1.4 MB source PNG', () => {
  for (const file of ['SiteHeader.jsx', 'SiteFooter.jsx']) {
    const source = read(['app', 'components', file]);
    assert.ok(!source.includes('local-loop-logo.png'), `${file} still loads the full-size logo`);
    assert.ok(source.includes('local-loop-logo-96.webp'));
  }
  const logo = fs.statSync(path.join(process.cwd(), 'public', 'assets', 'local-loop-logo-96.webp'));
  assert.ok(logo.size < 10_000);
});

test('llms.txt summarises the project for AI assistants with canonical links', () => {
  const content = read(['public', 'llms.txt']);
  assert.match(content, /^# localLOOP\n\n> /);
  for (const url of ['https://loop.urbnia.com/protocol/spec/', 'https://loop.urbnia.com/protocol/what-is-loop/', 'https://loop.urbnia.com/api/openapi.json']) {
    assert.ok(content.includes(url), `llms.txt should link ${url}`);
  }
  assert.ok(content.toLowerCase().includes('lab demo only'));
  assert.ok(!/localloop\.urbnia\.com|loop-api\.urbnia\.com/.test(content));
});

test('robots.txt keeps API data out of the index but not its reference', () => {
  const content = read(['public', 'robots.txt']);
  assert.ok(content.includes('Disallow: /api/'));
  assert.ok(content.includes('Allow: /api/docs'));
  assert.ok(content.includes('Allow: /api/openapi.json'));
  assert.ok(content.includes('llms.txt'));
});

test('pages carry a large social card and Organization/WebSite structured data', () => {
  const meta = read(['app', 'config', 'metadata.js']);
  assert.ok(meta.includes("card: 'summary_large_image'"));
  assert.ok(meta.includes("url: '/assets/og-image.png'"));
  assert.ok(meta.includes("'@type': 'Organization'") && meta.includes("'@type': 'WebSite'"));
  assert.ok(fs.existsSync(path.join(process.cwd(), 'public', 'assets', 'og-image.png')));
  assert.ok(read(['app', 'protocol', 'spec', 'page.jsx']).includes('specificationJsonLd()'));
});

test('CSP hash generator splits long hash lists below nginx token limits', async () => {
  const os = require('node:os');
  const { buildCspConf, HASHES_PER_VAR } = await import(path.join(process.cwd(), 'scripts', 'generate-csp-hashes.mjs'));
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'csp-'));
  const scripts = Array.from({ length: 130 }, (_, i) => `<script>self.__next_f.push([1,"chunk-${i}"])</script>`).join('');
  fs.mkdirSync(path.join(dir, 'long'));
  fs.writeFileSync(path.join(dir, 'long', 'index.html'), `<html><body>${scripts}</body></html>`);
  fs.writeFileSync(path.join(dir, 'index.html'), '<html><body><script>a()</script></body></html>');
  const { conf, pages } = buildCspConf(dir);
  assert.equal(pages, 2);
  for (const line of conf.split('\n')) assert.ok(line.length < 3500, `line too long for nginx: ${line.length}`);
  const chunkVars = conf.match(/^map \$uri \$csp_p\d+_\d+ \{$/gm) ?? [];
  assert.equal(chunkVars.length, Math.ceil(130 / HASHES_PER_VAR));
  assert.match(conf, /"\/long\/index\.html" "\$csp_p\d+_0 \$csp_p\d+_1 \$csp_p\d+_2 \$csp_p\d+_3";/);
  assert.equal((conf.match(/sha256-/g) ?? []).length, 131);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('robots.txt allows crawl and points at sitemap', () => {
  const content = read(['public', 'robots.txt']);
  assert.ok(content.includes('Allow: /'));
  assert.ok(content.includes('sitemap.xml'));
});

test('humans.txt exists with lab-demo posture', () => {
  const content = read(['public', 'humans.txt']);
  assert.ok(content.includes('Lab demo only'));
  assert.ok(content.includes('https://loop.urbnia.com'));
});

test('ai.txt documents lab-demo posture', () => {
  const content = read(['public', 'ai.txt']);
  assert.ok(content.includes('Lab demo')); assert.ok(content.includes('dev@mycel-ai.de'));
});

test('ads.txt declares no ads', () => {
  const content = read(['public', 'ads.txt']);
  assert.ok(content.includes('No ads'));
});

test('well-known change-password is an nginx redirect to the security page', () => {
  const conf = read(['nginx.conf']);
  assert.ok(conf.includes('location = /.well-known/change-password'));
  assert.ok(conf.includes('return 302 /docs/security/'));
  assert.ok(!fs.existsSync(path.join(process.cwd(), 'public', '.well-known', 'change-password')), 'static file would shadow the redirect');
});

test('the API is routed by Traefik; nginx only answers /api/ with a JSON 503 fallback', () => {
  const conf = read(['nginx.conf']);
  assert.ok(!conf.includes('proxy_pass'), 'the site nginx must not proxy the API');
  assert.ok(!fs.existsSync(path.join(process.cwd(), 'api-proxy.conf')));
  assert.ok(!read(['Dockerfile']).includes('api-proxy.conf'));
  const block = conf.slice(conf.indexOf('location ^~ /api/'));
  assert.match(block, /return 503 '\{"error":\{"code":"SERVICE_UNAVAILABLE"/);
  assert.match(block, /default_type application\/json;/);
  assert.match(block, /Retry-After/);
});

test('site container runs unprivileged and read-only, behind a Traefik rate limit', () => {
  const dockerfile = read(['Dockerfile']);
  assert.match(dockerfile, /^FROM nginxinc\/nginx-unprivileged:[0-9.]+-alpine@sha256:[0-9a-f]{64}$/m);
  assert.match(dockerfile, /^FROM oven\/bun:[0-9.]+-alpine@sha256:[0-9a-f]{64} AS builder$/m);
  const conf = read(['nginx.conf']);
  assert.match(conf, /listen 8080;/);
  assert.match(conf, /server_tokens off;/);
  const compose = read(['docker-compose.yml']);
  for (const needle of ['no-new-privileges:true', 'cap_drop:\n      - ALL', 'read_only: true', '/tmp:size=16m', 'pids: 64', 'healthcheck:', 'http://127.0.0.1:8080/']) {
    assert.ok(compose.includes(needle), `site compose is missing ${needle}`);
  }
  assert.ok(compose.includes('localloop-site.loadbalancer.server.port=8080'));
  assert.ok(compose.includes('routers.localloop-site.middlewares=localloop-site-ratelimit'));
  assert.ok(compose.includes('localloop-legacy-site.middlewares=localloop-site-ratelimit,'));
  assert.ok(compose.includes('localloop-legacy-api.middlewares=localloop-site-ratelimit,'));
});

test('nginx serves Core-DP profile schemas at their versioned $id paths', () => {
  const conf = read(['nginx.conf']);
  assert.ok(conf.includes('location ^~ /projects/loop-protocol/profiles/core-dp/0.1.0-lab/schemas/'));
  assert.ok(conf.includes('/projects/loop-protocol/profiles/core-dp/schemas/$1 last;'));
  const envelope = JSON.parse(read(['public', 'projects', 'loop-protocol', 'profiles', 'core-dp', 'schemas', 'envelope.schema.json']));
  assert.ok(envelope.$id.startsWith('https://loop.urbnia.com/projects/loop-protocol/profiles/core-dp/0.1.0-lab/schemas/'));
});

test('nginx serves JSON-LD contexts as application/ld+json with CORS', () => {
  const conf = read(['nginx.conf']);
  const block = conf.slice(conf.indexOf('location ~* \\.jsonld$'));
  assert.ok(conf.includes('location ~* \\.jsonld$'), 'missing .jsonld location');
  assert.match(block, /default_type application\/ld\+json;/);
  assert.match(block, /include \/etc\/nginx\/security-headers\.conf;/);
  assert.match(block, /Access-Control-Allow-Origin "\*"/);
});

// Agent cycle stamps. Previously one near-identical test per cycle; now
// data-driven so the coverage is the directory itself. EXPECTED_STAMP_CYCLES
// pins the stamps that must not disappear, while the loop validates every stamp
// present — including ones added later, which the old per-cycle tests missed.
const EXPECTED_STAMP_CYCLES = [
  '041', '045', '049', '053', '057', '061', '065', '069',
  '073', '077', '081', '085', '089', '093', '097',
];

test('agent stamps are present and well formed', () => {
  const stampsDir = path.join(process.cwd(), 'public', 'agent-stamps');
  const files = fs.readdirSync(stampsDir).filter((name) => name.endsWith('.txt')).sort();

  for (const cycle of EXPECTED_STAMP_CYCLES) {
    assert.ok(files.includes(`cycle-${cycle}.txt`), `missing stamp for cycle ${cycle}`);
  }

  for (const file of files) {
    const match = /^cycle-(\d+)\.txt$/.exec(file);
    assert.ok(match, `unexpected file in agent-stamps: ${file}`);
    const content = read(['public', 'agent-stamps', file]);
    assert.ok(
      content.includes(`agent-cycle-${match[1]}`),
      `${file} is missing its agent-cycle-${match[1]} marker`,
    );
    assert.ok(content.includes('lab-demo-only'), `${file} is missing the lab-demo-only posture`);
  }
});


const outDir = path.join(process.cwd(), 'out');
const hasBuild = fs.existsSync(path.join(outDir, 'index.html'));

test('built docs pages contain no literal backticks and exactly one h1', { skip: !hasBuild && 'run `bun run build` first' }, () => {
  const pages = walk(outDir).filter((filePath) => filePath.endsWith('index.html'));
  assert.ok(pages.length > 30, `expected a full export, found ${pages.length} pages`);
  for (const filePath of pages) {
    const html = fs.readFileSync(filePath, 'utf8');
    const main = html.slice(html.indexOf('<main'), html.indexOf('</main>'));
    const text = main.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<pre[\s\S]*?<\/pre>/g, '').replace(/<code[\s\S]*?<\/code>/g, '').replace(/<[^>]+>/g, '');
    assert.ok(!text.includes('`'), `${path.relative(outDir, filePath)} renders a literal backtick`);
    // Alias routes (noindex) render only a client-side redirect and have no heading.
    if (html.includes('name="robots" content="noindex')) continue;
    const h1Count = (main.match(/<h1[\s>]/g) || []).length;
    assert.equal(h1Count, 1, `${path.relative(outDir, filePath)} has ${h1Count} <h1> elements`);
  }
});

test('built pages never skip a heading level (Lighthouse heading-order)', { skip: !hasBuild && 'run `bun run build` first' }, () => {
  const skips = [];
  for (const filePath of walk(outDir).filter((file) => file.endsWith('.html'))) {
    const html = fs.readFileSync(filePath, 'utf8').replace(/<script[\s\S]*?<\/script>/g, '');
    const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((match) => Number(match[1]));
    let previous = 0;
    for (const level of levels) {
      if (level > previous + 1) skips.push(`${path.relative(outDir, filePath)}: h${previous} -> h${level} (${levels.join(',')})`);
      previous = level;
    }
  }
  assert.deepEqual(skips, []);
});

test('built Markdown pages render at build time without comments, remote images or a client toolchain', { skip: !hasBuild && 'run `bun run build` first' }, () => {
  const spec = fs.readFileSync(path.join(outDir, 'protocol', 'spec', 'index.html'), 'utf8');
  assert.ok(spec.includes('class="mermaid-block"'), 'mermaid fences become placeholders');
  assert.ok(!spec.includes('agent-cycle'), 'HTML comment anchors must not reach the page');
  assert.ok(spec.includes('class="hljs'), 'code is highlighted at build time');
  for (const filePath of walk(outDir).filter((file) => file.endsWith('index.html') && !file.includes(`${path.sep}projects${path.sep}`))) {
    const html = fs.readFileSync(filePath, 'utf8');
    assert.ok(!/<img[^>]+src="https?:\/\/(?!loop\.urbnia\.com\/)/.test(html), `${path.relative(outDir, filePath)} renders a remote image the CSP would block`);
  }
  const changelog = fs.readFileSync(path.join(outDir, 'protocol', 'changelog', 'index.html'), 'utf8');
  const checkboxes = changelog.match(/<input[^>]*type="checkbox"[^>]*>/g) || [];
  assert.ok(checkboxes.length > 0, 'the protocol changelog has task-list items');
  for (const box of checkboxes) assert.match(box, /aria-label="(Done|Not done)"/, `task-list checkbox without a label: ${box}`);
});

test('web fonts have metric-matched local fallbacks and icons reserve their box (no swap layout shift)', () => {
  const fonts = read(['public', 'assets', 'css', 'fonts.css']);
  const css = read(['public', 'assets', 'css', 'site.css']);
  for (const family of ['Space Grotesk', 'Fraunces', 'IBM Plex Mono']) {
    assert.ok(fonts.includes(`font-family: '${family} Fallback';`), `${family} has a fallback face`);
    assert.ok(css.includes(`'${family}', '${family} Fallback'`), `${family} stacks list the fallback right after the web font`);
  }
  assert.match(fonts, /size-adjust: [\d.]+%;\s+ascent-override/);
  assert.match(css, /\.ph-bold \{\s+display: inline-block;\s+width: 1em;/);
});

test('the static protocol mirror index is a complete, indexable page', () => {
  const html = read(['public', 'projects', 'loop-protocol', 'index.html']);
  assert.ok(!html.includes('noindex'), 'the mirror index is linked from the site and should be indexable');
  assert.match(html, /<meta name="description" content="[^"]{50,}"/);
  assert.match(html, /<link rel="canonical" href="https:\/\/loop\.urbnia\.com\/projects\/loop-protocol\/"/);
  assert.match(html, /<main id="main-content">[\s\S]+<\/main>/);
  assert.ok(read(['app', 'sitemap.js']).includes("'https://loop.urbnia.com/projects/loop-protocol/'"), 'listed in the sitemap');
  const header = read(['public', 'assets', 'partials', 'site-header.html']);
  assert.ok(header.includes('/assets/local-loop-logo-96.webp') && !header.includes('local-loop-logo.png'), 'the injected header uses the small logo');
  assert.match(read(['public', 'assets', 'css', 'site.css']), /header\[data-site-header\]:empty \{\s+min-height: 89px;/);
});

test('the loop-cost calculator values meet WCAG AA contrast', () => {
  const css = read(['public', 'assets', 'css', 'site.css']);
  const rule = css.slice(css.indexOf('.wil-calc-value {'), css.indexOf('}', css.indexOf('.wil-calc-value {')));
  assert.match(rule, /color: #0f766e;/, '#0d9488 (--accent-2) is only 3.7:1 on white at 12px');
});

test('built 404 page has a title and a canonical link', { skip: !hasBuild && 'run `bun run build` first' }, () => {
  const html = fs.readFileSync(path.join(outDir, '404.html'), 'utf8');
  assert.match(html, /<title>Page not found \| localLOOP<\/title>/);
  assert.ok(html.includes('rel="canonical"'));
  assert.ok(html.includes('noindex'));
});

test('nginx serves the export 404, caches hashed assets, and sends HSTS + CSP', () => {
  const conf = read(['nginx.conf']);
  const headers = read(['security-headers.conf']);
  assert.ok(conf.includes('error_page 404 /404.html'));
  assert.ok(conf.includes('/_next/static/'));
  assert.ok(conf.includes('immutable'));
  assert.ok(headers.includes('Strict-Transport-Security'));
  assert.ok(headers.includes('Content-Security-Policy'));
  assert.ok(headers.includes("connect-src 'self';"), 'the lab API is same-origin (proxied under /api/)');
  assert.ok(!headers.includes('cdn.jsdelivr.net'), 'CSP must not need a CDN once fonts/icons are self-hosted');
  assert.ok(!/script-src[^;]*'unsafe-inline'/.test(headers), 'script-src must use per-page hashes, not unsafe-inline');
  assert.ok(headers.includes('$csp_script_hashes'));
  const dockerfile = read(['Dockerfile']);
  assert.ok(dockerfile.includes('generate-csp-hashes.mjs'), 'image build must generate the CSP hash map');
});

test('no page loads fonts or icons from third-party origins', () => {
  const layout = read(['app', 'layout.jsx']);
  const css = read(['public', 'assets', 'css', 'site.css']);
  assert.ok(!layout.includes('cdn.jsdelivr.net'));
  assert.ok(!css.includes('fonts.googleapis.com'));
  assert.ok(fs.existsSync(path.join(process.cwd(), 'public', 'assets', 'css', 'fonts.css')));
  assert.ok(fs.existsSync(path.join(process.cwd(), 'public', 'assets', 'icons', 'phosphor', 'bold', 'Phosphor-Bold.woff2')));
});

test('licence terms and third-party notices are published with the site', () => {
  // Fonts, icons and the OSM basemap are served publicly, so their licence
  // texts and attributions ship in public/licenses (copied from the repository
  // root by scripts/sync-legal.sh; `scripts/sync-legal.sh --check` guards drift).
  const legalDir = path.join(process.cwd(), 'public', 'licenses');
  for (const file of [
    'LICENSE.txt',
    'NOTICE.txt',
    'THIRD_PARTY_NOTICES.md',
    path.join('LICENSES', 'MIT.txt'),
    path.join('LICENSES', 'CC-BY-SA-4.0.txt'),
    path.join('LICENSES', 'OFL-1.1.txt'),
    path.join('LICENSES', 'ODbL-1.0.txt'),
    path.join('LICENSES', 'LicenseRef-Mycel-Brand.txt'),
  ]) {
    assert.ok(fs.existsSync(path.join(legalDir, file)), `public/licenses/${file} is missing`);
  }
  const notice = read(['public', 'licenses', 'NOTICE.txt']);
  assert.ok(notice.includes('OpenStreetMap contributors'), 'NOTICE must carry the OSM attribution');
  const thirdParty = read(['public', 'licenses', 'THIRD_PARTY_NOTICES.md']);
  for (const component of ['Fraunces', 'Space Grotesk', 'IBM Plex Mono', 'Phosphor', 'highlight.js', 'mermaid', 'three']) {
    assert.ok(thirdParty.includes(component), `third-party notices must list ${component}`);
  }
  const footer = read(['app', 'components', 'SiteFooter.jsx']);
  assert.ok(footer.includes('href="/docs/licenses/"'), 'footer must link to the licence page');
  assert.ok(!footer.includes('All rights reserved'), 'the site is not all-rights-reserved; see LICENSE');
  const licencePage = read(['app', 'docs', 'licenses', 'page.jsx']);
  assert.ok(licencePage.includes('/licenses/THIRD_PARTY_NOTICES.md'));
  assert.ok(licencePage.includes('/licenses/LICENSES/OFL-1.1.txt'));
});

test('security.txt carries the mandatory Expires field and is not about to lapse', () => {
  const txt = read(['public', '.well-known', 'security.txt']);
  const match = txt.match(/^Expires: (\d{4}-\d{2}-\d{2}T[^\s]+)/m);
  assert.ok(match, 'Expires field missing');
  const expires = new Date(match[1]);
  assert.ok(!Number.isNaN(expires.getTime()), 'Expires is not a valid timestamp');
  const daysLeft = (expires.getTime() - Date.now()) / 86_400_000;
  // RFC 9116 recommends under a year; fail 60 days ahead so the renewal is
  // noticed by CI before scanners start rejecting the file.
  assert.ok(daysLeft > 60, `security.txt Expires lapses in ${Math.floor(daysLeft)} days — renew it`);
  assert.ok(daysLeft < 366, 'security.txt Expires must be less than a year out');
});
