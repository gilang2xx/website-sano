import React from 'react';
import { 
  Hammer, Zap, Wrench, Layers, Settings, Crown, 
  Feather, Cloud, Scissors, Armchair, Ruler, 
  MoveDiagonal, Sparkles, Clock, FileText, Activity,
  ArrowRight, Star, Tag
} from 'lucide-react';

const Pricelist: React.FC = () => {

  // --- CONFIG WARNA LOGO ---
  // Kode warna biru yang diambil dari logo SANO (Lebih soft/kalem)
  const BRAND_BLUE = "#3B62AA"; 
  const BRAND_BG_DARK = "#0F172A"; // Slate 900 untuk background utama

  const services = [
    // --- 6 LAYANAN UTAMA (PREMIUM HIGHLIGHT) ---
    { 
      id: 1, 
      title: "Service Fondasi Matras", 
      price: 990000, 
      originalPrice: 1450000,
      desc: "Perbaikan struktur dasar agar kokoh kembali.",
      icon: <Hammer />,
      isPremium: true 
    },
    { 
      id: 3, 
      title: "Upgrade Fondasi Sehat", 
      price: 1490000, 
      originalPrice: 2150000,
      desc: "Memperkuat konstruksi penopang utama.",
      icon: <Wrench />,
      isPremium: true 
    },
    { 
      id: 5, 
      title: "Paket Fondasi + Lapisan", 
      price: 1990000, 
      originalPrice: 2850000,
      desc: "Kombo hemat perbaikan struktur & kenyamanan.",
      icon: <Settings />,
      isPremium: true 
    },
    { 
      id: 6, 
      title: "Full Upgrade (All In)", 
      price: 2390000, 
      originalPrice: 3450000,
      desc: "Fondasi + Lapisan + Kain (Renovasi Total).",
      icon: <Crown />,
      isPremium: true 
    },
    { 
      id: 8, 
      title: "Upgrade Lapisan Latex", 
      price: 1790000, 
      originalPrice: 2590000,
      desc: "Tambahan lapisan natural latex anti-alergi.",
      icon: <Feather />,
      isPremium: true 
    },
    { 
      id: 9, 
      title: "Upgrade Memory Foam", 
      price: 1790000, 
      originalPrice: 2590000,
      desc: "Busa teknologi NASA mengikuti lekuk tubuh.",
      icon: <Cloud />,
      isPremium: true 
    },
    { 
      id: 16, 
      title: "Matras Sehat Custom", 
      price: 2790000, 
      originalPrice: 3990000,
      desc: "Pembuatan kasur baru custom full spec.",
      icon: <FileText />,
      isPremium: true 
    },
    { 
      id: 2, 
      title: "Upgrade Fondasi Per", 
      price: 1390000, 
      originalPrice: 1950000,
      desc: "Penggantian/penguatan pegas untuk daya pantul.",
      icon: <Zap />,
      isPremium: true 
    },

    // --- LAYANAN REGULER ---
    { 
      id: 4, 
      title: "Upgrade Lapisan Matras", 
      price: 890000, 
      desc: "Ganti busa kempis dengan material padat.",
      icon: <Layers /> 
    },
    { 
      id: 7, 
      title: "Rubah Tekstur", 
      price: 1090000, 
      desc: "Sesuaikan tingkat kekerasan (Soft/Hard/Medium).",
      icon: <Activity /> 
    },
    { 
      id: 10, 
      title: "Ganti Kain Premium", 
      price: 790000, 
      desc: "Ganti cover kusam dengan kain Knitting mewah.",
      icon: <Scissors /> 
    },
    { 
      id: 11, 
      title: "Potong Ukuran", 
      price: 500000, 
      desc: "Resize kasur besar menjadi lebih kecil.",
      icon: <Ruler /> 
    },
    { 
      id: 12, 
      title: "Tambah Ukuran", 
      price: 1590000, 
      desc: "Menyambung kasur kecil menjadi besar.",
      icon: <MoveDiagonal /> 
    },
    { 
      id: 13, 
      title: "Sterilisasi Tungau", 
      price: 500000, 
      desc: "Deep cleaning basmi tungau & bakteri.",
      icon: <Sparkles /> 
    },
    { 
      id: 14, 
      title: "Service Divan/Sandaran", 
      price: 500000, 
      desc: "Reparasi rangka & ganti kain headboard.",
      icon: <Armchair /> 
    },
    { 
      id: 15, 
      title: "Kasur Sewa", 
      price: 150000, 
      desc: "Solusi kasur pengganti sementara.",
      icon: <Clock /> 
    },
  ];

  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="pt-32 pb-24 min-h-screen transition-colors duration-300 bg-slate-50 dark:bg-slate-900">
      
      {/* Header */}
      <div className="text-center px-6 mb-16">
        <div 
          className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border"
          style={{ 
            backgroundColor: `${BRAND_BLUE}15`, // Transparan 15%
            color: BRAND_BLUE,
            borderColor: `${BRAND_BLUE}30` 
          }}
        >
          Daftar Harga Resmi
        </div>
        
        {/* TULISAN "Layanan SANOCARE" DIHAPUS, JADI HANYA "Pricelist" */}
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
          Pricelist
        </h1>
        
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
          Dapatkan <span className="text-orange-500 font-bold">DISKON SPESIAL</span> untuk paket Premium bulan ini.
        </p>
      </div>

      {/* GRID SECTION */}
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {services.map((service) => (
            <a 
              key={service.id}
              href={`https://wa.me/6285166662896?text=Halo%20Sano,%20saya%20mau%20tanya%20detail%20harga%20untuk%20${service.title}`}
              target="_blank"
              rel="noreferrer"
              // Menggunakan Style dinamis agar warnanya mengikuti BRAND_BLUE
              style={{
                borderColor: service.isPremium ? BRAND_BLUE : '',
              }}
              className={`
                group relative p-6 rounded-[2rem] transition-all duration-500 cursor-pointer flex flex-col justify-between h-full
                ${service.isPremium 
                  // PREMIUM CARD: Background Gelap
                  ? 'bg-[#0F172A] border-2 shadow-2xl hover:scale-105 z-10 text-white' 
                  // REGULAR CARD: White
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1'
                }
              `}
            >
              
              {/* BADGE DISKON (Premium Only) */}
              {service.isPremium && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-600 to-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1 animate-pulse border border-white/20">
                  <Tag size={12} fill="white" /> Save 30%
                </div>
              )}

              {/* Konten Atas */}
              <div>
                <div className="flex justify-between items-start mb-6">
                  {/* ICON CONTAINER */}
                  <div 
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-300 shadow-lg`}
                    style={{
                      // Logic Warna Icon
                      backgroundColor: service.isPremium ? BRAND_BLUE : `${BRAND_BLUE}15`,
                      color: service.isPremium ? 'white' : BRAND_BLUE
                    }}
                  >
                    {service.icon}
                  </div>
                  
                  {/* PANAH POJOK */}
                  <div className={`p-2 rounded-full transition-colors ${
                    service.isPremium
                    ? 'bg-white/10 text-blue-300'
                    : 'bg-slate-50 dark:bg-slate-700 text-slate-400'
                  }`}>
                    <ArrowRight size={18} />
                  </div>
                </div>

                <h3 className={`text-xl font-bold mb-2 leading-tight ${
                  service.isPremium ? 'text-white' : 'text-slate-900 dark:text-white'
                }`}>
                  {service.title}
                </h3>
                
                <p className={`text-sm mb-6 line-clamp-2 ${
                  service.isPremium ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'
                }`}>
                  {service.desc}
                </p>
              </div>

              {/* Konten Bawah (Harga) */}
              <div 
                className="pt-4 border-t"
                style={{ borderColor: service.isPremium ? 'rgba(255,255,255,0.1)' : '' }} // Border samar di kartu premium
              >
                <p className={`text-[10px] font-bold uppercase tracking-wide mb-1 ${
                  service.isPremium ? 'text-blue-300' : 'text-slate-400'
                }`}>
                  Start From (Standard)
                </p>
                
                {/* HARGA */}
                <div className="flex flex-col">
                  {/* Harga Coret */}
                  {service.isPremium && service.originalPrice && (
                    <span className="text-sm text-slate-500 line-through font-medium decoration-red-500/50 decoration-2">
                      {formatRupiah(service.originalPrice)}
                    </span>
                  )}
                  
                  {/* Harga Utama */}
                  <span className={`text-2xl font-black transition-colors ${
                    service.isPremium 
                    // Harga Premium: Kuning Emas
                    ? 'text-[#FACC15] drop-shadow-sm' 
                    // Harga Regular: Mengikuti Warna Brand
                    : 'text-slate-800 dark:text-white'
                  }`}>
                    {formatRupiah(service.price)}
                  </span>
                </div>
              </div>

            </a>
          ))}

        </div>

        {/* Note Kaki */}
        <div className="mt-16 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 py-3 px-6 rounded-full inline-block border border-slate-200 dark:border-slate-700 shadow-sm">
            *Harga "Start From" mengacu pada tipe <span className="font-bold text-slate-900 dark:text-white">Standard</span> ukuran terkecil. Hubungi admin untuk detail ukuran lain.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Pricelist;