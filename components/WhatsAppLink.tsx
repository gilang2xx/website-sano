import React from 'react';
import { buildWaHref } from '../utils/attribution';
import { createWhatsAppClickHandler } from '../utils/tracking';
import type { WhatsAppPlacement } from '../utils/tracking';
import { WA_PHONE_MAIN, csIdForPhone } from '../utils/whatsapp';

type AnchorProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

export interface WhatsAppLinkProps extends AnchorProps {
  /** Pesan dasar. Tag atribusi iklan ditempel otomatis oleh buildWaHref. */
  message: string;
  /** Nomor tujuan. Default = nomor utama. */
  phone?: string;
  /** Label event lama/baru (`event_label`). */
  eventLabel: string;
  /** ID stabil tombol, mis. `home-hero-konsultasi-gratis`. */
  buttonId: string;
  placement: WhatsAppPlacement;
  /**
   * Ikut memicu Meta/TikTok `Contact`. Default FALSE: tombol yang baru dicakup
   * tidak boleh memperluas pengiriman event pixel iklan.
   */
  pixels?: boolean;
}

/**
 * SATU-SATUNYA cara menampilkan tautan WhatsApp di halaman. Merender <a>
 * biasa (HTML prerender tidak berubah): target/rel/className diteruskan
 * apa adanya dan TIDAK diberi default, sehingga perilaku navigasi tiap
 * tombol sama seperti sebelumnya. Pelacakan lewat onClick, jadi aktivasi
 * keyboard (Enter pada tautan) tercatat sama seperti klik mouse.
 */
const WhatsAppLink: React.FC<WhatsAppLinkProps> = ({
  message,
  phone = WA_PHONE_MAIN,
  eventLabel,
  buttonId,
  placement,
  pixels = false,
  onClick,
  children,
  ...anchorProps
}) => {
  const track = createWhatsAppClickHandler(eventLabel, {
    buttonId,
    placement,
    cs: csIdForPhone(phone),
    pixels,
  });

  return (
    <a
      href={buildWaHref(message, phone)}
      {...anchorProps}
      onClick={(event) => {
        onClick?.(event);
        track(event);
      }}
    >
      {children}
    </a>
  );
};

export default WhatsAppLink;
