/* Notifies search engines that the site's URLs changed, via the IndexNow
   protocol (used by Bing, Yandex, Seznam, Naver...). Runs after the build
   (postbuild) so every deploy triggers an instant re-crawl request.

   NOTE: Google's classic sitemap "ping" endpoint was retired in 2023 (returns
   404) and Google does NOT use IndexNow. For Google we rely on the
   `Sitemap:` directive in robots.txt + accurate <lastmod> + a one-time
   Search Console submission — no automated ping is possible/useful.

   This step is non-fatal: any error is logged and the build still succeeds.
   Set INDEXNOW_DRY_RUN=1 to print the payload without sending it. */
const fs = require('fs');
const path = require('path');

const KEY = '08707e445e5155f0dfbf20c2af8eb784';
const SITE_URL = (process.env.SITE_URL || 'https://leomentia-event.fr').replace(/\/+$/, '');
const HOST = SITE_URL.replace(/^https?:\/\//, '');
const DRY_RUN = process.env.INDEXNOW_DRY_RUN === '1';
const ENDPOINT = 'https://api.indexnow.org/indexnow';

function readSitemapUrls() {
  const candidates = [
    path.join(__dirname, '..', 'build', 'sitemap.xml'),
    path.join(__dirname, '..', 'public', 'sitemap.xml'),
  ];
  const file = candidates.find((p) => fs.existsSync(p));
  if (!file) return [];
  const xml = fs.readFileSync(file, 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

async function main() {
  const urlList = readSitemapUrls();
  if (!urlList.length) {
    console.warn('[indexnow] no sitemap URLs found — skipping.');
    return;
  }

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: `${SITE_URL}/${KEY}.txt`,
    urlList,
  };

  if (DRY_RUN) {
    console.log(`[indexnow] DRY RUN — would notify ${urlList.length} URL(s):`);
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    // IndexNow returns 200 (accepted) or 202 (received, pending validation)
    if (res.ok || res.status === 202) {
      console.log(`[indexnow] notified ${urlList.length} URL(s) — HTTP ${res.status}`);
    } else {
      console.warn(`[indexnow] WARNING: endpoint responded HTTP ${res.status} (non-fatal).`);
    }
  } catch (e) {
    console.warn(`[indexnow] WARNING: notification failed (${e.message}) — non-fatal.`);
  } finally {
    clearTimeout(t);
  }
}

main().catch((e) => {
  console.warn('[indexnow] WARNING: unexpected error (non-fatal):', e.message);
  process.exit(0);
});
