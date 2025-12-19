import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';

const root = path.resolve(process.cwd(), 'out');
const portIndex = process.argv.indexOf('--port');
const port = portIndex > -1 && process.argv[portIndex + 1]
  ? Number(process.argv[portIndex + 1])
  : 4173;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

function resolvePathname(requestPath) {
  const normalized = requestPath.replace(/\0/g, '');
  const candidates = [];

  if (normalized.endsWith('/')) {
    candidates.push(`${normalized}index.html`);
  }

  candidates.push(normalized);

  if (!path.extname(normalized)) {
    candidates.push(`${normalized}/index.html`);
  }

  for (const candidate of candidates) {
    const candidatePath = path.normalize(path.join(root, candidate));
    if (!candidatePath.startsWith(root)) {
      return null;
    }
    if (fs.existsSync(candidatePath) && fs.statSync(candidatePath).isFile()) {
      return candidatePath;
    }
  }

  return null;
}

const server = http.createServer((req, res) => {
  const requestUrl = req.url ? new URL(req.url, `http://${req.headers.host || 'localhost'}`) : null;
  const pathname = requestUrl ? decodeURIComponent(requestUrl.pathname) : '/';
  const filePath = resolvePathname(pathname);

  if (!filePath) {
    res.statusCode = 404;
    res.end('Not found');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');

  const stream = fs.createReadStream(filePath);
  stream.on('error', () => {
    res.statusCode = 500;
    res.end('Server error');
  });
  stream.pipe(res);
});

server.listen(port, () => {
  console.log(`Static server running at http://127.0.0.1:${port}`);
});

process.on('SIGTERM', () => server.close());
process.on('SIGINT', () => server.close());
