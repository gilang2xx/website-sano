# SEO_ARCHITECTURE_PLAN — sanomatrassehat.com

Tanggal: 2026-09-21 · Mode: **read-only planning** (tidak ada migrasi, perubahan source, instalasi dependency, atau deployment; hanya dokumen ini yang dibuat).
Melanjutkan [SEO_AUDIT.md](SEO_AUDIT.md). Semua klaim di bawah bersumber dari source code di repo ini; perilaku Vercel yang **belum bisa dibuktikan dari repo** ditandai **[VERIFIKASI]** dan harus dites di preview deployment sebelum diandalkan.

---

## 0. Ringkasan keputusan

**Pilihan: A — Vite + prerender/SSG buatan sendiri (tanpa framework baru), dengan hydrasi client.**

Alasan singkat:
- Seluruh konten publik **sudah statis pada saat build** (12 halaman, 6 artikel hardcoded, artikel/before-after CMS lewat `import.meta.glob` build-time — `utils/content.ts:56-59,96-99`). Tidak ada halaman publik yang datanya berubah per-request. SSR runtime (opsi B/C) membayar kompleksitas untuk kebutuhan yang tidak ada.
- Kode sudah **hampir SSR-safe**: akses `window/document/localStorage/sessionStorage` sudah di dalam `useEffect`/handler atau dijaga `typeof window` (lihat §1.6). `react-dom/server` dan `react-router-dom/server` (StaticRouter) sudah tersedia di dependency yang terpasang (react 19.2.0, react-router-dom 6.30.2), jadi **tidak perlu dependency baru**.
- Deploy tetap Vercel static + fungsi `api/*` yang sama; CMS Decap, form lead, dan pelacakan tidak tersentuh.
- Risiko regresi terendah dan rollback paling sederhana (build lama = SPA; build baru = HTML statis + JS yang sama).

Keamanan: **tidak ada bukti** `GEMINI_API_KEY` bocor ke bundle saat ini (§7), tetapi `define` di `vite.config.ts:14-15` adalah jalur bocor laten dan sebaiknya dihapus.

---

## 1. Existing architecture

### 1.1 Stack & build

| Aspek | Bukti |
|---|---|
| React 19.2.0, react-dom 19.2.0, react-router-dom 6.30.2, Vite 6.4.1, @vitejs/plugin-react 5.1.1 | `package.json:11-30` + `node_modules/*/package.json` |
| CSR murni, `createRoot` + `BrowserRouter` | `index.tsx:11-18` |
| Semua halaman `lazy()` + `Suspense` (spinner) | `App.tsx:6-17,30` |
| Build: `vite build && node scripts/generate-sitemap.mjs` | `package.json:8` |
| Deploy: Vercel, `outputDirectory: dist`, rewrite catch-all ke `/index.html` | `vercel.json:2-7` |
| Tailwind via CDN runtime + konfigurasi inline; importmap `aistudiocdn.com` (sisa template, tidak dipakai bundle); `/index.css` tidak ada | `index.html:87-107,117-132` |
| Tracking (GTM, Meta Pixel, TikTok) di `<head>` | `index.html:67-86,134-143` |
| Node lokal v24.11.1 (versi Node di Vercel: **[VERIFIKASI]** di dashboard) | `node -v` |
| TypeScript tanpa `strict`, `noEmit` | `tsconfig.json` |

### 1.2 Routing & halaman (`App.tsx:32-43`)

12 route statis + `/artikel/:slug`; **tidak ada route `*`**. Semua halaman `export default` komponen fungsi tanpa loader/data-router — cocok untuk `StaticRouter` tanpa refaktor router.

### 1.3 Data layanan & artikel (sumber data untuk daftar route)

| Data | Lokasi | Catatan untuk prerender |
|---|---|---|
| 16 layanan Klinik Matras | array lokal di `pages/KlinikMatras.tsx:22-101` | tidak punya URL/slug sendiri |
| Daftar artikel legacy (6) | `articlesList` **di dalam komponen** `pages/Artikel.tsx:13-84` | duplikat terpisah dari database detail |
| Isi artikel legacy (6, JSX) | `articleDatabase` **di dalam komponen** `pages/ArtikelDetail.tsx:69-~790`, key slug di `:74,132,267,417,552,705` | tidak bisa di-import tanpa render; slug harus diambil dari sumber tunggal |
| Artikel CMS | `content/artikel/*.md` (kosong, hanya `.gitkeep`), loader `utils/content.ts:96-112` | slug = nama file |
| Before/after | `content/before-after/*.md` (10 file), loader `utils/content.ts:56-71` | hanya di satu halaman |
| Sitemap | `scripts/generate-sitemap.mjs:44-63` mem-parse `Artikel.tsx` dengan **regex** | rapuh; harus diganti manifest route |

**Temuan tambahan (data):** deskripsi dua artikel tampak **tertukar** — slug `klinik-matras-by-sano-care` memakai desc "Dampak kasur amblas…" (`Artikel.tsx:24`, `ArtikelDetail.tsx:77`), sedangkan `dampak-kasur-rusak` memakai desc "Klinik Matras by SANO CARE — Hadir untuk Menolong…" (`Artikel.tsx:46`, `ArtikelDetail.tsx:270`). Perlu konfirmasi editor; ini langsung memengaruhi meta description yang akan di-prerender.

### 1.4 SEO runtime saat ini
`hooks/useSEO.ts:47-72` mengubah `document.title`, meta, canonical, OG **di `useEffect`** (hanya jalan di browser). `index.html:8-26,33-65` berisi title/description/canonical/OG/LocalBusiness statis milik beranda yang dikirim untuk **semua** URL.

### 1.5 Backend, auth, admin
| Komponen | Bukti | Implikasi SEO/arsitektur |
|---|---|---|
| Fungsi Vercel `api/lead.ts` (POST; email Resend + Meta CAPI) | `api/lead.ts:26-98` | tidak boleh terindeks; tetap dilayani fungsi |
| GitHub OAuth untuk Decap: `api/auth.ts`, `api/callback.ts` | `auth.ts:11-32`, `callback.ts:39-83` | tidak boleh terindeks; `redirect_uri` hardcode `https://sanomatrassehat.com/api/callback` (`auth.ts:9,26`) |
| Admin CMS statis `public/admin/index.html` + `config.yml` (backend GitHub, repo `gilang2xx/website-sano`, branch `main`, `base_url`, `auth_endpoint: api/auth`) | `config.yml:1-9` | **publish CMS = commit ke `main` = deploy Vercel** — build baru harus tahan konten CMS apa pun |
| Tidak ada autentikasi untuk pengunjung publik | — | tidak ada halaman privat yang perlu dilindungi selain `/admin/` dan `/api/*` |

Route yang **tidak boleh terindeks**: `/admin/*`, `/api/*`, halaman 404. Saat ini `public/robots.txt:1-4` tidak memblokirnya dan `public/admin/index.html` tidak punya `noindex`.

### 1.6 Komponen yang bergantung pada browser/runtime client
Dipetakan lewat grep `window|document|localStorage|sessionStorage|navigator|IntersectionObserver|fetch`:

| File:baris | API | Aman untuk SSR? |
|---|---|---|
| `Layout.tsx:36-42,48-55,33,68` | `window.scrollY/scrollTo/open`, listener scroll | Ya — di `useEffect`/handler |
| `utils/attribution.ts:29,66` | `window.location.search`, `sessionStorage` | Ya — dijaga `typeof window`, dipanggil dari `useEffect` (`Layout.tsx:48-50`) |
| `utils/tracking.ts:13`, `utils/leadTracking.ts:16-38` | `window`, `document.cookie`, `fetch('/api/lead')` | Ya — hanya dipanggil dari handler klik/submit |
| `components/ScrollReveal.tsx:9-15` | `IntersectionObserver` di effect | Ya. **Catatan:** state awal `opacity-0` → HTML prerender berisi konten tetapi tersembunyi sampai JS jalan (bukan masalah indexing; konten ada di DOM) |
| `components/ThemeToggle.tsx:6-10,13-21` | `localStorage` di **initializer `useState`** | **Tidak aman untuk hydrasi**: server render `light`, client bisa `dark` → mismatch class (`:26-40`). Perlu diperbaiki (§4 Fase 2) |
| `hooks/useSEO.ts:28-70` | `document.head` di effect | Ya, tapi **tidak menghasilkan apa pun di server** — harus diadaptasi |
| `pages/ArtikelDetail.tsx:64-66` | `window.scrollTo` di effect | Ya |
| `pages/Kontak.tsx:101,134` | form + `<iframe>` Google Maps | Ya (iframe hanya markup) |
| `pages/Home.tsx` `<video autoPlay>` (`:172-181`, `:378,425,471`) | atribut HTML | Ya |
| Skrip pihak ketiga (GTM, fbq, ttq) | `index.html:67-86,134-143` | Ada di template; tidak dieksekusi saat prerender |

Kesimpulan: **tidak ditemukan kode top-level (saat modul di-import) yang mengakses `window/document`** pada file yang di-grep. Hal ini perlu dikonfirmasi ulang dengan build SSR nyata di Fase 1 (kriteria penerimaan).

### 1.7 Yang **tidak** ada
Tidak ada route 404, tidak ada halaman per layanan/lokasi, tidak ada JSON-LD selain satu blok statis, tidak ada header keamanan/`X-Robots-Tag`, tidak ada konfigurasi `trailingSlash/cleanUrls`.

---

## 2. Perbandingan 3 pendekatan

| Kriteria | **A. Vite + prerender/SSG** | **B. Next.js (SSR/SSG)** | **C. SSR pada stack existing (Vite SSR + fungsi Vercel/Node)** |
|---|---|---|---|
| Kompatibilitas kode | **Tinggi.** Komponen, `react-router-dom`, `import.meta.glob`, Tailwind CDN, `api/*.ts` tetap. Perubahan: entry server, `useSEO`, `index.tsx` | **Rendah.** Ganti router (`react-router-dom` → `next/link`/App Router), `NavLink`/`useLocation` di `Layout.tsx`, `useParams` di `ArtikelDetail.tsx:61`; `import.meta.glob` (`utils/content.ts`) tidak ada di Next; ganti `api/*.ts` Vercel-Node ke Route Handlers; Decap `config.yml` & `base_url` disesuaikan; Tailwind CDN/inline config dipindah | **Sedang.** Komponen tetap, tapi butuh server handler yang mengimpor bundle SSR |
| Kompleksitas implementasi | Rendah–sedang (≈5–7 file baru/ubah kecil) | **Tinggi** (migrasi seluruh 12 halaman + layout + build + CMS) | Sedang–tinggi (server, caching, routing Vercel) |
| Infrastruktur | Statis + fungsi `api/*` yang sudah ada. **Tidak ada beban runtime baru** | Runtime Next di Vercel (didukung native), tetapi model deploy berubah | Fungsi serverless per request (cold start, batas eksekusi, biaya), atau butuh Node server terpisah |
| HTML lengkap semua halaman publik | Ya, **semua route dikenal saat build** (12 + 6 + CMS + landing baru) | Ya | Ya |
| Metadata & canonical per URL | Ya, ditulis ke HTML statis per route lewat collector (§3.3) | Ya (`generateMetadata`) | Ya |
| Dynamic routes/artikel/layanan | Enumerasi saat build dari manifest route; artikel CMS ikut karena `import.meta.glob` build-time | Native (`generateStaticParams`) | Native per request |
| **HTTP 404 sungguhan** | Ya via file `404.html` statis **jika catch-all rewrite dihapus** **[VERIFIKASI di preview Vercel]** | Ya (native) | Ya (bisa atur status) |
| Risiko downtime/regresi | **Terendah**; build dapat diuji di preview, rollback = promote deployment sebelumnya | **Tertinggi** (migrasi menyeluruh, semua alur WA/lead/tracking/admin perlu diuji ulang) | Sedang (perilaku cache & cold-start baru) |
| Maintenance jangka panjang | Skrip prerender kecil milik sendiri (±150 baris) — perlu dirawat saat upgrade React/Router | Ekosistem terawat & konvensi standar, tapi ikut siklus upgrade Next (biaya rutin) | Paling banyak kode kustom untuk dirawat |
| Nilai tambah dibanding kebutuhan | Cukup: konten statis, deploy tiap commit (termasuk publish CMS) | Berlebihan untuk situs 12 halaman statis; keuntungan (ISR, image optimizer) tidak diminta | SSR per-request tidak dibutuhkan; tidak ada data dinamis publik |

### Alternatif di dalam pilihan A
- **Plugin pihak ketiga** (`vite-react-ssg`, `vite-plugin-ssr/vike`): mengurangi kode kustom, tetapi menambah dependency baru dan (untuk `vite-react-ssg`) mensyaratkan pola route-object/data router, yang berbeda dari `<Routes>` di `App.tsx:31-44`. Tidak dipilih sebagai default; boleh dipertimbangkan bila tim tidak mau merawat skrip kustom. (Kompatibilitas versi dengan React 19.2/Vite 6.4 **belum saya verifikasi**.)
- **Layanan prerender pihak ketiga (Prerender.io/dynamic rendering)**: tidak direkomendasikan — Google menyebut dynamic rendering sebagai workaround, bukan solusi jangka panjang, dan menambah biaya/ketergantungan.

---

## 3. Keputusan arsitektur & bukti teknis

**Keputusan: Pendekatan A — SSG kustom di atas Vite, hydrasi client, tanpa dependency baru.**

### 3.1 Bukti yang menopang keputusan
1. Data build-time saja: `import.meta.glob(..., { eager: true, query: '?raw' })` (`utils/content.ts:56-59,96-99`) → Vite SSR build juga dapat memakainya; publish Decap = commit ke `main` = rebuild penuh (`utils/content.ts:5-9`, `config.yml:3-4`), jadi HTML statis selalu mengikuti konten.
2. Router kompatibel: `<Routes>` biasa (`App.tsx:31-44`) + `StaticRouter` dari `react-router-dom/server` (file `node_modules/react-router-dom/server.js` ada) — tanpa refaktor ke data router.
3. Efek samping browser terisolasi di effect/handler (§1.6), sehingga SSR tidak akan menyentuh `window`.
4. Fungsi `api/*` dan `public/admin` tidak bergantung pada bundle frontend (`api/*.ts` mandiri, `config.yml`), sehingga tidak terpengaruh.
5. Skala kecil: ±12 + 6 + N halaman; waktu prerender puluhan detik terbatas pada CPU build Vercel.
6. Sitemap sudah dibuat di tahap build (`package.json:8`); pola "skrip pasca-build" sudah dikenal tim.

### 3.2 Desain teknis

**Build pipeline (usulan):**
```
vite build                                   -> dist/ (client, tetap seperti sekarang)
vite build --ssr entry-server.tsx --outDir dist-ssr   -> bundle SSR (tidak dipublikasikan)
node scripts/prerender.mjs                   -> tulis dist/<route>/index.html, dist/404.html, sitemap.xml
```
Semua `dist-ssr` di-gitignore (`dist-ssr` sudah ada di `.gitignore`).

**`entry-server.tsx`**: `renderToPipeableStream(<StaticRouter location={url}><HeadProvider collector={c}><App/></HeadProvider></StaticRouter>)`, tunggu `onAllReady` (agar `React.lazy` di `App.tsx:6-17` ter-resolve di server — `renderToString` biasa tidak menunggu lazy). Keluaran: `{ html, head }`.

**`hooks/useSEO.ts`**: tetap zero-dependency. Tambah `HeadContext`; saat ada collector (server) panggil `collector.set({title, description, canonical, og…})` **saat render** (bukan di effect); di client tetap efek DOM seperti sekarang (canonical bersih tanpa query). Tidak perlu `react-helmet`.

**JSON-LD**: komponen `<JsonLd data={…}/>` yang merender `<script type="application/ld+json">` di body halaman (valid untuk Google, ikut HTML prerender tanpa collector). Blok statis di `index.html:33-65` dipindah jadi komponen, dengan `@id` (`https://sanomatrassehat.com/#business`).

**`index.html` sebagai template**: hapus `<title>`, description, canonical, OG/Twitter, LocalBusiness statis; ganti dengan placeholder `<!--seo-head-->` dan `<div id="root"><!--app-html--></div>`. Skrip `prerender.mjs` mengisi per route. Untuk `vite dev` (tanpa prerender) placeholder harus tetap valid — jaga agar dev server tidak rusak (mis. fallback title default).

**`index.tsx`**: `hydrateRoot` bila `#root` sudah berisi HTML prerender (`root.hasChildNodes()`), selain itu `createRoot` (fallback dev). **Sebelum hydrasi, muat chunk lazy untuk route saat ini** (mis. `await` import halaman yang cocok) agar `Suspense` tidak menampilkan spinner dan mengganti HTML server (menghindari flash/mismatch).

**Status HTTP & 404** (perilaku Vercel = **[VERIFIKASI]** di preview):
- Hapus rewrite `/(.*) → /index.html` di `vercel.json:5-7`. Setiap route dikenal ditulis sebagai file statis. Vercel menyajikan `404.html` dengan status 404 untuk path tak dikenal.
- `dist/404.html` = halaman NotFound prerender (`<meta name="robots" content="noindex">`); tambahkan `<Route path="*">` di `App.tsx` untuk navigasi client-side.
- Tetapkan satu bentuk URL: usulan `trailingSlash: false` + tanpa akhiran `.html` (`cleanUrls: true` jika output berupa `klinik-matras.html`; atau direktori `klinik-matras/index.html`). **Pilih setelah tes di preview** mana yang memberi 200 pada `/klinik-matras`, tanpa redirect ganda, dan `/klinik-matras/` → 308 ke non-slash.
- `/api/*` (fungsi) dan `/admin/` (statis di `public/admin`) didahulukan oleh Vercel sebelum aturan lain; pastikan tetap benar setelah rewrite dihapus (`/admin` tanpa slash **[VERIFIKASI]**).

**Header `X-Robots-Tag: noindex, nofollow`** untuk `/admin/(.*)` dan `/api/(.*)` lewat `vercel.json` `headers` — menghindari perubahan HTML Decap pihak ketiga.

**Sitemap & canonical satu sumber**: modul manifest route tunggal (mis. `seo/routes.ts`) dipakai oleh `prerender.mjs` (daftar URL), sitemap (`<loc>` = canonical persis, tanpa slash akhir/parameter), dan canonical per halaman. `lastmod` hanya dari tanggal konten nyata (frontmatter `date` untuk artikel; untuk halaman statis gunakan konstanta di manifest yang diperbarui manual atau tanggal commit terakhir file halaman — **konfirmasi pilihan**). Hapus `priority/changefreq` (diabaikan Google) dan regex parser `scripts/generate-sitemap.mjs:44-63`.

**Refaktor data kecil yang diperlukan** (agar manifest tidak memakai regex): pindahkan `articlesList` (`Artikel.tsx:13`) & metadata artikel dari `articleDatabase` (`ArtikelDetail.tsx:69`) ke `data/articles.ts` (metadata saja: slug, title, desc, date ISO, image, category); isi JSX tetap di `ArtikelDetail.tsx`. Ini juga menyelesaikan duplikasi & desc tertukar (§1.3).

**Halaman layanan transaksional**: satu template data-driven `pages/ServiceLanding.tsx` + `data/serviceLandings.ts` (slug, keyword utama, title, description, H1, seksi konten, FAQ, before-after terkait, area, CTA WA) sehingga menambah halaman = menambah entri data. Route dinamis di `App.tsx` dari manifest yang sama. Usulan URL (validasi dengan data GSC dulu): `/service-kasur`, `/service-springbed`, `/perbaikan-kasur-amblas`, `/service-kasur-depok`, `/upgrade-kasur`, `/cuci-kasur`. Kaitkan tiap kartu di `KlinikMatras.tsx:22-101` ke halaman detailnya.

### 3.3 Trade-off yang diterima
- Ada skrip prerender kustom untuk dirawat (dibanding framework yang merawatnya).
- Konten baru CMS tampil setelah rebuild (sudah demikian hari ini).
- Waktu build naik (render N halaman).
- Tailwind CDN tetap sebagai runtime styling pada Fase 1–3 (lihat risiko R3); pemindahan ke build-time membutuhkan dependency baru dan diusulkan sebagai fase terpisah.

---

## 4. Implementation phases & acceptance criteria

Setiap fase = satu deployment terpisah yang dapat di-rollback sendiri. Semua diuji di **preview deployment** sebelum produksi.

### Fase 0 — Baseline & hardening (tanpa perubahan arsitektur)
**Pekerjaan:** (a) simpan baseline HTML/status/header produksi semua route (curl) sebelum perubahan; (b) hapus blok `define` `GEMINI_API_KEY` dari `vite.config.ts:13-16` (§7); (c) hapus `<link href="/index.css">` (`index.html:132`) dan importmap tak terpakai (`:117-130`) — **verifikasi build lama tetap jalan**; (d) `robots.txt`: `Disallow: /admin/` & `/api/`; header `X-Robots-Tag` via `vercel.json`; (e) perbaiki data artikel tertukar setelah konfirmasi editor.
**Acceptance:** `npm run build` sukses; bundle tidak berubah selain yang disengaja; tak ada request 404/HTML ke `/index.css`; `/admin/` dan `/api/lead` masih berfungsi; header `X-Robots-Tag` muncul pada `/admin/` & `/api/*`.

### Fase 1 — Prerender proof-of-concept (satu route, tanpa cutover)
**Pekerjaan:** `entry-server.tsx`, `scripts/prerender.mjs`, adaptasi `useSEO` (collector), template `index.html`, hydrasi di `index.tsx`. Hasilkan HTML untuk `/` dan `/klinik-matras` saja di preview.
**Acceptance:** build SSR selesai tanpa `window is not defined`; `curl` `/klinik-matras` menampilkan `<title>`, description, canonical `https://sanomatrassehat.com/klinik-matras`, satu `<h1>`, dan teks layanan **di HTML mentah**; tidak ada peringatan hydration mismatch di console (perbaiki `ThemeToggle.tsx:6-10` — inisialisasi `light` lalu sinkron di effect, atau skrip inline pra-hydrasi yang menyetel class `dark`); tidak ada flash spinner.

### Fase 2 — Semua route + 404 + sitemap + robots
**Pekerjaan:** manifest route + `data/articles.ts`; prerender seluruh route (12 statis + 6 legacy + CMS); `NotFound` + `<Route path="*">` + `dist/404.html`; hapus rewrite catch-all; tetapkan `trailingSlash/cleanUrls` sesuai hasil tes preview; sitemap dari manifest; `robots.txt` final; validasi frontmatter CMS di prerender (build gagal dengan pesan jelas bila `title/desc/date/image` hilang).
**Acceptance:** tabel route (skrip) menunjukkan untuk **setiap** URL: status 200, satu H1, `<title>` unik, description unik, canonical = URL itu sendiri; URL acak → **HTTP 404** + `noindex`; `/klinik-matras/` → satu redirect ke versi kanonik; jumlah `<loc>` sitemap = jumlah halaman terindeks-able, semua 200 dan self-canonical; publish artikel CMS uji (di branch) muncul di HTML + sitemap.

### Fase 3 — Structured data
**Pekerjaan:** `JsonLd` komponen; `LocalBusiness` lengkap (`@id`, `geo`, `sameAs` dari `Layout.tsx:272-278`, `areaServed` sesuai konfirmasi, `logo`, jam sesuai GBP) di `/` dan `/kontak`; `BreadcrumbList` di halaman dalam; `Service` di halaman layanan/landing; `Article` di artikel (tanggal ISO, gambar); `FAQPage` hanya bila FAQ tampil nyata. Tanpa `aggregateRating` kecuali cocok dengan data GBP (hardcode 5.0 di `GoogleReviewSection.tsx:44`).
**Acceptance:** Rich Results Test/Schema validator tanpa error pada `/`, satu halaman layanan, satu artikel; konten JSON-LD identik dengan teks yang terlihat di halaman.

### Fase 4 — Halaman transaksional & internal linking
**Pekerjaan:** `ServiceLanding` + data; ubah H1/title beranda memakai "kasur/springbed" (`Home.tsx:68,146`); `Layanan.tsx` jadi hub; tautkan kartu `KlinikMatras.tsx` dan footer (`Layout.tsx:199-206` saat ini semua menaut ke 2 URL) ke halaman spesifik; artikel → layanan terkait; before/after → layanan; breadcrumb; tambahkan ke manifest → otomatis masuk prerender & sitemap.
**Acceptance:** tiap landing punya URL, title ≤ ±60 karakter, description unik, H1 memuat keyword utama, ≥ satu konten unik substantif (bukan salinan antar halaman), tautan masuk dari ≥ 3 halaman berbeda, semua tautan internal berupa `<a href>` di HTML mentah; tidak ada dua halaman menargetkan keyword utama yang sama.

### Fase 5 — Performa (opsional tetapi disarankan)
Tailwind build-time (butuh `tailwindcss` + PostCSS → **perubahan dependency, perlu persetujuan**), hapus `cdn.tailwindcss.com`; WebP/AVIF + `width/height`; video `preload="none"`; `preconnect` fonts; `og:image` kompres.
**Acceptance:** Lighthouse mobile & CrUX (bila ada) lebih baik atau setara vs baseline Fase 0; tak ada CLS baru; tampilan piksel-setara pada 5 halaman kunci (dark & light).

---

## 5. Daftar file yang perlu dimodifikasi / dibuat

**Diubah**
| File | Perubahan |
|---|---|
| `index.html` | jadikan template (placeholder head/app), hapus meta/canonical/JSON-LD statis, hapus `/index.css`, importmap |
| `index.tsx` | `hydrateRoot` + preload chunk route; fallback `createRoot` |
| `App.tsx` | `<Route path="*">`, route landing dinamis, siap dipakai server |
| `hooks/useSEO.ts` | collector context (server) + efek DOM (client), canonical tanpa query |
| `components/ThemeToggle.tsx` | hindari `localStorage` di initializer (`:6-10`) |
| `components/Layout.tsx` | footer/nav ke halaman spesifik; tidak ada perubahan perilaku WA/tracking |
| `pages/Artikel.tsx`, `pages/ArtikelDetail.tsx` | pakai `data/articles.ts`; perbaiki desc tertukar; `og:type` artikel; JSON-LD `Article` |
| `pages/KlinikMatras.tsx`, `pages/Layanan.tsx`, `pages/Home.tsx` | H1/keyword, tautan ke landing, JSON-LD |
| `vite.config.ts` | hapus `define` GEMINI (`:13-16`); konfigurasi SSR bila perlu |
| `package.json` | skrip `build` (client + ssr + prerender), `build:spa` sebagai fallback; **tanpa dependency baru** (Fase 0–4) |
| `vercel.json` | hapus rewrite catch-all, `headers` (`X-Robots-Tag` untuk `/admin`,`/api`), `trailingSlash/cleanUrls` |
| `public/robots.txt` | Disallow `/admin/`, `/api/`; Sitemap |
| `scripts/generate-sitemap.mjs` | ganti sumber ke manifest, hapus regex; `lastmod` akurat |
| `.gitignore` | pastikan `dist-ssr` (sudah ada) |

**Baru**
`entry-server.tsx`, `scripts/prerender.mjs`, `seo/routes.ts` (manifest), `seo/HeadContext.tsx`, `seo/JsonLd.tsx`, `data/articles.ts`, `data/serviceLandings.ts`, `pages/ServiceLanding.tsx`, `pages/NotFound.tsx`, `scripts/verify-routes.mjs` (uji status/canonical), dokumen `docs/` bila diperlukan.

**Tidak boleh berubah:** `api/*`, `public/admin/*` (kecuali disepakati), `utils/attribution.ts`, `utils/tracking.ts`, `utils/leadTracking.ts` (perilaku), `content/*` (kecuali perbaikan data).

---

## 6. Risiko & mitigasi

| # | Risiko | Mitigasi |
|---|---|---|
| R1 | **Hydration mismatch** (ThemeToggle `:6-10`, `ScrollReveal` opacity awal, konten bergantung waktu) → console error, flash, atau re-render penuh | Perbaiki ThemeToggle; uji console per route; fallback `createRoot` (flag) bila mismatch tak teratasi |
| R2 | `React.lazy` tanpa preload → spinner menimpa HTML server | Preload chunk route sebelum `hydrateRoot`; prerender pakai `onAllReady` |
| R3 | **Tampilan tanpa gaya sesaat (FOUC/CLS)**: styling bergantung Tailwind CDN runtime (`index.html:87`) sedangkan HTML kini terlihat sebelum JS | Skrip Tailwind CDN sinkron di `<head>` (kondisi sekarang) mengurangi risiko; **wajib** dicek dengan screenshot/Lighthouse di preview; solusi tuntas = Tailwind build-time (Fase 5) |
| R4 | Build gagal karena konten CMS invalid → publish editor memblokir deploy (publish = commit ke `main`) | Validasi frontmatter dengan pesan jelas; Vercel tetap menyajikan deployment sebelumnya bila build gagal (konten tidak hilang) — **[VERIFIKASI]**; dokumentasikan untuk editor |
| R5 | Rewrite catch-all dihapus → route yang lupa ter-prerender jadi 404 | Uji tabel route otomatis (Fase 2); daftar route berasal dari satu manifest; smoke test tautan internal |
| R6 | Perilaku `trailingSlash/cleanUrls` Vercel menghasilkan redirect loop/duplikat URL | Tes di preview sebelum pilih konfigurasi; satu bentuk URL kanonik |
| R7 | Skrip pihak ketiga (GTM/Meta/TikTok) ganda atau berubah perilaku (`PageView` di `index.html:85,141` + navigasi SPA) | Tidak diubah di Fase 0–4; bandingkan event di GTM Preview/Meta Test Events sebelum & sesudah |
| R8 | Query kampanye (`utm_*`, `fbclid`) hilang/berubah | HTML statis tak bergantung query; `captureAdReferral` tetap di effect (`Layout.tsx:48-50`); uji URL beriklan |
| R9 | Perbedaan versi Node lokal (v24.11.1) vs Vercel | Konfirmasi versi Node proyek; pin lewat `engines`/setting (**perubahan konfigurasi, perlu persetujuan**) |
| R10 | Halaman landing tipis/duplikat (doorway) → tidak membantu ranking | Konten unik, fakta layanan nyata, cakupan area yang benar-benar dilayani; review konten sebelum publish |
| R11 | Alur kerja "push langsung ke `main` (auto-deploy prod)" tidak memberi ruang uji | Gunakan **branch + preview deployment** untuk pekerjaan ini (butuh persetujuan pengguna, §9) |

---

## 7. Keamanan (poin khusus `GEMINI_API_KEY`)

**Bukti (tanpa menampilkan nilai apa pun):**
- `vite.config.ts:14-15` mendefinisikan `process.env.API_KEY` dan `process.env.GEMINI_API_KEY` dari `env.GEMINI_API_KEY` (`loadEnv`, `:6`) → Vite **mengganti secara teks** setiap kemunculan ekspresi tersebut di kode klien dengan nilai literal.
- Grep seluruh source (kecuali `node_modules`, `dist`, `.git`): **tidak ada** kode yang membaca `process.env.GEMINI_API_KEY`/`API_KEY` atau mengimpor SDK Gemini; satu-satunya referensi adalah `vite.config.ts` dan `README.md:18` (sisa template AI Studio). `package.json` tidak memuat `@google/genai`.
- Build lokal `dist/assets/*.js` (dibuat 2026-09-09): **0** kecocokan untuk `GEMINI_API_KEY|process.env` dan **0** untuk pola kunci Google (`AIza…`). Ini bukti untuk artefak lokal itu saja, **bukan** untuk build produksi.
- Tidak ada file `.env*` selain `.env.example` di folder proyek; `.gitignore` sudah mengecualikan `.env`, `.env.*`, `*.local`.

**Kesimpulan:** tidak ada bukti kunci terekspos **saat ini**. Namun `define` adalah **jalur kebocoran laten**: bila seseorang menambah kode yang membaca `process.env.API_KEY` (mis. dari contoh AI Studio) dan variabel itu terisi di Vercel, kunci akan tertanam di JS publik. Bila diaktifkan lagi dan tersebar, kunci Gemini terkait tagihan/penyalahgunaan.

**Rekomendasi:**
1. Hapus blok `define` (Fase 0). Bila Gemini tidak dipakai, hapus juga `README.md:18`.
2. Cek dashboard Vercel: apakah `GEMINI_API_KEY` ter-set. Jika ya dan tidak dipakai → hapus; jika pernah ikut build produksi, anggap **perlu dirotasi** (cek `curl` bundle produksi untuk pola kunci — tanpa mencatat nilainya).
3. Bila kelak butuh Gemini: panggil dari fungsi server (`api/*.ts`, `process.env` server-side) dan jangan pernah impor dari `src/`; hanya variabel berawalan `VITE_` yang sengaja publik.
4. Untuk SSR/prerender: bundle SSR tidak boleh mengimpor `api/_lib/*`; jangan menyalin `process.env` ke HTML.

**Catatan keamanan lain (di luar pertanyaan, dari pembacaan kode):** `api/lead.ts` tidak membatasi origin/rate dan memercayai `eventSourceUrl` dari klien (`:34,55-56`) — risiko spam email/CAPI; `api/callback.ts:74` mencatat body respons GitHub saat gagal (bukan token sukses, tetapi tinjau isi log). Tidak diubah di rencana ini; dapat jadi tugas terpisah.

---

## 8. Rencana pengujian & rollback

### 8.1 Perbandingan HTML awal sebelum/sesudah
1. **Sebelum (Fase 0):** simpan `curl -s` HTML mentah + header (`curl -sI`) untuk semua URL di manifest ke `baseline/` (di luar repo atau ter-ignore).
2. **Sesudah:** ulangi pada preview; skrip `verify-routes.mjs` mengekstrak `<title>`, meta description, canonical, `og:*`, jumlah `<h1>`, panjang teks body, keberadaan `application/ld+json`.
3. Kriteria: baseline menunjukkan title/canonical beranda di semua URL; sesudahnya masing-masing unik dan self-canonical.

### 8.2 Status HTTP & canonical semua route
Skrip: untuk tiap URL sitemap → status 200, tanpa redirect berantai, canonical = URL, tidak `noindex`; untuk `/tidak-ada`, `/artikel/tidak-ada` → 404 + `noindex`; `/admin/`, `/api/lead` (GET → 405) tetap; `robots.txt` dan `sitemap.xml` 200 (`Content-Type` benar); tes varian `http://`, `www.`, trailing slash.

### 8.3 Mobile & desktop
Playwright/Lighthouse (atau manual bila tidak ingin dependency): viewport 390×844 dan 1440×900, mode terang & gelap, semua halaman kunci; bandingkan screenshot baseline vs baru; cek console (hydration warning), Lighthouse SEO/Performance/CLS; nonaktifkan JS → konten utama terbaca.

### 8.4 Regression test (manual terpandu atau otomatis)
| Area | Uji |
|---|---|
| Formulir | `/kontak` submit valid & invalid → `POST /api/lead` 200/400; email diterima; event Meta CAPI (pakai `META_TEST_EVENT_CODE` di preview) |
| WhatsApp | floating button (`Layout.tsx:26-34`), tombol WA di Home/KlinikMatras/Pricelist/… membuka `wa.me` dengan pesan benar; tag `(ref: …)` muncul hanya untuk kunjungan berparameter iklan (`attribution.ts`) |
| Navigasi | semua link nav/footer/mobile menu, back/forward, scroll ke atas per route, deep-link langsung ke `/artikel/<slug>` |
| Artikel | 6 legacy + satu artikel CMS uji (di branch): render, gambar, markdown, meta |
| Before/After | galeri urut terbaru dulu (`utils/content.ts:70-71`) |
| Tema | toggle terang/gelap, persist setelah reload, tanpa flash/mismatch |
| Admin | `/admin/` termuat, login GitHub OAuth (`api/auth` → `api/callback`), publish entri uji → commit ke branch/repo uji |
| Tracking | GTM Preview: `PageView`, event WA; Meta Pixel Helper; TikTok Pixel — jumlah event setara baseline |

### 8.4b Build verification
`npm ci && npm run build` bersih; tidak ada error/peringatan SSR (`window is not defined`); ukuran `dist/` dan jumlah file HTML sesuai manifest; `dist/sitemap.xml` valid XML; jalankan build dengan Node versi yang dipakai Vercel.

### 8.5 Rollback strategy
- Setiap fase satu deployment; sebelum cutover catat ID deployment produksi terakhir yang sehat.
- **Rollback cepat:** Vercel → Deployments → Promote/Instant Rollback ke deployment sebelumnya (tanpa rebuild).
- **Rollback kode:** `git revert` commit fase terkait; skrip `build:spa` (build lama) dipertahankan untuk beralih cepat.
- Hydrasi bermasalah tetapi HTML baik → set flag ke `createRoot` (HTML tetap terbaca crawler).
- Bila 404 statis bermasalah → kembalikan rewrite catch-all sementara (kembali ke perilaku lama, tanpa kehilangan HTML prerender untuk route yang ada).

### 8.6 Verifikasi produksi pasca-deploy
`curl` semua route (tabel §8.2) terhadap domain produksi; URL Inspection GSC ("Live test") pada `/`, satu landing, satu artikel — bandingkan "HTML ter-crawl" vs "rendered"; kirim ulang sitemap; pantau Pages/Indexing, Soft 404, dan Core Web Vitals selama 2–4 minggu; cek log fungsi `api/lead` (tidak ada lonjakan error); pantau konversi WA/lead & event Pixel dibanding baseline. **Angka indexing/ranking hanya boleh diklaim dari GSC, bukan dari dokumen ini.**

---

## 9. Hal yang perlu dikonfirmasi sebelum implementasi

**Keputusan proses**
1. Setuju memakai **branch + Vercel preview** untuk pekerjaan ini (alur saat ini: push langsung ke `main`, auto-deploy produksi)? Tanpa preview, perilaku 404/trailing slash/`/admin` tidak dapat diuji aman.
2. Boleh menambah dependency test (mis. Playwright) untuk regresi visual? (Fase 0–4 tidak memerlukan dependency baru.)
3. Fase 5 (Tailwind build-time) butuh `tailwindcss` + PostCSS — setuju sebagai fase terpisah?

**Infrastruktur**
4. Versi Node di project settings Vercel; apakah `www.sanomatrassehat.com` terdaftar dan mengalihkan ke non-www; domain utama yang dipakai di GSC.
5. Apakah `GEMINI_API_KEY` ada di environment Vercel (lokal tidak ada `.env`)? Apakah pernah dipakai?
6. Apakah repo GitHub (`gilang2xx/website-sano`, `config.yml:3`) adalah repo yang sama dengan yang terhubung ke Vercel, dan siapa saja editor CMS (dampak validasi frontmatter/build gagal)?

**Konten & bisnis**
7. **Wilayah layanan & jemput-antar sebenarnya** (Depok saja? Jabodetabek?) — menentukan halaman area yang boleh dibuat.
8. Daftar layanan prioritas & istilah yang ingin ditargetkan (mis. "service kasur", "service springbed", "perbaikan kasur amblas"), harga/estimasi yang boleh dipublikasikan, FAQ nyata dari CS, dan foto/before-after yang boleh dipakai sebagai bukti.
9. Kategori bisnis & jam operasional di Google Business Profile (harus identik dengan JSON-LD dan `Layout.tsx` footer); NAP resmi; apakah `geo` koordinat boleh dipublikasikan.
10. Nama brand yang dipakai untuk title: "Klinik Matras by SANO CARE" (sekarang ada suffix ganda di beranda — `Home.tsx:68` + `useSEO.ts:49`); dan apakah "matras" tetap dipertahankan sebagai brand sementara "kasur/springbed" jadi kata kunci utama.
11. Desc artikel tertukar (`Artikel.tsx:24,46`) — konfirmasi teks yang benar.
12. Bentuk URL kanonik akhir (usulan: tanpa trailing slash) dan apakah URL landing di §3.2 sesuai kebijakan brand.
13. Sumber `lastmod` halaman statis (tanggal manual di manifest vs tanggal commit).

**Verifikasi eksternal yang menunggu (dari SEO_AUDIT.md §8):** status index & laporan GSC, HTML produksi saat ini, status HTTP URL acak, `/index.css`, `robots.txt`/`sitemap.xml` live — hasilnya dapat mengubah prioritas Fase 0.

---

*Tidak ada perubahan pada source code, dependencies, konfigurasi, database, atau deployment yang dilakukan selama penyusunan dokumen ini.*
