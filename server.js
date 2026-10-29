import http from 'http';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const COMPRESSIBLE = new Set(['.html', '.css', '.js', '.json', '.svg']);

const server = http.createServer((req, res) => {
  const safePath = decodeURIComponent(req.url.split('?')[0]);
  const relPath = safePath === '/' ? 'index.html' : safePath.replace(/^\/+/, '');
  const filePath = path.join(__dirname, relPath);

  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
      return;
    }

    const isAsset = ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.webp' || ext === '.svg';
    const headers = {
      'Content-Type': contentType,
      'Cache-Control': isAsset ? 'public, max-age=86400' : 'public, max-age=60',
      'X-Content-Type-Options': 'nosniff',
    };

    const acceptEncoding = req.headers['accept-encoding'] || '';
    if (COMPRESSIBLE.has(ext) && acceptEncoding.includes('gzip')) {
      zlib.gzip(content, (gzipErr, compressed) => {
        if (!gzipErr) {
          headers['Content-Encoding'] = 'gzip';
          headers['Vary'] = 'Accept-Encoding';
          res.writeHead(200, headers);
          res.end(compressed);
        } else {
          res.writeHead(200, headers);
          res.end(content);
        }
      });
    } else {
      res.writeHead(200, headers);
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Sparta Fitness release server running at http://localhost:${PORT}/`);
});
