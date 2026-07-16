import React, { Suspense, lazy } from 'react'; // Tambah Suspense & lazy
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

// GANTI IMPORT BIASA MENJADI LAZY IMPORT
const Home = lazy(() => import('./pages/Home'));
const Layanan = lazy(() => import('./pages/Layanan'));
const TentangKami = lazy(() => import('./pages/TentangKami'));
const BeforeAfter = lazy(() => import('./pages/BeforeAfter'));
const Kontak = lazy(() => import('./pages/Kontak'));
const KlinikMatras = lazy(() => import('./pages/KlinikMatras'));
const KlinikSofa = lazy(() => import('./pages/KlinikSofa'));
const SanoClean = lazy(() => import('./pages/SanoClean'));
const Pricelist = lazy(() => import('./pages/Pricelist'));
const Artikel = lazy(() => import('./pages/Artikel'));
const ArtikelDetail = lazy(() => import('./pages/ArtikelDetail'));

// Komponen Loading Sementara (Muncul saat pindah halaman)
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <Layout>
      {/* Bungkus Routes dengan Suspense */}
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/layanan" element={<Layanan />} />
          <Route path="/pricelist" element={<Pricelist />} />
          <Route path="/artikel" element={<Artikel />} />
          <Route path="/artikel/:slug" element={<ArtikelDetail />} />
          <Route path="/tentang-kami" element={<TentangKami />} />
          <Route path="/before-after" element={<BeforeAfter />} />
          <Route path="/kontak" element={<Kontak />} />
          <Route path="/klinik-matras" element={<KlinikMatras />} />
          <Route path="/klinik-sofa" element={<KlinikSofa />} />
          <Route path="/sano-clean" element={<SanoClean />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default App;