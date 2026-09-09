import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck, FileText, Database, Target, Share2, Cookie, Lock,
  UserCheck, Clock, Baby, Globe, RefreshCw, Mail, Phone, MapPin,
  ChevronRight, AlertTriangle, Scale, ExternalLink
} from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

// Tanggal berlaku kebijakan. Perbarui saat isi kebijakan diubah.
const LAST_UPDATED = '15 Agustus 2026';

const SECTIONS = [
  { id: 'pendahuluan', title: 'Pendahuluan', icon: <FileText size={16} /> },
  { id: 'pengendali-data', title: 'Identitas Pengendali Data', icon: <ShieldCheck size={16} /> },
  { id: 'data-yang-dikumpulkan', title: 'Data yang Kami Kumpulkan', icon: <Database size={16} /> },
  { id: 'cara-pengumpulan', title: 'Cara Kami Mengumpulkan Data', icon: <Target size={16} /> },
  { id: 'tujuan-dasar-hukum', title: 'Tujuan & Dasar Pemrosesan', icon: <Scale size={16} /> },
  { id: 'berbagi-data', title: 'Pembagian Data ke Pihak Ketiga', icon: <Share2 size={16} /> },
  { id: 'cookie', title: 'Cookie & Teknologi Pelacakan', icon: <Cookie size={16} /> },
  { id: 'penyimpanan', title: 'Penyimpanan & Retensi Data', icon: <Clock size={16} /> },
  { id: 'keamanan', title: 'Keamanan Data', icon: <Lock size={16} /> },
  { id: 'hak-anda', title: 'Hak Anda sebagai Subjek Data', icon: <UserCheck size={16} /> },
  { id: 'transfer-internasional', title: 'Transfer Data ke Luar Negeri', icon: <Globe size={16} /> },
  { id: 'data-anak', title: 'Data Anak di Bawah Umur', icon: <Baby size={16} /> },
  { id: 'kunjungan-teknisi', title: 'Layanan di Lokasi Pelanggan', icon: <MapPin size={16} /> },
  { id: 'perubahan', title: 'Perubahan Kebijakan', icon: <RefreshCw size={16} /> },
  { id: 'kontak', title: 'Hubungi Kami', icon: <Mail size={16} /> },
];

// Kartu pembungkus tiap bagian kebijakan
const Section: React.FC<{
  id: string;
  title: string;
  number: number;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ id, title, number, icon, children }) => (
  <motion.section
    id={id}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.5 }}
    className="scroll-mt-32 bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 p-7 md:p-10 shadow-sm"
  >
    <div className="flex items-start gap-4 mb-6">
      <div className="w-11 h-11 shrink-0 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
          Bagian {number}
        </p>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
          {title}
        </h2>
      </div>
    </div>
    <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed [&_strong]:text-slate-900 dark:[&_strong]:text-white">
      {children}
    </div>
  </motion.section>
);

// List bullet dengan penanda biru, dipakai berulang di seluruh halaman
const Bullets: React.FC<{ items: React.ReactNode[] }> = ({ items }) => (
  <ul className="space-y-3">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-3">
        <ChevronRight size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const KebijakanPrivasi: React.FC = () => {
  useSEO({
    title: 'Kebijakan Privasi',
    description: 'Pelajari bagaimana KLINIK MATRAS by SANO CARE mengumpulkan, menggunakan, dan melindungi data pribadi Anda sesuai UU PDP.',
    path: '/kebijakan-privasi',
  });
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);

  // Sorot daftar isi sesuai bagian yang sedang dibaca
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '-140px 0px -60% 0px', threshold: 0 },
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="pb-24 bg-slate-50 dark:bg-slate-900 transition-colors duration-300 min-h-screen">

      {/* 1. HERO */}
      <section className="bg-bg-surface text-white pt-36 pb-20 relative overflow-hidden">
        {/* Ornamen latar */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-blue-200 text-xs font-bold uppercase tracking-wider mb-6">
              <ShieldCheck size={14} /> Perlindungan Data Pribadi
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              Kebijakan <span className="text-primary-light">Privasi</span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed mb-8">
              Kami di KLINIK MATRAS by SANO CARE memahami bahwa data pribadi Kamu adalah milik Kamu.
              Halaman ini menjelaskan secara rinci data apa yang kami kumpulkan, mengapa kami
              membutuhkannya, dengan siapa data itu dibagikan, dan bagaimana Kamu dapat
              mengendalikannya kapan saja.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300">
                <Clock size={14} className="text-secondary" /> Terakhir diperbarui: {LAST_UPDATED}
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300">
                <Scale size={14} className="text-secondary" /> Mengacu pada UU No. 27 Tahun 2022 (UU PDP)
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. RINGKASAN CEPAT */}
      <section className="container mx-auto px-6 -mt-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 p-7 md:p-10"
        >
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
            Ringkasan Singkat
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Versi cepat dari kebijakan ini. Penjelasan lengkap dan mengikat tetap ada di bagian di bawahnya.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Database size={20} />,
                title: 'Kami minta seperlunya',
                desc: 'Nama, email, nomor WhatsApp, kota, dan keluhan matras Kamu — hanya yang dibutuhkan untuk melayani.',
              },
              {
                icon: <Target size={20} />,
                title: 'Dipakai untuk melayani',
                desc: 'Menghubungi Kamu, memberi estimasi biaya, menjadwalkan penjemputan, dan menjaga garansi servis.',
              },
              {
                icon: <Share2 size={20} />,
                title: 'Tidak kami perjualbelikan',
                desc: 'Data Kamu tidak pernah dijual. Hanya dibagikan ke penyedia layanan yang kami butuhkan untuk beroperasi.',
              },
              {
                icon: <UserCheck size={20} />,
                title: 'Kamu tetap pemiliknya',
                desc: 'Kamu bisa meminta akses, koreksi, atau penghapusan data kapan saja lewat kontak resmi kami.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-sm">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 3. DAFTAR ISI + KONTEN */}
      <div className="container mx-auto px-6 mt-16">
        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* SIDEBAR DAFTAR ISI */}
          <aside className="lg:w-72 shrink-0 w-full lg:sticky lg:top-32">
            <div className="bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Daftar Isi
              </p>
              <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
                {SECTIONS.map((section, i) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      activeId === section.id
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span className="opacity-70">{section.icon}</span>
                    <span className="leading-tight">
                      <span className="opacity-50 mr-1">{i + 1}.</span>
                      {section.title}
                    </span>
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* KONTEN KEBIJAKAN */}
          <div className="flex-1 space-y-6 min-w-0">

            <Section id="pendahuluan" number={1} title="Pendahuluan" icon={<FileText size={20} />}>
              <p>
                Kebijakan Privasi ini mengatur cara <strong>KLINIK MATRAS by SANO CARE</strong>{' '}
                (selanjutnya disebut “<strong>Kami</strong>”, “SANO CARE”, atau “Klinik Matras”)
                mengumpulkan, menggunakan, menyimpan, membagikan, dan melindungi data pribadi Kamu
                ketika Kamu:
              </p>
              <Bullets
                items={[
                  'Mengakses dan menjelajahi situs web kami;',
                  'Mengisi formulir konsultasi gratis di halaman Kontak;',
                  'Menghubungi kami melalui WhatsApp, telepon, email, atau media sosial;',
                  'Menggunakan layanan Klinik Matras, Klinik Sofa, atau Sano Clean, baik di workshop maupun di lokasi Kamu.',
                ]}
              />
              <p>
                Dengan menggunakan situs web dan/atau layanan kami, Kamu dianggap telah membaca,
                memahami, dan menyetujui praktik yang dijelaskan dalam Kebijakan Privasi ini. Jika
                Kamu tidak menyetujui isi kebijakan ini, mohon untuk tidak mengirimkan data pribadi
                melalui kanal kami.
              </p>
              <div className="flex items-start gap-3 p-5 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
                <ShieldCheck size={20} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  Kebijakan ini disusun dengan mengacu pada <strong>Undang-Undang No. 27 Tahun 2022
                  tentang Pelindungan Data Pribadi (UU PDP)</strong>, Undang-Undang Informasi dan
                  Transaksi Elektronik beserta perubahannya, serta Peraturan Pemerintah No. 71 Tahun
                  2019 tentang Penyelenggaraan Sistem dan Transaksi Elektronik.
                </p>
              </div>
            </Section>

            <Section id="pengendali-data" number={2} title="Identitas Pengendali Data" icon={<ShieldCheck size={20} />}>
              <p>
                Pengendali Data Pribadi (<em>data controller</em>) yang bertanggung jawab atas
                pemrosesan data dalam kebijakan ini adalah:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Nama Usaha</p>
                  <p className="font-bold text-slate-900 dark:text-white">KLINIK MATRAS by SANO CARE</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Bidang Usaha</p>
                  <p className="font-bold text-slate-900 dark:text-white">Servis, upgrade, custom, dan perawatan matras &amp; sofa</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 sm:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Alamat Workshop</p>
                  <p className="font-bold text-slate-900 dark:text-white">
                    Jl. Raya Keadilan, Gg Asrama Polri, No. 81, RT 5/12, Pancoran Mas, Kota Depok, Jawa Barat
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Email Resmi</p>
                  <a href="mailto:sanocareofficial@gmail.com" className="font-bold text-blue-600 dark:text-blue-400 hover:underline break-all">
                    sanocareofficial@gmail.com
                  </a>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">WhatsApp / Telepon</p>
                  <p className="font-bold text-slate-900 dark:text-white">0851 6666 2896 &middot; 0851 8728 3900</p>
                </div>
              </div>
              <p>
                Seluruh pertanyaan, permintaan, atau keberatan terkait data pribadi dapat disampaikan
                melalui kanal resmi di atas. Kami tidak bertanggung jawab atas komunikasi yang
                mengatasnamakan kami di luar kanal tersebut.
              </p>
            </Section>

            <Section id="data-yang-dikumpulkan" number={3} title="Data yang Kami Kumpulkan" icon={<Database size={20} />}>
              <p>
                Kami hanya mengumpulkan data yang relevan dengan penyediaan layanan. Berikut rincian
                lengkapnya:
              </p>

              <h3 className="font-bold text-slate-900 dark:text-white pt-2">a. Data yang Kamu Berikan Secara Langsung</h3>
              <Bullets
                items={[
                  <><strong>Identitas dasar:</strong> nama lengkap atau nama panggilan.</>,
                  <><strong>Kontak:</strong> alamat email dan nomor telepon/WhatsApp.</>,
                  <><strong>Lokasi umum:</strong> kota atau area domisili, untuk menentukan cakupan layanan antar-jemput.</>,
                  <><strong>Detail kebutuhan layanan:</strong> jenis layanan yang diminati (Klinik Matras, Klinik Sofa, atau Sano Clean) serta deskripsi keluhan matras/sofa yang Kamu tuliskan.</>,
                  <><strong>Alamat lengkap pengerjaan:</strong> diberikan saat proses pemesanan berlanjut, untuk penjemputan, pengantaran, atau pengerjaan di tempat.</>,
                  <><strong>Foto kondisi barang:</strong> foto matras/sofa yang Kamu kirimkan untuk keperluan diagnosis dan estimasi biaya.</>,
                  <><strong>Data transaksi:</strong> catatan pemesanan, nominal, metode pembayaran, dan bukti transfer. Kami <strong>tidak pernah</strong> menyimpan nomor lengkap kartu kredit/debit atau PIN Kamu.</>,
                ]}
              />

              <h3 className="font-bold text-slate-900 dark:text-white pt-2">b. Data yang Terkumpul Otomatis</h3>
              <Bullets
                items={[
                  <><strong>Alamat IP</strong> dan <strong>user agent</strong> (jenis perangkat, sistem operasi, dan browser) saat Kamu mengirimkan formulir.</>,
                  <><strong>Data aktivitas situs:</strong> halaman yang dikunjungi, waktu kunjungan, sumber rujukan (misalnya dari Google, Instagram, atau iklan), dan tombol yang diklik — termasuk klik tombol WhatsApp.</>,
                  <><strong>Pengenal cookie iklan</strong> seperti <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-xs">_fbp</code> dan <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-xs">_fbc</code> dari Meta, serta pengenal serupa dari Google dan TikTok.</>,
                  <><strong>Parameter kampanye</strong> (UTM) pada tautan iklan, untuk mengetahui kampanye mana yang membawa Kamu ke situs kami.</>,
                ]}
              />

              <h3 className="font-bold text-slate-900 dark:text-white pt-2">c. Data yang Tidak Kami Minta</h3>
              <p>
                Kami <strong>tidak meminta</strong> data pribadi yang bersifat spesifik seperti data
                kesehatan, data biometrik, data genetika, catatan kejahatan, keyakinan politik, atau
                data keuangan pribadi. Apabila Kamu secara sukarela menuliskan informasi kesehatan
                (misalnya keluhan nyeri punggung sebagai alasan mengganti matras), informasi tersebut
                hanya kami gunakan untuk merekomendasikan tingkat kekerasan matras yang sesuai, dan
                diperlakukan dengan tingkat kerahasiaan yang lebih tinggi.
              </p>
            </Section>

            <Section id="cara-pengumpulan" number={4} title="Cara Kami Mengumpulkan Data" icon={<Target size={20} />}>
              <Bullets
                items={[
                  <><strong>Formulir Konsultasi Gratis</strong> di halaman Kontak. Data yang Kamu isi dikirim ke sistem kami untuk diteruskan sebagai notifikasi ke tim customer service.</>,
                  <><strong>Percakapan WhatsApp.</strong> Saat Kamu menekan tombol WhatsApp di situs, Kamu diarahkan ke aplikasi WhatsApp. Isi percakapan tunduk pada kebijakan privasi WhatsApp/Meta, sementara catatan pesanan yang timbul dari percakapan itu kami simpan sebagai riwayat layanan.</>,
                  <><strong>Cookie dan piksel pelacakan</strong> yang terpasang otomatis saat Kamu membuka situs (lihat Bagian 7).</>,
                  <><strong>Komunikasi langsung</strong> melalui telepon, email, kunjungan ke workshop, atau saat teknisi kami datang ke lokasi Kamu.</>,
                  <><strong>Media sosial resmi</strong> kami di Instagram, Facebook, dan TikTok, ketika Kamu mengirim pesan atau berkomentar.</>,
                ]}
              />
            </Section>

            <Section id="tujuan-dasar-hukum" number={5} title="Tujuan & Dasar Pemrosesan" icon={<Scale size={20} />}>
              <p>
                Setiap data yang kami proses memiliki tujuan yang jelas dan dasar pemrosesan yang sah
                sesuai UU PDP:
              </p>
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 mt-2">
                <table className="w-full text-sm min-w-[560px]">
                  <thead className="bg-slate-50 dark:bg-slate-900/50">
                    <tr className="text-left">
                      <th className="px-5 py-4 font-bold text-slate-900 dark:text-white">Tujuan Pemrosesan</th>
                      <th className="px-5 py-4 font-bold text-slate-900 dark:text-white">Dasar Pemrosesan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {[
                      ['Menghubungi Kamu kembali setelah pengisian formulir dan memberikan estimasi biaya perbaikan', 'Persetujuan Kamu & langkah pra-kontrak'],
                      ['Menjadwalkan survei, penjemputan, pengerjaan, dan pengantaran kembali matras/sofa', 'Pelaksanaan kontrak layanan'],
                      ['Menyimpan riwayat servis sebagai dasar klaim garansi', 'Pelaksanaan kontrak & kepentingan sah'],
                      ['Menerbitkan invoice, mencatat pembayaran, dan memenuhi kewajiban pembukuan/perpajakan', 'Kewajiban hukum'],
                      ['Menganalisis performa situs dan efektivitas iklan agar layanan kami lebih relevan', 'Kepentingan sah & persetujuan cookie'],
                      ['Menayangkan iklan yang dipersonalisasi di Meta (Facebook/Instagram), Google, dan TikTok', 'Persetujuan Kamu'],
                      ['Mengirim informasi promo atau tips perawatan matras', 'Persetujuan Kamu (dapat ditarik kapan saja)'],
                      ['Menangani keluhan, sengketa, atau menjawab permintaan aparat penegak hukum yang sah', 'Kewajiban hukum & kepentingan sah'],
                    ].map(([tujuan, dasar], i) => (
                      <tr key={i} className="align-top">
                        <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{tujuan}</td>
                        <td className="px-5 py-4 text-slate-500 dark:text-slate-400 font-semibold">{dasar}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                Kami tidak akan menggunakan data Kamu untuk tujuan baru yang tidak sejalan dengan
                daftar di atas tanpa terlebih dahulu memberi tahu dan, bila diwajibkan, meminta
                persetujuan Kamu.
              </p>
            </Section>

            <Section id="berbagi-data" number={6} title="Pembagian Data ke Pihak Ketiga" icon={<Share2 size={20} />}>
              <div className="flex items-start gap-3 p-5 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/50">
                <ShieldCheck size={20} className="text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                <p className="text-sm text-green-900 dark:text-green-200">
                  <strong>Kami tidak menjual, menyewakan, atau memperdagangkan data pribadi Kamu
                  kepada siapa pun.</strong> Pembagian data hanya dilakukan sebatas yang diperlukan
                  agar layanan kami dapat berjalan.
                </p>
              </div>
              <p>Data Kamu dapat dibagikan kepada pihak berikut:</p>
              <Bullets
                items={[
                  <><strong>Tim internal dan teknisi kami</strong> — nama, nomor telepon, dan alamat diberikan kepada teknisi yang bertugas menjemput atau mengerjakan pesanan Kamu.</>,
                  <><strong>Penyedia infrastruktur situs dan hosting</strong> — untuk menjalankan situs dan menerima kiriman formulir.</>,
                  <><strong>Penyedia layanan pengiriman email</strong> — untuk meneruskan notifikasi formulir konsultasi ke email resmi kami.</>,
                  <><strong>Meta Platforms (Facebook/Instagram)</strong> — melalui Meta Pixel dan Conversions API. Data pengenal seperti email dan nomor telepon dikirim dalam bentuk <em>hash</em> (teracak satu arah), bukan teks asli, untuk mengukur hasil iklan.</>,
                  <><strong>Google</strong> — melalui Google Tag Manager, Google Analytics, dan Google Maps yang tertanam di halaman Kontak.</>,
                  <><strong>TikTok</strong> — melalui TikTok Pixel untuk pengukuran kampanye iklan.</>,
                  <><strong>Penyedia jasa logistik/ekspedisi</strong> — bila pengiriman barang memerlukan pihak ketiga.</>,
                  <><strong>Konsultan hukum, akuntan, atau instansi berwenang</strong> — apabila diwajibkan oleh peraturan perundang-undangan atau perintah pengadilan yang sah.</>,
                ]}
              />
              <p>
                Kami mewajibkan setiap pihak ketiga untuk memproses data hanya sesuai instruksi kami
                dan menjaga kerahasiaannya. Meski demikian, layanan pihak ketiga memiliki kebijakan
                privasinya sendiri yang berada di luar kendali kami, dan kami menyarankan Kamu untuk
                membacanya.
              </p>
            </Section>

            <Section id="cookie" number={7} title="Cookie & Teknologi Pelacakan" icon={<Cookie size={20} />}>
              <p>
                Cookie adalah berkas kecil yang disimpan di perangkat Kamu saat mengunjungi situs.
                Kami menggunakan cookie dan teknologi serupa (piksel, tag, dan <em>local storage</em>)
                untuk kategori berikut:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {[
                  {
                    title: 'Cookie Esensial',
                    desc: 'Diperlukan agar situs berfungsi, misalnya menyimpan preferensi mode terang/gelap yang Kamu pilih. Tidak dapat dinonaktifkan.',
                  },
                  {
                    title: 'Cookie Analitik',
                    desc: 'Google Analytics melalui Google Tag Manager, untuk memahami halaman mana yang paling berguna bagi pengunjung.',
                  },
                  {
                    title: 'Cookie Periklanan',
                    desc: 'Meta Pixel (_fbp, _fbc) dan TikTok Pixel, untuk mengukur hasil iklan serta menayangkan iklan yang lebih relevan bagi Kamu.',
                  },
                  {
                    title: 'Konten Tertanam',
                    desc: 'Peta Google Maps di halaman Kontak serta font dan pustaka yang dimuat dari jaringan pengiriman konten pihak ketiga.',
                  },
                ].map((item, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-sm">{item.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white pt-3">Cara Mengendalikan Cookie</h3>
              <Bullets
                items={[
                  'Sebagian besar browser memungkinkan Kamu memblokir atau menghapus cookie melalui menu Pengaturan → Privasi. Perlu diingat, memblokir cookie esensial dapat membuat sebagian fitur situs tidak bekerja.',
                  'Kamu dapat mengatur preferensi iklan Meta melalui Pengaturan Akun Facebook/Instagram, dan preferensi iklan Google melalui halaman Setelan Iklan Google.',
                  'Kamu juga dapat menggunakan mode penjelajahan pribadi (incognito) atau fitur "Do Not Track" pada browser Kamu.',
                ]}
              />
            </Section>

            <Section id="penyimpanan" number={8} title="Penyimpanan & Retensi Data" icon={<Clock size={20} />}>
              <p>
                Kami menyimpan data pribadi hanya selama masih diperlukan untuk tujuan
                pengumpulannya, atau selama diwajibkan oleh peraturan yang berlaku.
              </p>
              <Bullets
                items={[
                  <><strong>Data prospek (formulir konsultasi yang tidak berlanjut menjadi pesanan):</strong> disimpan maksimal <strong>24 bulan</strong> sejak kontak terakhir, kemudian dihapus atau dianonimkan.</>,
                  <><strong>Data pelanggan dan riwayat servis:</strong> disimpan selama hubungan layanan berlangsung dan setidaknya selama <strong>masa garansi</strong> pengerjaan berjalan, agar klaim garansi Kamu dapat kami verifikasi.</>,
                  <><strong>Catatan transaksi dan pembukuan:</strong> disimpan sesuai kewajiban perundang-undangan di bidang perpajakan dan dokumen perusahaan.</>,
                  <><strong>Foto sebelum-sesudah pengerjaan:</strong> disimpan sebagai dokumentasi mutu. Foto hanya kami publikasikan sebagai portofolio jika Kamu memberikan izin terlebih dahulu, dan tanpa menampilkan identitas maupun alamat Kamu.</>,
                  <><strong>Data cookie dan analitik:</strong> mengikuti masa berlaku masing-masing cookie, umumnya antara beberapa hari hingga dua tahun.</>,
                ]}
              />
              <p>
                Setelah masa retensi berakhir, data akan kami hapus secara permanen atau diubah
                menjadi bentuk anonim yang tidak lagi dapat dikaitkan dengan diri Kamu.
              </p>
            </Section>

            <Section id="keamanan" number={9} title="Keamanan Data" icon={<Lock size={20} />}>
              <p>Kami menerapkan langkah pengamanan teknis dan organisasi yang wajar, antara lain:</p>
              <Bullets
                items={[
                  'Enkripsi jalur komunikasi (HTTPS/TLS) pada seluruh halaman situs dan pengiriman formulir.',
                  'Pengiriman data pengenal ke platform periklanan dalam bentuk hash satu arah, bukan teks asli.',
                  'Pembatasan akses data hanya kepada personel yang memerlukannya untuk menjalankan tugas.',
                  'Penyimpanan kredensial dan kunci akses sistem secara terpisah dari kode program situs.',
                  'Peninjauan berkala terhadap pihak ketiga yang memproses data atas nama kami.',
                ]}
              />
              <div className="flex items-start gap-3 p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50">
                <AlertTriangle size={20} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-900 dark:text-amber-200">
                  Meskipun demikian, tidak ada metode transmisi maupun penyimpanan elektronik yang
                  100% aman. Kami tidak dapat menjamin keamanan mutlak. Apabila terjadi kegagalan
                  pelindungan data pribadi, kami akan memberitahukan Kamu dan otoritas yang berwenang
                  paling lambat <strong>3&times;24 jam</strong> sejak diketahui, sebagaimana diatur dalam
                  UU PDP.
                </p>
              </div>
              <p>
                Kamu juga berperan menjaga keamanan data: jangan membagikan kode OTP, bukti
                pembayaran, atau data pribadi kepada nomor yang mengatasnamakan kami di luar nomor
                resmi yang tercantum pada Bagian 2.
              </p>
            </Section>

            <Section id="hak-anda" number={10} title="Hak Anda sebagai Subjek Data" icon={<UserCheck size={20} />}>
              <p>
                Berdasarkan UU PDP, Kamu memiliki hak-hak berikut atas data pribadi Kamu yang kami
                proses:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                {[
                  ['Hak atas informasi', 'Mengetahui kejelasan identitas, dasar hukum, dan tujuan kami memproses data Kamu.'],
                  ['Hak akses', 'Meminta salinan data pribadi Kamu yang kami simpan.'],
                  ['Hak koreksi', 'Meminta pembetulan data yang keliru atau tidak lagi akurat.'],
                  ['Hak penghapusan', 'Meminta data Kamu dihapus, sepanjang tidak bertentangan dengan kewajiban hukum kami.'],
                  ['Hak menarik persetujuan', 'Menarik persetujuan pemrosesan kapan saja, tanpa memengaruhi keabsahan pemrosesan sebelumnya.'],
                  ['Hak mengajukan keberatan', 'Menolak pemrosesan untuk tujuan tertentu, termasuk pemasaran langsung dan iklan bertarget.'],
                  ['Hak atas pembatasan', 'Meminta pemrosesan data Kamu ditunda atau dibatasi sementara.'],
                  ['Hak portabilitas', 'Meminta data Kamu dalam format yang dapat dibaca sistem lain, sepanjang secara teknis memungkinkan.'],
                  ['Hak menuntut ganti rugi', 'Mengajukan gugatan atas kerugian akibat pelanggaran pemrosesan data pribadi Kamu.'],
                ].map(([title, desc], i) => (
                  <div key={i} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1.5 text-sm">{title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white pt-3">Cara Menggunakan Hak Kamu</h3>
              <p>
                Kirim permintaan ke{' '}
                <a href="mailto:sanocareofficial@gmail.com" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                  sanocareofficial@gmail.com
                </a>{' '}
                atau hubungi WhatsApp resmi kami dengan menyebutkan hak yang ingin digunakan. Untuk
                melindungi Kamu dari penyalahgunaan, kami akan melakukan verifikasi identitas
                terlebih dahulu. Permintaan yang sah akan kami tanggapi paling lambat{' '}
                <strong>3&times;24 jam</strong> dan diselesaikan dalam waktu wajar sesuai kompleksitas
                permintaan. Layanan ini <strong>tidak dipungut biaya</strong>.
              </p>
            </Section>

            <Section id="transfer-internasional" number={11} title="Transfer Data ke Luar Negeri" icon={<Globe size={20} />}>
              <p>
                Sebagian penyedia layanan yang kami gunakan — seperti Meta, Google, dan TikTok —
                mengoperasikan server di luar wilayah Republik Indonesia. Karena itu, data tertentu
                (khususnya data analitik dan pengenal iklan) dapat diproses atau disimpan di negara
                lain.
              </p>
              <p>
                Dalam hal terjadi transfer semacam itu, kami memastikan bahwa penerima data berada di
                negara yang memiliki tingkat pelindungan data yang setara atau lebih tinggi, atau
                terikat perjanjian pemrosesan data yang memberikan jaminan pelindungan yang memadai,
                sebagaimana disyaratkan Pasal 56 UU PDP.
              </p>
            </Section>

            <Section id="data-anak" number={12} title="Data Anak di Bawah Umur" icon={<Baby size={20} />}>
              <p>
                Layanan dan situs kami ditujukan untuk pengguna berusia <strong>18 tahun ke atas</strong>{' '}
                atau yang telah menikah sesuai ketentuan hukum Indonesia. Kami tidak dengan sengaja
                mengumpulkan data pribadi anak.
              </p>
              <p>
                Apabila anak di bawah umur mengirimkan data melalui formulir kami, pemrosesan tersebut
                harus dilakukan dengan persetujuan orang tua atau wali. Jika Kamu adalah orang tua
                atau wali dan mengetahui bahwa anak Kamu telah memberikan data pribadi kepada kami
                tanpa persetujuan, silakan hubungi kami dan data tersebut akan segera kami hapus.
              </p>
            </Section>

            <Section id="kunjungan-teknisi" number={13} title="Layanan di Lokasi Pelanggan" icon={<MapPin size={20} />}>
              <p>
                Karena layanan kami mencakup penjemputan, pengantaran, dan pengerjaan di rumah
                pelanggan, ada beberapa hal khusus yang perlu Kamu ketahui:
              </p>
              <Bullets
                items={[
                  <><strong>Alamat lengkap Kamu</strong> hanya dibagikan kepada teknisi dan kurir yang ditugaskan pada pekerjaan Kamu, dan tidak digunakan untuk keperluan lain.</>,
                  <><strong>Dokumentasi foto</strong> diambil untuk mencatat kondisi barang sebelum dan sesudah pengerjaan. Teknisi kami diinstruksikan untuk memotret hanya objek pekerjaan, bukan area lain di rumah Kamu.</>,
                  <><strong>Publikasi portofolio</strong> hanya dilakukan atas izin Kamu. Kamu berhak menolak, dan penolakan tersebut sama sekali tidak memengaruhi kualitas layanan yang Kamu terima.</>,
                  <><strong>Rekaman percakapan</strong> layanan pelanggan, bila dilakukan, akan diberitahukan terlebih dahulu kepada Kamu dan hanya digunakan untuk pelatihan serta penanganan keluhan.</>,
                ]}
              />
            </Section>

            <Section id="perubahan" number={14} title="Perubahan Kebijakan" icon={<RefreshCw size={20} />}>
              <p>
                Kami dapat memperbarui Kebijakan Privasi ini sewaktu-waktu untuk menyesuaikan dengan
                perkembangan layanan, teknologi, atau peraturan perundang-undangan. Versi terbaru akan
                selalu tersedia di halaman ini dengan tanggal pembaruan yang tercantum di bagian atas.
              </p>
              <p>
                Untuk perubahan yang bersifat material — misalnya penambahan tujuan pemrosesan baru
                yang memerlukan persetujuan Kamu — kami akan memberitahukannya melalui pemberitahuan di
                situs, email, atau WhatsApp sebelum perubahan berlaku. Melanjutkan penggunaan layanan
                setelah pemberitahuan tersebut berarti Kamu menyetujui kebijakan versi terbaru.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Versi berlaku saat ini: <strong>{LAST_UPDATED}</strong>.
              </p>
            </Section>

            <Section id="kontak" number={15} title="Hubungi Kami" icon={<Mail size={20} />}>
              <p>
                Punya pertanyaan, permintaan, atau keluhan mengenai kebijakan ini dan cara kami
                memperlakukan data Kamu? Kami senang mendengarnya.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                <a
                  href="mailto:sanocareofficial@gmail.com"
                  className="group p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 hover:border-blue-500 hover:-translate-y-1 transition-all"
                >
                  <Mail size={20} className="text-blue-600 dark:text-blue-400 mb-3" />
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Email</p>
                  <p className="font-bold text-slate-900 dark:text-white text-sm break-all group-hover:text-blue-600">
                    sanocareofficial@gmail.com
                  </p>
                </a>
                <a
                  href="https://wa.me/6285187283900?text=Halo%20Sano,%20saya%20ingin%20bertanya%20tentang%20Kebijakan%20Privasi."
                  target="_blank"
                  rel="noreferrer"
                  className="group p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 hover:border-green-500 hover:-translate-y-1 transition-all"
                >
                  <Phone size={20} className="text-green-600 dark:text-green-400 mb-3" />
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">WhatsApp</p>
                  <p className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-green-600 flex items-center gap-1">
                    0851 8728 3900 <ExternalLink size={12} className="opacity-50" />
                  </p>
                </a>
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700">
                  <MapPin size={20} className="text-slate-500 mb-3" />
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Workshop</p>
                  <p className="font-bold text-slate-900 dark:text-white text-sm leading-snug">
                    Pancoran Mas, Kota Depok, Jawa Barat
                  </p>
                </div>
              </div>
              <p>
                Apabila Kamu merasa permintaan Kamu tidak kami tangani dengan semestinya, Kamu berhak
                menyampaikan pengaduan kepada lembaga yang berwenang di bidang pelindungan data
                pribadi di Indonesia.
              </p>
            </Section>

            {/* CTA PENUTUP */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 md:p-10 text-white text-center shadow-xl shadow-blue-600/20"
            >
              <h3 className="text-2xl font-extrabold mb-3">Masih ada yang ingin ditanyakan?</h3>
              <p className="text-blue-100 mb-7 max-w-xl mx-auto">
                Tim kami siap menjelaskan bagian mana pun dari kebijakan ini, atau langsung membantu
                masalah matras Kamu.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <NavLink
                  to="/kontak"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-blue-700 rounded-full font-bold hover:-translate-y-1 transition-all shadow-lg"
                >
                  Hubungi Kami
                </NavLink>
                <NavLink
                  to="/klinik-matras"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 border border-white/30 text-white rounded-full font-bold hover:bg-white/20 hover:-translate-y-1 transition-all"
                >
                  Lihat Layanan
                </NavLink>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default KebijakanPrivasi;