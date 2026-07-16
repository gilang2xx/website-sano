import React from 'react';
import { Star } from 'lucide-react'; 
import { TESTIMONIALS } from '../constants'; 

// Link Google Maps Bisnis Kamu
const GOOGLE_MAPS_URL = "https://share.google/KHN37lWodhSGKPYkY"; 

// Array warna untuk inisial (pengganti testi.color biar tidak error)
const COLORS = [
  "bg-red-500", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500"
];

const GoogleReviewSection = () => {
  return (
    <section className="py-24 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="container mx-auto px-6">
        
        {/* JUDUL */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            Kata Mereka Tentang Kami
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Ribuan pelanggan puas dengan tidur yang lebih berkualitas
          </p>
        </div>

        {/* CONTAINER UTAMA */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-start max-w-7xl mx-auto">
          
          {/* BAGIAN KIRI: SUMMARY RATING */}
          <div className="w-full lg:w-1/3 flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm text-center sticky top-24">
            <div className="flex items-center gap-2 mb-2">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
                alt="Google" 
                className="w-8 h-8"
              />
              <span className="font-bold text-slate-700 dark:text-white text-xl">Google Rating</span>
            </div>
            
            <div className="text-7xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
              5.0
            </div>
            
            <div className="flex gap-1 mb-3 justify-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={28} className="fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            
            <p className="text-slate-500 text-sm mb-8">Based on all reviews</p>
            
            <div className="w-full h-px bg-slate-200 dark:bg-slate-700 mb-6"></div>

            <a 
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium text-sm transition-all w-full md:w-auto shadow-lg shadow-blue-600/20 block cursor-pointer"
            >
              Tulis Review di Google
            </a>
          </div>

          {/* BAGIAN KANAN: LIST REVIEW */}
          <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-5">
            {TESTIMONIALS.map((testi, idx) => {
              // Ambil warna berdasarkan urutan index (biar variatif)
              const randomColor = COLORS[idx % COLORS.length];

              return (
                // PASTIKAN INI TAG <A>, BUKAN <DIV>
                <a 
                  key={testi.id}
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100 dark:border-slate-700 relative hover:-translate-y-1 transition-transform duration-300 group block cursor-pointer"
                >
                  {/* Logo G Kecil */}
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
                    className="absolute top-6 right-6 w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
                    alt="Source"
                  />

                  {/* Profil User */}
                  <div className="flex items-center gap-3 mb-4">
                    {/* Menggunakan randomColor di sini */}
                    <div className={`w-10 h-10 rounded-full ${randomColor} text-white flex items-center justify-center font-bold text-lg shadow-md`}>
                      {testi.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-tight group-hover:text-blue-500 transition-colors">
                        {testi.name}
                      </h4>
                      {/* Menggunakan optional chaining (?.) untuk safety jika date belum ada */}
                      <p className="text-xs text-slate-400 mt-0.5">{(testi as any).date || "1 month ago"}</p>
                    </div>
                  </div>

                  {/* Bintang */}
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < testi.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                    ))}
                  </div>

                  {/* Isi Review */}
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-4 min-h-[5rem]">
                    "{testi.desc}"
                  </p>
                  
                  <span className="text-blue-500 text-xs font-medium mt-3 inline-block hover:underline">
                    Read more
                  </span>
                </a>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

export default GoogleReviewSection;