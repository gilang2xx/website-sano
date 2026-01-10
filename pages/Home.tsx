import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import {
  // Icon yang sudah ada sebelumnya
  ArrowRight,
  Activity,
  Star,
  ShieldCheck,
  Shield,
  Truck,
  Clock,
  Users,
  BedDouble,
  Armchair,
  Sparkles,
  Moon,
  Frown,
  MessageCircle,
  Home as HomeIcon,
  ArrowUpRight,
  Calculator,
  X,
  Check,
  Camera,
  Video,
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
  CreditCard,
  BadgeCheck,

  // --- ICON BARU YANG WAJIB DITAMBAHKAN (Agar tidak merah) ---
  ArrowDown,
  Lightbulb,
  Banknote,
  Zap, 
  Crown, 
  AlertCircle, 
  Scissors,
  Feather,
  Ruler,
  
  CheckCircle2, 
  Link
  // -------------------------------
} from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import AnimatedHeroText from '../components/AnimatedHeroText';
import { TESTIMONIALS, BEFORE_AFTER_DATA } from '../constants';
// Ensure the file exists or correct the path if necessary
// Ensure the correct path to the GoogleReviewSection component
import GoogleReviewSection from '../components/GoogleReviewSection'; // Check if the file exists



const Home: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

 // DATA MASALAH (Disederhanakan jadi 3 Poin Utama)
  const painPoints = [
    // 1. MASALAH RINGAN (Leher & Kepala)
    {
    title: "Kepala Pusing, Pegal & Sakit Leher",
    desc: "Gejala awal akibat tekanan kasur tidak merata...",
    
    // Video
    videoWebm: "/video-sakitkepalaleher.webm",
    videoMp4: "/video-sakitkepalaleher.mp4",
    
    // TAMBAHKAN INI (Thumbnail khusus untuk video)
    videoPoster: "/dampak-kasur-kiri.jpg", 

    // Gambar fallback (yang sudah ada)
    img: "/dampak-kasur-slpunggung.png",
    colSpan: "md:col-span-1",
    color: "from-cyan-600",
    link: "/artikel/dampak-kasur-rusak"
    },
    
    // 2. MASALAH MENENGAH (Pinggang)
    {
      title: "Sakit Pinggang & Punggung",
      desc: "Pinggang terasa patah saat bangun. Tanda kasur sudah amblas dan tidak menopang tulang belakang dengan lurus.",
       // Video
      videoWebm: "/video-sakitpinggang.webm",
      videoMp4: "/video-sakitpinggang.mp4",
      // TAMBAHKAN INI (Thumbnail khusus untuk video)
    videoPoster: "/dampak-kasur-tengah.jpg", 
      // Gambar berbeda untuk kartu tengah 
      colSpan: "md:col-span-1",
      color: "from-orange-600",
      link: "/artikel/dampak-kasur-rusak"
    },

    // 3. MASALAH BERAT (Saraf)
    {
      title: "Saraf Kejepit (HNP)",
      desc: "BAHAYA! Nyeri menjalar parah. Akibat fatal membiarkan posisi tidur salah bertahun-tahun.",
      videoWebm: "/videos-sarafkejepit.webm",
      videoMp4: "/videos-sarafkejepit.mp4",
        // TAMBAHKAN INI (Thumbnail khusus untuk video)
    videoPoster: "/dampak-kasur-slpunggung.jpg", 
      // Gambar berbeda untuk kartu kanan
      colSpan: "md:col-span-1",
      color: "from-red-700",
      link: "/artikel/dampak-kasur-rusak"
    }
  ];

  return (
    <>
      {/* =========================================================
          SECTION: PAIN POINTS (MASALAH)
          Support: Light Mode (Slate-50) & Dark Mode (Slate-900)
         ========================================================= */}
      <section className="relative pt-36 pb-10 md:pt-48 bg-slate-50 dark:bg-slate-900 overflow-hidden transition-colors duration-300">
        
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/50 via-slate-50 to-slate-50 dark:from-blue-900/20 dark:via-slate-900 dark:to-slate-900 z-0"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          
          {/* HEADER */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 border border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400 text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
              <AlertCircle size={14} /> Apakah Kamu Merasakan Ini?
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-4 max-w-4xl mx-auto">
              Bangun Tidur Bukannya Segar, <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                Malah Sakit Semua?
              </span>
              <br />
              <span className="text-2xl md:text-3xl text-slate-500 dark:text-slate-400 font-bold mt-3 block">
                Itu Tanda Dampak Kasur Tidak Sehat!
              </span>
            </h1>
          </div>

          {/* BENTO GRID MASALAH (VIDEO + TEKS FIX) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {painPoints.map((item, idx) => (
              <NavLink 
                to={item.link}
                key={idx}
                className={`relative group overflow-hidden rounded-[2rem] h-80 shadow-xl dark:shadow-2xl border border-slate-200 dark:border-white/10 cursor-pointer ${item.colSpan}`}
              >
                <div
                className="w-full h-full relative group transition-all duration-300 hover:scale-[1.02]"
                >
                  
                  {/* --- LAYER 1: VIDEO/GAMBAR (PALING BAWAH z-0) --- */}
                  <div className="absolute inset-0 w-full h-full bg-slate-900 z-0">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      poster={item.img} // PENTING: Gambar muncul dulu sebelum video load
                      // object-cover: Kunci agar tidak gepeng (dia akan crop otomatis)
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
                      // Style manual untuk memaksa browser menuruti object-cover
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    >
                      <source src={item.videoMp4} type="video/mp4" />
                      <source src={item.videoWebm} type="video/webm" />
                    </video>
                  </div>
                  
                  {/* --- LAYER 2: GRADIENT OVERLAY (TENGAH z-10) --- */}
                  {/* Membuat teks terbaca jelas */}
                  <div className={`absolute bottom-0 left-0 w-full h-[70%] bg-gradient-to-t ${item.color} to-transparent opacity-90 z-10`}></div>
                  <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/90 to-transparent z-10"></div>

                  {/* --- LAYER 3: TEKS KONTEN (PALING ATAS z-20) --- */}
                  <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 text-white z-20">
                    <h3 className="text-xl md:text-2xl font-bold mb-2 leading-tight drop-shadow-lg">
                      {item.title}
                    </h3>
                    
                    <p className="text-white/90 text-xs md:text-sm font-medium leading-relaxed mb-3 line-clamp-2 drop-shadow-md">
                      {item.desc}
                    </p>
                    
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-yellow-300 opacity-90 group-hover:opacity-100 transition-opacity">
                      Lihat Solusi <ArrowRight size={12}/>
                    </div>
                  </div>

                </div>
              </NavLink>
            ))}
          </div>

        </div>
      </section>


      {/* =========================================================
          2. SOLUTION BANNER & LAYANAN UTAMA
         ========================================================= */}
      <section className="relative z-10 w-full bg-slate-900">
        
        {/* A. GAMBAR BANNER UTAMA */}
        <div className="relative w-full h-[500px] md:h-[600px] group overflow-hidden">
          {/* Gambar Background */}
          <img 
            src="/sano-matras.jpg" 
            alt="Solusi Kasur Sano" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          {/* Overlay Gelap */}
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-slate-900 to-transparent z-10"></div>

          {/* Konten Tengah Banner */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-5xl"
            >
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-8 leading-tight drop-shadow-2xl">
                Solusi Hemat Kembalikan <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400 filter drop-shadow-lg">
                  Kesehatan dan Kenyamanan
                </span> <br/>
                Tidur Kamu Tanpa Perlu Beli Baru.
              </h2>
              
              <a 
                href="https://wa.me/6285187283900"
                target="_blank"
                rel="noreferrer"
                className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-full font-bold text-lg md:text-xl text-white transition-all transform hover:scale-105 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute -inset-3 bg-cyan-400/30 blur-xl group-hover:blur-2xl transition-all"></div>
                <div className="absolute inset-0 rounded-full border border-white/30"></div>
                <div className="relative flex items-center gap-3 z-10">
                   <MessageCircle size={24} className="animate-pulse" /> 
                   Konsultasi Gratis Sekarang
                </div>
              </a>
            </motion.div>
          </div>
        </div>

        {/* B. VALUE PROPOSITION + LAYANAN GRID (DIGABUNG DI SINI) */}
        <div className="relative -mt-12 rounded-t-[3rem] z-30 bg-white dark:bg-slate-900 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-colors duration-300 pb-24">
          
          {/* 1. Value Prop Text */}
          <div className="container mx-auto max-w-4xl pt-20 pb-16 px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
                KLINIK MATRAS by SANO CARE PROMISE
              </div>

              <h3 className="text-2xl md:text-4xl font-extrabold text-slate-800 dark:text-white mb-6 leading-snug">
                Wujudkan <span className="text-[#3B62AA] dark:text-blue-400">#TidurSehat</span> Versi Kamu!
              </h3>
              
              <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl leading-relaxed">
                Berpengalaman mengerjakan berbagai jenis kerusakan matras (pegas, busa, kain) agar kembali 
                <span className="font-bold text-slate-900 dark:text-white"> nyaman, higienis, dan sehat </span> 
                sesuai kebutuhan tubuh Kamu. Mulai dari diagnosa, perbaikan, hingga hasil akhir yang presisi.
              </p>

              <div className="w-24 h-1.5 bg-gradient-to-r from-blue-400 to-[#3B62AA] mx-auto mt-12 rounded-full mb-16"></div>
            </motion.div>
          </div>

          {/* 2. LAYANAN UTAMA GRID (Klinik Matras & Sofa) */}
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              
              {/* Card 1: Klinik Matras */}
              <NavLink to="/klinik-matras" className="group block h-full">
                <div className="h-full bg-white dark:bg-slate-800 rounded-[2.5rem] overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-slate-100 dark:border-slate-700 relative text-left">
                  <div className="h-72 relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors z-10"></div>
                    <img src="/pelayanan-matras.png" alt="Klinik Matras" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-6 right-6 bg-white dark:bg-slate-700 p-3 rounded-full shadow-lg z-20 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                       <ArrowRight size={20} className="text-blue-600 dark:text-white"/>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                      <BedDouble size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Klinik Matras</h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                      Restorasi fondasi, lapisan, kain dengan konsep matras sehat.
                    </p>
                  </div>
                </div>
              </NavLink>

              {/* Card 2: Klinik Sofa */}
              <NavLink to="/klinik-sofa" className="group block h-full">
                <div className="h-full bg-white dark:bg-slate-800 rounded-[2.5rem] overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-slate-100 dark:border-slate-700 relative text-left">
                  <div className="h-72 relative overflow-hidden">
                    <div className="absolute inset-0 bg-orange-900/10 group-hover:bg-transparent transition-colors z-10"></div>
                    <img src="/pelayanan-sofa.png" alt="Klinik Sofa" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                     <div className="absolute top-6 right-6 bg-white dark:bg-slate-700 p-3 rounded-full shadow-lg z-20 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                       <ArrowRight size={20} className="text-orange-500 dark:text-white"/>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-500 dark:text-orange-400 mb-6">
                      <Armchair size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Klinik Sofa</h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                      Restorasi sofa, upgrade kenyamanan (lapisan), ganti kulit dan custom sofa.
                    </p>
                  </div>
                </div>
              </NavLink>

            </div>
          </div>

        </div>
      </section>
      {/* 3. KONSEP MATRAS SEHAT */}
      <section className="py-24 bg-blue-50 dark:bg-slate-800/30">
         <div className="container mx-auto px-6">
            <ScrollReveal className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
                  Konsep <span className="text-primary">Matras Sehat</span>
               </h2>
               <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                  Investasi Terbaik Adalah Tidur Kamu. Jangan korbankan kesehatan demi keempukan semata. Temukan keseimbangan sempurna antara kenyamanan tidur dan perlindungan tulang belakang untuk jangka panjang.
               </p>
            </ScrollReveal>

            {/* FLEXBOX OVERLAPPING CARDS */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0 mt-8 relative">
               
               {/* LEFT CARD */}
               <ScrollReveal delay={100} className="w-full md:w-1/3 z-0 md:translate-x-4">
                  <div className="bg-gradient-to-r from-secondary to-primary p-[3px] rounded-[2.5rem] shadow-xl">
                     <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 h-full relative overflow-hidden">
                        <div className="absolute top-6 right-6 bg-white dark:bg-slate-800 rounded-full p-2 shadow-sm border border-slate-100 dark:border-slate-700">
                           <div className="absolute top-6 right-6 bg-white dark:bg-slate-800 rounded-full p-2 shadow-sm border border-slate-100 dark:border-slate-700 z-20">
                            <X className="text-red-500" size={24} />
                            </div>
                        </div>
                        {/* --- GANTI BAGIAN GAMBAR KIRI DENGAN INI --- */}
                        <div className="w-full h-48 bg-slate-50 dark:bg-slate-800 rounded-2xl mb-6 flex items-center justify-center border border-slate-200 dark:border-slate-700 overflow-hidden">
                         {/* ... di dalam div pembungkus ... */}
                  <video
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline // <--- WAJIB UNTUK IPHONE
                  >
                    {/* PRIORITAS 1: SAFARI / MAC (Format HEVC .mov) */}
                    <source src="/video-matt-empuk.mov" type='video/quicktime; codecs="hvc1"' />
                    
                    {/* PRIORITAS 2: CHROME / WINDOWS (Format MP4/WebM) */}
                    <source src="/video-matt-empuk.webm" type="video/webm" />

                    {/* Fallback Image */}
                    <img src="/konsep-terlaluempuk.jpg" className="w-full h-full object-cover" alt="Too Soft" />
                  </video>
                  {/* ... */}
                           </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Matras <span className="text-primary dark:text-blue-400">Terlalu Tenggelam</span></h3>
                        <p className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider"></p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                           Membuat posisi tubuh/tulang tidak natural, karena terlalu tenggelam
                        </p>
                        <NavLink 
                          to="/artikel/konsep-matras-sehat" 
                          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-full font-bold text-sm hover:bg-blue-50 transition-colors"
                          >
                           Pelajari Lebih Lanjut <ArrowRight size={16} />
                          </NavLink>
                     </div>
                  </div>
               </ScrollReveal>

               {/* CENTER CARD */}
<ScrollReveal className="w-full md:w-1/3 z-10 md:-mt-6">
  <div className="bg-gradient-to-r from-secondary via-primary to-primary p-[3px] rounded-[2.5rem] shadow-2xl md:scale-110 transform transition-transform">
    <div className="bg-primary rounded-[2.5rem] p-8 h-full relative overflow-hidden text-white">
      
      {/* Icon Check di Pojok Kanan Atas */}
      <div className="absolute top-6 right-6 bg-white rounded-full p-2 shadow-sm z-20">
  {/* ^^^ Tambahkan 'z-20' di sini ^^^ */}
  <Check className="text-primary" size={24} />
</div>

      {/* Bagian Video */}
      <div className="w-full h-48 bg-white/10 rounded-2xl mb-6 flex items-center justify-center border border-white/20 overflow-hidden">
        {/* ... di dalam div pembungkus ... */}
                  <video
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline // <--- WAJIB UNTUK IPHONE
                  >
                    {/* PRIORITAS 1: SAFARI / MAC (Format HEVC .mov) */}
                    <source src="/video-matt-sehat.mov" type='video/quicktime; codecs="hvc1"' />
                    
                    {/* PRIORITAS 2: CHROME / WINDOWS (Format MP4/WebM) */}
                    <source src="/video-matt-sehat.webm" type="video/webm" />
                    
                    {/* Fallback Image */}
                    <img src="/konsep-terlaluempuk.jpg" className="w-full h-full object-cover" alt="Too Soft" />
                  </video>
                  {/* ... */}
      </div>

      {/* Bagian Teks & Tombol */}
      <h3 className="text-3xl font-bold mb-2">Matras Sehat</h3>
      <p className="text-xs font-bold text-blue-200 mb-4 uppercase tracking-wider"></p>
      <p className="text-sm text-blue-100 leading-relaxed mb-8">
        Fondasi Kokoh dengan lapisan sesuai berat badan kamu, menjaga tulang pada posisi natural tanpa tekanan dalam jangka waktu yang panjang.
      </p>

      <NavLink 
      to="/artikel/konsep-matras-sehat" 
      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-full font-bold text-sm hover:bg-blue-50 transition-colors"
      >
       Pelajari Lebih Lanjut <ArrowRight size={16} />
      </NavLink>

    </div>
  </div>
</ScrollReveal>
               {/* RIGHT CARD */}
               <ScrollReveal delay={100} className="w-full md:w-1/3 z-0 md:-translate-x-4">
                  <div className="bg-gradient-to-r from-primary to-secondary p-[3px] rounded-[2.5rem] shadow-xl">
                     <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 h-full relative overflow-hidden">
                        <div className="absolute top-6 right-6 bg-white dark:bg-slate-800 rounded-full p-2 shadow-sm border border-slate-100 dark:border-slate-700">
                           <X className="text-red-500" size={24} />
                        </div>
                        {/* --- GANTI BAGIAN GAMBAR KANAN DENGAN INI --- */}
<div className="w-full h-48 bg-slate-50 dark:bg-slate-800 rounded-2xl mb-6 flex items-center justify-center border border-slate-200 dark:border-slate-700 overflow-hidden">
  {/* ... di dalam div pembungkus ... */}
                  <video 
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline // <--- WAJIB UNTUK IPHONE
                  >
                    {/* PRIORITAS 1: SAFARI / MAC */}
                    <source src="/video-matt-keras.mov" type='video/quicktime; codecs="hvc1"' />
                    
                    {/* PRIORITAS 2: CHROME / WINDOWS */}
                    <source src="/video-matt-keras.webm" type="video/webm" />
                    
                    {/* Fallback Image */}
                    <img src="/konsep-terlalukeras.jpg" className="w-full h-full object-cover" alt="Too Hard" />
                  </video>
                  {/* ... */}
</div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Matras <span className="text-primary dark:text-blue-400">Terlalu Keras</span></h3>
                        <p className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider"></p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                           Memberikan tekanan pada leher, bahu, pinggang, yang menyebabkan nyeri & kaku.
                        </p>
                        <NavLink 
                          to="/artikel/konsep-matras-sehat" 
                          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-full font-bold text-sm hover:bg-blue-50 transition-colors"
                          >
                           Pelajari Lebih Lanjut <ArrowRight size={16} />
                          </NavLink>
                     </div>
                  </div>
               </ScrollReveal>

            </div>
         </div>
      </section>

{/* =========================================================
          SECTION: SOLUSI YANG Kamu PIKIRKAN (REALITY CHECK)
         ========================================================= */}
      <section className="py-20 px-4 bg-white dark:bg-slate-900 relative overflow-hidden">
        
        {/* Background Pattern Hiasan */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none"></div>

        <div className="container mx-auto max-w-6xl relative z-10">
          
          {/* --- BAGIAN 1: 5 SOLUSI UMUM --- */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Solusi yang Mungkin <span className="text-blue-600">Kamu Pikirkan?</span>
            </h2>
            <p className="text-slate-500 text-lg">
              Banyak orang mencoba cara ini, namun seringkali masalah kembali lagi.
            </p>
          </div>

          {/* GRID 5 KARTU */}
          <div className="flex flex-wrap justify-center gap-6 mb-20">
            
            {/* 1. DOKTER */}
            <div className="w-full md:w-[30%] bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 text-center hover:shadow-lg transition-all group">
              <div className="w-16 h-16 mx-auto bg-white dark:bg-slate-700 rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform text-blue-500">
                <Stethoscope size={32} />
              </div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">Cek ke Dokter?</h3>
              <p className="text-sm text-slate-500">
                Dokter mengobati gejala tubuh, tapi apakah penyebab utamanya (tempat tidur) diperbaiki?
              </p>
            </div>

            {/* 2. PIJAT */}
            <div className="w-full md:w-[30%] bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 text-center hover:shadow-lg transition-all group">
              <div className="w-16 h-16 mx-auto bg-white dark:bg-slate-700 rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform text-orange-500">
                <Activity size={32} />
              </div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">Pijat / Fisioterapi?</h3>
              <p className="text-sm text-slate-500">
                Badan enak sesaat, tapi malamnya tidur di kasur yang rusak lagi. Sakitnya akan kembali.
              </p>
            </div>

            {/* 3. KASUR ORTHOPEDIC */}
            <div className="w-full md:w-[30%] bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 text-center hover:shadow-lg transition-all group">
              <div className="w-16 h-16 mx-auto bg-white dark:bg-slate-700 rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform text-purple-500">
                <BedDouble size={32} />
              </div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">Beli Kasur Orthopedic?</h3>
              <p className="text-sm text-slate-500">
                Seringkali label "Orthopedic" di pasaran hanya gimmick marketing tanpa standar medis yang jelas.
              </p>
            </div>

            {/* 4. KASUR MAHAL */}
            <div className="w-full md:w-[30%] bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 text-center hover:shadow-lg transition-all group">
              <div className="w-16 h-16 mx-auto bg-white dark:bg-slate-700 rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform text-green-500">
                <Banknote size={32} />
              </div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">Beli Kasur Mahal?</h3>
              <p className="text-sm text-slate-500">
                Mahal belum tentu cocok. Kasur puluhan juta pun bisa bikin sakit pinggang jika tidak sesuai postur Kamu.
              </p>
            </div>

            {/* 5. KASUR KERAS */}
            <div className="w-full md:w-[30%] bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 text-center hover:shadow-lg transition-all group">
              <div className="w-16 h-16 mx-auto bg-white dark:bg-slate-700 rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform text-slate-600">
                <BrickWall size={32} />
              </div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">Ganti Kasur Keras?</h3>
              <p className="text-sm text-slate-500">
                Mitos lama. Kasur terlalu keras justru menekan bahu & panggul, menghambat aliran darah.
              </p>
            </div>

          </div>


          {/* --- BAGIAN 2: THE REALITY CHECK (FOCUS POINTER) --- */}
          <div className="relative mt-8">
            
            {/* Visual Arrow Pointer (Mengarahkan mata ke bawah) */}
            <div className="flex justify-center -mb-7 relative z-20">
              <div className="bg-yellow-400 text-slate-900 p-3 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.6)] animate-bounce border-4 border-white dark:border-slate-900">
                <ArrowDown size={32} strokeWidth={3} />
              </div>
            </div>

            {/* Container Utama (Dark Box) */}
            <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-[2.5rem] p-8 md:p-14 text-center text-white shadow-2xl overflow-hidden border-t-4 border-yellow-400">
              
              {/* Background Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 bg-blue-500/20 blur-[100px] -z-0"></div>

              {/* WARNING TEXT */}
              <div className="relative z-10 mb-8">
                <h3 className="text-xl md:text-3xl font-medium leading-relaxed text-slate-200">
                  "Semua ini <span className="text-red-400 font-bold underline decoration-wavy decoration-red-400/50 underline-offset-8">belum tentu solusi tepat</span> jika kamu belum tahu pasti masalahnya dan solusi yang ditawarkan."
                </h3>
              </div>

              {/* Divider Garis */}
              <div className="w-24 h-1 bg-white/20 mx-auto rounded-full mb-8"></div>

              {/* LOGIC TEXT */}
              <div className="relative z-10 mb-10 max-w-3xl mx-auto">
                <p className="text-lg md:text-xl text-blue-100 font-light leading-relaxed">
                  Apapun solusinya, jika saat tidur <strong className="text-white font-bold bg-white/10 px-2 py-1 rounded">tetap dibengkokkan tulangnya</strong>, maka dampaknya akan tetap terasa.
                </p>
              </div>

              {/* HERO SOLUTION (Kotak Putih) */}
              <div className="relative z-10 inline-block w-full max-w-2xl">
                <div className="flex flex-col md:flex-row items-center gap-5 bg-white text-blue-900 px-8 py-6 rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.3)] transform hover:scale-105 transition-transform duration-300">
                  <div className="bg-blue-100 p-4 rounded-full shrink-0">
                    <Lightbulb size={36} className="text-blue-600" fill="currentColor" />
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-1">THE SOLUTION</p>
                    <p className="text-xl md:text-2xl font-black leading-tight text-slate-900">
                      Klinik Matras hadir memahami dan membantu masalah matras Kamu.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 5. CARA KERJA KAMI */}
      <section className="py-24 bg-slate-50 dark:bg-bg-dark overflow-hidden">
        <div className="container mx-auto px-6">
           <ScrollReveal className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
                 Cara Kerja <span className="text-primary">Kami</span>
              </h2>
              <p className="text-slate-500 text-lg">Proses transparan dan mudah untuk kenyamanan Kamu</p>
           </ScrollReveal>

           {/* DESKTOP WAVY LAYOUT */}
           <div className="hidden md:block relative h-[500px] w-full max-w-6xl mx-auto">
              <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1200 400" preserveAspectRatio="none">
                 <defs>
                    <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                       <stop offset="0%" stopColor="#2064B7" />
                       <stop offset="100%" stopColor="#6ECDC5" />
                    </linearGradient>
                 </defs>
                 <path 
                   d="M 100 100 C 250 100, 250 300, 475 300 C 700 300, 700 100, 925 100 C 1150 100, 1150 300, 1200 300" 
                   fill="none" 
                   stroke="url(#waveGradient)" 
                   strokeWidth="3" 
                   strokeDasharray="10, 10"
                   strokeLinecap="round"
                 />
              </svg>

              {/* STEP 1 */}
              <div className="absolute left-[8%] top-[10%] -translate-x-1/2 flex flex-col items-center group">
                 <span className="text-[120px] font-bold text-slate-200 dark:text-slate-800 absolute -top-16 -z-10 opacity-50 select-none">01</span>
                 <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full shadow-xl flex items-center justify-center border-4 border-blue-50 dark:border-slate-700 z-10 group-hover:scale-110 transition-transform">
                    <MessageCircle size={32} className="text-primary" />
                 </div>
                 <div className="mt-6 text-center w-48 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white">Konsultasi</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Hubungi kami via WA, kirim foto kerusakan.</p>
                 </div>
              </div>

              {/* STEP 2 */}
              <div className="absolute left-[29%] top-[60%] -translate-x-1/2 flex flex-col-reverse items-center group">
                 <span className="text-[120px] font-bold text-slate-200 dark:text-slate-800 absolute -bottom-16 -z-10 opacity-50 select-none">02</span>
                 <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full shadow-xl flex items-center justify-center border-4 border-blue-50 dark:border-slate-700 z-10 group-hover:scale-110 transition-transform">
                    <Calculator size={32} className="text-primary" />
                 </div>
                 <div className="mb-6 text-center w-48 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white">Estimasi Biaya</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Dapatkan penawaran harga transparan & jujur.</p>
                 </div>
              </div>

              {/* STEP 3 */}
              <div className="absolute left-[50%] top-[10%] -translate-x-1/2 flex flex-col items-center group">
                 <span className="text-[120px] font-bold text-slate-200 dark:text-slate-800 absolute -top-16 -z-10 opacity-50 select-none">03</span>
                 <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full shadow-xl flex items-center justify-center border-4 border-blue-50 dark:border-slate-700 z-10 group-hover:scale-110 transition-transform">
                    <Truck size={32} className="text-primary" />
                 </div>
                 <div className="mt-6 text-center w-48 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white">Jemput Barang</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Tim kami menjemput Matras ke lokasi Kamu.</p>
                 </div>
              </div>

               {/* STEP 4 */}
               <div className="absolute left-[71%] top-[60%] -translate-x-1/2 flex flex-col-reverse items-center group">
                 <span className="text-[120px] font-bold text-slate-200 dark:text-slate-800 absolute -bottom-16 -z-10 opacity-50 select-none">04</span>
                 <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full shadow-xl flex items-center justify-center border-4 border-blue-50 dark:border-slate-700 z-10 group-hover:scale-110 transition-transform">
                    <Wrench size={32} className="text-primary" />
                 </div>
                 <div className="mb-6 text-center w-48 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white">Proses Restorasi</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Pengerjaan profesional oleh teknisi ahli.</p>
                 </div>
              </div>

              {/* STEP 5 */}
              <div className="absolute left-[92%] top-[10%] -translate-x-1/2 flex flex-col items-center group">
                 <span className="text-[120px] font-bold text-slate-200 dark:text-slate-800 absolute -top-16 -z-10 opacity-50 select-none">05</span>
                 <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full shadow-xl flex items-center justify-center border-4 border-blue-50 dark:border-slate-700 z-10 group-hover:scale-110 transition-transform">
                    <HomeIcon size={32} className="text-primary" />
                 </div>
                 <div className="mt-6 text-center w-48 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white">Antar Kembali</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Matras sehat siap digunakan kembali.</p>
                 </div>
              </div>
           </div>

           {/* MOBILE TIMELINE */}
<div className="md:hidden space-y-8 relative pl-8 border-l-2 border-dashed border-primary/30">
  {[
    { title: 'Konsultasi', icon: MessageCircle, desc: 'Chat kami & kirim foto' },
    { title: 'Estimasi', icon: Calculator, desc: 'Dapatkan penawaran' },
    { title: 'Jemput', icon: Truck, desc: 'Kami ambil Matras Kamu' },
    { title: 'Proses', icon: Wrench, desc: 'Restorasi profesional' },
    
    // --- BAGIAN BARU DITAMBAHKAN DI SINI ---
    { title: 'Pembayaran', icon: CreditCard, desc: 'Support QRIS/Transfer/Cash' },
    // ----------------------------------------

    { title: 'Antar', icon: HomeIcon, desc: 'Matras siap dipakai' },
  ].map((step, idx) => (
    <div key={idx} className="relative">
      {/* ... (sisa kode render card kamu sama seperti sebelumnya) ... */}
      <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-white border-4 border-primary shadow-sm"></div>
      <div className="bg-white dark:bg-bg-surface p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-2 bg-blue-50 dark:bg-slate-700 rounded-lg text-primary">
            <step.icon size={20} />
          </div>
          <h4 className="font-bold text-lg text-slate-900 dark:text-white">{step.title}</h4>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm">{step.desc}</p>
      </div>
    </div>
  ))}
</div>
        </div>
      </section>
{/* =========================================================
          SECTION: JAMINAN GARANSI & BENEFIT (SAFETY SECTION)
         ========================================================= */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
        
        <div className="container mx-auto max-w-6xl relative z-10">
          
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-wider mb-4">
              <ShieldCheck size={16} /> Jaminan Kepuasan Pelanggan
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Tenang, Kami <span className="text-blue-600">Bergaransi Resmi</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
              Pilih paket perlindungan yang sesuai dengan kebutuhan kamu. Kami menjamin kualitas pengerjaan dan material terbaik.
            </p>
          </div>

          {/* COMPARISON CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

            {/* --- KARTU 1: STANDARD (Clean & Minimalist) --- */}
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-2 bg-slate-400"></div>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-2xl text-slate-600 dark:text-slate-300">
                  <ShieldCheck size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Paket Standard</h3>
                  <p className="text-slate-500 text-sm">Untuk kenyamanan sehari-hari</p>
                </div>
              </div>

              {/* List Benefit */}
              <ul className="space-y-6">
                {/* Garansi Ketahanan */}
                <li className="flex items-start gap-4">
                  <div className="mt-1"><CheckCircle2 size={20} className="text-slate-400" /></div>
                  <div>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Garansi Ketahanan (Amblas)</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-white">10 Tahun</p>
                  </div>
                </li>
                {/* Garansi Lapisan */}
                <li className="flex items-start gap-4">
                  <div className="mt-1"><CheckCircle2 size={20} className="text-slate-400" /></div>
                  <div>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Garansi Busa (Kempes)</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-white">5 Tahun</p>
                  </div>
                </li>
                {/* Garansi Kenyamanan */}
                <li className="flex items-start gap-4">
                  <div className="mt-1"><CheckCircle2 size={20} className="text-slate-400" /></div>
                  <div>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Trial Kenyamanan</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-white">7 Hari</p>
                    <p className="text-xs text-slate-400">Jika tidak sesuai keluhan, kami revisi.</p>
                  </div>
                </li>
                {/* Waktu Pengerjaan */}
                <li className="flex items-start gap-4">
                  <div className="mt-1"><Clock size={20} className="text-slate-400" /></div>
                  <div>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Waktu Pengerjaan</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-white">7 Hari Kerja</p>
                  </div>
                </li>
                {/* Konsultasi */}
                <li className="flex items-start gap-4">
                  <div className="mt-1"><HeartPulse size={20} className="text-slate-400" /></div>
                  <div>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Fokus Solusi</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-white">Peningkatan Kenyamanan</p>
                    <p className="text-xs text-slate-400">(General Comfort / Tanpa Sakit Berat)</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* --- KARTU 2: PREMIUM (Highlight & Glowing) --- */}
            <div className="bg-gradient-to-b from-blue-600 to-blue-800 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden transform md:-translate-y-4 md:scale-105 border-4 border-blue-400/30">
              
              {/* Badge Rekomendasi */}
              <div className="absolute top-6 right-6 bg-yellow-400 text-blue-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide flex items-center gap-1 shadow-lg">
                <Crown size={14} /> Recommended
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-white/10 rounded-2xl text-yellow-300 border border-white/20 backdrop-blur-md">
                  <Crown size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Paket Premium</h3>
                  <p className="text-blue-200 text-sm">Solusi terbaik untuk kesehatan</p>
                </div>
              </div>

              {/* List Benefit */}
              <ul className="space-y-6">
                {/* Garansi Ketahanan */}
                <li className="flex items-start gap-4 p-3 bg-white/10 rounded-xl border border-white/10 backdrop-blur-sm">
                  <div className="mt-1"><ShieldCheck size={20} className="text-yellow-300" /></div>
                  <div>
                    <p className="text-xs text-blue-200 font-bold uppercase tracking-wider">Garansi Ketahanan (Amblas)</p>
                    <p className="text-xl font-black text-white">20 Tahun</p>
                  </div>
                </li>
                {/* Garansi Lapisan */}
                <li className="flex items-start gap-4">
                  <div className="mt-1"><CheckCircle2 size={20} className="text-blue-300" /></div>
                  <div>
                    <p className="text-xs text-blue-200 font-bold uppercase tracking-wider">Garansi Busa (Kempes)</p>
                    <p className="text-xl font-bold text-white">10 Tahun</p>
                  </div>
                </li>
                {/* Garansi Kenyamanan */}
                <li className="flex items-start gap-4">
                  <div className="mt-1"><CheckCircle2 size={20} className="text-blue-300" /></div>
                  <div>
                    <p className="text-xs text-blue-200 font-bold uppercase tracking-wider">Trial Kenyamanan</p>
                    <p className="text-xl font-bold text-white">30 Hari</p>
                    <p className="text-xs text-blue-200">Garansi kepuasan extra panjang.</p>
                  </div>
                </li>
                {/* Waktu Pengerjaan */}
                <li className="flex items-start gap-4">
                  <div className="mt-1"><Zap size={20} className="text-yellow-300" /></div>
                  <div>
                    <p className="text-xs text-blue-200 font-bold uppercase tracking-wider">Waktu Pengerjaan</p>
                    <p className="text-xl font-bold text-white">3 Hari (Prioritas)</p>
                  </div>
                </li>
                {/* Konsultasi */}
                <li className="flex items-start gap-4">
                  <div className="mt-1"><HeartPulse size={20} className="text-red-300" /></div>
                  <div>
                    <p className="text-xs text-blue-200 font-bold uppercase tracking-wider">Fokus Solusi</p>
                    <p className="text-xl font-bold text-white">Keluhan Nyeri & Orthopedic</p>
                    <p className="text-xs text-blue-200">(Khusus kasus Saraf Kejepit / Sakit Punggung)</p>
                  </div>
                </li>
              </ul>

              {/* CTA Button Premium */}
              <div className="mt-8">
                <a href="https://wa.me/6285187283900?text=Halo%20Sano,%20saya%20tertarik%20Paket%20Premium" target="_blank" rel="noreferrer" className="block w-full py-4 bg-white text-blue-700 font-bold rounded-xl text-center shadow-lg hover:bg-blue-50 transition-colors">
                  Pilih Paket Premium
                </a>
              </div>

            </div>

          </div>
          
          {/* Trust Banner Bottom */}
          <div className="mt-16 bg-blue-50 dark:bg-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-center border border-blue-100 dark:border-slate-700">
             <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">KAMI MENJAMIN:</p>
             <div className="flex gap-2 items-center text-slate-700 dark:text-slate-300 font-bold">
                <ShieldCheck className="text-green-500" size={20}/> Keaslian Material
             </div>
             <div className="hidden md:block w-px h-6 bg-slate-300"></div>
             <div className="flex gap-2 items-center text-slate-700 dark:text-slate-300 font-bold">
                <ShieldCheck className="text-green-500" size={20}/> Kerapihan Jahitan
             </div>
             <div className="hidden md:block w-px h-6 bg-slate-300"></div>
             <div className="flex gap-2 items-center text-slate-700 dark:text-slate-300 font-bold">
                <ShieldCheck className="text-green-500" size={20}/> Transparansi Harga
             </div>
          </div>

        </div>
      </section>
      {/* =========================================================
          6. GALERI KASUR SEHAT (INSPIRASI)
         ========================================================= */}
      <section className="py-24 bg-gradient-to-br from-primary via-[#3B82F6] to-[#60A5FA] dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
        
        {/* Background Hiasan */}
        <div className="absolute inset-0 bg-white/5 opacity-5 blur-xl -z-10"></div>

        <div className="container mx-auto px-6 relative z-10">
          
          {/* Header Section */}
          <div className="text-center text-white mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
              Galeri <span className="text-cyan-300">Matras Sehat</span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-blue-100">
              Kenyamanan dan kesehatan yang telah kami ciptakan untuk pelanggan kami.
            </p>
          </div>

          {/* GALLERY GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {[
              { id: 1, title: "", img: "/sano-mattsehat-2.png" }, // Ganti dengan gambar
              { id: 2, title: "", img: "/sano-mattsehat-1.jpg" }, // Ganti dengan gambar
              { id: 3, title: "", img: "/sano-mattsehat-3.png" }, // Ganti dengan gambar
            ].map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="group relative bg-white dark:bg-slate-800 rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                {/* Gambar Utama */}
                <div className="h-64 relative overflow-hidden">
                  <img 
                    src={item.img} // Gunakan src dari data di atas
                    alt={item.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>

                {/* Konten Bawah */}
                <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                  <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-300"></p>
                </div>
              </motion.div>
            ))}

          </div>

        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <GoogleReviewSection />

      {/* 8. CTA SECTION */}
      <section className="py-24 bg-bg-light dark:bg-bg-dark">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="bg-gradient-to-r from-primary to-blue-600 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 relative z-10">
                Jangan Biarkan Matras <br className="hidden md:block" /> Mengganggu Kesehatan Kamu
              </h2>
              <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto relative z-10">
                Konsultasikan keluhan dampak bangun tidur dan fisik matras kamu sekarang!
              </p>
              <div className="flex flex-col md:flex-row justify-center items-center gap-6 relative z-10">
                <a 
                  href="https://wa.me/6285187283900?text=Halo%20Sano%20Care,%20saya%20ingin%20konsultasi%20mengenai%20kasur%20saya."
                  target="_blank"
                  rel="noreferrer" 
                  className="bg-white text-primary font-bold px-10 py-4 rounded-full hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
                >
                  <MessageCircle size={20} /> Chat WhatsApp Sekarang
                </a>
                <NavLink to="/kontak" className="px-10 py-4 border-2 border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-all">
                  Lihat Lokasi Workshop
                </NavLink>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
};

export default Home;