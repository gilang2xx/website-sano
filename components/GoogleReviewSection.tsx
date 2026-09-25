import React from 'react';

// Link Google Maps Bisnis
const GOOGLE_MAPS_URL = "https://share.google/KHN37lWodhSGKPYkY";

// Testimonial di constants.ts (TESTIMONIALS) SENGAJA TIDAK DIRENDER: sumber dan izin
// pemberi ulasan belum terverifikasi (keputusan owner, Fase 3C). Tampilkan kembali hanya
// setelah tiap ulasan terbukti ada di Google dan pemberi ulasan mengizinkan. Jangan
// menampilkan angka rating agregat tanpa sumber.
const GoogleReviewSection = () => {
  return (
    <section className="py-20 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center p-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
              alt="Google"
              className="w-8 h-8"
              loading="lazy"
            />
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">Ulasan Pelanggan di Google</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
            Lihat pengalaman pelanggan langsung di Google, atau bagikan pengalaman Anda setelah menggunakan layanan kami.
          </p>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium text-sm transition-all shadow-lg shadow-blue-600/20"
          >
            Lihat &amp; Tulis Ulasan di Google
          </a>
        </div>
      </div>
    </section>
  );
};

export default GoogleReviewSection;
