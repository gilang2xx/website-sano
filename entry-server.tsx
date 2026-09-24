// Entry SSR untuk prerender saat build (SSG). BUKAN server runtime: dipanggil
// oleh scripts/prerender.mjs sekali per route, hasilnya ditulis jadi file HTML
// statis. Dibuild terpisah: `vite build --ssr entry-server.tsx --outDir dist-ssr`.
import React from 'react';
import { Writable } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import { HeadCollectorContext, renderHeadTags } from './hooks/useSEO';
import type { HeadData } from './hooks/useSEO';
import { loadCmsArticles, loadBeforeAfterEntries, indoDateToIso } from './utils/content';
import {
  ARTICLE_SLUG_PATTERN,
  ISO_DATE_PATTERN,
  LEGACY_ARTICLES,
  SITE_URL,
  STATIC_ROUTES,
  canonicalUrl,
  getPublicRoutes,
} from './seo/routes';
import type { PublicRoute } from './seo/routes';

/** Normalisasi tanggal frontmatter (YAML bisa menghasilkan Date) menjadi YYYY-MM-DD, atau lempar error yang jelas. */
function toIsoDate(value: unknown, context: string): string {
  const iso = value instanceof Date ? value.toISOString().slice(0, 10) : String(value ?? '');
  const parsed = new Date(`${iso}T00:00:00Z`);
  const real = ISO_DATE_PATTERN.test(iso) && !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === iso;
  if (!real) throw new Error(`${context}: tanggal tidak valid ("${String(value)}", harus YYYY-MM-DD)`);
  return iso;
}

/**
 * Daftar route publik final (statis + artikel lama + artikel CMS) dengan
 * lastmod dari data konten. Divalidasi keras: slug CMS harus berformat
 * URL-aman dan tidak bentrok dengan artikel lain, tanggal harus valid.
 * lastmod di masa depan dibuang (tidak valid untuk sitemap).
 */
export function listPublicRoutes(): PublicRoute[] {
  const today = new Date().toISOString().slice(0, 10);
  const legacySlugs = new Set(LEGACY_ARTICLES.map((a) => a.slug));
  const seen = new Set<string>();

  const cms = loadCmsArticles().map((article) => {
    const file = `content/artikel/${article.slug}.md`;
    if (!ARTICLE_SLUG_PATTERN.test(article.slug)) {
      throw new Error(`${file}: nama file/slug harus huruf kecil, angka, dan tanda hubung saja`);
    }
    if (legacySlugs.has(article.slug) || seen.has(article.slug)) {
      throw new Error(`${file}: slug bentrok dengan artikel lain`);
    }
    seen.add(article.slug);
    return { slug: article.slug, date: toIsoDate(article.date, file) };
  });

  const beforeAfterDates = loadBeforeAfterEntries()
    .map((entry) => (entry.date ? toIsoDate(entry.date, `content/before-after/${entry.id}.md`) : ''))
    .filter(Boolean)
    .sort();

  return getPublicRoutes(cms, beforeAfterDates.pop()).map((route) => ({
    ...route,
    lastmod: route.lastmod && route.lastmod <= today ? route.lastmod : undefined,
  }));
}

export { renderHeadTags, canonicalUrl, SITE_URL, STATIC_ROUTES, LEGACY_ARTICLES, indoDateToIso };

export interface RenderResult {
  html: string;
  head: HeadData | null;
}

/**
 * Render satu URL menjadi HTML lengkap. Pipe baru dimulai setelah
 * onAllReady sehingga halaman lazy() sudah ter-resolve dan React menulis
 * konten final inline (bukan spinner + skrip streaming).
 */
export function render(url: string): Promise<RenderResult> {
  return new Promise((resolve, reject) => {
    const collector: { current: HeadData | null } = { current: null };
    const errors: unknown[] = [];
    const chunks: Buffer[] = [];

    const sink = new Writable({
      write(chunk, _encoding, callback) {
        chunks.push(Buffer.from(chunk));
        callback();
      },
    });
    sink.on('finish', () => {
      if (errors.length > 0) {
        reject(errors[0]);
        return;
      }
      resolve({ html: Buffer.concat(chunks).toString('utf-8'), head: collector.current });
    });

    const { pipe } = renderToPipeableStream(
      <React.StrictMode>
        <HeadCollectorContext.Provider value={collector}>
          <StaticRouter location={url}>
            <App />
          </StaticRouter>
        </HeadCollectorContext.Provider>
      </React.StrictMode>,
      {
        // Tanpa ini React memindahkan boundary Suspense yang besar (halaman
        // lazy) ke potongan streaming terpisah dan meninggalkan spinner di
        // HTML utama. Infinity = semua konten diinline di HTML.
        progressiveChunkSize: Infinity,
        onAllReady() {
          pipe(sink);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          errors.push(error);
        },
      },
    );
  });
}
