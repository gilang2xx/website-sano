// Verifikasi JSON-LD BlogPosting + LocalBusiness pada SEMUA halaman artikel
// sebuah deployment (Vercel Preview/Production/lokal) -- HANYA GET.
//
//   node scripts/verify-article-schema.mjs --base=https://<host> [--json]
//
// Untuk Preview yang dilindungi Deployment Protection, beri Protection Bypass
// lewat environment (PowerShell):
//   $env:VERCEL_BYPASS_SECRET = "..."
//   node scripts/verify-article-schema.mjs --base=https://<preview-host>
// Secret HANYA dikirim sebagai header ke host --base dan TIDAK PERNAH dicetak
// atau disimpan oleh skrip ini.
//
// Dibuat untuk menutup gap yang tidak dicek scripts/verify-deployment.mjs:
// skrip itu memverifikasi status/canonical/H1/metadata, TAPI TIDAK memparse
// konten JSON-LD. Skrip ini membaca HTML MENTAH yang dikirim server (fetch
// biasa, tanpa menjalankan JS/hydration apa pun) untuk tiap route artikel di
// seo/routes.ts (STATIC_ROUTES '/artikel' dikeluarkan, dan tiap slug di
// LEGACY_ARTICLES + artikel CMS non-draft di content/artikel/*.md), lalu
// memvalidasi:
//   - ada script application/ld+json ber-@type LocalBusiness (schema global)
//   - ada TEPAT SATU script application/ld+json ber-@type BlogPosting
//   - field wajib BlogPosting lengkap & masuk akal (headline, description,
//     image absolute di domain situs, datePublished/dateModified format
//     YYYY-MM-DD dan datePublished <= dateModified, author.@type=Organization,
//     publisher.@type=Organization + logo.url, mainEntityOfPage['@id'] ===
//     url === canonical <link> di halaman yang sama, inLanguage === 'id-ID')
//
// Exit code 1 bila ada pemeriksaan gagal.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const arg = (name) => (process.argv.find((a) => a.startsWith(`--${name}=`)) || '').split('=').slice(1).join('=');
const BASE = arg('base').replace(/\/+$/, '');
const AS_JSON = process.argv.includes('--json');
const SECRET = process.env.VERCEL_BYPASS_SECRET || '';

if (!/^https?:\/\/[^/]+$/.test(BASE)) {
  console.error('Pakai: node scripts/verify-article-schema.mjs --base=https://host [--json]');
  process.exit(2);
}

// Ambil daftar slug artikel dari sumber yang sama dipakai build (tanpa perlu dist/ hasil build).
const routesSrc = fs.readFileSync(path.join(ROOT, 'seo', 'routes.ts'), 'utf8');
const legacySlugs = [...routesSrc.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);
const cmsDir = path.join(ROOT, 'content', 'artikel');
const cmsSlugs = fs.existsSync(cmsDir)
  ? fs.readdirSync(cmsDir)
      .filter((f) => f.endsWith('.md'))
      .filter((f) => !/^draft:\s*true/m.test(fs.readFileSync(path.join(cmsDir, f), 'utf8')))
      .map((f) => f.replace(/\.md$/, ''))
  : [];
const slugs = [...legacySlugs, ...cmsSlugs];
if (slugs.length === 0) {
  console.error('Tidak menemukan slug artikel dari seo/routes.ts + content/artikel/*.md.');
  process.exit(2);
}

const headers = () => (SECRET ? { 'x-vercel-protection-bypass': SECRET } : {});
const results = [];
function check(category, label, pass, detail = '') {
  results.push({ category, label, pass: !!pass, detail });
}

async function fetchHtml(p) {
  const res = await fetch(BASE + p, { headers: headers(), redirect: 'manual' });
  const body = await res.text();
  return { status: res.status, body };
}

for (const slug of slugs) {
  const path_ = `/artikel/${slug}`;
  let res;
  try {
    res = await fetchHtml(path_);
  } catch (e) {
    check(slug, 'halaman bisa diambil (fetch)', false, String(e));
    continue;
  }
  if (res.status !== 200) {
    check(slug, `status 200 (dapat ${res.status})`, false, res.status === 401 || res.status === 403 ? 'kemungkinan diblokir Deployment Protection -- butuh VERCEL_BYPASS_SECRET yang sah' : '');
    continue;
  }
  const html = res.body;
  const canonical = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1];
  check(slug, 'halaman 200 + ada <link rel="canonical">', !!canonical, canonical || '');

  const ldBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  let parsed = [];
  for (const block of ldBlocks) {
    try { parsed.push(JSON.parse(block)); } catch (e) { check(slug, 'setiap blok JSON-LD valid JSON', false, String(e).slice(0, 120)); }
  }
  const hasLocalBusiness = parsed.some((p) => p['@type'] === 'LocalBusiness');
  check(slug, 'schema LocalBusiness (global) tetap ada', hasLocalBusiness);

  const blogPostings = parsed.filter((p) => p['@type'] === 'BlogPosting');
  check(slug, 'tepat 1 schema BlogPosting ditemukan di RAW HTML', blogPostings.length === 1, `ditemukan ${blogPostings.length}`);
  const bp = blogPostings[0];
  if (!bp) continue;

  check(slug, 'headline terisi', typeof bp.headline === 'string' && bp.headline.length > 0, bp.headline);
  check(slug, 'description terisi', typeof bp.description === 'string' && bp.description.length > 0, bp.description);
  check(slug, 'image absolute URL di domain situs', typeof bp.image === 'string' && /^https:\/\/sanomatrassehat\.com\//.test(bp.image), bp.image);
  const dateRe = /^\d{4}-\d{2}-\d{2}$/;
  check(slug, 'datePublished format YYYY-MM-DD', dateRe.test(bp.datePublished || ''), bp.datePublished);
  check(slug, 'dateModified format YYYY-MM-DD', dateRe.test(bp.dateModified || ''), bp.dateModified);
  if (dateRe.test(bp.datePublished || '') && dateRe.test(bp.dateModified || '')) {
    check(slug, 'dateModified >= datePublished (fallback sah bila sama persis)', bp.dateModified >= bp.datePublished, `dP=${bp.datePublished} dM=${bp.dateModified}`);
  }
  check(slug, 'author.@type = Organization', bp.author?.['@type'] === 'Organization', JSON.stringify(bp.author));
  check(slug, 'author.name terisi', typeof bp.author?.name === 'string' && bp.author.name.length > 0);
  check(slug, 'publisher.@type = Organization', bp.publisher?.['@type'] === 'Organization', JSON.stringify(bp.publisher));
  check(slug, 'publisher.logo.url absolute', typeof bp.publisher?.logo?.url === 'string' && bp.publisher.logo.url.startsWith('https://sanomatrassehat.com/'), bp.publisher?.logo?.url);
  check(slug, "mainEntityOfPage['@id'] = url = canonical halaman", bp.mainEntityOfPage?.['@id'] === bp.url && bp.url === canonical, `mainEntityOfPage=${bp.mainEntityOfPage?.['@id']} url=${bp.url} canonical=${canonical}`);
  check(slug, "inLanguage = 'id-ID'", bp.inLanguage === 'id-ID', bp.inLanguage);
}

const fail = results.filter((r) => !r.pass);
if (AS_JSON) {
  console.log(JSON.stringify({ base: BASE, total: results.length, failed: fail.length, results }, null, 2));
} else {
  for (const r of results) console.log(`${r.pass ? 'PASS' : 'FAIL'}  [${r.category}] ${r.label} ${r.pass ? '' : ' ' + r.detail}`);
  console.log(`\nRINGKASAN ${BASE}: ${results.length - fail.length}/${results.length} lulus, ${fail.length} gagal`);
}
// Sengaja TIDAK pakai process.exit(): pada sebagian Node.js di Windows,
// process.exit() yang dipanggil sementara handle internal `fetch` (undici)
// belum selesai dibersihkan bisa memicu crash assertion libuv yang membuat
// exit code jadi salah (proses tampak "gagal" walau semua check PASS).
// Set exitCode saja dan biarkan proses berhenti wajar.
process.exitCode = fail.length > 0 ? 1 : 0;
