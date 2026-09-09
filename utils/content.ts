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

// ─── Before / After ──────────────────────────────────────────────────────

export interface BeforeAfterEntry {
  id: string;
  title: string;
  desc: string;
  beforeImg: string;
  afterImg: string;
}

interface BeforeAfterFrontmatter {
  title: string;
  desc: string;
  beforeImg: string;
  afterImg: string;
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
      return { id: slugFromPath(path), ...attributes };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

// ─── Artikel (CMS, terpisah dari 6 artikel lama yang masih hardcoded) ────

export interface CmsArticle {
  slug: string;
  title: string;
  category: string;
  date: string; // ISO, apa adanya dari frontmatter -- untuk sort
  displayDate: string; // "15 Jan 2026" -- untuk tampilan
  image: string;
  desc: string;
  body: string; // markdown mentah, dirender oleh ReactMarkdown
}

interface ArtikelFrontmatter {
  title: string;
  category: string;
  date: string;
  image: string;
  desc: string;
}

const articleFiles = import.meta.glob('/content/artikel/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

export function loadCmsArticles(): CmsArticle[] {
  return Object.entries(articleFiles)
    .map(([path, raw]) => {
      const { attributes, body } = fm<ArtikelFrontmatter>(raw);
      return {
        slug: slugFromPath(path),
        title: attributes.title,
        category: attributes.category,
        date: attributes.date,
        displayDate: isoToIndoDate(attributes.date),
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
