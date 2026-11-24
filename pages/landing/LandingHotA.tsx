import React from 'react';
import { useSEO } from '../../hooks/useSEO';
import {
  LandingShell, FloatingWa, WaButton, HeroWaButton, PhotoHero, TrustStrip, BigCase,
  Screen, Eyebrow, Lead, Reveal, Photo, Split, ZigZag, PriceCard, NumbersRow, ReviewBlock, Faq, ConceptLine,
  CtaRibbon, HealthNote, Serif, Hl, BentoCard, useHeroRef,
} from '../../components/landing/LandingKit';
import { FACTS, FAQ, PAIRS, REVIEWS } from '../../components/landing/landingData';

// HOT A (MOCKUP): harga mulai dan booking. Satu tujuan: klik WA.
const MSG = 'Halo Klinik Matras, saya mau booking service kasur di Jabodetabek. Boleh tanya harganya?';

const LandingHotA: React.FC = () => {
  useSEO({
    title: 'Service Kasur Jabodetabek',
    description: `Service kasur mulai dari ${FACTS.priceService}. Antar-jemput gratis ${FACTS.freeShipArea}, dikerjakan ${FACTS.days}. Booking lewat WhatsApp.`,
    path: '/service-kasur',
    noindex: true,
  });

  const hero = useHeroRef();

  return (
    <LandingShell>
      <PhotoHero
        ref={hero}
        pill="Jabodetabek & Bandung"
        title={<>Service kasur di Jabodetabek? <Serif>Kami jemput</Serif>, kamu tinggal tunggu nyaman.</>}
        lead={`Mulai ${FACTS.priceService}. Antar-jemput gratis ${FACTS.freeShipArea}. ${FACTS.days}, kasurmu pulang nyaman lagi.`}
        checks={['Antar-jemput gratis', 'Garansi sampai 20 tahun', `Selesai ${FACTS.days}`]}
        actions={<WaButton buttonId="ortho-hot-a-hero" placement="hero" eventLabel="Landing Ortho Hot A - Hero" label="Booking lewat WA" message={MSG} className="w-full sm:w-auto" />}
      />

      <div className="pt-10 md:pt-16 bg-white dark:bg-black"><BigCase pair={PAIRS.world} others={[PAIRS.culm, PAIRS.thera, PAIRS.heir]} title={<>Sudah banyak yang <Serif>pakai.</Serif></>} /></div>

      <TrustStrip />

      <Screen tone="grey">
        <Reveal><Eyebrow>Harga</Eyebrow><h2 className="lp-h2 max-w-3xl">Harga <Hl>jelas</Hl> dari awal.</h2></Reveal>
        <div className="mt-7 grid gap-3 md:gap-5 md:grid-cols-2">
          <PriceCard>
            <WaButton buttonId="ortho-hot-a-pricing" placement="pricing" eventLabel="Landing Ortho Hot A - Pricing" label="Minta harga pastinya" message={MSG} className="w-full sm:w-auto !bg-white !text-[#0b2a6f]" />
          </PriceCard>
          <Reveal delay={90} className="h-full">
            <BentoCard className="h-full gap-5 !bg-white dark:!bg-[#1c1c1e]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[.14em] text-[#1660cf] dark:text-[#4d94ff]">Upgrade</p>
                <p className="mt-2 text-3xl md:text-4xl font-bold tracking-tight leading-tight">Garansi Klinik Matras {FACTS.warrantyUpgrade}</p>
                <p className="mt-3 text-lg text-[#6e6e73] dark:text-[#a1a1a6] leading-snug">Kasur lamamu dirombak jadi lebih kokoh. Garansi sampai 20 tahun. Harga setelah kami lihat kondisi kasurmu.</p>
              </div>
              <p className="text-base font-semibold">Service: garansi {FACTS.warrantyService}</p>
            </BentoCard>
          </Reveal>
        </div>
        <div className="mt-10"><NumbersRow /></div>
      </Screen>


      <Screen tone="grey">
        <Reveal><Eyebrow>Caranya</Eyebrow><h2 className="lp-h2 max-w-3xl">Dari chat sampai <Serif>kasur pulang.</Serif></h2></Reveal>
        <ZigZag steps={[
          { title: <><Hl>Kirim foto</Hl> kasurmu lewat WA</>, text: 'Foto dari samping dan dari atas sudah cukup.', photo: 'langkah1', alt: 'Ibu memeriksa kasurnya sebelum mengirim foto ke tim' },
          { title: <>Kami <Hl>cek dan kerjakan</Hl></>, text: 'Dapat saran dan harga pastinya. Setelah cocok, tim kami mengerjakan di workshop.', photo: 'langkah2', alt: 'Tim Klinik Matras memeriksa kasur di workshop', badge: 'Pernah diliput CUANBOS Trans7' },
          { title: <>Dijemput, <Hl>diantar lagi</Hl></>, text: `Dikerjakan ${FACTS.days}. Antar-jemput gratis untuk ${FACTS.freeShipArea}.`, photo: 'langkah3', alt: 'Mobil Klinik Matras mengantar kasur ke rumah pelanggan' },
        ]} />
      </Screen>

      <Screen><ReviewBlock reviews={[REVIEWS.hidajat, REVIEWS.sudarsono, REVIEWS.rifky]} title={<>Kata <Serif>pelanggan.</Serif></>} /><div className="mt-12"><ConceptLine /></div></Screen>

      <Screen tone="grey">
        <Reveal><Eyebrow>Pertanyaan umum</Eyebrow><h2 className="lp-h2 max-w-3xl">Masih <Serif>ragu?</Serif></h2></Reveal>
        <Faq items={FAQ} />
      </Screen>

      <Screen>
        <Split photo={<Photo name="workshop" alt="Workshop Klinik Matras di Depok, kasur selesai dan tim bekerja" />}>
          <Eyebrow>Lokasi dan jam</Eyebrow>
          <h2 className="lp-h2">Workshop dan kantor di <Serif>Depok.</Serif></h2>
          <Lead className="mt-3">Mau datang dan lihat langsung? Bisa, kabari dulu lewat WA. Chat dibalas {FACTS.hours}.</Lead>
        </Split>
      </Screen>

      <CtaRibbon title={<>Kasurmu kami <Serif>jemput</Serif> minggu ini?</>} sub={`Chat dibalas ${FACTS.hours}.`} note={<HealthNote short className="!text-white/70" />}>
        <HeroWaButton buttonId="ortho-hot-a-closing" placement="cta" eventLabel="Landing Ortho Hot A - CTA Penutup" label="Booking lewat WA" message={MSG} className="w-full sm:w-auto" />
      </CtaRibbon>

      <FloatingWa sentinelRef={hero} labelMobile="Booking lewat WA" labelDesktop="Booking lewat WA" buttonId="ortho-hot-a-floating" placement="floating" eventLabel="Landing Ortho Hot A - Floating" message={MSG} />
    </LandingShell>
  );
};

export default LandingHotA;
