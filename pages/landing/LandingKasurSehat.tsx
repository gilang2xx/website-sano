import React from 'react';
import { useSEO } from '../../hooks/useSEO';
import {
  LandingShell, FloatingWa, WaButton, HeroWaButton, PhotoHero, TrustStrip, BigCase,
  Screen, Eyebrow, Lead, Reveal, Photo, Split, ReviewBlock, Faq,
  CtaRibbon, HealthNote, Serif, Hl, BentoCard, useHeroRef,
} from '../../components/landing/LandingKit';
import { FACTS, PAIRS, REVIEWS } from '../../components/landing/landingData';

// Halaman ke-4 (MOCKUP): penjelas Konsep Kasur Sehat. Satu tujuan tetap klik WA.
// Acuan: DIRA_landing-kasur-sehat-paper-2026-11-25.html. Contoh "bahu dan pinggul waktu tidur miring"
// BELUM disetujui owner, sengaja tidak dipasang. Saraf dan pembuluh darah tidak disebut.
const MSG = 'Halo Klinik Matras, saya baca konsep Kasur Sehat dan mau cek kasur saya. Bisa dibantu pilih service atau upgrade?';

const LAYERS: Array<[string, string]> = [
  ['Lapisan nyaman', 'Sesuai tier berat badan'],
  ['Rebonded foam', 'Transisi, biar kerasnya bertahap'],
  ['PE Foam', 'Lapisan penyangga'],
  ['Ultra durable frame', 'Menambah kokoh'],
  ['Per', 'Penopang utama'],
];

const TIERS: Array<[string, string, string]> = [
  ['LIGHT', '0-50 kg', '2-4'],
  ['NORMAL', '51-70 kg', '3-5'],
  ['STRONG', '71-100 kg', '4-6'],
  ['HEAVY', '101-125 kg', '5-7'],
  ['EXTRA HEAVY', 'lebih dari 125 kg', 'maks 8'],
];

const CAUSES: Array<[string, string]> = [
  ['Terlalu empuk', 'Lapisan yang terlalu tebal atau terlalu empuk bikin posisi tidur tenggelam. Busa atas yang sudah capek juga begitu. Tulang dan sendi jadi tidak tertopang rata.'],
  ['Terlalu keras', 'Kasur yang terlalu keras bisa ikut menekan sendi dan titik tumpu tubuh.'],
  ['Label tanpa ukuran', 'Soft, medium, firm di toko tidak ada ukurannya. Medium buat badan 50 kg dan 100 kg jelas beda rasanya.'],
];

const KASUR_SEHAT_FAQ: Array<[string, string]> = [
  ['Harus beli kasur baru biar dapat kasur sehat?', 'Tidak. Selama rangkanya masih bisa dipakai, kasurmu yang sekarang kami bikin ulang lewat service atau upgrade.'],
  ['Service atau upgrade, bedanya apa?', 'Service memperbaiki bagian yang rusak. Upgrade mengganti fondasi dan lapisan ke susunan SFS, makanya garansinya hingga 20 tahun. Bingung pilih yang mana? Kirim foto kasurnya, kami bantu cek.'],
  ['Kasur sehat bisa menyembuhkan nyeri?', 'Tidak, kasur bukan obat. Kasur yang pas bisa ikut berperan bikin tidur lebih nyaman. Kalau nyerinya berat atau menetap, periksa ke dokter.'],
];

const LandingKasurSehat: React.FC = () => {
  useSEO({
    title: 'Konsep Kasur Sehat',
    description: 'Kasur empuk atau keras belum tentu sehat buat tubuh. Yang pas itu fondasi kokoh dan lapisan sesuai badanmu. Kasur lamamu bisa dibikin begitu lewat service atau upgrade kasur sehat.',
    path: '/kasur-sehat',
    noindex: true,
  });

  const hero = useHeroRef();

  return (
    <LandingShell landingId="LP-KASUR-SEHAT" audience="cold">
      <PhotoHero
        ref={hero}
        pill="Jabodetabek & Bandung"
        title={<>Kasur empuk atau keras <Serif>belum tentu sehat</Serif> buat tubuh.</>}
        lead="Terlalu empuk, badan tenggelam. Terlalu keras, sendi bisa ikut tertekan. Yang pas itu fondasi kokoh dan lapisan sesuai badanmu. Kasur lamamu bisa dibikin begitu lewat service atau upgrade kasur sehat."
        checks={['Antar-jemput gratis', 'Garansi hingga 10-20 tahun', `Selesai ${FACTS.days}`]}
        actions={<WaButton buttonId="kasur-sehat-hero" placement="hero" eventLabel="Landing Kasur Sehat - Hero" label="Cek kasurku lewat WA" message={MSG} className="w-full sm:w-auto" />}
      />

      <Screen>
        <Split photo={<Photo name="masalah" alt="Kasur lama yang kusam di meja workshop sebelum dikerjakan" className="aspect-[4/5]" />}>
          <Eyebrow>Yang sering terjadi</Eyebrow>
          <h2 className="lp-h2">Udah pilih yang empuk, kok tetap <Serif>nggak enak?</Serif></h2>
          <Lead className="mt-4">Ceritanya sering mirip. Waktu dicoba di toko, kasurnya empuk banget. Setahun dua tahun kemudian tengahnya mulai cekung, dan kasur dibalik tiap bulan biar rata lagi.</Lead>
          <Lead className="mt-3">Rasa empuk saja tidak cukup. Yang menentukan itu topangannya.</Lead>
        </Split>
      </Screen>

      <Screen tone="grey">
        <Reveal><Eyebrow>Penyebab</Eyebrow><h2 className="lp-h2 max-w-3xl">Kenapa terlalu empuk atau terlalu keras sama-sama <Hl>bikin nggak nyaman?</Hl></h2></Reveal>
        <div className="mt-7 grid gap-3 md:gap-5 md:grid-cols-3">
          {CAUSES.map(([t, x], i) => (
            <Reveal key={t} delay={i * 80} className="h-full">
              <BentoCard className="h-full gap-3 !bg-white dark:!bg-[#1c1c1e]">
                <p className="text-2xl md:text-3xl font-bold tracking-tight">{t}</p>
                <p className="text-base md:text-lg leading-snug text-[#6e6e73] dark:text-[#a1a1a6]">{x}</p>
              </BentoCard>
            </Reveal>
          ))}
        </div>
        <Reveal><div className="mt-8"><HealthNote /></div></Reveal>
      </Screen>

      <Screen>
        <Reveal><Eyebrow>Konsep Kasur Sehat</Eyebrow><h2 className="lp-h2 max-w-3xl">Dua pilar: <Serif>fondasi</Serif> dan <Serif>lapisan.</Serif></h2></Reveal>
        <div className="mt-7 grid gap-3 md:gap-5 md:grid-cols-2">
          <Reveal className="h-full">
            <BentoCard className="h-full gap-3">
              <p className="text-sm font-semibold uppercase tracking-[.14em] text-[#1660cf] dark:text-[#4d94ff]">Pilar 1</p>
              <p className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">Fondasi kokoh</p>
              <p className="text-lg leading-snug text-[#6e6e73] dark:text-[#a1a1a6]">Penurunannya terkendali, sekitar 1-2 cm. Badan tertopang, tidak tenggelam.</p>
            </BentoCard>
          </Reveal>
          <Reveal delay={90} className="h-full">
            <BentoCard className="h-full gap-3">
              <p className="text-sm font-semibold uppercase tracking-[.14em] text-[#1660cf] dark:text-[#4d94ff]">Pilar 2</p>
              <p className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">Lapisan sesuai berat badan</p>
              <p className="text-lg leading-snug text-[#6e6e73] dark:text-[#a1a1a6]">Bahan, density busa, dan tebal lapisan dipilih dari berat badan. Empuknya pas, bukan kira-kira.</p>
            </BentoCard>
          </Reveal>
        </div>
      </Screen>

      <Screen tone="grey">
        <Reveal><Eyebrow>Cara kami membuatnya</Eyebrow><h2 className="lp-h2 max-w-3xl">Susunan <Serif>SFS</Serif> (Sano Foundation System).</h2><Lead className="mt-3">Dari atas ke bawah:</Lead></Reveal>
        <ol className="mt-6 grid gap-2 list-none m-0 p-0 max-w-2xl">
          {LAYERS.map(([name, note], i) => (
            <li key={name} className={`flex items-center gap-4 rounded-2xl px-5 py-4 ${i === 0 ? 'text-white' : 'bg-white dark:bg-[#1c1c1e]'}`} style={i === 0 ? { backgroundColor: '#1660cf' } : undefined}>
              <span className={`text-sm font-bold w-6 ${i === 0 ? 'text-white/80' : 'text-[#6e6e73] dark:text-[#a1a1a6]'}`}>{i + 1}</span>
              <span className="flex flex-col"><span className="text-lg md:text-xl font-semibold tracking-tight">{name}</span><span className={`text-sm md:text-base ${i === 0 ? 'text-white/85' : 'text-[#6e6e73] dark:text-[#a1a1a6]'}`}>{note}</span></span>
            </li>
          ))}
        </ol>

        <div className="mt-12">
          <p className="text-xl md:text-2xl font-semibold tracking-tight max-w-2xl">Lapisan nyaman ada 5 tier. Makin berat beban yang ditopang, makin tebal lapisannya.</p>
          <div className="mt-5 overflow-x-auto rounded-2xl bg-white dark:bg-[#1c1c1e]">
            <table className="w-full text-left text-base md:text-lg">
              <caption className="sr-only">Lima tier lapisan nyaman: berat badan dan tebal lapisan</caption>
              <thead><tr className="text-sm uppercase tracking-wide text-[#6e6e73] dark:text-[#a1a1a6]"><th scope="col" className="px-4 py-3 font-semibold">Tier</th><th scope="col" className="px-4 py-3 font-semibold">Berat badan</th><th scope="col" className="px-4 py-3 font-semibold">Tebal lapisan (cm)</th></tr></thead>
              <tbody>
                {TIERS.map(([tier, kg, cm]) => (
                  <tr key={tier} className="border-t border-black/5 dark:border-white/10"><th scope="row" className="px-4 py-3 font-bold tracking-tight">{tier}</th><td className="px-4 py-3 whitespace-nowrap">{kg}</td><td className="px-4 py-3 whitespace-nowrap">{cm}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-lg text-[#6e6e73] dark:text-[#a1a1a6] max-w-2xl">Tidur berdua? Kirim berat badan masing-masing, nanti kami bantu pilih.</p>
          <div className="mt-5"><WaButton buttonId="kasur-sehat-tier" placement="service-card" eventLabel="Landing Kasur Sehat - Tier" label="Cek tier-ku lewat WA" message={MSG} className="w-full sm:w-auto" /></div>
        </div>
      </Screen>

      <Screen>
        <Reveal><Eyebrow>Dua jalan</Eyebrow><h2 className="lp-h2 max-w-3xl">Tidak perlu beli kasur lain. <Serif>Kasurmu yang kami bikin ulang.</Serif></h2></Reveal>
        <div className="mt-7 grid gap-3 md:gap-5 md:grid-cols-2">
          <Reveal className="h-full">
            <BentoCard className="h-full gap-3">
              <p className="text-sm font-semibold uppercase tracking-[.14em] text-[#1660cf] dark:text-[#4d94ff]">Service</p>
              <p className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">Mulai {FACTS.priceService}</p>
              <p className="text-lg leading-snug text-[#6e6e73] dark:text-[#a1a1a6]">Memperbaiki bagian yang rusak. Garansi Klinik Matras hingga {FACTS.warrantyService}.</p>
            </BentoCard>
          </Reveal>
          <Reveal delay={90} className="h-full">
            <BentoCard className="h-full gap-3">
              <p className="text-sm font-semibold uppercase tracking-[.14em] text-[#1660cf] dark:text-[#4d94ff]">Upgrade</p>
              <p className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">Susunan SFS</p>
              <p className="text-lg leading-snug text-[#6e6e73] dark:text-[#a1a1a6]">Fondasi dan lapisan diganti ke susunan SFS. Garansi Klinik Matras hingga {FACTS.warrantyUpgrade}. Harga setelah kami lihat kondisi kasurmu.</p>
            </BentoCard>
          </Reveal>
        </div>
        <ul className="mt-7 grid gap-2 text-lg list-none m-0 p-0 max-w-2xl">
          <li><Hl>Kirim foto kasur</Hl> dan berat badan lewat WA.</li>
          <li>Kami jemput gratis ({FACTS.freeShipArea}).</li>
          <li>Dikerjakan {FACTS.days} di workshop Depok, lalu diantar balik.</li>
        </ul>
        <div className="mt-6"><WaButton buttonId="kasur-sehat-pricing" placement="pricing" eventLabel="Landing Kasur Sehat - Dua Jalan" label="Tanya service atau upgrade" message={MSG} className="w-full sm:w-auto" /></div>
      </Screen>

      <div className="pt-4 md:pt-8 bg-white dark:bg-black"><BigCase pair={PAIRS.culm} others={[PAIRS.world, PAIRS.thera, PAIRS.heir]} title={<>Hasilnya bisa kamu <Serif>lihat sendiri.</Serif></>} /></div>

      <TrustStrip />

      <Screen><ReviewBlock reviews={REVIEWS} title={<>Kata <Serif>pelanggan.</Serif></>} /></Screen>

      <Screen tone="grey">
        <Reveal><Eyebrow>Pertanyaan umum</Eyebrow><h2 className="lp-h2 max-w-3xl">Masih <Serif>ragu?</Serif></h2></Reveal>
        <Faq items={KASUR_SEHAT_FAQ} />
      </Screen>

      <Screen>
        <Split photo={<div className="relative"><Photo name="workshop" alt="Workshop Klinik Matras di Depok saat diliput kru televisi" sizes="(min-width:768px) 420px, 92vw" /><span className="absolute left-3 bottom-3 text-xs font-semibold px-3 py-1.5 rounded-full bg-white text-[#0b2a6f] shadow">Workshop kami di Depok, saat diliput CUANBOS Trans7</span></div>}>
          <Eyebrow>Lokasi dan jam</Eyebrow>
          <h2 className="lp-h2">Workshop dan kantor di <Serif>Depok.</Serif></h2>
          <Lead className="mt-3">Mau datang dan lihat cara kerjanya? Bisa, kabari dulu lewat WA. Chat dibalas {FACTS.hours}.</Lead>
        </Split>
      </Screen>

      <CtaRibbon title={<>Kirim foto kasurmu, kami bantu <Serif>cek.</Serif></>} sub={`Chat dibalas ${FACTS.hours}.`} note={<HealthNote short className="!text-white/70" />}>
        <HeroWaButton buttonId="kasur-sehat-closing" placement="cta" eventLabel="Landing Kasur Sehat - CTA Penutup" label="Cek kasurku lewat WA" message={MSG} className="w-full sm:w-auto" />
      </CtaRibbon>

      <FloatingWa sentinelRef={hero} buttonId="kasur-sehat-floating" placement="floating" eventLabel="Landing Kasur Sehat - Floating" message={MSG} labelMobile="Cek kasurku lewat WA" labelDesktop="Cek kasurku lewat WA" />
    </LandingShell>
  );
};

export default LandingKasurSehat;
