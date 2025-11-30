import React from 'react';
import ScrollReveal from '../components/ScrollReveal';
import { Award, ShieldCheck, Sparkles, User } from 'lucide-react';

const TentangKami: React.FC = () => {
  return (
    <div className="pb-24">
      {/* HEADER SECTION */}
      <section className="py-20 bg-bg-light dark:bg-bg-surface text-center">
        <div className="container mx-auto px-6">
           <ScrollReveal>
             <span className="text-primary dark:text-secondary font-bold tracking-widest uppercase text-sm mb-4 block">Our Profile</span>
             <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">Tentang Kami</h1>
             <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                Mengenal lebih dekat siapa di balik kenyamanan tidur Anda.
             </p>
           </ScrollReveal>
        </div>
      </section>

      {/* SECTION 1: OUR STORY */}
      <section className="py-16 bg-white dark:bg-bg-dark">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
             
             {/* LEFT: IMAGE REAL */}
             <ScrollReveal>
                <div className="w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 relative group">
                   <img 
                      src="/sano-masjuri.png" 
                      alt="Workshop Sano Care" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                   />
                   <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors"></div>
                </div>
             </ScrollReveal>

             {/* RIGHT: STORY TEXT */}
             <ScrollReveal delay={200}>
                <div>
                   <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
                      Mengembalikan Kenyamanan Tidur <span className="text-primary">Keluarga Indonesia</span>
                   </h2>
                   <div className="space-y-6 text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                      <p>
                         SANO+ hadir dari sebuah keresahan sederhana: mengapa kita harus membuang kasur atau sofa yang hanya rusak sedikit, lalu mengeluarkan biaya mahal untuk membeli yang baru?
                      </p>
                      <p>
                         Kami percaya bahwa setiap furniture memiliki potensi untuk diperbarui. Dengan teknik restorasi yang tepat dan pemahaman mendalam tentang struktur tulang belakang (ergonomi), kami tidak hanya memperbaiki tampilan fisik, tetapi juga mengembalikan fungsi kesehatan dari kasur Anda.
                      </p>
                      <p className="font-medium text-slate-900 dark:text-white">
                         "Hemat biaya, kurangi limbah, dan bangun tidur dengan tubuh yang lebih segar. Itulah janji kami."
                      </p>
                   </div>

                   {/* SIGNATURE */}
                   <div className="mt-10 flex items-center gap-4 border-t border-slate-100 dark:border-slate-800 pt-8">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
                         <User size={24} />
                      </div>
                      <div>
                         <p className="font-handwriting text-2xl text-slate-800 dark:text-white font-bold sign-font">Founder SANO+</p>
                         <p className="text-sm text-slate-500 dark:text-slate-400">Head Technician & Sleep Consultant</p>
                      </div>
                   </div>
                </div>
             </ScrollReveal>
          </div>
        </div>
      </section>

      {/* SECTION 2: NILAI KAMI */}
      <section className="py-20 bg-bg-light dark:bg-bg-surface">
         <div className="container mx-auto px-6">
            <ScrollReveal className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
                  Kenapa Memilih <span className="text-primary">SANO+?</span>
               </h2>
               <p className="text-slate-500 dark:text-slate-400">Standar kualitas yang kami pegang teguh dalam setiap pengerjaan.</p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <ScrollReveal delay={0}>
                  <div className="bg-white dark:bg-bg-dark p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 h-full hover:-translate-y-2 transition-transform duration-300">
                     <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 text-primary dark:text-blue-400">
                        <Award size={32} />
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Keahlian (Expertise)</h3>
                     <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Didukung oleh teknisi berpengalaman lebih dari 3 tahun yang spesifik menangani berbagai merek kasur premium (King Koil, Serta, Florence, dll).
                     </p>
                  </div>
               </ScrollReveal>

               <ScrollReveal delay={100}>
                  <div className="bg-white dark:bg-bg-dark p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 h-full hover:-translate-y-2 transition-transform duration-300">
                     <div className="w-14 h-14 bg-teal-50 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center mb-6 text-teal-600 dark:text-teal-400">
                        <ShieldCheck size={32} />
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Transparansi (Honesty)</h3>
                     <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Kami memberikan diagnosa jujur di awal. Estimasi harga transparan tanpa biaya tersembunyi. Jika komponen masih bagus, kami katakan bagus.
                     </p>
                  </div>
               </ScrollReveal>

               <ScrollReveal delay={200}>
                  <div className="bg-white dark:bg-bg-dark p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 h-full hover:-translate-y-2 transition-transform duration-300">
                     <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mb-6 text-orange-500 dark:text-orange-400">
                        <Sparkles size={32} />
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Higienis (Hygiene)</h3>
                     <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Proses pengerjaan dilakukan dengan standar kebersihan tinggi. Workshop kami bersih, dan setiap kasur melalui proses sterilisasi sebelum dikirim kembali.
                     </p>
                  </div>
               </ScrollReveal>
            </div>
         </div>
      </section>

      {/* SECTION 3: STATISTICS BAR */}
      <section className="py-12 bg-primary dark:bg-slate-900 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/20 gap-8 md:gap-0">
               <ScrollReveal className="text-center p-4">
                  <p className="text-4xl md:text-5xl font-extrabold mb-2">1200+</p>
                  <p className="text-blue-100 font-medium uppercase tracking-widest text-sm">Proyek Selesai</p>
               </ScrollReveal>
               <ScrollReveal delay={100} className="text-center p-4">
                  <p className="text-4xl md:text-5xl font-extrabold mb-2">98%</p>
                  <p className="text-blue-100 font-medium uppercase tracking-widest text-sm">Pelanggan Puas</p>
               </ScrollReveal>
               <ScrollReveal delay={200} className="text-center p-4">
                  <p className="text-4xl md:text-5xl font-extrabold mb-2">24 Jam</p>
                  <p className="text-blue-100 font-medium uppercase tracking-widest text-sm">Respon Cepat</p>
               </ScrollReveal>
            </div>
         </div>
      </section>
    </div>
  );
};

export default TentangKami;