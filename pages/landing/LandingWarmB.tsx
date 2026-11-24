import React from 'react';
import { useSEO } from '../../hooks/useSEO';
import {
  LandingShell, FloatingWa, WaButton, HeroWaButton, HeroSecondaryLink, PhotoHero, TrustStrip, BigCase,
  Screen, Eyebrow, Reveal, ZigZag, PriceCard, ReviewBlock, Faq, CtaRibbon, HealthNote, Serif, Hl, useHeroRef,
} from '../../components/landing/LandingKit';
import { FACTS, FAQ, PAIRS, REVIEWS } from '../../components/landing/landingData';

// WARM B (MOCKUP v5): beli baru atau perbaiki? Satu tujuan: klik WA.
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
      <PhotoHero
        ref={hero}
        pill="Beli baru atau perbaiki?"
        title={<>Mau beli kasur baru? <Serif>Bandingin</Serif> aja dulu</>}
        lead={`Kasur lamamu bisa dibikin kokoh lagi. Service mulai dari ${FACTS.priceService}, dijemput gratis.`}
        checks={['Antar-jemput gratis', 'Garansi sampai 20 tahun', `Selesai ${FACTS.days}`]}
        actions={<>
          <WaButton buttonId="ortho-warm-b-hero" placement="hero" eventLabel="Landing Ortho Warm B - Hero" label="Bandingin buat kasurku" message={MSG} className="w-full sm:w-auto" />
          <HeroSecondaryLink href="#banding">Lihat perbandingannya</HeroSecondaryLink>
        </>}
      />

      <div className="pt-10 md:pt-16 bg-white dark:bg-black"><BigCase pair={PAIRS.p10} others={[PAIRS.p11, PAIRS.p6, PAIRS.p7]} title={<>Kasur yang sudah kami <Serif>benerin.</Serif></>} /></div>

      <TrustStrip />

      <Screen tone="grey" id="banding">
        <Reveal><Eyebrow>Perbandingan</Eyebrow><h2 className="lp-h2 max-w-3xl">Beli baru vs perbaiki, apa <Serif>bedanya?</Serif></h2></Reveal>
        <Reveal>
          <div className="mt-7 overflow-x-auto rounded-[24px] md:rounded-[28px] bg-white dark:bg-[#1c1c1e]">
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
        <div className="mt-5"><PriceCard>
          <WaButton buttonId="ortho-warm-b-banding" placement="pricing" eventLabel="Landing Ortho Warm B - Banding" label="Hitung punyaku" message={MSG} className="w-full sm:w-auto !bg-white !text-[#0b2a6f]" />
        </PriceCard></div>
      </Screen>


      <Screen tone="grey"><ReviewBlock reviews={[REVIEWS.sudarsono, REVIEWS.hidajat, REVIEWS.rifky]} title={<>Yang tadinya mau beli baru, <Serif>bilang apa?</Serif></>} /></Screen>

      <Screen>
        <Reveal><Eyebrow>Caranya</Eyebrow><h2 className="lp-h2">Gampang, <Serif>tiga langkah.</Serif></h2></Reveal>
        <ZigZag steps={[
          { title: <><Hl>Kirim foto</Hl> kasurmu lewat WA</>, text: 'Foto dari samping dan dari atas sudah cukup.', photo: 'langkah1', alt: 'Kasur di ruangan rumah yang difoto untuk dikirim ke tim' },
          { title: <>Dapat <Hl>saran dan harga</Hl> pastinya</>, text: 'Bandingkan dulu dengan kasur baru yang kamu incar. Tanpa paksaan.', photo: 'langkah2', alt: 'Tukang memotong busa di workshop Klinik Matras' },
          { title: <>Dijemput, <Hl>diantar lagi</Hl></>, text: `Dikerjakan ${FACTS.days}. Antar-jemput gratis untuk ${FACTS.freeShipArea}.`, photo: 'langkah3', alt: 'Mobil Klinik Matras mengantar kasur' },
        ]} />
      </Screen>

      <Screen tone="grey">
        <Reveal><Eyebrow>Pertanyaan umum</Eyebrow><h2 className="lp-h2 max-w-3xl">Masih <Serif>ragu?</Serif></h2></Reveal>
        <Faq items={FAQ} />
      </Screen>

      <CtaRibbon title={<>Sebelum checkout kasur baru, <Serif>tanya kami dulu.</Serif></>} note={<HealthNote short className="!text-white/70" />}>
        <HeroWaButton buttonId="ortho-warm-b-cta" placement="cta" eventLabel="Landing Ortho Warm B - CTA" label="Chat WA sekarang" message={MSG} className="w-full sm:w-auto" />
      </CtaRibbon>

      <FloatingWa mode="after-hero" sentinelRef={hero} buttonId="ortho-warm-b-floating" placement="floating" eventLabel="Landing Ortho Warm B - Floating" label="Chat WA" message={MSG} />
    </LandingShell>
  );
};

export default LandingWarmB;
