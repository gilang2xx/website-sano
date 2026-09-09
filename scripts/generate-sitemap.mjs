// Runs after `vite build` (see package.json "build" script) and writes
// dist/sitemap.xml. Two article sources are merged: (1) the 6 legacy
// articles, read straight out of pages/Artikel.tsx source text, and (2)
// new articles published via the CMS (content/artikel/*.md). Either way,
// a new /artikel/:slug entry appears in the sitemap automatically the next
// time the site is built/deployed -- no manual sitemap editing needed.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fm from 'front-matter';

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

function getLegacyArticleRoutes() {
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

function getCmsArticleRoutes() {
  const dir = path.join(ROOT, 'content/artikel');
  if (!fs.existsSync(dir)) return [];

  const today = new Date().toISOString().slice(0, 10);
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
      const { attributes } = fm(raw);
      const slug = file.replace(/\.md$/, '');
      return {
        path: `/artikel/${slug}`,
        priority: '0.6',
        changefreq: 'monthly',
        // Tanggal artikel CMS sudah ISO dari frontmatter, tidak perlu di-parse.
        lastmod: attributes.date || today,
      };
    });
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

const legacyArticleRoutes = getLegacyArticleRoutes();
const cmsArticleRoutes = getCmsArticleRoutes();
const routes = [...STATIC_ROUTES, ...legacyArticleRoutes, ...cmsArticleRoutes];
const xml = buildXml(routes);

const outDir = path.join(ROOT, 'dist');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'sitemap.xml'), xml, 'utf-8');

console.log(
  `[sitemap] Wrote dist/sitemap.xml with ${routes.length} URLs ` +
  `(${legacyArticleRoutes.length} legacy articles + ${cmsArticleRoutes.length} CMS articles).`,
);
