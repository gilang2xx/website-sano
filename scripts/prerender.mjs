// Prerender (SSG) -- dijalankan SETELAH `vite build` (client -> dist/) dan
// `vite build --ssr entry-server.tsx --outDir dist-ssr` (lihat package.json).
// Untuk tiap route publik: render React ke HTML lewat dist-ssr/entry-server.js,
// suntikkan ke template dist/index.html (title/description/canonical/OG unik +
// konten halaman), lalu tulis ke dist/<route>/index.html.
//
// Sengaja GAGAL KERAS (exit 1) bila ada route yang tidak valid, supaya publish
// CMS / commit yang merusak halaman tidak menghasilkan deploy setengah jadi.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SSR_ENTRY = path.join(ROOT, 'dist-ssr', 'entry-server.js');

function fail(message) {
  console.error(`[prerender] GAGAL: ${message}`);
  process.exit(1);
}

// ── Daftar route ─────────────────────────────────────────────────────────
// Slug artikel lama (hardcoded) tersimpan di dua tempat -- daftar
// (pages/Artikel.tsx) dan isi (pages/ArtikelDetail.tsx, key articleDatabase).
// Keduanya dibaca dan HARUS sama, kalau tidak build gagal (mencegah artikel
// yang ada di daftar tapi tidak ter-prerender, atau sebaliknya).
function legacySlugsFromList() {
  const src = fs.readFileSync(path.join(ROOT, 'pages/Artikel.tsx'), 'utf-8');
  return [...src.matchAll(/^\s*slug:\s*["']([^"']+)["']/gm)].map((m) => m[1]);
}

function legacySlugsFromDetail() {
  const src = fs.readFileSync(path.join(ROOT, 'pages/ArtikelDetail.tsx'), 'utf-8');
  return [...src.matchAll(/^\s{4}"([a-z0-9-]+)":\s*\{\s*$/gm)].map((m) => m[1]);
}

// ── Template ─────────────────────────────────────────────────────────────
// Tag <head> per-halaman yang dibuat ulang dari HeadData; versi statis milik
// beranda di index.html dibuang dulu supaya tidak ada duplikat.
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
  if (!viewport.test(out)) fail('template index.html tidak punya <meta name="viewport">');
  out = out.replace(viewport, (m) => `${m}\n    ${headTags}`);

  const rootDiv = '<div id="root"></div>';
  if (!out.includes(rootDiv)) fail('template index.html tidak punya <div id="root"></div>');
  out = out.replace(rootDiv, () => `<div id="root" data-ssg-path="${route}">${html}</div>`);
  return out;
}

function outputFileFor(route) {
  return route === '/'
    ? path.join(DIST, 'index.html')
    : path.join(DIST, route.replace(/^\//, ''), 'index.html');
}

// ── Main ─────────────────────────────────────────────────────────────────
if (!fs.existsSync(path.join(DIST, 'index.html'))) fail('dist/index.html tidak ada (jalankan vite build dulu)');
if (!fs.existsSync(SSR_ENTRY)) fail('dist-ssr/entry-server.js tidak ada (jalankan vite build --ssr dulu)');

const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8');

// Simpan shell SPA asli (tanpa prerender) sebagai fallback untuk URL yang
// tidak ter-prerender. Harus ditulis sebelum dist/index.html ditimpa.
fs.writeFileSync(path.join(DIST, 'spa-fallback.html'), template, 'utf-8');

const { render, renderHeadTags, STATIC_ROUTES, getCmsArticleSlugs } = await import(pathToFileURL(SSR_ENTRY).href);

const listSlugs = legacySlugsFromList();
const detailSlugs = legacySlugsFromDetail();
if (listSlugs.length === 0) fail('tidak ada slug artikel lama terdeteksi di pages/Artikel.tsx');
if ([...listSlugs].sort().join('|') !== [...detailSlugs].sort().join('|')) {
  fail(
    'slug artikel di pages/Artikel.tsx dan pages/ArtikelDetail.tsx tidak sama.\n' +
    `  Artikel.tsx      : ${listSlugs.join(', ')}\n  ArtikelDetail.tsx: ${detailSlugs.join(', ')}`,
  );
}
const cmsSlugs = getCmsArticleSlugs();
const allArticleSlugs = [...new Set([...listSlugs, ...cmsSlugs])];
const routes = [...STATIC_ROUTES, ...allArticleSlugs.map((slug) => `/artikel/${slug}`)];

const seenTitles = new Map();
const seenDescriptions = new Map();
const summary = [];

for (const route of routes) {
  let result;
  try {
    result = await render(route);
  } catch (err) {
    fail(`render ${route} error: ${err instanceof Error ? err.stack || err.message : err}`);
  }
  const { html, head } = result;

  if (!head) fail(`${route}: halaman tidak memanggil useSEO (tidak ada metadata)`);
  if (head.path !== route) fail(`${route}: useSEO path "${head.path}" tidak sama dengan route`);
  if (/Artikel Tidak Ditemukan/.test(head.title)) fail(`${route}: artikel tidak ditemukan`);
  if (html.includes('h-16 w-16 border-t-4 border-b-4')) fail(`${route}: HTML masih berisi spinner Suspense (lazy belum ter-resolve)`);
  const h1Count = (html.match(/<h1[\s>]/g) || []).length;
  if (h1Count !== 1) fail(`${route}: harus tepat 1 <h1>, ditemukan ${h1Count}`);
  if (html.length < 2000) fail(`${route}: HTML terlalu pendek (${html.length} karakter)`);

  if (seenTitles.has(head.title)) fail(`title duplikat: "${head.title}" di ${seenTitles.get(head.title)} dan ${route}`);
  seenTitles.set(head.title, route);
  if (seenDescriptions.has(head.description)) {
    console.warn(`[prerender] PERINGATAN: description sama di ${seenDescriptions.get(head.description)} dan ${route}`);
  }
  seenDescriptions.set(head.description, route);

  const page = buildPage(template, route, html, renderHeadTags(head));
  const file = outputFileFor(route);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, page, 'utf-8');
  summary.push({ route, file: path.relative(ROOT, file), bytes: page.length });
}

console.log(`[prerender] ${summary.length} route ter-prerender (${STATIC_ROUTES.length} statis + ${allArticleSlugs.length} artikel):`);
for (const s of summary) console.log(`  ${s.route.padEnd(48)} ${s.file}  (${(s.bytes / 1024).toFixed(1)} kB)`);
