#!/usr/bin/env node
// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

// Offline Markdown link checker for the monorepo (Node >= 24, no dependencies).
//
//   node scripts/check-links.mjs                 # relative links + in-repo anchors
//   node scripts/check-links.mjs --external      # also probe http(s) URLs (network)
//   node scripts/check-links.mjs README.md docs  # limit to given files/directories
//
// Scans every *.md file git knows about (tracked, plus untracked files that are
// not ignored, so new docs are checked before their first commit), except the
// generated protocol mirror under apps/site/public/projects/ and node_modules.
// For each Markdown link, image, reference definition and HTML href/src/srcset
// it verifies that relative targets exist and that #anchors match a heading
// slug (GitHub's algorithm) or an explicit id/name in the target Markdown file.
// External URLs are never fetched unless --external is passed.

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const ROOT = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
const EXCLUDED = [/^apps\/site\/public\/projects\//, /(^|\/)node_modules\//];
// Reserved/example hosts and local addresses are placeholders, not real links.
const EXTERNAL_IGNORE = /^https?:\/\/([^/]*\.)?(example\.(com|org|net)|localhost|127\.0\.0\.1|0\.0\.0\.0)([:/]|$)/i;
const EXTERNAL_TIMEOUT_MS = 10_000;
const EXTERNAL_CONCURRENCY = 8;

const args = process.argv.slice(2);
const checkExternal = args.includes('--external');
const filters = args.filter((a) => !a.startsWith('--')).map((a) => path.relative(ROOT, path.resolve(a)));

function listMarkdownFiles() {
  const out = execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard', '--', '*.md'], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  const files = [...new Set(out.split('\0').filter(Boolean))]
    .filter((f) => !EXCLUDED.some((re) => re.test(f)))
    .filter((f) => existsSync(path.join(ROOT, f)));
  if (filters.length === 0) return files.sort();
  return files.filter((f) => filters.some((p) => p === '' || f === p || f.startsWith(`${p}/`))).sort();
}

// Replace fenced code blocks with blanks (keeping line structure) so example
// snippets are not treated as links or headings.
function maskFences(text) {
  const lines = text.split('\n');
  let fence = null;
  const masked = lines.map((line) => {
    const m = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (fence) {
      if (m && m[1][0] === fence[0] && m[1].length >= fence.length && line.trim().replace(/[`~]/g, '') === '') {
        fence = null;
      }
      return '';
    }
    if (m) {
      fence = m[1];
      return '';
    }
    return line;
  });
  return masked.join('\n');
}

// Additionally blank inline code spans (for link extraction only; heading text
// keeps them because they are part of the rendered heading).
function maskCode(text) {
  return maskFences(text).replace(/(`+)(?!`)([\s\S]*?[^`])\1(?!`)/g, (s) => s.replace(/[^\n]/g, ' '));
}

function headingText(raw) {
  return raw
    .replace(/<[^>]+>/g, '')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\[[^\]]*\]/g, '$1')
    .replace(/`/g, '')
    .replace(/(\*\*|__)(.+?)\1/g, '$2')
    .replace(/(^|\W)[*_](.+?)[*_](?=\W|$)/g, '$1$2')
    .trim();
}

// GitHub: lowercase, drop punctuation except "-" and "_", spaces to "-",
// and suffix repeats with -1, -2, ...
function slugger() {
  const seen = new Map();
  return (text) => {
    const base = text.toLowerCase().replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, '').replace(/ /g, '-');
    let slug = base;
    const n = seen.get(base) ?? 0;
    if (n > 0) slug = `${base}-${n}`;
    seen.set(base, n + 1);
    return slug;
  };
}

const anchorCache = new Map();
function anchorsFor(file) {
  if (anchorCache.has(file)) return anchorCache.get(file);
  const anchors = new Set();
  const text = maskFences(readFileSync(file, 'utf8'));
  const slug = slugger();
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const atx = line.match(/^ {0,3}#{1,6}[ \t]+(.*?)(?:[ \t]+#+)?[ \t]*$/);
    if (atx) {
      anchors.add(slug(headingText(atx[1])));
    } else if (/^ {0,3}(=+|-+)[ \t]*$/.test(line) && i > 0) {
      const prev = lines[i - 1];
      if (prev.trim() && !/^ {0,3}([#>|<*+-]|\d+[.)]\s)/.test(prev) && !/^ {0,3}(=+|-+)[ \t]*$/.test(prev)) {
        anchors.add(slug(headingText(prev)));
      }
    }
    for (const m of line.matchAll(/<[a-z][^>]*\s(?:id|name)\s*=\s*["']([^"']+)["']/gi)) anchors.add(m[1]);
  }
  anchorCache.set(file, anchors);
  return anchors;
}

function extractLinks(text) {
  const masked = maskCode(text);
  const links = [];
  const lineStarts = [0];
  for (let i = 0; i < masked.length; i++) if (masked[i] === '\n') lineStarts.push(i + 1);
  const lineOf = (idx) => {
    let lo = 0;
    let hi = lineStarts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (lineStarts[mid] <= idx) lo = mid;
      else hi = mid - 1;
    }
    return lo + 1;
  };
  const push = (url, idx) => {
    if (url) links.push({ url: url.trim(), line: lineOf(idx) });
  };
  // Inline links and images: [text](url "title") / ![alt](<url>)
  for (const m of masked.matchAll(/!?\[(?:[^[\]]|\[[^\]]*\])*\]\(\s*(<[^>]*>|[^\s)]*(?:\([^\s)]*\)[^\s)]*)*)(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?\s*\)/g)) {
    push(m[1].replace(/^<|>$/g, ''), m.index);
  }
  // Reference definitions: [label]: url
  for (const m of masked.matchAll(/^ {0,3}\[[^\]]+\]:[ \t]*<?([^\s>]+)>?/gm)) push(m[1], m.index);
  // Autolinks: <https://...>
  for (const m of masked.matchAll(/<(https?:\/\/[^>\s]+)>/g)) push(m[1], m.index);
  // HTML attributes: href, src, srcset (first URL of each candidate)
  for (const m of masked.matchAll(/<[a-z][^>]*>/gi)) {
    for (const a of m[0].matchAll(/\s(href|src|srcset)\s*=\s*["']([^"']*)["']/gi)) {
      if (a[1].toLowerCase() === 'srcset') {
        for (const candidate of a[2].split(',')) push(candidate.trim().split(/\s+/)[0], m.index);
      } else {
        push(a[2], m.index);
      }
    }
  }
  return links.sort((a, b) => a.line - b.line);
}

const problems = [];
const external = new Map();

function report(file, line, msg) {
  problems.push(`${file}:${line}: ${msg}`);
}

function checkFile(rel) {
  const abs = path.join(ROOT, rel);
  for (const { url, line } of extractLinks(readFileSync(abs, 'utf8'))) {
    if (/^https?:\/\//i.test(url)) {
      if (!EXTERNAL_IGNORE.test(url)) {
        if (!external.has(url)) external.set(url, []);
        external.get(url).push(`${rel}:${line}`);
      }
      continue;
    }
    if (/^(mailto|tel|data|javascript|ftp):/i.test(url) || /^[a-z][a-z0-9+.-]*:/i.test(url)) continue;
    if (url.startsWith('//')) continue;

    const [rawPath, rawAnchor] = splitOnce(url.split('?')[0], '#');
    let target = abs;
    if (rawPath) {
      let decoded;
      try {
        decoded = decodeURIComponent(rawPath);
      } catch {
        decoded = rawPath;
      }
      target = decoded.startsWith('/') ? path.join(ROOT, decoded) : path.resolve(path.dirname(abs), decoded);
      if (!target.startsWith(ROOT)) {
        report(rel, line, `link leaves the repository: ${url}`);
        continue;
      }
      if (!existsSync(target)) {
        report(rel, line, `missing target: ${url}`);
        continue;
      }
    }
    if (rawAnchor === undefined || rawAnchor === '') continue;
    let anchor;
    try {
      anchor = decodeURIComponent(rawAnchor);
    } catch {
      anchor = rawAnchor;
    }
    if (/^L\d+(C\d+)?(-L\d+(C\d+)?)?$/.test(anchor)) continue; // GitHub line anchors
    if (statSync(target).isDirectory()) {
      const readme = ['README.md', 'readme.md'].map((f) => path.join(target, f)).find(existsSync);
      if (!readme) continue;
      target = readme;
    }
    if (!target.endsWith('.md')) continue;
    const anchors = anchorsFor(target);
    if (!anchors.has(anchor) && !anchors.has(anchor.toLowerCase())) {
      report(rel, line, `missing anchor #${anchor} in ${path.relative(ROOT, target)}`);
    }
  }
}

function splitOnce(s, sep) {
  const i = s.indexOf(sep);
  return i === -1 ? [s, undefined] : [s.slice(0, i), s.slice(i + 1)];
}

async function probe(url) {
  const attempt = async (method) => {
    const res = await fetch(url, {
      method,
      redirect: 'follow',
      signal: AbortSignal.timeout(EXTERNAL_TIMEOUT_MS),
      headers: { 'user-agent': 'localloop-check-links/1.0' },
    });
    if (method === 'GET') await res.body?.cancel();
    return res.status;
  };
  try {
    let status = await attempt('HEAD');
    if (status >= 400) status = await attempt('GET');
    return status;
  } catch (err) {
    return err?.name === 'TimeoutError' ? 'timeout' : `error (${err?.cause?.code ?? err?.message ?? err})`;
  }
}

async function checkExternalUrls() {
  const urls = [...external.keys()];
  const failures = [];
  let next = 0;
  const worker = async () => {
    while (next < urls.length) {
      const url = urls[next++];
      const status = await probe(url.split('#')[0]);
      if (typeof status !== 'number' || status >= 400) failures.push({ url, status });
    }
  };
  await Promise.all(Array.from({ length: EXTERNAL_CONCURRENCY }, worker));
  failures.sort((a, b) => a.url.localeCompare(b.url));
  for (const { url, status } of failures) {
    const where = external.get(url);
    problems.push(`${where[0]}: external ${status}: ${url}${where.length > 1 ? ` (+${where.length - 1} more)` : ''}`);
  }
  return urls.length;
}

const files = listMarkdownFiles();
for (const f of files) checkFile(f);
let externalSummary = `${external.size} external URL(s) not checked (pass --external)`;
if (checkExternal) {
  const n = await checkExternalUrls();
  externalSummary = `${n} external URL(s) checked`;
}

if (problems.length > 0) {
  for (const p of problems) console.error(p);
  console.error(`\ncheck-links: ${problems.length} problem(s) in ${files.length} Markdown file(s); ${externalSummary}.`);
  process.exit(1);
}
console.log(`check-links: ${files.length} Markdown file(s) ok; ${externalSummary}.`);
