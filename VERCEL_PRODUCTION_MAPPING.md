# VERCEL_PRODUCTION_MAPPING — sanomatrassehat.com

Tanggal audit: 2026-09-24 (WIB) · Mode: **read-only** · Repo: `github.com/gilang2xx/website-sano` (publik)
Project Vercel terhubung: `sano-website-vs` dan `website-sano` (team/scope `rigss-projects`)

## 0. Batas akses (baca dulu)

**Akses dashboard/API Vercel TIDAK tersedia.** Vercel CLI 48.12.0 sudah terpasang di mesin ini, tetapi `vercel whoami` gagal: *"The specified token is not valid"*, dan `vercel teams ls`: *"No existing credentials found"*. Saya tidak menjalankan `vercel login`, tidak menyentuh kredensial, dan tidak menginstal apa pun.

Konsekuensi: **Project ID, Build Command/Output Directory di dashboard, versi Node.js, daftar & scope environment variable, pengaturan Deployment Protection, dan daftar domain per project TIDAK dapat dibaca langsung.** Semua di bawah berasal dari bukti eksternal yang dapat diperiksa siapa pun: GitHub API publik (deployment/status yang dibuat bot Vercel), DNS publik, dan permintaan HTTP **GET/HEAD** (tanpa POST, tanpa `vercel login`, tanpa mengubah apa pun). Setiap klaim diberi tingkat kepastian: **[TERBUKTI]**, **[INFERENSI]**, atau **[TIDAK TERVERIFIKASI]**. Tidak ada nilai secret yang dicetak (untuk `/api/auth` hanya status HTTP dan host tujuan redirect yang dicatat).

---

## 1. Ringkasan

| Pertanyaan | Jawaban | Kepastian |
|---|---|---|
| Berapa project yang mendeploy repo ini? | Dua: `sano-website-vs` dan `website-sano`, keduanya bot `vercel[bot]` | TERBUKTI |
| Apakah keduanya deploy Production saat `main` diperbarui? | **Ya, setiap kali.** Semua deployment Production di GitHub berpasangan (dua project, selisih detik) sejak 2026-08-15 | TERBUKTI |
| Apakah keduanya deploy Preview untuk branch fitur? | Ya (pasangan Preview untuk `c0b50f9`, `85e2b7f`, `5bb5c29`, `fbdd473`) | TERBUKTI |
| Apakah `sanomatrassehat.com` dilayani Vercel? | Ya (`Server: Vercel`, `X-Vercel-Id`, NS `ns1/ns2.vercel-dns.com`) | TERBUKTI |
| Project mana yang memegang `sanomatrassehat.com` / `www`? | **Kemungkinan besar `website-sano`**; bukan project di balik `sano-website.vercel.app` | **INFERENSI** (lihat §3) |
| Apakah kedua project punya konfigurasi env production yang sama? | **Tidak.** Salah satu tidak punya `GITHUB_OAUTH_CLIENT_ID` | TERBUKTI (§4) |
| Versi Node.js, build command, Project ID | Tidak terbaca | TIDAK TERVERIFIKASI |

**Temuan terpenting:** ada **dua salinan production yang hidup** dari repo yang sama, dengan konfigurasi env yang berbeda. Salinan sekunder dapat diakses publik di `https://sano-website.vercel.app` (200, robots `Allow: /`, tanpa `X-Robots-Tag`), menjalankan fungsi `api/*` dan `/admin/` sendiri.

---

## 2. Bukti deployment (GitHub Deployments API, read-only)

Sumber: `GET /repos/gilang2xx/website-sano/deployments` dan `/commits/<sha>/status`. Repo publik (`private: false`), default branch `main`.

**Production (dipicu update `main`) — selalu berpasangan, contoh terbaru:**

| Waktu (UTC) | Environment | Commit |
|---|---|---|
| 2026-09-09 10:39:00 | Production – sano-website-vs | `1b7cf8a` |
| 2026-09-09 10:39:19 | Production – website-sano | `1b7cf8a` |
| 2026-09-09 10:35:02 / 10:34:56 | Production – sano-website-vs / website-sano | `6a92be2` |
| 2026-09-09 10:16:33 / 10:16:04 | Production – sano-website-vs / website-sano | `e2ae5f7` |
| … 9 pasangan Production lain antara 2026-08-15 dan 2026-09-09 | | |

- Status commit `main` (`1b7cf8a`): **dua** status `success` — `Vercel – sano-website-vs` (10:39:00) dan `Vercel – website-sano` (10:39:19).
- **Preview (branch fitur) — juga berpasangan:** `fbdd473`, `5bb5c29` (branch `feat/seo-ssg-implementation`), `c0b50f9`, `85e2b7f`.
- Deployment terakhir Production = **2026-09-09**; tidak ada sejak itu. Konsisten dengan header produksi: `Age: 1199996` detik ≈ 13,9 hari sebelum 2026-09-23 22:40 UTC.
- Belum ada merge ke `main` sejak Fase 0/1 (branch fitur belum digabung), sehingga **produksi masih SPA lama** (HTML awal tanpa `data-ssg-path`, canonical statis `https://sanomatrassehat.com/`).

**URL deployment Production `1b7cf8a` (dari `environment_url`):**

| Project | URL deployment | Akses publik |
|---|---|---|
| sano-website-vs | `sano-website-dkgz525d0-rigss-projects.vercel.app` | 302 → `vercel.com/sso-api` (dilindungi SSO) |
| website-sano | `website-sano-ewr56zx05-rigss-projects.vercel.app` | 302 → `vercel.com/sso-api` (dilindungi SSO) |

Catatan anomali penamaan: konteks status bernama **`sano-website-vs`**, tetapi hostname deployment-nya berawalan **`sano-website-`** (bukan `sano-website-vs-`). Kemungkinan project pernah bernama `sano-website` lalu di-rename **[INFERENSI]**; ini tidak bisa dipastikan tanpa dashboard.

---

## 3. Bukti domain production

**DNS publik (resolver 1.1.1.1, query saja):**

| Record | Hasil |
|---|---|
| NS `sanomatrassehat.com` | `ns1.vercel-dns.com`, `ns2.vercel-dns.com` → **zona DNS di-host Vercel** |
| A `sanomatrassehat.com` | `64.29.17.1`, `64.29.17.65` |
| A `www.sanomatrassehat.com` | `216.198.79.1`, `64.29.17.65` |
| MX | `mx1.hostinger.com` (5), `mx2.hostinger.com` (10) |
| TXT | `v=spf1 include:_spf.mail.hostinger.com ~all`; `facebook-domain-verification=…` |

Email domain ini berjalan di **Hostinger** (MX + SPF) sementara DNS-nya di Vercel: mengubah/menghapus zona atau memindahkan domain **dapat memutus email** kecuali record MX/SPF/TXT dipertahankan.

**HTTP (GET/HEAD):**

| Permintaan | Hasil |
|---|---|
| `http://sanomatrassehat.com/` | 308 → `https://sanomatrassehat.com/` |
| `https://sanomatrassehat.com/` | 200, `Server: Vercel`, `x-vercel-cache: HIT`, HSTS `max-age=63072000`, `Etag: "0985ae12…"` |
| `http://www…/` | 308 → `https://www…/` |
| `https://www.sanomatrassehat.com/` | **307 → `https://sanomatrassehat.com/`** (www dialihkan ke apex; redirect diset di sisi Vercel/domain, bukan di repo — `vercel.json` tidak punya `redirects`) |

**Menentukan pemilik domain (rantai bukti):**

1. `https://sano-website.vercel.app/` → 200 dengan **Etag identik** dengan apex (`0985ae12…`) dan bundle yang sama (`assets/index-DzVAxQ05.js`) → itu salinan production dari commit yang sama. Ini alias `.vercel.app` publik yang belum dilindungi. **[TERBUKTI ada; kepemilikannya INFERENSI]**
2. Hostname deployment production `sano-website-vs` berawalan `sano-website-…` (`sano-website-dkgz525d0-…`), sehingga `sano-website.vercel.app` sangat mungkin domain default project `sano-website-vs` (nama lama). **[INFERENSI]**
3. `https://sano-website-vs.vercel.app` dan `https://website-sano.vercel.app` → keduanya **404** (tidak ada deployment di alias itu). Artinya project `website-sano` **tidak** punya alias `website-sano.vercel.app` yang aktif (dihapus/berbeda), dan alias `sano-website-vs.vercel.app` tidak ada. **[TERBUKTI 404; penyebab TIDAK TERVERIFIKASI]**
4. **Pembeda keputusan:** `GET /api/auth`
   - `sanomatrassehat.com` → **302 ke `github.com/login/oauth/authorize`** → project pemilik apex **memiliki** `GITHUB_OAUTH_CLIENT_ID` di scope Production.
   - `sano-website.vercel.app` → **500 "Missing GITHUB_OAUTH_CLIENT_ID environment variable"** → project di balik alias itu **tidak** memilikinya.
   Dua project berbeda ⇒ **apex bukan dimiliki project yang melayani `sano-website.vercel.app`**.
5. Kesimpulan: `sanomatrassehat.com` (dan `www`, yang mengalihkan ke apex) kemungkinan dimiliki **`website-sano`**, sedangkan **`sano-website-vs` adalah project tambahan/duplikat** tanpa env OAuth. **[INFERENSI — kuat tetapi bukan bukti langsung]** Asumsi: hanya ada dua project. Bila ada project ketiga bernama `sano-website`, kesimpulan berubah.

> Konsekuensi untuk pekerjaan sebelumnya: pengujian Vercel Preview Fase 1 memakai bypass di `sano-website-vs` (project sekunder menurut inferensi ini). Kode sama, jadi hasil rendering/hydration berlaku; tetapi **`website-sano` (pemilik produksi) belum pernah diuji di preview**, dan perbedaan Node.js/build settings antar project tidak terlihat.

---

## 4. Perbandingan project

| Aspek | `sano-website-vs` | `website-sano` | Kepastian |
|---|---|---|---|
| Project ID | ? | ? | TIDAK TERVERIFIKASI |
| Git repository | `gilang2xx/website-sano` | `gilang2xx/website-sano` | TERBUKTI (status bot GitHub) |
| Deploy Production saat `main` update | Ya | Ya | TERBUKTI |
| Deploy Preview branch | Ya | Ya | TERBUKTI |
| Branch production | `main` (deployment "Production" muncul untuk push ke `main`) | `main` | TERBUKTI secara perilaku; setting dashboard TIDAK TERVERIFIKASI |
| Domain custom | Kemungkinan tidak ada | **Kemungkinan `sanomatrassehat.com` + `www`** | INFERENSI |
| Alias `.vercel.app` publik | `sano-website.vercel.app` (200) | `website-sano.vercel.app` → 404 | TERBUKTI (kepemilikan alias = inferensi) |
| Build Command | `npm run build` (dari `vercel.json`, override dashboard) | sama | TERBUKTI dari repo `vercel.json:2`; nilai dashboard tidak terbaca |
| Output Directory | `dist` (`vercel.json:3`) | sama | TERBUKTI dari repo |
| Framework preset | `vite` (`vercel.json:4`) | sama | TERBUKTI dari repo |
| Node.js version | ? (tidak ada `engines`, `.nvmrc`, `.node-version` di repo) | ? | **TIDAK TERVERIFIKASI** |
| Build sukses untuk `fbdd473` (Preview) | success | success | TERBUKTI (status GitHub) |
| Deployment Protection (preview & URL deployment) | SSO aktif (302 ke `vercel.com/sso-api`) | SSO aktif | TERBUKTI |
| Protection untuk alias production | `sano-website.vercel.app` **publik** | apex publik | TERBUKTI |
| `GITHUB_OAUTH_CLIENT_ID` (Production) | **Tidak ada** (`/api/auth` = 500) | **Ada** (apex `/api/auth` = 302 GitHub) | TERBUKTI (asosiasi ke project = inferensi) |
| `RESEND_API_KEY`, `META_ACCESS_TOKEN`, `META_DATASET_ID`, `LEAD_NOTIFICATION_EMAIL`, dst. | ? | ? | TIDAK TERVERIFIKASI (hanya bisa dicek dengan POST, tidak dilakukan) |
| Env scope (Prod/Preview/Dev) | ? | ? | TIDAK TERVERIFIKASI |

Nama env yang diketahui dipakai kode (dari `.env.example`/`api/`): `RESEND_API_KEY`, `LEAD_NOTIFICATION_EMAIL`, `RESEND_FROM_EMAIL`, `META_DATASET_ID`, `META_ACCESS_TOKEN`, `META_TEST_EVENT_CODE`, `META_LEAD_CURRENCY`, `META_LEAD_DEFAULT_VALUE`, `META_LEAD_VALUE_MAP`, `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET`. Nilainya tidak dibaca.

---

## 5. Risiko deployment ganda

| # | Risiko | Bukti | Tingkat |
|---|---|---|---|
| D1 | **Duplikat situs publik terindeks:** `sano-website.vercel.app` melayani seluruh situs, `robots.txt` `Allow: /`, tanpa `X-Robots-Tag`, dapat di-crawl | probe §3 | Sedang (canonical statis ke apex menahan sebagian dampak; setelah SSG tiap halaman punya canonical absolut ke apex) — **perlu dicek di GSC** apakah host `.vercel.app` pernah terindeks |
| D2 | **Dua salinan `api/*` hidup.** Di salinan sekunder `/api/auth` gagal (500) dan `/admin/` termuat; `/api/lead` menjawab 405 untuk GET. Jika `RESEND_*`/`META_*` diset di salinan sekunder, form di host itu mengirim email dan event Meta CAPI nyata; bila tidak diset, form menjawab 502 (perilaku `api/lead.ts:86-93`) | probe §3–4; kode | Sedang — **status env sekunder tidak diketahui** |
| D3 | **Pengujian Preview bisa memakai kredensial production** jika env production juga dicentang untuk scope Preview. Form di URL preview akan POST ke fungsi preview dengan env Preview. `META_TEST_EVENT_CODE` bisa dipakai agar event tidak masuk live | kode `api/lead.ts:71` | Tinggi bila scope Preview tidak dipisah — **tidak diverifikasi**; sebab itu form tidak saya uji di preview |
| D4 | **Biaya/kuota build ganda:** setiap push ke `main` (termasuk publish Decap CMS = commit ke `main`) memicu dua build; setiap branch/PR memicu dua Preview | §2 | Rendah–sedang |
| D5 | **Kegagalan tidak simetris:** satu project bisa gagal build (mis. beda Node.js) sementara yang lain sukses; status GitHub `pending/failure` bisa membingungkan | §2 | Rendah |
| D6 | **Pengujian menyasar project yang salah:** hasil verifikasi Fase 1 di `sano-website-vs` mungkin bukan konfigurasi produksi | §3 | Sedang |
| D7 | **Merge ke `main` (Fase 1/2) akan mendeploy ke KEDUA project sekaligus**, termasuk `rewrite`/404/`X-Robots-Tag` baru di `vercel.json`; rollback harus dilakukan di project pemilik domain | §2 | Perlu dipahami sebelum merge |
| D8 | **DNS di Vercel + email di Hostinger:** perubahan zona/domain (mis. memindahkan domain antar project/team) dapat mengganggu MX/SPF | §3 | Operasional |
| D9 | Auth admin: `api/auth.ts`/`config.yml` menunjuk hard-coded ke `sanomatrassehat.com`; Decap di host lain tidak bisa login | kode | Rendah (justru membatasi) |

---

## 6. Rekomendasi (tidak dijalankan; semuanya butuh keputusan pemilik akun)

1. **Konfirmasi pemilik domain di dashboard** (langkah §8). Tetapkan **satu project produksi** dan jadikan yang lain non-produksi atau hapus.
2. **Hentikan deployment ganda** di project sekunder — pilih salah satu: (a) putuskan koneksi Git; (b) *Ignored Build Step* (mis. `exit 0` agar selalu skip) di Settings → Git; (c) hapus project setelah memastikan tidak ada domain/env/webhook yang dipakai. Urutan aman: **jangan hapus sebelum** domain & env terverifikasi berada di project utama.
3. **Tutup akses publik ke salinan sekunder:** aktifkan Deployment Protection "All Deployments" pada project sekunder, atau hapus alias `sano-website.vercel.app`. Sementara belum, tambahkan `noindex` khusus host non-apex (header `X-Robots-Tag` bersyarat host di `vercel.json`) sebagai lapis sementara — perlu diuji karena sama-sama dideploy ke kedua project.
4. **Pisahkan env Preview dari Production** di project utama: nilai berbeda atau kosong untuk `RESEND_*`, `META_ACCESS_TOKEN`/`META_DATASET_ID`, dan set `META_TEST_EVENT_CODE` untuk scope Preview. Jangan mengetes form di preview sebelum ini beres.
5. **Ulangi verifikasi Fase 1 pada Preview project utama** (`website-sano`, bila konfirmasi §8 cocok) dengan Protection Bypass khusus project itu, sebelum merge.
6. **Pin Node.js:** setelah versi terbaca, samakan di kedua project dan pin lewat `engines` (`package.json`) atau setting project agar build tidak berubah diam-diam.
7. **Cek Google Search Console** untuk host `sano-website.vercel.app` (operator `site:sano-website.vercel.app`); jika terindeks, tambahkan noindex/hapus alias lalu gunakan *Removals*.
8. **Dokumentasikan domain/DNS**: catat bahwa zona di Vercel juga menopang email Hostinger sebelum ada perubahan apa pun pada domain.

---

## 7. Hal yang belum terverifikasi (unresolved)

| # | Item | Mengapa tidak terbaca |
|---|---|---|
| U1 | Project ID kedua project | Tanpa akses API/dashboard |
| U2 | Pemilik pasti `sanomatrassehat.com` dan `www` (hanya inferensi) | Butuh daftar domain per project |
| U3 | Apakah ada **project ketiga** bernama `sano-website` yang memegang `sano-website.vercel.app` | Hanya dua project yang diketahui |
| U4 | Riwayat rename `sano-website` → `sano-website-vs` | Anomali nama hostname |
| U5 | Mengapa `website-sano.vercel.app` = 404 (alias dihapus/proyek berganti nama) | Butuh dashboard |
| U6 | Versi Node.js, Build/Install Command efektif, Root Directory, Ignored Build Step | Setting dashboard |
| U7 | Daftar nama & scope (Production/Preview/Development) env per project; apakah secret production ikut scope Preview | Setting dashboard; `vercel env ls` butuh login |
| U8 | Apakah salinan sekunder punya `RESEND_*`/`META_*` (dan bisa mengirim lead nyata) | Hanya bisa diuji dengan POST, dilarang |
| U9 | Konfigurasi redirect `www → apex` (307) — di project mana dan apakah "permanent" | Butuh Domains di dashboard |
| U10 | Proxy/CDN di depan Vercel (mis. Cloudflare) | Header menunjukkan langsung Vercel (`Server: Vercel`, NS Vercel); tidak ada bukti proxy lain, tetapi tidak dapat dibuktikan absen |
| U11 | Deployment Protection untuk production alias di kedua project (selain apa yang terlihat dari luar) | Setting dashboard |
| U12 | Apakah host `.vercel.app` terindeks Google | Butuh GSC |
| U13 | Registrar domain dan team pemilik zona DNS | Butuh Domains di dashboard |
| U14 | Vercel Firewall/WAF, rate limit, dan log fungsi | Butuh dashboard |

## 8. Langkah verifikasi manual di dashboard (untuk pemilik akun)

Untuk **setiap** project (`sano-website-vs`, `website-sano`):
1. **Settings → General:** catat *Project ID*, *Root Directory*, *Node.js Version*, *Build & Development Settings* (Framework, Build Command, Output Directory, Install Command).
2. **Settings → Domains:** daftar domain terpasang (apakah `sanomatrassehat.com`, `www.sanomatrassehat.com`, `sano-website.vercel.app`), target redirect `www`, status *Production*.
3. **Settings → Git:** repo terhubung, *Production Branch*, *Ignored Build Step*.
4. **Settings → Environment Variables:** hanya nama dan centang scope (Production/Preview/Development); **jangan salin nilai**. Cocokkan dengan daftar nama di §4.
5. **Settings → Deployment Protection:** mode Vercel Authentication (Standard/All Deployments), bypass yang masih aktif (**hapus bypass automation yang dibuat untuk pengujian SEO**), exceptions.
6. **Deployments:** deployment Production terakhir, domain yang dilekatkan, log build (baris "Node.js version").
7. **Team → Domains:** zona DNS `sanomatrassehat.com` — pastikan record MX/SPF Hostinger tetap ada; catat registrar.

Alternatif CLI (setelah `vercel login` oleh Anda sendiri; semuanya read-only): `vercel project inspect <nama> --scope rigss-projects`, `vercel env ls --scope rigss-projects` (hanya nama/scope), `vercel domains inspect sanomatrassehat.com --scope rigss-projects`. Jangan menjalankan `vercel link`/`vercel env pull` di folder repo tanpa sadar: keduanya menulis file lokal.

---
*Audit ini tidak mengubah DNS, domain, project settings, env, branch, atau deployment; tidak melakukan merge/push ke `main`; tidak membuat deployment; tidak mengirim POST; dan tidak mencetak token/secret. Bypass Deployment Protection yang dibuat sebelumnya tidak dipakai dalam audit ini.*
