import React from 'react';
import { CLEAN_SERVICES } from '../constants';
import ScrollReveal from '../components/ScrollReveal';
import * as Icons from 'lucide-react';
import { ArrowRight, Sparkles } from 'lucide-react';

const SanoClean: React.FC = () => {
  return (
    <div className="pb-24">
      <section className="bg-teal-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-200 text-sm font-semibold mb-4 border border-white/20"><Sparkles size={14} /><span>Deep Cleaning Service</span></div>
             <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">Sano Clean</h1>
             <p className="text-slate-200 max-w-xl text-lg mb-8">Jaga kebersihan soft furniture Kamu dari debu, tungau, dan bakteri. Keluarga sehat berawal dari kasur dan sofa yang bersih.</p>
             <a href="https://wa.me/6285187283900?text=Halo%20Sano%20Clean,%20saya%20mau%20booking%20jadwal%20Deep%20Cleaning." target="_blank" rel="noreferrer" className="bg-white text-teal-800 font-bold px-8 py-3 rounded-full hover:bg-teal-50 transition-colors inline-block">Pesan Jasa Cuci</a>
          </div>
          <div className="flex-1 flex justify-end">
             <div className="w-full max-w-md h-64 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 relative">
                 <div className="absolute -top-4 -right-4 bg-teal-500 text-white p-4 rounded-xl shadow-lg"><Icons.Droplets size={32} /></div>
                <h3 className="text-xl font-bold mb-4">Metode Pembersihan</h3>
                <ul className="space-y-3">
                   {['Deep Dust Extraction', 'Wet & Dry Cleaning', 'Anti Bacterial Treatment', 'Pengeringan Cepat'].map((item, i) => (
                      <li key={i} className="flex items-center gap-2"><Icons.CheckCircle2 className="text-teal-400" size={18} /><span className="text-slate-200 text-sm">{item}</span></li>
                   ))}
                </ul>
             </div>
          </div>
        </div>
      </section>
      <div className="container mx-auto px-6 -mt-10 relative z-20">
        <div className="grid gap-8">
          {CLEAN_SERVICES.map((service, idx) => {
             const IconComponent = (Icons as any)[service.iconName] || Icons.HelpCircle;
             const images = [
               "https://images.unsplash.com/photo-1581539250439-c96689b516dd?q=80&w=800", // Cleaning 1
               "https://images.unsplash.com/photo-1527513914613-acd5bed71623?q=80&w=800"  // Cleaning 2
             ];
             const imgSrc = images[idx % images.length];

             return (
                <ScrollReveal key={service.id} delay={idx * 50} className="bg-white dark:bg-bg-dark rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden">
                   <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-8">
                      <div className="md:col-span-4 h-64 md:h-auto relative overflow-hidden group">
                         <img src={imgSrc} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                         <div className="absolute inset-0 bg-teal-600/20 group-hover:bg-transparent transition-colors"></div>
                      </div>
                      <div className="md:col-span-8 p-8 md:py-12 md:pr-12 flex flex-col justify-center">
                         <div className="flex items-center gap-4 mb-4"><div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center"><IconComponent size={24} className="text-teal-600 dark:text-teal-400" /></div><h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{service.title}</h2></div>
                         <p className="text-slate-600 dark:text-text-muted text-lg mb-6 leading-relaxed">{service.description}</p>
                         <a href="https://wa.me/6285187283900?text=Halo%20Sano%20Clean,%20saya%20mau%20booking%20jadwal%20Deep%20Cleaning." target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold hover:underline">Booking {service.title} <ArrowRight size={20} /></a>
                      </div>
                   </div>
                </ScrollReveal>
             );
          })}
        </div>
      </div>
    </div>
  );
};

export default SanoClean;