import React from 'react';
import { useSEO } from '../../hooks/useSEO';
import {
  LandingShell, FloatingWa, WaButton, TextLink, Screen, Eyebrow, Lead, Reveal, BeforeAfterSlider,
  BentoCard, ReviewBlock, Steps, HealthNote,
} from '../../components/landing/LandingKit';
import { FACTS, PAIRS, REVIEWS } from '../../components/landing/landingData';

// HOT A (MOCKUP): harga mulai dan slot. Satu tujuan: klik WA.
const MSG = 'Halo Klinik Matras, saya mau tanya harga service kasur dan slot jemput terdekat.';

const LandingHotA: React.FC = () => {
  useSEO({
    title: 'Service Kasur Depok, Cek Harga dan Slot Jemput',
    description: `Service kasur mulai dari ${FACTS.priceService}. Jemput-antar gratis, dikerjakan ${FACTS.days}. Tanya harga dan slot lewat WhatsApp.`,
    path: '/service-kasur-depok',
    noindex: true,
  });

  return (
    <LandingShell>
      <section className="pt-14 md:pt-24 pb-10 md:pb-16 text-center bg-white dark:bg-black">
        <div className="max-w-4xl mx-auto px-5">
          <h1 className="lp-big">Service kasur di Depok? Cek harga dan slot jemput</h1>
          <p className="mt-6 lp-h2 text-[#1660cf] dark:text-[#4d94ff]">Mulai dari {FACTS.priceService}</p>
          <Lead className="mt-3">Dijemput gratis, dikerjakan {FACTS.days}.</Lead>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
            <WaButton buttonId="ortho-hot-a-hero" placement="hero" eventLabel="Landing Ortho Hot A - Hero" label="Tanya harga dan jadwal" message={MSG} className="w-full sm:w-auto" />
          </div>
          <p className="mt-5 text-sm text-[#6e6e73] dark:text-[#a1a1a6]">5,0 di Google dari {FACTS.reviewCount} ulasan. Chat dibalas {FACTS.hours}.</p>
        </div>
      </section>

      <Screen tone="grey">
        <Reveal><Eyebrow>Harga</Eyebrow><h2 className="lp-h2 max-w-3xl">Service kasur mulai dari {FACTS.priceService}.</h2>
          <Lead className="mt-4 max-w-2xl">Harga pastinya tergantung kondisi kasur. Kirim foto, kami kasih angkanya. Mau upgrade? Kami bahas setelah lihat kasurmu.</Lead></Reveal>
        <div className="mt-10 grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-4">
          <Reveal><BentoCard tone="navy" className="h-full min-h-[170px]"><p className="text-sm font-semibold opacity-80">Garansi Klinik Matras</p><div><div className="lp-num !text-[clamp(2.6rem,10vw,4rem)]">20</div><p className="opacity-80">tahun, Upgrade</p></div></BentoCard></Reveal>
          <Reveal delay={70}><BentoCard className="h-full min-h-[170px]"><p className="text-sm font-semibold text-[#1660cf] dark:text-[#4d94ff]">Garansi Klinik Matras</p><div><div className="lp-num !text-[clamp(2.6rem,10vw,4rem)]">10</div><p className="opacity-70">tahun, Service</p></div></BentoCard></Reveal>
          <Reveal delay={140}><BentoCard tone="lime" className="h-full min-h-[170px]"><p className="text-sm font-semibold">Pengerjaan</p><div className="lp-num !text-[clamp(2.4rem,9vw,3.6rem)]">2-3<span className="text-xl font-bold ml-1">hari</span></div></BentoCard></Reveal>
          <Reveal delay={210}><BentoCard className="h-full min-h-[170px]"><p className="text-sm font-semibold text-[#6e6e73] dark:text-[#a1a1a6]">Jemput-antar gratis</p><p className="text-xl font-bold tracking-tight leading-tight">Jabodetabek dan Bandung</p></BentoCard></Reveal>
        </div>
        <Reveal><div className="mt-8"><WaButton buttonId="ortho-hot-a-pricing" placement="pricing" eventLabel="Landing Ortho Hot A - Pricing" label="Minta harga pastinya" message={MSG} className="w-full sm:w-auto" /></div></Reveal>
      </Screen>

      <Screen>
        <Reveal><Eyebrow>Jadwal</Eyebrow><h2 className="lp-h2 max-w-3xl">Slot jemput terdekat?</h2>
          <Lead className="mt-4 max-w-2xl">Jadwal menyesuaikan antrean workshop. Tanya lewat WA, kami kabari yang masih kosong.</Lead></Reveal>
        <Steps steps={['Chat dan kirim foto kasur.', 'Sepakat harga dan jadwal jemput.', `Dikerjakan ${FACTS.days}, lalu diantar lagi.`]} />
      </Screen>

      <section className="bg-[#f5f5f7] dark:bg-[#0a0a0a] pt-16 md:pt-28 pb-16 md:pb-28">
        <div className="max-w-5xl mx-auto px-5"><Reveal><Eyebrow>Hasil asli</Eyebrow><h2 className="lp-h2 max-w-3xl">Sudah banyak yang pakai.</h2></Reveal></div>
        <div className="max-w-6xl mx-auto md:px-5 mt-10"><Reveal><BeforeAfterSlider pair={PAIRS.p10} /></Reveal></div>
        <div className="max-w-5xl mx-auto px-5 mt-6"><TextLink to="/before-after">Lihat semua hasil before-after</TextLink></div>
        <div className="max-w-5xl mx-auto px-5 mt-16"><ReviewBlock reviews={[REVIEWS.jannah]} title="Kata pelanggan." /></div>
      </section>

      <Screen>
        <Reveal><Eyebrow>Lokasi dan jam</Eyebrow><h2 className="lp-h2 max-w-3xl">Workshop dan kantor di Depok.</h2>
          <Lead className="mt-4 max-w-2xl">Mau datang dan lihat langsung? Bisa, kabari dulu lewat WA. Jemput-antar gratis untuk {FACTS.freeShipArea}. Chat dibalas {FACTS.hours}.</Lead>
          <HealthNote short className="mt-8 max-w-xl" /></Reveal>
      </Screen>

      <FloatingWa mode="bar" buttonId="ortho-hot-a-floating" placement="floating" eventLabel="Landing Ortho Hot A - Floating" label="Chat WA: harga dan jadwal" message={MSG} />
    </LandingShell>
  );
};

export default LandingHotA;
