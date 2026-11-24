import React from 'react';
import { useSEO } from '../../hooks/useSEO';
import {
  LandingShell, FloatingWa, WaButton, HeroWaButton, PhotoHero, TrustStrip, CaseStrip,
  Screen, Eyebrow, Lead, Reveal, Photo, Split, ZigZag, PriceCard, FactsBento, ReviewBlock, Faq,
  CtaRibbon, HealthNote, Serif, Hl, BentoCard,
} from '../../components/landing/LandingKit';
import { FACTS, PAIRS, REVIEWS } from '../../components/landing/landingData';

// HOT A (MOCKUP): harga mulai dan slot. Satu tujuan: klik WA.
const MSG = 'Halo Klinik Matras, saya mau tanya harga service kasur dan slot jemput terdekat.';

const FAQ: Array<[string, string]> = [
  ['Berapa lama pengerjaannya?', `Dikerjakan ${FACTS.days}.`],
  ['Antar-jemputnya sampai mana?', `Gratis untuk ${FACTS.freeShipArea}.`],
  ['Garansinya bagaimana?', `Garansi Klinik Matras: Upgrade ${FACTS.warrantyUpgrade}, Service ${FACTS.warrantyService}.`],
  ['Cara mulainya gimana?', 'Chat WA dan kirim foto kasurmu. Kami cek, kasih saran dan harga pastinya.'],
  ['Bisa datang langsung ke workshop?', 'Bisa. Workshop dan kantor kami di Depok. Kabari dulu lewat WA ya.'],
];

const LandingHotA: React.FC = () => {
  useSEO({
    title: 'Service Kasur Depok, Cek Harga dan Slot Jemput',
    description: `Service kasur mulai dari ${FACTS.priceService}. Jemput-antar gratis, dikerjakan ${FACTS.days}. Tanya harga dan slot lewat WhatsApp.`,
    path: '/service-kasur-depok',
    noindex: true,
  });

  return (
    <LandingShell>
      <PhotoHero
        pill="Depok, Jabodetabek, Bandung"
        title={<>Service kasur di Depok? Cek <Serif>harga</Serif> dan slot jemput</>}
        lead={`Service kasur mulai dari ${FACTS.priceService}. Dijemput gratis, dikerjakan ${FACTS.days}.`}
        thumb={PAIRS.p10}
        checks={['Antar-jemput gratis', 'Garansi sampai 20 tahun', `Selesai ${FACTS.days}`]}
        actions={<WaButton buttonId="ortho-hot-a-hero" placement="hero" eventLabel="Landing Ortho Hot A - Hero" label="Tanya harga dan jadwal" message={MSG} className="w-full sm:w-auto" />}
      />

      <TrustStrip />

      <Screen tone="grey">
        <Reveal><Eyebrow>Harga</Eyebrow><h2 className="lp-h2 max-w-3xl">Harga <Hl>jelas</Hl> dari awal.</h2></Reveal>
        <div className="mt-10 grid gap-3 md:gap-5 md:grid-cols-2">
          <PriceCard>
            <WaButton buttonId="ortho-hot-a-pricing" placement="pricing" eventLabel="Landing Ortho Hot A - Pricing" label="Minta harga pastinya" message={MSG} className="w-full sm:w-auto !bg-white !text-[#0b2a6f]" />
          </PriceCard>
          <Reveal delay={90} className="h-full">
            <BentoCard className="h-full gap-6 !bg-white dark:!bg-[#1c1c1e]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[.14em] text-[#1660cf] dark:text-[#4d94ff]">Upgrade</p>
                <p className="mt-2 text-3xl md:text-4xl font-bold tracking-tight leading-tight">Garansi Klinik Matras {FACTS.warrantyUpgrade}</p>
                <p className="mt-3 text-lg text-[#6e6e73] dark:text-[#a1a1a6] leading-snug">Kasur lamamu dirombak jadi lebih kokoh. Otomatis paket Premium. Harga setelah kami lihat kondisi kasurmu.</p>
              </div>
              <p className="text-base font-semibold">Service: garansi {FACTS.warrantyService}</p>
            </BentoCard>
          </Reveal>
        </div>
      </Screen>

      <Screen>
        <Reveal><Eyebrow>Jadwal</Eyebrow><h2 className="lp-h2 max-w-3xl">Slot jemput <Serif>terdekat?</Serif></h2>
          <Lead className="mt-4 max-w-2xl">Jadwal menyesuaikan antrean workshop. Tanya lewat WA, kami kabari yang masih kosong.</Lead></Reveal>
        <ZigZag steps={[
          { title: <>Chat dan <Hl>kirim foto</Hl> kasur</>, text: 'Foto dari samping dan dari atas sudah cukup.', photo: 'langkah1', alt: 'Kasur di ruangan rumah yang difoto untuk dikirim ke tim' },
          { title: <>Sepakat <Hl>harga dan jadwal</Hl></>, text: 'Tim kami mengerjakan di workshop setelah semuanya cocok.', photo: 'langkah2', alt: 'Tukang memotong busa di workshop Klinik Matras' },
          { title: <>Dikerjakan, <Hl>diantar lagi</Hl></>, text: `Dikerjakan ${FACTS.days}. Antar-jemput gratis untuk ${FACTS.freeShipArea}.`, photo: 'langkah3', alt: 'Mobil Klinik Matras mengantar kasur' },
        ]} />
      </Screen>

      <Screen tone="grey"><FactsBento /></Screen>

      <CaseStrip pairs={[PAIRS.p11, PAIRS.p6, PAIRS.p7]} title={<>Sudah banyak yang <Serif>pakai.</Serif></>} />

      <Screen tone="grey"><ReviewBlock reviews={[REVIEWS.hidajat]} title={<>Kata <Serif>pelanggan.</Serif></>} /></Screen>

      <Screen>
        <Reveal><Eyebrow>Pertanyaan umum</Eyebrow><h2 className="lp-h2 max-w-3xl">Masih <Serif>ragu?</Serif></h2></Reveal>
        <Faq items={FAQ} />
      </Screen>

      <Screen tone="grey">
        <Split photo={<Photo name="workshop" alt="Workshop Klinik Matras di Depok, kasur selesai dan tim bekerja" />}>
          <Eyebrow>Lokasi dan jam</Eyebrow>
          <h2 className="lp-h2">Workshop dan kantor di <Serif>Depok.</Serif></h2>
          <Lead className="mt-4">Mau datang dan lihat langsung? Bisa, kabari dulu lewat WA. Chat dibalas {FACTS.hours}.</Lead>
        </Split>
      </Screen>

      <CtaRibbon title={<>Siap jadwalkan <Serif>jemput?</Serif></>} sub="Tanya harga dan slot, kami balas di jam kerja." note={<HealthNote short className="!text-white/70" />}>
        <HeroWaButton buttonId="ortho-hot-a-closing" placement="cta" eventLabel="Landing Ortho Hot A - CTA Penutup" label="Tanya harga dan jadwal" message={MSG} className="w-full sm:w-auto" />
      </CtaRibbon>

      <FloatingWa mode="bar" buttonId="ortho-hot-a-floating" placement="floating" eventLabel="Landing Ortho Hot A - Floating" label="Chat WA: harga dan jadwal" message={MSG} />
    </LandingShell>
  );
};

export default LandingHotA;
