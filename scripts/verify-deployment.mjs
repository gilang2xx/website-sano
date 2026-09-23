// Verifikasi HTTP sebuah deployment (Vercel Preview/Production/lokal) -- HANYA GET/HEAD.
//
//   node scripts/verify-deployment.mjs --base=https://<host> [--json]
//
// Butuh hasil build lokal yang SAMA dengan deployment yang diuji (dist/ dan
// dist-ssr/prerender-manifest.json dari `npm run build`). Untuk preview yang
// dilindungi Deployment Protection, beri Protection Bypass lewat environment:
//   VERCEL_BYPASS_SECRET=<secret> node scripts/verify-deployment.mjs --base=...
// Secret HANYA dikirim sebagai header ke host --base dan TIDAK PERNAH dicetak.
//
// Yang diperiksa: status HTTP + canonical + H1 + metadata semua route prerender,
// redirect permanen /x/ -> /x (query dipertahankan, tanpa loop), URL tak dikenal
// = 404 (noindex), sitemap (isi = manifest, tiap URL 200 self-canonical),
// robots.txt, /admin/ (+ config.yml), /api/lead (GET/HEAD saja), dan aset.
// Exit code 1 bila ada pemeriksaan gagal. Catatan: header X-Robots-Tag pada
// Vercel Preview selalu "noindex" (bawaan Vercel), jadi tidak bisa dijadikan
// bukti perilaku production.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const MANIFEST = path.join(ROOT, 'dist-ssr', 'prerender-manifest.json');

const arg = (name) => (process.argv.find((a) => a.startsWith(`--${name}=`)) || '').split('=').slice(1).join('=');
const BASE = arg('base').replace(/\/+$/, '');
const AS_JSON = process.argv.includes('--json');
const SECRET = process.env.VERCEL_BYPASS_SECRET || '';

if (!/^https?:\/\/[^/]+$/.test(BASE)) {
  console.error('Pakai: node scripts/verify-deployment.mjs --base=https://host [--json]');
  process.exit(2);
}
if (!fs.existsSync(MANIFEST)) {
  console.error('dist-ssr/prerender-manifest.json tidak ada. Jalankan `npm run build` (commit yang sama dengan deployment) dulu.');
  process.exit(2);
}
const { site, notFound, routes } = JSON.parse(fs.readFileSync(MANIFEST, 'utf-8'));

const results = [];
const check = (group, name, ok, detail = '') => {
  results.push({ group, name, ok, detail });
  if (!AS_JSON) console.log(`${ok ? 'PASS' : 'FAIL'}  [${group}] ${name}${detail ? '  ' + detail : ''}`);
};

const headers = () => (SECRET ? { 'x-vercel-protection-bypass': SECRET } : {});
// Satu permintaan tanpa mengikuti redirect. Hanya GET/HEAD.
async function req(p, method = 'GET') {
  const res = await fetch(BASE + p, { method, redirect: 'manual', headers: headers() });
  const body = method === 'GET' ? await res.text() : '';
  return { status: res.status, headers: res.headers, body };
}
const loc = (r) => {
  const l = r.headers.get('location');
  if (!l) return null;
  const u = new URL(l, BASE);
  return u.pathname + u.search;
};
// Ikuti redirect (maks 4 hop) dan deteksi loop.
async function follow(p) {
  const hops = [];
  let cur = p;
  for (let i = 0; i < 5; i++) {
    const r = await req(cur);
    if (r.status >= 300 && r.status < 400) {
      const next = loc(r);
      hops.push(`${r.status} ${cur} -> ${next}`);
      if (!next || hops.length > 4 || hops.some((h) => h.startsWith(`${r.status} ${next} `))) return { loop: true, hops, final: r };
      cur = next;
      continue;
    }
    return { loop: false, hops, final: r, finalPath: cur };
  }
  return { loop: true, hops };
}
const one = (s, re) => (s.match(re) || [])[1];
const count = (s, re) => (s.match(re) || []).length;
const isHtml = (r) => /text\/html/.test(r.headers.get('content-type') || '');

// Akses preview harus lolos Deployment Protection dulu
{
  const r = await req('/');
  const blocked = r.status === 401 || r.status === 403 || (r.status >= 300 && r.status < 400 && /vercel\.com\/sso-api|vercel\.com\/login/.test(r.headers.get('location') || ''));
  if (blocked) {
    check('akses', 'tidak diblokir Deployment Protection', false, `status ${r.status} (butuh VERCEL_BYPASS_SECRET yang sah)`);
    console.error(AS_JSON ? '' : '\nBerhenti: deployment terlindungi dan bypass tidak diberikan/tidak valid.');
    process.exit(1);
  }
  check('akses', 'tidak diblokir Deployment Protection', true, SECRET ? '(bypass dipakai; nilai tidak dicetak)' : '(tanpa bypass)');
}

// 1) Route prerender
for (const r of routes) {
  const res = await req(r.path);
  const html = res.body;
  const canonical = one(html, /<link rel="canonical" href="([^"]*)"/);
  const ok =
    res.status === 200 && isHtml(res) &&
    one(html, /data-ssg-path="([^"]*)"/) === r.path &&
    canonical === r.url &&
    count(html, /<h1[\s>]/g) === 1 &&
    count(html, /<title>/g) === 1 &&
    count(html, /<meta name="description"/g) === 1 &&
    count(html, /<link rel="canonical"/g) === 1 &&
    !/<meta[^>]+name="robots"[^>]*noindex/i.test(html);
  check('route', `${r.path} -> 200, self-canonical, 1 H1, metadata unik, tanpa noindex`, ok, ok ? '' : `status=${res.status} canonical=${canonical} h1=${count(html, /<h1[\s>]/g)}`);
}

// 2) Redirect trailing slash -> tanpa slash (permanen, query dipertahankan, tanpa loop)
for (const r of routes.filter((x) => x.path !== '/')) {
  const first = await req(`${r.path}/`);
  const target = loc(first);
  const permanent = first.status === 301 || first.status === 308;
  check('redirect', `${r.path}/ -> ${r.path} (301/308 langsung)`, permanent && target === r.path, `status=${first.status} location=${target}`);
}
{
  const cases = [
    ['/kontak/?utm_source=uji&utm_medium=cpc&gclid=abc', '/kontak?utm_source=uji&utm_medium=cpc&gclid=abc'],
    ['/artikel/konsep-matras-sehat/?fbclid=xyz', '/artikel/konsep-matras-sehat?fbclid=xyz'],
  ];
  for (const [from, to] of cases) {
    const first = await req(from);
    const target = loc(first);
    check('redirect', `query dipertahankan: ${from.split('?')[0]}`, (first.status === 301 || first.status === 308) && target === to, `status=${first.status} location=${target}`);
  }
  const chain = await follow('/klinik-matras/');
  check('redirect', 'tanpa loop, akhir 200 pada /klinik-matras', !chain.loop && chain.final.status === 200 && chain.finalPath === '/klinik-matras' && chain.hops.length === 1, chain.hops.join(' ; '));
  const q = await follow('/kontak/?utm_source=uji');
  check('redirect', 'redirect + query berakhir 200 dan canonical tetap tanpa query', !q.loop && q.final.status === 200 && one(q.final.body, /<link rel="canonical" href="([^"]*)"/) === `${site}/kontak`, q.hops.join(' ; '));
  const root = await req('/');
  check('redirect', 'beranda "/" tidak di-redirect', root.status === 200);
}

// 3) URL tidak dikenal = 404
const unknown = ['/url-tidak-ada', '/artikel/slug-tidak-ada', '/klinik-matras/xyz', '/klinik-matras.html', '/index.css', '/spa-fallback.html', '/api/tidak-ada', '/admin/tidak-ada'];
for (const p of unknown) {
  const res = await req(p);
  const html = res.body;
  const ok = res.status === 404 && (!isHtml(res) || (/<meta name="robots" content="noindex, nofollow"/.test(html) && !/<link rel="canonical"/.test(html) && /Halaman Tidak Ditemukan/.test(html)));
  check('404', `${p} -> 404 (HTML noindex, tanpa canonical)`, ok, ok ? '' : `status=${res.status} type=${res.headers.get('content-type')}`);
}
{
  const nf = await req('/url-tidak-ada/');
  const chain = await follow('/url-tidak-ada/');
  check('404', '/url-tidak-ada/ akhirnya 404 (bukan 200)', chain.final && chain.final.status === 404, `${nf.status} ${chain.hops.join(' ; ')}`);
}

// 4) Sitemap & robots
{
  const sm = await req('/sitemap.xml');
  const locs = [...sm.body.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);
  check('sitemap', '/sitemap.xml 200 application/xml', sm.status === 200 && /xml/.test(sm.headers.get('content-type') || ''), `status=${sm.status} type=${sm.headers.get('content-type')}`);
  check('sitemap', `isi = manifest (${routes.length} URL, tanpa duplikat)`, locs.length === routes.length && new Set(locs).size === locs.length && routes.every((r) => locs.includes(r.url)), `loc=${locs.length}`);
  check('sitemap', 'semua <loc> di domain canonical, tanpa trailing slash/query', locs.every((l) => l.startsWith(`${site}`) && !/[?#]/.test(l) && (l === `${site}/` || !l.endsWith('/'))));
  check('sitemap', 'tanpa changefreq/priority dan tanpa admin/api/404', !/changefreq|priority/.test(sm.body) && !/\/admin|\/api|404/.test(sm.body));
  let bad = [];
  for (const l of locs) {
    const p = new URL(l).pathname;
    const res = await req(p);
    if (res.status !== 200 || one(res.body, /<link rel="canonical" href="([^"]*)"/) !== l) bad.push(`${p}:${res.status}`);
  }
  check('sitemap', 'setiap <loc> dilayani 200 tanpa redirect dan self-canonical', bad.length === 0, bad.join(' '));
  const rb = await req('/robots.txt');
  check('robots', '/robots.txt 200 memuat Sitemap canonical', rb.status === 200 && rb.body.includes(`Sitemap: ${site}/sitemap.xml`), `status=${rb.status}`);
}

// 5) Admin (trailing slash dipertahankan)
{
  const a = await req('/admin/');
  check('admin', '/admin/ -> 200 tanpa redirect, HTML Decap', a.status === 200 && isHtml(a) && /decap-cms/.test(a.body), `status=${a.status}`);
  check('admin', '/admin/ memuat meta robots noindex', /<meta name="robots" content="noindex, nofollow"/.test(a.body));
  const c = await req('/admin/config.yml');
  check('admin', '/admin/config.yml -> 200 (bukan HTML)', c.status === 200 && !isHtml(c) && /backend:/.test(c.body), `status=${c.status} type=${c.headers.get('content-type')}`);
  check('admin', '/admin/ header X-Robots-Tag noindex (Preview selalu menambahkannya; bukan bukti production)', /noindex/i.test(a.headers.get('x-robots-tag') || ''), `x-robots-tag=${a.headers.get('x-robots-tag')}`);
  const noSlash = await req('/admin');
  const target = loc(noSlash);
  check('admin', '/admin (tanpa slash) tidak rusak: 200 atau redirect ke /admin/', noSlash.status === 200 || (noSlash.status >= 300 && noSlash.status < 400 && target === '/admin/'), `status=${noSlash.status} location=${target} (informasi)`);
}

// 6) API (GET/HEAD saja; TIDAK ADA POST)
{
  const g = await req('/api/lead');
  check('api', 'GET /api/lead -> 405 JSON (fungsi hidup, tidak ter-rewrite ke HTML)', g.status === 405 && /json/.test(g.headers.get('content-type') || '') && /Method not allowed/.test(g.body), `status=${g.status} type=${g.headers.get('content-type')}`);
  check('api', 'GET /api/lead Allow: POST', /POST/.test(g.headers.get('allow') || ''), `allow=${g.headers.get('allow')}`);
  const h = await req('/api/lead', 'HEAD');
  check('api', 'HEAD /api/lead -> 405 (bukan 404/HTML)', h.status === 405 && !isHtml(h), `status=${h.status} type=${h.headers.get('content-type')}`);
  check('api', '/api/lead header X-Robots-Tag noindex (Preview selalu menambahkannya)', /noindex/i.test(g.headers.get('x-robots-tag') || ''), `x-robots-tag=${g.headers.get('x-robots-tag')}`);
}

// 7) Aset (bukan HTML, tidak di-redirect/rewrite)
{
  const home = (await req('/')).body;
  const js = one(home, /src="(\/assets\/index-[^"]+\.js)"/);
  const assets = new Set();
  if (js) assets.add(js);
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? (e.name === 'assets' || e.name === 'admin' ? [] : walk(path.join(dir, e.name))) : [path.join(dir, e.name)]));
  const files = walk(DIST).map((f) => '/' + path.relative(DIST, f).split(path.sep).join('/'));
  for (const ext of ['.png', '.jpg', '.webp', '.mp4', '.webm', '.ico', '.svg']) {
    const f = files.find((x) => x.endsWith(ext));
    if (f) assets.add(f);
  }
  const uploads = files.find((x) => x.startsWith('/uploads/'));
  if (uploads) assets.add(uploads);
  for (const a of assets) {
    const res = await req(a, 'HEAD');
    check('aset', `${a} -> 200 non-HTML`, res.status === 200 && !isHtml(res), `status=${res.status} type=${res.headers.get('content-type')}`);
  }
  if (js) {
    const res = await req(js, 'HEAD');
    check('aset', 'bundle JS: Content-Type javascript + cache immutable', /javascript/.test(res.headers.get('content-type') || '') && /immutable/.test(res.headers.get('cache-control') || ''), `cache-control=${res.headers.get('cache-control')}`);
  }
  for (const p of ['/klinik-matras/index.html', '/index.html']) {
    const res = await req(p);
    check('info', `${p} (informasi: duplikat URL bila 200)`, true, `status=${res.status} location=${loc(res)}`);
  }
  check('aset', '/404.html ada di build lokal dan bernama sesuai manifest', notFound === '404.html' && fs.existsSync(path.join(DIST, '404.html')));
}

const failed = results.filter((r) => !r.ok);
if (AS_JSON) console.log(JSON.stringify({ base: BASE, total: results.length, failed: failed.length, results }, null, 2));
else console.log(`\nRINGKASAN ${BASE}: ${results.length - failed.length}/${results.length} lulus, ${failed.length} gagal`);
process.exit(failed.length ? 1 : 0);
