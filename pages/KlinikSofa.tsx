import React from 'react';
import { SOFA_SERVICES } from '../constants';
import ScrollReveal from '../components/ScrollReveal';
import * as Icons from 'lucide-react';
import { ArrowRight, Armchair } from 'lucide-react';

const KlinikSofa: React.FC = () => {
  return (
    <div className="pb-24">
      <section className="bg-orange-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-orange-200 text-sm font-semibold mb-4 border border-white/20"><Armchair size={14} /><span>Interior & Furniture Restoration</span></div>
             <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">Klinik Sofa</h1>
             <p className="text-slate-200 max-w-xl text-lg mb-8">Restorasi sofa dan divan kesayangan Anda agar kembali cantik, kokoh, dan sesuai dengan estetika interior ruangan.</p>
             <a href="https://wa.me/6289528011264?text=Halo%20Admin,%20saya%20mau%20tanya%20harga%20untuk%20Custom/Service%20Sofa." target="_blank" rel="noreferrer" className="bg-white text-orange-900 font-bold px-8 py-3 rounded-full hover:bg-orange-50 transition-colors inline-block">Konsultasi Sofa</a>
          </div>
          <div className="flex-1 flex justify-end">
             <div className="w-full max-w-md h-64 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 relative">
                 <div className="absolute -top-4 -right-4 bg-orange-600 text-white p-4 rounded-xl shadow-lg"><Icons.Palette size={32} /></div>
                <h3 className="text-xl font-bold mb-4">Layanan Unggulan</h3>
                <ul className="space-y-3">
                   {['Banyak Pilihan Kain', 'Busa High Density', 'Rangka Kayu Oven', 'Jahitan Rapi'].map((item, i) => (
                      <li key={i} className="flex items-center gap-2"><Icons.CheckCircle2 className="text-orange-400" size={18} /><span className="text-slate-200 text-sm">{item}</span></li>
                   ))}
                </ul>
             </div>
          </div>
        </div>
      </section>
      <div className="container mx-auto px-6 -mt-10 relative z-20">
        <div className="grid gap-8">
          {SOFA_SERVICES.map((service, idx) => {
             const IconComponent = (Icons as any)[service.iconName] || Icons.HelpCircle;
             const images = [
               "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800", // Service
               "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=800"  // Custom
             ];
             const imgSrc = images[idx % images.length];

             return (
                <ScrollReveal key={service.id} delay={idx * 50} className="bg-white dark:bg-bg-dark rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden">
                   <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-8">
                      <div className="md:col-span-4 h-64 md:h-auto relative overflow-hidden group">
                         <img src={imgSrc} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                         <div className="absolute inset-0 bg-orange-600/20 group-hover:bg-transparent transition-colors"></div>
                      </div>
                      <div className="md:col-span-8 p-8 md:py-12 md:pr-12 flex flex-col justify-center">
                         <div className="flex items-center gap-4 mb-4"><div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center"><IconComponent size={24} className="text-orange-600 dark:text-orange-400" /></div><h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{service.title}</h2></div>
                         <p className="text-slate-600 dark:text-text-muted text-lg mb-6 leading-relaxed">{service.description}</p>
                         <a href={`https://wa.me/6289528011264?text=Halo%20Sano%20Care,%20saya%20tertarik%20dengan%20layanan%20${encodeURIComponent(service.title)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold hover:underline">Info Harga {service.title} <ArrowRight size={20} /></a>
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

export default KlinikSofa;