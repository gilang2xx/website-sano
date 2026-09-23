// SUMBER TUNGGAL daftar route publik. Dipakai oleh:
//   - App.tsx            -> <Routes> React Router + preload chunk (hydration)
//   - entry-server.tsx   -> daftar route yang diprerender (via getPublicRoutes)
//   - scripts/prerender.mjs -> menulis dist/prerender-manifest.json
//   - scripts/generate-sitemap.mjs -> sitemap.xml dibaca dari manifest itu
//
// Menambah halaman publik statis = tambah SATU baris di STATIC_ROUTES (dan
// komponen halamannya di App.tsx; App.tsx melempar error saat load bila
// ada route di sini yang belum punya komponen). Artikel CMS tidak perlu
// diedit di sini: slug-nya diambil dari content/artikel/*.md saat build.
//
// File ini SENGAJA murni data (tanpa import React/halaman) supaya aman
// diimpor dari mana saja.

export const SITE_URL = 'https://sanomatrassehat.com';

/** Pola route detail artikel di React Router. */
export const ARTICLE_ROUTE_PATTERN = '/artikel/:slug';

/** Route publik statis (urutan = urutan di sitemap). */
export const STATIC_ROUTES = [
  '/',
  '/layanan',
  '/pricelist',
  '/artikel',
  '/tentang-kami',
  '/before-after',
  '/kontak',
  '/klinik-matras',
  '/klinik-sofa',
  '/sano-clean',
  '/kebijakan-privasi',
] as const;

/**
 * Artikel lama (isi ditulis langsung di pages/ArtikelDetail.tsx, daftar
 * kartunya di pages/Artikel.tsx). `date` = tanggal terbit ISO, dipakai
 * sebagai lastmod. scripts/prerender.mjs membandingkan slug & tanggal ini
 * dengan kedua file di atas dan MENGGAGALKAN build bila tidak sama.
 */
export const LEGACY_ARTICLES: ReadonlyArray<{ slug: string; date: string }> = [
  { slug: 'klinik-matras-by-sano-care', date: '2025-12-26' },
  { slug: 'konsep-matras-sehat', date: '2025-12-27' },
  { slug: 'dampak-kasur-rusak', date: '2025-12-28' },
  { slug: 'dampak-jangka-panjang-kasur-salah', date: '2025-12-28' },
  { slug: 'mengenal-struktur-kasur', date: '2025-12-29' },
  { slug: 'kasur-ortopedik-untuk-tidur-sehat', date: '2025-12-30' },
];

export const ARTICLE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Canonical absolut. Beranda memakai "/", sisanya tanpa trailing slash. */
export function canonicalUrl(path: string): string {
  return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

export function articlePath(slug: string): string {
  return `/artikel/${slug}`;
}

export interface PublicRoute {
  /** Path route, mis. "/klinik-matras". */
  path: string;
  /** Tanggal perubahan konten (YYYY-MM-DD) bila DIKETAHUI dari data; selain itu undefined (lastmod dihilangkan). */
  lastmod?: string;
}

interface CmsArticleInput {
  slug: string;
  date: string;
}

/**
 * Daftar lengkap route publik yang harus diprerender & masuk sitemap.
 * `latestBeforeAfterDate` dan artikel CMS berasal dari content/*.md (build-time).
 * lastmod HANYA diisi untuk halaman yang kontennya digerakkan data bertanggal;
 * halaman statis lain tidak punya tanggal perubahan terpercaya -> tanpa lastmod.
 */
export function getPublicRoutes(
  cmsArticles: ReadonlyArray<CmsArticleInput>,
  latestBeforeAfterDate?: string,
): PublicRoute[] {
  const articles = [
    ...LEGACY_ARTICLES.map((a) => ({ slug: a.slug, date: a.date })),
    ...cmsArticles.map((a) => ({ slug: a.slug, date: a.date })),
  ];
  const latestArticleDate = articles.map((a) => a.date).sort().pop();

  const staticRoutes: PublicRoute[] = STATIC_ROUTES.map((path) => {
    if (path === '/artikel') return { path, lastmod: latestArticleDate };
    if (path === '/before-after') return { path, lastmod: latestBeforeAfterDate };
    return { path };
  });

  return [
    ...staticRoutes,
    ...articles.map((a) => ({ path: articlePath(a.slug), lastmod: a.date })),
  ];
}
