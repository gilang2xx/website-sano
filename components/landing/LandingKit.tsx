import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, Star, ArrowRight, ChevronsLeftRight } from 'lucide-react';
import WhatsAppLink from '../WhatsAppLink';
import ThemeToggle from '../ThemeToggle';
import type { WhatsAppPlacement } from '../../utils/tracking';
import { captureAdReferral, endAttributionHydration } from '../../utils/attribution';
import { FACTS, GOOGLE_MAPS_URL, HEALTH_NOTE } from './landingData';
import type { PhotoPair, Review } from './landingData';

// MOCKUP visual landing (gaya bersih, lega, satu pesan per layar).
// Semua WA lewat WhatsAppLink (event click_whatsapp yang sudah ada), tanpa tag/event baru.
// Palet: putih/abu muda, teks hampir hitam, aksen biru #1660cf (navy #0b2a6f), lime #c8f53c sangat sedikit.

export const ACCENT = '#1660cf';
export const NAVY = '#0b2a6f';
export const LIME = '#c8f53c';

const FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, Inter, "Helvetica Neue", Arial, sans-serif';

const CSS = `
.lp-rv{opacity:0;transform:translateY(24px);transition:opacity .8s ease,transform .8s cubic-bezier(.2,.7,.2,1)}
.lp-rv.in{opacity:1;transform:none}
.lp-big{font-size:clamp(2.1rem,8.4vw,4.75rem);line-height:1.04;letter-spacing:-.035em;font-weight:800}
.lp-h2{font-size:clamp(1.9rem,6.4vw,3.5rem);line-height:1.06;letter-spacing:-.03em;font-weight:800}
.lp-num{font-size:clamp(3rem,13vw,6rem);line-height:1;letter-spacing:-.04em;font-weight:800}
.lp-range{-webkit-appearance:none;appearance:none;background:transparent;margin:0;cursor:ew-resize;touch-action:pan-y}
.lp-range::-webkit-slider-thumb{-webkit-appearance:none;width:44px;height:100vh;background:transparent;border:0}
.lp-range::-moz-range-thumb{width:44px;height:100vh;background:transparent;border:0}
@media (prefers-reduced-motion:reduce){.lp-rv{opacity:1;transform:none;transition:none}}
`;

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
            <img src="/klinikmatras-light.png" alt="Klinik Matras by SANO CARE" className="h-7 w-auto block dark:hidden" width={140} height={28} />
            <img src="/klinikmatras-dark.png" alt="Klinik Matras by SANO CARE" className="h-7 w-auto hidden dark:block" width={140} height={28} />
          </span>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-grow">{children}</main>
      <footer className="py-10 pb-28 text-center text-xs text-[#6e6e73] dark:text-[#86868b] bg-[#f5f5f7] dark:bg-[#0a0a0a]">
        <p>Klinik Matras by SANO CARE. Workshop dan kantor di Depok.</p>
        <Link to="/kebijakan-privasi" className="inline-block mt-2 underline min-h-[44px] leading-[44px]">Kebijakan Privasi</Link>
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

/** Tombol utama = WhatsApp (pil). */
export const WaButton: React.FC<WaProps> = ({ buttonId, placement, label, message, eventLabel, className = '', tone = 'blue' }) => (
  <WhatsAppLink
    message={message}
    eventLabel={eventLabel}
    buttonId={buttonId}
    placement={placement}
    target="_blank"
    rel="noopener noreferrer"
    style={tone === 'blue' ? { backgroundColor: ACCENT } : { backgroundColor: LIME, color: NAVY }}
    className={`inline-flex items-center justify-center gap-2 min-h-[56px] px-8 rounded-full text-[17px] font-semibold tracking-tight transition-all hover:brightness-110 active:scale-[.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1660cf]/40 ${tone === 'blue' ? 'text-white' : ''} ${className}`}
  >
    <MessageCircle size={20} aria-hidden="true" />
    {label}
  </WhatsAppLink>
);

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
      <WaButton {...wa} className="!px-6 shadow-xl shadow-black/20" />
    </div>
  );
};

/* ───────────── Tata letak ───────────── */

/** Satu layar, satu pesan. tone: putih / abu muda / navy. */
export const Screen: React.FC<{ children: React.ReactNode; tone?: 'white' | 'grey' | 'navy'; className?: string; id?: string }> = ({ children, tone = 'white', className = '', id }) => {
  const bg = tone === 'grey' ? 'bg-[#f5f5f7] dark:bg-[#0a0a0a]' : tone === 'navy' ? 'text-white' : 'bg-white dark:bg-black';
  return (
    <section id={id} style={tone === 'navy' ? { backgroundColor: NAVY } : undefined} className={`py-16 md:py-28 ${bg} ${className}`}>
      <div className="max-w-5xl mx-auto px-5">{children}</div>
    </section>
  );
};

export const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-sm font-semibold uppercase tracking-[.14em] text-[#1660cf] dark:text-[#4d94ff] mb-3">{children}</p>
);

export const Lead: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`text-lg md:text-2xl leading-snug tracking-tight text-[#6e6e73] dark:text-[#a1a1a6] ${className}`}>{children}</p>
);

/* ───────────── Before-after: slider geser ───────────── */

const big = (src: string) => src.replace('/landing/', '/landing/lg-');

export const BeforeAfterSlider: React.FC<{ pair: PhotoPair; eager?: boolean }> = ({ pair, eager = false }) => {
  const [pos, setPos] = useState(50);
  return (
    <figure className="m-0">
      <div
        className="relative w-full overflow-hidden select-none bg-[#e8e8ed] dark:bg-[#1c1c1e] md:rounded-[28px]"
        style={{ aspectRatio: `${pair.w} / ${pair.h}` }}
      >
        <img src={big(pair.after)} alt={pair.altAfter} width={pair.w} height={pair.h} loading={eager ? 'eager' : 'lazy'} decoding="async"
          {...(eager ? { fetchPriority: 'high' as const } : {})} className="absolute inset-0 w-full h-full object-cover" draggable={false} />
        <img src={big(pair.before)} alt={pair.altBefore} width={pair.w} height={pair.h} loading={eager ? 'eager' : 'lazy'} decoding="async"
          className="absolute inset-0 w-full h-full object-cover" draggable={false} style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} />
        <span className="absolute left-4 top-4 text-xs font-semibold px-3 py-1.5 rounded-full bg-black/60 text-white backdrop-blur">Sebelum</span>
        <span className="absolute right-4 top-4 text-xs font-semibold px-3 py-1.5 rounded-full text-white backdrop-blur" style={{ backgroundColor: 'rgba(22,96,207,.85)' }}>Sesudah</span>
        <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,.4)] pointer-events-none" style={{ left: `${pos}%` }}>
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center text-[#0b2a6f]">
            <ChevronsLeftRight size={22} aria-hidden="true" />
          </span>
        </div>
        <input
          type="range" min={0} max={100} step={0.5} value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`Geser untuk membandingkan sebelum dan sesudah: ${pair.title}`}
          className="lp-range absolute inset-0 w-full h-full opacity-0"
        />
      </div>
      <figcaption className="mt-3 px-5 md:px-0 text-sm text-[#6e6e73] dark:text-[#a1a1a6]">{pair.title}. Geser untuk membandingkan.</figcaption>
    </figure>
  );
};

/* ───────────── Bento ───────────── */

export const BentoCard: React.FC<{ children: React.ReactNode; className?: string; tone?: 'white' | 'blue' | 'navy' | 'lime' }> = ({ children, className = '', tone = 'white' }) => {
  const style = tone === 'blue' ? { backgroundColor: ACCENT, color: '#fff' } : tone === 'navy' ? { backgroundColor: NAVY, color: '#fff' } : tone === 'lime' ? { backgroundColor: LIME, color: NAVY } : undefined;
  return (
    <div style={style} className={`rounded-[24px] md:rounded-[28px] p-6 md:p-8 flex flex-col justify-between ${tone === 'white' ? 'bg-[#f5f5f7] dark:bg-[#1c1c1e]' : ''} ${className}`}>
      {children}
    </div>
  );
};

const Stars: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <span className="inline-flex" aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={size} className="fill-amber-400 text-amber-400" />)}</span>
);

/** Bento fakta: rating, garansi, 2-3 hari, antar-jemput, area. */
export const FactsBento: React.FC = () => (
  <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-6">
    <Reveal className="col-span-2 md:col-span-3">
      <BentoCard tone="navy" className="h-full min-h-[200px]">
        <Stars />
        <div>
          <div className="lp-num">{FACTS.rating}</div>
          <p className="mt-2 text-base md:text-lg opacity-80">rating Google dari {FACTS.reviewCount} ulasan</p>
          <p className="text-xs opacity-60 mt-1">Data {FACTS.ratingDate}</p>
        </div>
      </BentoCard>
    </Reveal>
    <Reveal className="col-span-2 md:col-span-3" delay={80}>
      <BentoCard className="h-full min-h-[200px]">
        <p className="text-sm font-semibold uppercase tracking-[.14em] text-[#1660cf] dark:text-[#4d94ff]">Garansi Klinik Matras</p>
        <div className="flex gap-6 mt-4">
          <div><div className="lp-num !text-[clamp(2.6rem,10vw,4.5rem)]">20</div><p className="text-base opacity-70">tahun, Upgrade</p></div>
          <div><div className="lp-num !text-[clamp(2.6rem,10vw,4.5rem)]">10</div><p className="text-base opacity-70">tahun, Service</p></div>
        </div>
      </BentoCard>
    </Reveal>
    <Reveal className="col-span-1 md:col-span-2" delay={0}>
      <BentoCard tone="lime" className="h-full min-h-[170px]">
        <p className="text-sm font-semibold">Pengerjaan</p>
        <div className="lp-num !text-[clamp(2.4rem,9vw,4rem)]">2-3<span className="text-xl font-bold ml-1">hari</span></div>
      </BentoCard>
    </Reveal>
    <Reveal className="col-span-1 md:col-span-2" delay={80}>
      <BentoCard className="h-full min-h-[170px]">
        <p className="text-sm font-semibold text-[#6e6e73] dark:text-[#a1a1a6]">Antar-jemput</p>
        <p className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">Gratis</p>
      </BentoCard>
    </Reveal>
    <Reveal className="col-span-2 md:col-span-2" delay={160}>
      <BentoCard className="h-full min-h-[170px]">
        <p className="text-sm font-semibold text-[#6e6e73] dark:text-[#a1a1a6]">Area</p>
        <p className="text-xl md:text-2xl font-bold tracking-tight leading-tight">Jabodetabek dan Bandung. Workshop dan kantor di Depok.</p>
      </BentoCard>
    </Reveal>
  </div>
);

/* ───────────── Review statis ───────────── */

export const ReviewBlock: React.FC<{ reviews: Review[]; title: string }> = ({ reviews, title }) => (
  <div>
    <h2 className="lp-h2 max-w-3xl">{title}</h2>
    <div className="mt-10 grid gap-3 md:gap-4 md:grid-cols-3">
      {reviews.map((r, i) => (
        <Reveal key={r.name} delay={i * 80}>
          <figure className="m-0 h-full rounded-[24px] md:rounded-[28px] bg-white dark:bg-[#1c1c1e] p-6 md:p-7 flex flex-col">
            <span className="flex mb-3" aria-label="5 dari 5 bintang"><Stars size={16} /></span>
            <blockquote className="m-0 text-[17px] leading-relaxed tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] flex-grow">&ldquo;{r.text}&rdquo;</blockquote>
            <figcaption className="mt-4 text-sm font-semibold text-[#6e6e73] dark:text-[#a1a1a6]">{r.name}, ulasan Google</figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
    <div className="mt-6">
      <TextLink href={GOOGLE_MAPS_URL}>Lihat semua ulasan di Google Maps</TextLink>
    </div>
  </div>
);

/* ───────────── Langkah & catatan ───────────── */

export const Steps: React.FC<{ steps: string[] }> = ({ steps }) => (
  <ol className="mt-10 grid gap-3 md:gap-4 md:grid-cols-3 list-none p-0 m-0">
    {steps.map((s, i) => (
      <Reveal key={i} delay={i * 80}>
        <li className="h-full rounded-[24px] md:rounded-[28px] bg-[#f5f5f7] dark:bg-[#1c1c1e] p-6 md:p-8">
          <span className="lp-num !text-[clamp(2.4rem,9vw,3.5rem)] text-[#1660cf] dark:text-[#4d94ff]" aria-hidden="true">{i + 1}</span>
          <p className="m-0 mt-3 text-xl tracking-tight leading-snug font-medium">{s}</p>
        </li>
      </Reveal>
    ))}
  </ol>
);

export const HealthNote: React.FC<{ short?: boolean; className?: string }> = ({ short, className = '' }) => (
  <p className={`text-sm leading-relaxed text-[#6e6e73] dark:text-[#a1a1a6] ${className}`}>
    {short ? 'Kasur amblas bisa ikut berperan bikin badan pegal. Nyeri berat atau menetap? Periksa ke dokter.' : HEALTH_NOTE}
  </p>
);

export const useHeroRef = () => useRef<HTMLElement | null>(null);
