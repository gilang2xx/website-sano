import React from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import { MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import WhatsAppLink from '../components/WhatsAppLink';
import { useSEO } from '../hooks/useSEO';

// Tiga layanan yang tampil. Nomor WhatsApp = CS 1 (default WhatsAppLink); label event & ID tombol Klinik Matras/Sofa
// dipertahankan dari versi sebelumnya agar seri data lama tetap sambung. Sano Clean mengikuti pola yang sama.
const SERVICES = [
  {
    id: 'klinik-matras',
    title: 'Klinik Matras',
    description:
      'Perbaikan dan restorasi kasur springbed, busa, atau latex. Pilihan pengerjaan disesuaikan dengan kondisi fondasi, lapisan, dan kain kasur.',
    to: '/klinik-matras',
    detailLabel: 'Detail Klinik Matras',
    image: '/pelayanan-matras.png',
    imageAlt: 'Klinik Matras Service',
    titleClass: 'text-primary dark:text-white',
    overlayClass: 'bg-blue-900/10',
    detailClass: 'text-primary dark:text-blue-300',
    waClass: 'bg-primary hover:bg-primary-dark hover:shadow-blue-200',
    wa: {
      message: 'Halo Sano, saya mau konsultasi layanan Klinik Matras',
      eventLabel: 'Layanan WA - Klinik Matras',
      buttonId: 'layanan-klinik-matras',
    },
  },
  {
    id: 'klinik-sofa',
    title: 'Klinik Sofa',
    description:
      'Perbaikan sofa, penggantian kain atau kulit, serta pembenahan busa dan rangka sesuai kondisi sofa.',
    to: '/klinik-sofa',
    detailLabel: 'Detail Klinik Sofa',
    image: '/pelayanan-sofa.png',
    imageAlt: 'Klinik Sofa Service',
    titleClass: 'text-orange-600 dark:text-white',
    overlayClass: 'bg-orange-900/10',
    detailClass: 'text-orange-700 dark:text-orange-300',
    waClass: 'bg-orange-600 hover:bg-orange-700 hover:shadow-orange-200',
    wa: {
      message: 'Halo Sano, saya mau konsultasi layanan Klinik Sofa',
      eventLabel: 'Layanan WA - Klinik Sofa',
      buttonId: 'layanan-klinik-sofa',
    },
  },
  {
    id: 'sano-clean',
    title: 'Sano Clean',
    description:
      'Layanan pembersihan matras dan sofa. Konsultasikan kondisi barang untuk mengetahui pilihan pembersihan yang sesuai.',
    to: '/sano-clean',
    detailLabel: 'Detail Sano Clean',
    image: null,
    imageAlt: '',
    titleClass: 'text-teal-700 dark:text-white',
    overlayClass: '',
    detailClass: 'text-teal-700 dark:text-teal-300',
    waClass: 'bg-teal-700 hover:bg-teal-800 hover:shadow-teal-200',
    wa: {
      message: 'Halo Sano, saya mau konsultasi layanan Sano Clean',
      eventLabel: 'Layanan WA - Sano Clean',
      buttonId: 'layanan-sano-clean',
    },
  },
] as const;

const Layanan: React.FC = () => {
  useSEO({
    title: 'Layanan Kasur, Sofa, Sano Clean',
    description:
      'Klinik Matras, Klinik Sofa, dan Sano Clean: perbaikan struktur, penggantian lapisan dan kain, hingga pembersihan kasur dan sofa. Konsultasi via WhatsApp.',
    path: '/layanan',
  });
  return (
    <div className="pb-24">
      {/* HERO HEADER */}
      {/* pt-32: ruang untuk header melayang (fixed, ±98px) agar baris pertama H1 tidak tertutup */}
      <section className="bg-bg-surface text-white pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 max-w-4xl mx-auto">
            Layanan Perbaikan dan Perawatan Kasur &amp; Sofa
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">
            Temukan layanan yang sesuai dengan kondisi kasur atau sofa Anda, mulai dari perbaikan struktur, penggantian lapisan dan kain, hingga pembersihan.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT SECTION */}
      <section className="py-16 bg-bg-light dark:bg-bg-dark -mt-10 relative z-20">
        <div className="container mx-auto px-6">

          {/* 3 KARTU LAYANAN: bertumpuk di mobile, tiga kolom di desktop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SERVICES.map((s, i) => (
              <ScrollReveal key={s.id} delay={i * 100} className="h-full">
                <div className="group bg-white dark:bg-bg-surface rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden h-full flex flex-col hover:-translate-y-2 transition-transform duration-300">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    {s.image ? (
                      <>
                        <img
                          src={s.image}
                          alt={s.imageAlt}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className={`absolute inset-0 ${s.overlayClass} group-hover:bg-transparent transition-colors`}></div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-teal-700 to-teal-900 flex items-center justify-center" aria-hidden="true">
                        <Sparkles size={72} className="text-teal-100/80" />
                      </div>
                    )}
                  </div>
                  <div className="p-8 flex-grow flex flex-col">
                    <h2 className={`text-2xl font-bold mb-3 ${s.titleClass}`}>{s.title}</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-8 leading-relaxed flex-grow">
                      {s.description}
                    </p>
                    <div className="space-y-3">
                      <Link
                        to={s.to}
                        className={`w-full py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold flex items-center justify-center gap-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${s.detailClass}`}
                      >
                        {s.detailLabel} <ArrowRight size={18} aria-hidden="true" />
                      </Link>
                      <WhatsAppLink
                        message={s.wa.message}
                        eventLabel={s.wa.eventLabel}
                        buttonId={s.wa.buttonId}
                        placement="service-card"
                        target="_blank"
                        rel="noreferrer"
                        className={`w-full py-4 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:shadow-lg dark:hover:shadow-none ${s.waClass}`}
                      >
                        <MessageCircle size={20} aria-hidden="true" /> Konsultasi via WhatsApp
                      </WhatsAppLink>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* ARAHAN KE DAFTAR HARGA */}
          <ScrollReveal className="mt-14">
            <div className="max-w-3xl mx-auto text-center bg-white dark:bg-bg-surface rounded-3xl border border-slate-100 dark:border-slate-800 shadow-lg px-6 py-8">
              <p className="text-slate-700 dark:text-slate-300 text-lg mb-3">
                Ingin mengetahui perkiraan biaya perbaikan kasur?
              </p>
              <Link
                to="/pricelist"
                className="inline-flex items-center gap-2 font-bold text-primary dark:text-blue-300 hover:underline"
              >
                Lihat estimasi harga service &amp; upgrade kasur <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Layanan;
