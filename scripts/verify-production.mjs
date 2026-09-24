// Verifikasi PRODUCTION yang aman -- HANYA GET/HEAD. Tanpa POST, tanpa form/lead,
// tanpa bypass/secret apa pun. Aman dijalankan berulang.
//
//   node scripts/verify-production.mjs
//   node scripts/verify-production.mjs --base=https://sanomatrassehat.com \
//        --www=https://www.sanomatrassehat.com \
//        --secondary=https://sano-website.vercel.app --expect-secondary=protected|noindex|offline
//   Opsi: --json  --skip-domain-layer (untuk server lokal/emulator)  --skip-oauth-probe
//
// Sumber kebenaran daftar route = sitemap live; bila dist-ssr/prerender-manifest.json
// ada (hasil `npm run build` commit yang sama) sitemap dicocokkan dengannya.
// Hal yang TIDAK bisa/boleh diuji di sini: login CMS penuh, pengiriman lead, event
// iklan, dan pengiriman ulang sitemap (butuh izin/aksi owner terpisah).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MANIFEST = path.join(__dirname, '..', 'dist-ssr', 'prerender-manifest.json');
const arg = (n, d = '') => ((process.argv.find((a) => a.startsWith(`--${n}=`)) || '').split('=').slice(1).join('=')) || d;
const flag = (n) => process.argv.includes(`--${n}`);
const BASE = arg('base', 'https://sanomatrassehat.com').replace(/\/+$/, '');
const WWW = arg('www', BASE.replace('://', '://www.')).replace(/\/+$/, '');
const SECONDARY = arg('secondary').replace(/\/+$/, '');
const EXPECT_SECONDARY = arg('expect-secondary', 'info');
const CANONICAL = 'https://sanomatrassehat.com';
const AS_JSON = flag('json');

const results = [];
const check = (group, name, ok, detail = '') => {
  results.push({ group, name, ok, detail });
  if (!AS_JSON) console.log(`${ok ? 'PASS' : 'FAIL'}  [${group}] ${name}${detail ? '  ' + detail : ''}`);
};
const info = (group, name, detail) => check(group, `${name} (informasi)`, true, detail);

async function req(base, p, method = 'GET') {
  const res = await fetch(base + p, { method, redirect: 'manual', headers: { 'user-agent': 'sano-verify-production/1.0 (read-only)' } });
  const body = method === 'GET' ? await res.text() : '';
  return { status: res.status, headers: res.headers, body };
}
const loc = (r, base = BASE) => {
  const l = r.headers.get('location');
  return l ? new URL(l, base) : null;
};
const one = (s, re) => (s.match(re) || [])[1];
const count = (s, re) => (s.match(re) || []).length;
const isHtml = (r) => /text\/html/.test(r.headers.get('content-type') || '');
const noindexHeader = (r) => /noindex|none/i.test(r.headers.get('x-robots-tag') || '');

// Ikuti redirect lintas host (maks 5 hop); catat rantai.
async function chain(startUrl) {
  const hops = [];
  let cur = new URL(startUrl);
  for (let i = 0; i < 6; i++) {
    const res = await fetch(cur, { redirect: 'manual', headers: { 'user-agent': 'sano-verify-production/1.0 (read-only)' } });
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
      const next = new URL(res.headers.get('location'), cur);
      hops.push(`${res.status} ${cur.pathname}${cur.search} -> ${next.host}${next.pathname}${next.search}`);
      if (hops.length > 5) return { loop: true, hops };
      cur = next;
      continue;
    }
    return { loop: false, hops, final: { url: cur, status: res.status, body: await res.text() } };
  }
  return { loop: true, hops };
}

// ── 0. Sitemap sebagai sumber daftar route ───────────────────────────────
const sm = await req(BASE, '/sitemap.xml');
const locs = [...sm.body.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);
const paths = locs.map((l) => new URL(l).pathname);
check('sitemap', '/sitemap.xml 200 application/xml', sm.status === 200 && /xml/.test(sm.headers.get('content-type') || ''), `status=${sm.status}`);
check('sitemap', `memuat URL (${locs.length}), tanpa duplikat`, locs.length > 0 && new Set(locs).size === locs.length);
check('sitemap', 'semua <loc> di domain canonical, tanpa query/hash, tanpa trailing slash (kecuali beranda)', locs.every((l) => l.startsWith(CANONICAL) && !/[?#]/.test(l) && (l === `${CANONICAL}/` || !l.endsWith('/'))));
check('sitemap', 'tanpa changefreq/priority dan tanpa /admin, /api, 404', !/changefreq|priority|\/admin|\/api|404/.test(sm.body));
const lm = [...sm.body.matchAll(/<lastmod>([^<]*)<\/lastmod>/g)].map((m) => m[1]);
const today = new Date().toISOString().slice(0, 10);
check('sitemap', 'lastmod (bila ada) format YYYY-MM-DD, tidak di masa depan, bukan satu tanggal build seragam untuk semua', lm.every((d) => /^\d{4}-\d{2}-\d{2}$/.test(d) && d <= today) && (lm.length < 3 || new Set(lm).size > 1), `lastmod=${lm.length}, unik=${new Set(lm).size}`);
if (fs.existsSync(MANIFEST)) {
  const m = JSON.parse(fs.readFileSync(MANIFEST, 'utf-8'));
  check('sitemap', `sama dengan manifest build lokal (${m.routes.length} URL)`, m.routes.length === locs.length && m.routes.every((r) => locs.includes(r.url)));
} else {
  info('sitemap', 'manifest lokal tidak ada', 'jalankan `npm run build` di commit yang sama untuk mencocokkan');
}

// ── 1. Lapisan domain: protokol, www, trailing slash ─────────────────────
if (!flag('skip-domain-layer')) {
  const h = new URL(BASE).host;
  const httpApex = await fetch(`http://${h}/`, { redirect: 'manual' });
  check('domain', 'http://apex/ -> https (301/308)', [301, 308].includes(httpApex.status) && (httpApex.headers.get('location') || '').startsWith(`https://${h}`), `status=${httpApex.status}`);
  const w = await req(WWW, '/');
  const wl = loc(w, WWW);
  check('domain', 'https://www/ -> apex (redirect, tanpa 200 duplikat)', [301, 302, 307, 308].includes(w.status) && wl && wl.host === h, `status=${w.status} -> ${wl ? wl.host + wl.pathname : '-'}`);
  info('domain', 'jenis redirect www->apex', `${w.status} (${w.status === 307 || w.status === 302 ? 'sementara: pertimbangkan permanen 308' : 'permanen'})`);
  const c = await chain(`${WWW}/kontak/?utm_source=uji`);
  check('domain', 'www/kontak/?utm_source=uji berakhir di apex /kontak?utm_source=uji (200), tanpa loop, <= 2 hop', !c.loop && c.final.status === 200 && c.final.url.host === h && c.final.url.pathname === '/kontak' && c.final.url.search === '?utm_source=uji' && c.hops.length <= 2, c.hops.join(' ; '));
}

// ── 2. Route publik: status, canonical, H1, metadata, header robots, JSON-LD ──
let homeHtml = '';
for (const p of paths) {
  const r = await req(BASE, p);
  const html = r.body;
  if (p === '/') homeHtml = html;
  const canonical = one(html, /<link rel="canonical" href="([^"]*)"/);
  const expect = p === '/' ? `${CANONICAL}/` : `${CANONICAL}${p}`;
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  let ldOk = ld.length === 1;
  try { if (ldOk) { const j = JSON.parse(ld[0][1]); ldOk = j['@type'] === 'LocalBusiness' && String(j.url || '').startsWith(CANONICAL); } } catch { ldOk = false; }
  const ok =
    r.status === 200 && isHtml(r) &&
    one(html, /data-ssg-path="([^"]*)"/) === p &&
    canonical === expect &&
    count(html, /<h1[\s>]/g) === 1 && count(html, /<title>/g) === 1 && count(html, /<meta name="description"/g) === 1 &&
    !/<meta[^>]+name="robots"[^>]*noindex/i.test(html) &&
    !noindexHeader(r) && ldOk;
  check('route', `${p} -> 200 prerender, self-canonical, 1 H1, metadata, JSON-LD valid, TANPA noindex (meta/header)`, ok,
    ok ? '' : `status=${r.status} ssg=${one(html, /data-ssg-path="([^"]*)"/)} canonical=${canonical} h1=${count(html, /<h1[\s>]/g)} x-robots-tag=${r.headers.get('x-robots-tag')} jsonld=${ld.length}/${ldOk}`);
}
{
  const r = await req(BASE, '/');
  info('route', 'kompresi/cache HTML beranda', `content-encoding=${r.headers.get('content-encoding') || '-'} cache-control=${r.headers.get('cache-control') || '-'} bytes(dekompres)=${r.body.length}`);
  check('tracking', 'GTM dan Meta Pixel tetap ada di HTML beranda (perilaku tracking tidak hilang)', /googletagmanager\.com\/gtm\.js/.test(homeHtml) && /fbq\('init'/.test(homeHtml) && /ttq\.load\(/.test(homeHtml));
}

// ── 3. Trailing slash -> 308, query dipertahankan ────────────────────────
for (const p of paths.filter((x) => x !== '/')) {
  const r = await req(BASE, `${p}/`);
  const l = loc(r);
  check('redirect', `${p}/ -> ${p} (301/308)`, [301, 308].includes(r.status) && l && l.pathname === p, `status=${r.status} -> ${l ? l.pathname : '-'}`);
}
{
  const r = await req(BASE, '/kontak/?utm_source=uji&gclid=abc');
  const l = loc(r);
  check('redirect', 'query dipertahankan pada redirect trailing slash', [301, 308].includes(r.status) && l && l.pathname === '/kontak' && l.search === '?utm_source=uji&gclid=abc', `status=${r.status} -> ${l ? l.pathname + l.search : '-'}`);
  const root = await req(BASE, '/');
  check('redirect', 'beranda "/" tidak di-redirect', root.status === 200);
}

// ── 4. 404: route, API, dan aset tidak dikenal ───────────────────────────
for (const p of ['/url-tidak-ada', '/artikel/slug-tidak-ada', '/klinik-matras/xyz', '/klinik-matras.html', '/index.css', '/spa-fallback.html', '/api/tidak-ada', '/assets/tidak-ada.js', '/tidak-ada.png', '/admin/tidak-ada']) {
  const r = await req(BASE, p);
  const ok = r.status === 404 && (!isHtml(r) || (/<meta name="robots" content="noindex, nofollow"/.test(r.body) && !/<link rel="canonical"/.test(r.body)));
  check('404', `${p} -> 404 (HTML noindex, tanpa canonical)`, ok, ok ? '' : `status=${r.status} type=${r.headers.get('content-type')}`);
}

// ── 5. Admin, header robots, OAuth (GET saja) ────────────────────────────
{
  const a = await req(BASE, '/admin/');
  check('admin', '/admin/ 200 tanpa redirect (trailing slash dipertahankan), HTML Decap, meta noindex', a.status === 200 && isHtml(a) && /decap-cms/.test(a.body) && /<meta name="robots" content="noindex, nofollow"/.test(a.body), `status=${a.status}`);
  check('admin', '/admin/ punya header X-Robots-Tag noindex', noindexHeader(a), `x-robots-tag=${a.headers.get('x-robots-tag')}`);
  const c = await req(BASE, '/admin/config.yml');
  check('admin', '/admin/config.yml 200 (bukan HTML), memuat backend', c.status === 200 && !isHtml(c) && /backend:/.test(c.body), `status=${c.status} type=${c.headers.get('content-type')}`);
  check('admin', '/admin/config.yml punya header noindex', noindexHeader(c), `x-robots-tag=${c.headers.get('x-robots-tag')}`);
  const g = await req(BASE, '/api/lead');
  check('api', 'GET /api/lead 405 JSON (fungsi hidup), Allow: POST', g.status === 405 && /json/.test(g.headers.get('content-type') || '') && /POST/.test(g.headers.get('allow') || ''), `status=${g.status} allow=${g.headers.get('allow')}`);
  const hd = await req(BASE, '/api/lead', 'HEAD');
  check('api', 'HEAD /api/lead 405, bukan HTML/404', hd.status === 405 && !isHtml(hd), `status=${hd.status}`);
  check('api', '/api/lead punya header noindex', noindexHeader(g), `x-robots-tag=${g.headers.get('x-robots-tag')}`);
  if (!flag('skip-oauth-probe')) {
    const o = await req(BASE, '/api/auth');
    const l = loc(o);
    check('oauth', 'GET /api/auth -> 302 ke github.com/login/oauth/authorize', o.status === 302 && l && l.host === 'github.com' && l.pathname === '/login/oauth/authorize', `status=${o.status} -> ${l ? l.host + l.pathname : '-'}`);
    // Hanya parameter NON-rahasia yang diperiksa; client_id & state tidak dicetak.
    check('oauth', 'redirect_uri = https://sanomatrassehat.com/api/callback dan state ada', !!l && l.searchParams.get('redirect_uri') === `${CANONICAL}/api/callback` && !!l.searchParams.get('state') && !!l.searchParams.get('client_id'));
    info('oauth', 'scope OAuth', `scope=${l ? l.searchParams.get('scope') : '-'} (repo = akses luas; pertimbangkan public_repo bila repo publik)`);
    const cb = await req(BASE, '/api/callback');
    check('oauth', 'GET /api/callback tanpa parameter menolak dengan aman (tanpa token)', cb.status === 200 && /authorization:github:error/.test(cb.body) && !/authorization:github:success/.test(cb.body), `status=${cb.status}`);
  }
}
{
  const rb = await req(BASE, '/robots.txt');
  check('robots', '/robots.txt 200, Allow: /, Sitemap canonical, tidak memblokir /admin//api (noindex butuh crawl)', rb.status === 200 && /Allow: \//.test(rb.body) && rb.body.includes(`Sitemap: ${CANONICAL}/sitemap.xml`) && !/Disallow:\s*\/(admin|api)/i.test(rb.body));
}

// ── 6. Aset ──────────────────────────────────────────────────────────────
{
  const js = one(homeHtml, /src="(\/assets\/index-[^"]+\.js)"/);
  const imgs = [...homeHtml.matchAll(/(?:src|poster)="(\/[^"?#]+\.(?:png|jpe?g|webp))"/g)].map((m) => m[1]).slice(0, 3);
  const vids = [...homeHtml.matchAll(/<source[^>]+src="(\/[^"]+\.(?:mp4|webm))"/g)].map((m) => m[1]).slice(0, 1);
  for (const a of [js, ...imgs, ...vids].filter(Boolean)) {
    const r = await req(BASE, a, 'HEAD');
    check('aset', `${a} 200 non-HTML`, r.status === 200 && !isHtml(r), `status=${r.status} type=${r.headers.get('content-type')}`);
  }
  if (js) {
    const r = await req(BASE, js, 'HEAD');
    info('aset', 'cache-control bundle JS', `${r.headers.get('cache-control')} (default Vercel; ber-hash sehingga aman immutable)`);
  }
}

// ── 7. Domain sekunder (opsional) ────────────────────────────────────────
if (SECONDARY) {
  const r = await req(SECONDARY, '/');
  const l = loc(r, SECONDARY);
  const protectedResp = [401, 403].includes(r.status) || (r.status >= 300 && r.status < 400 && l && /vercel\.com/.test(l.host));
  const offline = [404, 410].includes(r.status);
  const noidx = noindexHeader(r) || /<meta[^>]+name="robots"[^>]*noindex/i.test(r.body);
  const canonicalToApex = one(r.body, /<link rel="canonical" href="([^"]*)"/) || '';
  info('sekunder', `${SECONDARY}/`, `status=${r.status} protected=${protectedResp} offline=${offline} noindex=${noidx} canonical=${canonicalToApex || '-'}`);
  if (EXPECT_SECONDARY === 'protected') check('sekunder', 'domain sekunder terlindungi (tidak dapat di-crawl)', protectedResp);
  if (EXPECT_SECONDARY === 'noindex') check('sekunder', 'domain sekunder mengirim noindex', r.status === 200 && noidx);
  if (EXPECT_SECONDARY === 'offline') check('sekunder', 'domain sekunder tidak melayani konten (404/410/dilindungi)', offline || protectedResp);
  if (r.status === 200) check('sekunder', 'canonical halaman sekunder menunjuk ke domain utama', canonicalToApex.startsWith(CANONICAL), `canonical=${canonicalToApex || '-'}`);
}

const failed = results.filter((r) => !r.ok);
if (AS_JSON) console.log(JSON.stringify({ base: BASE, total: results.length, failed: failed.length, results }, null, 2));
else console.log(`\nRINGKASAN ${BASE}: ${results.length - failed.length}/${results.length} lulus, ${failed.length} gagal`);
process.exit(failed.length ? 1 : 0);
