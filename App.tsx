import React, { Suspense, lazy } from 'react'; // Tambah Suspense & lazy
import { Routes, Route, matchPath } from 'react-router-dom';
import Layout from './components/Layout';
import { STATIC_ROUTES, ARTICLE_ROUTE_PATTERN } from './seo/routes';

type StaticRoutePath = (typeof STATIC_ROUTES)[number];
type PageLoader = () => Promise<{ default: React.ComponentType }>;

// Daftar route publik berasal dari SATU sumber: seo/routes.ts (dipakai juga
// oleh prerender & sitemap). Tipe Record di bawah memaksa TypeScript menolak
// build bila ada route di STATIC_ROUTES yang belum punya halaman di sini
// (atau sebaliknya).
// GANTI IMPORT BIASA MENJADI LAZY IMPORT
const PAGE_LOADERS: Record<StaticRoutePath, PageLoader> = {
  '/': () => import('./pages/Home'),
  '/layanan': () => import('./pages/Layanan'),
  '/pricelist': () => import('./pages/Pricelist'),
  '/artikel': () => import('./pages/Artikel'),
  '/tentang-kami': () => import('./pages/TentangKami'),
  '/before-after': () => import('./pages/BeforeAfter'),
  '/kontak': () => import('./pages/Kontak'),
  '/klinik-matras': () => import('./pages/KlinikMatras'),
  '/klinik-sofa': () => import('./pages/KlinikSofa'),
  '/sano-clean': () => import('./pages/SanoClean'),
  '/kebijakan-privasi': () => import('./pages/KebijakanPrivasi'),
};
const loadArtikelDetail: PageLoader = () => import('./pages/ArtikelDetail');

const PAGES = Object.fromEntries(
  STATIC_ROUTES.map((path) => [path, lazy(PAGE_LOADERS[path])]),
) as Record<StaticRoutePath, React.LazyExoticComponent<React.ComponentType>>;
const ArtikelDetail = lazy(loadArtikelDetail);

// Dipakai index.tsx sebelum hydrateRoot(): muat chunk halaman untuk URL saat
// ini lebih dulu supaya hydration tidak menampilkan spinner Suspense di atas
// HTML hasil prerender. Turunan dari daftar route yang sama dengan <Routes>.
const PRELOADERS: Array<[string, PageLoader]> = [
  ...STATIC_ROUTES.map((path): [string, PageLoader] => [path, PAGE_LOADERS[path]]),
  [ARTICLE_ROUTE_PATTERN, loadArtikelDetail],
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
          {STATIC_ROUTES.map((path) => {
            const Page = PAGES[path];
            return <Route key={path} path={path} element={<Page />} />;
          })}
          <Route path={ARTICLE_ROUTE_PATTERN} element={<ArtikelDetail />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default App;
