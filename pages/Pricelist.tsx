import React from 'react';
import { Link } from 'react-router-dom';
import {
  Crown, ArrowRight, MessageCircle, ListPlus
} from 'lucide-react';
import WhatsAppLink from '../components/WhatsAppLink';
import { FACTS } from '../components/landing/landingData';
import { useSEO } from '../hooks/useSEO';

const Pricelist: React.FC = () => {
  useSEO({
    title: 'Harga Upgrade Kasur Sehat',
    description: `Upgrade Kasur Sehat di Klinik Matras by SANO CARE mulai ${FACTS.priceUpgrade}. Harga pasti setelah cek ukuran dan kondisi kasur.`,
    path: '/pricelist',
  });

  const BRAND_BLUE = "#3B62AA"; 

  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      
      {/* HEADER */}
      <div className="text-center px-6 mb-16">
        <div 
          className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border"
          style={{ 
            backgroundColor: `${BRAND_BLUE}15`, 
            color: BRAND_BLUE,
            borderColor: `${BRAND_BLUE}30` 
          }}
        >
          Harga
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
          Harga Upgrade Kasur Sehat
        </h1>
        
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
          Upgrade kasur lama Kamu, tanpa harus beli baru.
        </p>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl mx-auto mt-4 leading-relaxed">
          Harga pasti ditentukan setelah ukuran dan kondisi kasur dicek lewat konsultasi. Belum yakin kasur Kamu perlu apa? Baca dulu{' '}
          <Link to="/perbaikan-kasur-amblas" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">panduan perbaikan kasur amblas</Link>{' '}
          atau lihat{' '}
          <Link to="/klinik-matras" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">seluruh layanan service kasur &amp; springbed</Link>.
        </p>
      </div>

      {/* SATU PAKET: UPGRADE KASUR SEHAT (sama dengan landing) */}
      <div className="container mx-auto px-6 max-w-md mb-20">
        <WhatsAppLink
          message="Halo Sano, saya tertarik dengan paket Upgrade Kasur Sehat"
          eventLabel="Pricelist WA - Upgrade Kasur Sehat"
          buttonId="pricelist-paket-upgrade-kasur-sehat"
          placement="pricing"
          target="_blank"
          rel="noreferrer"
          className="group block p-8 rounded-[2.5rem] bg-[#0F172A] border-2 border-[#3B62AA] shadow-2xl text-white transition-transform duration-500 hover:-translate-y-2"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 rounded-2xl text-white" style={{ backgroundColor: BRAND_BLUE }}><Crown /></div>
            <div className="p-2 rounded-full bg-white/10 text-blue-200"><ArrowRight size={20} /></div>
          </div>
          <h2 className="text-2xl font-bold mb-3 leading-tight text-white">Upgrade Kasur Sehat</h2>
          <p className="text-sm mb-8 leading-relaxed text-slate-300">
            Fondasi dan lapisan diganti ke susunan SFS. Garansi Klinik Matras hingga {FACTS.warrantyUpgrade}.
          </p>
          <div className="border-t border-white/10 pt-6">
            <p className="text-[10px] font-bold uppercase tracking-wide mb-1 text-blue-300">Mulai dari</p>
            <p className="text-4xl font-black text-[#FACC15] drop-shadow-sm">{FACTS.priceUpgrade}</p>
            <p className="text-sm mt-3 text-slate-300">Harga pasti setelah cek ukuran dan kondisi kasurmu.</p>
          </div>
        </WhatsAppLink>
      </div>

      {/* SECTION BAWAH: LAYANAN LAINNYA (CTA) */}
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 md:p-12 border border-slate-200 dark:border-slate-700 shadow-xl text-center relative overflow-hidden">
          
          {/* Hiasan Background */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400"></div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <ListPlus size={32} />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Butuh Layanan Lainnya?
            </h2>
            
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              Kami juga menyediakan layanan: <span className="font-semibold text-slate-800 dark:text-slate-200">Ganti Kain, Potong Ukuran, Tambah Latex, Custom Ukuran, Service Sofa</span>, dan masih banyak lagi.
            </p>

            <WhatsAppLink 
              message="Halo Sano, boleh minta daftar harga lengkap untuk layanan lainnya?"
              eventLabel="Pricelist WA - Harga Lengkap"
              buttonId="pricelist-harga-lengkap"
              placement="cta"
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#3B62AA] text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all hover:scale-105"
            >
              <MessageCircle size={20} />
              Tanya Harga Lengkap via WhatsApp
            </WhatsAppLink>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Pricelist;