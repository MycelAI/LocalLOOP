const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const read = (segments) =>
  fs.readFileSync(path.join(process.cwd(), ...segments), 'utf8');

test('interest page wires interest form hooks', () => {
  const content = read(['app', 'interest', 'page.jsx']);
  assert.ok(content.includes('data-interest-form'));
  assert.ok(content.includes('data-interest-list'));
  assert.ok(content.includes('data-interest-status'));
});

test('viewer uses absolute asset paths', () => {
  const content = read(['public', 'viewer.html']);
  assert.ok(content.includes('href="/assets/css/site.css"'));
  assert.ok(content.includes('src="/assets/js/viewer.js"'));
});

test('public projects directory exists', () => {
  const projectsPath = path.join(process.cwd(), 'public', 'projects', 'loop-protocol');
  assert.ok(fs.existsSync(projectsPath));
});
