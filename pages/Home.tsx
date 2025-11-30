import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
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
  Wrench,
  Home as HomeIcon,
  ArrowUpRight,
  Calculator,
  X,
  Check,
  Camera,
  Video
} from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import AnimatedHeroText from '../components/AnimatedHeroText';
import { TESTIMONIALS, BEFORE_AFTER_DATA } from '../constants';


const Home: React.FC = () => {
     const [isDarkMode, setIsDarkMode] = React.useState(false); 
  return (
    <>
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-32 md:pt-48 md:pb-48 bg-gradient-to-br from-primary via-[#3B82F6] to-[#60A5FA] dark:from-slate-900 dark:to-indigo-900 rounded-b-[80px] overflow-hidden z-10 shadow-2xl transition-colors duration-500">
        <div className="container mx-auto px-6 text-center relative z-20">
          <ScrollReveal>
            {/* HEADLINE */}
            <AnimatedHeroText />
            
            <p className="text-blue-50 dark:text-blue-200 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed opacity-90">
              Solusi hemat kembalikan kenyamanan matras Anda seperti baru tanpa perlu beli yang mahal.
            </p>
            
            {/* BUTTONS */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-5 mb-20">
              {/* Button 1: Gradient Border Style */}
              <a 
                href="https://wa.me/6289528011264?text=Halo%20Sano%20Care,%20saya%20ingin%20konsultasi%20mengenai%20kasur%20saya."
                target="_blank"
                rel="noreferrer"
                className="group relative p-[2px] rounded-full bg-gradient-to-r from-secondary to-primary shadow-lg hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
              >
                <div className="px-8 py-4 bg-white dark:bg-slate-900 rounded-full flex items-center gap-3 transition-colors duration-300">
                  <span className="font-bold text-primary dark:text-blue-300 text-lg">Konsultasi Gratis</span>
                  <div className="w-8 h-8 bg-blue-50 dark:bg-blue-800 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white dark:group-hover:bg-blue-400 transition-colors">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </a>

              {/* Button 2: Glass Style */}
              <NavLink 
                to="/layanan"
                className="px-9 py-4 bg-white/10 dark:bg-white/5 border border-white/20 text-white rounded-full font-bold hover:bg-white/20 transition-all backdrop-blur-md shadow-lg"
              >
                Lihat Layanan
              </NavLink>
            </div>

{/* HERO IMAGE REAL */}
<div className="relative max-w-4xl mx-auto mt-8">
  
  {/* 1. GAMBAR UTAMA (Tanpa Border/Kotak) */}
   <div className="w-full h-auto relative z-0 flex justify-center pointer-events-none">
  <video
    autoPlay
    loop
    muted
    playsInline
    className="w-[110%] md:w-full h-auto object-contain drop-shadow-2xl mix-blend-screen scale-125 md:scale-150"
    style={{ maxWidth: 'none' }} // Membuka batasan lebar
  >
    {/* KHUSUS SAFARI / MAC / IPHONE (Format MOV HEVC) */}
    <source src="/sano-hero-mac.mov" type='video/quicktime; codecs="hvc1"' />
    
    {/* KHUSUS CHROME / WINDOWS / ANDROID (Format WebM) */}
    <source src="/sano-hero-android.webm" type="video/webm" />
    
    {/* Fallback jika browser tua */}
    Browser Anda tidak mendukung video.
  </video>
  </div>

  {/* 2. FLOATING BADGE KIRI (1200+) */}
  <div className={`absolute bottom-4 left-2 md:bottom-20 md:left-10 p-2 md:p-4 rounded-xl md:rounded-2xl shadow-lg md:shadow-xl z-20 animate-bounce transition-colors duration-300 border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white'}`}>
    <div className="flex items-center gap-2 md:gap-3">
      {/* Icon Kecil di HP */}
      <div className="bg-green-100 p-1.5 md:p-2 rounded-full text-green-600">
        <Shield className="w-4 h-4 md:w-6 md:h-6" />
      </div>
      <div>
        {/* Teks Kecil di HP */}
        <div className="text-sm md:text-2xl font-bold text-blue-600 leading-tight">1200+</div>
        <div className="text-[8px] md:text-xs font-bold text-slate-500 uppercase tracking-wide">
          Matras Diperbaiki
        </div>
      </div>
    </div>
  </div>

  {/* 3. FLOATING BADGE KANAN (3 TAHUN) */}
   <div className={`absolute bottom-4 right-2 md:bottom-20 md:right-10 p-2 md:p-4 rounded-xl md:rounded-2xl shadow-lg md:shadow-xl z-20 transition-colors duration-300 border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white'}`}>
    <div className="flex items-center gap-2 md:gap-3">
      <div className="bg-cyan-100 p-1.5 md:p-2 rounded-full text-cyan-600">
        <Star className="w-4 h-4 md:w-6 md:h-6" fill="currentColor" />
      </div>
      <div>
        <div className="text-sm md:text-xl font-bold text-slate-800 dark:text-white leading-tight">3 TAHUN</div>
        <div className="text-[8px] md:text-xs font-bold text-slate-500 uppercase tracking-wide">
          Pengalaman
        </div>
      </div>
    </div>
  </div>

</div>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. PELAYANAN UTAMA */}
      <section className="py-24 bg-white dark:bg-bg-dark relative transition-colors duration-500">
        <div className="container mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              Pelayanan <span className="text-primary dark:text-primary-light">Utama</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">Solusi lengkap untuk kenyamanan tidur Anda</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Klinik Matras */}
            <ScrollReveal>
              <NavLink to="/klinik-matras" className="group block h-full">
                <div className="h-full bg-blue-50/50 dark:bg-slate-800/50 rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-blue-100/50 dark:border-slate-700">
                   <div className="h-60 relative group-hover:scale-105 transition-transform duration-700">
                      <img 
                        src="/pelayanan-matras.png" 
                        alt="Klinik Matras" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors"></div>
                      <div className="absolute top-4 right-4 bg-white dark:bg-slate-800 p-2 rounded-full text-primary dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
                         <ArrowUpRight size={20} />
                      </div>
                   </div>
                   <div className="p-8">
                      <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center text-primary dark:text-primary-light mb-4 shadow-sm group-hover:scale-110 transition-transform">
                         <BedDouble size={24} />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Klinik Matras</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                         Perbaikan pegas, ganti kain, dan upgrade latex untuk tidur yang lebih sehat.
                      </p>
                   </div>
                </div>
              </NavLink>
            </ScrollReveal>

            {/* Card 2: Klinik Sofa */}
            <ScrollReveal delay={100}>
              <NavLink to="/klinik-sofa" className="group block h-full">
                <div className="h-full bg-orange-50/50 dark:bg-slate-800/50 rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-orange-100/50 dark:border-slate-700">
                   <div className="h-60 relative group-hover:scale-105 transition-transform duration-700">
                      <img 
                        src="/pelayanan-sofa.png" 
                        alt="Klinik Sofa" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-orange-900/10 group-hover:bg-transparent transition-colors"></div>
                      <div className="absolute top-4 right-4 bg-white dark:bg-slate-800 p-2 rounded-full text-orange-600 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
                         <ArrowUpRight size={20} />
                      </div>
                   </div>
                   <div className="p-8">
                      <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400 mb-4 shadow-sm group-hover:scale-110 transition-transform">
                         <Armchair size={24} />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Klinik Sofa</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                         Restorasi sofa, ganti kulit/kain, dan pembuatan sofa custom sesuai keinginan.
                      </p>
                   </div>
                </div>
              </NavLink>
            </ScrollReveal>

             {/* Card 3: Sano Clean */}
            <ScrollReveal delay={200}>
              <NavLink to="/sano-clean" className="group block h-full">
                <div className="h-full bg-teal-50/50 dark:bg-slate-800/50 rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-teal-100/50 dark:border-slate-700">
                   <div className="h-60 relative group-hover:scale-105 transition-transform duration-700">
                      <img 
                        src="pelayanan-sanoklin.png" 
                        alt="Sano Clean" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-teal-900/10 group-hover:bg-transparent transition-colors"></div>
                      <div className="absolute top-4 right-4 bg-white dark:bg-slate-800 p-2 rounded-full text-teal-600 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
                         <ArrowUpRight size={20} />
                      </div>
                   </div>
                   <div className="p-8">
                      <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center text-teal-600 dark:text-teal-400 mb-4 shadow-sm group-hover:scale-110 transition-transform">
                         <Sparkles size={24} />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Sano Clean</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                         Jasa cuci matras & sofa deep cleaning untuk basmi tungau dan noda membandel.
                      </p>
                   </div>
                </div>
              </NavLink>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* 3. KONSEP KASUR SEHAT */}
      <section className="py-24 bg-blue-50 dark:bg-slate-800/30">
         <div className="container mx-auto px-6">
            <ScrollReveal className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
                  Konsep <span className="text-primary">Kasur Sehat</span>
               </h2>
               <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                  Kasur yang seimbang, bukan hanya empuk tapi yang bisa support kesehatan tidurmu.
               </p>
            </ScrollReveal>

            {/* FLEXBOX OVERLAPPING CARDS */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0 mt-8 relative">
               
               {/* LEFT CARD */}
               <ScrollReveal delay={100} className="w-full md:w-1/3 z-0 md:translate-x-4">
                  <div className="bg-gradient-to-r from-secondary to-primary p-[3px] rounded-[2.5rem] shadow-xl">
                     <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 h-full relative overflow-hidden">
                        <div className="absolute top-6 right-6 bg-white dark:bg-slate-800 rounded-full p-2 shadow-sm border border-slate-100 dark:border-slate-700">
                           <X className="text-red-500" size={24} />
                        </div>
                        <div className="w-full h-48 bg-slate-50 dark:bg-slate-800 rounded-2xl mb-6 flex items-center justify-center border border-slate-200 dark:border-slate-700 overflow-hidden">
                           <img 
                           src="/konsep-terlaluempuk.png" 
                           alt="Hammocking" 
                           className="w-full h-full object-cover" 
                           />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Matras <span className="text-primary dark:text-blue-400">Terlalu Empuk</span></h3>
                        <p className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">Tulang Belakang "Tenggelam"</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                           (Hammocking): Bagian tubuh yang paling berat, yaitu panggul dan pinggul, akan tenggelam paling dalam ke dalam kasur.
                        </p>
                        <button className="w-full py-3 bg-primary text-white rounded-full font-bold text-sm hover:bg-primary-dark transition-colors">
                           Learn more →
                        </button>
                     </div>
                  </div>
               </ScrollReveal>

               {/* CENTER CARD */}
<ScrollReveal className="w-full md:w-1/3 z-10 md:-mt-6">
  <div className="bg-gradient-to-r from-secondary via-primary to-primary p-[3px] rounded-[2.5rem] shadow-2xl md:scale-110 transform transition-transform">
    <div className="bg-primary rounded-[2.5rem] p-8 h-full relative overflow-hidden text-white">
      
      {/* Icon Check di Pojok Kanan Atas */}
      <div className="absolute top-6 right-6 bg-white rounded-full p-2 shadow-sm">
         <Check className="text-primary" size={24} />
      </div>

      {/* Bagian Video */}
      <div className="w-full h-48 bg-white/10 rounded-2xl mb-6 flex items-center justify-center border border-white/20 overflow-hidden">
        <video 
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/konsep-sehat.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Bagian Teks & Tombol */}
      <h3 className="text-3xl font-bold mb-2">Kasur Sehat</h3>
      <p className="text-xs font-bold text-blue-200 mb-4 uppercase tracking-wider">Perfect Alignment</p>
      <p className="text-sm text-blue-100 leading-relaxed mb-8">
        Tulang Belakang sejajar sempurna. Bagian tubuh yang berat ditopang dengan baik, mencegah nyeri punggung dan meningkatkan kualitas tidur secara signifikan.
      </p>

      <button className="w-full py-3 bg-white text-primary rounded-full font-bold text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
        Learn more <ArrowRight size={16} />
      </button>

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
                        <div className="w-full h-48 bg-slate-50 dark:bg-slate-800 rounded-2xl mb-6 flex items-center justify-center border border-slate-200 dark:border-slate-700 overflow-hidden">
                           <img 
                           src="/konsep-terlalukeras.png" 
                            alt="Too Hard" 
                            className="w-full h-full object-cover" 
                            />
                            </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Matras <span className="text-primary dark:text-blue-400">Terlalu Keras</span></h3>
                        <p className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">Pressure Points</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                           Tekanan berlebih pada titik tertentu (Pressure Points). Saat tidur miring, bahu dan panggul menonjol, menghambat sirkulasi darah.
                        </p>
                        <button className="w-full py-3 bg-primary text-white rounded-full font-bold text-sm hover:bg-primary-dark transition-colors">
                           Learn more →
                        </button>
                     </div>
                  </div>
               </ScrollReveal>

            </div>
         </div>
      </section>

      {/* 4. DAMPAK KASUR TIDAK SEHAT */}
      <section className="py-24 bg-slate-50 dark:bg-bg-surface relative">
        <div className="container mx-auto px-6">
           <ScrollReveal className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
                 Dampak Kasur <span className="text-primary">Tidak Sehat</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">Masalah kasur yang tidak sehat dapat memicu gangguan kesehatan.</p>
           </ScrollReveal>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                  { title: "Sakit Leher & Punggung", desc: "Posisi tulang belakang yang tidak lurus menyebabkan tekanan berlebih pada sendi dan otot.", img: "/dampak-kasur-slpunggung.png" },
                  { title: "Kualitas Tidur Menurun", desc: "Sering terbangun di malam hari karena pegas yang menusuk atau gatal akibat tungau.", img: "/dampak-kasur-stidur.png" },
                  { title: "Mood & Energi Rendah", desc: "Kurang tidur nyenyak berdampak langsung pada produktivitas dan emosi sepanjang hari.", img: "/dampak-kasur-mood.png" }
              ].map((item, i) => (
                  <ScrollReveal key={i} delay={i * 100}>
                     <div className="relative h-[28rem] rounded-[2.5rem] overflow-hidden group shadow-2xl">
                        <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-primary-dark/30 to-transparent opacity-90"></div>
                        <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl text-white transform translate-y-2 group-hover:translate-y-0 transition-transform">
                           <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                           <p className="text-xs text-white/80 leading-relaxed">{item.desc}</p>
                        </div>
                     </div>
                  </ScrollReveal>
              ))}
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
              <p className="text-slate-500 text-lg">Proses transparan dan mudah untuk kenyamanan Anda</p>
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
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Tim kami menjemput kasur ke lokasi Anda.</p>
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
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Kasur sehat siap digunakan kembali.</p>
                 </div>
              </div>
           </div>

           {/* MOBILE TIMELINE */}
           <div className="md:hidden space-y-8 relative pl-8 border-l-2 border-dashed border-primary/30">
              {[
                 { title: 'Konsultasi', icon: MessageCircle, desc: 'Chat kami & kirim foto' },
                 { title: 'Estimasi', icon: Calculator, desc: 'Dapatkan penawaran' },
                 { title: 'Jemput', icon: Truck, desc: 'Kami ambil kasur Anda' },
                 { title: 'Proses', icon: Wrench, desc: 'Restorasi profesional' },
                 { title: 'Antar', icon: HomeIcon, desc: 'Kasur siap dipakai' },
              ].map((step, idx) => (
                 <div key={idx} className="relative">
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

      {/* 6. BEFORE & AFTER SECTION */}
      <section className="py-24 bg-gradient-to-br from-primary via-[#3B82F6] to-[#60A5FA] dark:from-slate-900 dark:to-indigo-900 text-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
           <ScrollReveal className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                 <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-2 block">Real Results</span>
                 <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">Before & After SANO<br/></h2>
              </div>
              <NavLink to="/before-after" className="px-8 py-3 rounded-full border border-white/30 hover:bg-white hover:text-primary-dark transition-all font-bold flex items-center gap-2">
                 Lihat Galeri Lengkap <ArrowRight size={18} />
              </NavLink>
           </ScrollReveal>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {BEFORE_AFTER_DATA.slice(0, 2).map((item, idx) => (
                 <ScrollReveal key={item.id} delay={idx * 100}>
                    <div className="bg-white dark:bg-bg-surface rounded-3xl overflow-hidden shadow-xl p-6 text-slate-900 dark:text-white">
                       <div className="flex gap-4 mb-6">
                          {/* BEFORE */}
                          <div className="w-1/2 aspect-[4/3] rounded-2xl border-2 border-dashed border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-900/10 relative overflow-hidden group">
                             <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md">BEFORE</div>
                             <img src={item.beforeImg} alt="Before" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                          </div>
                          {/* AFTER */}
                          <div className="w-1/2 aspect-[4/3] rounded-2xl border-2 border-dashed border-green-300 dark:border-green-900 bg-green-50 dark:bg-green-900/10 relative overflow-hidden group">
                             <div className="absolute top-2 right-2 z-10 bg-secondary text-white text-[10px] font-bold px-2 py-1 rounded shadow-md">AFTER</div>
                             <img src={item.afterImg} alt="After" className="w-full h-full object-cover" />
                          </div>
                       </div>
                       <div>
                          <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm line-clamp-2">{item.description}</p>
                       </div>
                    </div>
                 </ScrollReveal>
              ))}
           </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="py-24 bg-white dark:bg-bg-dark">
         <div className="container mx-auto px-6">
            <ScrollReveal className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">Kata Mereka</h2>
               <p className="text-slate-500 text-lg">Ribuan pelanggan puas dengan tidur yang lebih berkualitas</p>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {TESTIMONIALS.map((testi, idx) => (
                  <ScrollReveal key={testi.id} delay={idx * 50} className="bg-bg-light dark:bg-bg-surface p-8 rounded-3xl border border-slate-100 dark:border-slate-800 relative group hover:shadow-xl transition-all">
                     <div className="flex gap-1 mb-6">
                        {[...Array(5)].map((_, i) => (
                           <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                        ))}
                     </div>
                     <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed italic">"{testi.content}"</p>
                     <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">{testi.name}</h4>
                        <p className="text-sm text-primary dark:text-primary-light font-medium">{testi.role}</p>
                     </div>
                  </ScrollReveal>
               ))}
            </div>
         </div>
      </section>

      {/* 8. CTA SECTION */}
      <section className="py-24 bg-bg-light dark:bg-bg-dark">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="bg-gradient-to-r from-primary to-blue-600 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 relative z-10">
                Jangan Biarkan Kasur Rusak <br className="hidden md:block" /> Mengganggu Kesehatan Anda
              </h2>
              <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto relative z-10">
                Konsultasikan keluhan kasur Anda sekarang. Gratis survei dan estimasi biaya!
              </p>
              <div className="flex flex-col md:flex-row justify-center items-center gap-6 relative z-10">
                <a 
                  href="https://wa.me/6289528011264?text=Halo%20Sano%20Care,%20saya%20ingin%20konsultasi%20mengenai%20kasur%20saya."
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