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

// SATU nomor aktif: CS 1 = 6285187283900 (0851 8728 3900). Nomor SANO lama hanya boleh ada di utils/whatsapp.ts
// (untuk normalisasi tautan lama di isi artikel); setiap literal wa.me di sumber harus nomor CS 1.
const CS1_DIGITS = '6285187283900';
const LEGACY_DIGITS = '6285166662896';
const legacyOffenders = files.filter((f) => f !== 'utils/whatsapp.ts' && (src[f].includes(LEGACY_DIGITS) || /0851[\s.-]?6666[\s.-]?2896/.test(src[f])));
ok(legacyOffenders.length === 0, 'nomor SANO lama (0851 6666 2896) tidak muncul di sumber aktif selain utils/whatsapp.ts', legacyOffenders.join(', '));
const badLiteral = [];
for (const f of files) for (const m of src[f].matchAll(/(?:wa\.me\/|[?&]phone=)\+?(\d{6,})/g)) if (m[1] !== CS1_DIGITS && !(f === 'utils/whatsapp.ts')) badLiteral.push(`${f}:${m[1].slice(0, 4)}…`);
ok(badLiteral.length === 0, 'semua literal wa.me / phone= di sumber = 6285187283900 (CS 1)', badLiteral.join(', '));
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
ok(!indexHtml.includes(LEGACY_DIGITS) && indexHtml.includes(`+${CS1_DIGITS}`), 'index.html (JSON-LD telephone) memakai CS 1 saja');

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
const phoneOverride = linkTags.filter(({ t }) => /\bphone=/.test(t));
ok(phoneOverride.length === 0, 'tidak ada <WhatsAppLink phone=...> (semua memakai CS 1 default)', phoneOverride.map((x) => x.f).join(', '));

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
ok(/href=\{normalizeSanoWaHref\(props\.href\)\}/.test(src['pages/ArtikelDetail.tsx'] || ''), 'renderer markdown artikel CMS menormalkan nomor SANO lama ke CS 1');

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
      export { openWhatsAppChat, csIdForPhone, csIdForHref, isWhatsAppHref, toButtonSlug, normalizeSanoWaHref, WA_PHONE_LEGACY, WA_PHONE_CS1, WA_DEFAULT_CHAT_MESSAGE } from './utils/whatsapp';
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
  // Flag kode kunjungan MATI di bagian [2]: perilaku harus identik dengan sebelum fitur ada.
  define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env.VITE_KODE_KUNJUNGAN': '""' },
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
trackWhatsAppClick('Label Uji', { buttonId: 'uji-tombol', placement: 'hero', cs: 'cs1' });
{
  const e = events();
  ok(e.length === 1, 'satu panggilan = tepat satu event dataLayer');
  ok(e[0] && LEGACY_KEYS.every((k) => k in e[0]) && e[0].event === 'click_whatsapp' && e[0].event_category === 'Kontak' && e[0].event_label === 'Label Uji' && e[0].value === 1, 'payload lama (event, event_category, event_label, value) tidak berubah');
  ok(e[0].wa_button_id === 'uji-tombol' && e[0].wa_placement === 'hero' && e[0].wa_cs === 'cs1' && e[0].wa_page_path === '/uji-lokal', 'identitas ditambahkan: wa_button_id, wa_placement, wa_cs, wa_page_path');
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
ok(el1.type === 'a' && el1.props.href === buildWaHref('Halo Uji, pesan dasar') && el1.props.href.startsWith('https://wa.me/6285187283900?text='), 'href = buildWaHref(pesan) ke CS 1 (6285187283900) secara default');
ok(el1.props.target === '_blank' && el1.props.rel === 'noreferrer' && el1.props.className === 'k', 'target/rel/className diteruskan apa adanya');
ok(el2.props.target === undefined && el2.props.rel === undefined, 'tanpa target/rel bila pemanggil tidak memberi (perilaku navigasi lama dipertahankan)');
el1.props.onClick({ defaultPrevented: false });
ok(events().length === 1 && events()[0].event_label === 'Uji WA - Tombol' && events()[0].wa_button_id === 'uji-link' && events()[0].wa_placement === 'cta' && events()[0].wa_cs === 'cs1', 'satu klik tombol = tepat satu event beridentitas');
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
const cs1 = WhatsAppLink({ ...baseProps, children: 'x' });
ok(cs1.props.href.startsWith('https://wa.me/6285187283900?text='), 'CS 1 = 6285187283900 (0851 8728 3900)');
cs1.props.onClick({});
ok(events()[0].wa_cs === 'cs1' && !JSON.stringify(events()[0]).includes('6285187283900'), 'CS dikirim sebagai kode cs1 (bukan nomor)');
ok(mod.WA_PHONE_CS1 === '6285187283900' && buildWaHref('x') === buildWaHref('x', mod.WA_PHONE_CS1), 'konstanta CS 1 = default buildWaHref (6285187283900)');
ok(mod.csIdForPhone(mod.WA_PHONE_LEGACY) === undefined && mod.csIdForPhone(undefined) === undefined, 'wa_cs: nomor lama / kosong bukan CS aktif (undefined)');
ok(mod.csIdForPhone('+62 851-8728-3900') === 'cs1' && mod.csIdForPhone('6285187283900') === 'cs1', 'csIdForPhone: format bernomor/berspasi tetap dikenali sebagai cs1');
store.set('sano_ref', JSON.stringify({ source: 'google', medium: 'cpc', campaign: 'uji' }));
const tagged = WhatsAppLink({ ...baseProps, children: 'x' }).props.href;
const text = new URL(tagged).searchParams.get('text');
ok(text.startsWith('Halo Uji, pesan dasar') && text.includes('‍‍') && text.includes('⁠⁠'), 'tag atribusi iklan tetap menempel pada pesan (pesan dasar utuh)');
store.delete('sano_ref');
ok(new URL(WhatsAppLink({ ...baseProps, children: 'x' }).props.href).searchParams.get('text') === 'Halo Uji, pesan dasar', 'tanpa referral: pesan apa adanya');

// T8: openWhatsAppChat (tombol footer/melayang)
reset();
openWhatsAppChat({ phone: mod.WA_PHONE_CS1, eventLabel: 'Floating WA - Footer CS 2', buttonId: 'layout-footer-cs1', placement: 'footer' });
ok(events().length === 1 && calls.open.length === 1, 'openWhatsAppChat: 1 event + 1 window.open');
ok(calls.open[0][1] === '_blank' && calls.open[0][0] === buildWaHref(mod.WA_DEFAULT_CHAT_MESSAGE, mod.WA_PHONE_CS1) && calls.open[0][0].startsWith('https://wa.me/6285187283900?text='), 'window.open(url, "_blank") ke CS 1 dengan pesan yang sama seperti sebelumnya');
ok(events()[0].event_label === 'Floating WA - Footer CS 2' && events()[0].wa_cs === 'cs1' && events()[0].wa_button_id === 'layout-footer-cs1' && calls.fbq.length === 1 && calls.ttq.length === 1, 'footer: event_label lama dipertahankan, wa_cs=cs1, pixel lama dipertahankan');
ok(mod.WA_DEFAULT_CHAT_MESSAGE === 'Halo Sano, saya tertarik konsultasi', 'pesan tombol melayang/footer tidak berubah');

// T9: util
ok(mod.isWhatsAppHref('https://wa.me/6285187283900?text=a') && mod.isWhatsAppHref('https://api.whatsapp.com/send?phone=1') && !mod.isWhatsAppHref('https://example.com/wa.me/') && !mod.isWhatsAppHref('tel:+62'), 'isWhatsAppHref: hanya host WhatsApp');
ok(mod.csIdForHref('https://wa.me/6285187283900?x') === 'cs1' && mod.csIdForHref('https://wa.me/6285166662896?x') === undefined && mod.csIdForHref('https://wa.me/6281234') === undefined, 'csIdForHref: hanya CS 1 yang dikenal (nomor lama & lain = undefined)');
// normalizeSanoWaHref: nomor SANO lama -> CS 1; sisanya tak disentuh
{
  const n = mod.normalizeSanoWaHref;
  const msg = 'text=Halo%20Sano%2C%20tanya';
  ok(n(`https://wa.me/6285166662896?${msg}`) === `https://wa.me/6285187283900?${msg}`, 'normalisasi: wa.me nomor lama -> CS 1, pesan utuh');
  ok(n('https://wa.me/+6285166662896') === 'https://wa.me/6285187283900' && n('https://wa.me/6285166662896/') === 'https://wa.me/6285187283900/', 'normalisasi: varian + dan / akhir');
  ok(n('https://api.whatsapp.com/send?phone=6285166662896&text=a') === 'https://api.whatsapp.com/send?phone=6285187283900&text=a', 'normalisasi: api.whatsapp.com ?phone= nomor lama -> CS 1');
  ok(n('https://wa.me/6285187283900?x=1') === 'https://wa.me/6285187283900?x=1', 'normalisasi: CS 1 tidak berubah');
  ok(n('https://wa.me/6281234567890?x=1') === 'https://wa.me/6281234567890?x=1', 'normalisasi: nomor bukan SANO dibiarkan');
  ok(n('https://wa.me/628516666289699') === 'https://wa.me/628516666289699', 'normalisasi: nomor yang hanya berawalan sama dengan nomor lama tidak ikut diganti');
  ok(n('https://example.com/?x=6285166662896') === 'https://example.com/?x=6285166662896' && n(undefined) === undefined && n('/artikel/x') === '/artikel/x', 'normalisasi: URL non-WhatsApp & undefined tidak disentuh');
}
ok(mod.toButtonSlug('Service Divan / Sandaran') === 'service-divan-sandaran' && mod.toButtonSlug('') === 'tanpa-judul', 'toButtonSlug stabil & aman');

// T10: flag kode kunjungan MATI -> tidak ada "(Kode:" di pesan mana pun
store.clear();
ok(!decodeURIComponent(buildWaHref('Halo')).includes('(Kode:'), 'flag mati: tanpa referral tidak ada kode terlihat');
store.set('sano_ref', JSON.stringify({ source: 'google', medium: 'cpc', campaign: 'jasa' }));
ok(!decodeURIComponent(buildWaHref('Halo')).includes('(Kode:'), 'flag mati: dengan referral iklan tidak ada kode terlihat');
ok(!store.has('sano_kode'), 'flag mati: tidak menulis sano_kode');
store.clear();

// ───────────────────── 3) KODE KUNJUNGAN (flag ON) ─────────────────────
console.log('\n[3] Kode kunjungan terlihat (VITE_KODE_KUNJUNGAN=on)');
const builtOn = await esbuild.build({
  stdin: {
    contents: `
      export { buildWaHref, captureAdReferral, getVisitCode, hurufKanal, beginAttributionHydration, endAttributionHydration, KODE_PREFIX } from './utils/attribution';
      export { trackWhatsAppClick } from './utils/tracking';
      export { openWhatsAppChat, WA_PHONE_CS1, WA_DEFAULT_CHAT_MESSAGE } from './utils/whatsapp';
    `,
    resolveDir: ROOT,
    sourcefile: 'wa-test-entry-kode.ts',
    loader: 'ts',
  },
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'node',
  jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env.VITE_KODE_KUNJUNGAN': '"on"' },
  logLevel: 'silent',
});
const on = await import(`data:text/javascript;base64,${Buffer.from(builtOn.outputFiles[0].text).toString('base64')}`);
const KODE_RE = /\(Kode: ([GMTISLRW][ABCDEFGHJKMNPQRSTUVWXYZ23456789]{4})\)$/;
const teks = (href) => new URL(href).searchParams.get('text');
globalThis.document = { referrer: '', querySelectorAll: () => [] };
const kunjungi = (search, referrer = '') => { window.location.search = search; document.referrer = referrer; on.captureAdReferral(); };

// K1: tabel huruf kanal
{
  const h = on.hurufKanal;
  const kasus = [
    [{ source: 'google', medium: 'cpc' }, 'G'], [{ source: 'google', medium: 'pmax' }, 'G'], [{ source: 'google', medium: 'organic' }, 'S'],
    [{ source: 'meta', medium: 'cpc' }, 'M'], [{ source: 'facebook', medium: 'paid' }, 'M'], [{ source: 'ig', medium: 'cpc' }, 'M'],
    [{ source: 'ig', medium: 'social' }, 'I'], [{ source: 'instagram' }, 'I'], [{ source: 'facebook', medium: 'social' }, 'R'],
    [{ source: 'tiktok', medium: 'cpc' }, 'T'], [{ source: 'tiktok', medium: 'social' }, 'R'], [{ source: 'linktree', medium: 'referral' }, 'L'],
    [{ source: 'newsletter', medium: 'email' }, 'R'], [null, 'W'],
  ];
  const salah = kasus.filter(([r, e]) => h(r) !== e).map(([r, e]) => `${JSON.stringify(r)}=>${h(r)}≠${e}`);
  ok(salah.length === 0, 'huruf kanal sesuai tabel desain v2 (G/M/T/I/S/L/R/W)', salah.join('; '));
}

// K2: tanpa sumber -> W, stabil selama sesi
store.clear();
kunjungi('');
{
  const t1 = teks(on.buildWaHref('Halo Sano, saya tertarik konsultasi'));
  const t2 = teks(on.buildWaHref('Pesan lain'));
  const m1 = KODE_RE.exec(t1);
  ok(!!m1 && m1[1][0] === 'W' && t1.startsWith('Halo Sano, saya tertarik konsultasi (Kode: '), 'tanpa sumber: "<pesan> (Kode: W....)"');
  ok(KODE_RE.exec(t2)?.[1] === m1?.[1] && store.get('sano_kode') === m1?.[1], 'kode W sama untuk semua tombol dalam sesi (sano_kode)');
  ok(!t1.includes('\u200d'), 'tanpa sumber: tidak ada tag tak terlihat');
}

// K3: Google Ads ber-UTM -> tag tak terlihat + (Kode: G....) di akhir
store.clear();
kunjungi('?utm_source=google&utm_medium=cpc&utm_campaign=jasa');
{
  const t = teks(on.buildWaHref('Halo Sano, saya tertarik konsultasi'));
  const m = KODE_RE.exec(t);
  const ref = JSON.parse(store.get('sano_ref'));
  ok(!!m && m[1][0] === 'G' && ref.kode === m[1], 'google/cpc: kode G tersimpan di sano_ref.kode dan tampil di pesan');
  const iStart = t.indexOf('\u200d\u200d'), iEnd = t.indexOf('\u2060\u2060'), iKode = t.indexOf(' (Kode: ');
  ok(t.startsWith('Halo Sano, saya tertarik konsultasi') && iStart > 0 && iEnd > iStart && iKode > iEnd, 'urutan: pesan dasar -> tag tak terlihat -> (Kode: ...) di akhir');
  ok(!store.has('sano_kode'), 'kunjungan ber-sumber tidak membuat kode W');
  // reload dengan UTM sama: kode tetap; kampanye baru: kode baru
  kunjungi('?utm_source=google&utm_medium=cpc&utm_campaign=jasa');
  ok(JSON.parse(store.get('sano_ref')).kode === ref.kode, 'reload dengan UTM sama: kode tidak berganti');
  kunjungi('?utm_source=google&utm_medium=cpc&utm_campaign=ortho');
  const k2 = JSON.parse(store.get('sano_ref')).kode;
  ok(k2 !== ref.kode && k2[0] === 'G', 'kampanye baru: kode baru (tetap G)');
  // navigasi SPA tanpa query tidak mengubah apa pun
  kunjungi('');
  ok(JSON.parse(store.get('sano_ref')).kode === k2, 'navigasi tanpa query: kode dipertahankan');
}

// K4: click-id & kanal lain
store.clear(); kunjungi('?gclid=UJI-DUMMY');
ok(on.getVisitCode()?.[0] === 'G' && !JSON.stringify([...store.values()]).includes('UJI-DUMMY'), 'gclid saja -> G; nilai gclid tidak disimpan');
store.clear(); kunjungi('?fbclid=UJI');
ok(on.getVisitCode()?.[0] === 'M', 'fbclid -> M');
store.clear(); kunjungi('?utm_source=tiktok&utm_medium=cpc');
ok(on.getVisitCode()?.[0] === 'T', 'tiktok/cpc -> T');
store.clear(); kunjungi('', 'https://l.instagram.com/');
ok(on.getVisitCode()?.[0] === 'I', 'referrer instagram -> I');
store.clear(); kunjungi('', 'https://www.google.com/');
ok(on.getVisitCode()?.[0] === 'S', 'referrer google (organik) -> S');

// K5: referral lama tanpa kode (tersimpan sebelum flag nyala) dilengkapi sekali
store.clear(); store.set('sano_ref', JSON.stringify({ source: 'google', medium: 'cpc', campaign: 'lama' }));
{
  const k = on.getVisitCode();
  ok(k?.[0] === 'G' && JSON.parse(store.get('sano_ref')).kode === k && on.getVisitCode() === k, 'referral lama tanpa kode: dilengkapi sekali lalu stabil');
}

// K6: pesan yang sudah memuat kode tidak digandakan
ok((decodeURIComponent(on.buildWaHref('Halo (Kode: GAAAA)')).match(/\(Kode:/g) || []).length === 1, 'pesan dasar yang sudah berkode tidak ditempel kode kedua');

// K7: hydration -> tanpa kode; sesudahnya link wa.me di DOM ditempeli
store.clear(); kunjungi('?utm_source=google&utm_medium=cpc&utm_campaign=jasa');
on.beginAttributionHydration();
{
  const statis = on.buildWaHref('Halo Sano, saya tertarik konsultasi gratis');
  ok(on.getVisitCode() === null && !teks(statis).includes('(Kode:') && !teks(statis).includes('\u200d'), 'selama hydration: href identik HTML statis (tanpa tag & kode)');
  const a1 = { href: statis }, a2 = { href: 'https://wa.me/6285187283900' }, a3 = { href: on.buildWaHref('x') };
  document.querySelectorAll = () => [a1, a2, a3];
  on.endAttributionHydration();
  const ta = teks(a1.href);
  ok(KODE_RE.test(ta) && ta.includes('\u200d\u200d'), 'sesudah hydration: link ditempeli tag + kode');
  ok(a2.href === 'https://wa.me/6285187283900', 'link wa.me tanpa ?text tidak disentuh');
  ok(a1.href === on.buildWaHref('Halo Sano, saya tertarik konsultasi gratis'), 'href hasil tempel = render berikutnya (tidak ada mismatch)');
  document.querySelectorAll = () => [];
}

// K8: tombol melayang (window.open) membawa kode
store.clear(); kunjungi('?utm_source=google&utm_medium=cpc&utm_campaign=jasa');
reset();
on.openWhatsAppChat({ phone: on.WA_PHONE_CS1, eventLabel: 'Floating WA - Uji', buttonId: 'uji-float', placement: 'floating' });
ok(calls.open.length === 1 && KODE_RE.exec(teks(calls.open[0][0]))?.[1][0] === 'G', 'tombol melayang: pesan membawa (Kode: G....)');

// K9: sessionStorage gagal -> kode tetap konsisten selama halaman hidup
{
  const asli = globalThis.sessionStorage;
  const rusak = { getItem: () => { throw new Error('x'); }, setItem: () => { throw new Error('x'); }, removeItem: () => {} };
  globalThis.sessionStorage = rusak; window.sessionStorage = rusak;
  const k1 = on.getVisitCode(), k2 = on.getVisitCode();
  ok(!!k1 && k1 === k2 && k1[0] === 'W', 'storage gagal: kode cadangan W konsisten, tanpa error');
  globalThis.sessionStorage = asli; window.sessionStorage = asli;
}
store.clear();

// L1: landing -- UTM/click-id per sesi terbawa ke event click_whatsapp, + landing_id & audience
store.clear(); reset();
kunjungi('?utm_source=google&utm_medium=cpc&utm_campaign=ortho-cold&utm_content=v1&utm_term=kasur+amblas&gclid=RAHASIA123');
on.trackWhatsAppClick('Landing Uji', { buttonId: 'lp-uji', placement: 'hero', cs: 'cs1', landingId: 'LP-COLD-A', audience: 'cold', pixels: false });
{
  const e = window.dataLayer.filter((x) => x && x.event === 'click_whatsapp').pop();
  ok(e && e.landing_id === 'LP-COLD-A' && e.audience === 'cold', 'landing: event membawa landing_id dan audience');
  ok(e.utm_source === 'google' && e.utm_medium === 'cpc' && e.utm_campaign === 'ortho-cold' && e.utm_content === 'v1' && e.utm_term === 'kasur amblas', 'landing: 5 parameter UTM terbawa ke event');
  ok(e.click_id_type === 'gclid', 'landing: jenis click-id (gclid) tercatat');
  ok(!JSON.stringify(e).includes('RAHASIA123') && !teks(on.buildWaHref('Halo')).includes('RAHASIA123'), 'landing: nilai mentah gclid tidak ada di event maupun di teks WA');
}
// L2: halaman berikutnya tanpa UTM tidak menghapus parameter sesi; payload lama utuh
reset();
kunjungi('');
on.trackWhatsAppClick('Landing Uji 2', { landingId: 'LP-HOT-A', audience: 'hot', pixels: false });
{
  const e = window.dataLayer.filter((x) => x && x.event === 'click_whatsapp').pop();
  ok(e.utm_source === 'google' && e.landing_id === 'LP-HOT-A' && e.audience === 'hot', 'landing: parameter sesi bertahan di navigasi tanpa UTM');
  ok(e.event_category === 'Kontak' && e.value === 1 && e.event_label === 'Landing Uji 2', 'landing: payload lama tetap utuh');
}
// L3: tanpa UTM sama sekali -> tidak ada key utm_* mengada-ada
store.clear(); reset();
kunjungi('');
on.trackWhatsAppClick('Tanpa UTM', { pixels: false });
ok(!Object.keys(window.dataLayer.filter((x) => x && x.event === 'click_whatsapp').pop()).some((k) => k.startsWith('utm_') || k === 'click_id_type'), 'tanpa UTM: tidak ada key utm_* / click_id_type');
store.clear();

// ── Penundaan tag pihak ketiga di landing (scripts/prerender.mjs) ──
console.log('\n[L4] Penundaan tag pihak ketiga (landing)');
{
  const pre = fs.readFileSync(path.join(ROOT, 'scripts/prerender.mjs'), 'utf8');
  const kit = fs.readFileSync(path.join(ROOT, 'components/landing/LandingKit.tsx'), 'utf8');
  const waBtn = kit.slice(kit.indexOf('export const WaButton'), kit.indexOf('export const HeroWaButton'));
  ok(/target="_blank"/.test(waBtn), 'WaButton landing target="_blank" (halaman tetap hidup setelah klik, tag boleh ditunda)');
  ok(!/pixels/.test(waBtn), 'WaButton landing tidak mengubah default pixels (Meta/TikTok tidak dipicu klik WA, sama seperti sebelumnya)');
  const ev = (pre.match(/const DEFER_LOADER = `\(function\(\)\{var d=0,E=\[([^\]]*)\]/) || [])[1] || '';
  for (const e of ['pointerdown', 'touchstart', 'scroll', 'keydown', 'click']) ok(ev.includes(`'${e}'`), `loader tag: pemicu ${e}`);
  const ms = Number((pre.match(/const DEFER_TAGS_MS = (\d+)/) || [])[1]);
  ok(ms >= 3000 && ms <= 4000, `batas waktu penundaan tag ${ms} ms (3000-4000)`);
  for (const id of ['GTM-PSDWS88V', 'AW-18575989292', '934367175857999', 'D6NMKNBC77UBBJ4JSLG0']) ok(pre.includes(id) && fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').includes(id), `ID tag ${id} masih ada di index.html dan dijaga prerender`);
  const idx = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  ok(!/data-defer-tag/.test(idx), 'index.html global tidak diubah (penundaan hanya di HTML prerender landing)');
}

// ── Gerbang host: pustaka tag HANYA dimuat di domain produksi (index.html) ──
console.log('\n[L5] Tag pelacakan hanya di domain produksi');
{
  const vm = await import('node:vm');
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').replace(/<!--[\s\S]*?-->/g, '').replace(/<noscript>[\s\S]*?<\/noscript>/g, '');
  const pelacak = /googletagmanager|connect\.facebook|analytics\.tiktok/;
  ok(![...html.matchAll(/<script[^>]*\ssrc="([^"]+)"/g)].some((m) => pelacak.test(m[1])), 'tidak ada <script src> pelacak statis di index.html');
  const skrip = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]).filter((c) => /SANO_TRACK|dataLayer|fbq|ttq/.test(c));
  const jalankan = (hostname) => {
    const dimuat = [];
    const el = () => ({ set src(v) { dimuat.push(v); }, get src() { return ''; } });
    const induk = { insertBefore() {}, appendChild() {} };
    const document = { createElement: el, getElementsByTagName: () => [{ parentNode: induk }], head: induk };
    const ctx = vm.createContext({ document, location: { hostname }, Date });
    ctx.window = ctx;
    for (const c of skrip) vm.runInContext(c, ctx);
    return { dimuat, ctx };
  };
  for (const h of ['sanomatrassehat.com', 'www.sanomatrassehat.com']) {
    const { dimuat } = jalankan(h);
    ok(['gtm.js?id=GTM-PSDWS88V', 'gtag/js?id=AW-18575989292', 'fbevents.js', 'analytics.tiktok.com'].every((k) => dimuat.filter((u) => u.includes(k)).length === 1) && dimuat.length === 4, `${h}: 4 pustaka tag dimuat, masing-masing sekali`, dimuat.join(' '));
  }
  for (const h of ['localhost', '127.0.0.1', 'website-sano-abc123-rigss-projects.vercel.app', 'sano-website.vercel.app', 'sanomatrassehat.com.contoh.test', 'staging.sanomatrassehat.com']) {
    const { dimuat, ctx } = jalankan(h);
    ok(dimuat.length === 0 && Array.isArray(ctx.dataLayer) && typeof ctx.gtag === 'function' && !ctx.fbq, `${h}: tidak ada pustaka tag dimuat, dataLayer tetap ada`, dimuat.join(' '));
  }
}

console.log(`\nHasil: ${pass} lulus, ${fail} gagal`);
process.exit(fail === 0 ? 0 : 1);
