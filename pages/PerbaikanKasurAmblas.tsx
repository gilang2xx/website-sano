import React from 'react';
import { Link } from 'react-router-dom';
import {
  MessageCircle, Camera, ChevronRight, ArrowRight, Search, Hammer, Wrench, Layers, Crown, Settings,
} from 'lucide-react';
import { buildWaHref } from '../utils/attribution';
import { useSEO } from '../hooks/useSEO';

// Halaman problem-to-solution untuk "perbaikan kasur amblas".
//
// SUMBER ISI (tidak ada klaim baru): daftar layanan & deskripsinya = pages/KlinikMatras.tsx;
// alur kerja = pages/Home.tsx (Konsultasi -> Estimasi -> Jemput -> Proses -> Pembayaran -> Antar);
// standar penurunan fondasi maks. ~1 cm & pilihan perbaikan/upgrade = artikel pilar
// "Panduan Lengkap Kasur Sehat" dan "Mengenal Struktur Kasur"; langkah diagnosis
// (tingkat tenggelam, kekerasan, elastisitas, usia bahan; berat badan) = knowledge base
// owner (skill sano-care-matras-sehat-knowledge).
// SENGAJA TIDAK ADA: harga (lihat /pricelist), durasi, garansi berangka, area layanan,
// hasil pelanggan, atau klaim medis. Jangan menambahkannya tanpa konfirmasi owner.

const WA_MAIN = 'Halo Sano, kasur saya amblas. Saya ingin konsultasi dan cek kondisi kasur (saya kirim foto).';

const symptoms = [
  { title: 'Permukaan turun atau bergelombang', desc: 'Bagian yang paling sering dipakai terlihat cekung atau permukaan terasa tidak rata.' },
  { title: 'Kasur terasa miring atau tidak kokoh', desc: 'Kasur tidak lagi terasa stabil saat dipakai atau posisinya condong ke satu sisi.' },
  { title: 'Terasa terlalu tenggelam', desc: 'Tubuh terasa masuk terlalu dalam ke kasur, tidak lagi tertopang dengan stabil.' },
  { title: 'Busa bagian atas kempis', desc: 'Lapisan atas sudah menipis sehingga kenyamanannya berkurang.' },
];

const causes = [
  {
    title: 'Fondasi atau rangka yang melemah',
    desc: 'Fondasi adalah "jantung kasur" yang menahan beban tubuh. Bila kondisinya menurun, kasur bisa tenggelam dan tidak lagi memberi topangan yang stabil.',
  },
  {
    title: 'Per (pegas) yang sudah lelah',
    desc: 'Pada kasur berpegas (springbed), per yang kehilangan daya topangnya dapat membuat kasur turun atau berbunyi. Jenis dan kondisi per perlu diperiksa langsung.',
  },
  {
    title: 'Lapisan busa yang kempis',
    desc: 'Busa berfungsi mengatur kenyamanan dan distribusi tekanan. Busa yang sudah kempis membuat permukaan terasa cekung, meski fondasinya masih baik.',
  },
];

const options = [
  { icon: <Hammer />, title: 'Service Fondasi', desc: 'Perbaikan struktur dasar/rangka bawah kasur agar kembali kokoh dan tidak miring.' },
  { icon: <Wrench />, title: 'Upgrade Fondasi', desc: 'Memperkuat konstruksi penopang utama kasur untuk ketahanan jangka panjang.' },
  { icon: <Layers />, title: 'Upgrade Lapisan', desc: 'Mengganti busa atas yang sudah kempis dengan material baru yang lebih padat.' },
  { icon: <Settings />, title: 'Paket Fondasi + Lapisan', desc: 'Rekonstruksi atau perbaikan struktur kasur menjadi matras sehat.' },
  { icon: <Crown />, title: 'Full Upgrade (All In)', desc: 'Renovasi total: fondasi, lapisan, dan kain.' },
];

const steps = [
  { title: 'Konsultasi', desc: 'Ceritakan kondisi kasur dan kirim foto lewat WhatsApp.' },
  { title: 'Estimasi', desc: 'Dapatkan penawaran setelah kondisi kasur dipahami.' },
  { title: 'Jemput', desc: 'Tim kami menjemput kasur. Konfirmasikan lokasimu lewat WhatsApp.' },
  { title: 'Proses', desc: 'Pengerjaan oleh teknisi. Kami dapat memberi update proses lewat foto atau video.' },
  { title: 'Pembayaran', desc: 'Mendukung QRIS, transfer, atau tunai.' },
  { title: 'Antar kembali', desc: 'Kasur siap dipakai kembali.' },
];

const faqs = [
  {
    q: 'Apakah kasur amblas harus selalu diganti baru?',
    a: 'Tidak selalu. Bila masalahnya ada pada fondasi, per, atau lapisan busa dan struktur keseluruhan masih memungkinkan, perbaikan atau upgrade dapat menjadi alternatif. Keputusannya diambil setelah kondisi kasur diperiksa; bila memang sudah tidak layak dipertahankan, mengganti kasur bisa menjadi pilihan.',
  },
  {
    q: 'Apa bedanya service fondasi dan upgrade fondasi?',
    a: 'Service fondasi memperbaiki struktur dasar/rangka bawah kasur agar kembali kokoh dan tidak miring. Upgrade fondasi memperkuat konstruksi penopang utama kasur untuk ketahanan jangka panjang. Mana yang sesuai ditentukan dari hasil pemeriksaan.',
  },
  {
    q: 'Apakah kasur springbed bisa diperbaiki?',
    a: 'Kirimkan foto dan ceritakan kondisinya lewat WhatsApp. Tim kami akan menilai jenis kasur dan bagian yang bermasalah, lalu menjelaskan apa yang bisa dilakukan.',
  },
  {
    q: 'Kenapa berat badan ditanyakan?',
    a: 'Elastisitas material perlu sesuai dengan beban penggunanya. Karena itu berat badan menjadi pertimbangan teknis saat merekomendasikan lapisan yang pas.',
  },
  {
    q: 'Berapa biayanya?',
    a: 'Estimasi harga paket utama ada di halaman daftar harga. Rekomendasi pekerjaan dan penawaran mengikuti hasil pemeriksaan kondisi kasur.',
  },
  {
    q: 'Apakah ada garansi?',
    a: 'Layanan kami dilindungi garansi. Cakupan dan lamanya berbeda menurut paket, jadi konfirmasikan detailnya saat konsultasi.',
  },
];

const PerbaikanKasurAmblas: React.FC = () => {
  useSEO({
    title: 'Perbaikan Kasur Amblas: Diagnosis & Penguatan Fondasi',
    description: 'Kasur amblas, bergelombang, atau miring? Kenali penyebabnya (fondasi, per, busa) dan pilihan perbaikannya. Kirim foto kasur untuk konsultasi via WhatsApp.',
    path: '/perbaikan-kasur-amblas',
    image: '/pelayanan-matras.png',
  });

  return (
    <div className="pt-32 pb-24 bg-slate-50 dark:bg-slate-900 transition-colors duration-300 min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">

        {/* BREADCRUMB */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-slate-500 dark:text-slate-400 mb-8">
          <Link to="/" className="hover:text-blue-600">Beranda</Link>
          <ChevronRight size={14} />
          <Link to="/klinik-matras" className="hover:text-blue-600">Service Kasur &amp; Springbed</Link>
          <ChevronRight size={14} />
          <span className="text-slate-700 dark:text-slate-200 font-semibold">Perbaikan Kasur Amblas</span>
        </nav>

        {/* HERO */}
        <header className="mb-14">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
            Diagnosis &amp; Perbaikan
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
            Perbaikan Kasur Amblas: <span className="text-blue-600">Diagnosis, Penguatan Fondasi &amp; Restorasi</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
            Kasur mulai turun di bagian tengah, bergelombang, atau terasa miring? Sebelum memutuskan membeli kasur baru,
            cari tahu dulu bagian mana yang bermasalah. Klinik Matras by SANO CARE memeriksa fondasi, per, dan lapisan busa
            kasur Kamu, lalu merekomendasikan perbaikan yang sesuai, selama kondisinya memungkinkan.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href={buildWaHref(WA_MAIN)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-bold shadow-xl shadow-blue-600/20 hover:-translate-y-1 transition-all"
            >
              <Camera size={20} /> Kirim Foto Kasur untuk Konsultasi
            </a>
            <Link
              to="/klinik-matras"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-full font-bold hover:border-blue-500 transition-all"
            >
              Lihat Layanan Service Kasur <ArrowRight size={18} />
            </Link>
          </div>
        </header>

        {/* CIRI-CIRI */}
        <section className="mb-16" aria-labelledby="ciri">
          <h2 id="ciri" className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">Ciri-ciri Kasur Amblas</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Beberapa tanda yang umum dikenali. Ini hanya gambaran awal; penyebab pastinya perlu diperiksa pada kasurnya langsung.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {symptoms.map((s) => (
              <div key={s.title} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">{s.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PENYEBAB */}
        <section className="mb-16" aria-labelledby="penyebab">
          <h2 id="penyebab" className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">Kemungkinan Penyebab Kasur Amblas</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Sumbernya bisa berasal dari satu bagian atau beberapa bagian sekaligus, jadi pemeriksaan perlu menentukan
            apakah masalahnya ada pada fondasi, per, busa, atau kombinasinya. Berat badan pengguna dan usia bahan juga ikut memengaruhi.
          </p>
          <div className="space-y-4">
            {causes.map((c) => (
              <div key={c.title} className="p-6 rounded-2xl bg-white dark:bg-slate-800 border-l-4 border-blue-500 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{c.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-slate-600 dark:text-slate-300">
            Ingin memahami komponen kasur lebih dalam? Baca{' '}
            <Link to="/artikel/mengenal-struktur-kasur" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
              penjelasan struktur kasur dari dalam
            </Link>.
          </p>
        </section>

        {/* DIAGNOSIS */}
        <section className="mb-16" aria-labelledby="diagnosis">
          <h2 id="diagnosis" className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">Bagaimana Kasur Diperiksa</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Rekomendasi kami berdasarkan diagnosis kondisi kasur, bukan tebakan.
          </p>
          <ol className="space-y-3">
            {[
              'Konsultasi awal dan foto kasur untuk memahami keluhan.',
              'Pemeriksaan kondisi kasur: tingkat tenggelam, kekerasan, hilangnya elastisitas, dan usia bahan.',
              'Pertimbangan berat badan, bentuk tubuh, dan kebiasaan tidur pengguna.',
              'Rekomendasi perbaikan atau upgrade yang sesuai dengan hasil pemeriksaan.',
            ].map((t, i) => (
              <li key={i} className="flex gap-4 items-start p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">{i + 1}</span>
                <span className="text-slate-700 dark:text-slate-200 leading-relaxed">{t}</span>
              </li>
            ))}
          </ol>
          <p className="mt-6 flex items-start gap-3 text-slate-600 dark:text-slate-300">
            <Search className="shrink-0 mt-1 text-blue-600" size={18} />
            <span>
              Salah satu acuan SANO untuk fondasi adalah penurunan maksimal sekitar 1 cm saat dibebani. Konsep lengkapnya ada di{' '}
              <Link to="/artikel/panduan-lengkap-kasur-sehat-cara-memilih-kasur-yang-tepat" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                panduan lengkap kasur sehat
              </Link>.
            </span>
          </p>
        </section>

        {/* PILIHAN PERBAIKAN */}
        <section className="mb-16" aria-labelledby="pilihan">
          <h2 id="pilihan" className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">Pilihan Perbaikan Kasur Amblas</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Pekerjaan yang direkomendasikan mengikuti hasil pemeriksaan. Berikut pilihan yang tersedia di layanan kami.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {options.map((o) => (
              <div key={o.title} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">{o.icon}</div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">{o.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{o.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-slate-600 dark:text-slate-300">
            Estimasi harga paket utama tersedia di{' '}
            <Link to="/pricelist" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">daftar harga service &amp; upgrade kasur</Link>
            , dan seluruh layanan lain ada di{' '}
            <Link to="/klinik-matras" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">halaman service kasur &amp; springbed</Link>.
          </p>
        </section>

        {/* UPGRADE ATAU GANTI */}
        <section className="mb-16" aria-labelledby="upgrade-ganti">
          <h2 id="upgrade-ganti" className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">Kapan Cukup Diperbaiki, dan Kapan Sebaiknya Diganti?</h2>
          <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              Pilihan pertama tidak selalu harus membeli kasur baru. Bila masalahnya ada pada fondasi, per, atau lapisan busa,
              tetapi struktur keseluruhan masih memungkinkan, perbaikan atau upgrade dapat menjadi alternatif.
            </p>
            <p>
              Sebaliknya, bila kondisi kasur memang sudah tidak layak dipertahankan, mengganti kasur bisa menjadi keputusan yang lebih tepat.
              Karena itu keputusan sebaiknya dibuat setelah kondisi kasur dan kebutuhan penggunanya diketahui.
            </p>
          </div>
        </section>

        {/* ALUR */}
        <section className="mb-16" aria-labelledby="alur">
          <h2 id="alur" className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">Alur dari Konsultasi sampai Kasur Kembali</h2>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {steps.map((s, i) => (
              <li key={s.title} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">Langkah {i + 1}</div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">{s.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{s.desc}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-slate-600 dark:text-slate-300">
            Ingin melihat contoh hasil pengerjaan? Buka{' '}
            <Link to="/before-after" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">galeri before &amp; after kasur kami</Link>.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-16" aria-labelledby="faq">
          <h2 id="faq" className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">Pertanyaan tentang Perbaikan Kasur Amblas</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{f.q}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            Informasi di halaman ini bersifat edukasi tentang kondisi dan perbaikan kasur, bukan pengganti pemeriksaan medis.
            Bila mengalami keluhan nyeri yang berat atau menetap, konsultasikan dengan tenaga kesehatan.
          </p>
        </section>

        {/* CTA AKHIR */}
        <section className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-800 p-8 md:p-10 text-center text-white shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Kasur Kamu Amblas? Kirim Foto dan Ceritakan Kondisinya</h2>
          <p className="mb-6 opacity-90">Konsultasi awal gratis lewat WhatsApp. Kami bantu menilai bagian yang bermasalah dan pilihan perbaikannya.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={buildWaHref(WA_MAIN)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-blue-700 rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
            >
              <MessageCircle size={20} /> Chat WhatsApp Sekarang
            </a>
            <Link
              to="/kontak"
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/50 text-white rounded-full font-bold hover:bg-white/10 transition-colors"
            >
              Hubungi Kami
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};

export default PerbaikanKasurAmblas;
