# SEO_PHASE_2C_RELEASE_READINESS — Kesiapan produksi

Tanggal: 2026-09-24 · Branch: `feat/seo-ssg-implementation` (11 commit di depan `main`, 0 di belakang)
Referensi: [SEO_PHASE_2B_REPORT.md](SEO_PHASE_2B_REPORT.md), [SEO_PHASE_2A_REPORT.md](SEO_PHASE_2A_REPORT.md), [VERCEL_PRODUCTION_MAPPING.md](VERCEL_PRODUCTION_MAPPING.md)

**Kesimpulan singkat:** dari sisi kode dan seluruh pemeriksaan yang bisa saya lakukan secara read-only, branch **siap untuk di-merge**. Tidak ada blocker teknis pada kode. Ada **2 blocker yang sifatnya keputusan/konfirmasi owner** (§4) dan beberapa temuan HIGH yang sebaiknya selesai sebelum merge, terutama penanganan domain sekunder. **Production belum lulus apa pun** dari sudut pandang build baru: production saat ini masih menjalankan build lama (SPA), dan hasil Preview **tidak** saya anggap sebagai bukti production. Yang dibuktikan untuk production hanyalah keadaan **sekarang** (baseline) plus jalur domain/OAuth/API yang tidak berubah oleh merge.

**Batasan pekerjaan ini (dipatuhi):** read-only; tidak ada merge/push ke `main`, deploy production, perubahan setting Vercel, DNS, domain, env, atau project sekunder; protection tidak dimatikan; bypass secret lama tidak dipakai lagi dan tidak dicetak; tidak ada POST/lead/event iklan; sitemap tidak dikirim ulang.

**Perubahan kode pada fase ini (dijelaskan lebih dulu sesuai instruksi):** hanya **satu file alat baru**, `scripts/verify-production.mjs` (permintaan tugas 7). File di folder `scripts/` tidak disajikan ke pengunjung, tidak dimuat oleh aplikasi, dan tidak mengubah build/perilaku runtime. Tidak ada perubahan UI, aset, dependency, `vercel.json`, atau konfigurasi. Tidak ada perubahan kode lain yang saya anggap diperlukan untuk rilis.

---

## 1. Audit kedua project Vercel

**Batas akses:** Vercel CLI terpasang tetapi tanpa kredensial (`No existing credentials found`), tidak ada `VERCEL_TOKEN` di lingkungan, dan saya tidak memakai bypass lama. Maka Project ID, setting dashboard, dan nilai/scope environment variable **tidak dapat dibaca**. Bukti berasal dari: GitHub Deployments/Status API publik, probe HTTP GET/HEAD tanpa kredensial, dan konfirmasi owner (pesan tugas). Tiap baris diberi tingkat kepastian: **[TERBUKTI]**, **[KONFIRMASI OWNER]**, **[INFERENSI]**, **[TIDAK TERVERIFIKASI]**.

| Aspek | `website-sano` (utama) | `sano-website-vs` (sekunder) |
|---|---|---|
| Repo terhubung | `gilang2xx/website-sano` **[TERBUKTI]** | sama **[TERBUKTI]** |
| Domain | `sanomatrassehat.com` (+ `www` → apex) **[KONFIRMASI OWNER]**; konsisten dengan bukti OAuth (§1.1) | `sano-website.vercel.app` **[KONFIRMASI OWNER]**; alias publik 200 |
| Deploy Production saat `main` diperbarui | Ya, setiap push (pasangan deployment sejak 2026-08-15) **[TERBUKTI]** | Ya, setiap push **[TERBUKTI]** |
| Deploy Preview branch | Ya **[TERBUKTI]** (status `success` untuk `c35baa7`) | Ya **[TERBUKTI]** |
| Deployment Production terakhir | 2026-09-09 10:39 UTC, commit `1b7cf8a`, `website-sano-ewr56zx05-rigss-projects.vercel.app` **[TERBUKTI]** | sama waktu/commit, `sano-website-dkgz525d0-rigss-projects.vercel.app` **[TERBUKTI]** |
| Node.js | **24.x** **[KONFIRMASI OWNER]**; sama dengan Node lokal v24.11.1 tempat build diuji | **[TIDAK TERVERIFIKASI]**. Build Preview branch ini sukses di project ini, jadi versinya kompatibel dengan build baru |
| Build/Output di `vercel.json` (menimpa dashboard) | `npm run build`, `dist`, framework `vite` **[TERBUKTI dari repo]**; build Preview sukses | sama |
| Environment variable | `GITHUB_OAUTH_CLIENT_ID` terpasang di Production (bukti perilaku, §1.1). `RESEND_*`, `META_*`, `LEAD_NOTIFICATION_EMAIL`: **[TIDAK TERVERIFIKASI]** (hanya bisa diuji dengan POST, dilarang) | `GITHUB_OAUTH_CLIENT_ID` **tidak** terpasang (bukti 500 pada probe 2026-09-23). Lainnya **[TIDAK TERVERIFIKASI]** |
| Protection | Preview & URL deployment: SSO (302 ke `vercel.com/sso-api`); domain Production publik **[TERBUKTI]** | sama; **alias production `sano-website.vercel.app` publik** **[TERBUKTI]** |
| Ignored Build Step, Root Directory, Production Branch (setting) | **[TIDAK TERVERIFIKASI]**; perilaku menunjukkan `main` = Production | sama |

### 1.1 Bukti aktif pada production (read-only, 2026-09-24)

- `GET https://sanomatrassehat.com/api/auth` → **302** ke `github.com/login/oauth/authorize`, `redirect_uri=https://sanomatrassehat.com/api/callback`, `scope=repo`, `state` ada, `client_id` ada (nilainya tidak dicetak); cookie `decap_oauth_state` `HttpOnly; Secure; SameSite=Lax; Max-Age=600`.
- `GET /api/callback` tanpa parameter → 200 dengan `authorization:github:error` (menolak aman, tidak ada token).
- `GET /admin/` 200, `GET /admin/config.yml` 200 `text/yaml`.
- Alias `.vercel.app`: `sano-website.vercel.app` = 200 (Etag **identik** dengan apex → salinan build yang sama); `sano-website-vs.vercel.app` dan `website-sano.vercel.app` = 404.

### 1.2 Dampak merge `main`

1. **Kedua project membangun dan mempromosikan Production** dari commit yang sama (bukan hanya `website-sano`). Merge = dua deployment production.
2. `sanomatrassehat.com` beralih dari SPA (HTML kosong + JS) ke 17 halaman ter-prerender, `404.html` asli, redirect trailing slash permanen, header noindex admin/API, sitemap baru.
3. **Domain sekunder `sano-website.vercel.app` ikut menjadi salinan publik situs baru** (kini dengan canonical per-halaman ke apex, sitemap berisi URL apex, `/admin/` dan `/api/lead` hidup di host itu). Lihat §2.
4. `main` **tidak diproteksi** (`protected: false`), tidak ada PR terbuka; alur Anda = push langsung ke `main` → auto-deploy. Artinya tidak ada gerbang otomatis: merge = deploy.
5. Perubahan **tidak** menyentuh env, DNS, domain, `api/*`, dependency (`package.json` hanya skrip `build`, tidak ada perubahan lockfile), aset `public/` (hanya `public/admin/index.html` +1 baris meta noindex).

### 1.3 Audit diff `main...HEAD` (26 file, +2544/−176)

| Kategori | File | Sifat |
|---|---|---|
| Runtime baru | `entry-server.tsx`, `seo/routes.ts`, `pages/NotFound.tsx` | SSG/manifest/404 |
| Runtime diubah | `App.tsx`, `index.tsx`, `hooks/useSEO.ts`, `components/ThemeToggle.tsx`, `components/Layout.tsx`, `utils/attribution.ts`, `utils/content.ts`, `pages/ArtikelDetail.tsx` (+2 baris `noindex`) | hydration, tema, atribusi WA, noindex, draft |
| Build/deploy | `package.json` (skrip), `vite.config.ts` (hapus `define` GEMINI, `copyPublicDir`), `vercel.json`, `index.html` (skrip tema, hapus `/index.css`), `scripts/prerender.mjs`, `scripts/generate-sitemap.mjs` | |
| Alat/dokumen | `scripts/verify-deployment.mjs`, laporan `SEO_*.md`, `VERCEL_PRODUCTION_MAPPING.md` | tidak memengaruhi runtime |

**Kemungkinan perubahan UI/aset/runtime yang terlihat pengunjung:**
- Markup: hanya `<span>` pembungkus tahun hak cipta di footer (inline, tampilan sama). Tidak ada perubahan kelas/tata letak lain; `public/` aset tidak berubah.
- HTML awal kini berisi konten (±30–105 kB per halaman, tidak terkompresi) sebagai ganti shell ±8 kB; dikirim terkompresi oleh Vercel.
- Tema gelap tersimpan diterapkan lebih awal oleh skrip inline (mencegah kilatan terang).
- Tag referral iklan pada link WhatsApp kini ditempel **setelah hydration** (sebelumnya saat render); diuji di 3 skenario.
- URL yang sebelumnya 200 palsu (soft 404: URL acak, `/index.css`, `/x.html`) kini **404**. `/x/` kini **308** ke `/x`.
- **Pengukuran lab (baru, mobile 390×844, CPU 4×, jaringan 1,6 Mbps/150 ms, 3 run, pixel diblok):** gaya Tailwind CDN sudah aktif saat First Contentful Paint pada 3/3 run untuk `/` dan `/klinik-matras`, pada production lama **dan** build baru (tidak ada kilatan tanpa gaya); CLS ≈ 0 (0,0001 dan 0) pada keduanya. FCP/LCP absolut build baru **tidak sebanding** dengan production karena server lokal tanpa kompresi; angka itu tidak boleh dibaca sebagai regresi atau perbaikan. Ini pengukuran lab, bukan data lapangan.

---

## 2. Rekomendasi penanganan domain sekunder (tanpa `noindex` global di repo bersama)

**Masalah:** `sano-website.vercel.app` melayani seluruh situs secara publik dari repo yang sama, `robots.txt`-nya `Allow: /`, dan (setelah merge) akan menyajikan situs baru. Canonical statis ke apex (dan per-halaman setelah SSG) menahan sebagian dampak duplikasi, tetapi host itu tetap dapat di-crawl; salinan itu juga menjalankan `api/lead` dengan env yang tidak diketahui.

**Prinsip:** semua tindakan di **dashboard Vercel oleh owner**, tanpa mengubah `vercel.json` yang dipakai bersama, dan dilakukan **sebelum merge** supaya merge tidak menerbitkan situs baru di host sekunder.

| Langkah | Tindakan owner di project `sano-website-vs` | Efek | Risiko / catatan | Verifikasi |
|---|---|---|---|---|
| **A (sebelum merge, disarankan)** | Settings → Git → **Ignored Build Step** = `exit 0` (selalu lewati build) | Tidak ada deployment baru (Production maupun Preview) di project sekunder; deployment terakhir tetap tayang | Status GitHub `Vercel – sano-website-vs` akan menjadi dibatalkan/dilewati (kosmetik; `main` tidak diproteksi sehingga tidak memblokir). Perlu dibalik bila sekunder ingin dipakai lagi. Alias tetap menyajikan **build lama beku** sampai langkah B | Push commit dummy di branch uji atau amati merge: tidak muncul deployment `sano-website-vs` baru (GitHub Deployments API) |
| **B (segera setelah A)** | Settings → Deployment Protection → Vercel Authentication ke **All Deployments** (mencakup Production), **atau** Settings → Domains → hapus `sano-website.vercel.app` | Alias tidak lagi dapat di-crawl: 401/302 SSO atau 404 | Ketersediaan "All Deployments" per paket **[VERIFIKASI di dashboard]**. Menghapus alias tidak menghapus project; URL deployment tetap terlindungi SSO | `node scripts/verify-production.mjs --secondary=https://sano-website.vercel.app --expect-secondary=protected` (atau `offline`) |
| **C (opsional, bila sekunder tetap jadi staging)** | Biarkan build aktif tetapi pertahankan B; pastikan env Production/Preview sekunder tidak berisi kredensial produksi (`RESEND_*`, `META_*`) atau isi `META_TEST_EVENT_CODE` | Staging aman, tanpa lead/event nyata | Perlu audit env di dashboard | Uji form hanya dengan izin terpisah |
| **D (pelengkap, hanya bila indeks terlanjur ada)** | Cek Search Console: properti/host `sano-website.vercel.app` dan `site:sano-website.vercel.app`; jika terindeks, ajukan *Removals* setelah B | Mempercepat penghapusan dari hasil pencarian | Tanpa akses GSC saya tidak tahu apakah host ini pernah terindeks **[TIDAK TERVERIFIKASI]** | GSC (aksi owner) |

**Opsi cadangan (tidak direkomendasikan sebagai pilihan pertama):** header `X-Robots-Tag: noindex, nofollow` **bersyarat host** di `vercel.json` (`headers[].has: [{ "type": "host", "value": "sano-website.vercel.app" }]`). Ini bukan noindex global, tetapi tetap mengubah file yang dipakai bersama; tidak dapat diuji di Preview (host berbeda) sehingga baru terbukti setelah merge, dan tidak menghentikan dua deployment/duplikasi fungsi API. Pertimbangkan hanya jika A dan B tidak memungkinkan.

**Urutan yang disarankan:** A → B → merge → verifikasi sekunder. Bila owner memilih tidak melakukan A/B, terima risiko duplikat publik (canonical menahan sebagian) dan pastikan env sekunder tidak berisi kredensial produksi sebelum merge.

---

## 3. Audit kesiapan production (per area)

Status = kondisi **production sekarang** / kesiapan setelah merge. "Belum terbukti" berarti butuh verifikasi pasca-deploy dengan `scripts/verify-production.mjs`.

| Area | Kondisi sekarang (bukti) | Setelah merge | Status |
|---|---|---|---|
| 17 route publik + sitemap | Sitemap live: 17 `<loc>`, `changefreq` ada, `lastmod` = tanggal build 2026-09-09 untuk 11 halaman statis | 17 route ter-prerender, sitemap 17 URL tanpa changefreq, lastmod hanya dari konten (8 dari 17) — terbukti di build lokal & Preview | Belum terbukti di production |
| Redirect http→https, www→apex | `http` 308; `https://www/` **307** → apex; `http://www/` 308 ke `https://www`; rantai `www/kontak/` = 1 hop (307) | `www/x/` menjadi **2 hop** (307 lalu 308). Diterima; lihat M-1 | Domain-layer terbukti hari ini; rantai baru belum |
| Trailing slash | `/kontak/` 200 (duplikat) | 308 → `/kontak`, query dipertahankan (terbukti di Preview) | Belum terbukti di production |
| Header robots domain utama | **Tidak ada** `X-Robots-Tag` di halaman publik (0) — baseline sehat | Harus tetap **tanpa** noindex. Preview selalu menambahkan `noindex` sehingga **tidak bisa** dipakai sebagai bukti | Verifikasi pasca-deploy wajib |
| Header/meta admin & API | Tidak ada noindex di `/admin/`, `/api/*` | `X-Robots-Tag: noindex, nofollow` pada `/admin/`, `/admin`, `/admin/*`, `/api/*` + meta di `/admin/`; aturan terbukti aktif di Preview | Belum terbukti di production |
| HTTP 404 (route, API, aset) | **Semua 200** (soft 404): `/url-tidak-ada`, `/index.css`, `/api/tidak-ada`, `/assets/tidak-ada.js`, `/tidak-ada.png` | 404 + halaman noindex tanpa canonical (Preview: 8 URL) | Belum terbukti di production |
| CMS `/admin/` + OAuth | `/admin/` 200, `config.yml` 200; OAuth 302 ke GitHub benar (`redirect_uri` apex, `state`, `scope=repo`); `callback` menolak aman | Tidak diubah kode `api/*`/`config.yml`; hanya header/meta noindex ditambahkan | Konfigurasi terbukti hari ini; login penuh butuh izin owner |
| API/form lead | `GET/HEAD /api/lead` = 405 JSON, `Allow: POST` | `api/lead.ts` tidak diubah; alur klien `submitConsultationLead` tidak diubah, tetapi kini dijalankan pada halaman ter-hydrate | **Belum terbukti** end-to-end pada build baru di Vercel (form tidak boleh dikirim); hanya diuji dengan mock lokal |
| Atribusi WhatsApp | — | Mekanisme diubah (tag ditempel pasca-hydration); diuji lokal & di Preview (organik/iklan/sesi tersimpan/SPA) | Butuh uji manual terkontrol bila owner mengizinkan |
| robots.txt | `Allow: /` + `Sitemap:` canonical | Tidak berubah | OK; sengaja tanpa Disallow admin/api (noindex butuh bisa di-crawl) |
| Canonical | Statis `/` untuk semua (shell) | Per halaman, absolut apex, self-canonical (17/17, 0 error di build; 17/17 di Preview) | Belum terbukti di production |
| Structured data | 1 blok `LocalBusiness` statis, sama di semua halaman | Sama, kini ada di HTML awal; **valid JSON dan tepat 1× di 18/18 file HTML** (17 route + 404). Kosong: `@id`, `geo`, `sameAs`, `areaServed`, `priceRange`, `logo`. Hari/jam/alamat cocok dengan footer; telepon JSON-LD = CS 2 (`0851 8728 3900`), footer menampilkan 2 nomor | Valid; memadai untuk rilis, penyempurnaan = Fase 3 |
| Tracking | GTM, Meta Pixel, TikTok ada di `<head>` | Tidak berubah (dicek ada di HTML beranda oleh skrip production) | Verifikasi pasca-deploy |
| Node 24.x kedua project | Utama: konfirmasi owner. Sekunder: tidak diketahui | Build Preview sukses di keduanya | Utama OK; sekunder tidak terverifikasi (tidak menghalangi) |
| Perilaku runtime/aset/UI | Lihat §1.3 | Tidak ada perubahan aset; markup hanya `<span>` tahun | Diukur lab: tanpa FOUC, CLS≈0 |

---

## 4. Klasifikasi temuan

### BLOCKER (harus selesai/dikonfirmasi owner sebelum merge)
Tidak ada blocker teknis pada kode. Dua blocker bersifat **konfirmasi/otorisasi owner** karena tidak bisa saya verifikasi:

| ID | Temuan | Mengapa blocker | Tindakan |
|---|---|---|---|
| **BLK-1** | Setting dashboard `website-sano` untuk **Production** tidak terbaca: Production Branch = `main`, tidak ada Ignored Build Step, Build/Output/Root tidak menimpa `vercel.json`, env Production lengkap (OAuth terbukti; `RESEND_*`/`META_*` tidak terbukti) | Merge langsung mempromosikan ke production; salah setting = production rusak. Bukti Preview (build sukses di project yang sama) menurunkan probabilitasnya, tetapi env Production ≠ Preview | Owner mencentang checklist §5 (A) dan mengonfirmasi |
| **BLK-2** | **Otorisasi merge/deploy production** dan target rollback yang sudah ditentukan (deployment `website-sano` 2026-09-09 `1b7cf8a`, `website-sano-ewr56zx05-rigss-projects.vercel.app`) | `main` tidak diproteksi dan push = deploy; tidak ada gerbang otomatis | Owner memberi izin eksplisit dan memastikan Instant Rollback tersedia |

### HIGH
| ID | Temuan | Rekomendasi |
|---|---|---|
| H-1 | Domain sekunder publik akan ikut menayangkan situs baru (§2) | Langkah A → B sebelum merge |
| H-2 | Bypass secret lama ada di riwayat percakapan | Owner hapus/rotasi (sudah direncanakan); jangan membagikan yang baru |
| H-3 | Form lead + atribusi WhatsApp pada build baru **tidak terbukti** di Vercel | Satu lead terkontrol **hanya dengan izin terpisah**; putuskan penanganan event Meta CAPI (§5 D) |
| H-4 | Login CMS penuh pada build baru belum diuji | Uji login manual oleh owner; **jangan publish** (Decap menulis langsung ke `main` → dua deploy) |
| H-5 | Header robots publik production tidak boleh noindex tetapi Preview tidak bisa membuktikannya | `verify-production.mjs` segera setelah deploy (kriteria A-3) |

### MEDIUM
| ID | Temuan | Rekomendasi |
|---|---|---|
| M-1 | Redirect `www`→apex adalah **307** (sementara) + rantai 2 hop untuk `www/x/` | Owner ubah ke 308 (permanen) di Domains; tidak wajib untuk rilis |
| M-2 | 16 title >60 karakter (terpanjang 122), beranda 95 (suffix brand ganda), 2 description di luar 70–160 (`/` 198, `/klinik-matras` 163); title beranda mengandung "KLINIK MATRAS by SANO CARE" dua kali | Fase konten |
| M-3 | Aset `Cache-Control: public, max-age=0, must-revalidate` (default Vercel, sama dengan sekarang) | `headers` `/assets/(.*)` `immutable` di fase performa |
| M-4 | JSON-LD minimal (tanpa `@id`, `geo`, `sameAs`, `areaServed`, `priceRange`, `logo`); JSON-LD juga ada di 404; NAP vs Google Business Profile belum dicocokkan | Fase 3 (schema) + cek GBP oleh owner |
| M-5 | OAuth `scope=repo` luas; `api/lead` tanpa cek Origin/rate limit (temuan Fase 0) | Tugas keamanan terpisah |
| M-6 | Node tidak di-pin di repo; sekunder tidak diketahui | `engines: "24.x"` bila kedua project 24.x |
| M-7 | Duplikat URL kecil: `/index.html`, `/klinik-matras/index.html` = 200 (self-canonical); `/404.html` = 200 (noindex); `/admin` dan `/admin/` sama-sama 200 | Diterima untuk rilis |
| M-8 | Dua project = dua build untuk setiap push (biaya/waktu) | Diselesaikan oleh §2 A |

### LOW
| ID | Temuan |
|---|---|
| L-1 | `/artikel/slug-tidak-ada`: HTML awal = halaman 404 umum, lalu client merender "Artikel Tidak Ditemukan" (keduanya noindex, status 404) |
| L-2 | `build:spa` (jalur rollback lokal) tidak menghasilkan sitemap |
| L-3 | Decap dimuat dari `unpkg.com` tanpa SRI/pin; kolom `draft` belum ada di UI Decap |
| L-4 | Peringatan CRLF/LF Git di Windows; sisa referensi template lama (`README` GEMINI, `metadata.json`) |

---

## 5. Release checklist

### A. Sebelum merge (owner, read-only di dashboard)
1. Konfirmasi `website-sano`: Production Branch = `main`; Ignored Build Step kosong; Framework Vite; Node 24.x; tidak ada override Build/Output yang bertentangan; domain `sanomatrassehat.com` dan `www` terpasang (www redirect ke apex).
2. Konfirmasi env Production `website-sano` **ada** (nama saja, tanpa nilai): `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET`, `RESEND_API_KEY`, `LEAD_NOTIFICATION_EMAIL`, `RESEND_FROM_EMAIL`, `META_DATASET_ID`, `META_ACCESS_TOKEN`; catat apakah `META_TEST_EVENT_CODE` terpasang di Production (sebaiknya **tidak**).
3. Hapus/rotasi Protection Bypass lama.
4. Domain sekunder: langkah A (Ignored Build Step `exit 0`) lalu B (protection/hapus alias), atau putuskan menerima risikonya.
5. Catat baseline Search Console: jumlah halaman terindeks, laporan Soft 404, status sitemap, cakupan `/admin`, `/api`. (Tanpa mengirim ulang sitemap.)
6. Tentukan target rollback (§7) dan orang yang memantau 24 jam pertama.
7. Pastikan branch masih `0 behind main` (`compare` API: `ahead_by 11, behind_by 0`) dan build lokal final hijau (`npm run build`, `tsc --noEmit`).

### B. Urutan merge dan deployment (setelah izin owner)
1. Owner (atau saya hanya bila diizinkan eksplisit) merge `feat/seo-ssg-implementation` ke `main` dengan **merge commit** (`--no-ff`) supaya rollback kode cukup satu `git revert -m 1`.
2. Vercel membangun kedua project. Amati: `website-sano` Production → `success`; `sano-website-vs` → dilewati (bila langkah A) atau `success`.
3. Jangan melakukan apa pun lagi di `main` sampai smoke test selesai (publish CMS = deploy tambahan).

### C. Smoke test production (GET/HEAD, tanpa kredensial)
```
npm ci && npm run build                      # commit yang sama dengan production (untuk manifest)
node scripts/verify-production.mjs \
  --base=https://sanomatrassehat.com \
  --www=https://www.sanomatrassehat.com \
  --secondary=https://sano-website.vercel.app --expect-secondary=protected
node scripts/verify-deployment.mjs --base=https://sanomatrassehat.com   # cek tambahan status/aset (tanpa bypass)
```
Keduanya hanya GET/HEAD. `verify-production.mjs` memeriksa: sitemap; http/www/apex + rantai + trailing slash; 17 route (200, prerender, self-canonical, H1, metadata, JSON-LD, **tanpa noindex meta/header**); redirect + query; 404 route/API/aset; admin (`/admin/`, `config.yml`, header noindex); `GET/HEAD /api/lead` 405; OAuth **hanya redirect GET** (tanpa mencetak `client_id`/`state`); robots.txt; aset; tracking; domain sekunder. Opsi `--json`, `--skip-oauth-probe`, `--skip-domain-layer`.

### D. Uji manual — **hanya setelah owner memberi izin terpisah**
1. **Login CMS:** buka `https://sanomatrassehat.com/admin/`, login GitHub, pastikan editor termuat; **keluar tanpa publish**.
2. **Satu lead terkontrol:** owner memutuskan lebih dulu (a) siapa/nomor uji, (b) penanganan event Meta: lead uji akan mengirim email nyata dan event `Lead` nyata ke dataset iklan kecuali `META_TEST_EVENT_CODE` diset sementara (perubahan env oleh owner) atau lead ditandai dan dikecualikan di analitik. Saya tidak akan mengirim lead.
3. Klik tombol WhatsApp dari URL ber-`utm_source`: pesan terisi, tag referral tak terlihat.

### E. Verifikasi domain utama setelah deploy (owner + skrip)
- Header: halaman publik **tanpa** `X-Robots-Tag: noindex`; admin/API dengan noindex (skrip).
- Sitemap live 17 URL, `lastmod` dari konten.
- Search Console (aksi owner, **setelah** smoke test lulus): URL Inspection Live Test pada `/`, `/klinik-matras`, satu artikel; kirim ulang sitemap; pantau Pages (Soft 404 turun, "Duplicate" tidak naik), Redirect, Core Web Vitals selama 2–4 minggu.

### F. Verifikasi domain sekunder
`node scripts/verify-production.mjs --secondary=https://sano-website.vercel.app --expect-secondary=protected` (atau `offline`). Bila memakai opsi noindex-header: `--expect-secondary=noindex`.

### G. Jendela pemantauan
T+15 menit: smoke test lulus. T+1 jam: log fungsi `api/lead`/`api/auth` tanpa lonjakan error; GTM/Pixel menerima event. T+24 jam: lead nyata masuk email seperti biasa, tidak ada penurunan konversi WhatsApp. T+7 hari: GSC (Soft 404, Coverage, Crawl stats).

---

## 6. Acceptance criteria produksi

| # | Kriteria | Diverifikasi oleh | Kelulusan |
|---|---|---|---|
| A-1 | 17 route: 200, prerender, self-canonical `https://sanomatrassehat.com…`, 1 H1, JSON-LD valid | `verify-production` [route] | 17/17 |
| A-2 | Sitemap 17 URL = manifest, tanpa duplikat/changefreq/priority/admin/api/404, lastmod valid | [sitemap] | semua PASS |
| A-3 | **Tidak ada `noindex`** (meta/header) pada halaman publik apex | [route] | 0 pelanggaran |
| A-4 | `/x/` → 308 `/x`, query utuh; beranda tidak di-redirect | [redirect] | semua PASS |
| A-5 | `www` → apex, `http` → https, rantai `www/kontak/?…` ≤ 2 hop tanpa loop, akhir 200 | [domain] | PASS |
| A-6 | URL/API/aset tak dikenal → **404** (HTML noindex tanpa canonical); `/index.css` 404 | [404] | 10/10 |
| A-7 | `/admin/` 200 tanpa redirect, `config.yml` 200 bukan HTML, noindex meta + header | [admin] | PASS |
| A-8 | `GET/HEAD /api/lead` = 405 JSON; header noindex | [api] | PASS |
| A-9 | OAuth: `/api/auth` 302 ke GitHub dengan `redirect_uri` apex; `callback` menolak tanpa parameter | [oauth] | PASS |
| A-10 | Aset (JS, gambar, video) 200 non-HTML | [aset] | PASS |
| A-11 | GTM/Pixel/TikTok masih ada di HTML | [tracking] | PASS |
| A-12 | Domain sekunder sesuai keputusan (protected/offline/noindex) | [sekunder] | PASS |
| A-13 | Login CMS berhasil; satu lead terkontrol diterima; WhatsApp membawa tag referral | manual (izin owner) | owner menyatakan lulus |
| A-14 | GSC: sitemap diterima, tidak ada lonjakan error crawl 7 hari | owner | tidak ada regresi |

---

## 7. Rencana rollback

| Skenario | Langkah | Waktu |
|---|---|---|
| Smoke test gagal / halaman rusak | **Vercel → `website-sano` → Deployments → deployment 2026-09-09 (`1b7cf8a`, `website-sano-ewr56zx05-…`) → Instant Rollback / Promote to Production.** Tidak butuh build ulang | menit |
| Perlu membatalkan di kode | `git revert -m 1 <commit-merge>` lalu push (deploy ulang) — hanya bila rollback Vercel tidak cukup | ±10 menit |
| Hanya redirect/404 bermasalah | Hapus blok `redirects` dan/atau kembalikan rewrite `/(.*)` → `/index.html` sementara. **Catatan:** guard `scripts/prerender.mjs` (bagian 1b) menolak build bila catch-all rewrite ada atau daftar redirect tidak sinkron; longgarkan bersamaan | ±15 menit |
| Hydration/UI bermasalah namun HTML baik | `index.tsx`: paksa `createRoot` (HTML tetap terbaca crawler) | ±10 menit |
| Sekunder ikut bermasalah | Tidak mengganggu apex; ikuti §2 A/B | — |
| Setelah rollback | Sitemap kembali ke versi lama (17 URL, lastmod tanggal build); jangan kirim ulang sitemap; catat insiden untuk GSC | — |

Pemicu rollback yang disarankan: halaman publik memberi `noindex`/`404`/5xx; lonjakan error `api/lead`; tombol WhatsApp/form tidak berfungsi; login CMS gagal.

---

## 8. Hasil tes read-only yang berhasil dijalankan (fase ini)

| Tes | Hasil |
|---|---|
| Git: `main...HEAD` | `ahead 11, behind 0` (compare API), 26 file, +2544/−176, tanpa PR terbuka, `main` tidak diproteksi |
| Audit diff | Tidak ada perubahan dependency/lockfile/aset; perubahan markup hanya `<span>` tahun |
| Vercel akses | CLI tanpa kredensial → audit via bukti publik (batas dinyatakan) |
| GitHub Deployments/Status | Pasangan Production/Preview kedua project terbukti; Preview `c35baa7` `success` di keduanya |
| Probe production (tanpa kredensial) | http→https 308; www→apex 307; `www/kontak/` 1 hop; **tanpa** `X-Robots-Tag` di halaman publik; robots.txt `Allow: /`; sitemap 17 URL (lama); OAuth 302 benar (`redirect_uri` apex, `state`, `client_id` ada); `callback` menolak aman; `/admin/` & `config.yml` 200; `GET/HEAD /api/lead` 405 |
| Probe sekunder | `sano-website.vercel.app` 200 publik, Etag identik dengan apex, canonical ke apex (build lama), `/admin/` 200, `/api/lead` 405; `sano-website-vs.vercel.app` dan `website-sano.vercel.app` 404 |
| Structured data | 18/18 file HTML (17 route + 404): tepat 1 JSON-LD `LocalBusiness` valid; hari/jam/alamat cocok footer |
| Pengukuran lab FOUC/CLS | Gaya aktif saat FCP 3/3 run kedua build; CLS≈0 |
| `scripts/verify-production.mjs` terhadap **production sekarang (build lama)** | 23 lulus / 50 gagal — **gagal sesuai harapan** (belum ada prerender, 404 asli, redirect slash, noindex admin/API); **lulus**: http→https, www→apex, OAuth (4), `GET/HEAD /api/lead`, aset, robots, sitemap (5), tracking. Ini baseline "sebelum merge" |
| `scripts/verify-production.mjs` terhadap build baru di emulator lokal | 67/67 (alat bantu; **bukan bukti Vercel/production**) |

**Tidak dijalankan (sesuai batasan):** POST apa pun, form/lead, event iklan, login CMS penuh, pengiriman ulang sitemap, Search Console, tes memakai bypass. Emulator lokal dan Preview **tidak** dipakai sebagai klaim bahwa production lulus.

---

## 9. Keputusan/tindakan yang dibutuhkan dari owner

1. **Otorisasi merge & deploy production** dan penunjukan pemantau (BLK-2).
2. **Konfirmasi setting & env Production `website-sano`** (BLK-1, checklist §5 A).
3. **Domain sekunder:** pilih A→B (disarankan), C (staging aman), atau terima duplikat publik; kerjakan **sebelum merge**.
4. **Hapus/rotasi** Protection Bypass lama.
5. **Izin terpisah** untuk: login CMS manual, satu lead terkontrol, dan bagaimana event Meta diperlakukan (mis. `META_TEST_EVENT_CODE` sementara).
6. **Baseline dan tindakan Search Console** (baseline sebelum; kirim ulang sitemap hanya setelah smoke test lulus).
7. Opsional: ubah redirect `www`→apex ke **permanen (308)**; pin Node 24.x di kedua project; jadwalkan Fase 3 (schema) dan fase konten (title/description).

---
*Read-only. Tidak ada merge/push ke `main`, deploy production, perubahan setting Vercel/DNS/domain/env, project sekunder, POST, atau tampilan secret. Bypass lama tidak dipakai.*
