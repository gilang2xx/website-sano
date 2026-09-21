import React, { Suspense, lazy } from 'react'; // Tambah Suspense & lazy
import { Routes, Route, matchPath } from 'react-router-dom';
import Layout from './components/Layout';

// GANTI IMPORT BIASA MENJADI LAZY IMPORT
const loadHome = () => import('./pages/Home');
const loadLayanan = () => import('./pages/Layanan');
const loadTentangKami = () => import('./pages/TentangKami');
const loadBeforeAfter = () => import('./pages/BeforeAfter');
const loadKontak = () => import('./pages/Kontak');
const loadKlinikMatras = () => import('./pages/KlinikMatras');
const loadKlinikSofa = () => import('./pages/KlinikSofa');
const loadSanoClean = () => import('./pages/SanoClean');
const loadPricelist = () => import('./pages/Pricelist');
const loadArtikel = () => import('./pages/Artikel');
const loadArtikelDetail = () => import('./pages/ArtikelDetail');
const loadKebijakanPrivasi = () => import('./pages/KebijakanPrivasi');

const Home = lazy(loadHome);
const Layanan = lazy(loadLayanan);
const TentangKami = lazy(loadTentangKami);
const BeforeAfter = lazy(loadBeforeAfter);
const Kontak = lazy(loadKontak);
const KlinikMatras = lazy(loadKlinikMatras);
const KlinikSofa = lazy(loadKlinikSofa);
const SanoClean = lazy(loadSanoClean);
const Pricelist = lazy(loadPricelist);
const Artikel = lazy(loadArtikel);
const ArtikelDetail = lazy(loadArtikelDetail);
const KebijakanPrivasi = lazy(loadKebijakanPrivasi);

// Dipakai index.tsx sebelum hydrateRoot(): muat chunk halaman untuk URL saat
// ini lebih dulu supaya hydration tidak menampilkan spinner Suspense di atas
// HTML hasil prerender. HARUS sinkron dengan <Routes> di bawah.
const PRELOADERS: Array<[string, () => Promise<unknown>]> = [
  ['/', loadHome],
  ['/layanan', loadLayanan],
  ['/pricelist', loadPricelist],
  ['/artikel', loadArtikel],
  ['/artikel/:slug', loadArtikelDetail],
  ['/tentang-kami', loadTentangKami],
  ['/before-after', loadBeforeAfter],
  ['/kontak', loadKontak],
  ['/klinik-matras', loadKlinikMatras],
  ['/klinik-sofa', loadKlinikSofa],
  ['/sano-clean', loadSanoClean],
  ['/kebijakan-privasi', loadKebijakanPrivasi],
];

export function preloadRoute(pathname: string): Promise<unknown> {
  const hit = PRELOADERS.find(([pattern]) => matchPath({ path: pattern, end: true }, pathname));
  return hit ? hit[1]() : Promise.resolve();
}

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
          <Route path="/kebijakan-privasi" element={<KebijakanPrivasi />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default App;
