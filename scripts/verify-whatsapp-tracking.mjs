// Verifikasi pelacakan klik WhatsApp (event `click_whatsapp`) -- HANYA lokal,
// TIDAK memuat GTM/Meta/TikTok dan TIDAK mengirim telemetry apa pun.
//
//   node scripts/verify-whatsapp-tracking.mjs
//
// Dua bagian:
//  1) STATIS -- memindai sumber agar SETIAP tautan/tombol WhatsApp lewat satu
//     jalur kode (komponen WhatsAppLink / openWhatsAppChat / handler bersama),
//     tidak ada pemanggilan pelacak atau window.open WhatsApp yang tersebar.
//  2) PERILAKU -- membundel utils/tracking.ts, utils/whatsapp.ts,
//     utils/attribution.ts dan components/WhatsAppLink.tsx dengan esbuild
//     (sudah ada sebagai dependensi vite), lalu menjalankannya di Node dengan
//     `window`, dataLayer, fbq, ttq, sessionStorage, dan Date.now berupa
//     stub/spy. Yang dibuktikan: satu aktivasi = tepat satu event; aktivasi
//     berikutnya yang sah tetap tercatat; render/pergantian route tidak
//     mengirim event; nomor, pesan, tag atribusi, target/rel tetap benar;
//     payload lama utuh; tidak ada data pribadi di payload; pixel iklan tidak
//     ikut dipicu oleh tombol yang baru dicakup.
//
// Pengujian klik di browser nyata (akses keyboard, hydration, pergantian
// route) tidak dilakukan skrip ini -- lihat laporan patch.
//
// Exit code 1 bila ada pemeriksaan gagal.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

let pass = 0;
let fail = 0;
const ok = (cond, name, detail = '') => {
  if (cond) { pass++; console.log(`  ok   ${name}`); }
  else { fail++; console.log(`  FAIL ${name}${detail ? ` -- ${detail}` : ''}`); }
};

// ───────────────────────── 1) STATIS ─────────────────────────
console.log('\n[1] Pemindaian statis sumber');

const SCAN_DIRS = ['pages', 'components', 'utils', 'hooks', 'seo'];
const SCAN_FILES = ['App.tsx', 'index.tsx', 'entry-server.tsx'];
const files = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    const rel = `${dir}/${entry.name}`;
    if (entry.isDirectory()) walk(rel);
    else if (/\.(tsx?|mjs)$/.test(entry.name)) files.push(rel);
  }
};
SCAN_DIRS.forEach(walk);
SCAN_FILES.filter((f) => fs.existsSync(path.join(ROOT, f))).forEach((f) => files.push(f));
const src = Object.fromEntries(files.map((f) => [f, fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/\r\n/g, '\n')]));

const only = (needle, allowed, label) => {
  const offenders = files.filter((f) => src[f].includes(needle) && !allowed.includes(f));
  ok(offenders.length === 0, label, offenders.join(', '));
};
only('trackWhatsAppClick(', ['utils/tracking.ts', 'utils/whatsapp.ts'], 'trackWhatsAppClick() hanya dipanggil dari utils/tracking.ts & utils/whatsapp.ts');
only('buildWaHref(', ['utils/attribution.ts', 'utils/whatsapp.ts', 'components/WhatsAppLink.tsx'], 'buildWaHref() hanya dipakai di utils & WhatsAppLink');
only("'click_whatsapp'", ['utils/tracking.ts'], "literal 'click_whatsapp' hanya di utils/tracking.ts");
const openOffenders = files.filter((f) => /^(pages|components)\//.test(f) && /window\.open\(/.test(src[f]));
ok(openOffenders.length === 0, 'tidak ada window.open() langsung di pages/ & components/', openOffenders.join(', '));

// Tautan wa.me / api.whatsapp.com mentah di pages/ & components/ : hanya boleh di allowlist, dan harus ber-handler.
const RAW_WA = /(?:wa\.me\/|api\.whatsapp\.com)/;
const rawOffenders = [];
for (const f of files.filter((x) => /^(pages|components)\//.test(x))) {
  const lines = src[f].split('\n');
  lines.forEach((line, i) => {
    if (!RAW_WA.test(line)) return;
    // cari awal tag <a ... yang memuat baris ini, lalu periksa handler dalam tag yang sama
    const upto = lines.slice(Math.max(0, i - 6), i + 10).join('\n');
    if (!/createWhatsAppClickHandler\(/.test(upto)) rawOffenders.push(`${f}:${i + 1}`);
  });
}
ok(rawOffenders.length === 0, 'tautan WhatsApp mentah (wa.me) selalu ber-handler bersama', rawOffenders.join(', '));

// Setiap <WhatsAppLink ...> punya eventLabel, buttonId, placement.
function openingTags(text, tagName) {
  const tags = [];
  const re = new RegExp(`<${tagName}(?=[\\s>])`, 'g');
  let m;
  while ((m = re.exec(text)) !== null) {
    let i = m.index + tagName.length + 1;
    let depth = 0;
    let quote = '';
    for (; i < text.length; i++) {
      const c = text[i];
      if (quote) { if (c === '\\') i++; else if (c === quote) quote = ''; continue; }
      if (c === '"' || c === "'" || c === '`') { quote = c; continue; }
      if (c === '{') depth++;
      else if (c === '}') depth--;
      else if (c === '>' && depth === 0) break;
    }
    tags.push(text.slice(m.index, i + 1));
  }
  return tags;
}
const linkTags = files.flatMap((f) => openingTags(src[f], 'WhatsAppLink').map((t) => ({ f, t })));
ok(linkTags.length > 0, `ditemukan ${linkTags.length} pemakaian <WhatsAppLink>`);
const incomplete = linkTags.filter(({ t }) => !/\bmessage=/.test(t) || !/\beventLabel=/.test(t) || !/\bbuttonId=/.test(t) || !/\bplacement=/.test(t));
ok(incomplete.length === 0, 'setiap <WhatsAppLink> punya message, eventLabel, buttonId, placement', incomplete.map((x) => x.f).join(', '));
const stray = linkTags.filter(({ t }) => /\bhref=/.test(t));
ok(stray.length === 0, 'tidak ada <WhatsAppLink href=...> (href dibangun komponen)');

// buttonId statis unik.
const ids = [];
for (const { t } of linkTags) {
  const m = /buttonId="([^"]+)"/.exec(t);
  if (m) ids.push(m[1]);
}
for (const f of files) for (const m of src[f].matchAll(/['"](layout-[a-z0-9-]+)['"]/g)) ids.push(m[1]);
const dupIds = ids.filter((v, i) => ids.indexOf(v) !== i);
ok(dupIds.length === 0, `buttonId statis unik (${ids.length} ID)`, [...new Set(dupIds)].join(', '));

// Renderer markdown artikel CMS melacak tautan WhatsApp.
ok(/isWhatsAppHref\(/.test(src['pages/ArtikelDetail.tsx'] || ''), 'renderer markdown artikel CMS melacak tautan WhatsApp');

// Isi artikel CMS: informasi saja.
const cmsDir = path.join(ROOT, 'content', 'artikel');
let cmsWa = 0;
if (fs.existsSync(cmsDir)) {
  for (const f of fs.readdirSync(cmsDir).filter((x) => x.endsWith('.md'))) {
    cmsWa += (fs.readFileSync(path.join(cmsDir, f), 'utf8').match(/wa\.me\/|api\.whatsapp\.com/g) || []).length;
  }
}
console.log(`  info tautan WhatsApp di isi artikel CMS (content/artikel/*.md): ${cmsWa}`);

// ───────────────────────── 2) PERILAKU ─────────────────────────
console.log('\n[2] Perilaku (stub dataLayer / pixel / sessionStorage / Date.now)');

const esbuild = await import('esbuild');
const built = await esbuild.build({
  stdin: {
    contents: `
      export { trackWhatsAppClick, createWhatsAppClickHandler } from './utils/tracking';
      export { openWhatsAppChat, csIdForPhone, csIdForHref, isWhatsAppHref, toButtonSlug, WA_PHONE_MAIN, WA_PHONE_CS1, WA_DEFAULT_CHAT_MESSAGE } from './utils/whatsapp';
      export { buildWaHref } from './utils/attribution';
      export { default as WhatsAppLink } from './components/WhatsAppLink';
    `,
    resolveDir: ROOT,
    sourcefile: 'wa-test-entry.ts',
    loader: 'ts',
  },
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'node',
  jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"production"' },
  logLevel: 'silent',
});
const mod = await import(`data:text/javascript;base64,${Buffer.from(built.outputFiles[0].text).toString('base64')}`);

// ---- stub lingkungan browser ----
let clock = 1_000_000;
Date.now = () => clock;
const advance = (ms = 1000) => { clock += ms; };
const calls = { fbq: [], ttq: [], open: [] };
const store = new Map();
globalThis.sessionStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
};
globalThis.window = {
  dataLayer: [],
  location: { pathname: '/uji-lokal', search: '', href: 'http://localhost/uji-lokal' },
  fbq: (...a) => calls.fbq.push(a),
  ttq: { track: (...a) => calls.ttq.push(a) },
  open: (...a) => { calls.open.push(a); return null; },
  sessionStorage: globalThis.sessionStorage,
};
const events = () => window.dataLayer.filter((x) => x && x.event === 'click_whatsapp');
const reset = () => { window.dataLayer.length = 0; calls.fbq.length = 0; calls.ttq.length = 0; calls.open.length = 0; advance(5000); };

const { trackWhatsAppClick, createWhatsAppClickHandler, openWhatsAppChat, WhatsAppLink, buildWaHref } = mod;
const LEGACY_KEYS = ['event', 'event_category', 'event_label', 'value'];

// T1: payload lama utuh + identitas
reset();
trackWhatsAppClick('Label Uji', { buttonId: 'uji-tombol', placement: 'hero', cs: 'cs2' });
{
  const e = events();
  ok(e.length === 1, 'satu panggilan = tepat satu event dataLayer');
  ok(e[0] && LEGACY_KEYS.every((k) => k in e[0]) && e[0].event === 'click_whatsapp' && e[0].event_category === 'Kontak' && e[0].event_label === 'Label Uji' && e[0].value === 1, 'payload lama (event, event_category, event_label, value) tidak berubah');
  ok(e[0].wa_button_id === 'uji-tombol' && e[0].wa_placement === 'hero' && e[0].wa_cs === 'cs2' && e[0].wa_page_path === '/uji-lokal', 'identitas ditambahkan: wa_button_id, wa_placement, wa_cs, wa_page_path');
  const allowed = new Set([...LEGACY_KEYS, 'wa_button_id', 'wa_placement', 'wa_cs', 'wa_page_path']);
  ok(Object.keys(e[0]).every((k) => allowed.has(k)), 'tidak ada key di luar daftar yang diizinkan');
  ok(!JSON.stringify(e[0]).match(/\d{9,}/), 'payload tidak memuat nomor telepon / angka panjang');
}

// T2: pemanggil lama (satu argumen) tetap memicu pixel seperti dulu
reset();
trackWhatsAppClick('Pemanggil Lama');
ok(events().length === 1 && calls.fbq.length === 1 && calls.ttq.length === 1 && calls.fbq[0][1] === 'Contact', 'pemanggil satu-argumen: pixel Meta & TikTok tetap dipicu (kompatibel)');
ok(!('wa_button_id' in events()[0]), 'pemanggil satu-argumen: tidak ada key identitas yang mengada-ada');

// T3: pixels:false tidak memicu pixel
reset();
trackWhatsAppClick('Tanpa Pixel', { pixels: false });
ok(events().length === 1 && calls.fbq.length === 0 && calls.ttq.length === 0, 'pixels:false -> event dataLayer ya, Meta/TikTok tidak');

// T4: dedupe sinyal ganda & aktivasi berikutnya yang sah
reset();
trackWhatsAppClick('A'); trackWhatsAppClick('A');
ok(events().length === 1, 'dua panggilan beruntun (event ganda tersasar) = 1 event');
advance(900);
trackWhatsAppClick('A');
ok(events().length === 2, 'aktivasi berikutnya setelah jendela dedupe tetap tercatat');

// T5: handler bersama menghormati preventDefault
reset();
createWhatsAppClickHandler('H', { pixels: false })({ defaultPrevented: true });
ok(events().length === 0, 'klik yang di-preventDefault tidak dicatat');
createWhatsAppClickHandler('H', { pixels: false })({ defaultPrevented: false });
ok(events().length === 1, 'klik normal dicatat tepat sekali');

// T6: WhatsAppLink -- render tidak mengirim event; klik = 1 event; navigasi & href benar
reset();
const baseProps = { message: 'Halo Uji, pesan dasar', eventLabel: 'Uji WA - Tombol', buttonId: 'uji-link', placement: 'cta' };
const el1 = WhatsAppLink({ ...baseProps, className: 'k', target: '_blank', rel: 'noreferrer', children: 'Teks' });
const el2 = WhatsAppLink({ ...baseProps, children: 'Teks' });
ok(events().length === 0 && calls.open.length === 0, 'render komponen (berulang) tidak mengirim event');
ok(el1.type === 'a' && el1.props.href === buildWaHref('Halo Uji, pesan dasar') && el1.props.href.startsWith('https://wa.me/6285187283900?text='), 'href = buildWaHref(pesan) ke nomor utama (tidak berubah)');
ok(el1.props.target === '_blank' && el1.props.rel === 'noreferrer' && el1.props.className === 'k', 'target/rel/className diteruskan apa adanya');
ok(el2.props.target === undefined && el2.props.rel === undefined, 'tanpa target/rel bila pemanggil tidak memberi (perilaku navigasi lama dipertahankan)');
el1.props.onClick({ defaultPrevented: false });
ok(events().length === 1 && events()[0].event_label === 'Uji WA - Tombol' && events()[0].wa_button_id === 'uji-link' && events()[0].wa_placement === 'cta' && events()[0].wa_cs === 'cs2', 'satu klik tombol = tepat satu event beridentitas');
ok(calls.fbq.length === 0 && calls.ttq.length === 0, 'tombol baru dicakup (pixels default false): Meta/TikTok tidak ikut dipicu');
advance(900);
el1.props.onClick({ defaultPrevented: false });
ok(events().length === 2, 'klik sah berikutnya tercatat');
// onClick milik pemanggil tetap dijalankan
reset();
let userClicks = 0;
const el3 = WhatsAppLink({ ...baseProps, pixels: true, onClick: () => { userClicks++; }, children: 'x' });
el3.props.onClick({ defaultPrevented: false });
ok(userClicks === 1 && events().length === 1 && calls.fbq.length === 1 && calls.ttq.length === 1, 'onClick pemanggil tetap jalan; pixels:true mempertahankan Meta/TikTok untuk tombol lama');

// T7: nomor CS & tag atribusi
reset();
const cs1 = WhatsAppLink({ ...baseProps, phone: mod.WA_PHONE_CS1, children: 'x' });
ok(cs1.props.href.startsWith('https://wa.me/6285166662896?text='), 'nomor CS 1 tetap 6285166662896');
cs1.props.onClick({});
ok(events()[0].wa_cs === 'cs1' && !JSON.stringify(events()[0]).includes('6285166662896'), 'CS dikirim sebagai kode cs1 (bukan nomor)');
ok(mod.WA_PHONE_MAIN === '6285187283900' && buildWaHref('x') === buildWaHref('x', mod.WA_PHONE_MAIN), 'nomor utama konstanta = default buildWaHref (6285187283900)');
store.set('sano_ref', JSON.stringify({ source: 'google', medium: 'cpc', campaign: 'uji' }));
const tagged = WhatsAppLink({ ...baseProps, children: 'x' }).props.href;
const text = new URL(tagged).searchParams.get('text');
ok(text.startsWith('Halo Uji, pesan dasar') && text.includes('‍‍') && text.includes('⁠⁠'), 'tag atribusi iklan tetap menempel pada pesan (pesan dasar utuh)');
store.delete('sano_ref');
ok(new URL(WhatsAppLink({ ...baseProps, children: 'x' }).props.href).searchParams.get('text') === 'Halo Uji, pesan dasar', 'tanpa referral: pesan apa adanya');

// T8: openWhatsAppChat (tombol footer/melayang)
reset();
openWhatsAppChat({ phone: mod.WA_PHONE_CS1, eventLabel: 'Floating WA - Footer CS 1', buttonId: 'layout-footer-cs1', placement: 'footer' });
ok(events().length === 1 && calls.open.length === 1, 'openWhatsAppChat: 1 event + 1 window.open');
ok(calls.open[0][1] === '_blank' && calls.open[0][0] === buildWaHref(mod.WA_DEFAULT_CHAT_MESSAGE, mod.WA_PHONE_CS1), 'window.open(url, "_blank") dengan pesan & nomor yang sama seperti sebelumnya');
ok(events()[0].event_label === 'Floating WA - Footer CS 1' && calls.fbq.length === 1 && calls.ttq.length === 1, 'label lama & pixel lama dipertahankan untuk tombol lama');
ok(mod.WA_DEFAULT_CHAT_MESSAGE === 'Halo Sano, saya tertarik konsultasi', 'pesan tombol melayang/footer tidak berubah');

// T9: util
ok(mod.isWhatsAppHref('https://wa.me/6285187283900?text=a') && mod.isWhatsAppHref('https://api.whatsapp.com/send?phone=1') && !mod.isWhatsAppHref('https://example.com/wa.me/') && !mod.isWhatsAppHref('tel:+62'), 'isWhatsAppHref: hanya host WhatsApp');
ok(mod.csIdForHref('https://wa.me/6285166662896?x') === 'cs1' && mod.csIdForHref('https://wa.me/6281234') === undefined, 'csIdForHref memetakan nomor CS dikenal saja');
ok(mod.toButtonSlug('Service Divan / Sandaran') === 'service-divan-sandaran' && mod.toButtonSlug('') === 'tanpa-judul', 'toButtonSlug stabil & aman');

console.log(`\nHasil: ${pass} lulus, ${fail} gagal`);
process.exit(fail === 0 ? 0 : 1);
