import React from 'react';
import { ImagePlus, BadgeCheck } from 'lucide-react';

const BeforeAfter: React.FC = () => {

  // DATA DUMMY (Nanti tinggal ganti title dan desc-nya saat sudah ada foto)
  const projects = [
    { id: 1, title: "Restorasi Spring Bed Rusak", desc: "Penggantian pegas patah dan kain cover premium." },
    { id: 2, title: "Upgrade ke Latex", desc: "Penambahan lapisan natural latex 5cm untuk kenyamanan." },
    { id: 3, title: "Ganti Kain Cover Mewah", desc: "Peremajaan tampilan dengan kain knitting 3D." },
    { id: 4, title: "Custom Size King", desc: "Modifikasi ukuran dari Queen ke King size." },
    { id: 5, title: "Perbaikan Sofa Kulit", desc: "Ganti kulit sofa yang pecah-pecah menjadi baru." },
    { id: 6, title: "Deep Cleaning Matras", desc: "Pembersihan total noda membandel dan tungau." },
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
              className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300"
            >
              {/* AREA FOTO BEFORE & AFTER */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                
                {/* 1. PLACEHOLDER BEFORE */}
                <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-900 rounded-xl border-2 border-dashed border-red-300 flex flex-col items-center justify-center text-center p-4 group cursor-pointer hover:bg-red-50 dark:hover:bg-slate-800 transition-colors">
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">BEFORE</div>
                  <ImagePlus className="text-slate-400 mb-2 group-hover:text-red-400 transition-colors" size={32} />
                  <p className="text-xs text-slate-400 font-mono">Upload Foto Rusak<br/>(600x450px)</p>
                </div>

                {/* 2. PLACEHOLDER AFTER */}
                <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-900 rounded-xl border-2 border-dashed border-green-300 flex flex-col items-center justify-center text-center p-4 group cursor-pointer hover:bg-green-50 dark:hover:bg-slate-800 transition-colors">
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">AFTER</div>
                  <ImagePlus className="text-slate-400 mb-2 group-hover:text-green-400 transition-colors" size={32} />
                  <p className="text-xs text-slate-400 font-mono">Upload Foto Bagus<br/>(600x450px)</p>
                </div>

              </div>

              {/* KETERANGAN PROJECT */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {project.desc}
                  </p>
                </div>
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