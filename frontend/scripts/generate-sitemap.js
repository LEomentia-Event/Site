/* Auto-generates public/sitemap.xml at build time.
   Combines the static routes with every published blog post fetched live from
   the backend API (/api/blog), and enriches each <url> with <image:image>
   entries (Google image sitemap extension) to boost Google Images visibility.

   Google only uses <image:loc> today (image:title/caption/license were
   deprecated in 2022), so we emit <image:loc> only.

   Non-fatal: if the API is unreachable, it still writes the routes it can and
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
const MAX_GALLERY_IMAGES = 50;

function xmlEscape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Turn an internal path (/images/x.webp) into an absolute URL; keep absolute URLs as-is.
function absolutize(src) {
  if (!src) return null;
  if (/^https?:\/\//i.test(src)) return src;
  return `${SITE_URL}${src.startsWith('/') ? '' : '/'}${src}`;
}

// Static internal images shown on each page.
const STATIC_IMAGES = {
  '/': [
    '/images/hero-poster.webp',
    '/images/virginie-portrait.webp',
    '/images/showcase.webp',
    '/images/service-complete.webp',
    '/images/service-partial.webp',
    '/images/service-coordination.webp',
    '/images/service-custom.webp',
    '/images/cta-background.webp',
  ],
  '/services': [
    '/images/service-complete.webp',
    '/images/service-partial.webp',
    '/images/service-coordination.webp',
    '/images/service-custom.webp',
  ],
};

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

function imagesXml(images) {
  const uniq = [...new Set(images.map(absolutize).filter(Boolean))];
  return uniq
    .map((u) => `    <image:image>\n      <image:loc>${xmlEscape(u)}</image:loc>\n    </image:image>`)
    .join('\n');
}

function urlXml({ loc, lastmod, changefreq, priority, images }) {
  const imgs = images && images.length ? '\n' + imagesXml(images) : '';
  return (
    '  <url>\n' +
    `    <loc>${SITE_URL}${loc}</loc>\n` +
    `    <lastmod>${lastmod}</lastmod>\n` +
    `    <changefreq>${changefreq}</changefreq>\n` +
    `    <priority>${priority}</priority>` +
    imgs +
    '\n  </url>'
  );
}

async function fetchJson(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

async function fetchPosts() {
  if (!API_BASE) throw new Error('REACT_APP_BACKEND_URL not set');
  return fetchJson(`${API_BASE}/api/blog`);
}

async function fetchGalleryImages() {
  if (!API_BASE) return [];
  try {
    const data = await fetchJson(`${API_BASE}/api/drive/albums`);
    const albums = (data && data.albums) || [];
    const urls = [];
    for (const a of albums) {
      for (const img of a.images || []) {
        if (img.full) urls.push(img.full);
      }
    }
    return urls.slice(0, MAX_GALLERY_IMAGES);
  } catch (e) {
    console.warn(`[sitemap] WARNING: gallery images unavailable (${e.message}).`);
    return [];
  }
}

async function main() {
  let posts = [];
  try {
    posts = await fetchPosts();
    console.log(`[sitemap] fetched ${posts.length} published blog post(s) from API`);
  } catch (e) {
    console.warn(`[sitemap] WARNING: could not fetch blog posts (${e.message}). Writing routes without blog entries.`);
  }

  const galleryImages = await fetchGalleryImages();
  if (galleryImages.length) console.log(`[sitemap] added ${galleryImages.length} gallery image(s) to /galerie`);

  const publishedPosts = posts.filter((p) => p && p.slug && p.is_published !== false);
  const blogListImages = publishedPosts.map((p) => p.image_url).filter(Boolean);

  const entries = STATIC_ROUTES.map((r) => {
    let images = STATIC_IMAGES[r.loc] || [];
    if (r.loc === '/galerie') images = galleryImages;
    if (r.loc === '/blog') images = blogListImages;
    return { ...r, lastmod: TODAY, images };
  });

  for (const p of publishedPosts) {
    const lastmod = p.created_at ? new Date(p.created_at).toISOString().slice(0, 10) : TODAY;
    const images = [p.image_url, ...(p.gallery_images || [])].filter(Boolean);
    entries.push({ loc: `/blog/${p.slug}`, lastmod, changefreq: 'monthly', priority: '0.6', images });
  }

  const totalImages = entries.reduce((n, e) => n + (e.images ? new Set(e.images).size : 0), 0);

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n' +
    '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n' +
    entries.map(urlXml).join('\n') +
    '\n</urlset>\n';

  const out = path.join(__dirname, '..', 'public', 'sitemap.xml');
  fs.writeFileSync(out, xml, 'utf8');
  console.log(
    `[sitemap] wrote ${entries.length} URLs (${publishedPosts.length} blog) with ~${totalImages} image tag(s) -> public/sitemap.xml`
  );
}

main().catch((e) => {
  console.warn('[sitemap] WARNING: generation failed (non-fatal):', e.message);
  process.exit(0);
});
