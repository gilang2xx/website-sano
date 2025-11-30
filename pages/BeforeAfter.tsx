import React from 'react';
import { BEFORE_AFTER_DATA } from '../constants';
import ScrollReveal from '../components/ScrollReveal';

const BeforeAfter: React.FC = () => {
  const galleryData = [...BEFORE_AFTER_DATA, ...BEFORE_AFTER_DATA]; 

  return (
    <div className="pb-24">
       <section className="bg-primary-dark text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/50"></div>
        <div className="container mx-auto px-6 relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Galeri Transformasi</h1>
          <p className="text-blue-200 text-lg max-w-2xl">
            Panduan dokumentasi proyek restorasi. Berikut adalah contoh hasil pengerjaan kami dalam format perbandingan.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           {galleryData.map((item, idx) => (
             <ScrollReveal key={`${item.id}-${idx}`} delay={idx * 50}>
                <div className="bg-white dark:bg-bg-surface rounded-3xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-800 p-6">
                   <div className="flex gap-4 mb-6">
                      {/* BEFORE */}
                      <div className="w-1/2 aspect-[4/3] rounded-2xl border-2 border-dashed border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-900/10 relative overflow-hidden group">
                         <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md">BEFORE</div>
                         <img 
                           src={item.beforeImg} 
                           alt={`Before ${item.title}`} 
                           className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0" 
                         />
                      </div>
                      {/* AFTER */}
                      <div className="w-1/2 aspect-[4/3] rounded-2xl border-2 border-dashed border-green-300 dark:border-green-900 bg-green-50 dark:bg-green-900/10 relative overflow-hidden group">
                         <div className="absolute top-2 right-2 z-10 bg-secondary text-white text-[10px] font-bold px-2 py-1 rounded shadow-md">AFTER</div>
                         <img 
                           src={item.afterImg} 
                           alt={`After ${item.title}`} 
                           className="w-full h-full object-cover" 
                         />
                      </div>
                   </div>
                   <div>
                      <div className="flex justify-between items-start mb-2">
                         <h3 className="font-bold text-lg md:text-xl text-slate-900 dark:text-white leading-tight">{item.title}</h3>
                         <span className="text-[10px] font-bold px-2 py-1 bg-blue-50 dark:bg-slate-700 rounded text-primary dark:text-blue-300 uppercase tracking-wider shrink-0 ml-2">{item.category}</span>
                      </div>
                      <p className="text-slate-500 dark:text-text-muted text-sm leading-relaxed">{item.description}</p>
                   </div>
                </div>
             </ScrollReveal>
           ))}
        </div>
      </div>
    </div>
  );
};

export default BeforeAfter;