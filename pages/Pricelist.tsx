import React from 'react';
import { 
  Hammer, Wrench, Crown, ArrowRight, Tag, MessageCircle, ListPlus
} from 'lucide-react';

const Pricelist: React.FC = () => {

  const BRAND_BLUE = "#3B62AA"; 

  // HANYA 3 LAYANAN UTAMA
  const services = [
    { 
      id: 1, 
      title: "Service Fondasi Matras", 
      price: 990000, 
      originalPrice: 1450000,
      desc: "Perbaikan struktur dasar/rangka bawah kasur agar kembali kokoh dan tidak miring.",
      icon: <Hammer />,
      isPremium: false // Standard
    },
    { 
      id: 2, 
      title: "Upgrade Fondasi Sehat", 
      price: 1490000, 
      originalPrice: 2150000,
      desc: "Memperkuat konstruksi penopang utama matras untuk kesehatan tulang punggung.",
      icon: <Wrench />,
      isPremium: false // Mid-tier
    },
    { 
      id: 3, 
      title: "Full Upgrade (All In)", 
      price: 2390000, 
      originalPrice: 3450000,
      desc: "Fondasi + Lapisan + Kain (Renovasi Total). Kasur lama disulap jadi baru.",
      icon: <Crown />,
      isPremium: true // Paling Best Seller
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
    <div className="pt-32 pb-24 min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      
      {/* HEADER */}
      <div className="text-center px-6 mb-16">
        <div 
          className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border"
          style={{ 
            backgroundColor: `${BRAND_BLUE}15`, 
            color: BRAND_BLUE,
            borderColor: `${BRAND_BLUE}30` 
          }}
        >
          Paket Utama
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
          Pricelist
        </h1>
        
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
          Pilih paket restorasi terbaik untuk kenyamanan tidur Kamu.
        </p>
      </div>

      {/* GRID 3 KARTU UTAMA */}
      <div className="container mx-auto px-6 max-w-6xl mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {services.map((service) => (
            <a 
              key={service.id}
              href={`https://wa.me/6285187283900?text=Halo%20Sano,%20saya%20tertarik%20dengan%20paket%20${service.title}`}
              target="_blank"
              rel="noreferrer"
              // Jika Premium, kartu lebih besar sedikit (scale-105 di desktop)
              className={`
                group relative p-8 rounded-[2.5rem] transition-all duration-500 cursor-pointer flex flex-col justify-between h-full
                ${service.isPremium 
                  // STYLE PREMIUM (Tengah/Highlight)
                  ? 'bg-[#0F172A] border-2 border-[#3B62AA] shadow-2xl md:-translate-y-4 md:scale-105 z-10 text-white' 
                  // STYLE STANDARD
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:-translate-y-2'
                }
              `}
            >
              
              {/* BADGE BEST VALUE (Hanya Premium) */}
              {service.isPremium && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1 animate-pulse border-2 border-slate-900">
                  <Tag size={14} fill="white" /> Best Value
                </div>
              )}

              {/* Konten Atas */}
              <div>
                <div className="flex justify-between items-start mb-8">
                  <div 
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-300 shadow-lg`}
                    style={{
                      backgroundColor: service.isPremium ? '#3B62AA' : `${BRAND_BLUE}15`,
                      color: service.isPremium ? 'white' : BRAND_BLUE
                    }}
                  >
                    {service.icon}
                  </div>
                  
                  <div className={`p-2 rounded-full transition-colors ${
                    service.isPremium ? 'bg-white/10 text-blue-200' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                  }`}>
                    <ArrowRight size={20} />
                  </div>
                </div>

                <h3 className={`text-2xl font-bold mb-3 leading-tight ${
                  service.isPremium ? 'text-white' : 'text-slate-900 dark:text-white'
                }`}>
                  {service.title}
                </h3>
                
                <p className={`text-sm mb-8 leading-relaxed ${
                  service.isPremium ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
                }`}>
                  {service.desc}
                </p>
              </div>

              {/* Konten Bawah (Harga) */}
              <div 
                className="pt-6 border-t"
                style={{ borderColor: service.isPremium ? 'rgba(255,255,255,0.1)' : '' }}
              >
                <p className={`text-[10px] font-bold uppercase tracking-wide mb-1 ${
                  service.isPremium ? 'text-blue-300' : 'text-slate-400'
                }`}>
                  Start From (Standard)
                </p>
                
                <div className="flex flex-col">
                  {/* Harga Coret */}
                  <span className="text-sm text-slate-500 line-through font-medium decoration-red-500/50 decoration-2">
                    {formatRupiah(service.originalPrice)}
                  </span>
                  
                  {/* Harga Utama */}
                  <span className={`text-3xl font-black transition-colors ${
                    service.isPremium 
                    ? 'text-[#FACC15] drop-shadow-sm' 
                    : 'text-slate-800 dark:text-white group-hover:text-[#3B62AA]'
                  }`}>
                    {formatRupiah(service.price)}
                  </span>
                </div>
              </div>
            </a>
          ))}

        </div>
      </div>

      {/* SECTION BAWAH: LAYANAN LAINNYA (CTA) */}
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 md:p-12 border border-slate-200 dark:border-slate-700 shadow-xl text-center relative overflow-hidden">
          
          {/* Hiasan Background */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400"></div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <ListPlus size={32} />
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Butuh Layanan Lainnya?
            </h3>
            
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              Kami juga menyediakan layanan: <span className="font-semibold text-slate-800 dark:text-slate-200">Ganti Kain, Potong Ukuran, Tambah Latex, Custom Ukuran, Sterilisasi Tungau, Service Sofa</span>, dan masih banyak lagi.
            </p>

            <a 
              href="https://wa.me/6285187283900?text=Halo%20Sano,%20boleh%20minta%20daftar%20harga%20lengkap%20untuk%20layanan%20lainnya?"
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#3B62AA] text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all hover:scale-105"
            >
              <MessageCircle size={20} />
              Tanya Harga Lengkap via WhatsApp
            </a>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Pricelist;