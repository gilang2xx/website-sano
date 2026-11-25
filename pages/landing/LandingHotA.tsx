import React from 'react';
import { useSEO } from '../../hooks/useSEO';
import {
  LandingShell, FloatingWa, WaButton, HeroWaButton, PhotoHero, TrustStrip, BigCase,
  Screen, Eyebrow, Lead, Reveal, Photo, Split, ZigZag, PriceCard, ReviewBlock, Faq, ConceptLine,
  CtaRibbon, HealthNote, Serif, Hl, useHeroRef,
} from '../../components/landing/LandingKit';
import { FACTS, FAQ, PAIRS, REVIEWS } from '../../components/landing/landingData';

// HOT A (MOCKUP): harga mulai dan booking. Satu tujuan: klik WA.
const MSG = 'Halo Klinik Matras, saya mau konsultasi soal service kasur di Jabodetabek. Boleh tanya harganya?';

const LandingHotA: React.FC = () => {
  useSEO({
    title: 'Service Kasur Jabodetabek',
    description: `Upgrade kasur sehat mulai dari ${FACTS.priceUpgrade}. Antar-jemput gratis ${FACTS.freeShipArea}, dikerjakan ${FACTS.days}. Konsultasi lewat WhatsApp.`,
    path: '/service-kasur',
    noindex: true,
  });

  const hero = useHeroRef();

  return (
    <LandingShell landingId="LP-HOT-A" audience="hot">
      <PhotoHero
        ref={hero}
        pill="Jabodetabek & Bandung"
        title={<>Service kasur di Jabodetabek? <Serif>Kami jemput</Serif>, kamu tinggal tunggu nyaman.</>}
        lead={`Upgrade kasur sehat mulai ${FACTS.priceUpgrade}. Antar-jemput gratis ${FACTS.freeShipArea}. ${FACTS.days}, kasurmu pulang nyaman lagi.`}
        checks={['Antar-jemput gratis', `Garansi hingga ${FACTS.warrantyUpgrade}`, `Selesai ${FACTS.days}`]}
        actions={<WaButton buttonId="ortho-hot-a-hero" placement="hero" eventLabel="Landing Ortho Hot A - Hero" label="Konsultasi lewat WA" message={MSG} className="w-full sm:w-auto" />}
      />

      <div className="pt-10 md:pt-16 bg-white dark:bg-black"><BigCase pair={PAIRS.world} others={[PAIRS.culm, PAIRS.thera, PAIRS.heir]} title={<>Sudah banyak yang <Serif>pakai.</Serif></>} /></div>

      <TrustStrip />

      <Screen tone="grey">
        <Reveal><Eyebrow>Harga</Eyebrow><h2 className="lp-h2 max-w-3xl">Harga <Hl>jelas</Hl> dari awal.</h2></Reveal>
        <div className="mt-7"><PriceCard>
          <WaButton buttonId="ortho-hot-a-pricing" placement="pricing" eventLabel="Landing Ortho Hot A - Pricing" label="Konsultasi sekarang" message={MSG} className="w-full sm:w-auto !bg-white !text-[#0b2a6f]" />
        </PriceCard></div>
      </Screen>


      <Screen tone="grey">
        <Reveal><Eyebrow>Caranya</Eyebrow><h2 className="lp-h2 max-w-3xl">Dari chat sampai <Serif>kasur pulang.</Serif></h2></Reveal>
        <ZigZag steps={[
          { title: <><Hl>Kirim foto</Hl> kasurmu lewat WhatsApp</>, text: 'Foto dari samping dan dari atas sudah cukup.', photo: 'langkah1', alt: 'Ibu memeriksa kasurnya sebelum mengirim foto ke tim' },
          { title: <>Kami <Hl>cek dan kerjakan</Hl></>, text: 'Dapat saran dan harga pastinya. Setelah cocok, tim kami mengerjakan di workshop.', photo: 'langkah2', alt: 'Tim Klinik Matras memeriksa kasur di workshop', badge: 'Pernah diliput CUANBOS Trans7' },
          { title: <>Dijemput, <Hl>diantar lagi</Hl></>, text: `Dikerjakan ${FACTS.days}. Antar-jemput gratis untuk ${FACTS.freeShipArea}.`, photo: 'langkah3', alt: 'Mobil Klinik Matras mengantar kasur ke rumah pelanggan' },
        ]} />
      </Screen>

      <Screen><ReviewBlock reviews={REVIEWS} title={<>Kata <Serif>pelanggan.</Serif></>} /><div className="mt-12"><ConceptLine /></div></Screen>

      <Screen tone="grey">
        <Reveal><Eyebrow>Pertanyaan umum</Eyebrow><h2 className="lp-h2 max-w-3xl">Masih <Serif>ragu?</Serif></h2></Reveal>
        <Faq items={FAQ} />
      </Screen>

      <Screen>
        <Split photo={<div className="relative"><Photo name="workshop" alt="Workshop Klinik Matras di Depok saat diliput kru televisi" sizes="(min-width:768px) 420px, 92vw" /><span className="absolute left-3 bottom-3 text-xs font-semibold px-3 py-1.5 rounded-full bg-white text-[#0b2a6f] shadow">Workshop kami di Depok, saat diliput CUANBOS Trans7</span></div>}>
          <Eyebrow>Lokasi dan jam</Eyebrow>
          <h2 className="lp-h2">Workshop dan kantor di <Serif>Depok.</Serif></h2>
          <Lead className="mt-3">Mau datang dan lihat langsung? Bisa, kabari dulu lewat WA. Chat dibalas {FACTS.hours}.</Lead>
        </Split>
      </Screen>

      <CtaRibbon title={<>Kasurmu kami <Serif>jemput</Serif> minggu ini?</>} sub={`Chat dibalas ${FACTS.hours}.`} note={<HealthNote short className="!text-white/70" />}>
        <HeroWaButton buttonId="ortho-hot-a-closing" placement="cta" eventLabel="Landing Ortho Hot A - CTA Penutup" label="Konsultasi lewat WA" message={MSG} className="w-full sm:w-auto" />
      </CtaRibbon>

      <FloatingWa sentinelRef={hero} buttonId="ortho-hot-a-floating" placement="floating" eventLabel="Landing Ortho Hot A - Floating" message={MSG} />
    </LandingShell>
  );
};

export default LandingHotA;
