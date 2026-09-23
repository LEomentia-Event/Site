/* Auto-generates public/sitemap.xml at build time.
   Combines the static routes with every published blog post fetched live from
   the backend API (/api/blog), so new articles are indexed without manual edits.
   Non-fatal: if the API is unreachable, it still writes the static routes and
   logs a warning (never blocks the build). */
const fs = require('fs');
const path = require('path');

const SITE_URL = (process.env.SITE_URL || 'https://leomentia-event.fr').replace(/\/+$/, '');

function readEnv(key) {
  try {
    const content = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
    const line = content.split('\n').find((l) => l.trim().startsWith(key + '='));
    return line ? line.slice(line.indexOf('=') + 1).trim() : '';
  } catch (e) {
    return '';
  }
}

const API_BASE = (process.env.REACT_APP_BACKEND_URL || readEnv('REACT_APP_BACKEND_URL') || '').replace(/\/+$/, '');
const TODAY = new Date().toISOString().slice(0, 10);

const STATIC_ROUTES = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/services', changefreq: 'monthly', priority: '0.9' },
  { loc: '/galerie', changefreq: 'monthly', priority: '0.8' },
  { loc: '/temoignages', changefreq: 'monthly', priority: '0.7' },
  { loc: '/blog', changefreq: 'weekly', priority: '0.7' },
  { loc: '/contact', changefreq: 'monthly', priority: '0.9' },
  { loc: '/politique-de-confidentialite', changefreq: 'yearly', priority: '0.3' },
  { loc: '/mentions-legales', changefreq: 'yearly', priority: '0.3' },
];

function urlXml({ loc, lastmod, changefreq, priority }) {
  return (
    '  <url>\n' +
    `    <loc>${SITE_URL}${loc}</loc>\n` +
    `    <lastmod>${lastmod}</lastmod>\n` +
    `    <changefreq>${changefreq}</changefreq>\n` +
    `    <priority>${priority}</priority>\n` +
    '  </url>'
  );
}

async function fetchPosts() {
  if (!API_BASE) throw new Error('REACT_APP_BACKEND_URL not set');
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch(`${API_BASE}/api/blog`, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`API responded ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

async function main() {
  let posts = [];
  try {
    posts = await fetchPosts();
    console.log(`[sitemap] fetched ${posts.length} published blog post(s) from API`);
  } catch (e) {
    console.warn(`[sitemap] WARNING: could not fetch blog posts (${e.message}). Writing static routes only.`);
  }

  const entries = STATIC_ROUTES.map((r) => ({ ...r, lastmod: TODAY }));
  for (const p of posts) {
    if (!p || !p.slug || p.is_published === false) continue;
    const lastmod = p.created_at ? new Date(p.created_at).toISOString().slice(0, 10) : TODAY;
    entries.push({ loc: `/blog/${p.slug}`, lastmod, changefreq: 'monthly', priority: '0.6' });
  }

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    entries.map(urlXml).join('\n') +
    '\n</urlset>\n';

  const out = path.join(__dirname, '..', 'public', 'sitemap.xml');
  fs.writeFileSync(out, xml, 'utf8');
  console.log(`[sitemap] wrote ${entries.length} URLs (${entries.length - STATIC_ROUTES.length} blog) -> public/sitemap.xml`);
}

main().catch((e) => {
  console.warn('[sitemap] WARNING: generation failed (non-fatal):', e.message);
  process.exit(0);
});
