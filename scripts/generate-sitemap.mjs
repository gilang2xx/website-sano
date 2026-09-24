// Menulis dist/sitemap.xml dari dist-ssr/prerender-manifest.json yang dibuat
// scripts/prerender.mjs. Artinya sitemap == himpunan halaman yang BENAR-BENAR
// diprerender (daftar route berasal dari satu sumber: seo/routes.ts + artikel
// CMS di content/artikel/*.md). Tidak ada daftar route kedua yang perlu
// dirawat, dan artikel CMS baru otomatis masuk setelah build.
//
// Aturan isi sitemap:
//   - hanya halaman publik, valid, dan indexable (dari manifest);
//   - <loc> = canonical persis (https://sanomatrassehat.com + path);
//   - TIDAK ada admin, API, 404, spa-fallback, redirect, noindex, draft;
//   - <lastmod> hanya bila ada tanggal perubahan konten valid (bukan tanggal build);
//   - tanpa <changefreq>/<priority> (diabaikan Google).
// Skrip ini gagal keras (exit 1) bila ada yang melanggar.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const MANIFEST = path.join(ROOT, 'dist-ssr', 'prerender-manifest.json');

const MAX_URLS = 50000; // batas protokol sitemap
const EXCLUDED_PREFIXES = ['/admin', '/api', '/404', '/spa-fallback', '/_'];
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function fail(message) {
  console.error(`[sitemap] GAGAL: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(MANIFEST)) fail('dist-ssr/prerender-manifest.json tidak ada (jalankan scripts/prerender.mjs dulu)');
const { site, routes } = JSON.parse(fs.readFileSync(MANIFEST, 'utf-8'));
if (site !== 'https://sanomatrassehat.com') fail(`domain canonical tidak sesuai: ${site}`);
if (!Array.isArray(routes) || routes.length === 0) fail('manifest kosong');
if (routes.length > MAX_URLS) fail(`melebihi ${MAX_URLS} URL; pecah menjadi sitemap index`);

const xmlEscape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
const today = new Date().toISOString().slice(0, 10);
const seen = new Set();
const entries = [];

for (const r of routes) {
  const expectedUrl = r.path === '/' ? `${site}/` : `${site}${r.path}`;
  if (!r.indexable) fail(`${r.path}: tidak indexable tetapi ada di manifest`);
  if (EXCLUDED_PREFIXES.some((p) => r.path === p || r.path.startsWith(`${p}/`))) fail(`${r.path}: route dikecualikan tidak boleh masuk sitemap`);
  if (r.url !== expectedUrl) fail(`${r.path}: url manifest "${r.url}" != canonical "${expectedUrl}"`);
  if (seen.has(r.url)) fail(`URL duplikat: ${r.url}`);
  seen.add(r.url);
  if (r.path !== '/' && r.path.endsWith('/')) fail(`${r.path}: trailing slash tidak diizinkan`);

  // File HTML harus ada, self-canonical, dan tidak noindex
  const file = path.join(DIST, r.file);
  if (!fs.existsSync(file)) fail(`${r.path}: file ${r.file} tidak ada di dist/`);
  const html = fs.readFileSync(file, 'utf-8');
  const canonical = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1];
  if (canonical !== r.url) fail(`${r.path}: canonical di ${r.file} ("${canonical}") != ${r.url}`);
  if (/<meta[^>]+name="robots"[^>]*noindex/i.test(html)) fail(`${r.path}: ${r.file} mengandung noindex`);

  if (r.lastmod !== null && r.lastmod !== undefined) {
    if (!ISO_DATE.test(r.lastmod)) fail(`${r.path}: lastmod tidak valid "${r.lastmod}"`);
    if (r.lastmod > today) fail(`${r.path}: lastmod di masa depan "${r.lastmod}"`);
  }
  entries.push(r);
}

const urls = entries
  .map((r) => `  <url>\n    <loc>${xmlEscape(r.url)}</loc>${r.lastmod ? `\n    <lastmod>${r.lastmod}</lastmod>` : ''}\n  </url>`)
  .join('\n');
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

fs.mkdirSync(DIST, { recursive: true });
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), xml, 'utf-8');

// Baca ulang & cocokkan dengan manifest
const written = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf-8');
const locs = [...written.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);
if (locs.length !== entries.length) fail(`jumlah <loc> (${locs.length}) != jumlah route (${entries.length})`);

const withLastmod = entries.filter((e) => e.lastmod).length;
console.log(`[sitemap] dist/sitemap.xml: ${locs.length} URL (${withLastmod} dengan lastmod dari data konten, ${locs.length - withLastmod} tanpa lastmod).`);
