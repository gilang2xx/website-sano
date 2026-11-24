import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, Star, Check, ShieldCheck, Truck, Clock, MapPin, ArrowRight } from 'lucide-react';
import WhatsAppLink from '../WhatsAppLink';
import ThemeToggle from '../ThemeToggle';
import type { WhatsAppPlacement } from '../../utils/tracking';
import { captureAdReferral, endAttributionHydration } from '../../utils/attribution';
import { FACTS, GOOGLE_MAPS_URL, HEALTH_NOTE } from './landingData';
import type { PhotoPair, Review } from './landingData';

// Kit tampilan untuk landing sample. Satu halaman, satu tujuan: klik WA.
// Semua WA lewat WhatsAppLink (event click_whatsapp), tanpa event/tag baru.

/* ───────────── Cangkang halaman (tanpa menu & footer penuh) ───────────── */

export const LandingShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  // Sama seperti Layout: tangkap UTM/gclid tiap kedatangan, lalu selesaikan hydration atribusi.
  useEffect(() => { captureAdReferral(); }, [location]);
  useEffect(() => { endAttributionHydration(); }, []);
  useEffect(() => { window.scrollTo(0, 0); }, [location]);

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 dark:text-text-dark bg-bg-light dark:bg-bg-dark transition-colors duration-300">
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-bg-dark/90 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <span className="select-none">
            <img src="/klinikmatras-light.png" alt="Klinik Matras by SANO CARE" className="h-8 w-auto block dark:hidden" width={140} height={32} />
            <img src="/klinikmatras-dark.png" alt="Klinik Matras by SANO CARE" className="h-8 w-auto hidden dark:block" width={140} height={32} />
          </span>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-grow">{children}</main>
      <footer className="py-8 pb-28 text-center text-xs text-slate-500 dark:text-text-muted">
        <p>Klinik Matras by SANO CARE. Workshop dan kantor di Depok.</p>
        <Link to="/kebijakan-privasi" className="inline-block mt-2 underline min-h-[44px] leading-[44px]">Kebijakan Privasi</Link>
      </footer>
    </div>
  );
};

/* ───────────── Tombol WA ───────────── */

interface WaProps {
  buttonId: string;
  placement: WhatsAppPlacement;
  label: string;
  message: string;
  eventLabel: string;
  className?: string;
}

export const WaButton: React.FC<WaProps> = ({ buttonId, placement, label, message, eventLabel, className = '' }) => (
  <WhatsAppLink
    message={message}
    eventLabel={eventLabel}
    buttonId={buttonId}
    placement={placement}
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex items-center justify-center gap-2 min-h-[52px] px-7 rounded-full bg-green-700 hover:bg-green-800 text-white text-base font-bold shadow-lg shadow-green-900/20 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-green-400/60 ${className}`}
  >
    <MessageCircle size={22} aria-hidden="true" />
    {label}
  </WhatsAppLink>
);

/**
 * Tombol melayang. mode="after-hero": muncul setelah elemen sentinel (hero)
 * lewat layar. mode="bar": bar penuh yang selalu kelihatan di bawah.
 */
export const FloatingWa: React.FC<WaProps & { sentinelRef?: React.RefObject<HTMLElement | null>; mode: 'after-hero' | 'bar' }> = ({
  mode, sentinelRef, ...wa
}) => {
  const [show, setShow] = useState(mode === 'bar');
  useEffect(() => {
    if (mode === 'bar') return;
    const el = sentinelRef?.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setShow(true); return; }
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [mode, sentinelRef]);

  if (mode === 'bar') {
    return (
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-bg-surface/95 backdrop-blur border-t border-slate-200 dark:border-slate-700 px-4 py-3">
        <div className="max-w-md mx-auto">
          <WaButton {...wa} className="w-full" />
        </div>
      </div>
    );
  }
  return (
    <div className={`fixed bottom-4 right-4 z-40 transition-all duration-300 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}`} aria-hidden={!show}>
      <WaButton {...wa} className="!px-5" />
    </div>
  );
};

/* ───────────── Blok-blok isi ───────────── */

export const Section: React.FC<{ children: React.ReactNode; tone?: 'plain' | 'soft'; id?: string; className?: string }> = ({ children, tone = 'plain', id, className = '' }) => (
  <section id={id} className={`py-10 md:py-16 ${tone === 'soft' ? 'bg-white dark:bg-bg-surface' : ''} ${className}`}>
    <div className="max-w-5xl mx-auto px-5">{children}</div>
  </section>
);

export const H2: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h2 className={`text-2xl md:text-3xl font-extrabold leading-tight text-slate-900 dark:text-white ${className}`}>{children}</h2>
);

export const Muted: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed ${className}`}>{children}</p>
);

/** Sepasang foto sebelum/sesudah. Seluruhnya bisa diklik ke /before-after. */
export const PairCard: React.FC<{ pair: PhotoPair; eager?: boolean; caption?: boolean }> = ({ pair, eager = false, caption = true }) => (
  <Link
    to="/before-after"
    aria-label={`Lihat galeri before-after lengkap. Contoh: ${pair.title}`}
    className="group block rounded-2xl overflow-hidden bg-white dark:bg-bg-surface border border-slate-200 dark:border-slate-700 shadow-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/50"
  >
    <div className="grid grid-cols-2 gap-0.5 bg-slate-200 dark:bg-slate-700">
      {([['Sebelum', pair.before, pair.altBefore], ['Sesudah', pair.after, pair.altAfter]] as const).map(([lbl, src, alt]) => (
        <figure key={lbl} className="relative m-0 bg-slate-100 dark:bg-slate-800">
          <img
            src={src}
            alt={alt}
            width={pair.w}
            height={pair.h}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            {...(eager ? { fetchPriority: 'high' as const } : {})}
            className="w-full h-auto block aspect-[4/3] object-cover"
          />
          <figcaption className={`absolute left-2 top-2 text-xs font-bold px-2.5 py-1 rounded-full ${lbl === 'Sesudah' ? 'bg-green-700 text-white' : 'bg-slate-900/80 text-white'}`}>{lbl}</figcaption>
        </figure>
      ))}
    </div>
    {caption && (
      <div className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
        <span className="font-semibold text-slate-800 dark:text-slate-100">{pair.title}</span>
        <ArrowRight size={18} className="shrink-0 text-primary dark:text-primary-light transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </div>
    )}
  </Link>
);

export const GalleryLink: React.FC<{ className?: string }> = ({ className = '' }) => (
  <Link
    to="/before-after"
    className={`inline-flex items-center gap-2 min-h-[48px] px-5 rounded-full border-2 border-primary text-primary dark:border-primary-light dark:text-primary-light font-bold hover:bg-primary hover:text-white dark:hover:bg-primary-light dark:hover:text-slate-900 transition-colors ${className}`}
  >
    Lihat semua hasil before-after <ArrowRight size={18} aria-hidden="true" />
  </Link>
);

/** Baris rating statis (tanpa widget pihak ketiga). */
export const RatingLine: React.FC<{ className?: string }> = ({ className = '' }) => (
  <p className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-700 dark:text-slate-200 ${className}`}>
    <span className="inline-flex" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => <Star key={i} size={16} className="fill-amber-400 text-amber-400" />)}
    </span>
    <strong>{FACTS.rating}</strong> di Google dari {FACTS.reviewCount} ulasan
  </p>
);

export const ReviewBlock: React.FC<{ reviews: Review[]; title?: string }> = ({ reviews, title = 'Kata mereka yang sudah pakai' }) => (
  <div>
    <H2>{title}</H2>
    <div className="mt-4 flex items-center gap-3 flex-wrap">
      <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{FACTS.rating}</span>
      <div>
        <span className="flex" aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={20} className="fill-amber-400 text-amber-400" />)}</span>
        <span className="text-sm text-slate-600 dark:text-slate-300">{FACTS.reviewCount} ulasan Google (data {FACTS.ratingDate})</span>
      </div>
    </div>
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      {reviews.map((r) => (
        <figure key={r.name} className="m-0 p-5 rounded-2xl bg-white dark:bg-bg-surface border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="flex mb-2" aria-label="5 dari 5 bintang">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={16} className="fill-amber-400 text-amber-400" aria-hidden="true" />)}</span>
          <blockquote className="m-0 text-slate-700 dark:text-slate-200 leading-relaxed">&ldquo;{r.text}&rdquo;</blockquote>
          <figcaption className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">{r.name}, ulasan Google</figcaption>
        </figure>
      ))}
    </div>
    <a
      href={GOOGLE_MAPS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-6 inline-flex items-center gap-2 min-h-[48px] px-5 rounded-full border-2 border-slate-300 dark:border-slate-600 font-bold text-slate-800 dark:text-slate-100 hover:border-primary hover:text-primary dark:hover:border-primary-light dark:hover:text-primary-light transition-colors"
    >
      Lihat semua ulasan di Google Maps <ArrowRight size={18} aria-hidden="true" />
    </a>
  </div>
);

/** Badge garansi berlabel Klinik Matras. */
export const WarrantyBadges: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex flex-wrap gap-3 ${className}`}>
    {[['Upgrade', FACTS.warrantyUpgrade], ['Service', FACTS.warrantyService]].map(([name, yrs]) => (
      <div key={name} className="flex items-center gap-3 rounded-2xl border-2 border-primary/30 dark:border-primary-light/40 bg-primary-light/40 dark:bg-primary-dark/30 px-4 py-3">
        <ShieldCheck size={28} className="text-primary dark:text-primary-light shrink-0" aria-hidden="true" />
        <div className="leading-tight">
          <div className="text-xs font-bold uppercase tracking-wide text-primary dark:text-primary-light">Garansi Klinik Matras</div>
          <div className="text-lg font-extrabold text-slate-900 dark:text-white">{name} {yrs}</div>
        </div>
      </div>
    ))}
  </div>
);

export const Steps: React.FC<{ steps: string[] }> = ({ steps }) => (
  <ol className="mt-6 grid gap-4 md:grid-cols-3 list-none p-0 m-0">
    {steps.map((s, i) => (
      <li key={i} className="flex gap-4 items-start p-5 rounded-2xl bg-white dark:bg-bg-surface border border-slate-200 dark:border-slate-700">
        <span className="shrink-0 w-10 h-10 rounded-full bg-primary text-white font-extrabold flex items-center justify-center" aria-hidden="true">{i + 1}</span>
        <p className="m-0 text-slate-700 dark:text-slate-200 leading-relaxed pt-1.5">{s}</p>
      </li>
    ))}
  </ol>
);

export const FactChips: React.FC<{ className?: string }> = ({ className = '' }) => (
  <ul className={`flex flex-wrap gap-2 list-none p-0 m-0 ${className}`}>
    {[
      [Truck, `Jemput-antar gratis ${FACTS.freeShipArea}`],
      [Clock, `Selesai ${FACTS.days}`],
      [MapPin, 'Workshop dan kantor di Depok'],
    ].map(([Icon, text]) => {
      const I = Icon as typeof Truck;
      return (
        <li key={text as string} className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-bg-surface border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          <I size={16} className="text-primary dark:text-primary-light shrink-0" aria-hidden="true" />{text as string}
        </li>
      );
    })}
  </ul>
);

export const HealthNote: React.FC<{ short?: boolean; className?: string }> = ({ short, className = '' }) => (
  <p className={`text-sm text-slate-600 dark:text-slate-400 leading-relaxed ${className}`}>
    {short ? 'Kasur amblas bisa ikut berperan bikin badan pegal. Nyeri berat atau menetap? Periksa ke dokter.' : HEALTH_NOTE}
  </p>
);

export const CheckItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="flex gap-3 items-start">
    <span className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-secondary-light dark:bg-secondary-dark flex items-center justify-center" aria-hidden="true">
      <Check size={16} className="text-green-800 dark:text-secondary-light" />
    </span>
    <span className="text-slate-800 dark:text-slate-100 text-base md:text-lg leading-snug">{children}</span>
  </li>
);

/** Ref untuk sentinel hero. */
export const useHeroRef = () => useRef<HTMLElement | null>(null);
