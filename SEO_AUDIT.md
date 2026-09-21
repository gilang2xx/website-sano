# SEO_AUDIT — sanomatrassehat.com (Klinik Matras by SANO CARE)

Tanggal audit: 2026-09-19 · Mode: **read-only** (tidak ada source/config/dependency yang diubah; hanya file ini yang dibuat).

**Batas audit.** Semua temuan bersumber dari source code di repo ini (`website-sano-main/`) dan artefak build lokal `dist/`. Saya **tidak** mengakses website live, Google Search Console (GSC), Google Business Profile, ataupun data ranking/traffic. Karena itu tidak ada klaim tentang status index, posisi, atau traffic di laporan ini — hal-hal itu ada di bagian [Verifikasi eksternal](#8-yang-harus-diverifikasi-lewat-gsc--website-live). Keberadaan kode ≠ bukti perilaku di production.

---

## 1. Executive summary

Situs adalah **SPA React + Vite murni client-side rendering (CSR)** yang di-host di Vercel dengan rewrite `/(*) → /index.html`. Ada usaha SEO yang benar (BrowserRouter, sitemap otomatis, `useSEO` per halaman, LocalBusiness JSON-LD), tetapi arsitektur dan konten menghambat ranking untuk keyword transaksional seperti "service kasur", "service springbed", "perbaikan kasur", "kasur amblas".

Akar masalah, berurutan dari dampak terbesar:

1. **Tidak ada halaman/URL yang menargetkan keyword transaksional.** Hanya 12 route; seluruh 16 layanan matras ada dalam **satu** halaman `/klinik-matras`. Tidak ada halaman "service springbed", "perbaikan kasur amblas", ataupun halaman area (Depok dan sekitarnya). Frasa "service kasur", "servis kasur", "springbed" (di luar satu kalimat), dan "kasur amblas" (di luar deskripsi artikel) hampir tidak muncul di konten.
2. **Vocabulary mismatch.** Situs memakai kata "**matras**" ("Klinik Matras", "Service Fondasi Matras"), sementara pencari memakai "**kasur**" / "**springbed**". H1 beranda adalah copy pain-point ("Bangun Tidur Bukannya Segar…"), bukan keyword layanan.
3. **CSR tanpa prerender.** Initial HTML hanya berisi `<div id="root">`; title/description/canonical/OG per halaman, H1, konten, dan link internal baru ada setelah JS jalan. Googlebot dapat me-render JS, tetapi lebih lambat dan kurang andal; crawler lain (Bing sebagian, bot preview WA/Meta, crawler AI) tidak.
4. **Semua URL non-beranda mendapat canonical `/` dan title beranda di HTML awal**, dan URL tak dikenal mengembalikan HTTP 200 (soft 404).
5. **Structured data minimal**: hanya satu blok `LocalBusiness` statis di `index.html` (tanpa `geo`, `sameAs`, `areaServed`, `Service`, `BreadcrumbList`, `Article`, `FAQPage`).
6. **Performa/CWV berisiko**: Tailwind via CDN runtime (render-blocking), `/index.css` yang tidak ada, PNG 0,6–1 MB, video autoplay 1,2–1,6 MB ×3+, tanpa `width/height` pada gambar.

**Yang perlu dikoreksi dari asumsi umum:** sitemap, robots.txt, canonical, dan meta per halaman *ada di kode*, tetapi apakah sudah dikirim ke GSC dan ter-index **tidak dapat dibuktikan dari repo**.

---

## 2. SEO architecture

### 2.1 Stack & deployment

| Aspek | Bukti |
|---|---|
| Framework | React 19 + Vite 6, `type: module` — `package.json:6-30` |
| Router | `react-router-dom` v6, `BrowserRouter` — `index.tsx:3,14` |
| Rendering | **CSR murni**. `index.html:150` hanya `<div id="root"></div>`; tidak ada SSR/SSG/prerender di `package.json` maupun `vite.config.ts` |
| Code splitting | Semua halaman `lazy()` + `Suspense` (spinner) — `App.tsx:6-17,30` |
| Hosting | Vercel, `framework: vite`, output `dist` — `vercel.json:2-4` |
| Fallback routing | `rewrites: /(.*) → /index.html` — `vercel.json:5-7` |
| Build | `vite build && node scripts/generate-sitemap.mjs` — `package.json:8` |
| CMS | Decap CMS di `public/admin/` (konten `content/*.md` di-bundle saat build via `import.meta.glob`, `utils/content.ts:56-59,96-99`) |
| Backend | Vercel functions `api/lead.ts`, `api/callback.ts`, `api/auth.ts` (tracking/lead, tidak relevan SEO) |
| Tracking | GTM `GTM-PSDWS88V`, Meta Pixel, TikTok Pixel — `index.html:67-86,134-143` |

### 2.2 Daftar route (`App.tsx:32-43`)

| Route | Halaman | Ada di sitemap? | `useSEO` | H1 |
|---|---|---|---|---|
| `/` | Home | Ya | Ya (`Home.tsx:67`) | Copy pain-point (`Home.tsx:146`) |
| `/layanan` | Layanan (hub) | Ya | Ya (`Layanan.tsx:8`) | "Layanan Kami" (`:19`) |
| `/klinik-matras` | Klinik Matras (16 layanan) | Ya | Ya (`KlinikMatras.tsx:13`) | (`:134`) |
| `/klinik-sofa` | Klinik Sofa | Ya | Ya (`:20`) | "Klinik Sofa" (`:33`) |
| `/sano-clean` | Cuci matras/sofa | Ya | Ya (`:20`) | "Sano Clean" (`:32`) |
| `/pricelist` | Harga | Ya | Ya (`:9`) | (`:73`) |
| `/artikel` | Daftar artikel | Ya | Ya (`Artikel.tsx:8`) | (`:114`) |
| `/artikel/:slug` | Detail (6 legacy + CMS) | Ya | Ya (`ArtikelDetail.tsx:806`) | judul artikel (`:845`) |
| `/before-after` | Galeri | Ya | Ya (`:7`) | (`:26`) |
| `/kontak` | Kontak | Ya | Ya (`:15`) | "Hubungi Kami" (`:69`) |
| `/tentang-kami` | Tentang | Ya | Ya (`:24`) | "Tentang Kami" (`:37`) |
| `/kebijakan-privasi` | Privasi | Ya | Ya | — |
| `*` (404) | **Tidak ada** | — | — | — |

Slug artikel legacy (`pages/Artikel.tsx:19,30,41,52,63,74`): `klinik-matras-by-sano-care`, `konsep-matras-sehat`, `dampak-kasur-rusak`, `dampak-jangka-panjang-kasur-salah`, `mengenal-struktur-kasur`, `kasur-ortopedik-untuk-tidur-sehat`. `content/artikel/` hanya berisi `.gitkeep` → **0 artikel CMS**.
Before/after: 10 file `.md` di `content/before-after/`, **tanpa URL sendiri** (hanya satu halaman galeri `/before-after`).
**Tidak ada route lokasi/area, tidak ada route per-layanan.**

---

## 3. Temuan

Format: **ID — judul** · Severity · Bukti · Dampak SEO · Rekomendasi.

### CRITICAL

#### C1 — Tidak ada halaman/URL untuk keyword transaksional
- **Bukti:** `App.tsx:32-43` (hanya 12 route). Semua 16 layanan berupa kartu dalam satu array di `pages/KlinikMatras.tsx:22-101`, tanpa URL per layanan. Grep di `pages/`, `components/`, `content/`: "service kasur"/"servis kasur" = 0 di body (hanya `Home.tsx:68-69` title/description); "springbed" hanya 1× (`Layanan.tsx:58`); "kasur amblas" hanya di deskripsi artikel (`Artikel.tsx:24`, `ArtikelDetail.tsx:77,289`); "perbaikan kasur" = 0; "Depok" hanya alamat & 1 title/desc; kota lain (Jakarta/Bogor/Bekasi/Tangerang) = 0.
- **Dampak:** Google tidak punya halaman yang cocok secara intent untuk "service springbed", "perbaikan kasur amblas", "service kasur Depok". Satu halaman tidak bisa memenangkan puluhan intent berbeda. Ini penyebab utama "tidak terlihat" untuk keyword umum.
- **Rekomendasi:** Buat landing page terpisah dengan H1/title/konten unik, mis.: `/service-kasur`, `/service-springbed`, `/perbaikan-kasur-amblas`, `/upgrade-kasur-sehat`, `/cuci-kasur`, `/service-kasur-depok` (+ area sekitar bila memang dilayani: Jakarta Selatan, Bogor, Bekasi, dst. — hanya jika layanan jemput-antar benar-benar mencakup area itu; jangan buat doorway page). Tiap halaman: penjelasan masalah, proses, harga/estimasi, before-after relevan, FAQ, CTA WA, internal link. Jadikan tiap layanan penting di `KlinikMatras.tsx` link ke halaman detailnya.

#### C2 — Halaman dirender hanya via JavaScript; HTML awal identik untuk semua URL
- **Bukti:** `index.html:150` (`<div id="root">`), `hooks/useSEO.ts:47-72` (title, description, canonical, OG di-set dalam `useEffect`), komentar penulis sendiri di `useSEO.ts:7-11` dan `index.html:12-15` mengakui bot non-JS hanya melihat versi statis. `vercel.json:5-7` melayani `index.html` yang sama untuk semua path. `package.json` tidak punya prerender/SSR (mis. vite-ssg, react-snap, Next).
- **Dampak:** Konten, H1, link internal, dan meta unik per halaman tidak ada di HTML awal. Googlebot mengantre render JS (indexing lambat/tidak konsisten, terutama untuk situs baru berotoritas rendah). Bot yang tidak menjalankan JS (preview WA/Meta, sebagian crawler AI/Bing) melihat halaman kosong dengan meta beranda. Untuk situs jasa lokal yang bersaing di keyword umum, ini hambatan besar.
- **Rekomendasi:** Prerender/SSG saat build untuk semua route (mis. `vite-plugin-ssr`/`vike`, `vite-react-ssg`, atau migrasi ke Next.js/Astro). Minimal: prerender semua route publik + hasilkan `<title>`, description, canonical, OG, JSON-LD, dan konten utama langsung di HTML statis per route. Verifikasi dengan `curl` (lihat §8).

#### C3 — Canonical, title, description, OG di HTML awal salah untuk semua halaman non-beranda
- **Bukti:** `index.html:8-10,19-26` menetapkan `<link rel="canonical" href="https://sanomatrassehat.com/">` dan meta beranda; rewrite (`vercel.json:5-7`) mengirim HTML ini untuk `/klinik-matras`, `/artikel/…`, dll. Perbaikan hanya terjadi setelah JS (`useSEO.ts:55-70`).
- **Dampak:** Sebelum render JS, setiap URL mendeklarasikan canonical ke `/` → risiko sinyal canonical konflik dan halaman dalam dianggap duplikat beranda oleh crawler/tahap awal pipeline; preview link sosial selalu memakai brand-level. Efeknya terselesaikan bersama C2.
- **Rekomendasi:** Diselesaikan oleh prerender (C2). Sampai itu selesai, jangan andalkan `useSEO` untuk canonical.

#### C4 — URL tak dikenal mengembalikan 200 (soft 404) dan tidak ada rute 404
- **Bukti:** `App.tsx:31-44` tidak punya `<Route path="*">`; `vercel.json:5-7` me-rewrite semua path ke `index.html` (status 200). Untuk slug artikel tak ada, `ArtikelDetail.tsx:815-820` menampilkan "Artikel Tidak Ditemukan" tanpa `noindex`, sementara `useSEO` (`:806-812`) tetap memasang canonical ke URL tak valid tersebut.
- **Dampak:** Soft-404 masif membuang crawl budget dan bisa terindex sebagai halaman tipis; laporan GSC "Soft 404". Juga URL parameter apa pun (`?fbclid=`, `?utm_…` dari iklan Meta) diproses sebagai halaman valid tanpa canonical bersih setelah JS gagal (lihat M4).
- **Rekomendasi:** Tambah route `*` dengan halaman 404 + `<meta name="robots" content="noindex">`; dengan prerender/SSR kembalikan status 404 asli (atau rewrite Vercel hanya untuk route yang dikenal).

### HIGH

#### H1 — H1 beranda tidak memuat keyword layanan; title/H1 memakai "matras", bukan "kasur/springbed"
- **Bukti:** `Home.tsx:146-156` H1 = "Bangun Tidur Bukannya Segar, Malah Sakit Semua? Itu Tanda Dampak Kasur Tidak Sehat!". Title (`Home.tsx:68`) memuat "Servis, Upgrade & Cuci Kasur di Depok" (baik), tetapi brand & nama layanan dominan "Matras" (`KlinikMatras.tsx:14`, `Layout.tsx:199-205`, `Pricelist.tsx:21`). Komponen `AnimatedHeroText.tsx:46` berisi `<h1>` tetapi **tidak dipakai** di mana pun (grep `<AnimatedHeroText` = 0; hanya di-import `Home.tsx:56`) — dead code yang berpotensi menimbulkan H1 ganda bila dipasang.
- **Dampak:** Sinyal relevansi kuat beranda ke keyword pain-point, bukan ke "service kasur / perbaikan kasur". Kata "kasur" dan "springbed" adalah istilah volume pencarian di Indonesia; "matras" lebih jarang dipakai publik.
- **Rekomendasi:** H1 beranda mis. "Service & Perbaikan Kasur Springbed di Depok" + subheading pain-point. Pakai "kasur/springbed" sebagai istilah utama, "matras" sebagai brand/sinonim.

#### H2 — Halaman layanan utama tipis dan tanpa konten keyword/FAQ/area
- **Bukti:** `KlinikMatras.tsx` (9 KB) = daftar 16 kartu + deskripsi 1 kalimat (`:22-101`), meta description (`:15`) memakai "matras". `KlinikSofa.tsx` (5,6 KB), `SanoClean.tsx` (5,5 KB), `Layanan.tsx` (7,7 KB) serupa. Tidak ada FAQ, langkah proses berteks, atau info area layanan di halaman-halaman ini.
- **Dampak:** Konten tipis + keyword sempit → sulit bersaing untuk query transaksional; `/layanan` dan `/klinik-matras` saling tumpang tindih (keyword cannibalization ringan: keduanya mendeskripsikan layanan matras).
- **Rekomendasi:** Perkaya halaman kategori (300–800+ kata bermanfaat), tambah FAQ, dan pecah per layanan (lihat C1). Jadikan `/layanan` hub yang hanya mengarahkan ke halaman spesifik.

#### H3 — Structured data hanya `LocalBusiness` statis; tidak ada `Service`, `BreadcrumbList`, `Article`, `FAQPage`
- **Bukti:** satu blok JSON-LD di `index.html:33-65`. Grep `ld+json` di `pages/`/`components/` = 0. Blok ini juga ada di **semua** halaman (karena statis di `index.html`).
- **Kekurangan blok:** tidak ada `@id`, `geo`, `sameAs` (Instagram/Facebook/TikTok ada di `Layout.tsx:272-278`), `areaServed`, `priceRange`, `logo`; `image` memakai `hero-section.png` (ilustrasi). Jam operasional statis (Sen–Jum 08–17, Sab 08–15) — pastikan sama dengan `Layout.tsx:250+` dan GBP.
- **Dampak:** Tidak ada rich result/entity signal per halaman; pencocokan entitas lokal lemah.
- **Rekomendasi:** JSON-LD per route (dihasilkan saat prerender): `LocalBusiness` (+`geo`, `sameAs`, `areaServed`) di beranda/kontak; `Service` per halaman layanan; `BreadcrumbList` di halaman dalam; `Article` di artikel; `FAQPage` hanya jika FAQ nyata tampil di halaman. Jangan tambahkan `aggregateRating` kecuali cocok persis dengan review yang terverifikasi (lihat L3).

#### H4 — Internal linking lemah; halaman penting hanya dapat dijangkau lewat JS-navigation
- **Bukti:** Navigasi via `NavLink` (`Layout.tsx:65-111,154-164`) — dirender JS. Semua 7 item "Layanan Kami" di footer menaut ke **dua URL yang sama** `/klinik-matras` / `/klinik-sofa` (`Layout.tsx:199-206`); anchor text bervariasi tetapi target sama, tidak ada URL spesifik. Artikel tidak menaut ke halaman layanan (dari sampel `ArtikelDetail.tsx`, hanya 2 `Link`, mayoritas `<a href>` adalah WA/eksternal). Before/after tidak menaut ke layanan terkait (`BeforeAfter.tsx` 0 link).
- **Dampak:** Sedikit sinyal anchor text keyword, tidak ada cluster topikal, halaman artikel yatim dari sisi konversi/relevansi.
- **Rekomendasi:** Bangun cluster: artikel edukasi → halaman layanan yang relevan (anchor deskriptif "service springbed"), before-after → halaman layanan sejenis, breadcrumb, dan blok "layanan terkait". Pastikan link berupa `<a href>` yang ada di HTML prerender.

#### H5 — Tidak ada konten/URL area layanan (lokal)
- **Bukti:** lihat C1; alamat hanya di footer/kontak (`Layout.tsx:216`, `Kontak.tsx:83`), tidak ada penjelasan cakupan jemput-antar (`Home.tsx:788-795` hanya menyebut "Jemput"/"Antar" tanpa wilayah).
- **Dampak:** Sulit muncul di query "service kasur Depok/dekat saya"; sinyal lokal bergantung nyaris sepenuhnya pada GBP.
- **Rekomendasi:** Halaman "Service Kasur Depok" (dan area lain yang sungguh dilayani) dengan cakupan wilayah, ongkos/estimasi jemput, testimoni lokal, embed peta, NAP identik dengan GBP. Konfirmasi wilayah aktual dengan tim ops sebelum menulis.

### MEDIUM

#### M1 — Sitemap: `lastmod` palsu, `changefreq/priority` tak berguna, parser rapuh
- **Bukti:** `scripts/generate-sitemap.mjs:89,93` — semua halaman statis mendapat `lastmod` = tanggal build hari ini; `:16-28` priority/changefreq statis (diabaikan Google). `:44-63` artikel legacy di-parse dengan regex atas teks `pages/Artikel.tsx` (`slug:…[\s\S]*?date:…`) — rapuh: perubahan format objek, atau entri tanpa `date`, dapat mengambil `date` milik artikel berikutnya. Artikel CMS memakai nama file sebagai slug (`:77`). Before/after tidak masuk sitemap (memang tidak punya URL).
- **Dampak:** `lastmod` yang selalu berubah membuat Google belajar mengabaikan sinyal lastmod. Risiko sitemap salah saat struktur artikel berubah.
- **Rekomendasi:** `lastmod` hanya dari tanggal perubahan konten nyata; hapus priority/changefreq; ambil daftar route dari satu sumber data yang sama dengan router; tambahkan rute baru (C1) otomatis.
- **Catatan bukti:** `dist/sitemap.xml` ada di mesin lokal (berisi 2026-09-09) tetapi `dist` di-gitignore (`.gitignore:11`); itu artefak lokal, **bukan bukti** sitemap live.

#### M2 — `robots.txt` minimal; `/admin/` tidak diblokir/noindex
- **Bukti:** `public/robots.txt:1-4` (Allow all + Sitemap). `public/admin/index.html` (Decap CMS) tanpa `<meta name="robots" content="noindex">`; `public/uploads/` tersedia.
- **Dampak:** Rendah–sedang: halaman admin bisa dicrawl/di-index (tidak ada di sitemap). Tidak ada Disallow untuk endpoint `/api/`.
- **Rekomendasi:** `Disallow: /admin/` dan `/api/`, plus noindex meta di `public/admin/index.html`. (Jangan blokir `/assets/` — Google perlu JS/CSS untuk render.)

#### M3 — `<link rel="stylesheet" href="/index.css">` menunjuk file yang tidak ada
- **Bukti:** `index.html:132`; `index.css` tidak ada di root maupun `public/` (Test-Path = False). Karena rewrite `/(.*) → /index.html` (`vercel.json:5-7`), permintaan ini kemungkinan dijawab HTML 200 (perlu verifikasi live).
- **Dampak:** Request render-blocking sia-sia; berpotensi menambah latensi dan noise di log/GSC. Tidak ada efek langsung ke relevansi.
- **Rekomendasi:** Hapus tag tersebut atau sediakan file.

#### M4 — Parameter URL kampanye tidak dinormalisasi; canonical bergantung JS
- **Bukti:** situs memakai atribusi `utm_*`/`fbclid` (`utils/attribution.ts`, commit `a67a2c3`), dan `useSEO.ts:57` canonical dibuat dari `path` tanpa query (baik), tetapi hanya setelah JS; canonical statis `index.html:10` selalu `/`.
- **Dampak:** Varian URL berparameter bisa terindeks terpisah jika render gagal. Efek nyata perlu dicek di GSC (Pages → Duplicate/Alternate).
- **Rekomendasi:** Canonical server-side per route (prerender). 

#### M5 — Duplikasi/cannibalization antar halaman
- **Bukti:** `/layanan` (`Layanan.tsx:9-10`) dan `/klinik-matras` (`KlinikMatras.tsx:14-15`) menargetkan intent sama ("layanan/service matras"); beranda (`Home.tsx:68`) title juga "Servis, Upgrade & Cuci Kasur"; `/pricelist` mengulang layanan yang sama (`Pricelist.tsx:21,30,39`) dengan `KlinikMatras`. Suffix title `| KLINIK MATRAS by SANO CARE` (`useSEO.ts:49`) menambah panjang; beberapa title akan melewati ±60 karakter dan terpotong (mis. `Home.tsx:68` sendiri ±68 + suffix di `useSEO`, sehingga `document.title` beranda menjadi "…di Depok | KLINIK MATRAS by SANO CARE" — sekitar 100 karakter).
- **Rekomendasi:** Tetapkan 1 halaman utama per intent (peta keyword → URL); persingkat title ≤60 karakter; hilangkan suffix ganda di beranda.

#### M6 — Performa: Tailwind CDN runtime, import map tak terpakai, font blocking
- **Bukti:** `index.html:87` `<script src="https://cdn.tailwindcss.com">` (JIT di browser, render-blocking, tidak untuk production), `:90-107` konfigurasi Tailwind inline; `:117-130` importmap ke `aistudiocdn.com` (sisa template AI Studio; hasil `vite build` di `dist/assets/` sudah di-bundle sehingga importmap tidak terpakai); `:88` Google Fonts stylesheet tanpa `preconnect`. Skrip GTM + Meta + TikTok dimuat di `<head>` (`:67-86,134-143`).
- **Dampak:** LCP/FCP lebih lambat, terutama di mobile; CLS dari FOUC saat Tailwind CDN menghasilkan CSS. CWV adalah sinyal ranking (tie-breaker) dan memengaruhi konversi.
- **Rekomendasi:** Pasang Tailwind lewat PostCSS/plugin Vite (CSS statis), hapus importmap, `preconnect` ke fonts, tunda pixel non-kritis (via GTM/`requestIdleCallback`).

#### M7 — Optimasi gambar & video
- **Bukti:** `public/` PNG total ±4,7 MB; `sano-mattsehat-3.png` 993 KB, `-2.png` 884 KB, `pelayanan-matras.png` 919 KB, `pelayanan-sofa.png` 658 KB, `hero-section.png` 342 KB (juga dipakai sebagai `og:image`, `index.html:22`). Video `.mp4/.webm/.mov` 1,1–1,6 MB masing-masing, tiga video autoplay di beranda (`Home.tsx:172-181`, `:378,425,471`) dan file `.mov` di `public/` (tidak layak web). Grep `<img`: tidak ada satu pun atribut `width/height` (mis. `Home.tsx:225,307,329,392,485,661-686`) → risiko CLS. `Home.tsx:225` (`/sano-matras.jpg`, banner 500–600 px) tanpa `loading`/`fetchpriority`/dimensi. Commit `9118953` menambah `loading="lazy"` di gambar bawah fold (benar; 12 dari 13 di Home).
- **Dampak:** Bobot halaman & LCP; gambar tidak dalam format modern.
- **Rekomendasi:** Konversi ke WebP/AVIF + `srcset`, tambah `width/height`, `poster` sudah ada (baik), `preload="none"` pada video di bawah fold, hapus `.mov` dari `public/`. Kompres `og:image` (target ≤ 200 KB, 1200×630).

#### M8 — Alt text kurang deskriptif & satu `<img>` tanpa alt
- **Bukti:** `Home.tsx:392,439` alt "Too Soft" (Inggris, bukan deskriptif), `:485` "Too Hard", `:307,329` "Klinik Matras"/"Klinik Sofa", `Home.tsx:225` "Solusi Kasur Sano". `Kontak.tsx` punya 1 `loading="lazy"` tetapi 0 `<img>` (kemungkinan iframe peta — belum saya periksa apakah ber-`title`). `Layout.tsx`: 3 `<img>` semuanya ber-alt.
- **Dampak:** Peluang keyword di image search & aksesibilitas terlewat.
- **Rekomendasi:** Alt deskriptif berbahasa Indonesia yang memuat konteks ("Kasur springbed amblas sebelum diservis"), khususnya galeri before/after.

### LOW

- **L1 — Galeri Before/After tidak punya URL/teks per kasus** (`content/before-after/*.md`, `pages/BeforeAfter.tsx`). Judul & desc pendek (mis. `01.md`); peluang long-tail terlewat. Pertimbangkan `/before-after/:slug` untuk kasus kuat ("kasur bergelombang amblas sakit pinggang", `kasur-bergelombang-amblas-keluhan-sakit-pinggang.md`). Gambar hasil CMS menunjuk `/uploads/5.jpg`, `/uploads/6.jpg` — periksa ukurannya.
- **L2 — Artikel: tanpa `Article` schema, tanpa tanggal ISO, tanpa penulis** (`ArtikelDetail.tsx:845`; tanggal string "27 Des 2025"). Tidak ada artikel yang menargetkan keyword ("cara memperbaiki kasur amblas", "biaya service springbed", "ciri kasur harus diganti/servis"). `content/artikel/` kosong (0 artikel CMS).
- **L3 — Rating Google 5.0 di-hardcode** (`GoogleReviewSection.tsx:44`) beserta daftar testimoni statis. Bukan masalah crawling, tapi jangan dijadikan `aggregateRating` di schema tanpa sinkron ke GBP; klaim rating harus bisa diverifikasi (risiko kebijakan review Google).
- **L4 — Twitter card/OG `og:type="website"` untuk artikel** (`useSEO.ts:59`); seharusnya `article` untuk artikel.
- **L5 — `alternate`/`hreflang`** tidak perlu (satu bahasa) — tidak ada temuan; `lang="id"` sudah benar (`index.html:2`).
- **L6 — Keamanan/higienis build (di luar SEO):** `vite.config.ts:14-15` meng-inline `GEMINI_API_KEY` ke bundle klien bila variabel itu di-set saat build. Periksa apakah key ada di Vercel env; jika ya, cabut dan hapus `define` tersebut. Tidak berkaitan langsung dengan ranking.
- **L7 — Domain/redirect:** tidak ada konfigurasi redirect `www`↔non-`www` atau trailing slash di `vercel.json` (Vercel menangani domain alias di dashboard, bukan di repo) → **tidak dapat diverifikasi dari kode**, lihat §8.

---

## 4. Ringkasan pemeriksaan per poin permintaan

| # | Poin | Hasil |
|---|---|---|
| 1 | Stack/rendering | Vite SPA, CSR, Vercel (§2.1) |
| 2 | robots/sitemap/canonical/redirect | robots minimal (M2); sitemap otomatis ada namun lastmod semu (M1); canonical statis `/` (C3); redirect www/trailing slash **tidak ada di repo** (L7); tidak ada `noindex` di halaman publik; halaman 404 tidak ada (C4) |
| 3 | Metadata | Title/description unik per route ada via JS (`useSEO`), hierarki H1 satu per halaman (Home H1 lemah, H1); slug rapi; alt kurang (M8); cannibalization (M5) |
| 4 | Initial HTML | Hanya shell (C2, C3) |
| 5 | Route & internal link | 12 route, tidak ada route per layanan/lokasi (C1, H5), link lemah (H4) |
| 6 | Structured data/CWV | LocalBusiness statis saja (H3); CWV risiko (M6, M7) |
| 7 | Kode/build/deploy | Rewrite catch-all (C4), `/index.css` hilang (M3), importmap sisa (M6) |
| 8 | Keyword transaksional | **Tidak ada** halaman servis kasur / service springbed / kasur amblas / Depok (C1, H5) |

---

## 5. Rekomendasi teknis ringkas

1. **Prerender semua route** (SSG) dengan meta, canonical, JSON-LD, dan konten di HTML awal; kembalikan 404 sungguhan.
2. **Bangun arsitektur URL keyword**: halaman per layanan + halaman area, dengan konten unik dan internal link cluster.
3. **Ganti vocabulary**: "kasur/springbed" sebagai istilah utama di H1/title/anchor; "matras" sebagai brand.
4. **Schema per halaman** (Service, BreadcrumbList, Article, FAQ jika nyata, LocalBusiness lengkap).
5. **Perbaiki performa**: Tailwind build-time, gambar WebP/AVIF + dimensi, video `preload="none"`, hapus `/index.css` & importmap, preconnect fonts.
6. **Sitemap** dari sumber data tunggal dengan `lastmod` akurat; robots: blok `/admin/`, `/api/`.
7. **Konten**: artikel target keyword transaksional/informational, before-after per kasus, FAQ.

---

## 6. Implementation roadmap

| Fase | Waktu | Item | Sasaran |
|---|---|---|---|
| **0 — Verifikasi** | Hari 1–2 | Jalankan checklist §8 (curl HTML mentah, GSC URL Inspection, cek Pages/Sitemaps, cek status 404, redirect www) | Data dasar sebelum ubah apa pun |
| **1 — Quick win** (tanpa ubah arsitektur) | Minggu 1 | Ubah H1/title beranda ke "kasur/springbed"; hapus `/index.css`; blok `/admin/`,`/api/` di robots; route `*` + noindex; alt text; perbaiki lastmod; pastikan GBP/NAP konsisten | Kurangi noise, sinyal relevansi beranda |
| **2 — Fondasi teknis** | Minggu 2–4 | Prerender/SSG semua route (C2, C3, C4); JSON-LD per route; Tailwind build-time; optimasi gambar/video | Konten & meta terlihat di HTML awal; CWV lebih baik |
| **3 — Ekspansi keyword** | Minggu 3–8 | Halaman `service-kasur`, `service-springbed`, `perbaikan-kasur-amblas`, `cuci-kasur`, `service-kasur-depok` (+area sesuai cakupan nyata); internal link cluster; FAQ; breadcrumb | Menjawab keyword transaksional |
| **4 — Konten & otoritas** | Bulan 2–4 | Artikel long-tail (CMS), halaman before-after per kasus, ulasan/GBP, backlink lokal (direktori, media, komunitas) | Otoritas topikal & lokal |
| **5 — Monitoring** | Berkelanjutan | Pantau GSC (Coverage/Pages, Performance query per halaman), CWV field data, ranking terhadap peta keyword | Ukur dampak (angka baru bisa diklaim dari GSC, bukan dari audit ini) |

---

## 7. Peta keyword → URL (usulan, untuk divalidasi dengan data GSC/riset keyword)

| Intent | URL saat ini | URL usulan |
|---|---|---|
| service kasur / servis kasur | tidak ada | `/service-kasur` |
| service springbed | tidak ada | `/service-springbed` |
| perbaikan kasur amblas | tidak ada (hanya artikel) | `/perbaikan-kasur-amblas` |
| upgrade/ganti busa/latex | kartu di `/klinik-matras` | `/upgrade-kasur` (+ sub) |
| cuci kasur | `/sano-clean` (nama brand, bukan keyword) | `/cuci-kasur` atau retitle `/sano-clean` |
| service kasur Depok | tidak ada | `/service-kasur-depok` |
| harga service kasur | `/pricelist` | tetap, retitle memakai "harga service kasur" |

---

## 8. Yang harus diverifikasi lewat GSC / website live

Tidak ada dari daftar ini yang dapat dibuktikan dari kode.

**Website live (`curl`/View Source, bukan Inspect Element):**
1. `curl -s https://sanomatrassehat.com/klinik-matras` → apakah `<title>`, canonical, H1, konten sudah unik di HTML mentah (perkiraan dari kode: **belum**, canonical = `/`).
2. `curl -sI https://sanomatrassehat.com/asdf-tidak-ada` → status code (perkiraan: 200).
3. `curl -sI https://sanomatrassehat.com/index.css` → apakah 200 text/html atau 404.
4. `https://sanomatrassehat.com/robots.txt` dan `/sitemap.xml` → benar-benar terlayani, jumlah URL, `lastmod`.
5. `http://`→`https://`, `www.`↔non-`www`, trailing slash: hanya satu versi yang 200, sisanya 301.
6. `https://sanomatrassehat.com/admin/` → apakah publik & ter-index.
7. PageSpeed Insights / CrUX mobile untuk `/` dan `/klinik-matras` (LCP, CLS, INP).
8. Rich Results Test untuk beranda (LocalBusiness valid?) dan uji tampilan preview di WhatsApp.

**Google Search Console:**
1. Kepemilikan properti (Domain vs URL-prefix; apakah `www` dan non-`www` terdaftar).
2. Sitemaps: sudah disubmit? status, jumlah URL discovered.
3. Pages (Indexing): berapa URL "Indexed" vs "Crawled – currently not indexed" / "Discovered – not indexed" / "Duplicate, Google chose different canonical" / "Soft 404" / "Alternate page with proper canonical tag".
4. URL Inspection pada `/klinik-matras`, `/artikel/dampak-kasur-rusak`: bandingkan "HTML yang di-crawl" vs "rendered HTML", dan "User-declared canonical" vs "Google-selected canonical".
5. Performance: query yang sudah memberi impresi (apakah ada "service kasur", "service springbed", "servis kasur depok"), halaman mana yang mendapat impresi, CTR, posisi rata-rata — untuk menyusun peta keyword dengan data nyata.
6. Core Web Vitals report (mobile), Mobile Usability, Manual actions/Security issues.
7. Struktur data: Enhancements report (LocalBusiness, dst.).

**Google Business Profile & lainnya:**
1. Kategori utama (mis. "Tukang kasur"/"Toko perlengkapan kasur"?), layanan, area layanan, jam, foto — cocok persis dengan NAP di `index.html:33-65` / `Layout.tsx:216-250`.
2. Jumlah & rating review riil vs angka hardcode `GoogleReviewSection.tsx:44`.
3. Konfirmasi wilayah jemput-antar aktual sebelum membuat halaman area.
4. Vercel dashboard: domain utama, redirect www, env var (`GEMINI_API_KEY` ter-set?), status deploy terakhir vs commit `1b7cf8a`.
5. Apakah Decap CMS menerbitkan langsung ke `main` (memicu deploy) — pastikan konten baru ikut sitemap.

---

*Akhir laporan. Tidak ada perubahan pada source code, dependencies, konfigurasi, database, atau deployment yang dilakukan selama audit.*
