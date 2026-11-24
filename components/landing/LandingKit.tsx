import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Star, ArrowRight, ChevronsLeftRight, ShieldCheck, Clock, Truck, MapPin, Check, Plus } from 'lucide-react';
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
.lp-h2{font-size:clamp(1.8rem,6.2vw,3.25rem);line-height:1.08;letter-spacing:-.028em;font-weight:700}
.lp-num{font-size:clamp(3rem,13vw,6rem);line-height:1;letter-spacing:-.04em;font-weight:700}
.lp-ribbon{background:linear-gradient(120deg,#0b2a6f 0%,#1660cf 55%,#2f86ea 100%)}
.lp-glass{background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.34);box-shadow:0 18px 40px rgba(5,10,42,.3);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px)}
@media (max-width:767px){.lp-glass{-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}}
.lp-range{-webkit-appearance:none;appearance:none;background:transparent;margin:0;cursor:ew-resize;touch-action:pan-y}
.lp-range::-webkit-slider-thumb{-webkit-appearance:none;width:44px;height:100vh;background:transparent;border:0}
.lp-range::-moz-range-thumb{width:44px;height:100vh;background:transparent;border:0}
.lp-hl{background:#1660cf;color:#fff;padding:0 .28em;border-radius:.3em;-webkit-box-decoration-break:clone;box-decoration-break:clone}
details>summary{list-style:none}details>summary::-webkit-details-marker{display:none}
details[open] .lp-plus{transform:rotate(45deg)}
@media (prefers-reduced-motion:reduce){.lp-rv{opacity:1;transform:none;transition:none}}
`;

/* ───────────── Gambar (srcset, width/height tetap) ───────────── */

const IMG = {
  hero: { w: [720, 1280], r: 1.6 },
  masalah: { w: [360, 720, 1000], r: 4 / 3 },
  langkah1: { w: [360, 515], r: 4 / 3 },
  langkah2: { w: [360, 720, 1080], r: 4 / 3 },
  langkah3: { w: [360, 420], r: 4 / 3 },
  service: { w: [360, 720], r: 4 / 5 },
  upgrade: { w: [360, 720], r: 4 / 5 },
  workshop: { w: [360, 720, 1080], r: 1.6 },
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
      className={`block w-full h-auto ${className}`}
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

export const LandingShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  useEffect(() => { captureAdReferral(); }, [location]);
  useEffect(() => { endAttributionHydration(); }, []);
  useEffect(() => { window.scrollTo(0, 0); }, [location]);

  return (
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
            <Link to="/before-after" className="min-h-[44px] flex items-center text-white/80 hover:text-white">Hasil before-after</Link>
            <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="min-h-[44px] flex items-center text-white/80 hover:text-white">Ulasan di Google Maps</a>
            <Link to="/kebijakan-privasi" className="min-h-[44px] flex items-center text-white/80 hover:text-white">Kebijakan Privasi</Link>
          </nav>
          <p className="text-sm text-white/60 leading-relaxed">Chat dibalas {FACTS.hours}.<br />Klinik Matras by SANO CARE.</p>
        </div>
      </footer>
    </div>
  );
};

/* ───────────── Tombol ───────────── */

interface WaProps {
  buttonId: string;
  placement: WhatsAppPlacement;
  label: string;
  message: string;
  eventLabel: string;
  className?: string;
  tone?: 'blue' | 'lime';
}

/** Tombol utama = WhatsApp (pil biru, panah di lingkaran). */
export const WaButton: React.FC<WaProps> = ({ buttonId, placement, label, message, eventLabel, className = '', tone = 'blue' }) => (
  <WhatsAppLink
    message={message}
    eventLabel={eventLabel}
    buttonId={buttonId}
    placement={placement}
    target="_blank"
    rel="noopener noreferrer"
    style={tone === 'blue' ? { backgroundColor: ACCENT } : { backgroundColor: LIME, color: NAVY }}
    className={`inline-flex items-center justify-center gap-3 min-h-[56px] pl-7 pr-2 rounded-full text-[17px] font-semibold tracking-tight transition-all hover:brightness-110 active:scale-[.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1660cf]/40 ${tone === 'blue' ? 'text-white' : ''} ${className}`}
  >
    {label}
    <span className={`w-10 h-10 rounded-full flex items-center justify-center ${tone === 'blue' ? 'bg-white/20' : 'bg-[#0b2a6f]/10'}`} aria-hidden="true"><ArrowRight size={20} /></span>
  </WhatsAppLink>
);

/** Tombol WA lime di atas pita biru (CTA penutup). */
export const HeroWaButton: React.FC<Omit<WaProps, 'tone'>> = (p) => <WaButton {...p} tone="lime" />;

/** Tombol kedua = tautan teks. */
export const TextLink: React.FC<{ to?: string; href?: string; children: React.ReactNode; className?: string }> = ({ to, href, children, className = '' }) => {
  const cls = `inline-flex items-center gap-1 min-h-[44px] text-[17px] font-medium text-[#1660cf] dark:text-[#4d94ff] hover:underline ${className}`;
  return to
    ? <Link to={to} className={cls}>{children}<ArrowRight size={17} aria-hidden="true" /></Link>
    : <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}<ArrowRight size={17} aria-hidden="true" /></a>;
};

export const FloatingWa: React.FC<WaProps & { sentinelRef?: React.RefObject<HTMLElement | null>; mode: 'after-hero' | 'bar' }> = ({ mode, sentinelRef, ...wa }) => {
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
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/75 dark:bg-black/70 backdrop-blur-xl border-t border-black/5 dark:border-white/10 px-4 py-3">
        <div className="max-w-md mx-auto"><WaButton {...wa} className="w-full" /></div>
      </div>
    );
  }
  return (
    <div className={`fixed bottom-5 right-5 z-40 transition-all duration-500 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}`} aria-hidden={!show}>
      <WaButton {...wa} className="shadow-xl shadow-black/20" />
    </div>
  );
};

/* ───────────── Tata letak ───────────── */

export const Screen: React.FC<{ children: React.ReactNode; tone?: 'white' | 'grey'; className?: string; id?: string }> = ({ children, tone = 'white', className = '', id }) => (
  <section id={id} className={`py-16 md:py-28 ${tone === 'grey' ? 'bg-[#f5f5f7] dark:bg-[#0a0a0a]' : 'bg-white dark:bg-black'} ${className}`}>
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

/* ───────────── Hero: foto asli full-bleed, sudut membulat, overlay gelap ───────────── */

export const PhotoHero = React.forwardRef<HTMLElement, {
  pill: string; title: React.ReactNode; lead: React.ReactNode; actions: React.ReactNode;
  checks?: string[]; thumb?: PhotoPair;
}>(({ pill, title, lead, actions, checks, thumb }, ref) => {
  // Preload foto hero + font serif (halaman ini dirender di sisi klien; saat diprerender, pindahkan ke <head>).
  useEffect(() => {
    const links: HTMLLinkElement[] = [];
    const add = (attrs: Record<string, string>) => {
      const l = document.createElement('link');
      Object.entries(attrs).forEach(([k, v]) => l.setAttribute(k, v));
      document.head.appendChild(l); links.push(l);
    };
    add({ rel: 'preload', as: 'image', href: '/landing/p-hero-1280.webp', imagesrcset: '/landing/p-hero-720.webp 720w, /landing/p-hero-1280.webp 1280w', imagesizes: '100vw' });
    add({ rel: 'preload', as: 'font', type: 'font/woff2', href: '/landing/fonts/is-italic.woff2', crossorigin: 'anonymous' });
    return () => links.forEach((l) => l.remove());
  }, []);

  return (
    <section ref={ref} className="px-3 md:px-5 pt-3 md:pt-4 bg-white dark:bg-black">
      <div className="relative max-w-7xl mx-auto overflow-hidden rounded-[28px] md:rounded-[44px] min-h-[600px] md:min-h-[640px] flex flex-col justify-end text-white">
        <Photo name="hero" alt="Kasur yang sudah selesai dikerjakan di workshop Klinik Matras, tim bekerja di belakang" sizes="100vw" eager className="!absolute inset-0 !h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(4,10,32,.55) 0%,rgba(4,10,32,.50) 45%,rgba(4,10,32,.82) 100%)' }} aria-hidden="true" />
        <div className="relative px-5 md:px-12 pt-6 pb-8 md:pb-12 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="lp-glass inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold">
                <Star size={14} className="fill-amber-300 text-amber-300" aria-hidden="true" />{FACTS.rating} · {FACTS.reviewCount} ulasan Google
              </span>
              <span className="lp-glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: LIME }} aria-hidden="true" />{pill}
              </span>
            </div>
            <h1 className="lp-big mt-5 max-w-3xl">{title}</h1>
            <p className="mt-4 text-lg md:text-xl leading-snug tracking-tight text-white/85 max-w-xl">{lead}</p>
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6">{actions}</div>
            {checks && (
              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-1 list-none p-0 m-0 text-sm text-white/85">
                {checks.map((c) => <li key={c} className="inline-flex items-center gap-1.5"><Check size={15} style={{ color: LIME }} aria-hidden="true" />{c}</li>)}
              </ul>
            )}
          </div>
          {thumb && (
            <div className="lp-glass rounded-2xl p-2.5 flex items-center gap-3 w-fit">
              <div className="flex gap-0.5 rounded-xl overflow-hidden">
                <img src={thumb.before} alt={thumb.altBefore} width={64} height={64} loading="lazy" decoding="async" className="w-14 h-14 object-cover" />
                <img src={thumb.after} alt={thumb.altAfter} width={64} height={64} loading="lazy" decoding="async" className="w-14 h-14 object-cover" />
              </div>
              <div className="pr-2"><p className="text-xl font-bold leading-none">{FACTS.days}</p><p className="text-xs text-white/80 mt-1">pengerjaan</p></div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
});
PhotoHero.displayName = 'PhotoHero';

export const HeroSecondaryLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a href={href} className="inline-flex items-center min-h-[44px] text-[17px] font-medium text-white hover:underline underline-offset-4">{children}</a>
);

/* ───────────── Strip kepercayaan (logo Canva SANO, abu) ───────────── */

const LOGOS: Array<[string, string]> = [
  ['kingkoil', 'King Koil'], ['ladyamericana', 'Lady Americana'], ['florence', 'Florence'], ['romance', 'Romance'],
  ['elite', 'Elite'], ['springair', 'Spring Air'], ['serta', 'Serta'], ['comforta', 'Comforta'],
  ['alga', 'Alga'], ['simmons', 'Simmons'], ['therapedic', 'Therapedic'], ['slumberland', 'Slumberland'],
  ['airland', 'Airland'], ['informasleep', 'informa Sleep'], ['inthebox', 'in.the.box'], ['sealy', 'Sealy'],
];

export const TrustStrip: React.FC = () => (
  <section className="bg-white dark:bg-black py-12 md:py-16">
    <div className="max-w-5xl mx-auto px-5 text-center">
      <Reveal>
        <p className="text-xs md:text-sm font-semibold uppercase tracking-[.14em] text-[#6e6e73] dark:text-[#a1a1a6]">Dipercaya merestorasi berbagai merek kasur ternama</p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-7 gap-y-5 list-none p-0 m-0">
          {LOGOS.map(([f, n]) => (
            <li key={f} className="flex items-center">
              <img src={`/landing/brand-${f}.webp`} alt={n} loading="lazy" decoding="async" height={40}
                className="h-8 md:h-10 w-auto max-w-[96px] md:max-w-[120px] object-contain opacity-70 mix-blend-multiply dark:mix-blend-normal dark:invert dark:opacity-60" />
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  </section>
);

/* ───────────── Before-after: slider besar + strip kasus ───────────── */

const big = (src: string) => src.replace('/landing/', '/landing/lg-');

export const BeforeAfterSlider: React.FC<{ pair: PhotoPair }> = ({ pair }) => {
  const [pos, setPos] = useState(50);
  return (
    <figure className="m-0">
      <div className="relative w-full overflow-hidden select-none bg-[#e8e8ed] dark:bg-[#1c1c1e] md:rounded-[28px]" style={{ aspectRatio: `${pair.w} / ${pair.h}` }}>
        <img src={big(pair.after)} alt={pair.altAfter} width={pair.w} height={pair.h} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
        <img src={big(pair.before)} alt={pair.altBefore} width={pair.w} height={pair.h} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" draggable={false} style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} />
        <span className="absolute left-4 top-4 text-xs font-semibold px-3 py-1.5 rounded-full bg-black/60 text-white">Sebelum</span>
        <span className="absolute right-4 top-4 text-xs font-semibold px-3 py-1.5 rounded-full text-white" style={{ backgroundColor: 'rgba(22,96,207,.9)' }}>Sesudah</span>
        <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,.4)] pointer-events-none" style={{ left: `${pos}%` }}>
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center text-[#0b2a6f]"><ChevronsLeftRight size={22} aria-hidden="true" /></span>
        </div>
        <input type="range" min={0} max={100} step={0.5} value={pos} onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`Geser untuk membandingkan sebelum dan sesudah: ${pair.title}`} className="lp-range absolute inset-0 w-full h-full opacity-0" />
      </div>
      <figcaption className="mt-3 px-5 md:px-0 text-sm text-[#6e6e73] dark:text-[#a1a1a6]">{pair.title}. Geser untuk membandingkan.</figcaption>
    </figure>
  );
};

/** Kasus terkuat: slider lebar penuh tepat di bawah hero/logo. */
export const BigCase: React.FC<{ pair: PhotoPair }> = ({ pair }) => (
  <section id="hasil" className="bg-white dark:bg-black pb-16 md:pb-24">
    <div className="max-w-6xl mx-auto md:px-5">
      <Reveal>
        <div className="px-5 md:px-0 mb-6"><Eyebrow>Hasil asli</Eyebrow><h2 className="lp-h2 max-w-3xl">Geser, lihat <Serif>bedanya.</Serif></h2></div>
        <BeforeAfterSlider pair={pair} />
      </Reveal>
    </div>
  </section>
);

export const CaseStrip: React.FC<{ pairs: PhotoPair[]; title?: React.ReactNode }> = ({ pairs, title = <>Hasil lain, <Serif>kasur lain.</Serif></> }) => (
  <section className="bg-white dark:bg-black pb-14 md:pb-24">
    <div className="max-w-5xl mx-auto px-5"><Reveal><h2 className="lp-h2 max-w-3xl">{title}</h2></Reveal></div>
    <div className="max-w-5xl mx-auto">
      <ul className="mt-8 flex gap-3 overflow-x-auto snap-x snap-mandatory px-5 pb-2 md:grid md:grid-cols-3 md:overflow-visible list-none m-0">
        {pairs.map((pair) => (
          <li key={pair.id} className="snap-center shrink-0 w-[78%] sm:w-[46%] md:w-auto">
            <Link to="/before-after" aria-label={`Lihat galeri before-after lengkap. Contoh: ${pair.title}`}
              className="block rounded-[24px] overflow-hidden bg-[#f5f5f7] dark:bg-[#1c1c1e] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1660cf]/40">
              <div className="grid grid-cols-2 gap-0.5">
                {([['Sebelum', pair.before, pair.altBefore], ['Sesudah', pair.after, pair.altAfter]] as const).map(([lbl, src, alt]) => (
                  <figure key={lbl} className="relative m-0">
                    <img src={src} alt={alt} width={pair.w} height={pair.h} loading="lazy" decoding="async" className="w-full aspect-[4/5] object-cover block" />
                    <figcaption className={`absolute left-2 top-2 text-[11px] font-semibold px-2 py-1 rounded-full text-white ${lbl === 'Sesudah' ? '' : 'bg-black/60'}`} style={lbl === 'Sesudah' ? { backgroundColor: ACCENT } : undefined}>{lbl}</figcaption>
                  </figure>
                ))}
              </div>
              <p className="px-4 py-3 text-sm font-semibold">{pair.title}</p>
            </Link>
          </li>
        ))}
      </ul>
      <div className="px-5 mt-4"><TextLink to="/before-after">Lihat semua hasil</TextLink></div>
    </div>
  </section>
);

/* ───────────── Satu foto + satu pesan ───────────── */

/** Foto di satu sisi, teks di sisi lain. */
export const Split: React.FC<{ photo: React.ReactNode; reverse?: boolean; children: React.ReactNode }> = ({ photo, reverse, children }) => (
  <div className="grid gap-8 md:gap-14 md:grid-cols-2 md:items-center">
    <Reveal className={reverse ? 'md:order-2' : ''}><div className="rounded-[24px] md:rounded-[32px] overflow-hidden bg-[#e8e8ed] dark:bg-[#1c1c1e]">{photo}</div></Reveal>
    <Reveal delay={80} className={reverse ? 'md:order-1' : ''}>{children}</Reveal>
  </div>
);

/** Cara kerja bernomor, zig-zag foto kiri/kanan. */
export const ZigZag: React.FC<{ steps: Array<{ title: React.ReactNode; text: string; photo: PhotoName; alt: string }> }> = ({ steps }) => (
  <ol className="mt-12 grid gap-14 md:gap-20 list-none p-0 m-0">
    {steps.map((s, i) => (
      <li key={i}>
        <Split reverse={i % 2 === 1} photo={<Photo name={s.photo} alt={s.alt} sizes="(min-width:768px) 480px, 92vw" />}>
          <p className="text-sm font-semibold tracking-[.14em] text-[#1660cf] dark:text-[#4d94ff]">/0{i + 1}</p>
          <h3 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight leading-tight">{s.title}</h3>
          <p className="mt-3 text-lg md:text-xl text-[#6e6e73] dark:text-[#a1a1a6] leading-snug">{s.text}</p>
        </Split>
      </li>
    ))}
  </ol>
);

/** Kartu foto tinggi (Service / Upgrade), bisa digeser di HP. */
export const ServiceCards: React.FC<{ cards: Array<{ photo: PhotoName; alt: string; title: string; line: string; badge: string; cta: React.ReactNode; hi?: boolean }> }> = ({ cards }) => (
  <ul className="mt-10 flex gap-3 md:gap-5 overflow-x-auto snap-x snap-mandatory -mx-5 px-5 pb-2 md:mx-0 md:px-0 md:grid md:grid-cols-2 md:overflow-visible list-none m-0">
    {cards.map((c) => (
      <li key={c.title} className="snap-center shrink-0 w-[82%] sm:w-[60%] md:w-auto">
        <article className={`h-full rounded-[28px] overflow-hidden flex flex-col ${c.hi ? 'text-white' : 'bg-[#f5f5f7] dark:bg-[#1c1c1e]'}`} style={c.hi ? { backgroundColor: ACCENT } : undefined}>
          <div className="relative">
            <Photo name={c.photo} alt={c.alt} sizes="(min-width:768px) 480px, 80vw" />
            <span className="absolute left-4 top-4 text-xs font-semibold px-3 py-1.5 rounded-full bg-white text-[#0b2a6f]">{c.badge}</span>
          </div>
          <div className="p-6 flex flex-col gap-3 flex-grow">
            <h3 className="text-3xl font-bold tracking-tight">{c.title}</h3>
            <p className={`text-lg leading-snug flex-grow ${c.hi ? 'text-white/90' : 'text-[#6e6e73] dark:text-[#a1a1a6]'}`}>{c.line}</p>
            <div className="pt-2">{c.cta}</div>
          </div>
        </article>
      </li>
    ))}
  </ul>
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

export const FactsBento: React.FC = () => (
  <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-6">
    <Reveal className="col-span-2 md:col-span-3">
      <div className="lp-ribbon text-white rounded-[24px] md:rounded-[28px] p-6 md:p-8 h-full min-h-[210px] flex flex-col justify-between">
        <IconBox hi><ShieldCheck size={24} /></IconBox>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[.14em] opacity-80">Garansi Klinik Matras</p>
          <div className="flex gap-8 mt-3">
            <div><div className="lp-num !text-[clamp(2.8rem,11vw,4.6rem)]">20</div><p className="opacity-85">tahun, Upgrade</p></div>
            <div><div className="lp-num !text-[clamp(2.8rem,11vw,4.6rem)]">10</div><p className="opacity-85">tahun, Service</p></div>
          </div>
        </div>
      </div>
    </Reveal>
    <Reveal className="col-span-2 md:col-span-3" delay={80}>
      <BentoCard className="h-full min-h-[210px]">
        <IconBox><Star size={24} /></IconBox>
        <div>
          <Stars />
          <div className="lp-num !text-[clamp(2.8rem,11vw,4.6rem)] mt-1">{FACTS.rating}</div>
          <p className="opacity-70">rating Google dari {FACTS.reviewCount} ulasan (data {FACTS.ratingDate})</p>
        </div>
      </BentoCard>
    </Reveal>
    <Reveal className="col-span-1 md:col-span-2">
      <BentoCard className="h-full min-h-[170px]"><IconBox><Clock size={24} /></IconBox>
        <div><p className="text-3xl font-bold tracking-tight">2-3 hari</p><p className="text-sm opacity-70 mt-1">Pengerjaan</p></div></BentoCard>
    </Reveal>
    <Reveal className="col-span-1 md:col-span-2" delay={80}>
      <BentoCard className="h-full min-h-[170px]"><IconBox><Truck size={24} /></IconBox>
        <div><p className="text-3xl font-bold tracking-tight">Gratis</p><p className="text-sm opacity-70 mt-1">Antar-jemput</p></div></BentoCard>
    </Reveal>
    <Reveal className="col-span-2 md:col-span-2" delay={160}>
      <BentoCard className="h-full min-h-[170px]"><IconBox><MapPin size={24} /></IconBox>
        <div><p className="text-xl font-bold tracking-tight leading-snug">Jabodetabek dan Bandung</p><p className="text-sm opacity-70 mt-1">Workshop dan kantor di Depok</p></div></BentoCard>
    </Reveal>
  </div>
);

/* ───────────── Kartu harga (sorotan biru penuh) ───────────── */

export const PriceCard: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <Reveal className="h-full">
    <div style={{ backgroundColor: ACCENT }} className="text-white rounded-[24px] md:rounded-[32px] p-8 md:p-10 h-full flex flex-col justify-between gap-6">
      <div>
        <p className="text-sm md:text-base font-semibold uppercase tracking-[.14em] opacity-85">Service kasur, mulai dari</p>
        <p className="lp-num mt-2 !text-[clamp(2.6rem,11vw,4.5rem)]">{FACTS.priceService}</p>
        <p className="mt-3 text-base md:text-lg opacity-85 max-w-md leading-snug">Harga pasti setelah kami lihat foto kasurmu.</p>
      </div>
      {children && <div>{children}</div>}
    </div>
  </Reveal>
);

/* ───────────── Review statis (ulasan Google asli) ───────────── */

export const ReviewBlock: React.FC<{ reviews: Review[]; title: React.ReactNode }> = ({ reviews, title }) => (
  <div>
    <h2 className="lp-h2 max-w-3xl">{title}</h2>
    <div className="mt-6 flex items-center gap-3 flex-wrap">
      <span className="text-4xl font-bold tracking-tight">{FACTS.rating}</span>
      <div><Stars size={20} /><p className="text-sm text-[#6e6e73] dark:text-[#a1a1a6]">{FACTS.reviewCount} ulasan Google (data {FACTS.ratingDate})</p></div>
    </div>
    <div className={`mt-8 grid gap-3 md:gap-4 ${reviews.length > 1 ? 'md:grid-cols-3' : 'max-w-xl'}`}>
      {reviews.map((r, i) => (
        <Reveal key={r.name} delay={i * 80}>
          <figure className="m-0 h-full rounded-[24px] md:rounded-[28px] bg-[#f5f5f7] dark:bg-[#1c1c1e] p-6 md:p-7 flex flex-col">
            <span className="flex mb-3" aria-label="5 dari 5 bintang"><Stars size={16} /></span>
            <blockquote className="m-0 text-[17px] leading-relaxed tracking-tight flex-grow">&ldquo;{r.text}&rdquo;</blockquote>
            <figcaption className="mt-4 text-sm font-semibold text-[#6e6e73] dark:text-[#a1a1a6]">{r.name}, ulasan Google</figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
    <div className="mt-6"><TextLink href={GOOGLE_MAPS_URL}>Lihat semua ulasan di Google Maps</TextLink></div>
  </div>
);

/* ───────────── FAQ ───────────── */

export const Faq: React.FC<{ items: Array<[string, string]> }> = ({ items }) => (
  <div className="mt-10 grid gap-3 md:grid-cols-2 md:gap-x-6 md:items-start">
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

/* ───────────── Pita CTA berwarna di dasar halaman ───────────── */

export const CtaRibbon: React.FC<{ title: React.ReactNode; sub?: string; children: React.ReactNode; note?: React.ReactNode }> = ({ title, sub, children, note }) => (
  <section className="bg-white dark:bg-black py-14 md:py-24">
    <div className="max-w-5xl mx-auto px-5">
      <Reveal>
        <div className="lp-ribbon text-white rounded-[32px] md:rounded-[44px] px-6 py-12 md:py-20 text-center">
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
