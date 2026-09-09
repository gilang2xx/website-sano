// ============================================================================
// MASTER TEMPLATE -- Halaman Detail Artikel (CMS-driven, Markdown)
// ============================================================================
// Versi kode dari content/_templates/template-artikel.md. Ini pola INTI yang
// dipakai pages/ArtikelDetail.tsx di proyek ini, DIBERSIHKAN dari:
//   - 6 artikel lama yang hardcoded JSX (spesifik konten Sano Care, bukan
//     bagian dari "template" yang bisa dipakai ulang)
//   - logika gabung dua-sumber (legacy + CMS) -- di proyek baru biasanya
//     cuma butuh satu sumber (CMS) sejak awal
//
// Referensi file asli (versi lengkap, dengan legacy branching) ada di
// pages/ArtikelDetail.tsx kalau perlu lihat konteks aslinya.
//
// Yang dipertahankan persis: cara wiring SEO, cara render Markdown dengan
// styling konsisten, cara estimasi waktu baca -- ini bagian yang paling
// worth di-reuse di proyek lain.
// ============================================================================

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkUnwrapImages from 'remark-unwrap-images';
import { ArrowLeft, Calendar, Clock, MessageCircle } from 'lucide-react';

// ── 1. GANTI dengan hook SEO proyek Kamu (lihat hooks/useSEO.ts) ───────────
// Fungsinya: set document.title, meta description, canonical, dan Open
// Graph tags per halaman lewat useEffect -- penting karena SPA React tanpa
// ini semua halaman berbagi satu <title> statis, bikin Google anggap situs
// cuma 1 halaman. Kalau proyek Kamu SSR/Next.js, ganti dengan next/head
// atau generateMetadata() sesuai framework-nya.
import { useSEO } from '../../hooks/useSEO';

// ── 2. GANTI dengan loader konten proyek Kamu (lihat utils/content.ts) ─────
// Pola: import.meta.glob() Vite membaca semua file Markdown di build-time
// (bukan fetch runtime), diparse pakai `front-matter` (BUKAN gray-matter --
// gray-matter impor Node `fs` di level modul, rawan error kalau di-bundle
// untuk browser).
import { getCmsArticleBySlug, estimateReadTime } from '../../utils/content';

// ─────────────────────────────────────────────────────────────────────────
// STYLING MARKDOWN -- override tiap elemen HTML standar supaya artikel yang
// ditulis lewat CMS terasa konsisten dengan desain situs, bukan tampilan
// default browser. Sesuaikan className dengan design system proyek Kamu.
// ─────────────────────────────────────────────────────────────────────────
const markdownComponents = {
  h2: (props: React.ComponentProps<'h2'>) => (
    <h2 className="text-2xl md:text-3xl font-bold mt-10 mb-4" {...props} />
  ),
  h3: (props: React.ComponentProps<'h3'>) => (
    <h3 className="text-xl md:text-2xl font-bold mt-8 mb-3" {...props} />
  ),
  p: (props: React.ComponentProps<'p'>) => <p className="mb-6 leading-relaxed" {...props} />,
  ul: (props: React.ComponentProps<'ul'>) => <ul className="list-disc pl-5 space-y-1 mb-6" {...props} />,
  ol: (props: React.ComponentProps<'ol'>) => <ol className="list-decimal pl-5 space-y-1 mb-6" {...props} />,
  strong: (props: React.ComponentProps<'strong'>) => <strong className="font-bold" {...props} />,
  hr: () => <hr className="my-10" />,
  // Blockquote jadi kotak highlight -- konvensi yang enak dipakai penulis
  // konten: cukup ketik ">" di depan baris di CMS untuk menonjolkan poin.
  blockquote: (props: React.ComponentProps<'blockquote'>) => (
    <blockquote className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg my-8 not-italic" {...props} />
  ),
  a: (props: React.ComponentProps<'a'>) => (
    <a className="text-blue-600 font-semibold hover:underline" target="_blank" rel="noreferrer" {...props} />
  ),
  // PENTING: `remarkUnwrapImages` WAJIB dipasang (lihat remarkPlugins di
  // bawah) kalau custom img component ini pakai elemen block-level seperti
  // <figure>. Tanpa plugin itu, gambar standar Markdown otomatis dibungkus
  // <p> oleh remark, jadi <p><figure>...</figure></p> -- HTML tidak valid,
  // browser diam-diam "membetulkan" DOM-nya sendiri dan bikin React
  // hydration-mismatch warning. Ini bug nyata yang cuma kelihatan di
  // console browser, TIDAK ketangkap oleh build atau typecheck.
  img: ({ src, alt }: React.ComponentProps<'img'>) => (
    <figure className="my-10 w-full rounded-3xl overflow-hidden shadow-lg">
      <img src={src} alt={alt} className="w-full object-cover" loading="lazy" />
      {alt && <figcaption className="text-center text-xs text-slate-400 mt-2 italic">{alt}</figcaption>}
    </figure>
  ),
  table: (props: React.ComponentProps<'table'>) => (
    <div className="overflow-x-auto rounded-2xl border my-8">
      <table className="w-full text-sm" {...props} />
    </div>
  ),
  th: (props: React.ComponentProps<'th'>) => <th className="px-5 py-3 text-left font-bold" {...props} />,
  td: (props: React.ComponentProps<'td'>) => <td className="px-5 py-3 border-t" {...props} />,
};

const ArtikelDetailTemplate: React.FC = () => {
  const { slug } = useParams();
  const article = getCmsArticleBySlug(slug || '');

  // useSEO() dipanggil SEBELUM early-return di bawah -- aturan React Hooks:
  // hook tidak boleh dipanggil kondisional, urutannya harus selalu sama
  // tiap render. Pakai optional chaining + fallback text, bukan
  // `if (!article) return` di atas hook ini.
  useSEO({
    title: article?.title || 'Artikel Tidak Ditemukan',
    description: article?.desc || 'Artikel yang Anda cari tidak tersedia.',
    path: `/artikel/${slug || ''}`,
    image: article?.image,
  });

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold mb-4">Artikel Tidak Ditemukan</h1>
        <Link to="/artikel" className="text-blue-600 hover:underline">Kembali ke Daftar</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <article className="container mx-auto px-6 max-w-3xl">
        <Link to="/artikel" className="inline-flex items-center gap-2 mb-8">
          <ArrowLeft size={20} /> Kembali ke Daftar
        </Link>

        <div className="mb-10 text-center">
          <div className="flex justify-center gap-4 text-xs font-bold uppercase tracking-wider mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} /> {article.displayDate}</span>
            {/* Artikel CMS tidak punya field readTime manual -- diestimasi
                dari jumlah kata (~200 kata/menit), bukan ditulis tangan. */}
            <span className="flex items-center gap-1"><Clock size={14} /> {estimateReadTime(article.body)}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-8 leading-tight">{article.title}</h1>
          <div className="w-full aspect-video rounded-3xl overflow-hidden mb-8 shadow-xl">
            <img src={article.image} className="w-full h-full object-cover" alt={article.title} />
          </div>
        </div>

        <div className="prose prose-lg max-w-none leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkUnwrapImages]} components={markdownComponents}>
            {article.body}
          </ReactMarkdown>
        </div>

        {/* CTA di akhir artikel -- SATU template tetap untuk semua artikel,
            bukan ditulis manual per-artikel di CMS. Ganti sesuai proyek. */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-8 text-center text-white shadow-xl">
          <h3 className="text-2xl font-bold mb-2">Ada Pertanyaan?</h3>
          <p className="mb-6 opacity-90">Tim kami siap membantu.</p>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-full font-bold hover:scale-105 transition-transform"
          >
            <MessageCircle size={20} /> Chat WhatsApp Sekarang
          </a>
        </div>
      </article>
    </div>
  );
};

export default ArtikelDetailTemplate;

// ============================================================================
// DEPENDENCY YANG DIBUTUHKAN (npm install):
//   react-markdown remark-gfm remark-unwrap-images front-matter lucide-react
//
// FILE PENDUKUNG YANG PERLU DIBUAT DI PROYEK BARU:
//   1. hooks/useSEO.ts       -- lihat file itu di proyek ini, ~55 baris,
//                                zero-dependency (bukan react-helmet).
//   2. utils/content.ts      -- loader import.meta.glob() + front-matter,
//                                fungsi getCmsArticleBySlug() &
//                                estimateReadTime() ada di sana.
//   3. tsconfig.json         -- tambahkan "vite/client" ke compilerOptions.types,
//                                kalau tidak import.meta.glob gagal typecheck
//                                (walau build Vite tetap jalan tanpa itu).
// ============================================================================
