import React from 'react';
import { Search, Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Artikel: React.FC = () => {

  // --- DAFTAR ARTIKEL (Pastikan ada 2 item disini) ---
  const articlesList = [
    // ARTIKEL 1
    {
      id: 1,
      slug: "klinik-matras-by-sano-care",
      title: "Klinik Matras by SANO CARE: Solusi Tidur Sehat dari Akar Permasalahan",
      category: "Klinik Matras by Sano Care",
      date: "26 Des 2025",
      image: "/foto-karyawan.jpg", 
      desc: "Dampak kasur amblas terhadap posisi tulang belakang dan saraf tubuh. Kenali gejala awal dan solusi perbaikannya."
    },
    
    // ARTIKEL 2 
    {
      id: 2,
      slug: "konsep-matras-sehat", 
      title: "Apa Definisi 'Matras Sehat' yang Sebenarnya?",
      category: "Edukasi",
      date: "27 Des 2025",
      image: "/sano-matras.jpg", 
      desc: "Banyak orang salah kaprah mengira kasur sehat itu harus mahal atau sangat empuk. Padahal kuncinya ada pada struktur penopang tulang belakang."
    },

    // ARTIKEL 3
    {
      id: 3,
      slug: "dampak-kasur-rusak",
      title: "Awas! Kasur Anda Mungkin Sedang Merusak Tulang Belakang",
      category: "Edukasi",
      date: "28 Des 2025",
      image: "/kasur-merusak-tulang.jpg", 
      desc: "Klinik Matras by SANO CARE — Hadir untuk Menolong Banyak Orang dari Dampak Kasur yang Salah."
    },

    // ARTIKEL 4
    {
      id: 4,
      slug: "dampak-jangka-panjang-kasur-salah",
      title: "Dampak Jangka Panjang Menggunakan Kasur yang Salah: Bahaya yang Mengintai di Balik Tidur Anda",
      category: "Edukasi",
      date: "28 Des 2025",
      image: "/dampak-kasur-salah.jpg", 
      desc: "Kerusakan struktur kasur atau struktur tidak sesuai dengan tubuh yang dibiarkan bertahun-tahun akan memaksa tubuh beradaptasi secara tidak alami."
    },

    // ARTIKEL 5 
    {
      id: 5,
      slug: "mengenal-struktur-kasur",
      title: "Mengenal Struktur Kasur dari Dalam: Mengapa Komponen Matras Menentukan Kesehatan Anda?",
      category: "Edukasi",
      date: "29 Des 2025",
      image: "/komponen-kasur.jpg", 
      desc: "Struktur komponen dalam kasur: fondasi, lapisan kenyamanan, dan kain penutup. Bagaimana masing-masing berkontribusi pada kesehatan tidur Anda."
    },
    
    // ARTIKEL 6
    {
      id: 6, 
      slug: "kasur-ortopedik-untuk-tidur-sehat",
      title: "Perbedaan Kasur Ortopedik dan Matras Sehat: Mana yang Lebih Baik untuk Tidur Sehat?",
      category: "Edukasi",
      date: "30 Des 2025",
      image: "/ortomedic-vs-sehat.jpg", 
      desc: "Apa itu kasur ortopedik dan bagaimana kasur ini dirancang khusus untuk mendukung kesehatan tulang belakang serta mengurangi nyeri punggung."
    },
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