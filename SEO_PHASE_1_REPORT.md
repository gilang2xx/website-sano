# SEO_PHASE_1_REPORT — Prerender (SSG) + Client Hydration

Tanggal: 2026-09-21 · Branch: `feat/seo-ssg-implementation`
Referensi: [SEO_AUDIT.md](SEO_AUDIT.md), [SEO_ARCHITECTURE_PLAN.md](SEO_ARCHITECTURE_PLAN.md), [SEO_PHASE_0_REPORT.md](SEO_PHASE_0_REPORT.md)

**Ringkasan:** 17 route publik kini dirender ke HTML statis saat build (title, description, canonical, OG, H1, konten utama, dan link internal ada di HTML awal), lalu di-hydrate di client. Build, `tsc`, dan uji lokal di Chrome headless lulus. **Push ke remote GAGAL** (kredensial Git tidak tersedia di sesi non-interaktif), sehingga **tidak ada Vercel Preview** dan **belum ada pengujian di lingkungan Vercel/produksi**. Tidak ada merge, push ke `main`, deploy, atau perubahan env variable.

---

## 1. Persiapan

| Item | Hasil |
|---|---|
| Branch | `feat/seo-ssg-implementation` (dari `main` @ `1b7cf8a`) |
| Git status awal | hanya `M vite.config.ts` + 3 dokumen SEO_*.md untracked (milik saya); tidak ada pekerjaan lain yang tertimpa |
| Commit Fase 0 | `a1ebb61` — hapus `define` GEMINI + dokumen audit/arsitektur/Fase 0 |
| Commit Fase 1 | `7b83199` — implementasi SSG/hydration (kode saja) |
| Versi Node lokal | v24.11.1 (npm 11.6.2) |
| Versi Node di repo | **Tidak ada**: tidak ada `engines` di `package.json`, tidak ada `.nvmrc`/`.node-version`/`.tool-versions`, tidak ada folder `.vercel` |
| Versi Node production | **Tidak diketahui / tidak diverifikasi.** Kode baru hanya memakai fitur Node standar (`node:stream`, `node:fs`, `node:url`, top-level `await` di `.mjs`) — perlu Node modern (≥18). Konfirmasi di Vercel → Settings → Node.js Version. |
| Konten & deskripsi artikel | Tidak diubah (termasuk desc dua artikel yang tampak tertukar — tetap dipertahankan sesuai instruksi) |

## 2. File yang berubah (`git diff a1ebb61 7b83199`: 12 file, +468/−57)

| File | Perubahan |
|---|---|
| `entry-server.tsx` (baru) | `render(url)`: `renderToPipeableStream` + `StaticRouter` + `HeadCollectorContext`; pipe baru setelah `onAllReady`; `progressiveChunkSize: Infinity` agar halaman lazy diinline (tanpa spinner/streaming script); ekspor `STATIC_ROUTES`, `getCmsArticleSlugs()`, `renderHeadTags` |
| `scripts/prerender.mjs` (baru) | Prerender semua route, validasi (lihat §3), tulis `dist/<route>/index.html` dan `dist/spa-fallback.html` |
| `hooks/useSEO.ts` | Tambah `HeadCollectorContext`, `renderHeadTags`; data head dicatat saat render (server). Perilaku browser (efek DOM) sama seperti sebelumnya |
| `index.tsx` | `hydrateRoot` bila `#root[data-ssg-path]` = URL saat ini; selain itu `createRoot` (dev server, URL tak dikenal). Preload chunk route sebelum hydrate |
| `App.tsx` | Loader halaman diekstrak; `preloadRoute(pathname)` (tabel sinkron dengan `<Routes>`); **route dan JSX tidak berubah** |
| `components/ThemeToggle.tsx` | Tidak lagi membaca `localStorage` pada render awal (mulai `light`, baca preferensi di effect; simpan hanya saat toggle) |
| `index.html` | Skrip inline kecil: pasang class `dark` dari `localStorage` sebelum paint (agar HTML prerender tidak berkedip terang) |
| `utils/attribution.ts` | `beginAttributionHydration()` / `endAttributionHydration()`: href WhatsApp tanpa tag selama hydration, tag ditempel setelahnya |
| `components/Layout.tsx` | Effect mount memanggil `endAttributionHydration()`; `suppressHydrationWarning` pada tahun hak cipta |
| `vite.config.ts` | `build.copyPublicDir: !isSsrBuild` (SSR build tidak menyalin aset public) |
| `vercel.json` | Rewrite SPA kini ke `/spa-fallback.html` (shell asli, tanpa HTML beranda) — satu-satunya perubahan konfigurasi deploy |
| `package.json` | `build` = client build + SSR build + prerender + sitemap; `build:spa` = pipeline lama (fallback rollback). **Tanpa dependency baru** |

Tidak diubah: UI/konten, `<Routes>`, `api/*`, `public/admin/*`, `robots.txt`, `scripts/generate-sitemap.mjs`, env variable, Tailwind CDN.

## 3. Implementasi SSG / hydration

**Pipeline build** (`npm run build`): `vite build` → `vite build --ssr entry-server.tsx --outDir dist-ssr` → `node scripts/prerender.mjs` → `node scripts/generate-sitemap.mjs`.

**Prerender per route:** render React ke HTML → buang tag `<title>`/description/canonical/`og:*`/`twitter:*` statis milik beranda dari template `dist/index.html` → suntik tag unik route (identik dengan yang dibuat `useSEO` di client) setelah `<meta viewport>` → isi `<div id="root" data-ssg-path="<route>">` → tulis `dist/<route>/index.html` (beranda: `dist/index.html`).

**Guard build (gagal keras, exit 1):** halaman tanpa `useSEO`; `path` useSEO ≠ route; artikel tak ditemukan; spinner Suspense tersisa; jumlah `<h1>` ≠ 1; HTML < 2000 karakter; title duplikat; slug artikel di `pages/Artikel.tsx` ≠ `pages/ArtikelDetail.tsx`. Deskripsi duplikat hanya diberi peringatan (tidak ada pada build ini).

**Hydration & perilaku yang dijaga:**
- Hydrate hanya bila HTML memang untuk URL tersebut (`data-ssg-path`); shell SPA cadangan/URL tak dikenal/dev memakai `createRoot` seperti sebelumnya.
- `ThemeToggle`: render awal `light` (sama dengan server); preferensi dibaca di effect; class `dark` dipasang lebih awal oleh skrip head.
- **Atribusi iklan (temuan penting):** `buildWaHref()` membaca `sessionStorage` saat render. Tanpa penanganan, sesi beriklan akan menghasilkan href berbeda dari HTML server dan React tidak memperbaiki atribut `href` yang mismatch (tag referral hilang diam-diam). Solusi di atas menjaga render pertama identik lalu menempelkan tag; alur navigasi SPA berikutnya tidak berubah.
- Tahun hak cipta memakai `new Date()` (waktu build vs waktu buka) → `suppressHydrationWarning`.

**Audit hydration lain (grep seluruh `pages/`, `components/`, `utils/`):** `Math.random`/`Date.now`/`useId`/`window` saat render — tidak ada; `Intl.NumberFormat('id-ID')` di `Pricelist.tsx:49` — tidak menimbulkan mismatch pada uji; `IntersectionObserver` (`ScrollReveal`, `KebijakanPrivasi`) hanya di effect; `<iframe>` Maps dan `<video autoPlay>` hanya markup; pihak ketiga (GTM/Meta/TikTok) ada di `<head>` template, bukan komponen React.

## 4. Route yang diprerender (17)

| Route | File output | Ukuran |
|---|---|---|
| `/` | `dist/index.html` | 105,7 kB |
| `/layanan` | `dist/layanan/index.html` | 30,8 kB |
| `/pricelist` | `dist/pricelist/index.html` | 32,3 kB |
| `/artikel` | `dist/artikel/index.html` | 41,1 kB |
| `/tentang-kami` | `dist/tentang-kami/index.html` | 39,1 kB |
| `/before-after` | `dist/before-after/index.html` | 41,2 kB |
| `/kontak` | `dist/kontak/index.html` | 29,4 kB |
| `/klinik-matras` | `dist/klinik-matras/index.html` | 55,1 kB |
| `/klinik-sofa` | `dist/klinik-sofa/index.html` | 31,3 kB |
| `/sano-clean` | `dist/sano-clean/index.html` | 31,2 kB |
| `/kebijakan-privasi` | `dist/kebijakan-privasi/index.html` | 103,2 kB |
| `/artikel/klinik-matras-by-sano-care` | `dist/artikel/klinik-matras-by-sano-care/index.html` | 28,0 kB |
| `/artikel/konsep-matras-sehat` | `…/konsep-matras-sehat/index.html` | 32,2 kB |
| `/artikel/dampak-kasur-rusak` | `…/dampak-kasur-rusak/index.html` | 34,0 kB |
| `/artikel/dampak-jangka-panjang-kasur-salah` | `…/index.html` | 34,2 kB |
| `/artikel/mengenal-struktur-kasur` | `…/index.html` | 35,0 kB |
| `/artikel/kasur-ortopedik-untuk-tidur-sehat` | `…/index.html` | 30,6 kB |

Artikel CMS: 0 (folder `content/artikel` kosong) — jalur CMS ter-enumerasi otomatis lewat `getCmsArticleSlugs()` tetapi **belum diuji dengan artikel nyata**. Halaman before-after CMS ada di satu route `/before-after`.
Tambahan artefak: `dist/spa-fallback.html` (shell asli), `dist/sitemap.xml` (17 URL, generator lama tidak diubah).

## 5. Contoh HTML awal (dari `dist/`, tanpa JavaScript)

**Beranda `/` (`dist/index.html`)** — head:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Klinik Matras by SANO CARE — Servis, Upgrade &amp; Cuci Kasur di Depok | KLINIK MATRAS by SANO CARE</title>
<meta name="description" content="Kembalikan kenyamanan tidur tanpa beli kasur baru. Klinik Matras by SANO CARE melayani service, upgrade, custom matras &amp; sofa, hingga cuci kasur profesional di Depok. Konsultasi …" />
<link rel="canonical" href="https://sanomatrassehat.com/" />
<meta property="og:url" content="https://sanomatrassehat.com/" />
<meta property="og:image" content="https://sanomatrassehat.com/hero-section.png" />
```
Body: `<div id="root" data-ssg-path="/"><link rel="preload" as="image" …/><div class="min-h-screen flex flex-col …"><header …><a aria-current="page" … href="/"><img src="/klinikmatras-light.png" alt="SANO Logo" …` … (1 `<h1>`: "Bangun Tidur Bukannya Segar, Malah Sakit Semua? Itu Tan…", ±900 kata, 26 link internal).

**Non-beranda `/klinik-matras` (`dist/klinik-matras/index.html`)** — head:
```html
<title>Layanan Klinik Matras — Service, Upgrade &amp; Custom Kasur | KLINIK MATRAS by SANO CARE</title>
<meta name="description" content="16 layanan perbaikan matras: upgrade fondasi, ganti lapisan, sterilisasi tungau, hingga potong/tambah ukuran. Lihat layanan Best Seller kami dan konsultasi gratis." />
<link rel="canonical" href="https://sanomatrassehat.com/klinik-matras" />
<meta property="og:url" content="https://sanomatrassehat.com/klinik-matras" />
<meta property="og:image" content="https://sanomatrassehat.com/pelayanan-matras.png" />
```
Body: `<h1 …>Layanan <span class="text-blue-600">Klinik Matras</span></h1><p …>` ± 384 kata, 17 link internal `<a href="/…">` (nav, footer, `/klinik-sofa`, `/kebijakan-privasi`, dst.).

Ringkasan 17 route (skrip inspeksi atas HTML statis): tiap file punya tepat 1 `<title>`, 1 canonical (= URL route itu sendiri, tanpa trailing slash), 1 description, 1 `<h1>`, ≥17 link internal, 198–2435 kata teks, **tanpa spinner**. `spa-fallback.html` tidak mengandung `data-ssg-path` dan mempertahankan meta beranda default.

**Catatan konten yang sudah ada dan tidak diubah:** title beranda memuat suffix brand ganda; sebagian title >60 karakter; blok JSON-LD `LocalBusiness` statis tetap ada di semua halaman (ditangani Fase 3).

## 6. Hasil build & TypeScript

| Pemeriksaan | Hasil |
|---|---|
| `npm run build` | **Exit 0.** Client build 2372 modul (±3,7 dtk), SSR build 35 modul, `[prerender] 17 route ter-prerender (11 statis + 6 artikel)`, `[sitemap] … 17 URLs` |
| Warning | Peringatan lama `/index.css doesn't exist at build time` (dari Fase 0) muncul lagi pada build client; tidak ada error/warning baru dari SSR/prerender |
| `npx --no-install tsc --noEmit` | **Exit 0**, tanpa error |
| Pemindaian `dist/` (`*.js`, `*.html`) untuk `GEMINI` / pola `AIza…` | 0 kecocokan |
| Ukuran | `dist-ssr` 336 kB (gitignored, tidak dideploy); `dist` 33 MB (didominasi aset public) |
| Bundle client | hanya `index-*.js` (+~1,1 kB) dan `useSEO-*.js` yang berubah hash karena kode baru; chunk halaman lain tidak berubah ukuran |

## 7. Pemeriksaan hydration & fungsi (lokal)

**Metode:** Chrome 64-bit headless (instalasi lokal) dikendalikan lewat Chrome DevTools Protocol dari skrip Node tanpa dependency (skrip uji ada di scratchpad sesi, **tidak** di-commit). Server statis lokal (port 4173) menyajikan `dist/` dengan aturan: file/`index.html` direktori → fallback `spa-fallback.html` (meniru rewrite saat ini). **`/api/lead` di-MOCK oleh server lokal**; host pelacakan (Facebook, TikTok, GTM, Google Analytics) **diblok** agar tidak mengirim event ke akun produksi. Tidak ada kredensial produksi yang digunakan.

| Uji | Hasil |
|---|---|
| 17 route × 2 viewport (desktop 1280×900, mobile 390×844): tanpa console error/warning/exception, 1 `<h1>`, 1 `<title>`, 1 canonical berisi URL route, tanpa spinner | **34/34 lulus** |
| Mode gelap tersimpan diterapkan setelah reload, tanpa warning hydration; `localStorage.theme` tidak ditimpa saat mount; toggle terang↔gelap menyimpan nilai | Lulus (5 cek) |
| Atribusi: kunjungan organik → link WA tanpa tag; landing dengan `utm_*` → semua link WA bertag setelah hydration; sesi beriklan memuat `/pricelist` langsung → bertag dan tanpa mismatch; navigasi SPA ke `/klinik-matras` → link WA bertag | Lulus (5 cek) |
| Navigasi SPA `/` → `/klinik-matras` memperbarui title & canonical; tombol back kembali ke `/` dengan canonical `/` | Lulus |
| URL tak dikenal (`/url-tidak-ada`) lewat fallback: tidak crash, tanpa error, tanpa `data-ssg-path` (render seperti sebelumnya) | Lulus |
| `/klinik-matras/` (trailing slash) hydrate tanpa error | Lulus |
| Form `/kontak`: submit → `POST /api/lead` (**mock lokal**, 1 panggilan) → pesan sukses | Lulus |
| **Kontrol positif:** mismatch teks sengaja disuntik → harness menangkap `Minified React error #418`; `console.error` manual tertangkap | Lulus (membuktikan harness benar-benar mendeteksi hydration error) |

Total: 34 cek route + 18 cek fungsional = **52 lulus, 0 gagal**. Pada satu iterasi awal, skrip gagal karena selector uji salah (bukan bug aplikasi) dan satu cek navigasi bersifat vakum (halaman tanpa link WA); keduanya diperbaiki dan diulang, hasil di atas adalah run terakhir.

**Yang tidak diuji lokal:** JavaScript nonaktif di browser (HTML diperiksa statis, tidak dirender tanpa JS); Safari/Firefox/perangkat sungguhan; tampilan piksel-per-piksel vs sebelumnya (tidak ada screenshot komparatif); WhatsApp benar-benar terbuka dengan pesan yang benar (hanya href diperiksa); login admin Decap/OAuth; pengiriman email/Meta CAPI nyata; Lighthouse/Core Web Vitals; artikel CMS nyata; kilatan tak bergaya (FOUC) akibat Tailwind CDN — belum diukur.

## 8. Vercel Preview

**Tidak tersedia.** `git push -u origin feat/seo-ssg-implementation` tertahan pada Git Credential Manager (butuh login interaktif) dan saya hentikan prosesnya; tidak ada remote-tracking ref `origin/feat/seo-ssg-implementation` (dicek lokal). Saya tidak mencoba jalur kredensial lain dan tidak mengubah pengaturan deployment. **Tindakan yang dibutuhkan dari Anda:** jalankan sendiri `git push -u origin feat/seo-ssg-implementation` dari terminal yang sudah terautentikasi (hanya branch ini; jangan `main`), lalu bagikan URL preview atau minta saya menjalankan pengujian §9 terhadapnya. Perlu dicek juga bahwa Vercel Deployment Protection tidak memblokir akses ke URL preview.

## 9. Pengujian tertunda (butuh preview/produksi)

1. Perilaku Vercel untuk `dist/<route>/index.html`: apakah `/klinik-matras` (tanpa slash) langsung 200, atau redirect ke `/klinik-matras/`, atau jatuh ke `spa-fallback.html` (aman tapi tanpa manfaat SSG). **Belum terbukti** — server uji lokal saya bukan Vercel.
2. Rewrite ke `/spa-fallback.html` bekerja di Vercel; URL tak dikenal masih 200 (soft 404) sampai Fase 2.
3. Status HTTP, header, redirect www/trailing slash, `robots.txt`, `sitemap.xml` di domain preview/produksi.
4. Versi Node di build Vercel dan keberhasilan `npm run build` di sana (termasuk `vite build --ssr` dan waktu build).
5. Regresi di Vercel: form ke `/api/lead` nyata (dengan `META_TEST_EVENT_CODE` di preview), OAuth `/admin` (catatan: `api/auth.ts:9,26` meng-hardcode `sanomatrassehat.com`, jadi login admin tidak bisa diuji di domain preview), event GTM/Pixel, publish CMS.
6. Lighthouse/CWV mobile vs baseline; perbandingan visual dengan produksi; uji browser/perangkat lain; uji dengan JavaScript nonaktif; Search Console URL Inspection (Live test).

## 10. Risiko

| # | Risiko | Status |
|---|---|---|
| R1 | Vercel tidak melayani `dir/index.html` untuk URL tanpa slash seperti diharapkan (§9.1) | Terbuka; degradasi aman (jatuh ke shell SPA seperti sekarang) |
| R2 | Tailwind CDN: HTML prerender terlihat sebelum CSS dibuat oleh skrip CDN → potensi kilatan tak bergaya/CLS | Belum diukur; skrip CDN sinkron di `<head>` sehingga risiko diperkirakan rendah, **perlu dicek di preview**; solusi tuntas = Tailwind build-time (di luar Fase 1) |
| R3 | Hydration mismatch pada konten masa depan (waktu/random/`window` saat render) | Terjaga oleh uji 52 cek; belum ada lint/CI otomatis untuk ini |
| R4 | Build CMS: artikel CMS invalid menggagalkan build (sengaja) | Perlu edukasi editor; Vercel semestinya mempertahankan deployment sebelumnya (belum diverifikasi) |
| R5 | Daftar route ganda: `STATIC_ROUTES` (`entry-server.tsx`), `<Routes>` (`App.tsx`), `PRELOADERS` (`App.tsx`), `generate-sitemap.mjs` | Ada guard untuk slug artikel; manifest tunggal dijadwalkan di Fase 2 |
| R6 | `endAttributionHydration` menempelkan tag lewat DOM (bukan lewat React); bila React me-render ulang link dengan href sama, hasilnya konsisten | Diuji lokal; tidak diuji di WhatsApp nyata/CRM |
| R7 | Skrip inline tema di `index.html` menambah satu skrip di `<head>` | Kecil; tidak mengubah perilaku selain mencegah kilatan |
| R8 | `vercel.json` rewrite diubah ke `/spa-fallback.html`: bila file itu tidak terbit pada build Vercel, URL tak dikenal 404 dari Vercel (bukan 200) | Terbit dari `prerender.mjs` (terverifikasi lokal); verifikasi di preview |
| R9 | Push/preview belum ada → seluruh bukti berasal dari mesin lokal | Terbuka (§8) |
| R10 | Halaman masih memiliki masalah SEO dari audit (title panjang/suffix ganda, JSON-LD statis di semua halaman, tanpa 404 sungguhan, `/admin` & `/api` belum noindex, `/index.css`) | Sengaja di luar Fase 1 |

## 11. Rollback plan

| Skenario | Langkah |
|---|---|
| Sebelum apa pun di-push | `git checkout main` (atau `git branch -D feat/seo-ssg-implementation`) — tidak ada efek ke produksi |
| Kembali ke pipeline lama tanpa mencabut kode | Ubah `buildCommand` ke `npm run build:spa` **dan** kembalikan rewrite `vercel.json` ke `/index.html` (tanpa itu `spa-fallback.html` tidak ada) |
| Batalkan hanya Fase 1 | `git revert 7b83199` (Fase 0 `a1ebb61` tetap) |
| Hydration bermasalah tapi HTML baik | Di `index.tsx` ganti cabang hydrate menjadi `createRoot` (HTML tetap terbaca crawler, UI dirender ulang) |
| Setelah deploy produksi (di masa depan) | Vercel → Deployments → Instant Rollback / Promote deployment sehat terakhir |

## 12. Kesiapan Fase 2

**Kode siap; verifikasi di Vercel belum.** Rekomendasi: **jangan mulai Fase 2 sebelum preview diuji**, karena keputusan Fase 2 (hapus rewrite catch-all, `404.html`, `trailingSlash/cleanUrls`) bergantung pada perilaku Vercel yang belum terbukti (§9.1–9.2).

Prasyarat: (1) Anda push branch dan bagikan URL preview (atau izinkan saya mencoba lagi bila autentikasi Git sudah diatur); (2) konfirmasi versi Node Vercel; (3) keputusan bentuk URL kanonik; (4) konfirmasi desc artikel yang tertukar bila ingin diperbaiki di fase konten.

Isi Fase 2 (dari rencana): manifest route tunggal (`seo/routes.ts`) untuk router/prerender/sitemap, `NotFound` + `<Route path="*">` + `dist/404.html` dengan HTTP 404, hapus rewrite catch-all, sitemap dari manifest dengan `lastmod` akurat, `robots.txt` + header `X-Robots-Tag` untuk `/admin` dan `/api`, dan skrip verifikasi status/canonical semua route.

---
*Tidak ada push ke remote yang berhasil, tidak ada merge, tidak ada deploy, tidak ada perubahan environment variable production, dan tidak ada kredensial production yang dipakai. Semua pengujian di atas dilakukan pada build lokal.*
