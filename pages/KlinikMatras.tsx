import React from 'react';
import { 
  ArrowRight, Layers, Wrench, Scissors, Ruler, 
  BedDouble, Sparkles, Crown, Zap, Settings, 
  Feather, Cloud, Hammer, MoveDiagonal, Clock, MessageCircle, Armchair 
} from 'lucide-react';

const KlinikMatras: React.FC = () => {

  // DAFTAR 16 LAYANAN (Sesuai List + 1 Tambahan)
  const services = [
    { 
      title: "Service Fondasi Matras Sehat", 
      desc: "Perbaikan struktur dasar/rangka bawah kasur agar kembali kokoh dan tidak miring.", 
      icon: <Hammer /> 
    },
    { 
      title: "Upgrade Fondasi Per Matras", 
      desc: "Penggantian atau penguatan pegas (spring) untuk mengembalikan daya pantul maksimal.", 
      icon: <Zap /> 
    },
    { 
      title: "Upgrade Fondasi Matras Sehat", 
      desc: "Memperkuat konstruksi penopang utama matras untuk ketahanan jangka panjang.", 
      icon: <Wrench /> 
    },
    { 
      title: "Upgrade Lapisan Matras Sehat", 
      desc: "Mengganti busa atas yang sudah kempis dengan material baru yang lebih padat.", 
      icon: <Layers /> 
    },
    { 
      title: "Paket Fondasi + Lapisan", 
      desc: "Kombo hemat: Perbaikan struktur dalam sekaligus penggantian lapisan kenyamanan.", 
      icon: <Settings /> 
    },
    { 
      title: "Full Upgrade (Fondasi+Lapisan+Kain)", 
      desc: "Renovasi total! Kasur lama Anda disulap menjadi 100% baru luar dalam.", 
      icon: <Crown /> 
    },
    { 
      title: "Ubah Tekstur (Empuk/Keras)", 
      desc: "Menyesuaikan tingkat kekerasan kasur (Soft/Hard) sesuai kenyamanan punggung Anda.", 
      icon: <Settings /> 
    },
    { 
      title: "Upgrade Lapisan Latex", 
      desc: "Menambahkan lapisan Natural Latex untuk kenyamanan ekstra dan anti-alergi.", 
      icon: <Feather /> 
    },
    { 
      title: "Upgrade Memory Foam", 
      desc: "Menambahkan lapisan Memory Foam yang mengikuti lekuk tubuh untuk tidur tanpa tekanan.", 
      icon: <Cloud /> 
    },
    { 
      title: "Ganti Kain Premium", 
      desc: "Mengganti cover kasur lama yang kusam/robek dengan kain Knitting baru yang mewah.", 
      icon: <Scissors /> 
    },
    { 
      title: "Service Divan / Sandaran", 
      desc: "Reparasi rangka kayu divan yang patah dan ganti kain headboard agar serasi.", 
      icon: <Armchair /> // Menggunakan icon kursi/furniture
    },
    { 
      title: "Potong Ukuran", 
      desc: "Mengecilkan ukuran kasur (Resize) untuk menyesuaikan dengan ruangan baru.", 
      icon: <Ruler /> 
    },
    { 
      title: "Tambah Ukuran", 
      desc: "Menyambung/memperbesar kasur (misal: Single ke Queen) dengan sambungan rapi.", 
      icon: <MoveDiagonal /> 
    },
    { 
      title: "Sterilisasi Tungau/Kutu", 
      desc: "Deep cleaning profesional untuk membasmi tungau, bakteri, dan bau tidak sedap.", 
      icon: <Sparkles /> 
    },
    { 
      title: "Kasur Sewa", 
      desc: "Layanan peminjaman kasur pengganti sementara selama kasur Anda kami perbaiki.", 
      icon: <Clock /> 
    },
    { 
      title: "Konsultasi Spesial", 
      desc: "Punya request khusus lain? Diskusikan dengan ahli kami untuk solusi custom.", 
      icon: <MessageCircle /> 
    },
  ];

  return (
    <div className="pb-24 pt-32 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      
      {/* 1. HEADER SECTION */}
      <section className="container mx-auto px-6 mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
          Layanan <span className="text-blue-600">Klinik Matras</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto text-lg">
          Layanan profesional untuk memperbaiki dan mengupgrade kasur anda menjadi lebih sehat, aman dan nyaman.
        </p>
      </section>

      {/* 2. GRID 16 SERVICES (4x4) */}
      <section className="container mx-auto px-6">
        
        {/* Grid Responsive: 1 kolom (HP) -> 2 kolom (Tablet) -> 4 kolom (Laptop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {services.map((item, index) => (
            <div 
              key={index}
              className="group bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start h-full"
            >
              {/* Icon Container */}
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4 flex-grow">
                {item.desc}
              </p>

              {/* Link / Action */}
              <a href="https://wa.me/6285166662896" target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                Tanya Layanan Ini <ArrowRight size={14} />
              </a>
            </div>
          ))}

        </div>

        {/* CTA Button Bottom */}
        <div className="mt-16 text-center">
          <a 
            href="https://wa.me/6285166662896"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all hover:scale-105"
          >
            Konsultasi Gratis Sekarang
          </a>
        </div>

      </section>

    </div>
  );
};

export default KlinikMatras;