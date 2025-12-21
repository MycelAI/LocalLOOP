#!/usr/bin/env node
const { execSync } = require('node:child_process');

const banned = [
  'loop-protocol.org',
  'localloop.org',
  'local-loop.io',
  'api.local-loop.io',
  'local-loop.eu',
  'materialdna.eu',
];

const rg = `rg -n "(${banned.map((d) => d.replace('.', '\\.')).join('|')})" --hidden --glob '!node_modules/**' --glob '!out/**' --glob '!.next/**'`;

try {
  const output = execSync(rg, { stdio: 'pipe' }).toString().trim();
  if (output) {
    console.error('Banned domains found:');
    console.error(output);
    process.exit(1);
  }
  console.log('Domain check passed.');
} catch (err) {
  if (err.status === 1 && err.stdout && err.stdout.toString().trim()) {
    console.error('Banned domains found:');
    console.error(err.stdout.toString());
    process.exit(1);
  }
  if (err.status === 1) {
    console.log('Domain check passed.');
    process.exit(0);
  }
  console.error(err.message || err);
  process.exit(1);
}
