# SEO_PHASE_2A_REPORT — Sumber route tunggal, sitemap otomatis, noindex admin/API

Tanggal: 2026-09-24 · Branch: `feat/seo-ssg-implementation` · Commit kode: `8d8e1a8`
Referensi: [SEO_AUDIT.md](SEO_AUDIT.md), [SEO_ARCHITECTURE_PLAN.md](SEO_ARCHITECTURE_PLAN.md), [SEO_PHASE_1_REPORT.md](SEO_PHASE_1_REPORT.md), [VERCEL_PRODUCTION_MAPPING.md](VERCEL_PRODUCTION_MAPPING.md)

**Ringkasan:** daftar route publik kini berasal dari satu file (`seo/routes.ts`) yang dipakai React Router, prerender, dan sitemap. Sitemap dihasilkan dari manifest prerender, jadi isinya persis halaman yang diprerender. `lastmod` hanya dari tanggal konten (tidak lagi tanggal build). Build, `tsc`, dan 55 pengujian lokal lulus. **Preview Vercel di kedua project build sukses, tetapi tidak dapat diuji** (SSO aktif dan bypass yang sebelumnya diberikan sudah tidak berlaku), sehingga perilaku header/sitemap di Vercel pada commit ini **belum terverifikasi**. Tidak ada merge, push ke `main`, deploy production, atau perubahan env.

---

## 1. Persiapan

- Branch `feat/seo-ssg-implementation`, sejajar dengan remote pada awal fase; hanya `VERCEL_PRODUCTION_MAPPING.md` (laporan saya) yang untracked. Laporan sebelumnya dibaca.
- Konfirmasi project dari dashboard (dari Anda): `website-sano` → `sanomatrassehat.com`; `sano-website-vs` → `sano-website.vercel.app`.

## 2. File yang berubah (`git diff fbdd473 8d8e1a8`: 12 file, +617/−222)

| File | Perubahan |
|---|---|
| `seo/routes.ts` (baru) | **Sumber tunggal route publik**: `SITE_URL`, `STATIC_ROUTES`, `ARTICLE_ROUTE_PATTERN`, `LEGACY_ARTICLES` (slug + tanggal ISO), `canonicalUrl()`, `getPublicRoutes()` (menghitung `lastmod`). Murni data, tanpa import React |
| `App.tsx` | `<Routes>` dan preloader hydration dibangun dari `STATIC_ROUTES`. Tipe `Record<StaticRoutePath, …>` membuat TypeScript menolak build bila ada route tanpa halaman (atau sebaliknya). Markup/route yang dihasilkan tidak berubah |
| `entry-server.tsx` | Ekspor `listPublicRoutes()` (statis + artikel lama + artikel CMS, divalidasi keras), `canonicalUrl`, `SITE_URL`, dll. Menggantikan `STATIC_ROUTES`/`getCmsArticleSlugs` lama |
| `scripts/prerender.mjs` | Validasi metadata/canonical lebih ketat pada HTML final (lihat §4), cek link internal, konsistensi artikel lama, menulis `dist-ssr/prerender-manifest.json` |
| `scripts/generate-sitemap.mjs` | Ditulis ulang: membaca manifest, aturan pengecualian, lastmod dari konten, validasi gagal-keras. Tidak lagi mem-parse `pages/Artikel.tsx` dengan regex |
| `hooks/useSEO.ts` | `SITE_URL` dan canonical dari `seo/routes.ts` (nilai identik) |
| `utils/content.ts` | Frontmatter opsional `draft: true` menyembunyikan artikel CMS dari daftar, halaman, prerender, dan sitemap |
| `index.html` | Hapus `<link rel="stylesheet" href="/index.css">` |
| `public/admin/index.html` | `<meta name="robots" content="noindex, nofollow">` |
| `vercel.json` | `headers`: `X-Robots-Tag: noindex, nofollow` untuk `/admin/:path*` dan `/api/:path*`; rewrite ke `/spa-fallback.html` tetap |
| `package.json` | `build:spa` menjadi `vite build` saja (sitemap butuh manifest prerender) |
| `VERCEL_PRODUCTION_MAPPING.md` | Laporan audit Vercel (ikut di-commit) |

Tidak diubah: UI/UX, konten artikel, halaman layanan, Tailwind CDN, `api/*`, env, DNS/domain.

## 3. Implementasi

**Alur data (satu arah):** `seo/routes.ts` + `content/artikel/*.md` + `content/before-after/*.md` → `listPublicRoutes()` → `prerender.mjs` (render + validasi + tulis HTML) → `dist-ssr/prerender-manifest.json` → `generate-sitemap.mjs` → `dist/sitemap.xml`.

- **Menambah halaman statis:** satu baris di `STATIC_ROUTES` + entri di `PAGE_LOADERS` (`App.tsx`). Lupa salah satunya = error TypeScript. Route otomatis ter-prerender dan masuk sitemap.
- **Artikel CMS baru:** cukup publish lewat Decap (commit `content/artikel/<slug>.md`) → build → ter-prerender dan masuk sitemap; `lastmod` = tanggal artikel; `lastmod` `/artikel` ikut naik.
- **Domain canonical:** `https://sanomatrassehat.com`. Beranda `https://sanomatrassehat.com/`, sisanya tanpa trailing slash. `<loc>` = canonical persis.
- **Pengecualian dari sitemap:** `/admin`, `/api`, `/404`, `/spa-fallback`, `/_*` (ditolak keras oleh generator); halaman tidak ter-prerender (redirect/fallback tidak ada di manifest); halaman ber-`noindex`; artikel `draft: true`. Tidak ada draft/unpublished lain di jalur build (Decap tidak dikonfigurasi dengan editorial workflow, jadi entri belum terbit tidak ada di `main`).
- **lastmod:** hanya dari data konten: setiap artikel = tanggal artikelnya; `/artikel` = tanggal artikel terbaru; `/before-after` = tanggal entri galeri terbaru. **9 halaman statis tanpa lastmod** karena tidak ada tanggal perubahan yang terpercaya di sumber (tanggal build dan tanggal commit sengaja tidak dipakai: yang pertama menyesatkan, yang kedua tidak tersedia andal pada clone Vercel). Tanggal di masa depan dibuang. `changefreq`/`priority` dihapus (diabaikan Google).
- **Validasi sumber CMS (gagal-keras):** slug harus `^[a-z0-9]+(-[a-z0-9]+)*$`, tidak boleh bentrok dengan artikel lama/lain, tanggal harus YYYY-MM-DD nyata. `date` bertipe `Date` dari YAML dinormalisasi.
- **Konsistensi artikel lama:** `LEGACY_ARTICLES` dibandingkan dengan `pages/Artikel.tsx` (slug + tanggal, lewat `indoDateToIso`) dan kunci `articleDatabase` di `pages/ArtikelDetail.tsx`; berbeda = build gagal.
- **`/index.css`:** file tidak pernah ada (root maupun `public/`), sehingga tag hanya memicu request sia-sia yang di Vercel dijawab HTML 200 dan warning Vite. Dihapus; tidak ada styling yang hilang (semua gaya berasal dari Tailwind CDN + kelas inline). Warning Vite tidak lagi muncul.
- **noindex admin/API:** dipasang dua lapis yang aman: header `X-Robots-Tag` (`vercel.json`) dan meta robots di `public/admin/index.html`. **Sengaja tidak** menambah `Disallow` di `robots.txt`: bila crawl diblokir Google tidak bisa membaca noindex. Header hanya menambah metadata respons; tidak mengubah alur OAuth/lead.

## 4. Metadata & canonical (validasi pada HTML final tiap route)

Build gagal bila salah satu tidak terpenuhi: tepat 1 `<title>`, meta description, canonical, `og:title`, `og:description`, `og:url`, `og:image`, `twitter:card`; canonical = `og:url` = URL kanonik route; `og:image` absolut di domain kanonik **dan file-nya ada di `dist/`**; `<html lang="id">`; tidak ada `noindex`; tepat 1 `<h1>`; tanpa spinner; title dan canonical unik antar halaman; setiap link internal `<a href="/…">` menunjuk ke route publik atau file statis yang ada.

Hasil: **17/17 lulus, 0 error.** Ada **17 peringatan** (bukan error) dari **konten existing yang belum boleh diubah**: 16 title >60 karakter (terpanjang 122, artikel `dampak-jangka-panjang-kasur-salah`; beranda 95 karena suffix brand ganda) dan 2 description di luar 70–160 (`/` 198, `/klinik-matras` 163). Tidak ada description duplikat. Title panjang perlu dirapikan di fase konten.

## 5. Jumlah URL sitemap

| | Jumlah |
|---|---|
| Total URL | **17** (11 halaman statis + 6 artikel lama) |
| Dengan `lastmod` (dari konten) | 8 (6 artikel, `/artikel` = 2025-12-30, `/before-after` = 2026-09-09) |
| Tanpa `lastmod` | 9 |
| Artikel CMS | 0 (folder `content/artikel` hanya `.gitkeep`) |
| Elemen `changefreq`/`priority` | 0 |
| URL duplikat / di luar domain / trailing slash / query | 0 |

Perbandingan dengan sitemap lama: 17 URL juga, tetapi lama = `lastmod` 2026-09-09 (tanggal build) untuk 11 halaman statis; baru = tanpa lastmod kecuali dari konten.

## 6. Build & pengujian (lokal)

| Pemeriksaan | Hasil |
|---|---|
| `npx tsc --noEmit` | **Exit 0** |
| `npm run build` | **Exit 0**: client build, SSR build, `[prerender] 17 route ter-prerender, 17 peringatan (konten existing), 0 error`, `[sitemap] 17 URL (8 dengan lastmod, 9 tanpa)`. Warning `/index.css` hilang |
| **Skenario CMS (file uji sementara, sudah dihapus, tidak di-commit):** `uji-sitemap-cms.md` (valid) + `uji-draft-cms.md` (`draft: true`) | Build sukses; **18 URL**; artikel baru ter-prerender dan masuk sitemap dengan `lastmod` 2026-09-20; canonical benar; `lastmod` `/artikel` naik ke 2026-09-20; **draft tidak muncul** di HTML, daftar artikel, maupun sitemap |
| **Jalur gagal (build harus gagal, exit 1):** slug `Uji_Slug_Salah` / tanggal `2026-13-45` / slug bentrok dengan artikel lama | Ketiganya gagal dengan pesan jelas menyebut file dan penyebab. (Pesan tanggal awalnya "Invalid time value"; diperbaiki sebelum commit) |
| Validasi XML sitemap (Chrome `DOMParser`; `xmllint` tidak tersedia) | Well-formed, root `urlset`, namespace `sitemaps.org/schemas/sitemap/0.9`, content-type `application/xml` |
| Setiap `<loc>` (17) dimuat dari server lokal | Semua 200, `data-ssg-path` = path, canonical = `<loc>`, tanpa noindex; tanpa duplikat; lastmod format valid dan tidak di masa depan |
| Suite browser (Chrome headless, server lokal, `/api/lead` di-mock, pixel diblok): 17 route × desktop/mobile tanpa console warning/error, dark mode, atribusi WhatsApp, navigasi SPA + back, URL tak dikenal, trailing slash, form (mock), kontrol positif mismatch hydration | **34/34 route + 21/21 fungsional lulus, 0 gagal** |

Catatan: `dist-ssr/` (manifest) tidak dideploy; sitemap dihasilkan saat build di Vercel. Pengujian navigasi/hydration menyasar build lokal, bukan Vercel.

## 7. Vercel Preview

| Project | Deployment commit `8d8e1a8` | Alias branch | Uji |
|---|---|---|---|
| `website-sano` (**production utama**) | `success` — https://vercel.com/rigss-projects/website-sano/2zyqBpduMQuBBsQXTZMxCQZpGpYz | `https://website-sano-git-feat-seo-ssg-implementation-rigss-projects.vercel.app` | **Tidak diuji**: semua path menjawab 302 ke `vercel.com/sso-api` (SSO); tidak ada akses resmi/bypass untuk project ini dan saya tidak mencoba melewatinya |
| `sano-website-vs` (sekunder) | `success` — https://vercel.com/rigss-projects/sano-website-vs/FPZd2iTtVh6dH14KkKXwUVaXtkUc | `https://sano-website-vs-git-feat-seo-ssg-implementation-rigss-projects.vercel.app` | **Tidak diuji**: bypass yang diberikan sebelumnya sudah tidak berlaku (302). Saya tidak membuat/meminta bypass baru |

Yang **terbukti** dari status GitHub: build lengkap (`vite build` + SSR + prerender + sitemap) selesai sukses di lingkungan build kedua project. **Tidak ada** POST ke API mana pun pada fase ini.

## 8. Risiko

| # | Risiko | Status |
|---|---|---|
| R1 | Header `X-Robots-Tag` di `vercel.json` belum terlihat efeknya di Vercel (preview menambah `noindex` sendiri sehingga tidak dapat dibedakan; `headers` untuk fungsi `api/*` perlu dikonfirmasi di production/preview yang bisa diakses) | Belum terverifikasi |
| R2 | Sitemap live belum dilihat di Vercel; bila build Vercel menghasilkan sesuatu berbeda dari lokal (mis. Node berbeda) validasi build akan menggagalkan deploy, bukan menerbitkan sitemap salah | Rendah; build sukses di Vercel |
| R3 | Merge ke `main` akan membangun **kedua** project; sitemap `sano-website.vercel.app` juga akan memuat URL `sanomatrassehat.com` (benar: canonical), tetapi host sekunder tetap duplikat publik (lihat VERCEL_PRODUCTION_MAPPING.md D1) | Perlu keputusan pemilik akun |
| R4 | 9 halaman statis tanpa `lastmod` (sengaja). Jika tim ingin lastmod untuk halaman itu, perlu sumber tanggal ubah eksplisit (mis. konstanta bertanggal di `seo/routes.ts` yang diperbarui manual) | Keputusan produk |
| R5 | `draft: true` hanya bekerja bila frontmatter memuatnya; **konfigurasi Decap tidak diubah**, jadi editor belum punya kolom draft di UI | Belum ada di CMS (sengaja, di luar lingkup) |
| R6 | Daftar route tetap punya dua titik sentuh untuk halaman statis baru (`STATIC_ROUTES` + `PAGE_LOADERS`); dijaga oleh TypeScript | Terkendali |
| R7 | Artikel lama masih tercatat di tiga tempat (`seo/routes.ts`, `Artikel.tsx`, `ArtikelDetail.tsx`); dijaga guard build, belum dipusatkan | Dijadwalkan (ekstrak `data/articles.ts`) |
| R8 | `build:spa` (rollback pipeline) tidak menghasilkan sitemap | Rollback yang disarankan = `git revert`/Instant Rollback Vercel |
| R9 | Peringatan konten (title/description) 17 item belum ditangani | Fase konten |
| R10 | Masih soft 404 (rewrite catch-all), URL `/x` dan `/x/` sama-sama 200, tanpa `404.html` | Fase 2B |

## 9. Rollback

- Batalkan Fase 2A saja: `git revert 8d8e1a8` (Fase 1 tetap). Karena belum ada di `main`, cukup tidak menggabungkan branch.
- Sitemap bermasalah setelah merge: Vercel → Deployments → Instant Rollback pada project `website-sano`.
- Hapus header noindex saja: revert blok `headers` di `vercel.json`.

## 10. Kesiapan Fase 2B

**Kode siap; verifikasi Vercel belum.** Fase 2B (rencana): `NotFound` + `404.html` dengan HTTP 404 sungguhan, hapus rewrite catch-all, keputusan `/x` vs `/x/` (termasuk perlindungan `/admin`, Decap memuat `config.yml` relatif), pengecekan `X-Robots-Tag`, dan skrip verifikasi status/canonical semua route.

Prasyarat:
1. **Akses ke preview `website-sano`** (Protection Bypass khusus project itu, atau nonaktifkan proteksi Preview sementara, atau hasil uji dari Anda) — tanpa ini hasil header/404/redirect tidak bisa dibuktikan.
2. Keputusan bentuk URL kanonik (usulan tetap: tanpa trailing slash, beranda `/`).
3. Keputusan soal duplikat publik `sano-website.vercel.app` (nonaktifkan deploy sekunder / proteksi / noindex).
4. Versi Node.js di kedua project dan pin-nya.
5. Konfirmasi env scope Preview sebelum ada uji form.

---
*Tidak ada merge/push ke `main`, deploy production, perubahan env, bypass proteksi, atau POST ke API pada fase ini. File uji CMS sementara telah dihapus dan tidak pernah di-commit.*
