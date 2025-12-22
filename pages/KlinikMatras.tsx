import React from 'react';
import { motion } from 'framer-motion'; // Import Framer Motion untuk animasi
import { 
  ArrowRight, Layers, Wrench, Scissors, Ruler, 
  BedDouble, Sparkles, Crown, Zap, Settings, 
  Feather, Cloud, Hammer, MoveDiagonal, Clock, MessageCircle,
  Armchair, Star
} from 'lucide-react';

const KlinikMatras: React.FC = () => {

  // DAFTAR 16 LAYANAN
  const services = [
    // --- TOP 8 (AKAN DI-HIGHLIGHT) ---
    { title: "Service Fondasi Matras Sehat", desc: "Perbaikan struktur dasar/rangka bawah kasur agar kembali kokoh dan tidak miring.", icon: <Hammer /> },
    { title: "Upgrade Fondasi Per Matras", desc: "Penggantian atau penguatan pegas (spring) untuk mengembalikan daya pantul maksimal.", icon: <Zap /> },
    { title: "Upgrade Fondasi Matras Sehat", desc: "Memperkuat konstruksi penopang utama matras untuk ketahanan jangka panjang.", icon: <Wrench /> },
    { title: "Upgrade Lapisan Matras Sehat", desc: "Mengganti busa atas yang sudah kempis dengan material baru yang lebih padat.", icon: <Layers /> },
    { title: "Paket Fondasi + Lapisan", desc: "Kombo hemat: Perbaikan struktur dalam sekaligus penggantian lapisan kenyamanan.", icon: <Settings /> },
    { title: "Full Upgrade (All in)", desc: "Renovasi total! Kasur lama Anda disulap menjadi 100% baru luar dalam.", icon: <Crown /> },
    { title: "Ubah Tekstur (Empuk/Keras)", desc: "Menyesuaikan tingkat kekerasan kasur (Soft/Hard) sesuai kenyamanan punggung Anda.", icon: <Settings /> },
    { title: "Upgrade Lapisan Latex", desc: "Menambahkan lapisan Natural Latex untuk kenyamanan ekstra dan anti-alergi.", icon: <Feather /> },
    
    // --- BOTTOM 8 (STANDARD) ---
    { title: "Upgrade Memory Foam", desc: "Menambahkan lapisan Memory Foam yang mengikuti lekuk tubuh.", icon: <Cloud /> },
    { title: "Ganti Kain Premium", desc: "Mengganti cover kasur lama yang kusam/robek dengan kain Knitting baru.", icon: <Scissors /> },
    { title: "Service Divan / Sandaran", desc: "Reparasi rangka kayu divan yang patah dan ganti kain headboard.", icon: <Armchair /> },
    { title: "Potong Ukuran", desc: "Mengecilkan ukuran kasur (Resize) untuk menyesuaikan dengan ruangan baru.", icon: <Ruler /> },
    { title: "Tambah Ukuran", desc: "Menyambung/memperbesar kasur (misal: Single ke Queen) rapi.", icon: <MoveDiagonal /> },
    { title: "Sterilisasi Tungau/Kutu", desc: "Deep cleaning profesional untuk membasmi tungau, bakteri, dan bau.", icon: <Sparkles /> },
    { title: "Kasur Sewa", desc: "Layanan peminjaman kasur pengganti sementara selama perbaikan.", icon: <Clock /> },
    { title: "Konsultasi Spesial", desc: "Punya request khusus lain? Diskusikan dengan ahli kami.", icon: <MessageCircle /> },
  ];

  // KONFIGURASI ANIMASI STAGGER
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1 // Jeda 0.1 detik antar kartu
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 }, // Muncul dari bawah
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
            Spesialisasi Kami
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
            Layanan <span className="text-blue-600">Klinik Matras</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto text-lg">
            Kami membagi layanan menjadi dua kategori: <span className="font-bold text-blue-600">Layanan Utama (Core)</span> untuk perbaikan struktur vital, dan <span className="font-bold text-slate-500">Layanan Pendukung</span> untuk penyempurnaan.
          </p>
        </motion.div>
      </section>

      {/* 2. GRID 16 SERVICES (ANIMATED) */}
      <section className="container mx-auto px-6 max-w-7xl">
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          
          {services.map((item, index) => {
            // LOGIKA HIGHLIGHT: Jika index kurang dari 8 (0-7), maka dia Highlight
            const isHighlight = index < 8;

            return (
              <motion.div 
                key={index}
                variants={itemVariants} // Terapkan animasi per item
                className={`
                  group relative p-6 rounded-3xl transition-all duration-300 flex flex-col items-start h-full cursor-pointer
                  ${isHighlight 
                    // STYLE UNTUK 8 TERATAS (Highlight Blue)
                    ? 'bg-white dark:bg-slate-800 border-2 border-blue-500 shadow-[0_4px_20px_rgba(37,99,235,0.15)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.25)] hover:-translate-y-2 z-10' 
                    // STYLE UNTUK 8 TERBAWAH (Standard)
                    : 'bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg hover:-translate-y-1'
                  }
                `}
              >
                {/* Badge "Core Service" untuk 8 Teratas */}
                {isHighlight && (
                  <div className="absolute -top-3 left-6 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Star size={10} fill="white" /> UTAMA
                  </div>
                )}

                {/* Icon Container */}
                <div className={`
                  w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110
                  ${isHighlight 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600'
                  }
                `}>
                  {item.icon}
                </div>

                {/* Title */}
                <h3 className={`text-lg font-bold mb-2 leading-tight transition-colors ${
                  isHighlight ? 'text-blue-900 dark:text-blue-100 group-hover:text-blue-600' : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900'
                }`}>
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4 flex-grow">
                  {item.desc}
                </p>

                {/* Link / Action */}
                <div className={`text-xs font-bold flex items-center gap-1 transition-all mt-auto ${
                  isHighlight ? 'text-blue-600 gap-2' : 'text-slate-400 group-hover:text-blue-500 group-hover:gap-2'
                }`}>
                  Info Detail <ArrowRight size={14} />
                </div>
              </motion.div>
            );
          })}

        </motion.div>

        {/* CTA Button Bottom */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 1 }} // Muncul belakangan setelah kartu
          className="mt-20 text-center"
        >
          <p className="text-slate-500 mb-6">Masih bingung masalah kasur Anda yang mana?</p>
          <a 
            href="https://wa.me/6285166662896"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-bold shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-1 transition-all"
          >
            Konsultasi Gratis dengan Ahli
          </a>
        </motion.div>

      </section>

    </div>
  );
};

export default KlinikMatras;