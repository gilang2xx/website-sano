import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, Star, ArrowRight, ChevronsLeftRight, ShieldCheck, Clock, Truck, MapPin } from 'lucide-react';
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
export const BLUE2 = '#2f86ea';

const FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, Inter, "Helvetica Neue", Arial, sans-serif';

const CSS = `
.lp-rv{opacity:0;transform:translateY(24px);transition:opacity .8s ease,transform .8s cubic-bezier(.2,.7,.2,1)}
.lp-rv.in{opacity:1;transform:none}
.lp-big{font-size:clamp(2.1rem,8.4vw,4.75rem);line-height:1.04;letter-spacing:-.035em;font-weight:800}
.lp-h2{font-size:clamp(1.9rem,6.4vw,3.5rem);line-height:1.06;letter-spacing:-.03em;font-weight:800}
.lp-num{font-size:clamp(3rem,13vw,6rem);line-height:1;letter-spacing:-.04em;font-weight:800}
.lp-hero{background:radial-gradient(120% 80% at 50% 0%,#2f86ea 0%,#1660cf 45%,#0b2a6f 100%)}
.lp-hero-night{background:repeating-linear-gradient(90deg,rgba(47,134,234,0) 0 36px,rgba(47,134,234,.16) 38px 74px),linear-gradient(180deg,#050a2a 0%,#0b2a6f 100%)}
.lp-glass{background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.34);box-shadow:0 18px 40px rgba(5,10,42,.28);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px)}
@media (max-width:767px){.lp-glass{-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}}
.lp-ribbon{background:linear-gradient(120deg,#0b2a6f 0%,#1660cf 55%,#2f86ea 100%)}
.lp-float{animation:lpf 7s ease-in-out infinite}
@keyframes lpf{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
.lp-range{-webkit-appearance:none;appearance:none;background:transparent;margin:0;cursor:ew-resize;touch-action:pan-y}
.lp-range::-webkit-slider-thumb{-webkit-appearance:none;width:44px;height:100vh;background:transparent;border:0}
.lp-range::-moz-range-thumb{width:44px;height:100vh;background:transparent;border:0}
@media (prefers-reduced-motion:reduce){.lp-rv{opacity:1;transform:none;transition:none}.lp-float{animation:none}}
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
      <footer className="text-white" style={{ backgroundColor: NAVY }}>
        <div className="max-w-6xl mx-auto px-5 py-12 pb-28 grid gap-8 md:grid-cols-3">
          <div>
            <img src="/klinikmatras-dark.png" alt="Klinik Matras by SANO CARE" className="h-8 w-auto" width={140} height={32} loading="lazy" />
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

export const BeforeAfterSlider: React.FC<{ pair: PhotoPair; eager?: boolean; inCard?: boolean }> = ({ pair, eager = false, inCard = false }) => {
  const [pos, setPos] = useState(50);
  return (
    <figure className="m-0">
      <div
        className={`relative w-full overflow-hidden select-none bg-[#e8e8ed] dark:bg-[#1c1c1e] ${inCard ? 'rounded-[20px]' : 'md:rounded-[28px]'}`}
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
      {!inCard && <figcaption className="mt-3 px-5 md:px-0 text-sm text-[#6e6e73] dark:text-[#a1a1a6]">{pair.title}. Geser untuk membandingkan.</figcaption>}
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

/** Bento fakta: ikon + teks pendek, satu kartu disorot warna penuh. */
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
      <BentoCard className="h-full min-h-[170px]">
        <IconBox><Clock size={24} /></IconBox>
        <div><p className="text-3xl font-extrabold tracking-tight">2-3 hari</p><p className="text-sm opacity-70 mt-1">Pengerjaan</p></div>
      </BentoCard>
    </Reveal>
    <Reveal className="col-span-1 md:col-span-2" delay={80}>
      <BentoCard className="h-full min-h-[170px]">
        <IconBox><Truck size={24} /></IconBox>
        <div><p className="text-3xl font-extrabold tracking-tight">Gratis</p><p className="text-sm opacity-70 mt-1">Antar-jemput</p></div>
      </BentoCard>
    </Reveal>
    <Reveal className="col-span-2 md:col-span-2" delay={160}>
      <BentoCard className="h-full min-h-[170px]">
        <IconBox><MapPin size={24} /></IconBox>
        <div><p className="text-xl font-bold tracking-tight leading-snug">Jabodetabek dan Bandung</p><p className="text-sm opacity-70 mt-1">Workshop dan kantor di Depok</p></div>
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

/* ───────────── Hero gradien + kartu kaca melayang ───────────── */

export const Pill: React.FC<{ children: React.ReactNode; dark?: boolean }> = ({ children, dark }) => (
  <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ${dark ? 'bg-white/15 text-white border border-white/25' : 'bg-[#1660cf]/10 text-[#1660cf]'}`}>
    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: LIME }} aria-hidden="true" />{children}
  </span>
);

/** Satu kata kunci berwarna aksen di judul hero. */
export const Kw: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ color: LIME }}>{children}</span>;

const GlassChip: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`lp-glass rounded-2xl px-4 py-3 text-white text-left ${className}`}>{children}</div>
);

/**
 * Hero: gradien CSS biru (atau varian gelap), judul + tombol di atas,
 * lalu kartu before-after utama dengan kartu kaca melayang yang bertumpuk.
 * Blur hanya dipakai di sini.
 */
export const GradientHero = React.forwardRef<HTMLElement, {
  pill: string; title: React.ReactNode; lead: React.ReactNode; actions: React.ReactNode;
  pair: PhotoPair; night?: boolean; extraChip?: React.ReactNode;
}>(({ pill, title, lead, actions, pair, night, extraChip }, ref) => (
  <section ref={ref} className={`${night ? 'lp-hero-night' : 'lp-hero'} text-white rounded-b-[36px] md:rounded-b-[56px] overflow-hidden`}>
    <div className="max-w-5xl mx-auto px-5 pt-10 md:pt-16 pb-14 md:pb-20 text-center">
      <Pill dark>{pill}</Pill>
      <h1 className="lp-big mt-5 mx-auto max-w-4xl">{title}</h1>
      <p className="mt-4 text-lg md:text-2xl leading-snug tracking-tight text-white/80 max-w-2xl mx-auto">{lead}</p>
      <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-6">{actions}</div>

      <div className="relative mt-12 md:mt-16 max-w-2xl mx-auto">
        <div className="lp-glass rounded-[28px] p-2 md:p-3">
          <BeforeAfterSlider pair={pair} eager inCard />
        </div>
        <div className="flex flex-wrap justify-center gap-2 -mt-6 relative z-10 px-1 md:contents">
          <GlassChip className="md:absolute md:-left-20 md:top-1/2 lp-float">
            <div className="flex items-center gap-1.5"><Star size={15} className="fill-amber-300 text-amber-300" aria-hidden="true" /><span className="font-extrabold text-lg leading-none">{FACTS.rating}</span></div>
            <p className="text-xs text-white/80 mt-1">{FACTS.reviewCount} ulasan Google</p>
          </GlassChip>
          <GlassChip className="md:absolute md:-right-16 md:top-24">
            <div className="flex items-center gap-2"><ShieldCheck size={18} aria-hidden="true" /><span className="text-xs font-semibold text-white/80 leading-tight">Garansi Klinik Matras</span></div>
            <p className="text-sm font-bold mt-1">Upgrade {FACTS.warrantyUpgrade}, Service {FACTS.warrantyService}</p>
          </GlassChip>
          <GlassChip className="md:absolute md:-left-10 md:bottom-4">
            <div className="flex items-center gap-2"><Clock size={16} aria-hidden="true" /><span className="font-extrabold text-lg leading-none">{FACTS.days}</span></div>
            <p className="text-xs text-white/80 mt-1">pengerjaan</p>
          </GlassChip>
          {extraChip}
        </div>
      </div>
    </div>
  </section>
));
GradientHero.displayName = 'GradientHero';

export const HeroSecondaryLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a href={href} className="inline-flex items-center min-h-[44px] text-[17px] font-medium text-white/90 hover:text-white underline-offset-4 hover:underline">{children}</a>
);

/** Tombol WA di atas gradien: lime supaya kontras (satu-satunya pemakaian lime besar). */
export const HeroWaButton: React.FC<Omit<WaProps, 'tone'>> = (p) => <WaButton {...p} tone="lime" />;

/* ───────────── Strip kepercayaan ───────────── */

const LOGOS: Array<[string, string]> = [
  ['kingkoil', 'King Koil'], ['serta', 'Serta'], ['ladyamericana', 'Lady Americana'],
  ['elite', 'Elite'], ['florence', 'Florence'], ['springair', 'Spring Air'],
];

export const TrustStrip: React.FC = () => (
  <section className="bg-white dark:bg-black py-12 md:py-16">
    <div className="max-w-5xl mx-auto px-5 text-center">
      <Reveal>
        <p className="flex items-center justify-center gap-2 text-lg md:text-xl font-semibold tracking-tight">
          <Stars /> <span><strong>{FACTS.rating}</strong> di Google dari {FACTS.reviewCount} ulasan</span>
        </p>
        <p className="mt-8 text-xs md:text-sm font-semibold uppercase tracking-[.14em] text-[#6e6e73] dark:text-[#a1a1a6]">Dipercaya merestorasi berbagai merek kasur ternama</p>
        <ul className="mt-5 flex flex-wrap items-center justify-center gap-3 list-none p-0 m-0">
          {LOGOS.map(([f, n]) => (
            <li key={f} className="bg-white rounded-2xl border border-black/5 dark:border-white/10 px-4 py-3 h-16 w-28 md:w-32 flex items-center justify-center">
              <img src={`/landing/logo-${f}.webp`} alt={n} loading="lazy" decoding="async" height={40} className="max-h-10 w-auto max-w-full object-contain" />
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  </section>
);

/* ───────────── Pita CTA berwarna di dasar halaman ───────────── */

export const CtaRibbon: React.FC<{ title: string; sub?: string; children: React.ReactNode; note?: React.ReactNode }> = ({ title, sub, children, note }) => (
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
