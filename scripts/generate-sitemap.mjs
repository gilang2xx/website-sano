// Runs after `vite build` (see package.json "build" script) and writes
// dist/sitemap.xml. Article URLs are read straight out of pages/Artikel.tsx
// so a new /artikel/:slug entry appears in the sitemap automatically the
// next time the site is built/deployed -- no manual sitemap editing needed.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SITE_URL = 'https://sanomatrassehat.com';

const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/klinik-matras', priority: '0.9', changefreq: 'monthly' },
  { path: '/klinik-sofa', priority: '0.9', changefreq: 'monthly' },
  { path: '/sano-clean', priority: '0.9', changefreq: 'monthly' },
  { path: '/layanan', priority: '0.8', changefreq: 'monthly' },
  { path: '/pricelist', priority: '0.7', changefreq: 'monthly' },
  { path: '/artikel', priority: '0.7', changefreq: 'weekly' },
  { path: '/before-after', priority: '0.6', changefreq: 'monthly' },
  { path: '/kontak', priority: '0.6', changefreq: 'yearly' },
  { path: '/tentang-kami', priority: '0.5', changefreq: 'yearly' },
  { path: '/kebijakan-privasi', priority: '0.3', changefreq: 'yearly' },
];

const INDO_MONTHS = {
  jan: '01', feb: '02', mar: '03', apr: '04', mei: '05', jun: '06',
  jul: '07', agu: '08', ags: '08', sep: '09', okt: '10', nov: '11', des: '12',
};

function parseIndoDate(raw) {
  const match = /^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/.exec(raw.trim());
  if (!match) return null;
  const [, day, monthName, year] = match;
  const month = INDO_MONTHS[monthName.toLowerCase().slice(0, 3)];
  if (!month) return null;
  return `${year}-${month}-${day.padStart(2, '0')}`;
}

function getArticleRoutes() {
  const source = fs.readFileSync(path.join(ROOT, 'pages/Artikel.tsx'), 'utf-8');
  // Each article object lists `slug` before `date`, e.g.:
  //   slug: "konsep-matras-sehat",
  //   ...
  //   date: "27 Des 2025",
  const entryRegex = /slug:\s*["']([^"']+)["'][\s\S]*?date:\s*["']([^"']+)["']/g;
  const today = new Date().toISOString().slice(0, 10);
  const routes = [];
  let match;
  while ((match = entryRegex.exec(source)) !== null) {
    const [, slug, dateRaw] = match;
    routes.push({
      path: `/artikel/${slug}`,
      priority: '0.6',
      changefreq: 'monthly',
      lastmod: parseIndoDate(dateRaw) || today,
    });
  }
  return routes;
}

function buildXml(routes) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = routes
    .map(({ path: routePath, priority, changefreq, lastmod }) => `  <url>
    <loc>${SITE_URL}${routePath}</loc>
    <lastmod>${lastmod || today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

const routes = [...STATIC_ROUTES, ...getArticleRoutes()];
const xml = buildXml(routes);

const outDir = path.join(ROOT, 'dist');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'sitemap.xml'), xml, 'utf-8');

console.log(`[sitemap] Wrote dist/sitemap.xml with ${routes.length} URLs (${routes.length - STATIC_ROUTES.length} articles).`);
