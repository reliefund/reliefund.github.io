const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = 3000;
const ROOT = path.resolve(__dirname);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // Security & Best Practice Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.razorpay.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.razorpay.com; frame-src https://pages.razorpay.com https://rzp.io; object-src 'none'; base-uri 'self';");

  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  } else if (reqPath === '/favicon.ico') {
    reqPath = '/assets/images/logo.svg';
  }

  const filePath = path.join(ROOT, reqPath);

  // Security: prevent directory traversal
  if (!filePath.startsWith(ROOT)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME_TYPES[ext] || 'application/octet-stream';
    const etag = `W/"${stats.size}-${stats.mtimeMs}"`;

    res.setHeader('Content-Type', mime);
    res.setHeader('ETag', etag);

    // Efficient Cache Lifetimes
    if (['.jpg', '.jpeg', '.png', '.webp', '.svg', '.css', '.js'].includes(ext)) {
      res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=60');
    }

    // Handle conditional GET
    if (req.headers['if-none-match'] === etag) {
      res.statusCode = 304;
      res.end();
      return;
    }

    if (req.method === 'HEAD') {
      res.statusCode = 200;
      res.end();
      return;
    }

    const acceptEncoding = req.headers['accept-encoding'] || '';
    const shouldGzip = ['.html', '.css', '.js', '.json', '.txt', '.svg', '.xml'].includes(ext);

    if (shouldGzip && acceptEncoding.includes('gzip')) {
      res.setHeader('Content-Encoding', 'gzip');
      const raw = fs.createReadStream(filePath);
      const gzip = zlib.createGzip();
      raw.pipe(gzip).pipe(res);
    } else {
      res.setHeader('Content-Length', stats.size);
      const raw = fs.createReadStream(filePath);
      raw.pipe(res);
    }
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`High-performance server running on http://127.0.0.1:${PORT}`);
});
