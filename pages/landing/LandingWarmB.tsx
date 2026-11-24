import React from 'react';
import { useSEO } from '../../hooks/useSEO';
import {
  LandingShell, FloatingWa, WaButton, HeroWaButton, HeroSecondaryLink, LightHero, BigCase, Kw, TrustStrip, CtaRibbon,
  Screen, Eyebrow, Reveal, CaseStrip, PriceCard, FactsBento, ReviewBlock, Steps, HealthNote, useHeroRef,
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
      <LightHero
        ref={hero}
        pill="Beli baru atau perbaiki?"
        title={<>Mau beli kasur baru? <Kw>Bandingin</Kw> aja dulu</>}
        lead={`Kasur lamamu bisa dibikin kokoh lagi. Service mulai dari ${FACTS.priceService}, dijemput gratis.`}
        image={{ src: '/landing/hero-sfs.webp', alt: 'Susunan lapisan fondasi kasur: busa, frame guard dan pocket spring', w: 1200, h: 460, fit: 'contain' }}
        actions={<>
          <WaButton buttonId="ortho-warm-b-hero" placement="hero" eventLabel="Landing Ortho Warm B - Hero" label="Bandingin buat kasurku" message={MSG} className="w-full sm:w-auto" />
          <HeroSecondaryLink href="#banding">Lihat perbandingannya</HeroSecondaryLink>
        </>}
      />

      <BigCase pair={PAIRS.p10} />

      <TrustStrip />

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
        <div className="mt-6"><PriceCard /></div>
        <Reveal><div className="mt-8"><WaButton buttonId="ortho-warm-b-banding" placement="pricing" eventLabel="Landing Ortho Warm B - Banding" label="Hitung punyaku" message={MSG} className="w-full sm:w-auto" /></div></Reveal>
      </Screen>

      <CaseStrip pairs={[PAIRS.p11, PAIRS.p6, PAIRS.p7]} title="Kasur yang sudah kami benerin." />

      <Screen tone="grey"><FactsBento /></Screen>

      <Screen><ReviewBlock reviews={[REVIEWS.farhan, REVIEWS.jannah, REVIEWS.ratna]} title="Yang tadinya mau beli baru, bilang apa?" /></Screen>

      <Screen tone="grey">
        <Reveal><Eyebrow>Caranya</Eyebrow><h2 className="lp-h2">Gampang, tiga langkah.</h2></Reveal>
        <Steps steps={['Kirim foto kasur lewat WA.', 'Dapat saran dan harga pastinya.', `Dijemput gratis, dikerjakan ${FACTS.days}, lalu diantar lagi.`]} />
      </Screen>

      <CtaRibbon title="Sebelum checkout kasur baru, tanya kami dulu." note={<HealthNote short className="!text-white/70" />}>
        <HeroWaButton buttonId="ortho-warm-b-cta" placement="cta" eventLabel="Landing Ortho Warm B - CTA" label="Chat WA sekarang" message={MSG} className="w-full sm:w-auto" />
      </CtaRibbon>

      <FloatingWa mode="after-hero" sentinelRef={hero} buttonId="ortho-warm-b-floating" placement="floating" eventLabel="Landing Ortho Warm B - Floating" label="Chat WA" message={MSG} />
    </LandingShell>
  );
};

export default LandingWarmB;
