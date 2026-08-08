// Menangkap UTM/click-id dari URL saat orang mendarat dari iklan (Google
// Search, PMax, dst), simpan di sessionStorage supaya bertahan sepanjang
// kunjungan, lalu tempelkan sebagai tag singkat ke pesan WhatsApp.
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
 * Tag ringkas untuk ditempel ke pesan WA, contoh "google-cpc-brand" atau
 * "google-pmax". Return null kalau tidak ada referral tersimpan --
 * kunjungan organik/direct TIDAK diberi tag karangan.
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

/**
 * Bangun URL wa.me lengkap dari pesan dasar yang SUDAH ADA di tiap
 * halaman (jangan diseragamkan -- pesan spesifik per halaman itu berguna
 * buat sales tahu konteksnya). Kalau tidak ada referral tersimpan, pesan
 * dikembalikan APA ADANYA -- tidak ada tag kosong yang menempel.
 */
export function buildWaHref(baseMessage: string, phone: string = "6285187283900"): string {
  const tag = getRefTag();
  const pesan = tag ? `${baseMessage} (ref: ${tag})` : baseMessage;
  return `https://wa.me/${phone}?text=${encodeURIComponent(pesan)}`;
}
