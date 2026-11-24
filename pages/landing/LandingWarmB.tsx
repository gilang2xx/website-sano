import React from 'react';
import { useSEO } from '../../hooks/useSEO';
import {
  LandingShell, FloatingWa, WaButton, Section, H2, Muted, PairCard, GalleryLink, RatingLine,
  ReviewBlock, WarrantyBadges, Steps, HealthNote, useHeroRef,
} from '../../components/landing/LandingKit';
import { FACTS, PAIRS, REVIEWS } from '../../components/landing/landingData';

// WARM B: sudah tertarik tapi ketahan di "mending beli baru aja". Satu tujuan: klik WA.
const MSG = 'Halo Klinik Matras, saya lagi bandingin beli kasur baru atau perbaiki kasur lama. Boleh dibantu hitung untuk kasur saya?';

// Hanya fakta yang kami pegang. Kolom "beli baru" sengaja tanpa angka (belum ada pembanding yang jujur).
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
      <section ref={hero as React.RefObject<HTMLElement>} className="pt-8 pb-10 md:pt-14 md:pb-16">
        <div className="max-w-5xl mx-auto px-5 grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-slate-900 dark:text-white">
              Mau beli kasur baru? Bandingin aja dulu
            </h1>
            <Muted className="mt-4">
              Kasur lamamu bisa dibikin kokoh lagi. Service kasur mulai dari {FACTS.priceService}, dijemput gratis, balik lagi dalam {FACTS.days}.
            </Muted>
            <div className="mt-6">
              <WaButton
                buttonId="ortho-warm-b-hero" placement="hero" eventLabel="Landing Ortho Warm B - Hero"
                label="Bandingin buat kasurku" message={MSG} className="w-full sm:w-auto"
              />
            </div>
            <RatingLine className="mt-4" />
          </div>
          <PairCard pair={PAIRS.p10} eager />
        </div>
      </section>

      <Section tone="soft">
        <H2>Beli baru vs perbaiki, apa bedanya?</H2>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-bg-dark">
          <table className="w-full min-w-[520px] text-left text-sm md:text-base">
            <caption className="sr-only">Perbandingan beli kasur baru dan memperbaiki kasur di Klinik Matras</caption>
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
                <th scope="col" className="p-4 font-bold w-[18%]"><span className="sr-only">Hal</span></th>
                <th scope="col" className="p-4 font-bold">Beli kasur baru</th>
                <th scope="col" className="p-4 font-bold text-primary dark:text-primary-light">Perbaiki di Klinik Matras</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([k, a, b]) => (
                <tr key={k} className="border-t border-slate-200 dark:border-slate-700 align-top">
                  <th scope="row" className="p-4 font-bold text-slate-900 dark:text-white">{k}</th>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{a}</td>
                  <td className="p-4 font-semibold text-slate-900 dark:text-white bg-primary-light/30 dark:bg-primary-dark/25">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <WarrantyBadges className="mt-6" />
        <div className="mt-6">
          <WaButton
            buttonId="ortho-warm-b-banding" placement="pricing" eventLabel="Landing Ortho Warm B - Banding"
            label="Hitung punyaku" message={MSG} className="w-full sm:w-auto"
          />
        </div>
      </Section>

      <Section>
        <H2>Kasur yang sudah kami benerin</H2>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          <PairCard pair={PAIRS.p11} />
          <PairCard pair={PAIRS.p6} />
          <PairCard pair={PAIRS.p7} />
        </div>
        <div className="mt-6"><GalleryLink /></div>
      </Section>

      <Section tone="soft">
        <ReviewBlock reviews={[REVIEWS.farhan, REVIEWS.jannah, REVIEWS.ratna]} title="Yang tadinya mau beli baru, bilang apa?" />
      </Section>

      <Section>
        <H2>Caranya gampang</H2>
        <Steps steps={[
          'Kirim foto kasur lewat WA.',
          'Dapat saran dan harga pastinya.',
          `Dijemput gratis, dikerjakan ${FACTS.days}, lalu diantar lagi.`,
        ]} />
      </Section>

      <Section tone="soft" className="text-center">
        <H2>Sebelum checkout kasur baru, tanya kami dulu.</H2>
        <div className="mt-6">
          <WaButton
            buttonId="ortho-warm-b-cta" placement="cta" eventLabel="Landing Ortho Warm B - CTA"
            label="Chat WA sekarang" message={MSG} className="w-full sm:w-auto"
          />
        </div>
        <HealthNote short className="mt-6 max-w-xl mx-auto" />
      </Section>

      <FloatingWa
        mode="after-hero" sentinelRef={hero}
        buttonId="ortho-warm-b-floating" placement="floating" eventLabel="Landing Ortho Warm B - Floating"
        label="Chat WA" message={MSG}
      />
    </LandingShell>
  );
};

export default LandingWarmB;
