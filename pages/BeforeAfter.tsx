import React from 'react';
import { ImagePlus, BadgeCheck } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { loadBeforeAfterEntries } from '../utils/content';

const BeforeAfter: React.FC = () => {
  useSEO({
    title: 'Galeri Before & After — Bukti Hasil Kerja Kami',
    description: 'Lihat transformasi nyata hasil service dan upgrade matras maupun sofa dari pelanggan SANO CARE.',
    path: '/before-after',
    image: '/after-10.jpg',
  });

  // Sumber data: content/before-after/*.md, dikelola lewat /admin (Decap CMS).
  // Tambah foto baru = tambah entri lewat panel admin, bukan edit file ini.
  const projects = loadBeforeAfterEntries();

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
                    loading="lazy"
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
                    loading="lazy"
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