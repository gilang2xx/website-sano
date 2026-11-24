import React from 'react';
import { useSEO } from '../../hooks/useSEO';
import {
  LandingShell, FloatingWa, WaButton, Section, H2, Muted, PairCard, GalleryLink, RatingLine,
  ReviewBlock, WarrantyBadges, Steps, FactChips, HealthNote,
} from '../../components/landing/LandingKit';
import { FACTS, PAIRS, REVIEWS } from '../../components/landing/landingData';

// HOT A: sudah siap chat, butuh harga mulai dan jadwal. Satu tujuan: klik WA.
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
      <section className="pt-8 pb-10 md:pt-14 md:pb-14">
        <div className="max-w-5xl mx-auto px-5">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-slate-900 dark:text-white max-w-3xl">
            Service kasur di Depok? Cek harga dan slot jemput
          </h1>
          <p className="mt-5 text-3xl md:text-4xl font-extrabold text-primary dark:text-primary-light">
            Service kasur mulai dari {FACTS.priceService}
          </p>
          <FactChips className="mt-5" />
          <div className="mt-6">
            <WaButton
              buttonId="ortho-hot-a-hero" placement="hero" eventLabel="Landing Ortho Hot A - Hero"
              label="Tanya harga dan jadwal" message={MSG} className="w-full sm:w-auto"
            />
          </div>
          <RatingLine className="mt-4" />
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Chat dibalas {FACTS.hours}</p>
        </div>
      </section>

      <Section tone="soft">
        <H2>Harga dan garansi</H2>
        <Muted className="mt-3 max-w-2xl">
          Service kasur mulai dari {FACTS.priceService}. Harga pastinya tergantung kondisi kasur, jadi kirim fotonya dan kami kasih angkanya. Mau upgrade? Harganya kami bahas setelah lihat kondisi kasurmu.
        </Muted>
        <WarrantyBadges className="mt-6" />
        <div className="mt-6">
          <WaButton
            buttonId="ortho-hot-a-pricing" placement="pricing" eventLabel="Landing Ortho Hot A - Pricing"
            label="Minta harga pastinya" message={MSG} className="w-full sm:w-auto"
          />
        </div>
      </Section>

      <Section>
        <H2>Slot jemput</H2>
        <Muted className="mt-3 max-w-2xl">
          Jadwal jemput menyesuaikan antrean workshop. Tanya slot terdekat lewat WA, kami kabari yang masih kosong.
        </Muted>
      </Section>

      <Section tone="soft">
        <H2>Prosesnya</H2>
        <Steps steps={[
          'Chat dan kirim foto kasur.',
          'Sepakat harga dan jadwal jemput.',
          `Dikerjakan ${FACTS.days}, lalu diantar lagi.`,
        ]} />
      </Section>

      <Section>
        <H2>Sudah banyak yang pakai</H2>
        <div className="mt-6 grid gap-5 md:grid-cols-2 md:items-start">
          <PairCard pair={PAIRS.p10} />
          <div>
            <ReviewBlock reviews={[REVIEWS.jannah]} title="Kata pelanggan" />
          </div>
        </div>
        <div className="mt-6"><GalleryLink /></div>
      </Section>

      <Section tone="soft">
        <H2>Lokasi dan jam</H2>
        <Muted className="mt-3 max-w-2xl">
          Workshop dan kantor kami di Depok. Mau datang dan lihat langsung? Bisa, kabari dulu lewat WA. Jemput-antar gratis untuk {FACTS.freeShipArea}. Chat dibalas {FACTS.hours}.
        </Muted>
        <HealthNote short className="mt-6 max-w-xl" />
      </Section>

      <FloatingWa
        mode="bar"
        buttonId="ortho-hot-a-floating" placement="floating" eventLabel="Landing Ortho Hot A - Floating"
        label="Chat WA: harga dan jadwal" message={MSG}
      />
    </LandingShell>
  );
};

export default LandingHotA;
