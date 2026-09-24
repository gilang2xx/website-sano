import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';

// Dirender untuk URL yang tidak dikenal. scripts/prerender.mjs menulisnya ke
// dist/404.html; Vercel menyajikan file itu dengan status HTTP 404 untuk path
// yang tidak cocok dengan file/route mana pun. noindex + tanpa canonical.
const NotFound: React.FC = () => {
  useSEO({
    title: 'Halaman Tidak Ditemukan',
    description: 'Halaman yang Anda cari tidak tersedia atau sudah dipindahkan.',
    path: '/404',
    noindex: true,
  });
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-center px-4">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Halaman Tidak Ditemukan</h1>
      <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-md">
        Alamat yang Anda buka tidak tersedia atau sudah dipindahkan.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link to="/" className="text-blue-600 hover:underline">Kembali ke Beranda</Link>
        <Link to="/layanan" className="text-blue-600 hover:underline">Lihat Layanan</Link>
      </div>
    </div>
  );
};

export default NotFound;
