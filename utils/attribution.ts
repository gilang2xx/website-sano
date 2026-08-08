// Menangkap UTM/click-id dari URL saat orang mendarat dari iklan (Google
// Search, PMax, dst), simpan di sessionStorage supaya bertahan sepanjang
// kunjungan, lalu tempelkan sebagai tag ke pesan WhatsApp.
//
// KENAPA INI PERLU. Iklan yang lompat LANGSUNG ke WhatsApp (mis. Meta
// Click-to-WhatsApp lewat link pelacakan CRM) sudah bisa dilacak dari
// sisi CRM. Tapi Google Search & PMax mengarah ke WEBSITE ini dulu --
// begitu orang pindah dari sini ke WhatsApp, jejak "dari iklan/campaign
// mana" hilang total kecuali WEBSITE INI yang menempelkannya sendiri ke
// pesan WA. Tanpa ini, PMax/Search/organik semuanya kelihatan sama di CRM.
//
// Situs ini SPA dengan HashRouter (index.tsx) -- UTM ada di query string
// SEBELUM tanda '#' (mis. sanomatrassehat.com/?utm_source=google#/kontak),
// jadi window.location.search tetap membacanya dengan benar, tidak
// terpengaruh oleh hash routing.

const STORAGE_KEY = "sano_ref";

interface RefInfo {
  source?: string;
  medium?: string;
  campaign?: string;
  capturedAt?: string;
}

/**
 * Panggil SEKALI per navigasi di root app (Layout.tsx, yang mount sekali
 * dan tidak pernah unmount selama SPA ini hidup).
 */
export function captureAdReferral(): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);

  const source = params.get("utm_source");
  const medium = params.get("utm_medium");
  const campaign = params.get("utm_campaign");
  const gclid = params.get("gclid");   // Google Ads auto-tagging
  const fbclid = params.get("fbclid"); // Meta auto-tagging

  // Tidak ada penanda iklan APAPUN di URL ini -- JANGAN timpa referral
  // yang sudah tersimpan dari halaman sebelumnya. Orang bisa klik-klik ke
  // beberapa halaman situs sebelum akhirnya klik tombol WA; referral
  // aslinya (halaman pertama yang didarati dari iklan) harus tetap hidup.
  if (!source && !medium && !campaign && !gclid && !fbclid) return;

  const info: RefInfo = {
    source: source || (gclid ? "google" : fbclid ? "meta" : undefined),
    medium: medium || (gclid ? "cpc" : undefined),
    campaign: campaign || undefined,
    capturedAt: new Date().toISOString(),
  };

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(info));
  } catch {
    // sessionStorage bisa gagal (mode privat browser lama, dsb) -- gagal
    // diam-diam, dampaknya cuma "pesan WA tidak bertag", bukan error user.
  }
}

function getStoredRef(): RefInfo | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Tag ringkas, contoh "google-cpc-brand" atau "google-pmax". Return null
 * kalau tidak ada referral tersimpan -- kunjungan organik/direct TIDAK
 * diberi tag karangan.
 */
export function getRefTag(): string | null {
  const ref = getStoredRef();
  if (!ref) return null;
  const bagian = [ref.source || "unknown", ref.medium, ref.campaign].filter(Boolean);
  return bagian
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ─── Tag TAK TERLIHAT (zero-width Unicode) ──────────────────────────────
//
// Awalnya tag ditulis kasat mata "(ref: google-cpc)" -- customer sempat
// lihat itu di kotak chat WA sebelum kirim. Sekarang dienkode pakai
// karakter Unicode "zero-width" (lebar render = NOL, tidak pernah
// terlihat di layar/font/tema manapun) supaya pesan yang dilihat customer
// bersih 100%, tapi datanya tetap ikut terkirim dalam teks & bisa dibaca
// ulang oleh CRM.
//
// ⚠️ IMPLEMENTASI INI HARUS SELALU DISAMAKAN MANUAL dengan versi decode-nya
// di backend/src/services/leadAttribution.js (repo CRM terpisah, tidak ada
// package bersama) -- kalau salah satu diubah, yang lain ikut diubah.
//
// ⚠️ RAPUH BY DESIGN (sudah didiskusikan & diterima): kalau customer
// menghapus SEMUA teks prefilled lalu mengetik ulang dari nol, tag ini
// ikut hilang tanpa jejak -- tidak ada encoding yang bisa selamat dari
// itu, karena datanya nitip DI DALAM teks yang dihapus. Kalau customer
// cuma NAMBAH di belakang (paling umum -- WA taruh kursor di ujung),
// tag tetap aman: marker START/END dicari DI MANA SAJA dalam teks, tidak
// diwajibkan persis di ujung kalimat.
//
// SENGAJA pakai String.fromCharCode(kode hex), BUKAN karakter invisible
// ditempel langsung di source -- karakter literal gampang rusak/hilang
// kalau lewat editor, git, atau konversi encoding lain, dan mustahil
// diperiksa dengan mata (persis masalahnya: tidak kelihatan!).
// fromCharCode(0x200B) selalu utuh apa adanya, bisa dibaca siapa pun yang
// buka file ini, dan gampang dicocokkan manual dengan versi decode di
// backend/src/services/leadAttribution.js.
const REF_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789-";
const BIT0 = String.fromCharCode(0x200b);                             // ZERO WIDTH SPACE     -> bit 0
const BIT1 = String.fromCharCode(0x200c);                             // ZERO WIDTH NON-JOINER -> bit 1
const START_MARK = String.fromCharCode(0x200d) + String.fromCharCode(0x200d); // ZERO WIDTH JOINER x2 -> penanda mulai
const END_MARK = String.fromCharCode(0x2060) + String.fromCharCode(0x2060);   // WORD JOINER x2       -> penanda selesai

function encodeInvisibleTag(tag: string): string {
  let payload = "";
  for (const ch of tag) {
    const idx = REF_ALPHABET.indexOf(ch);
    if (idx === -1) continue; // karakter di luar alfabet -- lewati, jangan gagal total
    const bits = idx.toString(2).padStart(6, "0");
    for (const bit of bits) payload += bit === "1" ? BIT1 : BIT0;
  }
  return START_MARK + payload + END_MARK;
}

/**
 * Bangun URL wa.me lengkap dari pesan dasar yang SUDAH ADA di tiap
 * halaman (jangan diseragamkan -- pesan spesifik per halaman itu berguna
 * buat sales tahu konteksnya). Kalau tidak ada referral tersimpan, pesan
 * dikembalikan APA ADANYA -- tidak ada tag tersembunyi yang menempel.
 */
export function buildWaHref(baseMessage: string, phone: string = "6285187283900"): string {
  const tag = getRefTag();
  const pesan = tag ? `${baseMessage}${encodeInvisibleTag(tag)}` : baseMessage;
  return `https://wa.me/${phone}?text=${encodeURIComponent(pesan)}`;
}
