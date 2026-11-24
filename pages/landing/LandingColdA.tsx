import React from 'react';
import { useSEO } from '../../hooks/useSEO';
import {
  LandingShell, FloatingWa, WaButton, TextLink, Screen, Eyebrow, Lead, Reveal, BeforeAfterSlider,
  FactsBento, ReviewBlock, Steps, HealthNote, BentoCard, useHeroRef,
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
      <section ref={hero as React.RefObject<HTMLElement>} className="pt-14 md:pt-24 pb-10 md:pb-16 text-center bg-white dark:bg-black">
        <div className="max-w-4xl mx-auto px-5">
          <h1 className="lp-big">Bangun tidur badan pegal &amp; sakit pinggang? Coba cek kasurmu dulu</h1>
          <Lead className="mt-5 max-w-2xl mx-auto">Kirim foto kasurmu, kami bantu cek lewat WA.</Lead>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
            <WaButton buttonId="ortho-cold-a-hero" placement="hero" eventLabel="Landing Ortho Cold A - Hero" label="Cek kasurku lewat WA" message={MSG} className="w-full sm:w-auto" />
            <a href="#hasil" className="inline-flex items-center min-h-[44px] text-[17px] font-medium text-[#1660cf] dark:text-[#4d94ff] hover:underline">Lihat hasilnya</a>
          </div>
          <p className="mt-5 text-sm text-[#6e6e73] dark:text-[#a1a1a6]">5,0 di Google dari {FACTS.reviewCount} ulasan. Chat dibalas {FACTS.hours}.</p>
        </div>
      </section>

      <section id="hasil" className="bg-white dark:bg-black pb-16 md:pb-28">
        <div className="max-w-6xl mx-auto md:px-5"><Reveal><BeforeAfterSlider pair={PAIRS.p10} eager /></Reveal></div>
      </section>

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

      <Screen>
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

      <Screen>
        <Reveal><Eyebrow>Caranya</Eyebrow><h2 className="lp-h2">Gampang, tiga langkah.</h2></Reveal>
        <Steps steps={['Kirim foto kasur lewat WA.', 'Kami cek, kasih saran dan harga pastinya.', `Dijemput gratis, dikerjakan ${FACTS.days}, lalu diantar lagi.`]} />
      </Screen>

      <Screen tone="grey"><FactsBento /></Screen>

      <Screen tone="grey" className="!pt-0"><ReviewBlock reviews={[REVIEWS.ratna, REVIEWS.jannah, REVIEWS.farhan]} title="Kata mereka yang sudah pakai." /></Screen>

      <Screen tone="navy" className="text-center">
        <Reveal>
          <h2 className="lp-h2 max-w-3xl mx-auto">Kasurmu masih bisa diselamatkan nggak? Tanya dulu aja.</h2>
          <p className="mt-4 text-xl opacity-80">Kirim fotonya, kami bantu cek.</p>
          <div className="mt-8"><WaButton tone="lime" buttonId="ortho-cold-a-closing" placement="cta" eventLabel="Landing Ortho Cold A - CTA Penutup" label="Kirim foto kasurku" message={MSG} className="w-full sm:w-auto" /></div>
          <HealthNote className="mt-10 max-w-xl mx-auto !text-white/60" />
        </Reveal>
      </Screen>

      <FloatingWa mode="after-hero" sentinelRef={hero} buttonId="ortho-cold-a-floating" placement="floating" eventLabel="Landing Ortho Cold A - Floating" label="Chat WA" message={MSG} />
    </LandingShell>
  );
};

export default LandingColdA;
