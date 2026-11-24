import React from 'react';
import { useSEO } from '../../hooks/useSEO';
import {
  LandingShell, FloatingWa, WaButton, HeroWaButton, GradientHero, Kw, TrustStrip, CtaRibbon,
  TextLink, Screen, Eyebrow, Lead, Reveal, BeforeAfterSlider, BentoCard, ReviewBlock, Steps, HealthNote,
} from '../../components/landing/LandingKit';
import { FACTS, PAIRS, REVIEWS } from '../../components/landing/landingData';

// HOT A (MOCKUP): harga mulai dan slot. Satu tujuan: klik WA.
// Satu-satunya hero varian gelap (malam).
const MSG = 'Halo Klinik Matras, saya mau tanya harga service kasur dan slot jemput terdekat.';

const LandingHotA: React.FC = () => {
  useSEO({
    title: 'Service Kasur Depok, Cek Harga dan Slot Jemput',
    description: `Service kasur mulai dari ${FACTS.priceService}. Jemput-antar gratis, dikerjakan ${FACTS.days}. Tanya harga dan slot lewat WhatsApp.`,
    path: '/service-kasur-depok',
    noindex: true,
  });

  return (
    <LandingShell>
      <GradientHero
        night
        pill="Depok, Jabodetabek, Bandung"
        title={<>Service kasur di Depok? Cek <Kw>harga</Kw> dan slot jemput</>}
        lead={`Service kasur mulai dari ${FACTS.priceService}. Dijemput gratis, dikerjakan ${FACTS.days}.`}
        pair={PAIRS.p10}
        actions={<HeroWaButton buttonId="ortho-hot-a-hero" placement="hero" eventLabel="Landing Ortho Hot A - Hero" label="Tanya harga dan jadwal" message={MSG} className="w-full sm:w-auto" />}
      />

      <TrustStrip />

      <Screen tone="grey">
        <Reveal><Eyebrow>Harga</Eyebrow><h2 className="lp-h2 max-w-3xl">Service kasur mulai dari {FACTS.priceService}.</h2>
          <Lead className="mt-4 max-w-2xl">Harga pastinya tergantung kondisi kasur. Kirim foto, kami kasih angkanya. Mau upgrade? Kami bahas setelah lihat kasurmu.</Lead></Reveal>
        <div className="mt-10 grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-4">
          <Reveal><BentoCard tone="blue" className="h-full min-h-[170px]"><p className="text-sm font-semibold opacity-85">Garansi Klinik Matras</p><div><div className="lp-num !text-[clamp(2.6rem,10vw,4rem)]">20</div><p className="opacity-85">tahun, Upgrade</p></div></BentoCard></Reveal>
          <Reveal delay={70}><BentoCard className="h-full min-h-[170px]"><p className="text-sm font-semibold text-[#1660cf] dark:text-[#4d94ff]">Garansi Klinik Matras</p><div><div className="lp-num !text-[clamp(2.6rem,10vw,4rem)]">10</div><p className="opacity-70">tahun, Service</p></div></BentoCard></Reveal>
          <Reveal delay={140}><BentoCard className="h-full min-h-[170px]"><p className="text-sm font-semibold text-[#6e6e73] dark:text-[#a1a1a6]">Pengerjaan</p><div className="lp-num !text-[clamp(2.4rem,9vw,3.6rem)]">2-3<span className="text-xl font-bold ml-1">hari</span></div></BentoCard></Reveal>
          <Reveal delay={210}><BentoCard className="h-full min-h-[170px]"><p className="text-sm font-semibold text-[#6e6e73] dark:text-[#a1a1a6]">Jemput-antar gratis</p><p className="text-xl font-bold tracking-tight leading-tight">Jabodetabek dan Bandung</p></BentoCard></Reveal>
        </div>
        <Reveal><div className="mt-8"><WaButton buttonId="ortho-hot-a-pricing" placement="pricing" eventLabel="Landing Ortho Hot A - Pricing" label="Minta harga pastinya" message={MSG} className="w-full sm:w-auto" /></div></Reveal>
      </Screen>

      <Screen>
        <Reveal><Eyebrow>Jadwal</Eyebrow><h2 className="lp-h2 max-w-3xl">Slot jemput terdekat?</h2>
          <Lead className="mt-4 max-w-2xl">Jadwal menyesuaikan antrean workshop. Tanya lewat WA, kami kabari yang masih kosong.</Lead></Reveal>
        <Steps steps={['Chat dan kirim foto kasur.', 'Sepakat harga dan jadwal jemput.', `Dikerjakan ${FACTS.days}, lalu diantar lagi.`]} />
      </Screen>

      <section className="bg-[#f5f5f7] dark:bg-[#0a0a0a] pt-16 md:pt-28 pb-16 md:pb-28">
        <div className="max-w-5xl mx-auto px-5"><Reveal><Eyebrow>Hasil asli</Eyebrow><h2 className="lp-h2 max-w-3xl">Sudah banyak yang pakai.</h2></Reveal></div>
        <div className="max-w-6xl mx-auto md:px-5 mt-10"><Reveal><BeforeAfterSlider pair={PAIRS.p11} /></Reveal></div>
        <div className="max-w-5xl mx-auto px-5 mt-6"><TextLink to="/before-after">Lihat semua hasil before-after</TextLink></div>
        <div className="max-w-5xl mx-auto px-5 mt-16"><ReviewBlock reviews={[REVIEWS.jannah]} title="Kata pelanggan." /></div>
      </section>

      <Screen>
        <Reveal><Eyebrow>Lokasi dan jam</Eyebrow><h2 className="lp-h2 max-w-3xl">Workshop dan kantor di Depok.</h2>
          <Lead className="mt-4 max-w-2xl">Mau datang dan lihat langsung? Bisa, kabari dulu lewat WA. Jemput-antar gratis untuk {FACTS.freeShipArea}. Chat dibalas {FACTS.hours}.</Lead></Reveal>
      </Screen>

      <CtaRibbon title="Siap jadwalkan jemput?" sub="Tanya harga dan slot, kami balas di jam kerja." note={<HealthNote short className="!text-white/70" />}>
        <HeroWaButton buttonId="ortho-hot-a-closing" placement="cta" eventLabel="Landing Ortho Hot A - CTA Penutup" label="Tanya harga dan jadwal" message={MSG} className="w-full sm:w-auto" />
      </CtaRibbon>

      <FloatingWa mode="bar" buttonId="ortho-hot-a-floating" placement="floating" eventLabel="Landing Ortho Hot A - Floating" label="Chat WA: harga dan jadwal" message={MSG} />
    </LandingShell>
  );
};

export default LandingHotA;
