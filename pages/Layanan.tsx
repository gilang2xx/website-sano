import React from 'react';
import ScrollReveal from '../components/ScrollReveal';
import { CheckCircle2, MessageCircle, ArrowRight } from 'lucide-react';

const Layanan: React.FC = () => {
  return (
    <div className="pb-24">
      {/* HERO HEADER */}
      <section className="bg-bg-surface text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Layanan Kami</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">
             Kami menyediakan solusi komprehensif untuk segala kebutuhan furniture Kamu, mulai dari perbaikan struktural hingga perawatan kebersihan berkala.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT SECTION */}
      <section className="py-16 bg-bg-light dark:bg-bg-dark -mt-10 relative z-20">
        <div className="container mx-auto px-6">
            
          {/* SECTION HEADER */}
          <ScrollReveal className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
                Layanan Komprehensif <span className="text-primary">SANO+</span>
             </h2>
             <p className="text-slate-600 dark:text-slate-400 text-lg">
                Pilih solusi perbaikan dan perawatan yang sesuai dengan kebutuhan furniture Kamu.
             </p>
          </ScrollReveal>

          {/* 3-COLUMN GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

             {/* CARD 1: KLINIK MATRAS */}
             <ScrollReveal>
                <div className="group bg-white dark:bg-bg-surface rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden h-full flex flex-col hover:-translate-y-2 transition-transform duration-300">
                   <div className="aspect-[4/3] relative overflow-hidden">
                      <img 
                        src="/pelayanan-matras.png" 
                        alt="Klinik Matras Service" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors"></div>
                   </div>
                   <div className="p-8 flex-grow flex flex-col">
                      <h3 className="text-2xl font-bold text-primary dark:text-white mb-3">Klinik Matras</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                         Layanan spesialis perbaikan dan modifikasi kasur springbed, latex, atau busa agar kembali nyaman seperti baru.
                      </p>
                      <div className="space-y-3 mb-8 flex-grow">
                         <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Cakupan Layanan:</h4>
                         <ul className="space-y-3">
                            {['Ganti Kain Cover (Knitting/Jacquard)', 'Ganti Per / Pegas Rusak', 'Tambah Lapisan Latex / Rebonded', 'Resize Ukuran (Potong/Sambung)'].map((item, i) => (
                               <li key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                                  <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                                  <span>{item}</span>
                               </li>
                            ))}
                         </ul>
                      </div>
                      <a 
                        href="https://wa.me/6285187283900?text=Halo%20Sano,%20saya%20mau%20konsultasi%20layanan%20Klinik%20Matras" 
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-none"
                      >
                         <MessageCircle size={20} /> Konsultasi via WA
                      </a>
                   </div>
                </div>
             </ScrollReveal>

             {/* CARD 2: KLINIK SOFA */}
             <ScrollReveal delay={100}>
                <div className="group bg-white dark:bg-bg-surface rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden h-full flex flex-col hover:-translate-y-2 transition-transform duration-300">
                   <div className="aspect-[4/3] relative overflow-hidden">
                      <img 
                        src="/pelayanan-sofa.png" 
                        alt="Klinik Sofa Service" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-orange-900/10 group-hover:bg-transparent transition-colors"></div>
                   </div>
                   <div className="p-8 flex-grow flex flex-col">
                      <h3 className="text-2xl font-bold text-orange-600 dark:text-white mb-3">Klinik Sofa</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                         Restorasi sofa lama menjadi baru kembali dengan pilihan material premium dan pengerjaan detail.
                      </p>
                      <div className="space-y-3 mb-8 flex-grow">
                         <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Cakupan Layanan:</h4>
                         <ul className="space-y-3">
                            {['Ganti Kulit (Leather) / Fabric', 'Tambah Busa Super High Density', 'Perbaikan Rangka & Karet', 'Plistur Kaki & Finishing Kayu'].map((item, i) => (
                               <li key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                                  <CheckCircle2 size={18} className="text-orange-500 shrink-0 mt-0.5" />
                                  <span>{item}</span>
                               </li>
                            ))}
                         </ul>
                      </div>
                      <a 
                        href="https://wa.me/6285187283900?text=Halo%20Sano,%20saya%20mau%20konsultasi%20layanan%20Klinik%20Sofa"
                        target="_blank"
                        rel="noreferrer" 
                        className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-orange-200 dark:hover:shadow-none"
                      >
                         <MessageCircle size={20} /> Konsultasi via WA
                      </a>
                   </div>
                </div>
             </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Layanan;