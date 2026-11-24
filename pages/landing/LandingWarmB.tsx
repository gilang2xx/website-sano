import React from 'react';
import { useSEO } from '../../hooks/useSEO';
import {
  LandingShell, FloatingWa, WaButton, TextLink, Screen, Eyebrow, Lead, Reveal, BeforeAfterSlider,
  FactsBento, ReviewBlock, Steps, HealthNote, useHeroRef,
} from '../../components/landing/LandingKit';
import { FACTS, PAIRS, REVIEWS } from '../../components/landing/landingData';

// WARM B (MOCKUP): beli baru atau perbaiki? Satu tujuan: klik WA.
const MSG = 'Halo Klinik Matras, saya lagi bandingin beli kasur baru atau perbaiki kasur lama. Boleh dibantu hitung untuk kasur saya?';

// Hanya fakta yang kami pegang. Kolom "beli baru" sengaja tanpa angka.
const ROWS: Array<[string, string, string]> = [
  ['Harga', 'Bandingin sendiri dengan kasur yang kamu incar', `Service kasur mulai dari ${FACTS.priceService}`],
  ['Garansi', 'Cek syaratnya, beda tiap toko dan merek', `Garansi Klinik Matras: Upgrade ${FACTS.warrantyUpgrade}, Service ${FACTS.warrantyService}`],
  ['Kasur lama', 'Dibuang atau dijual murah', 'Dipakai lagi, dibuat kokoh'],
  ['Antar', 'Tanya ongkirnya dulu', `Jemput-antar gratis ${FACTS.freeShipArea}`],
  ['Waktu', 'Tanya lama kirimnya', `Dikerjakan ${FACTS.days}`],
];

const LandingWarmB: React.FC = () => {
  useSEO({
    title: 'Beli Kasur Baru atau Perbaiki? Bandingin Dulu',
    description: 'Sebelum beli kasur baru, bandingin dulu dengan memperbaiki kasur lamamu di Klinik Matras. Jemput-antar gratis, garansi sampai 20 tahun.',
    path: '/kasur-orthopedic/banding',
    noindex: true,
  });
  const hero = useHeroRef();

  return (
    <LandingShell>
      <section ref={hero as React.RefObject<HTMLElement>} className="pt-14 md:pt-24 pb-10 md:pb-16 text-center bg-white dark:bg-black">
        <div className="max-w-4xl mx-auto px-5">
          <h1 className="lp-big">Mau beli kasur baru? Bandingin aja dulu</h1>
          <Lead className="mt-5 max-w-2xl mx-auto">Kasur lamamu bisa dibikin kokoh lagi. Service mulai dari {FACTS.priceService}, dijemput gratis.</Lead>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
            <WaButton buttonId="ortho-warm-b-hero" placement="hero" eventLabel="Landing Ortho Warm B - Hero" label="Bandingin buat kasurku" message={MSG} className="w-full sm:w-auto" />
            <a href="#banding" className="inline-flex items-center min-h-[44px] text-[17px] font-medium text-[#1660cf] dark:text-[#4d94ff] hover:underline">Lihat perbandingannya</a>
          </div>
          <p className="mt-5 text-sm text-[#6e6e73] dark:text-[#a1a1a6]">5,0 di Google dari {FACTS.reviewCount} ulasan.</p>
        </div>
      </section>

      <section className="bg-white dark:bg-black pb-16 md:pb-28">
        <div className="max-w-6xl mx-auto md:px-5"><Reveal><BeforeAfterSlider pair={PAIRS.p10} eager /></Reveal></div>
      </section>

      <Screen tone="grey" id="banding">
        <Reveal><Eyebrow>Perbandingan</Eyebrow><h2 className="lp-h2 max-w-3xl">Beli baru vs perbaiki, apa bedanya?</h2></Reveal>
        <Reveal>
          <div className="mt-10 overflow-x-auto rounded-[24px] md:rounded-[28px] bg-white dark:bg-[#1c1c1e]">
            <table className="w-full min-w-[540px] text-left text-base md:text-lg">
              <caption className="sr-only">Perbandingan beli kasur baru dan memperbaiki kasur di Klinik Matras</caption>
              <thead>
                <tr>
                  <th scope="col" className="p-5 w-[16%]"><span className="sr-only">Hal</span></th>
                  <th scope="col" className="p-5 font-semibold text-[#6e6e73] dark:text-[#a1a1a6]">Beli kasur baru</th>
                  <th scope="col" className="p-5 font-bold text-[#1660cf] dark:text-[#4d94ff]">Perbaiki di Klinik Matras</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map(([k, a, b]) => (
                  <tr key={k} className="border-t border-black/5 dark:border-white/10 align-top">
                    <th scope="row" className="p-5 font-semibold">{k}</th>
                    <td className="p-5 text-[#6e6e73] dark:text-[#a1a1a6]">{a}</td>
                    <td className="p-5 font-semibold">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
        <Reveal><div className="mt-8"><WaButton buttonId="ortho-warm-b-banding" placement="pricing" eventLabel="Landing Ortho Warm B - Banding" label="Hitung punyaku" message={MSG} className="w-full sm:w-auto" /></div></Reveal>
      </Screen>

      <Screen>
        <Reveal><Eyebrow>Kasur pelanggan</Eyebrow><h2 className="lp-h2 max-w-3xl">Kasur yang sudah kami benerin.</h2></Reveal>
        <div className="mt-10 grid gap-8 md:grid-cols-2 -mx-5 md:mx-0">
          <Reveal><BeforeAfterSlider pair={PAIRS.p11} /></Reveal>
          <Reveal delay={100}><BeforeAfterSlider pair={PAIRS.p7} /></Reveal>
        </div>
        <div className="mt-6"><TextLink to="/before-after">Lihat semua hasil before-after</TextLink></div>
      </Screen>

      <Screen tone="grey"><FactsBento /></Screen>

      <Screen tone="grey" className="!pt-0"><ReviewBlock reviews={[REVIEWS.farhan, REVIEWS.jannah, REVIEWS.ratna]} title="Yang tadinya mau beli baru, bilang apa?" /></Screen>

      <Screen>
        <Reveal><Eyebrow>Caranya</Eyebrow><h2 className="lp-h2">Gampang, tiga langkah.</h2></Reveal>
        <Steps steps={['Kirim foto kasur lewat WA.', 'Dapat saran dan harga pastinya.', `Dijemput gratis, dikerjakan ${FACTS.days}, lalu diantar lagi.`]} />
      </Screen>

      <Screen tone="navy" className="text-center">
        <Reveal>
          <h2 className="lp-h2 max-w-3xl mx-auto">Sebelum checkout kasur baru, tanya kami dulu.</h2>
          <div className="mt-8"><WaButton tone="lime" buttonId="ortho-warm-b-cta" placement="cta" eventLabel="Landing Ortho Warm B - CTA" label="Chat WA sekarang" message={MSG} className="w-full sm:w-auto" /></div>
          <HealthNote short className="mt-10 max-w-xl mx-auto !text-white/60" />
        </Reveal>
      </Screen>

      <FloatingWa mode="after-hero" sentinelRef={hero} buttonId="ortho-warm-b-floating" placement="floating" eventLabel="Landing Ortho Warm B - Floating" label="Chat WA" message={MSG} />
    </LandingShell>
  );
};

export default LandingWarmB;
