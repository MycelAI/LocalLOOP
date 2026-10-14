#!/usr/bin/env node
// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

// Regenerates THIRD_PARTY_NOTICES.md from the installed node_modules of
// apps/site and apps/backend plus the hand-maintained list of vendored assets
// below. Run after dependency changes and before a release:
//
//   node scripts/third-party-notices.mjs          # rewrite THIRD_PARTY_NOTICES.md
//   node scripts/third-party-notices.mjs --check  # exit 1 if it would change
//
// Requires `bun install` in apps/site and apps/backend. Licence texts for the
// appendix are fetched once from the SPDX license-list-data repository and
// cached in dist/spdx-texts/ (git-ignored). Afterwards run
// `bash scripts/sync-legal.sh` so the copies shipped with the site and the
// backend image are refreshed.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const OUT = join(ROOT, 'THIRD_PARTY_NOTICES.md');
const CACHE = join(ROOT, 'dist', 'spdx-texts');
const check = process.argv.includes('--check');

// package.json lacks a `license` field; value taken from the package's own
// licence file.
const LICENSE_OVERRIDES = { khroma: 'MIT', graphmatch: 'MIT' };

// next is a runtime dependency of the site, but most of its own dependency
// tree only runs at build time. Of next's dependencies, only these end up in
// the static export (out/_next/static); the rest are build-only.
const NEXT_CLIENT_DEPS = ['@swc/helpers'];

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

function resolvePkg(name, fromDir) {
  let dir = fromDir;
  for (;;) {
    const candidate = join(dir, 'node_modules', name, 'package.json');
    if (existsSync(candidate)) return candidate;
    const up = dirname(dir);
    if (up === dir) return null;
    dir = up;
  }
}

/** Production dependency closure starting from `roots`, resolved like Node. */
function closure(treeDir, roots, { skip = new Set() } = {}) {
  const seen = new Map();
  const visit = (name, fromDir, optional) => {
    if (skip.has(name)) return;
    const pkgFile = resolvePkg(name, fromDir);
    if (!pkgFile) {
      if (!optional) throw new Error(`${treeDir}: cannot resolve ${name}; run bun install`);
      return;
    }
    if (seen.has(pkgFile)) return;
    const pkg = readJson(pkgFile);
    seen.set(pkgFile, pkg);
    const dir = dirname(pkgFile);
    for (const dep of Object.keys(pkg.dependencies || {})) visit(dep, dir, false);
    for (const dep of Object.keys(pkg.optionalDependencies || {})) visit(dep, dir, true);
    const peerMeta = pkg.peerDependenciesMeta || {};
    for (const dep of Object.keys(pkg.peerDependencies || {})) {
      if (!peerMeta[dep]?.optional) visit(dep, dir, true);
    }
  };
  for (const root of roots) visit(root, treeDir, false);
  return seen;
}

const LICENSE_FILE = /^(licen[cs]e|copying|notice)([-._].*)?$/i;
const COPYRIGHT_LINE = /(^\W*copyright\s+(?!(notice|holder|owner|law|license|licence|statement|and|of|to|in|for|the above)\b)\S|copyright\s*(\(c\)|©|\d{4})|^\s*\(c\)\s*\d{4}|©\s*\d{4})/i;
const NOT_A_NOTICE = /(above copyright|copyright notice|copyright holders? |\[yyyy\]|\[name of copyright owner\]|<year>|copyright owner or|this copyright)/i;

function licenceFiles(dir) {
  return readdirSync(dir)
    .filter((name) => LICENSE_FILE.test(name))
    .map((name) => join(dir, name))
    .sort();
}

function copyrights(dir) {
  const lines = new Set();
  for (const file of licenceFiles(dir)) {
    if (/^notice/i.test(file.split('/').pop())) continue;
    for (const raw of readFileSync(file, 'utf8').split(/\r?\n/)) {
      const line = raw.replace(/\s+/g, ' ').trim();
      if (COPYRIGHT_LINE.test(line) && !NOT_A_NOTICE.test(line) && line.length < 200) {
        lines.add(line.replace(/^[#*>\s-]+/, ''));
      }
    }
  }
  return [...lines].slice(0, 6);
}

function noticeText(dir) {
  const notice = licenceFiles(dir).find((file) => /^notice/i.test(file.split('/').pop()));
  return notice ? readFileSync(notice, 'utf8').trim() : null;
}

function licenceOf(pkg) {
  if (LICENSE_OVERRIDES[pkg.name]) return LICENSE_OVERRIDES[pkg.name];
  if (typeof pkg.license === 'string') return pkg.license;
  if (pkg.license?.type) return pkg.license.type;
  if (Array.isArray(pkg.licenses)) return pkg.licenses.map((l) => l.type || l).join(' OR ');
  return 'UNKNOWN';
}

function sourceOf(pkg) {
  let url = typeof pkg.repository === 'string' ? pkg.repository : pkg.repository?.url;
  if (!url) return pkg.homepage || `https://www.npmjs.com/package/${pkg.name}`;
  url = url.replace(/^git\+/, '').replace(/\.git$/, '').replace(/^git:\/\//, 'https://');
  if (/^github:/.test(url)) url = `https://github.com/${url.slice(7)}`;
  if (/^[\w.-]+\/[\w.-]+$/.test(url)) url = `https://github.com/${url}`;
  return url;
}

function author(pkg) {
  const a = pkg.author;
  if (!a) return null;
  return typeof a === 'string' ? a.replace(/\s*<[^>]*>/, '').replace(/\s*\([^)]*\)/, '') : a.name;
}

const cell = (s) => String(s).replace(/\|/g, '\\|').replace(/</g, '&lt;').replace(/&lt;br>/g, '<br>');

function rows(entries, treeDir) {
  return [...entries]
    .map(([file, pkg]) => ({ file, pkg }))
    .sort((a, b) => a.pkg.name.localeCompare(b.pkg.name) || a.pkg.version.localeCompare(b.pkg.version))
    .map(({ file, pkg }) => {
      const dir = dirname(file);
      const notices = copyrights(dir);
      const holder = notices.length
        ? notices.join('<br>')
        : `(no copyright line in the licence file${author(pkg) ? `; author: ${author(pkg)}` : ''})`;
      return {
        name: pkg.name,
        version: pkg.version,
        licence: licenceOf(pkg),
        holder,
        source: sourceOf(pkg),
        notice: noticeText(dir),
        path: relative(treeDir, dir),
      };
    });
}

function table(list) {
  const out = ['| Package | Version | Licence | Copyright | Source |', '| --- | --- | --- | --- | --- |'];
  for (const r of list) {
    out.push(`| ${cell(r.name)} | ${cell(r.version)} | ${cell(r.licence)} | ${cell(r.holder)} | ${cell(r.source)} |`);
  }
  return out.join('\n');
}

function idsIn(expression) {
  return expression
    .replace(/[()]/g, ' ')
    .split(/\s+(?:OR|AND|or|and)\s+|\s+/)
    .filter((id) => id && !/^(OR|AND|WITH)$/i.test(id));
}

async function spdxText(id) {
  mkdirSync(CACHE, { recursive: true });
  const cached = join(CACHE, `${id}.txt`);
  if (existsSync(cached)) return readFileSync(cached, 'utf8');
  const url = `https://raw.githubusercontent.com/spdx/license-list-data/main/text/${id}.txt`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`cannot fetch licence text ${id} (${res.status}) from ${url}`);
  const text = await res.text();
  writeFileSync(cached, text);
  return text;
}

// --- Dependency trees -------------------------------------------------------
const siteDir = join(ROOT, 'apps', 'site');
const backendDir = join(ROOT, 'apps', 'backend');
const sitePkg = readJson(join(siteDir, 'package.json'));
const backendPkg = readJson(join(backendDir, 'package.json'));

const siteAll = closure(siteDir, Object.keys(sitePkg.dependencies));
const siteClientRoots = Object.keys(sitePkg.dependencies).filter((name) => name !== 'next');
const siteClient = closure(siteDir, siteClientRoots);
for (const [file, pkg] of closure(siteDir, NEXT_CLIENT_DEPS)) siteClient.set(file, pkg);
const nextFile = resolvePkg('next', siteDir);
siteClient.set(nextFile, readJson(nextFile));
const siteBuildOnly = new Map([...siteAll].filter(([file]) => !siteClient.has(file)));
const backend = closure(backendDir, Object.keys(backendPkg.dependencies));

const siteRows = rows(siteClient, siteDir);
const siteBuildRows = rows(siteBuildOnly, siteDir);
const backendRows = rows(backend, backendDir);

// Licence texts for everything that is distributed (site bundle, backend image).
// dompurify is used under Apache-2.0 (it is offered as MPL-2.0 OR Apache-2.0).
const ELECTIONS = { dompurify: 'Apache-2.0' };
const shipped = [...siteRows, ...backendRows];
const ids = new Set();
for (const r of shipped) for (const id of idsIn(ELECTIONS[r.name] || r.licence)) ids.add(id);
const unknown = [...ids].filter((id) => id === 'UNKNOWN');
if (unknown.length) throw new Error('a shipped package has no licence; add it to LICENSE_OVERRIDES');
const texts = [];
for (const id of [...ids].sort()) texts.push(`### ${id}\n\n\`\`\`text\n${(await spdxText(id)).trim()}\n\`\`\``);

const notices = shipped
  .filter((r) => r.notice)
  .filter((r, i, all) => all.findIndex((o) => o.name === r.name && o.version === r.version) === i)
  .map((r) => `### ${r.name} ${r.version}\n\n\`\`\`text\n${r.notice}\n\`\`\``);

// --- Document -----------------------------------------------------------------
const doc = `<!--
This file is generated by scripts/third-party-notices.mjs; edit the script,
not this file. The "Vendored assets" section is maintained in the script.
-->

# Third-party notices

The localLOOP monorepo (copyright 2025-2026 Alphin Tom / Mycel UG
(haftungsbeschränkt)) includes or is built with the third-party components
listed below. Each component remains under its own licence; nothing here
changes those terms. The project's own terms are in \`LICENSE\` (\`LICENSE.txt\` in the published copy).

- **Site image** (\`apps/site\` Docker image, nginx serving the static
  export): the vendored assets in section 1 and the npm packages in
  section 2.1, which are bundled into \`out/_next/static\`. Copies of this file,
  \`NOTICE\` and the licence texts are published with the site under
  \`/licenses/\`.
- **Backend image** (\`apps/backend\` Docker image): the npm packages in
  section 3, installed with \`bun install --production\` into
  \`/app/node_modules\`, where each keeps its own licence file. This file and
  NOTICE are copied to \`/app\`.
- Packages in section 2.2 are used only to build the site and are not part
  of the site image.

## 1. Vendored assets (committed to the repository)

| Component | Version | Licence | Copyright | Source | Location | Ships in |
| --- | --- | --- | --- | --- | --- | --- |
| Fraunces (web font, latin + latin-ext subsets, weights 300/500/700) | Google Fonts download of 2026-09-04 (font version 1.000) | OFL-1.1 | Copyright 2018 The Fraunces Project Authors (https://github.com/undercasetype/Fraunces) | https://github.com/undercasetype/Fraunces, https://fonts.google.com/specimen/Fraunces | \`apps/site/public/assets/fonts/fraunces-*.woff2\` | site image |
| Space Grotesk (web font, latin + latin-ext subsets, weights 400/500/600/700) | Google Fonts download of 2026-09-04 (font version 2.000) | OFL-1.1 | Copyright 2020 The Space Grotesk Project Authors (https://github.com/floriankarsten/space-grotesk) | https://github.com/floriankarsten/space-grotesk, https://fonts.google.com/specimen/Space+Grotesk | \`apps/site/public/assets/fonts/space-grotesk-*.woff2\` | site image |
| IBM Plex Mono (web font, latin + latin-ext subsets, weights 400/600) | Google Fonts download of 2026-09-04 (font version 2.3) | OFL-1.1 | Copyright © 2017 IBM Corp. with Reserved Font Name "Plex" | https://github.com/IBM/plex, https://fonts.google.com/specimen/IBM+Plex+Mono | \`apps/site/public/assets/fonts/ibm-plex-mono-*.woff2\` | site image |
| Phosphor Icons web font (bold and fill weights, woff2 + style.css) | 2.1.2 (@phosphor-icons/web) | MIT | Copyright (c) 2020-2021 Phosphor Icons | https://github.com/phosphor-icons/web | \`apps/site/public/assets/icons/phosphor/**\` | site image |
| OpenStreetMap basemap (stitched, cropped and tinted from OpenStreetMap raster tiles, zoom 5, Web Mercator window centred on Munich) | baked 2026-09 | Map data: ODbL-1.0 | © OpenStreetMap contributors | https://www.openstreetmap.org/copyright | \`apps/site/public/assets/loop-basemap.webp\` | site image |
| Contributor Covenant (Code of Conduct, adapted) | 3.0 | CC-BY-SA-4.0 | Organization for Ethical Source (steward) | https://www.contributor-covenant.org/version/3/0/ | \`**/CODE_OF_CONDUCT.md\` | site image (protocol copy under \`/projects/loop-protocol/\`) |

Notes:

- The font files are the subsets served by Google Fonts and are not
  otherwise modified. Their embedded name tables carry the families' own
  notices (Fraunces: "Copyright 2020 The Fraunces Project Authors"; IBM Plex
  Mono: "Copyright 2017 IBM Corp. All rights reserved."); the table above
  quotes each family's OFL.txt in https://github.com/google/fonts. "Plex" is
  a Reserved Font Name under the OFL: a modified version of IBM Plex Mono
  must not use that name.
- The Phosphor woff2 files are byte-identical to the files in the
  @phosphor-icons/web 2.1.2 npm tarball; each style.css is that package's
  stylesheet reduced to the woff2 source.
- The basemap is a Produced Work from the OpenStreetMap database. The site
  credits "© OpenStreetMap" with a link to
  https://www.openstreetmap.org/copyright in the corner of the map, which
  states that the data is available under the Open Database License.
- The site's code-highlighting theme is highlight.js
  \`styles/atom-one-dark.css\` ("Atom One Dark by Daniel Gamage", based on
  https://github.com/atom/one-dark-syntax), distributed as part of
  highlight.js under BSD-3-Clause (see section 2.1).

## 2. Site (apps/site)

### 2.1 Bundled into the static export (ships in the site image)

Runtime dependencies of \`apps/site/package.json\` and their production
dependency closure, without the build-only part of next's own dependency
tree. Some of these (for example individual mermaid diagram modules) are
split into chunks that load only on pages that need them.

${table(siteRows)}

### 2.2 Build-time only (not shipped)

${table(siteBuildRows)}

## 3. Backend (apps/backend, ships in the backend image)

Production dependency closure of \`apps/backend/package.json\`
(\`bun install --production\`).

${table(backendRows)}

## 4. NOTICE files of shipped Apache-2.0 components

${notices.length ? notices.join('\n\n') : 'None of the shipped packages include a NOTICE file.'}

## 5. Licence texts

Full texts of the licences used by shipped components (from
https://github.com/spdx/license-list-data). The copyright lines that apply
to each component are listed in the tables above. dompurify is offered under
MPL-2.0 OR Apache-2.0 and is used here under Apache-2.0. The SIL Open Font
License 1.1, the Open Database License 1.0 and CC-BY-SA-4.0 texts are in
\`LICENSES/\` (\`/licenses/LICENSES/\` on the site).

${texts.join('\n\n')}
`;

if (check) {
  const current = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
  if (current !== doc) {
    console.error('THIRD_PARTY_NOTICES.md is out of date: run node scripts/third-party-notices.mjs');
    process.exit(1);
  }
  console.log('THIRD_PARTY_NOTICES.md is up to date');
} else {
  writeFileSync(OUT, doc);
  console.log(
    `wrote THIRD_PARTY_NOTICES.md (site bundled ${siteRows.length}, site build-only ${siteBuildRows.length}, backend ${backendRows.length})`,
  );
}
