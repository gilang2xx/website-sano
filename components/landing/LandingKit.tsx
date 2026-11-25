import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Star, ArrowRight, ArrowUpRight, ChevronsLeftRight, ShieldCheck, Clock, Truck, MapPin, Check, Plus } from 'lucide-react';
import WhatsAppLink from '../WhatsAppLink';
import ThemeToggle from '../ThemeToggle';
import type { WhatsAppPlacement } from '../../utils/tracking';
import { captureAdReferral, endAttributionHydration } from '../../utils/attribution';
import { FACTS, GOOGLE_MAPS_URL, HEALTH_NOTE } from './landingData';
import type { PhotoPair, Review } from './landingData';

// MOCKUP visual landing: hero foto asli, satu pesan per layar, satu foto per pesan.
// Semua WA lewat WhatsAppLink (event click_whatsapp yang sudah ada), tanpa tag/event baru.
// Palet SANO: biru #1660cf / #2f86ea, navy #0b2a6f, putih. Lime #c8f53c hanya titik kecil dan tombol di pita biru.
// Font: system stack gaya Apple (tanpa file SF). Serif italic (Instrument Serif, OFL) hanya untuk 1-3 kata aksen di judul.

export const ACCENT = '#1660cf';
export const NAVY = '#0b2a6f';
export const LIME = '#c8f53c';

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, Inter, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

const CSS = `
@font-face{font-family:"Instrument Serif";font-style:italic;font-weight:400;font-display:swap;src:url(/landing/fonts/is-italic.woff2) format("woff2")}
.lp-serif{font-family:"Instrument Serif",ui-serif,Georgia,"Times New Roman",serif;font-style:italic;font-weight:400;letter-spacing:-.01em}
.lp-rv{opacity:0;transform:translateY(24px);transition:opacity .8s ease,transform .8s cubic-bezier(.2,.7,.2,1)}
.lp-rv.in{opacity:1;transform:none}
.lp-big{font-size:clamp(2.1rem,8.4vw,4.5rem);line-height:1.04;letter-spacing:-.03em;font-weight:700}
.lp-h2{font-size:clamp(1.8rem,6.2vw,3.25rem);line-height:1.18;letter-spacing:-.028em;font-weight:700}
.lp-num{font-size:clamp(3rem,13vw,6rem);line-height:1;letter-spacing:-.04em;font-weight:700}
.lp-ribbon{background:linear-gradient(120deg,#0b2a6f 0%,#1660cf 55%,#2f86ea 100%)}
.lp-glass{background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.34);box-shadow:0 18px 40px rgba(5,10,42,.3);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px)}
@media (max-width:767px){.lp-glass{-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}}
.lp-range{-webkit-appearance:none;appearance:none;background:transparent;margin:0;cursor:ew-resize;touch-action:pan-y}
.lp-range::-webkit-slider-thumb{-webkit-appearance:none;width:44px;height:100vh;background:transparent;border:0}
.lp-range::-moz-range-thumb{width:44px;height:100vh;background:transparent;border:0}
.lp-hl{background:#1660cf;color:#fff;white-space:nowrap;padding:.04em .2em;border-radius:.28em;-webkit-box-decoration-break:clone;box-decoration-break:clone}
details>summary{list-style:none}details>summary::-webkit-details-marker{display:none}
details[open] .lp-plus{transform:rotate(45deg)}
@keyframes lp-marq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.lp-marq{animation:lp-marq 26s linear infinite}
@media (min-width:768px){.lp-marq{animation:none}}
@media (prefers-reduced-motion:reduce){.lp-rv{opacity:1;transform:none;transition:none}.lp-marq{animation:none}}
`;

/* ───────────── Gambar (srcset, width/height tetap) ───────────── */

const IMG = {
  masalah: { w: [360, 720, 1000], r: 4 / 5 },
  langkah1: { w: [360, 720, 1000], r: 1 },
  langkah2: { w: [360, 720, 1000], r: 1414 / 2000 },
  konsul: { w: [360, 720, 1000], r: 4 / 5 },
  langkah3: { w: [360, 720], r: 1 },
  service: { w: [360, 720], r: 4 / 5 },
  upgrade: { w: [360, 720], r: 4 / 5 },
  workshop: { w: [360, 720, 941], r: 4 / 5 },
} as const;
export type PhotoName = keyof typeof IMG;

export const Photo: React.FC<{ name: PhotoName; alt: string; sizes?: string; eager?: boolean; className?: string }> = ({ name, alt, sizes = '(min-width:768px) 560px, 92vw', eager = false, className = '' }) => {
  const { w, r } = IMG[name];
  const widths = w as readonly number[];
  const largest = widths[widths.length - 1];
  return (
    <img
      src={`/landing/p-${name}-${largest}.webp`}
      srcSet={widths.map((x) => `/landing/p-${name}-${x}.webp ${x}w`).join(', ')}
      sizes={sizes}
      width={largest}
      height={Math.round(largest / r)}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      {...(eager ? { fetchPriority: 'high' as const } : {})}
      style={{ aspectRatio: `${largest} / ${Math.round(largest / r)}` }}
      className={`block w-full h-auto object-cover ${className}`}
    />
  );
};

/* ───────────── Muncul perlahan saat scroll ───────────── */

export const Reveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className = '', delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setOn(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`lp-rv ${on ? 'in' : ''} ${className}`}>{children}</div>;
};

/* ───────────── Cangkang halaman ───────────── */

/** Identitas halaman landing: kode sumber di teks WA ([LP-COLD-A]) dan parameter landing_id/audience di event click_whatsapp. */
const LandingCtx = createContext<{ landingId: string; audience: string } | null>(null);

export const LandingShell: React.FC<{ children: React.ReactNode; landingId: string; audience: 'cold' | 'warm' | 'hot' }> = ({ children, landingId, audience }) => {
  const location = useLocation();
  useEffect(() => { captureAdReferral(); }, [location]);
  useEffect(() => { endAttributionHydration(); }, []);
  useEffect(() => { window.scrollTo(0, 0); }, [location]);

  return (
    <LandingCtx.Provider value={{ landingId, audience }}>
    <div style={{ fontFamily: FONT }} className="min-h-screen flex flex-col text-[#1d1d1f] dark:text-[#f5f5f7] bg-white dark:bg-black antialiased">
      <style>{CSS}</style>
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-black/60 backdrop-blur-xl backdrop-saturate-150 border-b border-black/5 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <span className="select-none">
            <img src="/landing/logo-km-light.webp" alt="Klinik Matras by SANO CARE" className="h-7 w-auto block dark:hidden" width={78} height={28} />
            <img src="/landing/logo-km-dark.webp" alt="Klinik Matras by SANO CARE" className="h-7 w-auto hidden dark:block" width={78} height={28} />
          </span>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-grow">{children}</main>
      <footer className="text-white" style={{ backgroundColor: NAVY }}>
        <div className="max-w-6xl mx-auto px-5 py-12 pb-28 grid gap-8 md:grid-cols-3">
          <div>
            <img src="/landing/logo-km-dark.webp" alt="Klinik Matras by SANO CARE" className="h-8 w-auto" width={90} height={32} loading="lazy" />
            <p className="mt-4 text-sm leading-relaxed text-white/70 max-w-xs">Service dan upgrade kasur. Workshop dan kantor di Depok. Antar-jemput gratis Jabodetabek dan Bandung.</p>
          </div>
          <nav aria-label="Tautan" className="flex flex-col text-sm">
            <Link reloadDocument to="/before-after" className="min-h-[44px] flex items-center text-white/80 hover:text-white">Hasil before-after</Link>
            <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="min-h-[44px] flex items-center text-white/80 hover:text-white">Ulasan di Google Maps</a>
            <Link reloadDocument to="/kebijakan-privasi" className="min-h-[44px] flex items-center text-white/80 hover:text-white">Kebijakan Privasi</Link>
          </nav>
          <p className="text-sm text-white/60 leading-relaxed">Chat dibalas {FACTS.hours}.<br />Klinik Matras by SANO CARE.</p>
        </div>
      </footer>
    </div>
    </LandingCtx.Provider>
  );
};

/* ───────────── Tombol ───────────── */

/** Ikon WhatsApp monokrom (mengikuti warna teks: putih di tombol biru, hitam/navy di tombol lime). */
const WaIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

interface WaProps {
  buttonId: string;
  placement: WhatsAppPlacement;
  label: string;
  message: string;
  eventLabel: string;
  className?: string;
  tone?: 'blue' | 'lime';
}

/** Tombol utama = WhatsApp: pil biru SANO (hover navy), ikon WA putih monokrom di kiri teks. Tone lime = di atas pita biru. */
export const WaButton: React.FC<Omit<WaProps, 'label'> & { label: React.ReactNode }> = ({ buttonId, placement, label, message, eventLabel, className = '', tone = 'blue' }) => {
  const lp = useContext(LandingCtx);
  return (
  <WhatsAppLink
    message={lp ? `${message} [${lp.landingId}]` : message}
    eventLabel={eventLabel}
    buttonId={buttonId}
    placement={placement}
    landingId={lp?.landingId}
    audience={lp?.audience}
    data-wa="1"
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex items-center justify-center gap-2 md:gap-2.5 min-h-[56px] px-5 md:px-7 rounded-full whitespace-nowrap text-base md:text-[17px] font-semibold tracking-tight shadow-lg shadow-black/20 transition-colors active:scale-[.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1660cf]/40 ${tone === 'blue' ? 'bg-[#1660cf] hover:bg-[#0b2a6f] text-white' : 'bg-[#c8f53c] hover:bg-[#b6e22a] text-black'} ${className}`}
  >
    <WaIcon size={20} />
    {label}
  </WhatsAppLink>
  );
};

/** Tombol WA lime di atas pita biru (CTA penutup). */
export const HeroWaButton: React.FC<Omit<WaProps, 'tone'>> = (p) => <WaButton {...p} tone="lime" />;

/** Tombol kedua = tautan teks. */
export const TextLink: React.FC<{ to?: string; href?: string; children: React.ReactNode; className?: string }> = ({ to, href, children, className = '' }) => {
  const cls = `inline-flex items-center gap-1 min-h-[44px] text-[17px] font-medium text-[#1660cf] dark:text-[#4d94ff] hover:underline ${className}`;
  return to
    ? <Link reloadDocument to={to} className={cls}>{children}<ArrowRight size={17} aria-hidden="true" /></Link>
    : <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}<ArrowRight size={17} aria-hidden="true" /></a>;
};

/**
 * Satu-satunya tombol WA melayang. HP: bar bawah sticky selebar layar. Desktop: pil kecil kanan bawah.
 * Muncul hanya setelah hero keluar layar dan sembunyi saat pita CTA biru terlihat (IntersectionObserver),
 * jadi tidak pernah ada dua tombol WA berdampingan. Animasi geser halus, mati bila pengguna memilih kurangi gerakan.
 */
export const FloatingWa: React.FC<Omit<WaProps, 'label' | 'tone' | 'className'> & { sentinelRef: React.RefObject<HTMLElement | null>; labelMobile?: string; labelDesktop?: string }> = ({ sentinelRef, labelMobile = 'Konsultasi lewat WA', labelDesktop = 'Konsultasi lewat WA', ...wa }) => {
  const [heroIn, setHeroIn] = useState(true);
  const [ribbonIn, setRibbonIn] = useState(false);
  const [btnIn, setBtnIn] = useState(false);
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') { setHeroIn(false); return; }
    const watch = (el: Element | null, set: (v: boolean) => void) => {
      if (!el) return () => undefined;
      const io = new IntersectionObserver(([e]) => set(e.isIntersecting), { threshold: 0 });
      io.observe(el);
      return () => io.disconnect();
    };
    const off1 = watch(sentinelRef.current, setHeroIn);
    const off2 = watch(document.getElementById('cta-ribbon'), setRibbonIn);
    // Sembunyi juga saat tombol WA lain di halaman sedang terlihat: tidak pernah dua tombol WA bersamaan.
    const live = new Set<Element>();
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => (e.isIntersecting ? live.add(e.target) : live.delete(e.target)));
      setBtnIn(live.size > 0);
    });
    document.querySelectorAll('main a[data-wa]').forEach((a) => { if (!a.closest('[data-floating]')) io.observe(a); });
    return () => { off1(); off2(); io.disconnect(); };
  }, [sentinelRef]);

  const show = !heroIn && !ribbonIn && !btnIn;
  return (
    <div
      data-floating="wa"
      aria-hidden={!show}
      className={`fixed z-40 inset-x-0 bottom-0 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] bg-white/80 dark:bg-black/75 backdrop-blur-md border-t border-black/5 dark:border-white/10 md:inset-x-auto md:right-5 md:bottom-5 md:p-0 md:bg-transparent md:dark:bg-transparent md:backdrop-blur-none md:border-0 transition-[transform,opacity,visibility] duration-500 ease-out motion-reduce:transition-none ${show ? 'translate-y-0 opacity-100 visible' : 'translate-y-full opacity-0 invisible'}`}
    >
      <WaButton {...wa} label={<><span className="md:hidden">{labelMobile}</span><span className="hidden md:inline">{labelDesktop}</span></>} className="w-full md:w-auto" />
    </div>
  );
};

/* ───────────── Tata letak ───────────── */

export const Screen: React.FC<{ children: React.ReactNode; tone?: 'white' | 'grey'; className?: string; id?: string }> = ({ children, tone = 'white', className = '', id }) => (
  <section id={id} className={`py-12 md:py-20 ${tone === 'grey' ? 'bg-[#f5f5f7] dark:bg-[#0a0a0a]' : 'bg-white dark:bg-black'} ${className}`}>
    <div className="max-w-5xl mx-auto px-5">{children}</div>
  </section>
);

export const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-sm font-semibold uppercase tracking-[.14em] text-[#1660cf] dark:text-[#4d94ff] mb-3">{children}</p>
);

export const Lead: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`text-lg md:text-2xl leading-snug tracking-tight text-[#6e6e73] dark:text-[#a1a1a6] ${className}`}>{children}</p>
);

/** Kata aksen serif italic (1-3 kata). */
export const Serif: React.FC<{ children: React.ReactNode }> = ({ children }) => <span className="lp-serif">{children}</span>;

/** Highlight stabilo biru pada frasa kunci. */
export const Hl: React.FC<{ children: React.ReactNode }> = ({ children }) => <mark className="lp-hl">{children}</mark>;

export const HealthNote: React.FC<{ short?: boolean; className?: string }> = ({ short, className = '' }) => (
  <p className={`text-sm leading-relaxed text-[#6e6e73] dark:text-[#a1a1a6] ${className}`}>
    {short ? 'Kasur amblas bisa ikut berperan bikin badan pegal. Nyeri berat atau menetap? Periksa ke dokter.' : HEALTH_NOTE}
  </p>
);

/* ───────────── Hero: gambar penuh (ibu + kasur sebelum/sesudah), teks di area biru kosong ───────────── */

// Gambar hero tanpa label ilustrasi = keputusan owner 25 Nov 2026.
// Syarat dari owner: tidak ada teks/caption/alt yang menyatakan gambar ini "hasil kerja kami" atau foto pelanggan;
// bukti nyata ada di slider before-after FOTO ASLI tepat di bawah hero (BigCase).
// <picture>: portrait untuk <=767px (jadi latar kartu, ibu + kasur mengisi bagian bawah), landscape untuk >=768px.
export const PhotoHero = React.forwardRef<HTMLElement, {
  pill: string; title: React.ReactNode; lead: React.ReactNode; actions: React.ReactNode;
  checks?: string[];
}>(({ pill, title, lead, actions, checks }, ref) => {
  // Preload gambar hero sesuai lebar layar + font serif (halaman ini dirender di sisi klien; saat diprerender, pindahkan ke <head>).
  useEffect(() => {
    const links: HTMLLinkElement[] = [];
    const add = (attrs: Record<string, string>) => {
      const l = document.createElement('link');
      Object.entries(attrs).forEach(([k, v]) => l.setAttribute(k, v));
      document.head.appendChild(l); links.push(l);
    };
    add({ rel: 'preload', as: 'image', href: '/landing/hero-portrait.webp', media: '(max-width: 767px)' });
    add({ rel: 'preload', as: 'image', href: '/landing/hero-landscape.webp', media: '(min-width: 768px)' });
    add({ rel: 'preload', as: 'font', type: 'font/woff2', href: '/landing/fonts/is-italic.woff2', crossorigin: 'anonymous' });
    return () => links.forEach((l) => l.remove());
  }, []);

  return (
    <section ref={ref} className="px-3 md:px-5 pt-3 md:pt-4 bg-white dark:bg-black">
      <div className="relative max-w-7xl mx-auto overflow-hidden rounded-[28px] md:rounded-[44px] text-white h-[560px] md:h-auto md:min-h-[600px]" style={{ backgroundColor: '#02388a' }}>
        {/* gambar: HP = latar bawah kartu, desktop = kanan */}
        <div className="absolute z-0 pointer-events-none bottom-0 inset-x-0 md:inset-y-0 md:bottom-auto md:left-[24%] md:right-0 [mask-image:linear-gradient(to_bottom,transparent,#000_16%)] md:[mask-image:linear-gradient(to_right,transparent,#000_14%)]">
          <picture>
            <source media="(min-width: 768px)" srcSet="/landing/hero-landscape.webp" width={1920} height={1080} />
            <img src="/landing/hero-portrait.webp" width={1152} height={1440} alt="Ibu tersenyum menekan kasur putih yang sudah diperbarui, di sebelah kasur lama yang kusam" loading="eager" decoding="async" {...{ fetchPriority: 'high' as const }}
              className="block w-full h-auto md:h-full md:object-cover md:object-center" />
          </picture>
        </div>
        {/* teks rapat di atas */}
        <div className="relative z-10 px-5 md:px-12 pt-5 md:pt-14 pb-2 md:pb-14 md:max-w-[50%] md:min-h-[600px] md:flex md:flex-col md:justify-center">
          <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" aria-label={`Rating ${FACTS.rating} dari ${FACTS.reviewCount} ulasan Google, buka Google Maps di tab baru`} className="md:hidden lp-glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap">
            <Star size={12} className="fill-amber-300 text-amber-300" aria-hidden="true" />{FACTS.rating} · {FACTS.reviewCount} ulasan Google
          </a>
          <div className="hidden md:flex flex-wrap items-center gap-2">
            <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" aria-label={`Rating ${FACTS.rating} dari ${FACTS.reviewCount} ulasan Google, buka Google Maps di tab baru`} className="lp-glass inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold hover:bg-white/25 transition-colors">
              <Star size={14} className="fill-amber-300 text-amber-300" aria-hidden="true" />{FACTS.rating} · {FACTS.reviewCount} ulasan Google <ArrowUpRight size={14} aria-hidden="true" />
            </a>
            <span className="lp-glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: LIME }} aria-hidden="true" />{pill}
            </span>
          </div>
          <h1 className="lp-big mt-3 md:mt-5 max-w-3xl !text-[clamp(1.6rem,7.6vw,1.9rem)] md:!text-[clamp(2.4rem,4vw,3.6rem)]">{title}</h1>
          <p className="mt-2 md:mt-3 text-sm md:text-xl leading-snug tracking-tight text-white/85 max-w-xl">{lead}</p>
          <div className="mt-3 md:mt-5 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 w-fit max-w-[84%] sm:max-w-none">{actions}</div>
          {checks && (
            <ul className="hidden md:flex mt-5 flex-wrap gap-x-5 gap-y-1 list-none p-0 m-0 text-sm text-white/85">
              {checks.map((c) => <li key={c} className="inline-flex items-center gap-1.5"><Check size={15} style={{ color: LIME }} aria-hidden="true" />{c}</li>)}
            </ul>
          )}
        </div>
        {checks && (
          <ul className="md:hidden absolute z-10 bottom-2.5 inset-x-3 rounded-xl bg-black/40 px-3 py-1.5 flex flex-wrap justify-center gap-x-3 gap-y-0.5 list-none m-0 text-[11px] text-white/90">
            {checks.map((c) => <li key={c} className="inline-flex items-center gap-1"><Check size={12} style={{ color: LIME }} aria-hidden="true" />{c}</li>)}
          </ul>
        )}
        <div className="hidden md:flex absolute top-8 right-8 z-10 lp-glass rounded-2xl px-4 py-3 items-center gap-3">
          <Clock size={20} aria-hidden="true" />
          <div><p className="text-xl font-bold leading-none">{FACTS.days}</p><p className="text-xs text-white/80 mt-1">pengerjaan</p></div>
        </div>
      </div>
    </section>
  );
});
PhotoHero.displayName = 'PhotoHero';

export const HeroSecondaryLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a href={href} className="hidden sm:inline-flex items-center min-h-[44px] text-[17px] font-medium text-white hover:underline underline-offset-4">{children}</a>
);

/* ───────────── Strip kepercayaan (logo Canva SANO, warna asli) ───────────── */

const LOGOS: Array<[string, string]> = [
  ['kingkoil', 'King Koil'], ['serta', 'Serta'], ['springair', 'Spring Air'], ['simmons', 'Simmons'],
  ['sealy', 'Sealy'], ['therapedic', 'Therapedic'], ['ladyamericana', 'Lady Americana'], ['florence', 'Florence'],
];

const LogoRow: React.FC<{ hidden?: boolean }> = ({ hidden }) => (
  <ul aria-hidden={hidden || undefined} className={`flex items-center gap-10 md:gap-12 list-none p-0 m-0 shrink-0 ${hidden ? 'md:hidden' : ''}`}>
    {LOGOS.map(([f, n]) => (
      <li key={f} className="flex items-center dark:bg-white dark:rounded-xl dark:px-2.5 dark:py-1.5">
        <img src={`/landing/brand-${f}.webp`} alt={hidden ? '' : n} loading="lazy" decoding="async" height={28}
          className="h-7 w-auto max-w-[120px] object-contain" />
      </li>
    ))}
  </ul>
);

export const TrustStrip: React.FC = () => (
  <section className="bg-white dark:bg-black py-8 md:py-10">
    <div className="max-w-5xl mx-auto px-5 text-center">
      <p className="text-xs md:text-sm font-semibold uppercase tracking-[.14em] text-[#6e6e73] dark:text-[#a1a1a6]">Dipercaya merestorasi berbagai merek kasur ternama</p>
    </div>
    <div className="mt-5 overflow-hidden md:flex md:justify-center [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] md:[mask-image:none]">
      <div className="lp-marq flex w-max gap-10 md:gap-0 md:w-auto px-5">
        <LogoRow />
        <LogoRow hidden />
      </div>
    </div>
  </section>
);

/* ───────────── Before-after: slider besar + strip kasus ───────────── */

export const BeforeAfterSlider: React.FC<{ pair: PhotoPair }> = ({ pair }) => {
  const [pos, setPos] = useState(50);
  return (
    <figure className="m-0">
      <div className="relative w-full overflow-hidden select-none bg-[#e8e8ed] dark:bg-[#1c1c1e] md:rounded-[28px]" style={{ aspectRatio: `${pair.w} / ${pair.h}` }}>
        <img src={pair.after} alt={pair.altAfter} width={pair.w} height={pair.h} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
        <img src={pair.before} alt={pair.altBefore} width={pair.w} height={pair.h} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" draggable={false} style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} />
        <span className="absolute left-4 top-4 text-xs font-semibold px-3 py-1.5 rounded-full bg-black/60 text-white">Sebelum</span>
        <span className="absolute right-4 top-4 text-xs font-semibold px-3 py-1.5 rounded-full text-white" style={{ backgroundColor: 'rgba(22,96,207,.9)' }}>Sesudah</span>
        <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,.4)] pointer-events-none" style={{ left: `${pos}%` }}>
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center text-[#0b2a6f]"><ChevronsLeftRight size={22} aria-hidden="true" /></span>
        </div>
        <input type="range" min={0} max={100} step={0.5} value={pos} onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`Geser untuk membandingkan sebelum dan sesudah: ${pair.title}`} className="lp-range absolute inset-0 w-full h-full opacity-0" />
      </div>
      <figcaption className="mt-3 px-5 md:px-0 text-sm text-[#6e6e73] dark:text-[#a1a1a6]"><strong className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">{pair.title}.</strong> {pair.note ? `${pair.note} ` : ''}Geser untuk membandingkan.</figcaption>
    </figure>
  );
};

/** Kasus terkuat: slider besar lebar penuh, lalu strip kasus lain yang lebih kecil. */
export const BigCase: React.FC<{ pair: PhotoPair; others?: PhotoPair[]; title?: React.ReactNode }> = ({ pair, others, title = <>Geser dan lihat <Serif>bedanya.</Serif></> }) => (
  <section id="hasil" className="bg-white dark:bg-black pb-12 md:pb-16">
    <div className="max-w-3xl mx-auto md:px-5">
      <Reveal>
        <div className="px-5 md:px-0 mb-6"><Eyebrow>Hasil asli</Eyebrow><h2 className="lp-h2 max-w-3xl">{title}</h2></div>
        <BeforeAfterSlider pair={pair} />
      </Reveal>
      {others && (
        <>
          <ul className="mt-5 flex gap-3 overflow-x-auto snap-x snap-mandatory px-5 md:px-0 pb-2 md:grid md:grid-cols-3 md:overflow-visible list-none m-0">
            {others.map((o) => (
              <li key={o.id} className="snap-center shrink-0 w-[72%] sm:w-[40%] md:w-auto">
                <Link reloadDocument to="/before-after" aria-label={`Lihat galeri before-after lengkap. Contoh: ${o.title}`}
                  className="block rounded-[20px] overflow-hidden bg-[#f5f5f7] dark:bg-[#1c1c1e] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1660cf]/40">
                  <div className="grid grid-cols-2 gap-0.5">
                    {([['Sebelum', o.before, o.altBefore], ['Sesudah', o.after, o.altAfter]] as const).map(([lbl, src, alt]) => (
                      <figure key={lbl} className="relative m-0">
                        <img src={src} alt={alt} width={o.w} height={o.h} loading="lazy" decoding="async" className="w-full aspect-[4/3] object-cover block" />
                        <figcaption className={`absolute left-2 top-2 text-[11px] font-semibold px-2 py-0.5 rounded-full text-white ${lbl === 'Sesudah' ? '' : 'bg-black/60'}`} style={lbl === 'Sesudah' ? { backgroundColor: ACCENT } : undefined}>{lbl}</figcaption>
                      </figure>
                    ))}
                  </div>
                  <p className="px-4 pt-2.5 text-sm font-semibold">{o.title}</p>
                  {o.note && <p className="px-4 pb-3 pt-0.5 text-xs leading-snug text-[#6e6e73] dark:text-[#a1a1a6]">{o.note}</p>}
                </Link>
              </li>
            ))}
          </ul>
          <div className="px-5 md:px-0 mt-2"><TextLink to="/before-after">Lihat semua hasil</TextLink></div>
        </>
      )}
    </div>
  </section>
);

/* ───────────── Satu foto + satu pesan ───────────── */

/** Foto di satu sisi, teks di sisi lain. */
export const Split: React.FC<{ photo: React.ReactNode; reverse?: boolean; children: React.ReactNode }> = ({ photo, reverse, children }) => (
  <div className="grid gap-5 md:gap-12 md:grid-cols-2 md:items-center">
    <Reveal className={reverse ? 'md:order-2' : ''}><div className="rounded-[24px] md:rounded-[28px] overflow-hidden bg-[#e8e8ed] dark:bg-[#1c1c1e]">{photo}</div></Reveal>
    <Reveal delay={80} className={reverse ? 'md:order-1' : ''}>{children}</Reveal>
  </div>
);

/** Cara kerja bernomor, zig-zag foto kiri/kanan. */
export const ZigZag: React.FC<{ steps: Array<{ title: React.ReactNode; text: string; photo: PhotoName; alt: string; badge?: string }> }> = ({ steps }) => (
  <ol className="mt-8 grid gap-10 md:gap-14 list-none p-0 m-0">
    {steps.map((s, i) => (
      <li key={i}>
        <Split reverse={i % 2 === 1} photo={<div className="relative"><Photo name={s.photo} alt={s.alt} sizes="(min-width:768px) 480px, 92vw" />{s.badge && <span className="absolute left-3 top-3 text-xs font-semibold px-3 py-1.5 rounded-full bg-white text-[#0b2a6f] shadow">{s.badge}</span>}</div>}>
          <p className="text-sm font-semibold tracking-[.14em] text-[#1660cf] dark:text-[#4d94ff]">/0{i + 1}</p>
          <h3 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight leading-tight">{s.title}</h3>
          <p className="mt-3 text-lg md:text-xl text-[#6e6e73] dark:text-[#a1a1a6] leading-snug">{s.text}</p>
        </Split>
      </li>
    ))}
  </ol>
);

/* ───────────── Bento fakta (ikon + angka) ───────────── */

export const BentoCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`rounded-[24px] md:rounded-[28px] p-6 md:p-8 flex flex-col justify-between bg-[#f5f5f7] dark:bg-[#1c1c1e] ${className}`}>{children}</div>
);

const Stars: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <span className="inline-flex" aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={size} className="fill-amber-400 text-amber-400" />)}</span>
);

const IconBox: React.FC<{ children: React.ReactNode; hi?: boolean }> = ({ children, hi }) => (
  <span className={`w-11 h-11 rounded-2xl flex items-center justify-center ${hi ? 'bg-white/20 text-white' : 'bg-[#1660cf]/10 text-[#1660cf] dark:bg-[#4d94ff]/15 dark:text-[#4d94ff]'}`} aria-hidden="true">{children}</span>
);

/** Baris angka (garis aksen tipis di atas tiap angka). */
export const NumbersRow: React.FC = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
    {([
      [Star, FACTS.rating, `rating Google, ${FACTS.reviewCount} ulasan`],
      [ShieldCheck, '20 / 10', 'tahun garansi maksimal Klinik Matras (Upgrade / Service)'],
      [Clock, '2-3', 'hari pengerjaan'],
      [Truck, 'Gratis', `antar-jemput ${FACTS.freeShipArea}`],
    ] as const).map(([Icon, n, l], i) => (
      <Reveal key={l} delay={i * 70} className="h-full">
        <div className="h-full rounded-[20px] md:rounded-[24px] border border-[#1660cf]/15 dark:border-white/10 bg-gradient-to-b from-white to-[#e8f1fd] dark:from-[#1c1c1e] dark:to-[#132238] p-4 md:p-6">
          <span aria-hidden="true" style={{ backgroundColor: Icon === Star ? '#fbbf24' : ACCENT }} className="w-11 h-11 rounded-full inline-flex items-center justify-center text-white">
            <Icon size={22} className={Icon === Star ? 'fill-current' : ''} />
          </span>
          <p className="lp-num mt-4 !text-[clamp(2rem,8vw,3.25rem)]">{n}</p>
          <p className="mt-2 text-sm md:text-base text-[#515154] dark:text-[#a1a1a6] leading-snug">{l}</p>
        </div>
      </Reveal>
    ))}
  </div>
);

/* ───────────── Kartu harga (sorotan biru penuh) ───────────── */

export const PriceCard: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <Reveal className="h-full">
    <div style={{ backgroundImage: `linear-gradient(135deg, #1d74e8 0%, ${ACCENT} 45%, #0b2a6f 100%)` }} className="relative overflow-hidden text-white rounded-[24px] md:rounded-[32px] p-7 md:p-9 h-full flex flex-col justify-between gap-5">
      <span aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 w-52 h-52 rounded-full border-[30px] border-white/10" />
      <div className="relative">
        <p className="inline-flex rounded-full bg-white/15 px-3.5 py-1.5 text-xs md:text-sm font-semibold uppercase tracking-[.12em]">Service kasur, mulai dari</p>
        <p className="lp-num mt-5 !text-[clamp(3rem,13vw,5rem)]"><span className="relative top-[.28em] align-top text-[.45em] mr-1 opacity-85">Rp</span>{FACTS.priceService.replace(/^Rp/, '')}</p>
        <p className="mt-5 flex items-start gap-3 border-t border-white/20 pt-4 text-base md:text-lg leading-snug">
          <span aria-hidden="true" className="mt-0.5 w-6 h-6 shrink-0 rounded-full bg-white text-[#0b2a6f] inline-flex items-center justify-center"><Check size={15} strokeWidth={3} /></span>
          <span>Harga pasti setelah kami lihat foto kasurmu.</span>
        </p>
      </div>
      {children && <div className="relative">{children}</div>}
    </div>
  </Reveal>
);

/* ───────────── Review statis (ulasan Google asli) ───────────── */

// Teks utuh selalu ada di HTML (hanya dipotong secara visual), jadi aman untuk prerender/aksesibilitas.
// Avatar huruf awal (gaya Google). Foto asli hanya bila r.photo diisi (sumber resmi / izin pelanggan).
const AVATAR_BG = ['#1660cf', '#0f9d58', '#db4437', '#f4b400', '#8e24aa', '#00897b', '#e8710a', '#5c6bc0'];
const avatarBg = (name: string) => AVATAR_BG[[...name].reduce((n, c) => n + c.charCodeAt(0), 0) % AVATAR_BG.length];

const ReviewCard: React.FC<{ r: Review }> = ({ r }) => {
  const [open, setOpen] = useState(false);
  return (
    <li className="snap-start shrink-0 w-[84%] sm:w-[55%] md:w-[calc((100%-2rem)/3)]">
      <figure className="m-0 h-full rounded-[24px] bg-[#f5f5f7] dark:bg-[#1c1c1e] p-6 flex flex-col">
        <figcaption className="flex items-center gap-3 mb-3">
          {r.photo ? (
            <img src={r.photo} alt="" width={40} height={40} loading="lazy" decoding="async" referrerPolicy="no-referrer" className="w-10 h-10 rounded-full object-cover shrink-0" />
          ) : (
            <span aria-hidden="true" style={{ backgroundColor: avatarBg(r.name) }} className="w-10 h-10 rounded-full shrink-0 inline-flex items-center justify-center text-white text-lg font-semibold">{r.name.trim().charAt(0).toUpperCase()}</span>
          )}
          <span className="min-w-0 leading-tight">
            {r.authorUri ? (
              <a href={r.authorUri} target="_blank" rel="noopener noreferrer" className="block font-semibold text-[15px] text-[#1d1d1f] dark:text-[#f5f5f7] truncate hover:underline">{r.name}</a>
            ) : (
              <span className="block font-semibold text-[15px] text-[#1d1d1f] dark:text-[#f5f5f7] truncate">{r.name}</span>
            )}
            <span className="block text-[13px] text-[#6e6e73] dark:text-[#a1a1a6]">Ulasan Google{r.date ? ` · ${r.date}` : ''}</span>
          </span>
        </figcaption>
        <span className="flex mb-3" role="img" aria-label="5 dari 5 bintang"><Stars size={16} /></span>
        <blockquote className="m-0 text-[17px] leading-relaxed tracking-tight">
          <p className={`m-0 ${open ? '' : 'line-clamp-6'}`}>&ldquo;<span data-review-text>{r.text}</span>&rdquo;</p>
        </blockquote>
        <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="self-start min-h-[44px] text-[15px] font-semibold text-[#1660cf] dark:text-[#4d94ff]">
          {open ? 'Tutup' : 'Baca selengkapnya'}<span className="sr-only"> ulasan {r.name}</span>
        </button>
      </figure>
    </li>
  );
};

export const ReviewBlock: React.FC<{ reviews: Review[]; title: React.ReactNode }> = ({ reviews, title }) => {
  const rail = useRef<HTMLUListElement>(null);
  const geser = (arah: number) => rail.current?.scrollBy({ left: arah * rail.current.clientWidth * 0.9, behavior: 'smooth' });
  const tombolGeser = 'w-11 h-11 rounded-full inline-flex items-center justify-center border-2 border-[#1660cf] text-[#1660cf] dark:border-[#4d94ff] dark:text-[#4d94ff] hover:bg-[#1660cf] hover:text-white dark:hover:bg-[#4d94ff] dark:hover:text-black transition-colors';
  return (
    <div>
      <h2 className="lp-h2 max-w-3xl">{title}</h2>
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
        <div className="flex items-center gap-4">
          <span className="lp-num !text-[clamp(3.2rem,12vw,4.5rem)]">{FACTS.rating}</span>
          <div>
            <Stars size={22} />
            <p className="mt-1 text-base md:text-lg font-semibold tracking-tight">dari {FACTS.reviewCount} ulasan di Google</p>
            <p className="text-xs md:text-sm text-[#6e6e73] dark:text-[#a1a1a6]">data {FACTS.ratingDate}</p>
          </div>
        </div>
        <a
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 min-h-[52px] px-6 rounded-full border-2 border-[#1660cf] text-[#1660cf] dark:border-[#4d94ff] dark:text-[#4d94ff] text-[17px] font-semibold tracking-tight hover:bg-[#1660cf] hover:text-white dark:hover:bg-[#4d94ff] dark:hover:text-black transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1660cf]/40"
        >
          Cek sendiri di Google Maps <ArrowUpRight size={20} aria-hidden="true" />
          <span className="sr-only"> (buka di tab baru)</span>
        </a>
      </div>
      {/* Geser ke samping (permintaan owner 25 Nov): halaman tidak memanjang; yang panjang tetap di depan. */}
      <ul ref={rail} aria-label={`${reviews.length} ulasan Google`} className="relative mt-6 flex items-start gap-3 md:gap-4 overflow-x-auto snap-x snap-mandatory -mx-5 px-5 pb-2 md:mx-0 md:px-0 list-none m-0">
        {reviews.map((r) => <ReviewCard key={r.name} r={r} />)}
      </ul>
      <div className="mt-3 flex items-center justify-between gap-4">
        <p className="m-0 text-sm text-[#6e6e73] dark:text-[#a1a1a6]">Geser untuk lihat {reviews.length} ulasan &rarr;</p>
        <div className="hidden md:flex gap-2">
          <button type="button" onClick={() => geser(-1)} aria-label="Ulasan sebelumnya" className={tombolGeser}><ArrowRight size={20} className="rotate-180" aria-hidden="true" /></button>
          <button type="button" onClick={() => geser(1)} aria-label="Ulasan berikutnya" className={tombolGeser}><ArrowRight size={20} aria-hidden="true" /></button>
        </div>
      </div>
    </div>
  );
};

/* ───────────── FAQ ───────────── */

export const Faq: React.FC<{ items: Array<[string, string]> }> = ({ items }) => (
  <div className="mt-7 grid gap-3 md:grid-cols-2 md:gap-x-6 md:items-start">
    {items.map(([q, a]) => (
      <details key={q} className="group rounded-[20px] bg-[#f5f5f7] dark:bg-[#1c1c1e] px-6 py-1">
        <summary className="flex items-center justify-between gap-4 min-h-[56px] cursor-pointer text-lg font-semibold tracking-tight">
          {q}<Plus size={22} className="lp-plus shrink-0 transition-transform text-[#1660cf] dark:text-[#4d94ff]" aria-hidden="true" />
        </summary>
        <p className="pb-5 text-base text-[#6e6e73] dark:text-[#a1a1a6] leading-relaxed">{a}</p>
      </details>
    ))}
  </div>
);

/* ───────────── Konsep Kasur Sehat (3 kartu, tengah disorot) ───────────── */

const KONSEP: Array<{ key: 'tenggelam' | 'sehat' | 'keras'; title: string; text: string; alt: string; h720: number; hi?: boolean }> = [
  { key: 'tenggelam', title: 'Terlalu tenggelam', text: 'Badan bisa ikut melengkung dan tidak tertopang rata.', alt: 'Ilustrasi orang berbaring di kasur yang terlalu empuk, tulang belakang melengkung', h720: 200 },
  { key: 'sehat', title: 'Matras Sehat', text: 'Fondasi kokoh + lapisan sesuai berat badanmu. Badan tertopang, tekanannya lebih merata.', alt: 'Ilustrasi orang berbaring di kasur yang pas, tulang belakang lurus', h720: 220, hi: true },
  { key: 'keras', title: 'Terlalu keras', text: 'Leher, bahu, dan pinggang tertekan. Bangun jadi kaku.', alt: 'Ilustrasi orang berbaring di kasur yang terlalu keras, bahu dan pinggul tertekan', h720: 195 },
];

export const ConceptSection: React.FC = () => {
  const listRef = useRef<HTMLUListElement>(null);
  // HP: kartu tengah (Matras Sehat) muncul duluan
  useEffect(() => {
    const ul = listRef.current;
    if (!ul || window.matchMedia('(min-width: 768px)').matches) return;
    const mid = ul.children[1] as HTMLElement | undefined;
    if (mid) ul.scrollLeft = mid.offsetLeft - (ul.clientWidth - mid.clientWidth) / 2;
  }, []);

  return (
    <div>
      <Reveal>
        <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold bg-[#1660cf]/10 text-[#1660cf] dark:bg-[#4d94ff]/15 dark:text-[#4d94ff]">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: LIME, boxShadow: '0 0 0 1px rgba(11,42,111,.25)' }} aria-hidden="true" />Konsep Matras Sehat
        </span>
        <h2 className="lp-h2 mt-4 max-w-3xl">Kasur sehat itu bukan yang paling keras. Tapi yang <Serif>pas.</Serif></h2>
      </Reveal>
      <ul ref={listRef} className="mt-8 flex gap-3 md:gap-4 overflow-x-auto snap-x snap-mandatory -mx-5 px-5 pb-2 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:items-stretch md:overflow-visible list-none m-0">
        {KONSEP.map((k) => (
          <li key={k.key} className="snap-center shrink-0 w-[82%] sm:w-[58%] md:w-auto">
            <article className={`h-full rounded-[28px] p-5 md:p-6 flex flex-col gap-4 ${k.hi ? 'text-white' : 'bg-[#f5f5f7] dark:bg-[#1c1c1e]'}`} style={k.hi ? { backgroundColor: ACCENT } : undefined}>
              <div className={`rounded-[20px] px-3 py-5 flex items-center ${k.hi ? 'bg-white/15' : 'bg-[#dfe9f8] dark:bg-[#16202e]'}`}>
                <img src={`/landing/p-konsep-${k.key}-720.webp`} srcSet={`/landing/p-konsep-${k.key}-360.webp 360w, /landing/p-konsep-${k.key}-720.webp 720w`} sizes="(min-width:768px) 300px, 80vw"
                  width={720} height={k.h720} alt={k.alt} loading="lazy" decoding="async" className="block w-full h-auto" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{k.title}</h3>
                <p className={`mt-2 text-base md:text-lg leading-snug ${k.hi ? 'text-white/90' : 'text-[#6e6e73] dark:text-[#a1a1a6]'}`}>{k.text}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>
      <Reveal>
        <p className="mt-6 text-lg md:text-xl font-semibold tracking-tight max-w-2xl">Kami cek fondasi, lapisan, dan kainnya, lalu perbaiki yang perlu saja.</p>
        <TextLink to="/artikel/konsep-matras-sehat" className="mt-1">Baca konsep lengkapnya</TextLink>
      </Reveal>
    </div>
  );
};

/** Versi ringkas satu baris (HOT). */
export const ConceptLine: React.FC = () => (
  <Reveal>
    <p className="text-xl md:text-2xl font-semibold tracking-tight max-w-3xl">Kasur sehat itu bukan yang paling keras, tapi yang <Serif>pas.</Serif> <TextLink to="/artikel/konsep-matras-sehat" className="ml-1">Baca konsep lengkapnya</TextLink></p>
  </Reveal>
);

/* ───────────── Pita CTA berwarna di dasar halaman ───────────── */

export const CtaRibbon: React.FC<{ title: React.ReactNode; sub?: string; children: React.ReactNode; note?: React.ReactNode }> = ({ title, sub, children, note }) => (
  <section id="cta-ribbon" className="bg-white dark:bg-black py-10 md:py-16">
    <div className="max-w-5xl mx-auto px-5">
      <Reveal>
        <div className="lp-ribbon text-white rounded-[32px] md:rounded-[44px] px-6 py-10 md:py-16 text-center">
          <h2 className="lp-h2 max-w-3xl mx-auto">{title}</h2>
          {sub && <p className="mt-4 text-xl text-white/80">{sub}</p>}
          <div className="mt-8">{children}</div>
          {note && <div className="mt-8 max-w-xl mx-auto text-white/70">{note}</div>}
        </div>
      </Reveal>
    </div>
  </section>
);

export const useHeroRef = () => useRef<HTMLElement | null>(null);
