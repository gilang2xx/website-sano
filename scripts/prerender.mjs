// Prerender (SSG) -- dijalankan SETELAH `vite build` (client -> dist/) dan
// `vite build --ssr entry-server.tsx --outDir dist-ssr` (lihat package.json).
// Untuk tiap route publik (daftar dari seo/routes.ts lewat entry-server):
// render React ke HTML, suntikkan ke template dist/index.html (title/description/
// canonical/OG unik + konten halaman), tulis ke dist/<route>/index.html.
//
// Juga menulis dist-ssr/prerender-manifest.json: daftar route yang BENAR-BENAR
// dihasilkan beserta canonical & lastmod. scripts/generate-sitemap.mjs membaca
// manifest ini, jadi sitemap otomatis == halaman yang diprerender.
//
// Sengaja GAGAL KERAS (exit 1) bila ada route/metadata tidak valid, supaya
// publish CMS / commit yang merusak halaman tidak menghasilkan deploy setengah jadi.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SSR_ENTRY = path.join(ROOT, 'dist-ssr', 'entry-server.js');
const MANIFEST = path.join(ROOT, 'dist-ssr', 'prerender-manifest.json');

const errors = [];
const warnings = [];
const err = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);

function fatal(message) {
  console.error(`[prerender] GAGAL: ${message}`);
  process.exit(1);
}

// ── Konsistensi artikel lama ─────────────────────────────────────────────
// Slug/tanggal artikel lama ada di 3 tempat: seo/routes.ts (LEGACY_ARTICLES),
// daftar kartu pages/Artikel.tsx, dan isi pages/ArtikelDetail.tsx. Ketiganya
// HARUS sama; kalau tidak, build gagal.
function legacyFromList(indoDateToIso) {
  const src = fs.readFileSync(path.join(ROOT, 'pages/Artikel.tsx'), 'utf-8');
  const out = new Map();
  for (const m of src.matchAll(/slug:\s*["']([^"']+)["'][\s\S]*?date:\s*["']([^"']+)["']/g)) {
    out.set(m[1], indoDateToIso(m[2]));
  }
  return out;
}

function legacySlugsFromDetail() {
  const src = fs.readFileSync(path.join(ROOT, 'pages/ArtikelDetail.tsx'), 'utf-8');
  return [...src.matchAll(/^\s{4}"([a-z0-9-]+)":\s*\{\s*$/gm)].map((m) => m[1]);
}

// ── Template ─────────────────────────────────────────────────────────────
const HEAD_TAG_PATTERNS = [
  /<title>[\s\S]*?<\/title>\s*/,
  /<meta\s+name="description"[^>]*>\s*/,
  /<link\s+rel="canonical"[^>]*>\s*/,
  /<meta\s+property="og:[^"]*"[^>]*>\s*/g,
  /<meta\s+name="twitter:[^"]*"[^>]*>\s*/g,
];

function buildPage(template, route, html, headTags) {
  let out = template;
  for (const pattern of HEAD_TAG_PATTERNS) out = out.replace(pattern, '');

  const viewport = /<meta\s+name="viewport"[^>]*>/;
  if (!viewport.test(out)) fatal('template index.html tidak punya <meta name="viewport">');
  out = out.replace(viewport, (m) => `${m}\n    ${headTags}`);

  const rootDiv = '<div id="root"></div>';
  if (!out.includes(rootDiv)) fatal('template index.html tidak punya <div id="root"></div>');
  out = out.replace(rootDiv, () => `<div id="root" data-ssg-path="${route}">${html}</div>`);
  return out;
}

function outputFileFor(route) {
  return route === '/'
    ? path.join(DIST, 'index.html')
    : path.join(DIST, route.replace(/^\//, ''), 'index.html');
}

const count = (html, re) => (html.match(re) || []).length;
const attr = (html, re) => (html.match(re) || [])[1];
const unescapeHtml = (s) => s.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

// ── Main ─────────────────────────────────────────────────────────────────
if (!fs.existsSync(path.join(DIST, 'index.html'))) fatal('dist/index.html tidak ada (jalankan vite build dulu)');
if (!fs.existsSync(SSR_ENTRY)) fatal('dist-ssr/entry-server.js tidak ada (jalankan vite build --ssr dulu)');

const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8');


const entry = await import(pathToFileURL(SSR_ENTRY).href);
const { render, renderHeadTags, listPublicRoutes, canonicalUrl, SITE_URL, STATIC_ROUTES, LEGACY_ARTICLES, indoDateToIso } = entry;

// 1) Konsistensi artikel lama
const listMap = legacyFromList(indoDateToIso);
const detailSlugs = legacySlugsFromDetail();
const manifestSlugs = LEGACY_ARTICLES.map((a) => a.slug);
if (listMap.size === 0) fatal('tidak ada artikel lama terdeteksi di pages/Artikel.tsx');
if ([...listMap.keys()].sort().join('|') !== [...manifestSlugs].sort().join('|')) {
  err(`slug artikel lama tidak sama antara seo/routes.ts (${manifestSlugs.join(', ')}) dan pages/Artikel.tsx (${[...listMap.keys()].join(', ')})`);
}
if ([...detailSlugs].sort().join('|') !== [...manifestSlugs].sort().join('|')) {
  err(`slug artikel lama tidak sama antara seo/routes.ts (${manifestSlugs.join(', ')}) dan pages/ArtikelDetail.tsx (${detailSlugs.join(', ')})`);
}
for (const { slug, date } of LEGACY_ARTICLES) {
  if (listMap.has(slug) && listMap.get(slug) !== date) {
    err(`tanggal artikel "${slug}" berbeda: seo/routes.ts=${date}, pages/Artikel.tsx=${listMap.get(slug)}`);
  }
}

// 1b) vercel.json harus konsisten dengan daftar route (redirect trailing slash
// -> tanpa slash, tanpa catch-all rewrite yang membuat soft 404).
{
  const vercel = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf-8'));
  const catchAllSources = new Set(['/(.*)', '/(.+)', '/:path*', '/:path+', '/:path(.*)', '/:path(.+)']);
  for (const rw of vercel.rewrites ?? []) {
    if (catchAllSources.has(rw.source)) err(`vercel.json: rewrite catch-all "${rw.source}" menyebabkan soft 404 (URL tak dikenal harus 404)`);
  }
  const redirects = vercel.redirects ?? [];
  const group = redirects.find((r) => r.source.startsWith('/(') && r.source.endsWith(')/') && !r.source.includes(':'));
  const expected = STATIC_ROUTES.filter((r) => r !== '/').map((r) => r.slice(1)).sort();
  if (!group) {
    err('vercel.json: redirect trailing slash untuk route statis tidak ditemukan (source "/(a|b|...)/")');
  } else {
    const alts = group.source.slice(2, -2).split('|').sort();
    if (alts.join('|') !== expected.join('|')) err(`vercel.json: daftar redirect trailing slash (${alts.join(', ')}) tidak sama dengan STATIC_ROUTES (${expected.join(', ')})`);
    if (group.destination !== '/$1' || group.permanent !== true) err('vercel.json: redirect route statis harus destination "/$1" dan permanent: true');
  }
  const art = redirects.find((r) => r.source === '/artikel/:slug/');
  if (!art || art.destination !== '/artikel/:slug' || art.permanent !== true) err('vercel.json: redirect "/artikel/:slug/" -> "/artikel/:slug" (permanent) tidak ada');
  for (const r of redirects) {
    if (/^[/](admin|api)([/]|$)/.test(r.source) || /(^|[(|])(admin|api)([|)/]|$)/.test(r.source)) err(`vercel.json: redirect tidak boleh menyentuh admin/api: ${r.source}`);
  }
}

// 2) Daftar route
let routes;
try {
  routes = listPublicRoutes();
} catch (e) {
  fatal(e instanceof Error ? e.message : String(e));
}
const routePaths = new Set(routes.map((r) => r.path));
if (routePaths.size !== routes.length) err('ada route duplikat di daftar route publik');

// 3) Render + validasi per route
const manifest = [];
const seenTitles = new Map();
const seenDescriptions = new Map();
const seenCanonicals = new Map();
const rendered = [];

for (const route of routes) {
  const r = route.path;
  let result;
  try {
    result = await render(r);
  } catch (e) {
    fatal(`render ${r} error: ${e instanceof Error ? e.stack || e.message : e}`);
  }
  const { html, head } = result;

  if (!head) { err(`${r}: halaman tidak memanggil useSEO (tidak ada metadata)`); continue; }
  if (head.noindex) err(`${r}: halaman publik memanggil useSEO dengan noindex`);
  if (head.path !== r) err(`${r}: useSEO path "${head.path}" tidak sama dengan route`);
  if (/Tidak Ditemukan/.test(head.title)) err(`${r}: halaman "tidak ditemukan"`);
  if (html.includes('h-16 w-16 border-t-4 border-b-4')) err(`${r}: HTML masih berisi spinner Suspense (lazy belum ter-resolve)`);
  if (html.length < 2000) err(`${r}: HTML terlalu pendek (${html.length} karakter)`);
  const h1 = count(html, /<h1[\s>]/g);
  if (h1 !== 1) err(`${r}: harus tepat 1 <h1>, ditemukan ${h1}`);

  const expectedCanonical = canonicalUrl(r);
  if (head.url !== expectedCanonical) err(`${r}: canonical ${head.url} != ${expectedCanonical}`);

  const page = buildPage(template, r, html, renderHeadTags(head));

  // Metadata di HTML FINAL (yang benar-benar dikirim ke crawler)
  const checks = [
    ['<title>', /<title>/g],
    ['meta description', /<meta name="description"/g],
    ['canonical', /<link rel="canonical"/g],
    ['og:title', /<meta property="og:title"/g],
    ['og:description', /<meta property="og:description"/g],
    ['og:url', /<meta property="og:url"/g],
    ['og:image', /<meta property="og:image"/g],
    ['twitter:card', /<meta name="twitter:card"/g],
  ];
  for (const [label, re] of checks) {
    const n = count(page, re);
    if (n !== 1) err(`${r}: harus tepat 1 ${label} di HTML final, ditemukan ${n}`);
  }
  const canonicalInHtml = attr(page, /<link rel="canonical" href="([^"]*)"/);
  const ogUrl = attr(page, /<meta property="og:url" content="([^"]*)"/);
  const ogImage = unescapeHtml(attr(page, /<meta property="og:image" content="([^"]*)"/) || '');
  if (canonicalInHtml !== expectedCanonical) err(`${r}: canonical di HTML final "${canonicalInHtml}" != "${expectedCanonical}"`);
  if (ogUrl !== expectedCanonical) err(`${r}: og:url "${ogUrl}" != canonical`);
  if (!ogImage.startsWith(`${SITE_URL}/`)) {
    err(`${r}: og:image harus URL absolut di ${SITE_URL} (dapat: "${ogImage}")`);
  } else {
    const imgPath = decodeURIComponent(new URL(ogImage).pathname);
    if (!fs.existsSync(path.join(DIST, imgPath))) err(`${r}: og:image ${imgPath} tidak ada di dist/ (file public hilang)`);
  }
  if (!/<html[^>]*\blang="id"/.test(page)) err(`${r}: <html lang="id"> tidak ditemukan`);
  if (/<meta[^>]+name="robots"[^>]*noindex/i.test(page) || /<meta[^>]+content="[^"]*noindex[^"]*"[^>]+name="robots"/i.test(page)) {
    err(`${r}: halaman publik mengandung noindex`);
  }

  // Keunikan
  const dup = (map, key, label, sink) => {
    if (map.has(key)) sink(`${label} duplikat: "${key.slice(0, 80)}" di ${map.get(key)} dan ${r}`);
    else map.set(key, r);
  };
  dup(seenTitles, head.title, 'title', err);
  dup(seenCanonicals, head.url, 'canonical', err);
  dup(seenDescriptions, head.description, 'description', warn);

  // Panjang (peringatan saja; konten existing tidak diubah pada fase ini)
  if (head.title.length > 60) warn(`${r}: title ${head.title.length} karakter (>60, berpotensi terpotong di SERP)`);
  if (head.description.length < 70 || head.description.length > 160) warn(`${r}: description ${head.description.length} karakter (ideal 70-160)`);

  rendered.push({ route: r, page, head, lastmod: route.lastmod });
}

// 3b) Halaman 404 -> dist/404.html (status 404 dari Vercel bila tak ada rewrite catch-all)
const NOT_FOUND_PROBE = '/halaman-tidak-ditemukan-uji';
let notFoundPage = null;
{
  let nfRes;
  try {
    nfRes = await render(NOT_FOUND_PROBE);
  } catch (e) {
    fatal(`render 404 error: ${e instanceof Error ? e.stack || e.message : e}`);
  }
  if (!nfRes.head || !nfRes.head.noindex) err('404: halaman NotFound harus useSEO({ noindex: true })');
  else {
    const nfH1 = count(nfRes.html, /<h1[\s>]/g);
    if (nfH1 !== 1) err(`404: harus tepat 1 <h1>, ditemukan ${nfH1}`);
    if (nfRes.html.includes('h-16 w-16 border-t-4 border-b-4')) err('404: HTML masih berisi spinner Suspense');
    if (seenTitles.has(nfRes.head.title)) err(`404: title sama dengan ${seenTitles.get(nfRes.head.title)}`);
    notFoundPage = buildPage(template, '*', nfRes.html, renderHeadTags(nfRes.head));
    if (count(notFoundPage, /<link rel="canonical"/g) !== 0) err('404: tidak boleh ada canonical');
    if (count(notFoundPage, /<meta name="robots" content="noindex, nofollow"/g) !== 1) err('404: harus tepat 1 meta robots noindex');
    if (count(notFoundPage, /<title>/g) !== 1) err('404: harus tepat 1 <title>');
    if (count(notFoundPage, /<meta name="description"/g) !== 1) err('404: harus tepat 1 meta description');
  }
}

// 4) Link internal harus menuju route publik / file statis yang ada
for (const { route, page } of rendered) {
  const body = page.slice(page.indexOf('<div id="root"'));
  const hrefs = new Set([...body.matchAll(/<a\s[^>]*?href="(\/[^"]*)"/g)].map((m) => m[1]));
  for (const href of hrefs) {
    if (href.startsWith('//')) continue;
    const p = unescapeHtml(href).split('#')[0].split('?')[0];
    const norm = p.length > 1 ? p.replace(/\/+$/, '') : p;
    if (routePaths.has(norm)) continue;
    if (fs.existsSync(path.join(DIST, decodeURIComponent(p))) && !/\/$/.test(p)) continue;
    err(`${route}: link internal ke "${href}" tidak cocok dengan route publik maupun file statis`);
  }
}

if (warnings.length) {
  console.warn(`[prerender] ${warnings.length} peringatan:`);
  for (const w of warnings) console.warn(`  - ${w}`);
}
if (errors.length) {
  console.error(`[prerender] GAGAL: ${errors.length} error validasi:`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

// 5) Tulis HTML + manifest
for (const { route, page, head, lastmod } of rendered) {
  const file = outputFileFor(route);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, page, 'utf-8');
  manifest.push({
    path: route,
    url: head.url,
    lastmod: lastmod ?? null,
    file: path.relative(DIST, file).split(path.sep).join('/'),
    indexable: true,
  });
}
fs.writeFileSync(path.join(DIST, '404.html'), notFoundPage, 'utf-8');
fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
fs.writeFileSync(MANIFEST, JSON.stringify({ site: SITE_URL, notFound: '404.html', routes: manifest }, null, 2), 'utf-8');

console.log(`[prerender] ${manifest.length} route ter-prerender, ${warnings.length} peringatan, 0 error. 404: dist/404.html. Manifest: ${path.relative(ROOT, MANIFEST)}`);
for (const m of manifest) console.log(`  ${m.path.padEnd(46)} ${m.lastmod ?? '(tanpa lastmod)'}  ${m.file}`);
