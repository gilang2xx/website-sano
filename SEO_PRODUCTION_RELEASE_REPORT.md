# SEO_PRODUCTION_RELEASE_REPORT — Rilis SEO ke production

Tanggal: 2026-09-24 (UTC 03:4x) · Project Vercel: `website-sano` · Domain: https://sanomatrassehat.com
Otorisasi: owner (eksplisit, dengan batasan yang dipatuhi §10)

## **KEPUTUSAN AKHIR: GO**

Merge dan deployment production berhasil, seluruh verifikasi production **GET/HEAD** dan browser lulus tanpa kegagalan, domain sekunder tetap terlindungi dan tidak membangun. **Tidak ada regresi, tidak ada rollback.** Form lead dan login CMS **NOT TESTED** (sesuai batasan). Risiko existing `RESEND_*` dicatat, bukan disebabkan rilis ini.

---

## 1. Commit sebelum dan sesudah merge

| Item | Nilai |
|---|---|
| `main` sebelum | `1b7cf8a` — "Add reusable ArtikelDetail component template for other projects" |
| Branch rilis (ujung) | `feat/seo-ssg-implementation` @ `38b157e` (15 commit di depan `main`, 0 di belakang) |
| **Commit merge** | **`c5dbfd7629035a8a4748f090fed86ae304f73352`** — parent: `1b7cf8a` dan `38b157e` (`--no-ff`, tanpa force) |
| `main` sesudah | `c5dbfd7` (dikonfirmasi lewat `git fetch` setelah push) |
| Perubahan vs baseline | 28 file (+3150/−176); **tanpa** perubahan `api/lead.ts`, `package-lock.json`, `.env*`, dependency, atau aset `public/` (kecuali `public/admin/index.html` +1 baris meta noindex) |
| Tree merge vs tree branch | Identik (`git diff` kosong) — yang dideploy = yang diuji |
| Catatan proses | Percobaan merge pertama gagal **sebelum membuat apa pun** (`git merge -F -` tidak valid; error "could not read file '-'"; `main` tetap `1b7cf8a`, tidak ada commit/push). Diulang dengan `-m`, berhasil |

## 2. Deployment production

| Item | Nilai |
|---|---|
| Push `main` (`1b7cf8a..c5dbfd7`) | 03:48:44 UTC, push biasa |
| **Deployment ID (GitHub Deployments)** | **`6629758914`** — environment **"Production – website-sano"**, `sha` = `c5dbfd7` (dokumen `ref` = commit merge penuh) |
| URL deployment | `https://website-sano-8wahdgu69-rigss-projects.vercel.app` |
| Dibuat / selesai | 03:49:09 UTC / status `success — Deployment has completed` pada 03:49:22 UTC (±13 dtk) |
| Status GitHub commit merge | `success`: `Vercel – website-sano: Deployment has completed`; `Vercel – sano-website-vs: Canceled by Ignored Build Step` |
| Bukti alias production berpindah | Beranda apex: `Etag` `0985ae12…` → `04476653…`, `X-Vercel-Cache: MISS`, `Age: 0`, kini memuat `data-ssg-path="/"`, 1 `<h1>`, sitemap 17 URL tanpa `changefreq` |
| Catatan | "Ready" dibaca dari status GitHub (`success`), bukan dari dasbor Vercel (tidak ada akses dasbor). Perpindahan alias dibuktikan oleh konten yang dilayani |

## 3. Pre-merge gate (dijalankan sebelum merge; semuanya lulus)

| Pemeriksaan | Hasil |
|---|---|
| Remote terbaru | `git fetch` sukses; `origin/main` = `1b7cf8a`, branch = `38b157e` = HEAD lokal; API GitHub `main` = `1b7cf8a` (baseline utuh) |
| Working tree | Bersih (0 perubahan) |
| Commit rilis tersedia | 15 commit, `merge-base` = `1b7cf8a` (fast-forwardable, tanpa konflik) |
| `npx tsc --noEmit` | Exit 0 |
| `npm run build` | Exit 0: 17 route ter-prerender, 0 error, `dist/404.html`, sitemap 17 URL |
| Artefak build | Sitemap 17 `<loc>`, 0 `changefreq/priority`; `404.html`: 1 `noindex`, 0 canonical, 1 `<h1>`; tidak ada `spa-fallback.html`; `vercel.json`: 2 redirect, 0 rewrite, 3 header; manifest 17 route, **17/17** canonical/H1/title/description valid |
| Pemindaian secret pada diff (3150 baris tambahan) | 0 kecocokan: token GitHub (`ghp_`, `github_pat_`, `gho_`), kunci Resend/Meta/Google/`sk-`, PRIVATE KEY, kedua bypass secret, header bypass, `client_secret`; tidak ada file `.env*` di diff |
| Regresi lokal (Chrome headless + emulator aturan `vercel.json`, `/api/lead` di-mock) | **34/34** route + **24/24** fungsional lulus |
| `verify-deployment.mjs` / `verify-production.mjs` vs emulator | 75/75 dan 67/67 (alat bantu, bukan bukti Vercel) |
| Konfigurasi sekunder tidak berubah | Sekunder tanpa auth: `/`, `/api/lead`, `/admin/` → 302 SSO; status push terakhir `sano-website-vs: Canceled by Ignored Build Step`; apex masih Etag lama; deployment Production terakhir masih 9 Sep (`1b7cf8a`) |
| Konfigurasi `website-sano` tidak berubah | Sejauh dapat dibuktikan: tidak ada deployment/perubahan Production sejak 9 Sep; setting dasbor **tidak** dapat dibaca (mengacu ke screenshot owner di final gate) |
| Bypass lama dihapus | **OWNER-REPORTED**; tidak diuji (dilarang memakai secret lama) |

## 4. Verifikasi production (GET/HEAD; tanpa POST, tanpa bypass)

Dijalankan 03:49–03:52 UTC terhadap `https://sanomatrassehat.com`.

| Skrip / uji | Hasil |
|---|---|
| **`scripts/verify-production.mjs`** (`--secondary=https://sano-website.vercel.app --expect-secondary=protected`) | **77/77 lulus, 0 gagal** (exit 0) |
| `scripts/verify-deployment.mjs --base=https://sanomatrassehat.com` | **75/75 lulus, 0 gagal** |
| Browser Chrome headless pada production (desktop 1280×900 dan mobile 390×844) | **34/34 route + 21/21 fungsional lulus** |

**Per kategori (verify-production, jumlah pemeriksaan lulus):**

| Kategori | Lulus | Bukti utama |
|---|---|---|
| Route publik | 18/18 | 17 route **200**, `data-ssg-path` = route, canonical = URL sendiri (`https://sanomatrassehat.com…`, beranda dengan `/`), tepat 1 H1/`<title>`/description, JSON-LD `LocalBusiness` valid 1×, **tanpa noindex** (meta maupun header `X-Robots-Tag`) |
| Sitemap | 6/6 | `application/xml`, 17 URL = manifest, domain canonical, tanpa duplikat/query/trailing slash/changefreq/priority/admin/api/404, `lastmod` valid dan bervariasi |
| Robots | 1/1 | `Allow: /` + `Sitemap: https://sanomatrassehat.com/sitemap.xml` |
| Redirect trailing slash | 18/18 | Semua `/x/` → **308** `/x` (10 halaman + 6 artikel); query dipertahankan: `/kontak/?utm_source=uji&gclid=abc` → `/kontak?utm_source=uji&gclid=abc`; beranda tidak di-redirect |
| **404 asli** | 10/10 | `/url-tidak-ada`, `/artikel/slug-tidak-ada`, `/klinik-matras/xyz`, `/klinik-matras.html`, `/index.css`, `/spa-fallback.html`, `/api/tidak-ada`, `/assets/tidak-ada.js`, `/tidak-ada.png`, `/admin/tidak-ada` → **HTTP 404**, HTML noindex tanpa canonical, H1 "Halaman Tidak Ditemukan" (sebelum rilis semuanya 200) |
| Domain (http/www) | 4/4 | `http://` → 308 https; `https://www.` → 307 apex; `www/kontak/?utm_source=uji` berakhir di `https://sanomatrassehat.com/kontak?utm_source=uji` (200) dalam **2 hop**, tanpa loop |
| Admin | 4/4 | `/admin/` **200** tanpa redirect, HTML Decap, meta noindex, header `X-Robots-Tag: noindex, nofollow`; `/admin/config.yml` **200** `text/yaml` (bukan HTML), header noindex |
| API (GET/HEAD saja) | 3/3 | `GET /api/lead` **405** JSON `Allow: POST`; `HEAD /api/lead` **405**; header `noindex, nofollow` |
| OAuth (GET redirect saja, tanpa login) | 4/4 | `/api/auth` → 302 ke `github.com/login/oauth/authorize`, `redirect_uri=https://sanomatrassehat.com/api/callback`, `state` dan `client_id` ada (tidak dicetak); `/api/callback` tanpa parameter menolak aman (tanpa token) |
| Aset | 6/6 | JS bundle (`application/javascript`), gambar, video: 200 non-HTML |
| Tracking | 1/1 | GTM, Meta Pixel, TikTok masih ada di HTML beranda |
| Domain sekunder | 2/2 | Lihat §5 |

**Header mentah production:** `/`, `/klinik-matras` = 200 tanpa `X-Robots-Tag`; `/admin/`, `/admin/config.yml`, `/api/lead` = `X-Robots-Tag: noindex, nofollow`; `/url-tidak-ada`, `/index.css` = 404. HTML beranda: 108 210 byte tak terkompresi, 18 090 byte dengan brotli.

**Browser (production, pixel/GTM diblok, tanpa klik WhatsApp, tanpa form):** hydration bersih di 17 route × 2 viewport (0 warning/error); dark mode tersimpan diterapkan tanpa mismatch dan toggle menyimpan preferensi; atribusi WhatsApp: organik → tanpa tag, landing dengan `utm_*` → semua link WA bertag setelah hydration, sesi beriklan memuat `/pricelist` langsung → bertag tanpa mismatch, navigasi SPA → bertag; navigasi `/` → `/klinik-matras` → back memperbarui title/canonical dengan benar; halaman 404 ter-hydrate (noindex, tanpa canonical) dan navigasi 404 → beranda memulihkan canonical; `/klinik-matras/` mendarat di `/klinik-matras` tanpa error; sitemap XML valid (DOMParser) dan semua URL-nya 200 self-canonical.

## 5. Domain sekunder `sano-website.vercel.app`

| Pemeriksaan (tanpa autentikasi) | Hasil |
|---|---|
| GET dan HEAD: `/`, `/klinik-matras`, `/sitemap.xml`, `/admin/`, `/api/lead` | **Semuanya 302** ke `vercel.com/sso-api` (10/10 permintaan) |
| Body respons | 15 byte; **0** penanda konten situs |
| `verify-production --expect-secondary=protected` | **PASS** |
| Build baru di sekunder setelah merge | **Tidak ada**: status `Canceled by Ignored Build Step`; satu-satunya deployment untuk commit merge = "Production – website-sano" |
| Target rollback `1b7cf8a` | Masih ada (URL `website-sano-ewr56zx05-…` → 302 SSO, bukan 404) |

## 6. Temuan, regresi, dan pemulihan

**Regresi: tidak ada.** Rollback **tidak dijalankan dan tidak diperlukan**. Rencana rollback tetap siap: Instant Rollback di dasbor ke deployment `1b7cf8a` (tidak diverifikasi aktif — menu tampak nonaktif untuk deployment yang sedang live sebelum rilis; kini `1b7cf8a` bukan lagi deployment live), cadangan *Redeploy* `1b7cf8a` atau `git revert -m 1 c5dbfd7`.

Observasi (bukan regresi; semuanya sudah dicatat sebelum rilis):

| Prioritas | Temuan |
|---|---|
| **HIGH (existing)** | `RESEND_API_KEY` dan `LEAD_NOTIFICATION_EMAIL` **tidak terkonfirmasi** di env Production `website-sano` (screenshot owner hanya memperlihatkan OAuth dan `META_*`). Bila benar hilang, formulir kontak menjawab 502 (`api/lead.ts`, `emailNotify.ts`). **Cacat yang ada sebelum rilis**, tidak diubah (keputusan owner: tanpa perubahan kode/env pada rilis ini). Form **tidak boleh dinyatakan berfungsi** tanpa uji terkontrol |
| MEDIUM | `www` → apex masih **307 (sementara)**; rantai `www/x/` = 2 hop (307 lalu 308) |
| MEDIUM | 16 title >60 karakter (terpanjang 122; beranda 95 dengan suffix brand ganda) dan 2 description di luar 70–160 karakter (peringatan build, konten belum diubah) |
| MEDIUM | JSON-LD minimal (tanpa `@id`, `geo`, `sameAs`, `areaServed`, `priceRange`, `logo`) |
| LOW | Aset `Cache-Control: public, max-age=0, must-revalidate` (default Vercel; sama seperti sebelum rilis) |
| LOW | Duplikat URL kecil: `/index.html` dan `/klinik-matras/index.html` = 200 (self-canonical, tidak di sitemap); `/admin` dan `/admin/` sama-sama 200 (noindex); `/404.html` = 200 (noindex) |
| LOW | OAuth `scope=repo` luas; `api/lead` tanpa cek Origin/rate limit (temuan Fase 0) |

## 7. Status pengujian yang sengaja tidak dilakukan

| Item | Status |
|---|---|
| **Form lead / `POST /api/lead`** | **NOT TESTED** — tidak ada POST, tidak ada lead nyata. **Tidak dinyatakan berfungsi** |
| **Login CMS (`/admin/` dengan akun owner)** | **NOT TESTED** — hanya `GET /admin/`, `GET /admin/config.yml`, dan redirect `GET /api/auth` yang diperiksa (tanpa kredensial) |
| Event Meta (CAPI/Pixel) | **NOT SENT** — pixel dan GTM diblok pada semua uji browser; tidak ada POST |
| Klik WhatsApp nyata | **NOT TESTED** — hanya `href` link yang diperiksa |
| Bypass secret lama | **Tidak dipakai**; penghapusan **OWNER-REPORTED**, tidak diuji |
| Search Console / pengiriman ulang sitemap | **Tidak dilakukan** (tidak ada akses; menunggu verifikasi lulus — kini sudah lulus, tindakan berada pada owner) |
| Setting dasbor Vercel | Tidak dapat dibaca; tidak diubah |

## 8. Garis waktu (UTC, 2026-09-24)

| Waktu | Kejadian |
|---|---|
| ±03:3x | Pre-merge gate: fetch, tsc, build, artefak, pemindaian secret, regresi lokal |
| 03:4x | Merge lokal `--no-ff` → `c5dbfd7` (percobaan pertama gagal tanpa efek, lalu berhasil) |
| 03:48:44 | `git push origin main` (`1b7cf8a..c5dbfd7`) |
| 03:49:09 | Deployment `6629758914` dibuat |
| 03:49:22 | Status `success`; sekunder `Canceled by Ignored Build Step` |
| 03:49:49–03:5x | `verify-production` 77/77, `verify-deployment` 75/75, browser 34/34 + 21/21, pemeriksaan sekunder |

## 9. Pekerjaan lanjutan setelah rilis

**Segera (owner, 24 jam):**
1. **Search Console:** URL Inspection Live Test pada `/`, `/klinik-matras`, satu artikel; **kirim ulang sitemap** (verifikasi production sudah lulus); pantau Pages (Soft 404 turun), Redirect, dan Crawl stats. Catat baseline sebelum/sesudah.
2. **Pemantauan:** log fungsi `api/*` tanpa lonjakan error; GTM/Pixel menerima event normal; jumlah klik WhatsApp tidak turun; T+1 jam, T+24 jam, T+7 hari.
3. **Putuskan soal `RESEND_*`:** cek inbox `LEAD_NOTIFICATION_EMAIL` (`subject:"Lead baru"`, tanggal terakhir), cek project SANSS Hub / tab Shared; tambahkan ke Production `website-sano` bila email formulir memang dibutuhkan (berlaku pada deployment berikutnya). Setelah itu, **satu lead terkontrol dengan izin terpisah** (termasuk keputusan event Meta).
4. **Login CMS manual oleh owner** (tanpa publish; publish = commit ke `main` = deployment).
5. Bawa laporan `SEO_*` (di branch `feat/seo-ssg-implementation`, belum di `main`) ke `main` bila diinginkan — akan memicu satu deployment production; pertimbangkan menonaktifkannya lewat konvensi skip-deploy Vercel (cara tepatnya perlu diverifikasi) atau terima deployment tambahan.

**Perbaikan berikutnya (fase terpisah):** www→apex 308; `Cache-Control: immutable` untuk `/assets/*`; rapikan title/description; Fase 3 schema (`@id`, `geo`, `sameAs`, `areaServed`, `Service`, `BreadcrumbList`, `Article`); redirect `/x/index.html`; Tailwind build-time; pin Node 24.x (`engines`); keamanan `api/lead` (Origin, rate limit) dan OAuth `scope`; hapus referensi `GEMINI_API_KEY` di README; isi kolom `draft` di Decap bila diperlukan.

## 10. Kepatuhan pada batasan

Merge tanpa force push; tidak ada perubahan DNS, domain, environment, atau pengaturan Vercel; tidak ada deployment di project sekunder; tidak ada POST atau lead/event nyata; tidak ada login CMS; tidak ada bypass lama; tidak ada perbaikan di luar scope SEO; sitemap tidak dikirim ulang; **laporan ini di-commit ke branch kerja `feat/seo-ssg-implementation` (bukan `main`)** sehingga tidak memicu deployment production tambahan.

---
*Keputusan akhir: **GO**. Rilis SEO aktif di production; verifikasi otomatis dan browser lulus; form lead dan login CMS berstatus NOT TESTED.*
