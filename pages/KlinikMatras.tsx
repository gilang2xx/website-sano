import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Layers, Wrench, Scissors, Ruler,
  Sparkles, Crown, Zap, Settings,
  Feather, Cloud, Hammer, MoveDiagonal, Clock, MessageCircle,
  Armchair, Camera,
} from 'lucide-react';
import { buildWaHref } from '../utils/attribution';
import { useSEO } from '../hooks/useSEO';

// Hub layanan "Service Kasur & Springbed" (route tetap /klinik-matras).
// SUMBER ISI: 16 layanan = katalog yang sudah ada sebelumnya di halaman ini; alur kerja =
// pages/Home.tsx; langkah diagnosis & standar fondasi = knowledge base owner + artikel pilar.
// TIDAK ADA di sini (belum ada bukti/konfirmasi owner): harga (lihat /pricelist), durasi,
// area layanan di luar alamat bengkel, hasil pelanggan, klaim medis, angka garansi.

const GROUPS = [
  {
    key: 'fondasi' as const,
    heading: 'Perbaikan & Restorasi Fondasi Kasur',
    intro: 'Fondasi adalah jantung kasur. Bagian ini menangani kasur yang amblas, miring, atau tidak lagi kokoh.',
  },
  {
    key: 'lapisan' as const,
    heading: 'Upgrade Lapisan & Kenyamanan Kasur',
    intro: 'Untuk kasur yang busanya sudah kempis, terlalu keras/empuk, atau kainnya sudah kusam.',
  },
  {
    key: 'lain' as const,
    heading: 'Ukuran, Perawatan & Layanan Pendukung',
    intro: 'Layanan tambahan untuk menyesuaikan kasur dengan ruangan dan kebutuhan Kamu.',
  },
];

const problems: { problem: string; solution: string; to: string | null; link: string | null }[] = [
  { problem: 'Kasur amblas, bergelombang, atau miring', solution: 'Service Fondasi atau Upgrade Fondasi', to: '/perbaikan-kasur-amblas', link: 'Baca panduan perbaikan kasur amblas' },
  { problem: 'Busa atas kempis atau permukaan terasa cekung', solution: 'Upgrade Lapisan', to: null, link: null },
  { problem: 'Kasur terlalu keras atau terlalu empuk', solution: 'Ubah Tekstur atau Upgrade Lapisan (Latex / Memory Foam)', to: null, link: null },
  { problem: 'Kain kusam, robek, atau ingin tampil baru', solution: 'Ganti Kain Premium atau Full Upgrade', to: null, link: null },
  { problem: 'Divan atau sandaran (headboard) rusak', solution: 'Service Divan / Sandaran', to: null, link: null },
  { problem: 'Kasur perlu dibersihkan dari tungau dan bau', solution: 'Sterilisasi Tungau/Kutu (layanan pendukung)', to: '/sano-clean', link: 'Lihat layanan Sano Clean' },
];

const faqs = [
  {
    q: 'Apa saja yang bisa dikerjakan pada layanan service kasur?',
    a: 'Perbaikan dan penguatan fondasi, penggantian lapisan busa, penyesuaian kekerasan, penggantian kain, service divan dan sandaran, potong atau tambah ukuran, hingga sterilisasi. Semuanya ada di daftar layanan pada halaman ini.',
  },
  {
    q: 'Apakah kasur springbed bisa diservis?',
    a: 'Kirimkan foto dan ceritakan kondisinya lewat WhatsApp. Tim kami akan menilai jenis kasur dan bagian yang bermasalah, lalu menjelaskan apa yang bisa dilakukan.',
  },
  {
    q: 'Bagaimana menentukan layanan yang tepat?',
    a: 'Rekomendasi berdasarkan diagnosis kondisi kasur: tingkat tenggelam, kekerasan, hilangnya elastisitas, dan usia bahan. Berat badan pengguna juga ditanyakan karena elastisitas material harus sesuai beban.',
  },
  {
    q: 'Berapa biaya service kasur?',
    a: 'Estimasi harga paket utama tersedia di halaman daftar harga. Penawaran untuk pekerjaan lain disampaikan setelah kondisi kasur dipahami lewat konsultasi.',
  },
  {
    q: 'Apakah ada garansi?',
    a: 'Layanan kami dilindungi garansi. Cakupan dan lamanya berbeda menurut paket (Standard atau Premium), jadi konfirmasikan detailnya saat konsultasi.',
  },
];

const KlinikMatras: React.FC = () => {
  useSEO({
    title: 'Service Kasur & Springbed: Perbaikan, Restorasi & Upgrade',
    description: 'Service kasur dan springbed: perbaikan fondasi, ganti lapisan, restorasi, dan upgrade tanpa beli baru di Klinik Matras by SANO CARE. Konsultasi via WhatsApp.',
    path: '/klinik-matras',
    image: '/pelayanan-matras.png',
  });

  // DAFTAR 16 LAYANAN (dikelompokkan via properti group)
  // 'isBestSeller: true' hanya untuk 2 layanan pilihan
  const services = [
    { 
      title: "Paket Fondasi + Lapisan Matras Sehat",
      group: 'fondasi' as const, 
      desc: "Kombo hemat: Rekonstruksi atau perbaikan struktur kasur menjadi matras sehat.", 
      icon: <Settings />,
      isBestSeller: true // <--- BEST SELLER 2
    },
    { 
      title: "Upgrade Fondasi Non Per Matras Sehat",
      group: 'fondasi' as const, 
      desc: "Penguatan matras yang membuat kokoh, aman, dan maksimal untuk support kesehatan tidur kamu.", 
      icon: <Zap />,
      isBestSeller: true // <--- BEST SELLER 1
    },
    { 
      title: "Upgrade Fondasi Matras Sehat",
      group: 'fondasi' as const, 
      desc: "Memperkuat konstruksi penopang utama matras untuk ketahanan jangka panjang.", 
      icon: <Wrench /> 
    },
    { 
      title: "Upgrade Lapisan Matras Sehat",
      group: 'lapisan' as const, 
      desc: "Mengganti busa atas yang sudah kempis dengan material baru yang lebih padat.", 
      icon: <Layers /> 
    },
    { 
      title: "Service Fondasi Matras Sehat",
      group: 'fondasi' as const, 
      desc: "Perbaikan struktur dasar/rangka bawah kasur agar kembali kokoh dan tidak miring.", 
      icon: <Hammer /> 
    },
    { 
      title: "Full Upgrade (All in)",
      group: 'fondasi' as const, 
      desc: "Renovasi total! Kasur lama Kamu disulap menjadi 100% baru luar dalam.", 
      icon: <Crown /> 
    },
    { 
      title: "Ubah Tekstur (Empuk/Keras)",
      group: 'lapisan' as const, 
      desc: "Menyesuaikan tingkat kekerasan kasur (Soft/Hard) sesuai kenyamanan punggung Kamu.", 
      icon: <Settings /> 
    },
    { 
      title: "Upgrade Lapisan Latex",
      group: 'lapisan' as const, 
      desc: "Menambahkan lapisan Natural Latex untuk kenyamanan ekstra dan anti-alergi.", 
      icon: <Feather /> 
    },
    { 
      title: "Upgrade Memory Foam",
      group: 'lapisan' as const, 
      desc: "Menambahkan lapisan Memory Foam yang mengikuti lekuk tubuh.", 
      icon: <Cloud /> 
    },
    { 
      title: "Ganti Kain Premium",
      group: 'lapisan' as const, 
      desc: "Mengganti cover kasur lama yang kusam/robek dengan kain Knitting baru.", 
      icon: <Scissors /> 
    },
    { 
      title: "Service Divan / Sandaran",
      group: 'fondasi' as const, 
      desc: "Reparasi rangka kayu divan yang patah dan ganti kain headboard.", 
      icon: <Armchair /> 
    },
    { 
      title: "Potong Ukuran",
      group: 'lain' as const, 
      desc: "Mengecilkan ukuran kasur (Resize) untuk menyesuaikan dengan ruangan baru.", 
      icon: <Ruler /> 
    },
    { 
      title: "Tambah Ukuran",
      group: 'lain' as const, 
      desc: "Menyambung/memperbesar kasur (misal: Single ke Queen) rapi.", 
      icon: <MoveDiagonal /> 
    },
    { 
      title: "Sterilisasi Tungau/Kutu",
      group: 'lain' as const, 
      desc: "Deep cleaning profesional untuk membasmi tungau, bakteri, dan bau.", 
      icon: <Sparkles /> 
    },
    { 
      title: "Kasur Sewa",
      group: 'lain' as const, 
      desc: "Layanan peminjaman kasur pengganti sementara selama perbaikan.", 
      icon: <Clock /> 
    },
    { 
      title: "Konsultasi Spesial",
      group: 'lain' as const, 
      desc: "Punya request khusus lain? Diskusikan dengan ahli kami.", 
      icon: <MessageCircle /> 
    },
  ];
  // KONFIGURASI ANIMASI
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
  };

  return (
    <div className="pb-24 pt-32 bg-slate-50 dark:bg-slate-900 transition-colors duration-300 min-h-screen">

      {/* 1. HEADER SECTION */}
      <section className="container mx-auto px-6 mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
            Klinik Matras by SANO CARE
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
            Service Kasur &amp; Springbed: <span className="text-blue-600">Perbaikan, Restorasi &amp; Upgrade</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto text-lg mb-8">
            Kasur amblas, busa kempis, atau tidak lagi nyaman? Klinik Matras mendiagnosis kondisi kasur Kamu lalu memperbaiki,
            memperkuat fondasi, atau meng-upgrade bagian yang bermasalah, tanpa harus membeli kasur baru.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={buildWaHref("Halo Sano, saya ingin konsultasi service kasur. Saya kirim foto kondisi kasurnya.")}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-bold shadow-xl shadow-blue-600/20 hover:-translate-y-1 transition-all"
            >
              <Camera size={20} /> Kirim Foto &amp; Konsultasi
            </a>
            <Link
              to="/pricelist"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-full font-bold hover:border-blue-500 transition-all"
            >
              Lihat Daftar Harga <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* 2. MASALAH -> LAYANAN */}
      <section className="container mx-auto px-6 max-w-5xl mb-20" aria-labelledby="masalah">
        <h2 id="masalah" className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-3 text-center">
          Masalah Kasur dan Layanan yang Sesuai
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-center max-w-3xl mx-auto mb-8">
          Pilihan akhir ditentukan setelah kondisi kasur diperiksa. Daftar ini hanya gambaran awal.
        </p>
        <div className="space-y-3">
          {problems.map((p) => (
            <div key={p.problem} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">{p.problem}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Layanan: {p.solution}</p>
              </div>
              {p.to && (
                <Link to={p.to} className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 shrink-0">
                  {p.link} <ArrowRight size={14} />
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 3. GRID SERVICES PER KELOMPOK */}
      <section className="container mx-auto px-6 max-w-7xl">
        {GROUPS.map((grp) => (
          <div key={grp.key} className="mb-16">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">{grp.heading}</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">{grp.intro}</p>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {services.filter((s) => s.group === grp.key).map((item) => {
                // @ts-ignore
                const isHighlight = item.isBestSeller === true;

                return (
                  <motion.div
                    key={item.title}
                    variants={itemVariants}
                    className={`
                      group relative p-6 rounded-3xl transition-all duration-300 flex flex-col items-start h-full
                      ${isHighlight
                        ? 'bg-white dark:bg-slate-800 border-2 border-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] scale-[1.02] hover:scale-105 z-10'
                        : 'bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg hover:-translate-y-1'
                      }
                    `}
                  >
                    {isHighlight && (
                      <div className="absolute -top-3 left-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                        <Crown size={12} fill="white" /> BEST SELLER
                      </div>
                    )}

                    <div className={`
                      w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110
                      ${isHighlight
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600'
                      }
                    `}>
                      {item.icon}
                    </div>

                    <h3 className={`text-lg font-bold mb-2 leading-tight transition-colors ${
                      isHighlight ? 'text-blue-900 dark:text-blue-100 group-hover:text-blue-600' : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900'
                    }`}>
                      {item.title}
                    </h3>

                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4 flex-grow">
                      {item.desc}
                    </p>

                    <a
                      href={buildWaHref(`Halo Sano, saya ingin tanya layanan ${item.title}.`)}
                      className={`text-xs font-bold flex items-center gap-1 transition-all mt-auto ${
                        isHighlight ? 'text-blue-600 gap-2' : 'text-slate-500 group-hover:text-blue-500 group-hover:gap-2'
                      }`}
                    >
                      Tanya via WhatsApp <ArrowRight size={14} />
                    </a>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        ))}
      </section>

      {/* 4. CARA KERJA */}
      <section className="container mx-auto px-6 max-w-5xl mb-20" aria-labelledby="cara-kerja">
        <h2 id="cara-kerja" className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">Cara Kerja Service Kasur di Klinik Matras</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Setiap kasur diperiksa lebih dulu: tingkat tenggelam, kekerasan, hilangnya elastisitas, dan usia bahan. Berat badan pengguna ikut ditanyakan
          karena material harus sesuai beban. Kami dapat memberi update proses lewat foto atau video.
        </p>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            ['Konsultasi', 'Ceritakan kondisi dan kirim foto kasur via WhatsApp.'],
            ['Estimasi', 'Dapatkan penawaran setelah kondisi kasur dipahami.'],
            ['Jemput', 'Konfirmasikan lokasi Kamu lewat WhatsApp.'],
            ['Proses', 'Pengerjaan oleh teknisi kami.'],
            ['Pembayaran', 'QRIS, transfer, atau tunai.'],
            ['Antar', 'Kasur dikembalikan dan siap dipakai.'],
          ].map(([t, d], i) => (
            <li key={t} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">Langkah {i + 1}</div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">{t}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{d}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-slate-600 dark:text-slate-400">
          Workshop kami berada di Pancoran Mas, Kota Depok. Detail alamat dan jam operasional ada di halaman{' '}
          <Link to="/kontak" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">kontak</Link>.
        </p>
      </section>

      {/* 5. HARGA & BUKTI & BACAAN */}
      <section className="container mx-auto px-6 max-w-5xl mb-20" aria-labelledby="harga">
        <h2 id="harga" className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">Harga, Contoh Hasil, dan Bacaan Lanjutan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/pricelist" className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-colors">
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Estimasi harga service &amp; upgrade</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Lihat estimasi paket utama. Harga akhir mengikuti hasil pemeriksaan kondisi kasur.</p>
          </Link>
          <Link to="/before-after" className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-colors">
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Galeri before &amp; after</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Contoh hasil pengerjaan kasur di Klinik Matras.</p>
          </Link>
          <Link to="/artikel/mengenal-struktur-kasur" className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-colors">
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Mengenal struktur kasur dari dalam</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Pahami fondasi, lapisan, dan kain sebelum memutuskan perbaikan.</p>
          </Link>
          <Link to="/artikel/panduan-lengkap-kasur-sehat-cara-memilih-kasur-yang-tepat" className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-colors">
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Kapan kasur diperbaiki atau diganti?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Panduan memilih antara perbaikan, modifikasi, dan penggantian kasur.</p>
          </Link>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="container mx-auto px-6 max-w-5xl mb-20" aria-labelledby="faq">
        <h2 id="faq" className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">Pertanyaan tentang Service Kasur &amp; Springbed</h2>
        <div className="space-y-4">
          {faqs.map((f) => (
            <div key={f.q} className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">{f.q}</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CTA */}
      <section className="container mx-auto px-6 text-center">
        <a
          href={buildWaHref("Halo Sano, saya ingin konsultasi tentang layanan Klinik Matras.")}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-bold shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-1 transition-all"
        >
          <MessageCircle size={20} /> Konsultasi Gratis dengan Ahli
        </a>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          Atau langsung ke halaman <Link to="/kontak" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">kontak</Link>.
        </p>
      </section>

    </div>
  );
};

export default KlinikMatras;
