import React from 'react';
import ScrollReveal from '../components/ScrollReveal';
// Copy ini dan timpa import lucide-react yang lama di file TentangKami.tsx
import { 
  // Icon standar yang mungkin sudah ada
  ArrowRight, Shield, Star, CheckCircle, Play, BedDouble, Armchair, User,
  
  // ICON BARU UNTUK 11 POIN (Wajib Ditambahkan)
  Award, 
  Eye, 
  Microscope, 
  Stethoscope, 
  BrickWall, 
  Layers, 
  Gem, 
  Wrench, 
  Wallet, 
  HeartPulse, 
  BadgeCheck 
} from 'lucide-react';

const TentangKami: React.FC = () => {
  return (
    <div className="pb-24">
      {/* HEADER SECTION */}
      <section className="py-20 bg-bg-light dark:bg-bg-surface text-center">
        <div className="container mx-auto px-6">
           <ScrollReveal>
             <span className="text-primary dark:text-secondary font-bold tracking-widest uppercase text-sm mb-4 block">Our Profile</span>
             <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">Tentang Kami</h1>
             <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                Mengenal lebih dekat siapa di balik kenyamanan tidur Anda.
             </p>
           </ScrollReveal>
        </div>
      </section>

      {/* SECTION 1: OUR STORY (TEXT ONLY) */}
      <section className="py-16 bg-white dark:bg-bg-dark">
        <div className="container mx-auto px-6">
          
          {/* Ubah layout jadi satu kolom rapi di tengah */}
          <div className="max-w-4xl mx-auto text-center md:text-left">

            {/* BAGIAN TEKS */}
            <ScrollReveal delay={200}>
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-6">
                  Mengembalikan Kenyamanan Tidur <span className="text-primary">Keluarga Indonesia</span>
                </h2>
                
                <div className="space-y-6 text-slate-600 dark:text-slate-300 text-lg leading-relaxed text-justify">
                  <p>
                    <span className="font-bold text-primary">Sano Care</span> hadir dari sebuah keresahan nyata: banyak orang bangun tidur dengan keluhan seperti pegal-pegal, pusing, sakit pinggang, hingga rasa tidak nyaman sepanjang hari.
                  </p>
                  <p>
                    Kami percaya: sesuatu yang diperbaiki dan di-upgrade berdasarkan problem sebelumnya jauh lebih efektif dalam mengatasi akar masalah sekaligus menyempurnakan kenyamanan tidur.
                  </p>
                  <p>
                    Dengan teknik restorasi yang tepat, didukung pemahaman mendalam tentang anatomi tulang belakang, karakteristik material, dan cara kerja setiap lapisan kasur, kami tidak hanya memperbaiki tampilan fisik—tetapi juga mengembalikan fungsi kesehatan kasur Anda.
                  </p>
                </div>

                <p className="font-medium text-slate-900 dark:text-white mt-8 text-lg">
                  Hemat biaya, menyelesaikan keluhan, memastikan kenyamanan. Itulah komitmen kami kepada Anda.
                </p>

               

              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION: KENAPA MEMILIH SANO+ (11 POINTS)
         ========================================================= */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="container mx-auto max-w-7xl">
          
          {/* Header Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Kenapa Memilih <span className="text-blue-600">SANO+ ?</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Standar kualitas tinggi, ilmiah, dan transparan yang kami pegang teguh dalam setiap pengerjaan.
            </p>
          </div>

          {/* Grid 11 Kartu */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. KEAHLIAN */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 group">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <Award size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">1. Keahlian (Expertise)</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Didukung oleh teknisi berpengalaman lebih dari 10 tahun mengenai material & teknologi matras, fondasi dan ketahanan matras, diagnosis kerusakan, hingga anatomi tidur dari berbagai merek kasur premium (King Koil, Serta, Lady Americana, dll).
              </p>
            </div>

            {/* 2. TRANSPARANSI */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 group">
              <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <Eye size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">2. Transparansi (Honesty)</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Harga transparan di awal, update proses service by foto & video, serta saran rekomendasi yang tepat berdasarkan diagnosa keluhan, fisik, dan uji texture. Kesehatan Anda prioritas kami.
              </p>
            </div>

            {/* 3. ANALISIS ILMIAH */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 group">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <Microscope size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">3. Analisis Struktur Tidur Ilmiah</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Kami menilai kondisi matras berdasarkan anatomi tulang belakang, distribusi tekanan, dan gaya tidur. Solusi bukan asal-asalan, melainkan menyasar akar keluhan sesuai konsep matras sehat.
              </p>
            </div>

            {/* 4. DIAGNOSA AKURAT */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 group">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center text-red-600 dark:text-red-400 mb-6 group-hover:scale-110 transition-transform">
                <Stethoscope size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">4. Diagnosa Akurat & Terukur</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Setiap matras diperiksa detail: tingkat tenggelam, kekerasan, hilangnya elastisitas, hingga usia bahan. Hasilnya: rekomendasi upgrade yang tepat, bukan tebakan.
              </p>
            </div>

            {/* 5. FONDASI KUAT */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 group">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 mb-6 group-hover:scale-110 transition-transform">
                <BrickWall size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">5. Fondasi Standar 20 Tahun</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Kami memastikan fondasi matras selalu kokoh, stabil, dan tahan lama, sehingga kenyamanan bertahan jangka panjang.
              </p>
            </div>

            {/* 6. LAPISAN SESUAI BODY */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 group">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                <Layers size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">6. Lapisan Sesuai Berat Badan</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-2">
                Bahan (Busa, Rebonded, Latex, Memory Foam) disesuaikan langsung dengan:
              </p>
              <ul className="text-slate-500 dark:text-slate-400 text-sm list-disc pl-4 space-y-1">
                <li>Berat Badan</li>
                <li>Bentuk Tubuh</li>
                <li>Kebiasaan Tidur</li>
              </ul>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">
                Hasil: Tidak terlalu keras, tidak tenggelam. Pas!
              </p>
            </div>

            {/* 7. MATERIAL PREMIUM */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 group">
              <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center text-pink-600 dark:text-pink-400 mb-6 group-hover:scale-110 transition-transform">
                <Gem size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">7. Material Premium Terverifikasi</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Kami hanya menggunakan bahan standar densitas tinggi, tahan lama, minim penurunan kualitas, aman dan higienis. Tidak ada bahan murahan, tidak ada kompromi.
              </p>
            </div>

            {/* 8. TEKNIK RESTORASI PROFESIONAL */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 group">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400 mb-6 group-hover:scale-110 transition-transform">
                <Wrench size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">8. Teknik Restorasi Profesional</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Bukan tukang biasa. Teknisi kami paham struktur kasur, teknik perbaikan khusus, dan standar pengerjaan rapi. Matras tidak hanya diperbaiki—tapi dipulihkan.
              </p>
            </div>

            {/* 9. HEMAT BIAYA */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 group">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center text-teal-600 dark:text-teal-400 mb-6 group-hover:scale-110 transition-transform">
                <Wallet size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">9. Lebih Hemat dari Beli Baru</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Dengan upgrade Sano Care, Anda mendapatkan kualitas seperti kasur baru premium dengan harga jauh lebih hemat 50–80%.
              </p>
            </div>

            {/* 10. HILANGKAN KELUHAN (Span 2 kolom di tablet agar rapi) */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 group md:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center text-rose-600 dark:text-rose-400 mb-6 group-hover:scale-110 transition-transform">
                <HeartPulse size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">10. Fokus: Hilangkan Keluhan</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">
                Kami menyelesaikan masalah:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 mb-3">
                <span className="flex items-center gap-1">✔ Pegal-pegal</span>
                <span className="flex items-center gap-1">✔ Kualitas buruk</span>
                <span className="flex items-center gap-1">✔ Sakit pinggang</span>
                <span className="flex items-center gap-1">✔ Kasur tenggelam</span>
                <span className="flex items-center gap-1">✔ Nyeri punggung</span>
                <span className="flex items-center gap-1">✔ Terlalu keras</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">
                Tujuan: Anda bangun segar tanpa rasa sakit.
              </p>
            </div>

            {/* 11. GARANSI (Span 1 kolom terakhir) */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 group md:col-span-1 lg:col-span-2 flex flex-col justify-center">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 shrink-0 group-hover:scale-110 transition-transform">
                  <BadgeCheck size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">11. Garansi Keamanan & Kenyamanan</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    Memberikan rasa aman dengan garansi kekokohan fondasi, kekuatan lapisan, dan kenyamanan setelah upgrade. Bukan sekadar janji—fakta yang kami pertanggungjawabkan.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: STATISTICS BAR */}
      <section className="py-12 bg-primary dark:bg-slate-900 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/20 gap-8 md:gap-0">
               <ScrollReveal className="text-center p-4">
                  <p className="text-4xl md:text-5xl font-extrabold mb-2">1200+</p>
                  <p className="text-blue-100 font-medium uppercase tracking-widest text-sm">Proyek Selesai</p>
               </ScrollReveal>
               <ScrollReveal delay={100} className="text-center p-4">
                  <p className="text-4xl md:text-5xl font-extrabold mb-2">98%</p>
                  <p className="text-blue-100 font-medium uppercase tracking-widest text-sm">Pelanggan Puas</p>
               </ScrollReveal>
               <ScrollReveal delay={200} className="text-center p-4">
                  <p className="text-4xl md:text-5xl font-extrabold mb-2">24 Jam</p>
                  <p className="text-blue-100 font-medium uppercase tracking-widest text-sm">Respon Cepat</p>
               </ScrollReveal>
            </div>
         </div>
      </section>
    </div>
  );
};

export default TentangKami;