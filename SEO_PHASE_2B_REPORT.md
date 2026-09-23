# SEO_PHASE_2B_REPORT — 404 sungguhan, redirect trailing slash, verifikasi deployment

Tanggal: 2026-09-24 · Branch: `feat/seo-ssg-implementation` · Commit kode: `62678c8`, `e760359`
Referensi: [SEO_PHASE_2A_REPORT.md](SEO_PHASE_2A_REPORT.md), [VERCEL_PRODUCTION_MAPPING.md](VERCEL_PRODUCTION_MAPPING.md)

**Status: acceptance criteria terpenuhi pada Vercel Preview project `website-sano` (production utama).** Semua uji preview memakai akses resmi (Protection Bypass yang diberikan pemilik), hanya GET/HEAD, tanpa POST, tanpa email/lead/event iklan, tanpa mematikan Deployment Protection. Belum ada merge ke `main` dan belum ada deploy production; perilaku production **belum** dibuktikan (lihat §9).

---

## 1. Keputusan yang dijalankan

Project produksi `website-sano` → `sanomatrassehat.com`; canonical `https://sanomatrassehat.com`; URL publik tanpa trailing slash (beranda `/`); `/admin/` dipertahankan dengan slash; project sekunder tidak diubah; Node.js `website-sano` = 24.x (konfirmasi pemilik; sama dengan Node lokal v24.11.1, tidak saya pin di repo).

## 2. File yang berubah (`git diff b36dabd HEAD`: 9 file, +376/−18)

| File | Perubahan |
|---|---|
| `pages/NotFound.tsx` (baru) | Halaman 404: H1 "Halaman Tidak Ditemukan", tautan ke `/` dan `/layanan`; `useSEO({ noindex: true })`. Gaya mengikuti blok "Artikel Tidak Ditemukan" yang sudah ada |
| `hooks/useSEO.ts` | Opsi `noindex`: `<meta name="robots" content="noindex, nofollow">`, tanpa canonical/og:url/og:image. Di client (navigasi SPA) noindex dipasang dan canonical dibuang; pada halaman indexable robots meta dihapus dan canonical dipulihkan |
| `App.tsx` | `<Route path="*">` → `NotFound`; `isPublicRoute()`; `preloadRoute()` memuat chunk NotFound untuk URL tak dikenal |
| `index.tsx` | `dist/404.html` bertanda `data-ssg-path="*"`: di-hydrate hanya bila URL memang bukan route publik; selainnya perilaku Fase 1 |
| `pages/ArtikelDetail.tsx` | `noindex: !found` (slug artikel tak dikenal tidak diindeks). UI/konten artikel tidak diubah |
| `entry-server.tsx` | Mengekspor `STATIC_ROUTES` |
| `scripts/prerender.mjs` | Menulis `dist/404.html`; tidak lagi menulis `spa-fallback.html`; **guard `vercel.json`** (gagal bila ada catch-all rewrite, daftar redirect tidak sama dengan `STATIC_ROUTES`, atau redirect menyentuh admin/api); manifest memuat `notFound` |
| `vercel.json` | **Hapus rewrite catch-all** (penyebab soft 404); tambah redirect permanen dan header (§3) |
| `scripts/verify-deployment.mjs` (baru) | Skrip verifikasi otomatis GET/HEAD (§6) |

Tidak diubah: UI/UX halaman yang ada, konten artikel, halaman layanan, Tailwind CDN, `api/*`, `public/admin/*`, env, DNS, project sekunder. Tidak ada dependency baru.

## 3. Implementasi

**404:** `dist/404.html` (prerender halaman NotFound). Tanpa rewrite catch-all, Vercel menyajikannya dengan **HTTP 404** untuk path yang tidak cocok dengan file/route/fungsi. `noindex, nofollow`, tanpa canonical.

**Redirect trailing slash (permanen, eksplisit, bukan global)** di `vercel.json`:
- `/(layanan|pricelist|artikel|tentang-kami|before-after|kontak|klinik-matras|klinik-sofa|sano-clean|kebijakan-privasi)/` → `/$1` (permanent → 308)
- `/artikel/:slug/` → `/artikel/:slug` (permanent → 308)

Sengaja **tidak** memakai `trailingSlash: false` global (akan memindahkan `/admin/` ke `/admin` dan merusak pemuatan `config.yml` Decap yang relatif) dan **tidak** memakai regex umum. `/admin/`, `/api/*`, aset, dan beranda tidak terkena. Daftar route statis di sini harus sama dengan `STATIC_ROUTES`: **build gagal** bila berbeda.

**Header:** `X-Robots-Tag: noindex, nofollow` untuk `/admin/`, `/admin/:path*`, dan `/api/:path*`. Rule `/admin/` eksplisit ditambahkan karena pada preview terbukti `/admin/:path*` tidak cocok untuk `/admin/` (dengan slash).

**Guard build (bukti negatif, lokal):** catch-all rewrite → build exit 1; menghapus `sano-clean` dari daftar redirect → exit 1; redirect `/admin/` → exit 1; file `vercel.json` dikembalikan sesudahnya.

## 4. Hasil HTTP di Vercel Preview `website-sano`

Host: `website-sano-git-feat-seo-ssg-implementation-rigss-projects.vercel.app` (deployment commit `e760359`; status GitHub `success` untuk kedua project). Diuji dengan `scripts/verify-deployment.mjs`.

**Ringkasan: 75/75 pemeriksaan lulus, 0 gagal** (run terakhir pada commit final).

| Area | Hasil pada preview |
|---|---|
| Route prerender (17) | Semua **200**, `text/html`, `data-ssg-path` = route, canonical = URL kanonik, 1 `<h1>`, 1 `<title>`, 1 meta description, tanpa noindex |
| Redirect `/x/` → `/x` (16 URL: 10 halaman + 6 artikel) | Semua **308**, `Location` = `/x` tepat |
| Query dipertahankan | `/kontak/?utm_source=uji&utm_medium=cpc&gclid=abc` → 308 → `/kontak?utm_source=uji&utm_medium=cpc&gclid=abc`; `/artikel/konsep-matras-sehat/?fbclid=xyz` → 308 dengan query utuh; canonical tetap tanpa query |
| Loop | Tidak ada; rantai `/klinik-matras/` → `/klinik-matras` = 1 hop, akhir 200 |
| Beranda `/` | 200, tidak di-redirect |
| URL tak dikenal | **404** + HTML noindex + tanpa canonical + H1 "Halaman Tidak Ditemukan": `/url-tidak-ada`, `/artikel/slug-tidak-ada`, `/klinik-matras/xyz`, `/klinik-matras.html`, `/index.css`, `/spa-fallback.html`, `/api/tidak-ada`, `/admin/tidak-ada`; `/url-tidak-ada/` berakhir 404 (bukan 200) |
| Sitemap | 200 `application/xml`; 17 `<loc>` = manifest; domain kanonik; tanpa duplikat/query/trailing slash/`changefreq`/`priority`/admin/api/404; setiap `<loc>` 200 tanpa redirect dan self-canonical |
| robots.txt | 200; `Sitemap: https://sanomatrassehat.com/sitemap.xml` |

## 5. Regresi admin, API, dan aset (preview, GET/HEAD)

| Item | Hasil |
|---|---|
| `/admin/` | **200**, tanpa redirect, HTML Decap, meta robots noindex |
| `/admin/config.yml` | **200**, `text/yaml` (bukan HTML), memuat `backend:` |
| `/admin` (tanpa slash) | 200 (informasi; tidak di-redirect, tetap berfungsi) |
| `X-Robots-Tag` | `/admin/`, `/admin`, `/admin/config.yml`, `/api/lead` = `noindex, nofollow` (nilai dari `vercel.json`; **bukti rule ini aktif**, karena default preview hanya `noindex`). Sebelum rule `/admin/` ditambahkan, `/admin/` hanya `noindex` (bawaan preview) — ditemukan lewat pengujian preview dan diperbaiki di `e760359` |
| `GET /api/lead` | **405** JSON `{"ok":false,"error":"Method not allowed"}`, `Allow: POST` |
| `HEAD /api/lead` | **405**, bukan HTML/404 |
| Aset | JS bundle (`application/javascript`), PNG, JPG, WebP, MP4, WebM, dan `/uploads/5.jpg`: semua **200** non-HTML |
| Tidak diuji | `/api/auth`, `/api/callback` (bukan GET/HEAD yang aman dan bukan cakupan), semua POST |

## 6. Skrip verifikasi otomatis

`node scripts/verify-deployment.mjs --base=https://<host> [--json]` (butuh `dist/` dan `dist-ssr/prerender-manifest.json` dari build commit yang sama). Untuk preview terlindungi: `VERCEL_BYPASS_SECRET=<secret>` lewat environment; dikirim hanya sebagai header ke host `--base` dan **tidak pernah dicetak**. Hanya GET/HEAD. Mencakup: akses, route (status/canonical/H1/metadata), redirect (permanen, query, loop), 404, sitemap, robots, admin, API, aset. Exit 1 bila ada gagal. Cek cache `immutable` untuk bundle dijadikan informasi (§9) karena default Vercel yang sama sudah berlaku di production.

## 7. Build, TypeScript, regresi lokal

| Pemeriksaan | Hasil |
|---|---|
| `npx tsc --noEmit` | Exit 0 (dijalankan pada commit final) |
| `npm run build` | Exit 0: `17 route ter-prerender, 17 peringatan (title/description existing), 0 error`, `dist/404.html`, sitemap 17 URL |
| Skrip verifikasi terhadap **emulator lokal** aturan `vercel.json` | 74/74 (alat bantu; **bukan bukti Vercel**) |
| Regresi browser lokal (Chrome headless, emulator, `/api/lead` di-mock, pixel diblok) | 34/34 route + 24/24 fungsional: dark mode, atribusi WhatsApp (organik/iklan/sesi tersimpan/SPA), navigasi + back, halaman 404 ter-hydrate (noindex, tanpa canonical), 404 → beranda memulihkan canonical, navigasi SPA ke URL tak dikenal memasang noindex, `/artikel/slug-tidak-ada`, trailing slash, form kontak (mock), kontrol positif mismatch hydration, sitemap XML (DOMParser) |
| Regresi browser **pada preview `website-sano`** (Chrome headless, cookie bypass, pixel pihak ketiga diblok, **tanpa uji form**, tanpa kontrol mismatch) | **34/34 route + 21/21 fungsional** lulus, tanpa console warning/error kecuali log 404 dokumen yang memang diharapkan untuk URL uji |

Catatan kejujuran uji: dua percobaan awal menunjukkan "gagal" yang ternyata hanya entri log browser untuk HTTP 404 dokumen itu sendiri (di HTTP/2 tertulis `404 ()`); filter pada harness (bukan aplikasi) diperbaiki dan dijalankan ulang, dan hanya untuk dua URL uji itu. Satu pemeriksaan skrip verifikasi ("bundle JS harus immutable") gagal di preview; ternyata **header yang sama berlaku di production sekarang** (`max-age=0, must-revalidate`), jadi itu bukan regresi dan diubah menjadi informasi.

## 8. Yang tidak dilakukan (sesuai batasan)

Tidak ada POST, form, email, lead, atau event iklan; tidak ada merge/push ke `main`; tidak ada deploy production; tidak ada perubahan env/DNS/project sekunder; Deployment Protection tidak dimatikan; secret bypass tidak ditulis ke file, laporan, atau commit (pemindaian repo dan log uji: 0 kecocokan).

## 9. Risiko dan rekomendasi production

| # | Risiko / temuan | Tingkat | Rekomendasi |
|---|---|---|---|
| 1 | **Preview menambahkan `X-Robots-Tag: noindex` ke semua respons**, sehingga header pada halaman publik tidak dapat dibuktikan absen di production. Rule `vercel.json` untuk admin/api terbukti aktif (nilainya berbeda dari default preview), tetapi perilaku header production tetap harus dicek setelah deploy | Sedang | Jalankan `verify-deployment.mjs` terhadap `sanomatrassehat.com` sesudah merge dan pastikan halaman publik **tanpa** `X-Robots-Tag: noindex` |
| 2 | **Rantai redirect di production:** `www.sanomatrassehat.com/x/` = 307 (domain www→apex, sudah ada) lalu 308 (trailing slash) = 2 hop; belum dapat diuji sebelum deploy | Rendah | Uji pasca-deploy; pertimbangkan menjadikan redirect www→apex permanen (308) di pengaturan domain (perubahan di dashboard oleh pemilik) |
| 3 | Daftar redirect statis di `vercel.json` harus sama dengan `STATIC_ROUTES`. Halaman statis baru tanpa update = `/x/` tetap 200 (bukan 404) | Rendah | Sudah dijaga: build gagal bila tidak sinkron |
| 4 | Duplikat URL kecil tersisa: `/index.html` dan `/klinik-matras/index.html` = 200 (self-canonical; tidak ada di sitemap); `/404.html` = 200 (noindex, tanpa canonical); `/admin` dan `/admin/` sama-sama 200 (noindex) | Rendah | Bisa ditutup dengan redirect `index.html` khusus route publik; belum dilakukan agar tidak menyentuh `/admin/index.html` |
| 5 | Header cache aset: `max-age=0, must-revalidate` (default Vercel; sama dengan production) — bundle ber-hash bisa `immutable` | Rendah (performa) | Tambah `headers` `/assets/(.*)` dengan `Cache-Control: public, max-age=31536000, immutable` di fase performa |
| 6 | **Merge ke `main` membangun KEDUA project** (`website-sano` dan `sano-website-vs`). Project sekunder ikut memakai `vercel.json` baru (404/redirect) tetapi tetap menjadi salinan publik `sano-website.vercel.app` (canonical menunjuk apex) | Sedang | Keputusan pemilik: nonaktifkan deploy/proteksi/noindex sekunder (lihat VERCEL_PRODUCTION_MAPPING.md) |
| 7 | `/artikel/slug-tidak-ada`: HTML awal = halaman 404 umum, lalu client merender pesan "Artikel Tidak Ditemukan" (kedua noindex, status 404) | Rendah | Bisa disatukan ke NotFound di fase konten |
| 8 | Sitemap/HTML tetap memuat 17 peringatan title/description existing | Rendah | Fase konten |
| 9 | **Bypass secret ada di riwayat percakapan** | Sedang | **Hapus/rotasi Protection Bypass** di Vercel setelah pengujian; jangan dipakai ulang |
| 10 | Node 24.x hanya berdasarkan konfirmasi pemilik; repo tidak mem-pin (`engines`) | Rendah | Pin `"engines": {"node": "24.x"}` bila kedua project sudah 24.x (sekunder belum diverifikasi) |

## 10. Rollback

- Batalkan Fase 2B saja: `git revert e760359 62678c8` (Fase 1 dan 2A tetap). Belum ada di `main`.
- Setelah merge, bila ada masalah: Vercel → project `website-sano` → Deployments → Instant Rollback ke deployment sebelumnya.
- Bila hanya redirect yang bermasalah: hapus blok `redirects` di `vercel.json` (guard build akan menolak, jadi hapus juga pemeriksaannya di `scripts/prerender.mjs` bagian 1b) atau revert commit.
- Bila 404 bermasalah: kembalikan rewrite catch-all sementara (kembali ke soft 404; guard build harus dilonggarkan bersamaan).

## 11. Kesiapan

- **Untuk merge ke `main` (keputusan pemilik):** kode dan preview `website-sano` lulus. Sarankan sebelum/sesudah merge: (a) hapus bypass, (b) putuskan nasib project sekunder, (c) jalankan `verify-deployment.mjs` pada `https://sanomatrassehat.com` segera setelah deploy (butuh build commit yang sama), (d) kirim ulang sitemap di Search Console dan pantau Pages/Soft 404/Redirect.
- **Verifikasi production yang masih terbuka:** header publik tanpa noindex (§9.1), rantai `www` (§9.2), URL Inspection Search Console, Core Web Vitals, admin OAuth login nyata, form/lead nyata (sengaja tidak diuji).

---
*Tidak ada merge/push ke `main`, deploy production, perubahan env/DNS/project sekunder, POST, atau tampilan secret pada fase ini.*
