import React from 'react';
import { useSEO } from '../../hooks/useSEO';
import {
  LandingShell, FloatingWa, WaButton, Section, H2, Muted, PairCard, GalleryLink, RatingLine,
  ReviewBlock, WarrantyBadges, Steps, FactChips, HealthNote, CheckItem, useHeroRef,
} from '../../components/landing/LandingKit';
import { FACTS, PAIRS, REVIEWS } from '../../components/landing/landingData';

// COLD A: untuk orang yang sadar badannya pegal tapi belum kenal kita.
// Satu tujuan: klik WA (kirim foto kasur).
const MSG = 'Halo Klinik Matras, badan saya sering pegal waktu bangun tidur. Saya mau cek kondisi kasur saya, ini fotonya.';

const LandingColdA: React.FC = () => {
  useSEO({
    title: 'Cek Kasurmu Dulu',
    description: 'Bangun tidur badan pegal dan sakit pinggang? Cek dulu kasurmu. Kirim foto lewat WhatsApp, tim Klinik Matras bantu cek.',
    path: '/kasur-orthopedic',
    noindex: true,
  });
  const hero = useHeroRef();

  return (
    <LandingShell>
      <section ref={hero as React.RefObject<HTMLElement>} className="pt-8 pb-10 md:pt-14 md:pb-16">
        <div className="max-w-5xl mx-auto px-5 grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-slate-900 dark:text-white">
              Bangun tidur badan pegal &amp; sakit pinggang? Coba cek kasurmu dulu
            </h1>
            <Muted className="mt-4">
              Kasur yang amblas di tengah bisa ikut bikin badan nggak ketopang. Kirim foto kasurmu, kami bantu cek lewat WA.
            </Muted>
            <div className="mt-6">
              <WaButton
                buttonId="ortho-cold-a-hero" placement="hero" eventLabel="Landing Ortho Cold A - Hero"
                label="Cek kasurku lewat WA" message={MSG} className="w-full sm:w-auto"
              />
            </div>
            <RatingLine className="mt-4" />
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Chat dibalas {FACTS.hours}</p>
          </div>
          <PairCard pair={PAIRS.p10} eager />
        </div>
      </section>

      <Section tone="soft">
        <H2>Kasurmu begini nggak?</H2>
        <ul className="mt-6 grid gap-4 list-none p-0 m-0 max-w-2xl">
          <CheckItem>Ada cekungan di tengah, apalagi di bagian pinggul.</CheckItem>
          <CheckItem>Kamu sering geser ke pinggir biar nggak &ldquo;tenggelam&rdquo;.</CheckItem>
          <CheckItem>Bangun tidur pegal, siangnya mendingan.</CheckItem>
          <CheckItem>Kasur udah dibalik-balik, tetap aja nggak enak.</CheckItem>
        </ul>
        <p className="mt-6 text-lg font-bold text-slate-900 dark:text-white">Kalau kamu centang dua atau lebih, kasurmu layak dicek.</p>
      </Section>

      <Section>
        <H2>Kasur pelanggan, sebelum dan sesudah</H2>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          <PairCard pair={PAIRS.p11} />
          <PairCard pair={PAIRS.p6} />
          <PairCard pair={PAIRS.p7} />
        </div>
        <div className="mt-6"><GalleryLink /></div>
      </Section>

      <Section tone="soft">
        <H2>Dua pilihan, kami bantu pilihkan</H2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-bg-light dark:bg-bg-dark">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Service</h3>
            <Muted className="mt-2">Fondasi yang amblas kami perbaiki. Kasurnya tetap kasurmu.</Muted>
            <p className="mt-3 font-bold text-primary dark:text-primary-light">Garansi Klinik Matras {FACTS.warrantyService}</p>
          </div>
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-bg-light dark:bg-bg-dark">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Upgrade</h3>
            <Muted className="mt-2">Kasur lamamu dirombak jadi lebih kokoh dan lebih menopang badan. Otomatis paket Premium.</Muted>
            <p className="mt-3 font-bold text-primary dark:text-primary-light">Garansi Klinik Matras {FACTS.warrantyUpgrade}</p>
          </div>
        </div>
        <WarrantyBadges className="mt-6" />
        <p className="mt-6 text-xl font-extrabold text-slate-900 dark:text-white">Service kasur mulai dari {FACTS.priceService}</p>
        <Muted className="mt-2">Bingung pilih yang mana? Wajar kok. Dari foto kasurmu, tim kami bantu pilih.</Muted>
      </Section>

      <Section>
        <H2>Caranya gampang</H2>
        <Steps steps={[
          'Kirim foto kasur lewat WA.',
          'Kami cek, kasih saran dan harga pastinya.',
          `Kasur dijemput gratis, dikerjakan ${FACTS.days}, lalu diantar lagi.`,
        ]} />
        <FactChips className="mt-6" />
      </Section>

      <Section tone="soft">
        <ReviewBlock reviews={[REVIEWS.ratna, REVIEWS.jannah, REVIEWS.farhan]} />
      </Section>

      <Section>
        <HealthNote />
      </Section>

      <Section tone="soft" className="text-center">
        <H2>Kasurmu masih bisa diselamatkan nggak? Tanya dulu aja.</H2>
        <Muted className="mt-3">Kirim fotonya, kami bantu cek.</Muted>
        <div className="mt-6">
          <WaButton
            buttonId="ortho-cold-a-cta" placement="cta" eventLabel="Landing Ortho Cold A - CTA"
            label="Kirim foto kasurku" message={MSG} className="w-full sm:w-auto"
          />
        </div>
      </Section>

      <FloatingWa
        mode="after-hero" sentinelRef={hero}
        buttonId="ortho-cold-a-floating" placement="floating" eventLabel="Landing Ortho Cold A - Floating"
        label="Chat WA" message={MSG}
      />
    </LandingShell>
  );
};

export default LandingColdA;
