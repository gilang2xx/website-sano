import React from 'react';
import { ImagePlus, BadgeCheck } from 'lucide-react';

const BeforeAfter: React.FC = () => {

  // 1. TAMBAHKAN PROPERTY 'beforeImg' DAN 'afterImg' DI SINI
  const projects = [
    { 
      id: 1, 
      title: "Upgrade Fondasi Non Per Matras Sehat", 
      desc: "Pergantian fondasi matras sehat full busa dengan material berkualitas tinggi.",
      beforeImg: "/before-1.jpg", // Pastikan nama file sesuai yg ada di folder public
      afterImg: "/after-1.jpg"
    },
    { 
      id: 2, 
      title: "Upgrade Fondasi + Lapisan Matras Sehat", 
      desc: "Perkokoh Fondasi & Penambahan lapisan pillow top untuk kenyamanan.",
      beforeImg: "/before-2.jpg", // Ganti dengan nama file foto ke-2
      afterImg: "/after-2.jpg"
    },
    { 
      id: 3, 
      title: "Full Upgrade dengan Kain Knitting 3D", 
      desc: "Upgrade fondasi dan ganti kain knitting 3D.",
      beforeImg: "/before-3.jpg", // Ganti dengan nama file foto ke-3
      afterImg: "/after-3.jpg"
    },
    { 
      id: 4, 
      title: "Full Upgrade dengan Kain Knitting 3D", 
      desc: "Upgrade fondasi dan ganti kain knitting 3D.",
      beforeImg: "/before-4.jpg",
      afterImg: "/after-4.jpg"
    },
    { 
      id: 5, 
      title: "Potong Ukuran", 
      desc: "Potong ukuran dengan mesin potong professional.",
      beforeImg: "/before-5.jpg",
      afterImg: "/after-5.jpg"
    },
    // Tambahkan object baru di sini kalau mau nambah foto lagi
  ];

  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      
      {/* HEADER */}
      <div className="container mx-auto px-6 text-center mb-16">
        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
          Portofolio
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
          Galeri <span className="text-[#3B62AA]">Transformasi</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
          Lihat bukti nyata pengerjaan kami. (Halaman ini menggunakan placeholder sementara menunggu dokumentasi proyek terbaru).
        </p>
      </div>

      {/* GRID PROJECT PLACEHOLDERS */}
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {projects.map((project) => (
            <div 
              key={project.id}
              className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 shadow-lg border border-slate-100 dark:border-slate-700/50"
            >
              {/* AREA FOTO BEFORE & AFTER */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                
                {/* 1. FOTO BEFORE (DINAMIS) */}
                <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-hidden group">
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm z-10">
                    BEFORE
                  </div>
                  {/* Perhatikan bagian src={project.beforeImg} di bawah ini */}
                  <img 
                    src={project.beforeImg} 
                    alt={`Before ${project.title}`} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* 2. FOTO AFTER (DINAMIS) */}
                <div className="relative aspect-[4/3] bg-green-500/10 dark:bg-green-900/20 rounded-2xl overflow-hidden group">
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm z-10">
                    AFTER
                  </div>
                  {/* Perhatikan bagian src={project.afterImg} di bawah ini */}
                  <img 
                    src={project.afterImg} 
                    alt={`After ${project.title}`} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

              </div>

              {/* KETERANGAN PROJECT (Tetap sama) */}
              <div className="flex justify-between items-start">
                 {/* ... isinya sama dengan codingan lama ... */}
                 <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {project.desc}
                    </p>
                 </div>
                 {/* Icon BadgeCheck */}
                 <div className="bg-blue-50 dark:bg-slate-700 p-2 rounded-full text-[#3B62AA] dark:text-blue-400">
                    <BadgeCheck size={24} />
                 </div>
              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default BeforeAfter;