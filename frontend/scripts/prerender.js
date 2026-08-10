/* Static prerendering for the CRA build.
   Serves the build/ folder, renders each route with headless Chrome,
   and writes a static build/<route>/index.html (full HTML incl. <head> meta).
   Designed to NEVER hard-fail the production build (see postbuild "|| ..."). */
const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const BUILD_DIR = path.join(__dirname, '..', 'build');
const PORT = 45678;

const ROUTES = [
  '/',
  '/services',
  '/galerie',
  '/temoignages',
  '/blog',
  '/contact',
  '/politique-de-confidentialite',
  '/mentions-legales',
];

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain',
  '.map': 'application/json',
};

function findChrome() {
  const candidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean);
  for (const c of candidates) {
    try {
      if (fs.existsSync(c)) return c;
    } catch (e) {}
  }
  return null;
}

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let urlPath = decodeURIComponent(req.url.split('?')[0]);
      let filePath = path.join(BUILD_DIR, urlPath);
      if (urlPath === '/' || !path.extname(filePath)) {
        // SPA route -> serve index.html
        filePath = path.join(BUILD_DIR, 'index.html');
      }
      fs.readFile(filePath, (err, data) => {
        if (err) {
          const fallback = path.join(BUILD_DIR, 'index.html');
          fs.readFile(fallback, (e2, d2) => {
            if (e2) {
              res.writeHead(404);
              res.end('not found');
            } else {
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(d2);
            }
          });
          return;
        }
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(data);
      });
    });
    server.listen(PORT, () => resolve(server));
  });
}

async function run() {
  const chrome = findChrome();
  if (!chrome) {
    console.log('[prerender] No Chrome binary found — skipping prerender (CSR fallback).');
    return;
  }
  if (!fs.existsSync(path.join(BUILD_DIR, 'index.html'))) {
    console.log('[prerender] build/index.html missing — skipping.');
    return;
  }

  const server = await startServer();
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: chrome,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    for (const route of ROUTES) {
      const page = await browser.newPage();
      try {
        await page.goto(`http://localhost:${PORT}${route}`, {
          waitUntil: 'networkidle0',
          timeout: 30000,
        });
        await page.evaluate(() => new Promise((r) => setTimeout(r, 600)));
        let html = await page.content();
        html = '<!DOCTYPE html>\n' + html.replace(/^<!DOCTYPE html>/i, '');

        const outDir =
          route === '/' ? BUILD_DIR : path.join(BUILD_DIR, route);
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
        console.log(`[prerender] ${route} -> ${path.relative(BUILD_DIR, path.join(outDir, 'index.html'))}`);
      } catch (e) {
        console.log(`[prerender] Failed ${route}: ${e.message}`);
      } finally {
        await page.close();
      }
    }
  } finally {
    if (browser) await browser.close();
    server.close();
  }
}

run().catch((e) => {
  console.log('[prerender] Skipped due to error:', e.message);
  process.exit(0);
});
