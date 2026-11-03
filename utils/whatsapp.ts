// Konstanta & helper WhatsApp yang dipakai bersama oleh komponen/halaman.
// Nomor di sini SAMA dengan yang sebelumnya tersebar di Layout.tsx dan
// default `buildWaHref` (utils/attribution.ts) -- tidak ada nomor baru.
import { buildWaHref } from './attribution';
import { trackWhatsAppClick } from './tracking';
import type { WhatsAppPlacement } from './tracking';

/** Nomor utama (CS 2). Harus sama dengan default `buildWaHref`. */
export const WA_PHONE_MAIN = '6285187283900';
/** Nomor CS 1 (hanya dipakai tombol footer). */
export const WA_PHONE_CS1 = '6285166662896';

/** Pesan prefilled tombol melayang & footer (tidak diubah). */
export const WA_DEFAULT_CHAT_MESSAGE = 'Halo Sano, saya tertarik konsultasi';

/** Kode CS untuk analitik. Nomor telepon tidak pernah dikirim ke dataLayer. */
export function csIdForPhone(phone: string | undefined): string | undefined {
  const digits = String(phone ?? '').replace(/\D/g, '');
  if (digits === WA_PHONE_CS1) return 'cs1';
  if (digits === WA_PHONE_MAIN) return 'cs2';
  return undefined;
}

/**
 * Slug aman untuk ID tombol dari judul layanan/paket (huruf kecil, angka,
 * tanda hubung). Dipakai agar `wa_button_id` stabil & tidak memuat spasi.
 */
export function toButtonSlug(text: string | undefined): string {
  return String(text ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'tanpa-judul';
}

const WA_HOST_PATTERN = /^https?:\/\/(?:wa\.me|api\.whatsapp\.com|wa\.link)\//i;

/** Apakah href menunjuk ke WhatsApp (dipakai untuk tautan isi artikel CMS). */
export function isWhatsAppHref(href: string | undefined): boolean {
  return typeof href === 'string' && WA_HOST_PATTERN.test(href);
}

/** Kode CS dari tautan `https://wa.me/<nomor>?...`; undefined bila bukan nomor CS dikenal. */
export function csIdForHref(href: string | undefined): string | undefined {
  const match = typeof href === 'string' ? /^https?:\/\/wa\.me\/(\d+)/i.exec(href) : null;
  return match ? csIdForPhone(match[1]) : undefined;
}

interface OpenWhatsAppChatOptions {
  phone: string;
  message?: string;
  eventLabel: string;
  buttonId: string;
  placement: WhatsAppPlacement;
  /** Lihat WhatsAppTrackingMeta.pixels. Default true: tombol ini sudah memicu pixel sebelum patch. */
  pixels?: boolean;
}

/**
 * Untuk tombol (bukan <a>) yang membuka WhatsApp lewat window.open:
 * catat satu event lalu buka chat. Perilaku buka-tab sama seperti sebelumnya
 * (`window.open(url, '_blank')`); pesan ditempeli tag atribusi bila ada.
 */
export function openWhatsAppChat(options: OpenWhatsAppChatOptions): void {
  const { phone, message = WA_DEFAULT_CHAT_MESSAGE, eventLabel, buttonId, placement, pixels = true } = options;
  trackWhatsAppClick(eventLabel, { buttonId, placement, cs: csIdForPhone(phone), pixels });
  window.open(buildWaHref(message, phone), '_blank');
}
