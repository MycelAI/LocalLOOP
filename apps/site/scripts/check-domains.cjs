#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

// Scan is implemented in Node rather than shelling out to rg/grep. The previous
// version picked rg when available and grep otherwise, and the two disagreed:
// rg was invoked with no path argument, so under execSync (stdin is a pipe) it
// searched empty stdin instead of the working tree and reported a pass. CI has
// no rg, fell through to grep, scanned properly, and failed. Doing the walk here
// keeps local and CI results identical.

const banned = [
  'local-loop-io.github.io',
  'loop-protocol.org',
  'localloop.org',
  'local-loop.io',
  'api.local-loop.io',
  'local-loop.eu',
  'materialdna.eu',
];

const SKIP_DIRS = new Set(['node_modules', 'out', '.next', '.git', 'test-results', 'playwright-report']);

// Documents that must be able to name a disallowed domain in order to describe
// it. DOMAIN-POLICY.md is skipped by basename because the policy is also
// mirrored under public/projects/; the rest are anchored to repo-relative paths
// so that a mirrored public/**/CHANGELOG.md is still scanned.
const SKIP_BASENAMES = new Set(['DOMAIN-POLICY.md']);
const SKIP_PATHS = new Set([path.join('scripts', 'check-domains.cjs'), 'CHANGELOG.md']);

const pattern = new RegExp(
  `(${banned.map((d) => d.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
);

const root = path.resolve(__dirname, '..');
const findings = [];

const isBinary = (buf) => buf.includes(0);

const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(root, full);

    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(full);
      continue;
    }
    if (!entry.isFile()) continue;
    if (SKIP_BASENAMES.has(entry.name) || SKIP_PATHS.has(rel)) continue;

    const buf = fs.readFileSync(full);
    if (isBinary(buf)) continue;

    buf
      .toString('utf8')
      .split('\n')
      .forEach((line, index) => {
        if (pattern.test(line)) {
          findings.push(`${rel}:${index + 1}: ${line.trim()}`);
        }
      });
  }
};

walk(root);

if (findings.length > 0) {
  console.error('Banned domains found:');
  for (const finding of findings) {
    console.error(finding);
  }
  process.exit(1);
}

console.log(`Domain check passed (${banned.length} patterns).`);
