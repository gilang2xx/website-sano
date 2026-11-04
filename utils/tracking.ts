// Guard shared by every WhatsApp button so one real user click can never
// push the click_whatsapp event to the dataLayer more than once, even if
// called from multiple components or fired twice by a stray double event.
let lastWhatsAppTrackAt = 0;
const DEDUPE_WINDOW_MS = 800;

/** Penempatan tombol WhatsApp. Nilainya ikut dikirim sebagai `wa_placement`. */
export type WhatsAppPlacement =
  | 'floating'        // tombol hijau melayang (semua halaman)
  | 'footer'          // nomor CS di footer (semua halaman)
  | 'hero'            // CTA utama di bagian atas halaman
  | 'cta'             // CTA penutup / ajakan di tengah-akhir halaman
  | 'pricing'         // kartu paket / daftar harga
  | 'service-card'    // kartu layanan
  | 'article-cta'     // CTA di dalam artikel (legacy & CMS)
  | 'article-body'    // tautan WhatsApp yang ditulis penulis di isi artikel CMS
  | 'privacy-contact';// kartu kontak di Kebijakan Privasi

/**
 * Identitas tombol. TIDAK berisi data pribadi dan TIDAK berisi nomor telepon
 * (CS dikirim sebagai kode `cs1`/`cs2`, bukan nomornya).
 *
 * Field ini hanya MENAMBAH key pada objek dataLayer. Key tambahan tidak sampai
 * ke GA4/Ads sebelum dipetakan di GTM (variabel Data Layer + parameter event
 * pada tag GA4) -- lihat laporan patch.
 */
export interface WhatsAppTrackingMeta {
  /** ID stabil per tombol, mis. `home-hero-konsultasi-gratis`. */
  buttonId?: string;
  placement?: WhatsAppPlacement;
  /** `cs1` | `cs2` (lihat utils/whatsapp.ts). */
  cs?: string;
  /**
   * Ikut memicu Meta Pixel `Contact` dan TikTok `Contact`. Default `true`
   * HANYA supaya pemanggil lama (satu argumen) berperilaku persis seperti dulu.
   * Tombol yang baru dicakup HARUS mengirim `false` -- cakupan pixel iklan
   * tidak boleh melebar sebagai efek samping.
   */
  pixels?: boolean;
}

// Single source of truth for the WhatsApp click conversion event.
// GTM's "Tracking Konversi Google Ads" tag listens for a dataLayer push
// with `event: 'click_whatsapp'`. Do not also call gtag('event', 'click_whatsapp', ...)
// anywhere else — gtag() is defined in index.html as `dataLayer.push(arguments)`,
// so calling both pushes the same conversion twice per click.
//
// Payload lama (event, event_category, event_label, value) TIDAK berubah.
// Key identitas (`wa_*`) hanya ditambahkan di belakangnya.
export function trackWhatsAppClick(eventLabel: string, meta: WhatsAppTrackingMeta = {}): void {
  if (typeof window === 'undefined') return;

  const now = Date.now();
  if (now - lastWhatsAppTrackAt < DEDUPE_WINDOW_MS) return;
  lastWhatsAppTrackAt = now;

  const w = window as any;

  const payload: Record<string, unknown> = {
    event: 'click_whatsapp',
    event_category: 'Kontak',
    event_label: eventLabel,
    value: 1,
  };
  if (meta.buttonId) payload.wa_button_id = meta.buttonId;
  if (meta.placement) payload.wa_placement = meta.placement;
  if (meta.cs) payload.wa_cs = meta.cs;
  // Hanya pathname (tanpa query/hash): query bisa memuat gclid/UTM.
  const pathname = w.location && typeof w.location.pathname === 'string' ? w.location.pathname : '';
  if (pathname) payload.wa_page_path = pathname;

  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push(payload);

  if (meta.pixels !== false) {
    if (w.fbq) {
      w.fbq('track', 'Contact');
    }

    if (w.ttq) {
      w.ttq.track('Contact');
    }
  }
}

/**
 * Handler onClick bersama untuk tautan/tombol WhatsApp. Klik yang sudah
 * dibatalkan (`preventDefault`) bukan aktivasi dan tidak dicatat. Dipicu
 * oleh `click`, sehingga Enter pada tautan dan Space/Enter pada tombol
 * (akses keyboard) ikut tercatat tanpa handler keyboard terpisah.
 */
export function createWhatsAppClickHandler(eventLabel: string, meta: WhatsAppTrackingMeta = {}) {
  return (event?: { defaultPrevented?: boolean }): void => {
    if (event && event.defaultPrevented) return;
    trackWhatsAppClick(eventLabel, meta);
  };
}
