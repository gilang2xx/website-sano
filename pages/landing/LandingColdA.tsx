import React from 'react';
import { Check } from 'lucide-react';
import { useSEO } from '../../hooks/useSEO';
import {
  LandingShell, FloatingWa, WaButton, HeroWaButton, HeroSecondaryLink, PhotoHero, TrustStrip, BigCase,
  Screen, Eyebrow, Lead, Reveal, Photo, Split, ZigZag, PriceCard, ReviewBlock, Faq, ConceptSection,
  CtaRibbon, HealthNote, Serif, Hl, useHeroRef,
  UspCards,
} from '../../components/landing/LandingKit';
import { FACTS, FAQ, PAIRS, REVIEWS, USP } from '../../components/landing/landingData';

// COLD A (MOCKUP v5): pegal dulu, baru kasur. Satu tujuan: klik WA.
const MSG = 'Halo Klinik Matras, saya mau konsultasi soal kasur saya. Badan sering pegal waktu bangun tidur, ini fotonya.';

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
    <LandingShell landingId="LP-COLD-A" audience="cold">
      <PhotoHero
        ref={hero}
        pill="Service atau upgrade kasur sehat"
        title={<>Bangun tidur badan pegal &amp; sakit pinggang? Coba <Serif>cek kasurmu dulu</Serif></>}
        lead="Kirim foto kasurmu, kami bantu cek lewat WA."
        checks={['Antar-jemput gratis Jabodetabek & Bandung', `Garansi hingga ${FACTS.warrantyUpgrade}`, `Selesai ${FACTS.days}`]}
        actions={<>
          <WaButton buttonId="ortho-cold-a-hero" placement="hero" eventLabel="Landing Ortho Cold A - Hero" label="Konsultasi lewat WA" message={MSG} className="w-full sm:w-auto" />
          <HeroSecondaryLink href="#hasil">Lihat hasilnya</HeroSecondaryLink>
        </>}
      />

      <div className="pt-10 md:pt-16 bg-white dark:bg-black"><BigCase pair={PAIRS.world} others={[PAIRS.culm, PAIRS.thera, PAIRS.heir]} /></div>

      <TrustStrip />

      <Screen tone="grey">
        <Split photo={<Photo name="masalah" alt="Kasur lama yang kusam di meja workshop sebelum dikerjakan" className="aspect-[4/5]" />}>
          <Eyebrow>Kenali tandanya</Eyebrow>
          <h2 className="lp-h2">Kasurmu <Hl>begini nggak?</Hl></h2>
          <ul className="mt-5 grid gap-3 list-none p-0 m-0">
            {CHECKS.map((c) => (
              <li key={c} className="flex gap-3 items-start text-lg leading-snug">
                <span className="mt-0.5 shrink-0 w-6 h-6 rounded-full bg-[#1660cf] text-white flex items-center justify-center" aria-hidden="true"><Check size={15} /></span>{c}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-lg font-semibold">Kalau kamu centang dua atau lebih, kasurmu layak dicek.</p>
          <div className="mt-5"><WaButton buttonId="ortho-cold-a-cta" placement="cta" eventLabel="Landing Ortho Cold A - CTA" label="Konsultasi sekarang" message={MSG} className="w-full sm:w-auto" /></div>
        </Split>
      </Screen>


      <Screen><ConceptSection /></Screen>

      <Screen>
        <Reveal><Eyebrow>Kenapa nggak beli baru aja?</Eyebrow><h2 className="lp-h2 max-w-3xl">Bangun kok pegal? <Serif>Cek kasurmu dulu.</Serif></h2></Reveal>
        <UspCards cards={[USP.keluhan, USP.berat, USP.lama, USP.garansi, USP.antar]} />
      </Screen>

      <Screen tone="grey">
        <Reveal><Eyebrow>Caranya</Eyebrow><h2 className="lp-h2">Gampang, <Serif>tiga langkah.</Serif></h2></Reveal>
        <ZigZag steps={[
          { title: <><Hl>Kirim foto</Hl> kasurmu lewat WhatsApp</>, text: 'Foto dari samping dan dari atas sudah cukup.', photo: 'langkah1', alt: 'Ibu memeriksa kasurnya sebelum mengirim foto ke tim' },
          { title: <>Kami <Hl>cek dan kerjakan</Hl></>, text: 'Dapat saran dan harga pastinya. Setelah cocok, tim kami mengerjakan di workshop.', photo: 'langkah2', alt: 'Tim Klinik Matras memeriksa kasur di workshop', badge: 'Pernah diliput CUANBOS Trans7' },
          { title: <>Dijemput, <Hl>diantar lagi</Hl></>, text: `Dikerjakan ${FACTS.days}. Antar-jemput gratis untuk ${FACTS.freeShipArea}.`, photo: 'langkah3', alt: 'Mobil Klinik Matras mengantar kasur ke rumah pelanggan' },
        ]} />
      </Screen>

      <Screen>
        <Split photo={<Photo name="konsul" alt="Teknisi Klinik Matras mengecek kasur di rumah pelanggan" />}>
          <Eyebrow>Konsultasi dulu</Eyebrow>
          <h2 className="lp-h2">Service atau Upgrade Kasur Sehat? Kami bantu <Serif>pilih</Serif> sesuai keluhanmu.</h2>
          <Lead className="mt-4">Ceritakan keluhanmu dan kirim foto kasurnya. Tim kami dengarkan dulu, cek kondisinya, lalu sarankan penanganan yang paling pas.</Lead>
          <div className="mt-6"><WaButton buttonId="ortho-cold-a-service" placement="service-card" eventLabel="Landing Ortho Cold A - Konsultasi" label="Konsultasi sekarang" message={MSG} className="w-full sm:w-auto" /></div>
        </Split>
        <div className="mt-10"><PriceCard /></div>
      </Screen>

      <Screen tone="grey"><ReviewBlock reviews={REVIEWS} title={<>Kata mereka yang <Serif>sudah pakai.</Serif></>} /></Screen>

      <Screen>
        <Reveal><Eyebrow>Pertanyaan umum</Eyebrow><h2 className="lp-h2 max-w-3xl">Masih <Serif>ragu?</Serif></h2></Reveal>
        <Faq items={FAQ} />
      </Screen>

      <CtaRibbon
        title={<>Kasurmu masih bisa diselamatkan nggak? <Serif>Tanya dulu aja.</Serif></>}
        sub="Kirim fotonya, kami bantu cek."
        note={<HealthNote className="!text-white/70" />}
      >
        <HeroWaButton buttonId="ortho-cold-a-closing" placement="cta" eventLabel="Landing Ortho Cold A - CTA Penutup" label="Konsultasi lewat WA" message={MSG} className="w-full sm:w-auto" />
      </CtaRibbon>

      <FloatingWa sentinelRef={hero} buttonId="ortho-cold-a-floating" placement="floating" eventLabel="Landing Ortho Cold A - Floating" message={MSG} />
    </LandingShell>
  );
};

export default LandingColdA;
