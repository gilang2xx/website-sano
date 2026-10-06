# SEO Fase 4A — Article Template & Structured Data Enhancement

Branch: `feat/seo-ssg-implementation` (commit `8fe0d67`, di atas `358dda4`). **Tidak di-merge, tidak di-deploy.** Tidak ada perubahan env/DNS/Vercel, `api/lead` tidak disentuh, tidak ada halaman baru, tidak ada perubahan klaim medis/testimonial/harga/garansi/layanan (itu di luar scope fase ini — lihat Fase 3C untuk itu).

Tujuan: menambahkan field Author + Tanggal Update di CMS, dan JSON-LD `BlogPosting` otomatis di setiap halaman artikel, **tanpa** menghapus schema `LocalBusiness` global.

---

## 1. File yang diubah

| File | Perubahan |
|---|---|
| `public/admin/config.yml` | Koleksi `artikel`: tambah field `author` (string, default "KLINIK MATRAS by SANO CARE") dan `updatedAt` (datetime, opsional — `required: false`). Urutan field diubah ke: Judul → Kategori → Author → Tanggal Publish → Tanggal Update → Gambar Sampul → Ringkasan Singkat → Isi Artikel (label field tanggal lama diganti "Tanggal Publish"). |
| `utils/content.ts` | `ArtikelFrontmatter` dan `CmsArticle` dapat field baru (lihat §2). `loadCmsArticles()` menghitung `author` dan `dateModified` dengan fallback. Diekspor `DEFAULT_AUTHOR = 'KLINIK MATRAS by SANO CARE'`. |
| `pages/ArtikelDetail.tsx` | Import `DEFAULT_AUTHOR`, `SITE_URL`, `canonicalUrl`, `LEGACY_ARTICLES`. Tambah logika resolusi author/tanggal untuk artikel lama (legacy) maupun CMS, bangun objek `BlogPosting`, render sebagai `<script type="application/ld+json">` di dalam halaman, dan tampilkan baris "Author · Diperbarui …" di bawah badge tanggal/read-time (hanya muncul bila `dateModified !== datePublished`). Tidak ada perubahan pada konten editorial artikel. |

Tidak diubah: `api/*`, `seo/routes.ts` (hanya dibaca untuk `LEGACY_ARTICLES`/`SITE_URL`/`canonicalUrl`), `App.tsx`, `vercel.json`, halaman layanan, testimonial, harga.

## 2. Struktur field CMS sebelum/sesudah

**Sebelum** (koleksi `artikel`): Judul, Kategori, Tanggal, Gambar Sampul, Ringkasan Singkat, Isi Artikel.

**Sesudah**: Judul, Kategori, **Author** (baru, default brand, tetap bisa diedit), **Tanggal Publish** (field `date` lama, cuma label berubah — nama field YAML tidak berubah jadi tidak perlu migrasi), **Tanggal Update** (baru, field `updatedAt`, opsional/boleh dikosongkan), Gambar Sampul, Ringkasan Singkat, Isi Artikel.

Model TypeScript (`utils/content.ts`):

```ts
interface ArtikelFrontmatter {
  title: string;
  category: string;
  author?: string;        // baru, opsional
  date: string;
  updatedAt?: string;      // baru, opsional
  image: string;
  desc: string;
  draft?: boolean;
}

interface CmsArticle {
  slug: string; title: string; category: string;
  author: string;             // selalu terisi (fallback DEFAULT_AUTHOR)
  date: string;                // ISO, datePublished
  displayDate: string;
  dateModified: string;        // ISO, fallback = date
  displayDateModified: string;
  image: string; desc: string; body: string;
}
```

Minimal model yang diminta (title, category, author, date/publishedAt, updatedAt, image, excerpt/summary, body, slug) sudah terpenuhi lewat `title`, `category`, `author`, `date`, `updatedAt`→`dateModified`, `image`, `desc`, `body`, `slug`.

## 3. Backward compatibility

- `author` kosong di frontmatter → `attributes.author?.trim() || DEFAULT_AUTHOR` ("KLINIK MATRAS by SANO CARE").
- `updatedAt` kosong → `dateModified = date` (datePublished), **bukan** waktu build/deploy (diverifikasi: tidak ada `new Date()`/`Date.now()` dipakai, hanya `attributes.updatedAt` atau fallback ke `attributes.date` yang sudah ada di frontmatter).
- Artikel lama (`articleDatabase` di `ArtikelDetail.tsx`, ditulis sebagai JSX, tidak punya field CMS sama sekali): `author` selalu `DEFAULT_AUTHOR`; `datePublished`/`dateModified` diambil dari `LEGACY_ARTICLES` di `seo/routes.ts` (satu-satunya sumber tanggal ISO untuk artikel lama — sudah divalidasi sinkron dengan `articleDatabase` oleh guard `prerender.mjs` yang sudah ada sebelumnya), keduanya sama persis (tidak ada field update terpisah untuk artikel lama, sesuai aturan owner: "Tanggal Publish tetap source, fallback dateModified = datePublished").
- Tidak ada artikel existing (6 legacy + 1 CMS pilar) yang punya `author`/`updatedAt` di repo, jadi **semua 7 artikel saat ini memakai fallback** (lihat §7).
- Diuji langsung (lihat §6): frontmatter tanpa `author`/`updatedAt` tetap ter-parse dan ter-render; frontmatter dengan `author`/`updatedAt` terisi override fallback dengan benar (diuji lewat harness terpisah atas logika yang sama, tanpa mengubah file konten nyata di repo).
- CMS (Decap): field baru `required: false` khusus `updatedAt`, jadi artikel lama yang dibuka ulang di CMS tidak memaksa pengisian; `author` punya `default`, jadi artikel baru otomatis terisi tanpa aksi tambahan dari penulis.

## 4. Contoh `BlogPosting` JSON-LD final

Dari build nyata, artikel CMS pilar (`/artikel/panduan-lengkap-kasur-sehat-cara-memilih-kasur-yang-tepat`, tanpa `author`/`updatedAt` di frontmatter → fallback penuh):

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Panduan Lengkap Kasur Sehat: Cara Memilih Kasur yang Tepat",
  "description": "Pelajari apa itu kasur sehat, peran fondasi dan lapisan, pengaruh berat badan, serta cara menentukan kasur yang sesuai kebutuhan tubuh",
  "image": "https://sanomatrassehat.com/uploads/ilustrasi-konsep-kasur-sehat-dengan-dukungan-tulang-belakang.jpg",
  "datePublished": "2026-09-24",
  "dateModified": "2026-09-24",
  "author": { "@type": "Organization", "name": "KLINIK MATRAS by SANO CARE" },
  "publisher": {
    "@type": "Organization",
    "name": "KLINIK MATRAS by SANO CARE",
    "logo": { "@type": "ImageObject", "url": "https://sanomatrassehat.com/sano-logomarks-whitebg.png" }
  },
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://sanomatrassehat.com/artikel/panduan-lengkap-kasur-sehat-cara-memilih-kasur-yang-tepat" },
  "url": "https://sanomatrassehat.com/artikel/panduan-lengkap-kasur-sehat-cara-memilih-kasur-yang-tepat",
  "inLanguage": "id-ID"
}
```

Catatan desain:
- `author` default = `Organization` (bukan `Person`), sesuai keputusan "jangan otomatis anggap semua author adalah Person". Kode sudah siap dikembangkan ke author individual: tinggal mengganti bentuk objek `author` berdasar data baru (mis. field CMS tambahan `authorType`), tanpa mengubah struktur field lain.
- `publisher.logo` memakai `/sano-logomarks-whitebg.png` — file ini **sudah dipakai** sebagai `apple-touch-icon` resmi situs di `index.html` (bukan URL yang dikarang).
- `image`, `url`, `mainEntityOfPage.@id` semuanya absolute URL pada domain `sanomatrassehat.com`, dikonversi dari path relatif CMS (`/uploads/...`) lewat helper lokal, tidak ada domain ganda.
- JSON di-escape dari `</` agar judul/ringkasan yang (secara teori) memuat `</script>` tidak memutus tag.

## 5. Hasil audit schema existing

- `index.html` tetap memuat schema `LocalBusiness` global (nama, alamat, jam operasional, **sengaja tanpa `aggregateRating`**, sesuai komentar asli di file) — **tidak disentuh sama sekali** oleh fase ini.
- Diverifikasi dari HTML hasil build (`dist/`, 19 halaman): **setiap** halaman masih punya tepat satu `LocalBusiness` JSON-LD; **ketujuh** halaman artikel (6 legacy + 1 CMS) punya tambahan satu `BlogPosting` JSON-LD — dua schema hidup berdampingan di `<body>`, tidak saling mengganti.
- Audit otomatis (parse tiap `<script type="application/ld+json">` dan cek field wajib `BlogPosting`): **0 masalah** — semua field wajib ada, semua `image` berdomain benar, `url` selalu sama dengan `mainEntityOfPage.@id`, `publisher.name`/`publisher.logo` konsisten di semua 7 artikel.
- Halaman non-artikel (`/`, `/klinik-matras`, dll.) **tidak** mendapat `BlogPosting` (sesuai — bukan artikel), tetap hanya `LocalBusiness`.

## 6. Hasil test build/prerender

| Uji | Hasil |
|---|---|
| `npx tsc --noEmit` | bersih |
| `npm run build` | sukses — **19 route**, 0 error, 16 peringatan (semua panjang title/description, tidak berubah dari Fase 3C) |
| Sitemap | **19 URL**, tidak berubah |
| Audit JSON-LD otomatis (lihat §5) | 0 masalah pada 19 halaman |
| Canonical / 1 H1 per halaman | tetap terjaga oleh guard `prerender.mjs` yang sudah ada (build tidak gagal) |
| Browser harness desktop+mobile (emulator Vercel lokal, tracker diblokir) | route-checks **38/38**, fungsional **24/24** (hydration tanpa error, dark mode, navigasi SPA, 404, trailing slash, atribusi WA organik/iklan, form kontak ke mock lokal, sitemap XML valid) |
| `verify-deployment.mjs` (emulator lokal) | **79/79** |
| Internal link (orphan/broken, lihat Fase 3C untuk metodologi) | 0 tautan rusak, 0 orphan — tidak berubah |
| Secret scan (`git grep` pola secret/token/bypass) | 0 temuan |
| Logika fallback author/updatedAt | diuji terpisah dengan data sintetis atas fungsi parsing yang sama (lihat §3) — fallback dan override berfungsi sesuai spesifikasi |
| Tidak ada POST, tidak ada event Meta, tidak ada perubahan env/DNS/Vercel, tidak ada merge/deploy | terpenuhi |

Automated validation untuk "setiap halaman artikel punya BlogPosting valid": skrip audit di atas (ad hoc, dijalankan terhadap `dist-ssr/prerender-manifest.json` + `dist/*/index.html`) bisa dijadikan skrip permanen di `scripts/` pada fase berikutnya bila owner mau; untuk fase ini dijalankan manual sebagai bagian QA agar tidak menambah file di luar scope.

## 7. Artikel yang memakai fallback author/dateModified

**Semua 7 artikel yang ada saat ini** memakai fallback penuh (tidak ada satu pun file `content/artikel/*.md` yang sudah mengisi `author`/`updatedAt`, dan artikel legacy memang tidak punya field tersebut sama sekali):

| Slug | Jenis | author (fallback?) | dateModified (fallback?) |
|---|---|---|---|
| `klinik-matras-by-sano-care` | legacy | DEFAULT_AUTHOR (fallback) | = datePublished 2025-12-26 (fallback) |
| `konsep-matras-sehat` | legacy | DEFAULT_AUTHOR (fallback) | = datePublished 2025-12-27 (fallback) |
| `dampak-kasur-rusak` | legacy | DEFAULT_AUTHOR (fallback) | = datePublished 2025-12-28 (fallback) |
| `dampak-jangka-panjang-kasur-salah` | legacy | DEFAULT_AUTHOR (fallback) | = datePublished 2025-12-28 (fallback) |
| `mengenal-struktur-kasur` | legacy | DEFAULT_AUTHOR (fallback) | = datePublished 2025-12-29 (fallback) |
| `kasur-ortopedik-untuk-tidur-sehat` | legacy | DEFAULT_AUTHOR (fallback) | = datePublished 2025-12-30 (fallback) |
| `panduan-lengkap-kasur-sehat-cara-memilih-kasur-yang-tepat` | CMS | DEFAULT_AUTHOR (fallback, frontmatter belum diisi) | = datePublished 2026-09-24 (fallback, `updatedAt` belum diisi) |

Baris "Diperbarui …" di UI karena itu **tidak muncul** di artikel manapun saat ini — sesuai aturan "jangan tampilkan Diperbarui jika updatedAt tidak berbeda dari publish date". Baris ini akan otomatis muncul begitu penulis mengisi field "Tanggal Update" di CMS untuk sebuah artikel (sudah diverifikasi lewat uji data sintetis di §3/§6).

## 8. Risiko atau blocker

- **Tidak ada blocker teknis.** Semua validasi lokal lulus.
- Field `author` CMS bersifat bebas-teks (sesuai keputusan "jika implementasi CMS saat ini hanya berupa string, gunakan Organization untuk default brand") — bila suatu saat penulis mengisi nama orang di sana, schema tetap menandainya sebagai `Organization` (bukan `Person`), karena per keputusan owner "jangan otomatis menganggap semua author adalah Person" dan sumbernya cuma string tunggal. Bila nanti dibutuhkan author individual bertipe `Person` sungguhan, perlu field CMS terpisah (mis. `authorType`) — desain kode saat ini sudah mengisolasi pembangunan objek `author` di satu tempat sehingga perubahan ini tidak memecah schema yang sudah ada.
- Field "Tanggal Update" di CMS tidak divalidasi harus ≥ Tanggal Publish (Decap tidak punya validasi silang-field bawaan). Risiko rendah (kesalahan input manual penulis); tidak memengaruhi validitas JSON-LD (tetap string tanggal valid), hanya berpotensi tanggal yang tidak logis bila penulis salah isi. Tidak diperbaiki pada fase ini (di luar scope, tidak diminta).
- Tidak ada perubahan pada `LocalBusiness`/`Organization` schema, konten editorial, klaim, testimonial, harga, atau garansi — sesuai batasan fase ini.

## 9. Rekomendasi

**GO untuk Preview** (dari sisi teknis fase ini): build bersih, 19 route/19 sitemap tidak berubah, JSON-LD `BlogPosting` valid di 7/7 halaman artikel, `LocalBusiness` global tidak terganggu, backward compatibility terbukti (artikel lama tanpa field baru tetap render dengan fallback benar), browser QA dan verify-deployment lokal 100% lulus, secret scan bersih.

Belum ada perubahan status terhadap keputusan Vercel Preview dari Fase 3C — commit ini menambah perubahan di atas state yang sudah divalidasi 79/79 di emulator lokal; validasi Preview sungguhan (dengan `VERCEL_BYPASS_SECRET`) masih perlu dijalankan ulang di atas commit `8fe0d67` sebelum merge, sesuai proses yang sama seperti Fase 3C. **Tidak ada merge ke main dan tidak ada deploy production tanpa izin eksplisit owner.**
