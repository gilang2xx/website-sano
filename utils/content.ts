import fm from 'front-matter';

// Loader konten CMS (Decap) -- membaca file Markdown yang di-commit ke
// content/before-after/*.md dan content/artikel/*.md. import.meta.glob
// adalah build-time (Vite men-scan & meng-inline isi file saat `vite build`),
// jadi konten baru dari Decap baru muncul setelah rebuild+redeploy -- itu
// otomatis terjadi karena publish Decap = commit ke main = trigger Vercel
// auto-deploy, alur yang sudah berjalan untuk kode.

const INDO_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
];

/** "2026-01-15" -> "15 Jan 2026" -- biar konsisten tampilannya dengan
 * tanggal string Indonesia yang dipakai 6 artikel lama (hardcoded). */
export function isoToIndoDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? '');
  if (!match) return iso ?? '';
  const [, year, month, day] = match;
  const monthName = INDO_MONTHS[Number(month) - 1];
  if (!monthName) return iso;
  return `${Number(day)} ${monthName} ${year}`;
}

/** "15 Jan 2026" -> "2026-01-15" -- kebalikan isoToIndoDate, dipakai buat
 * bandingkan tanggal artikel lama (string Indonesia, hardcoded) dengan
 * artikel CMS (ISO) saat digabung & diurutkan di pages/Artikel.tsx. */
export function indoDateToIso(indo: string): string {
  const match = /^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/.exec((indo ?? '').trim());
  if (!match) return indo ?? '';
  const [, day, monthName, year] = match;
  const monthIndex = INDO_MONTHS.findIndex(
    (m) => m.toLowerCase() === monthName.toLowerCase().slice(0, 3),
  );
  if (monthIndex === -1) return indo;
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function slugFromPath(path: string): string {
  return path.split('/').pop()!.replace(/\.md$/, '');
}

/**
 * Decap menulis tanggal frontmatter TANPA tanda kutip (`date: 2026-09-24`), dan
 * parser YAML (front-matter/js-yaml) mengubahnya menjadi objek `Date`, bukan
 * string. Objek Date tidak bisa dirender React dan merusak perbandingan/format
 * tanggal. Selalu normalkan ke string "YYYY-MM-DD" (js-yaml membaca tanggal
 * tanpa jam sebagai UTC, jadi toISOString() tidak menggeser hari).
 */
function normalizeDate(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
  return value == null ? '' : String(value);
}

// ─── Before / After ──────────────────────────────────────────────────────

export interface BeforeAfterEntry {
  id: string;
  title: string;
  desc: string;
  beforeImg: string;
  afterImg: string;
  date: string;
}

interface BeforeAfterFrontmatter {
  title: string;
  desc: string;
  beforeImg: string;
  afterImg: string;
  date?: string;
}

const beforeAfterFiles = import.meta.glob('/content/before-after/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

export function loadBeforeAfterEntries(): BeforeAfterEntry[] {
  return Object.entries(beforeAfterFiles)
    .map(([path, raw]) => {
      const { attributes } = fm<BeforeAfterFrontmatter>(raw);
      return { id: slugFromPath(path), ...attributes, date: normalizeDate(attributes.date) };
    })
    // Terbaru dulu. Entri lama (migrasi awal) dikasih tanggal urut manual
    // di frontmatter-nya supaya urutan tampilan tetap sama seperti semula;
    // entri baru dari CMS otomatis tanggal hari ini -> otomatis di atas.
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

// ─── Artikel (CMS, terpisah dari 6 artikel lama yang masih hardcoded) ────

/** Default author brand -- dipakai bila field Author kosong (artikel lama/belum diisi). */
export const DEFAULT_AUTHOR = 'KLINIK MATRAS by SANO CARE';

export interface CmsArticle {
  slug: string;
  title: string;
  category: string;
  author: string; // fallback DEFAULT_AUTHOR bila frontmatter tidak mengisi
  date: string; // ISO, apa adanya dari frontmatter -- untuk sort & datePublished
  displayDate: string; // "15 Jan 2026" -- untuk tampilan
  dateModified: string; // ISO -- fallback ke `date` bila updatedAt tidak diisi
  displayDateModified: string; // "15 Jan 2026" -- untuk tampilan "Diperbarui ..."
  image: string;
  desc: string;
  body: string; // markdown mentah, dirender oleh ReactMarkdown
}

interface ArtikelFrontmatter {
  title: string;
  category: string;
  author?: string;
  date: string;
  /** Opsional: diisi hanya saat artikel direvisi. Tanpa ini, dateModified = date (datePublished). */
  updatedAt?: string;
  image: string;
  desc: string;
  /** Opsional: `draft: true` di frontmatter menyembunyikan artikel dari daftar, halaman, prerender, dan sitemap. */
  draft?: boolean;
}

const articleFiles = import.meta.glob('/content/artikel/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

export function loadCmsArticles(): CmsArticle[] {
  return Object.entries(articleFiles)
    .filter(([, raw]) => fm<ArtikelFrontmatter>(raw).attributes.draft !== true)
    .map(([path, raw]) => {
      const { attributes, body } = fm<ArtikelFrontmatter>(raw);
      const date = normalizeDate(attributes.date);
      // updatedAt kosong (artikel lama/belum pernah direvisi) -> dateModified = datePublished.
      // Sengaja TIDAK pakai waktu build/deploy -- itu akan berubah di tiap deploy walau isi artikel sama.
      const dateModified = attributes.updatedAt ? normalizeDate(attributes.updatedAt) : date;
      return {
        slug: slugFromPath(path),
        title: attributes.title,
        category: attributes.category,
        author: attributes.author?.trim() || DEFAULT_AUTHOR,
        date,
        displayDate: isoToIndoDate(date),
        dateModified,
        displayDateModified: isoToIndoDate(dateModified),
        image: attributes.image,
        desc: attributes.desc,
        body,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function getCmsArticleBySlug(slug: string): CmsArticle | undefined {
  return loadCmsArticles().find((article) => article.slug === slug);
}

/** Artikel lama punya field readTime yang ditulis manual; artikel CMS tidak
 * -- diestimasi dari jumlah kata (~200 kata/menit). */
export function estimateReadTime(markdown: string): string {
  const wordCount = markdown.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} Menit Baca`;
}
