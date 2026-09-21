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
import { loadCmsArticles } from './utils/content';

/** Route publik statis. HARUS sinkron dengan <Routes> di App.tsx. */
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
];

/** Slug artikel yang ditulis lewat CMS (content/artikel/*.md). */
export function getCmsArticleSlugs(): string[] {
  return loadCmsArticles().map((article) => article.slug);
}

export { renderHeadTags };

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
