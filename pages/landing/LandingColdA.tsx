import React from 'react';
import { useSEO } from '../../hooks/useSEO';
import {
  LandingShell, FloatingWa, WaButton, HeroWaButton, HeroSecondaryLink, GradientHero, Kw, TrustStrip, CtaRibbon,
  TextLink, Screen, Eyebrow, Lead, Reveal, BeforeAfterSlider, FactsBento, ReviewBlock, Steps, HealthNote, BentoCard, useHeroRef,
} from '../../components/landing/LandingKit';
import { FACTS, PAIRS, REVIEWS } from '../../components/landing/landingData';

// COLD A (MOCKUP): pegal dulu, baru kasur. Satu tujuan: klik WA.
const MSG = 'Halo Klinik Matras, badan saya sering pegal waktu bangun tidur. Saya mau cek kondisi kasur saya, ini fotonya.';

const CHECKS = [
  'Ada cekungan di tengah, apalagi di bagian pinggul.',
  'Kamu sering geser ke pinggir biar nggak "tenggelam".',
  'Bangun tidur pegal, siangnya mendingan.',
  'Kasur udah dibalik-balik, tetap aja nggak enak.',
];

const LandingColdA: React.FC = () => {
  useSEO({
    title: 'Cek Kasurmu Dulu',
    description: 'Bangun tidur badan pegal dan sakit pinggang? Cek dulu kasurmu. Kirim foto lewat WhatsApp, tim Klinik Matras bantu cek.',
    path: '/kasur-orthopedic',
    noindex: true,
  });
  const hero = useHeroRef();

  return (
    <LandingShell>
      <GradientHero
        ref={hero}
        pill="Service dan upgrade kasur"
        title={<>Bangun tidur badan pegal &amp; sakit pinggang? Coba <Kw>cek kasurmu dulu</Kw></>}
        lead="Kirim foto kasurmu, kami bantu cek lewat WA."
        pair={PAIRS.p10}
        actions={<>
          <HeroWaButton buttonId="ortho-cold-a-hero" placement="hero" eventLabel="Landing Ortho Cold A - Hero" label="Cek kasurku lewat WA" message={MSG} className="w-full sm:w-auto" />
          <HeroSecondaryLink href="#hasil">Lihat hasilnya</HeroSecondaryLink>
        </>}
      />

      <TrustStrip />

      <Screen tone="grey">
        <Reveal><h2 className="lp-h2 max-w-3xl">Kasurmu begini nggak?</h2></Reveal>
        <ul className="mt-10 grid gap-3 md:grid-cols-2 list-none p-0 m-0">
          {CHECKS.map((c, i) => (
            <Reveal key={c} delay={i * 70}>
              <li className="h-full rounded-[24px] bg-white dark:bg-[#1c1c1e] p-6 md:p-7 text-xl md:text-2xl font-semibold tracking-tight leading-snug">{c}</li>
            </Reveal>
          ))}
        </ul>
        <Reveal><p className="mt-8 text-xl md:text-2xl font-semibold tracking-tight">Kalau kamu centang dua atau lebih, kasurmu layak dicek.</p></Reveal>
        <Reveal><div className="mt-4"><WaButton buttonId="ortho-cold-a-cta" placement="cta" eventLabel="Landing Ortho Cold A - CTA" label="Kirim foto kasurku" message={MSG} className="w-full sm:w-auto" /></div></Reveal>
      </Screen>

      <Screen id="hasil">
        <Reveal><Eyebrow>Kasur pelanggan</Eyebrow><h2 className="lp-h2 max-w-3xl">Sebelum dan sesudah, hasil asli.</h2></Reveal>
        <div className="mt-10 grid gap-8 md:grid-cols-2 -mx-5 md:mx-0">
          <Reveal><BeforeAfterSlider pair={PAIRS.p11} /></Reveal>
          <Reveal delay={100}><BeforeAfterSlider pair={PAIRS.p6} /></Reveal>
        </div>
        <div className="mt-6"><TextLink to="/before-after">Lihat semua hasil before-after</TextLink></div>
      </Screen>

      <Screen tone="grey">
        <Reveal><Eyebrow>Dua pilihan</Eyebrow><h2 className="lp-h2 max-w-3xl">Service atau Upgrade? Kami bantu pilihkan.</h2></Reveal>
        <div className="mt-10 grid gap-3 md:gap-4 md:grid-cols-2">
          <Reveal><BentoCard className="h-full bg-white dark:bg-[#1c1c1e] !p-8">
            <div><h3 className="text-3xl font-bold tracking-tight">Service</h3>
              <p className="mt-3 text-xl text-[#6e6e73] dark:text-[#a1a1a6] leading-snug">Fondasi yang amblas kami perbaiki. Kasurnya tetap kasurmu.</p></div>
            <p className="mt-8 text-lg font-semibold text-[#1660cf] dark:text-[#4d94ff]">Garansi Klinik Matras {FACTS.warrantyService}</p>
          </BentoCard></Reveal>
          <Reveal delay={90}><BentoCard tone="blue" className="h-full !p-8">
            <div><h3 className="text-3xl font-bold tracking-tight">Upgrade</h3>
              <p className="mt-3 text-xl opacity-90 leading-snug">Kasur lamamu dirombak jadi lebih kokoh dan lebih menopang badan. Otomatis paket Premium.</p></div>
            <p className="mt-8 text-lg font-semibold">Garansi Klinik Matras {FACTS.warrantyUpgrade}</p>
          </BentoCard></Reveal>
        </div>
        <Reveal><p className="mt-10 text-2xl md:text-4xl font-bold tracking-tight">Service kasur mulai dari <span className="text-[#1660cf] dark:text-[#4d94ff]">{FACTS.priceService}</span></p>
          <Lead className="mt-2">Bingung pilih yang mana? Wajar kok. Dari foto kasurmu, tim kami bantu pilih.</Lead></Reveal>
      </Screen>

      <Screen><FactsBento /></Screen>

      <Screen tone="grey">
        <Reveal><Eyebrow>Caranya</Eyebrow><h2 className="lp-h2">Gampang, tiga langkah.</h2></Reveal>
        <Steps steps={['Kirim foto kasur lewat WA.', 'Kami cek, kasih saran dan harga pastinya.', `Dijemput gratis, dikerjakan ${FACTS.days}, lalu diantar lagi.`]} />
      </Screen>

      <Screen><ReviewBlock reviews={[REVIEWS.ratna, REVIEWS.jannah, REVIEWS.farhan]} title="Kata mereka yang sudah pakai." /></Screen>

      <CtaRibbon
        title="Kasurmu masih bisa diselamatkan nggak? Tanya dulu aja."
        sub="Kirim fotonya, kami bantu cek."
        note={<HealthNote className="!text-white/70" />}
      >
        <HeroWaButton buttonId="ortho-cold-a-closing" placement="cta" eventLabel="Landing Ortho Cold A - CTA Penutup" label="Kirim foto kasurku" message={MSG} className="w-full sm:w-auto" />
      </CtaRibbon>

      <FloatingWa mode="after-hero" sentinelRef={hero} buttonId="ortho-cold-a-floating" placement="floating" eventLabel="Landing Ortho Cold A - Floating" label="Chat WA" message={MSG} />
    </LandingShell>
  );
};

export default LandingColdA;
