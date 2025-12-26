import React from 'react';
import { Search, Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Artikel: React.FC = () => {

  // --- DAFTAR ARTIKEL (Pastikan ada 2 item disini) ---
  const articlesList = [
    // ARTIKEL 1
    {
      id: 1,
      slug: "dampak-kasur-rusak",
      title: "Waspada! Ini Dampak Kasur Tidak Sehat Bagi Tubuh Anda",
      category: "Kesehatan Tidur",
      date: "26 Des 2025",
      image: "/dampak-kasur-slpunggung.png", 
      desc: "Jangan anggap remeh. Mulai dari bangun tidur leher kaku, sakit pinggang, hingga risiko fatal saraf kejepit (HNP). Simak penjelasan medisnya di sini."
    },
    
    // ARTIKEL 2 (YANG SEBELUMNYA HILANG)
    {
      id: 2,
      slug: "konsep-matras-sehat", // <--- Slug ini harus sama dengan di ArtikelDetail
      title: "Apa Definisi 'Matras Sehat' yang Sebenarnya?",
      category: "Edukasi",
      date: "27 Des 2025",
      image: "/sano-matras.jpg", // Ganti dengan gambar yang sesuai
      desc: "Banyak orang salah kaprah mengira kasur sehat itu harus mahal atau sangat empuk. Padahal kuncinya ada pada struktur penopang tulang belakang."
    }
  ];

  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      
      <div className="container mx-auto px-6 mb-16 text-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
          SANO CARE BLOG
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
          Artikel & <span className="text-blue-600">Edukasi</span>
        </h1>
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto relative">
          <input type="text" placeholder="Cari artikel kesehatan..." className="w-full pl-12 pr-4 py-3 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all shadow-sm" />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articlesList.map((item) => (
            <Link to={`/artikel/${item.slug}`} key={item.id} className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 dark:border-slate-700 flex flex-col h-full cursor-pointer hover:-translate-y-2">
              <div className="w-full h-48 relative overflow-hidden">
                <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-600 flex items-center gap-1">
                  <Tag size={12} /> {item.category}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                  <span className="flex items-center gap-1"><Calendar size={14}/> {item.date}</span>
                  <span className="flex items-center gap-1"><User size={14}/> Admin</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 mb-6 flex-grow">
                  {item.desc}
                </p>
                <div className="mt-auto flex items-center text-blue-600 font-bold text-sm gap-1 group-hover:gap-2 transition-all">
                  Baca Selengkapnya <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Artikel;