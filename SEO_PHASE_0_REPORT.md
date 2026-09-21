# SEO_PHASE_0_REPORT — Baseline & Hardening

Tanggal: 2026-09-21 · Proyek: sanomatrassehat.com (Klinik Matras by Sano)
Referensi: [SEO_AUDIT.md](SEO_AUDIT.md), [SEO_ARCHITECTURE_PLAN.md](SEO_ARCHITECTURE_PLAN.md)

**Ringkasan:** Fase 0 selesai tanpa blocker. Satu perubahan kode dibuat (`vite.config.ts`, hapus `define` GEMINI). Build existing sukses dan **output bundle identik** dengan build sebelumnya (nama file ber-hash sama). Tidak ada push, deploy, instalasi dependency, perubahan environment, maupun pengujian production.

---

## 1. Branch & Git status

| Item | Nilai |
|---|---|
| Repo | `G:/PROJECT 2026/SANO/ASSET/website-sano-main/website-sano-main` (remote `origin` = `github.com/gilang2xx/website-sano`) |
| Branch awal | `main`, sejajar dengan `origin/main` (`## main...origin/main`) |
| HEAD dasar | `1b7cf8a` — "Add reusable ArtikelDetail component template for other projects" |
| Kondisi sebelum mulai | Tidak ada modifikasi pada file tracked. Hanya 2 file **untracked** milik saya dari sesi sebelumnya (`SEO_AUDIT.md`, `SEO_ARCHITECTURE_PLAN.md`). Tidak ada stash. Tidak ada pekerjaan Anda yang berisiko tertimpa, maka branch dibuat. |
| Branch aktif sekarang | **`feat/seo-ssg-implementation`** (dibuat dari `main` @ `1b7cf8a`, lokal saja, **belum di-push**) |
| Status sekarang | `M vite.config.ts` · `?? SEO_AUDIT.md` · `?? SEO_ARCHITECTURE_PLAN.md` · `?? SEO_PHASE_0_REPORT.md` |
| Commit | **Belum ada commit** (tidak diminta). Perubahan masih di working tree. |

## 2. Perubahan file

| File | Perubahan |
|---|---|
| `vite.config.ts` | Hapus `loadEnv`, variabel `env`, dan blok `define` yang meng-inline `process.env.API_KEY` / `process.env.GEMINI_API_KEY`. `server`, `plugins`, `resolve.alias` tidak diubah. |
| `SEO_PHASE_0_REPORT.md` | Baru (dokumen ini). |

Tidak diubah: UI/konten, route, `api/*`, `vercel.json`, `public/*`, `index.html`, `package.json`, `.env*`, README.

**Bukti bahwa penghapusan `define` aman:**
- Grep di seluruh source (`*.ts,tsx,js,mjs,json,html,md,yml`): satu-satunya referensi `GEMINI`/`API_KEY` selain `vite.config.ts` adalah `README.md:18` (instruksi template lama) dan `RESEND_API_KEY` di `api/_lib/emailNotify.ts` — yang terakhir kode **server** (`api/` tidak di-bundle Vite dan membaca `process.env` di runtime fungsi), serta bukan ekspresi yang dicocokkan `define`.
- Tidak ada kode klien yang membaca `process.env.*`, tidak ada `@google/genai` di `package.json`.
- Build sebelum dan sesudah perubahan menghasilkan **nama chunk ber-hash yang sama** (`diff` daftar `dist/assets` = identik, 35 file) → isi bundle tidak berubah.
- Nilai secret tidak dibaca, ditampilkan, atau dicatat; env Vercel tidak disentuh.

## 3. Baseline

### 3.1 Route (`App.tsx:32-43`) — tidak ada perubahan
Publik: `/`, `/layanan`, `/pricelist`, `/artikel`, `/artikel/:slug`, `/tentang-kami`, `/before-after`, `/kontak`, `/klinik-matras`, `/klinik-sofa`, `/sano-clean`, `/kebijakan-privasi`. Tidak ada route `*` (404).
Slug artikel legacy (6): `klinik-matras-by-sano-care`, `konsep-matras-sehat`, `dampak-kasur-rusak`, `dampak-jangka-panjang-kasur-salah`, `mengenal-struktur-kasur`, `kasur-ortopedik-untuk-tidur-sehat`. Artikel CMS: 0.
Admin/non-publik: `/admin/` (statis `public/admin/index.html`, Decap via CDN unpkg), `/api/auth`, `/api/callback`, `/api/lead`. Semuanya masih **tanpa** `noindex`/`Disallow` (ditunda ke fase berikutnya sesuai batasan "jangan ubah konfigurasi").

### 3.2 Build & deployment
- Script: `build` = `vite build && node scripts/generate-sitemap.mjs`; `dev` = `vite`; `preview` = `vite preview` (`package.json:6-10`). Tidak ada script `test` atau `lint`.
- `vercel.json`: `buildCommand: npm run build`, `outputDirectory: dist`, `framework: vite`, satu rewrite `/(.*) → /index.html` (`vercel.json:5-7`). Tidak ada `redirects`, `headers`, `trailingSlash`, atau `cleanUrls`.
- `.gitignore` mengecualikan `dist`, `dist-ssr`, `.env`, `.env.*` (kecuali `.env.example`), `*.local`, `.vercel`.

### 3.3 CMS & API
- Decap CMS (`public/admin/config.yml`): backend GitHub `gilang2xx/website-sano`, branch `main`, `base_url` `https://sanomatrassehat.com`, `auth_endpoint: api/auth`; koleksi `before_after` (`content/before-after`) dan `artikel` (`content/artikel`); media `public/uploads`. Publish = commit ke `main` = deploy otomatis (perilaku dikonfirmasi dari komentar `utils/content.ts:5-9` dan memori alur deploy; **tidak diverifikasi di dashboard Vercel**).
- OAuth: `api/auth.ts` (redirect ke GitHub + cookie `state`), `api/callback.ts` (tukar code → token → `postMessage` ke Decap).
- Lead: `api/lead.ts` (POST) → email Resend + Meta CAPI (`Promise.allSettled`; kegagalan email → 502, CAPI best-effort).

### 3.4 Metadata & canonical existing (dari `index.html` dan `hooks/useSEO.ts`)
- HTML awal semua URL: `<title>` beranda, description beranda, canonical `https://sanomatrassehat.com/`, OG/Twitter beranda, satu blok `LocalBusiness` (`index.html:8-65`).
- `useSEO` (client, `useEffect`) menimpa title/description/canonical/OG per route setelah JS jalan (`hooks/useSEO.ts:47-72`).
- Sitemap hasil build: 17 URL (11 statis + 6 artikel legacy). Robots: `Allow: /` + `Sitemap:`.
- **Belum diukur terhadap produksi** (tidak ada request ke website live pada fase ini).

### 3.5 Hasil build & pemeriksaan (perintah existing, tanpa instal dependency)

| Perintah | Hasil |
|---|---|
| `npm run build` | **Exit 0.** 2372 modul ditransformasi, selesai 13,41 dtk; `[sitemap] Wrote dist/sitemap.xml with 17 URLs (6 legacy articles + 0 CMS articles)`. |
| Warning build | **1 warning:** `/index.css doesn't exist at build time, it will remain unchanged to be resolved at runtime` (dari `index.html:132`; sudah tercatat di SEO_AUDIT M3). Tidak ada error lain. |
| Ukuran chunk terbesar | `index` 244,98 kB (gzip 77,82), `ArtikelDetail` 207,13 kB (gzip 59,20), `proxy` (framer-motion) 111,52 kB, `Home` 52,28 kB. Tidak ada peringatan chunk >500 kB. |
| Perbandingan bundle | 35 file `dist/assets` — nama ber-hash **identik** dengan build lama (sebelum perubahan). |
| Pemindaian `dist/assets/*.js` | 0 file mengandung `GEMINI_API_KEY`, `process.env`, atau pola kunci Google `AIza…` (hanya jumlah yang dicatat, tidak ada nilai). Ini hanya untuk build lokal, bukan produksi. |
| `npx --no-install tsc --noEmit` | **Exit 0**, tanpa error. |
| Lint / unit test | Tidak tersedia di `package.json`; tidak dijalankan. |
| `npm audit` | Tidak dijalankan (tidak diminta; membutuhkan akses jaringan). |

Catatan: `npm run build` menimpa folder `dist/` lokal (gitignored; sebelumnya berasal dari build 2026-09-09). Tidak berpengaruh ke produksi.

## 4. Pemeriksaan keamanan

### 4.1 GEMINI_API_KEY / API_KEY — **ditutup (jalur bocor laten dihapus)**
Lihat §2. Sisa tindak lanjut (di luar kewenangan fase ini): cek dashboard Vercel apakah variabel `GEMINI_API_KEY` ter-set dan tidak dipakai → hapus; bila pernah ikut build produksi yang berisi referensi `process.env.API_KEY` → rotasi. README.md:18 masih menyuruh mengisi `GEMINI_API_KEY` di `.env.local` (sisa template) → rekomendasi hapus baris itu (tidak diubah karena di luar lingkup).

### 4.2 `api/lead.ts` — origin & rate limiting (**tidak diubah, hanya dicatat**)
Temuan (bukti kode):
| # | Temuan | Baris |
|---|---|---|
| L1 | Tidak ada pengecekan `Origin`/`Referer`; endpoint dapat dipanggil dari mana saja | `lead.ts:26-40` |
| L2 | Tidak ada rate limiting, honeypot, atau CAPTCHA. Setiap request valid memicu **email Resend + event Meta CAPI** | `lead.ts:47-73` |
| L3 | Validasi hanya keberadaan field; tanpa batas panjang, tanpa validasi format email/telepon, tipe tidak dicek (`name`, `message` dipakai langsung) | `lead.ts:34-40` |
| L4 | `eventSourceUrl` dari klien dipercaya dan diteruskan ke email dan Meta CAPI (`event_source_url`) | `lead.ts:55-59`; `emailNotify.ts:45` |
| L5 | `subject` email memuat `name` dan `serviceType` mentah; `reply_to` = email dari klien tanpa validasi | `emailNotify.ts:73-75` |
| L6 | IP klien diambil dari `x-forwarded-for` (elemen pertama) dan dikirim ke Meta. Apakah Vercel menimpa header ini pada domain Anda **[VERIFIKASI]** | `lead.ts:20-24` |
| L7 | Positif: isi email di-escape HTML (`escapeHtml`), data pengguna di-hash SHA-256 sebelum ke Meta, secret hanya di server | `emailNotify.ts:22-28,47-56`, `metaCapi.ts` |

**Dampak:** spam ke inbox lead & kuota Resend; polusi event konversi Meta (mengganggu optimasi iklan); tidak ada eksposur data pengunjung lain.
**Rekomendasi (semua opsional-bertahap, uji di preview karena dapat memutus form):**
1. Batasi rate lewat Vercel Firewall/WAF rule (tanpa dependency) atau store terkelola (mis. Upstash) — per IP, mis. beberapa request/menit.
2. Origin allowlist (`https://sanomatrassehat.com`, `https://www…`, host preview Vercel, `localhost`) dengan respons 403 — hati-hati agar tidak memblokir preview/iklan; log dulu (mode "report-only") sebelum menolak.
3. Field honeypot tersembunyi + validasi ringan server-side: tipe string, panjang maks (mis. name 100, message 2000), format email, telepon 8–15 digit.
4. Turunkan `eventSourceUrl` ke host yang diizinkan (validasi `new URL(...).hostname`), bila tidak cocok pakai URL default.
5. Sanitasi `subject` (hapus newline, potong panjang).
6. Bila spam terbukti: Cloudflare Turnstile/hCaptcha di `pages/Kontak.tsx`.

### 4.3 `api/callback.ts` — logging body respons & risiko terkait (**tidak diubah**)
| # | Temuan | Baris |
|---|---|---|
| C1 | Saat token exchange gagal, seluruh `json` respons GitHub dicatat: `console.error(..., { status, body: json })`. Pada jalur ini `access_token` tidak ada (kondisi log = `!ok || !json?.access_token`), sehingga yang tercatat umumnya `error`/`error_description`/`error_uri` — **risiko rendah**, tetapi bentuk respons pihak ketiga tidak dijamin | `callback.ts:73-75` |
| C2 | Log lain hanya `err.message` — aman | `callback.ts:79-81` |
| C3 | **Potensi pengiriman token ke origin yang tidak seharusnya:** setelah handshake, token dikirim ke `e.origin` — origin jendela mana pun yang membalas pesan `authorizing:github`. Popup `/api/auth` dapat dibuka oleh halaman pihak ketiga; jika editor (pemilik akses tulis repo) membuka halaman berbahaya dan menyelesaikan login GitHub, halaman itu berpotensi menerima token. Perlu diverifikasi dengan uji; ini pola umum pada OAuth provider Decap kustom | `callback.ts:28-33` |
| C4 | `scope: 'repo'` memberi akses luas ke repo (bila repo publik, `public_repo` mungkin cukup; **belum diverifikasi** visibilitas repo) | `auth.ts:27` |
| C5 | `SITE_URL` hardcoded di `redirect_uri` → login admin tidak akan berjalan di preview deployment (bukan risiko keamanan; relevan untuk pengujian) | `auth.ts:9,26` |

**Rekomendasi:** (C1) log hanya `status` dan `json?.error`; (C3) bandingkan `e.origin` dengan allowlist (`https://sanomatrassehat.com`) sebelum mengirim token, dan ganti `"*"` pada handshake awal dengan origin yang sama bila protokol Decap memungkinkan — uji login admin di preview/staging dahulu; (C4) turunkan scope bila memungkinkan; (C5) baca base URL dari env/`req.headers.host` dengan allowlist.

### 4.4 Lainnya (dicatat)
- Tidak ada security header (CSP, `X-Content-Type-Options`, `Referrer-Policy`) di `vercel.json`. `X-Robots-Tag: noindex` untuk `/admin` dan `/api` direncanakan di fase berikutnya.
- Decap dimuat dari `unpkg.com/decap-cms@^3.0.0` tanpa SRI dan tanpa pin versi (`public/admin/index.html`) → risiko supply chain pada halaman yang memegang token GitHub. Rekomendasi: pin versi persis + SRI, atau bundel lokal.

## 5. Risiko yang belum terselesaikan

| # | Risiko | Status |
|---|---|---|
| U1 | Baseline **produksi** (HTML mentah, status HTTP, header, redirect www/trailing slash) belum diambil; semua bukti di atas dari kode dan build lokal | Ditunda (dilarang mengklaim tes produksi); jalankan sebagai langkah awal Fase 1 |
| U2 | Env Vercel (`GEMINI_API_KEY` ter-set? versi Node?) belum diperiksa | Perlu tindakan pemilik dashboard |
| U3 | `/index.css` masih dirujuk (`index.html:132`); importmap `aistudiocdn` tak terpakai; canonical/meta statis beranda di semua URL; tidak ada 404; `/admin`, `/api` belum noindex; desc artikel tertukar | Sengaja tidak disentuh (batasan Fase 0: tanpa ubah konfigurasi/konten; sebagian menunggu Fase 1–2) |
| U4 | Temuan keamanan L1–L6, C1–C5, Decap tanpa SRI | Hanya dicatat, belum ada perbaikan |
| U5 | `README.md:18` masih menyebut `GEMINI_API_KEY` | Belum diubah |
| U6 | Tidak ada tes otomatis/lint; regresi form, WA, navigasi, admin bergantung uji manual | Ditangani di rencana pengujian Fase 1+ |
| U7 | Node lokal v24.11.1 vs Node di Vercel tidak diketahui | Konfirmasi |
| U8 | Perubahan belum di-commit; branch belum di-push (tidak ada preview deployment untuk diuji) | Menunggu keputusan Anda |

## 6. Kesiapan memulai Fase 1

**Siap dimulai**, dengan syarat/konfirmasi berikut (dari §9 SEO_ARCHITECTURE_PLAN.md):
1. Setuju memakai branch ini + Vercel preview untuk uji perilaku 404/trailing slash/`/admin` (butuh push branch — **belum dilakukan, menunggu izin**).
2. Ambil baseline produksi (curl semua route) sebagai langkah pertama.
3. Konfirmasi versi Node di Vercel; status `GEMINI_API_KEY` di Vercel.
4. Konfirmasi teks benar untuk desc artikel yang tertukar (dibutuhkan sebelum prerender meta).
5. Terima bahwa Tailwind CDN masih dipakai selama Fase 1–4 (risiko FOUC diperiksa di preview).

Kondisi teknis pendukung: build hijau, `tsc` bersih, tidak ada kode yang mengakses `window`/`document` saat impor modul pada file yang diperiksa (akan dibuktikan lewat build SSR nyata di Fase 1).

## 7. Rollback

| Skenario | Langkah |
|---|---|
| Batalkan perubahan `vite.config.ts` saja | `git checkout -- vite.config.ts` (mengembalikan blok `define` seperti di `1b7cf8a`) |
| Tinggalkan branch, kembali ke keadaan awal | `git checkout main` lalu (opsional) `git branch -D feat/seo-ssg-implementation`. Dokumen SEO_*.md yang untracked tetap ada di working tree; hapus manual bila tidak diinginkan |
| Produksi | Tidak ada perubahan yang di-push/deploy, jadi tidak ada yang perlu di-rollback di Vercel |
| `dist/` lokal | Hasil build dapat dibuang kapan saja (`dist` gitignored); `npm run build` membuatnya ulang |

---
*Tidak ada push, deploy, instalasi dependency, perubahan environment variable, atau pengujian production yang dilakukan pada fase ini.*
