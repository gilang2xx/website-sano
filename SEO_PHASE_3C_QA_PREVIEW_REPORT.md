# SEO Fase 3C — QA & Preview Validation

Branch: `feat/seo-ssg-implementation` (implementasi P0 = 5acb341; perbaikan 3C ada di commit setelahnya). Tidak di-merge, tidak di-deploy ke production, tidak ada perubahan env/DNS/Vercel, `api/lead` tidak disentuh, tidak ada halaman baru.

**Ringkasan: semua validasi lokal lulus. Validasi Vercel Preview BELUM bisa dilakukan karena butuh Protection Bypass yang sah (lihat §3). Rekomendasi: NO-GO ke production sampai Preview tervalidasi dan owner meninjau copy.**

---

## 1. Route diff 17 → 19

Koreksi premis: sitemap production yang live saat ini berisi **18 URL**, bukan 17 (dibaca dari `https://sanomatrassehat.com/sitemap.xml`, GET). Angka 17 kemungkinan dari sebelum artikel CMS pilar tayang. Perubahan Fase 3B adalah **18 → 19: tepat +1 URL, yaitu halaman baru yang disengaja**. `diff` production vs build lokal: satu-satunya selisih `/perbaikan-kasur-amblas`.

| URL | Status lama (production) | Status baru | Alasan ada di sitemap |
|---|---|---|---|
| `/` | ada | ada | halaman publik |
| `/layanan` | ada | ada | halaman publik |
| `/pricelist` | ada | ada | halaman publik |
| `/artikel` | ada | ada | halaman publik |
| `/tentang-kami` | ada | ada | halaman publik |
| `/before-after` | ada | ada | halaman publik |
| `/kontak` | ada | ada | halaman publik |
| `/klinik-matras` | ada | ada | halaman publik (jadi hub) |
| **`/perbaikan-kasur-amblas`** | **tidak ada** | **ada (baru)** | halaman baru yang disetujui owner, di `STATIC_ROUTES` |
| `/klinik-sofa` | ada | ada | halaman publik |
| `/sano-clean` | ada | ada | halaman publik |
| `/kebijakan-privasi` | ada | ada | halaman publik |
| 6 artikel lama + 1 artikel CMS pilar (`/artikel/…`) | ada | ada | `LEGACY_ARTICLES` + konten CMS non-draft |

Tidak ada `/admin`, `/api`, `404`, `*` fallback, draft, duplikat (sitemap 19 unik), atau route internal di sitemap. Sitemap dan manifest dihasilkan dari registry route yang sama; guard prerender juga memastikan `vercel.json` sinkron.

## 2. Visual QA

Metode: Chrome headless (CDP) terhadap `dist/` build lokal lewat emulator Vercel lokal, host tracker diblokir. Pemeriksaan otomatis untuk 8 halaman × 3 mode (mobile 390px, desktop 1280px, mobile gelap): halaman = `/`, `/klinik-matras`, `/perbaikan-kasur-amblas`, `/pricelist`, `/kontak`, artikel `dampak-kasur-rusak`, `mengenal-struktur-kasur`, pilar.

- **Overflow horizontal**: 0 elemen menembus viewport pada semua kombinasi (scrollWidth = clientWidth).
- **Hierarki heading**: 1 H1 di semua halaman. Satu loncatan H1→H3 ditemukan di `/pricelist` (kartu paket dan judul "Butuh Layanan Lainnya?" berupa H3); **diperbaiki** menjadi H2 (class/tampilan tidak berubah). Setelah itu 0 loncatan.
- **Inspeksi visual screenshot** (dilihat langsung): hero `/perbaikan-kasur-amblas` mobile, kartu layanan hub mobile, hero hub mobile, FAQ amblas mobile, hero Home desktop, tabel masalah→layanan + kartu grup hub dark desktop, blok "Layanan Terkait" di artikel mobile. Layout tidak pecah, teks tidak terpotong, spacing wajar, CTA terbaca, dark mode konsisten, tidak ada layout shift yang terlihat. Catatan: tombol WhatsApp melayang menimpa sebagian tombol di sudut bawah kanan saat scroll (perilaku lama situs, bukan regresi).
- Screenshot tersimpan di folder scratchpad sesi (bukan di repo): `m-amblas-*.png`, `m-hub-*.png`, `d-home-0.png`, `d-hub-dark-0.png`, `m-art-0.png`.
- Keterbatasan: tidak semua halaman × semua posisi scroll dilihat manual; pemeriksaan penuh pada Preview/perangkat nyata tetap disarankan.

## 3. Vercel Preview — BLOCKED

- Push branch memicu Preview otomatis di project `website-sano`. Alias branch merespons **302 → `vercel.com/sso-api`** (Deployment Protection aktif, `X-Robots-Tag: noindex`), jadi deployment hidup dan terlindungi.
- Sesi ini tidak punya kredensial Vercel (`vercel whoami`: tidak ada login) dan tidak punya **Protection Bypass Secret** yang sah. Secret lama sudah dihapus owner dan tidak boleh dipakai. Deployment Protection tidak dimatikan.
- Karena itu tidak dapat dijalankan pada Preview: 19 route, canonical, metadata, H1, sitemap, 404, redirect trailing slash, hydration, atribusi WA, admin, API GET/HEAD, aset, perilaku noindex.
- **Yang dibutuhkan dari owner**: berikan bypass sebagai environment variable `VERCEL_BYPASS_SECRET` untuk sesi ini (atau jalankan `node scripts/verify-deployment.mjs --base=<url preview>` sendiri), tanpa mencetak/commit secret. Hanya GET/HEAD, tanpa POST form, tanpa event Meta.
- Pengganti sementara: seluruh suite yang sama dijalankan pada emulator lokal yang meniru `vercel.json` (lihat §7). Ini **bukan** bukti perilaku Vercel sebenarnya (header, redirect 307/308 Edge, cache).

## 4. Klaim: diubah / diblokir

| Item | Tindakan | Status |
|---|---|---|
| "Orthopedic gimmick" (Home) | Sebelum: "Seringkali label "Orthopedic" di pasaran hanya gimmick marketing tanpa standar medis yang jelas." Sesudah: "Label "Orthopedic" tidak selalu berarti sama antar kasur. Yang penting fondasi kokoh dan lapisan sesuai berat badan serta postur Kamu." (selaras KB: keras ≠ otomatis sehat; PAS dan presisi). | DIPERBAIKI |
| Artikel `dampak-kasur-rusak` | Diperlunak: "melengkung… menuju permanen" → "dapat menjadi kurang tertopang"; "penyebab utama" → "bisa berkaitan"; "merusak tubuh jangka panjang" → "kurang mendukung tubuh"; "Saraf Kejepit (HNP Fungsional): penekanan pada diskus…" → "Keluhan Saraf Kejepit… penyebab pastinya perlu diperiksa dokter"; "Skoliosis Fungsional…" → "Perubahan Postur…". | DIPERBAIKI (kata-kata); judul H1 ("Awas! … Merusak Tulang Belakang") dipertahankan, sudah berhedge "Mungkin" |
| Artikel `dampak-jangka-panjang-kasur-salah` | "tiket menuju gangguan muskuloskeletal" → "dapat berkaitan dengan keluhan otot dan tulang"; skoliosis → "Perubahan Postur"; "Saraf Kejepit (HNP) Berulang: Risiko tinggi…" → "Keluhan Saraf Kejepit… konsultasikan dengan dokter"; "kerusakan permanen" → kalimat perawatan dini; "sinyal bahaya" → "sinyal untuk memeriksa kondisi kasur". | DIPERBAIKI; judul ("Bahaya yang Mengintai…") dipertahankan → owner memutuskan |
| Testimonial `constants.ts` (4 entri) | Tidak dihapus. Tidak ada bukti sumber/izin di repo: kode berkomentar "Ganti foto asli/dummy", `photoUrl` berisi placeholder `https://lh3.googleusercontent.com/...` (tidak valid), `id` duplikat (3× `2`). Tindakan: tanggal palsu-relatif permanen "1 months ago" diganti label "Ulasan Google"; `key` React dibuat unik. Isi ulasan tidak diubah. | BLOCKED-BY-OWNER: verifikasi ulasan itu benar-benar ada di Google dan pemberi ulasan setuju dicantumkan; bila tidak, hapus |
| Teknisi 10+ tahun | Didukung knowledge base owner ("Teknisi berpengalaman >10 tahun… King Koil, Serta, Lady Americana"). Tidak diubah, tidak diperkuat. Tidak ada bukti tertulis di repo. | DIPERTAHANKAN — owner sebaiknya menyimpan bukti (mis. profil teknisi) |
| Klaim baru | Tidak ada klaim medis/harga/durasi/area/rating baru. | OK |

## 5. Title & meta — yang benar-benar perlu diperbaiki

Batas 60 karakter tidak dipakai sebagai hard limit. Tinjauan (semua title = judul halaman + " | KLINIK MATRAS by SANO CARE"):

- (a) Intent tertutup karena terlalu panjang: tidak ada; kata kunci utama selalu di awal. Judul artikel 100+ karakter terpotong di SERP tetapi intent terbaca. Dibiarkan.
- (b) Terlalu generik: `/artikel` ("Artikel & Edukasi Kesehatan Tidur") dan `/layanan` dibiarkan; tidak ada bukti masalah tanpa data GSC.
- (c) Duplikat/near-duplicate: tidak ada title duplikat (dijaga guard prerender). `/klinik-matras` vs `/` dibedakan (hub layanan vs brand/positioning).
- (d) Suffix brand tidak proporsional: **satu kasus nyata** — artikel `klinik-matras-by-sano-care` (judul memuat "Klinik Matras by SANO CARE" lalu ditambah suffix "KLINIK MATRAS by SANO CARE", brand dua kali dalam 106 karakter). **Diperbaiki**: `<title>` = "Solusi Kasur Sehat dari Akar Permasalahan: Dampak Kasur yang Salah | KLINIK MATRAS by SANO CARE"; H1 artikel tidak berubah (`SEO_TITLE_OVERRIDE` di `ArtikelDetail.tsx`).
- Tidak ada mass rewrite. Peringatan prerender panjang title/description (16) tetap sebagai info, bukan error.

## 6. Internal linking QA

Dihitung dari HTML prerender (tautan `<a href="/…">` internal, tanpa self-link).

- `/klinik-matras` menerima tautan kontekstual dari 7 dari 7 artikel (anchor berbeda per artikel), plus Home, `/pricelist`, `/kontak`, `/perbaikan-kasur-amblas`. Semua artikel punya blok "Layanan Terkait".
- `/perbaikan-kasur-amblas` menerima tautan dari Home (3 tautan, anchor berbeda), hub, `/pricelist`, dan 4 artikel (`konsep-matras-sehat`, `dampak-kasur-rusak`, `dampak-jangka-panjang-kasur-salah`, `mengenal-struktur-kasur`) + pilar.
- Anchor bervariasi: mis. "cara mengenali dan memperbaiki kasur amblas", "tanda-tanda kasur amblas dan pilihan perbaikannya", "perbaikan kasur amblas", "panduan perbaikan kasur amblas"; hub: "layanan service kasur & springbed", "opsi upgrade fondasi dan lapisan", "layanan restorasi fondasi dan lapisan kasur", dst.
- Orphan: **`/layanan` ternyata orphan** (0 tautan masuk dari halaman mana pun; dropdown "Layanan" di header tidak menaut ke sana; kondisi lama, bukan dari 3B). **Diperbaiki**: tautan "Semua layanan kami" ditambahkan di baris tautan cepat Home. Sekarang 0 orphan.
- Tautan rusak: 0 (semua `<a href="/…">` cocok dengan route atau file statis).
- Catatan: `/perbaikan-kasur-amblas` belum ada di menu header (keputusan desain owner); `/sano-clean` hanya 2 tautan masuk kontekstual.

## 7. Hasil uji (lokal/emulator; semua GET/HEAD atau mock lokal)

| Uji | Hasil |
|---|---|
| `npx tsc --noEmit` | bersih |
| `npm run build` | sukses, 19 route, 0 error, 16 peringatan panjang title/desc |
| Sitemap | 19 URL unik, sama dengan manifest; selisih dgn production = +`/perbaikan-kasur-amblas` |
| Canonical / H1 / title | 19/19 tepat 1 H1, 1 title, 1 canonical self-referencing |
| Browser desktop+mobile (harness) | route-checks **38/38**, fungsional **24/24** (hydration, dark mode, navigasi SPA, 404, trailing slash, atribusi WA: organik tanpa tag / iklan bertag, form kontak ke **mock** `/api/lead`, sitemap XML) |
| `verify-deployment` (emulator lokal) | **79/79** |
| Overflow / heading / dark mode | lihat §2, 0 masalah tersisa |
| Internal link | 0 rusak, 0 orphan |
| Secret scan | `git grep` pola secret/token/bypass panjang pada kode: 0 temuan; nilai bypass lama tidak ada di repo. |
| Admin/API/atribusi WA | `api/`, `utils/attribution.ts`, `utils/leadTracking.ts`, admin tidak diubah |
| **Vercel Preview** | **BELUM** — lihat §3 |

## 8. Blocker sebelum production

1. **Preview belum tervalidasi** (butuh bypass sah dari owner; jalankan `verify-deployment` + cek visual di Preview).
2. Owner meninjau copy halaman baru dan hub, terutama FAQ springbed dan garansi ("sesuai paket, konfirmasi saat konsultasi").
3. Testimonial `constants.ts`: verifikasi sumber/izin atau hapus (BLOCKED-BY-OWNER).
4. Judul artikel yang bernada menakutkan ("Bahaya yang Mengintai…", "Merusak Tulang Belakang") — keputusan owner.
5. Cakupan garansi Standard/Premium, dasar harga coret, area jemput/antar (dari 3B, masih terbuka).
6. Risiko lama di luar cakupan: `RESEND_API_KEY`/`LEAD_NOTIFICATION_EMAIL` belum ada di env Production `website-sano`; jangan klaim form berfungsi tanpa uji terkontrol.

## 9. Rekomendasi

**NO-GO (belum) untuk merge/production.** Kode aman secara lokal (tsc, build, routing, sitemap, hydration, layout, tautan) dan perbaikan klaim/tautan 3C sudah masuk branch. Prasyarat GO: (1) validasi Preview lulus (butuh bypass dari owner), (2) owner menyetujui copy dan status klaim di §8 nomor 2-4. Setelah itu: merge → deploy → kirim ulang sitemap di GSC. Tidak akan ada merge/deploy tanpa izin eksplisit owner.

---

# FINAL PREVIEW GATE (update setelah keputusan owner)

Commit gate: `b53214d` di `feat/seo-ssg-implementation` (sudah di-push; Preview otomatis dipicu oleh Vercel). Tidak ada merge, tidak ada deploy production, tidak ada POST, tidak ada event Meta, tidak ada perubahan env/setting Vercel.

## A. Perubahan terakhir

| Keputusan owner | Tindakan |
|---|---|
| Testimonial tanpa sumber/izin tidak boleh tampil | `components/GoogleReviewSection.tsx` tidak lagi merender kartu testimonial (Ratna, Farhan, Krisna, Su Jannah), foto, bintang, atau angka rating. Sisa: panel "Ulasan Pelanggan di Google" + tombol "Lihat & Tulis Ulasan di Google" (tautan yang sudah ada). Data tetap di `constants.ts` dengan komentar "TIDAK DITAMPILKAN"; tampilkan lagi hanya setelah sumber dan izin terbukti. Terverifikasi: nama-nama tersebut tidak ada di HTML prerender Home. |
| Headline artikel terlalu menakutkan → edukatif | `dampak-kasur-rusak`: "Awas! Kasur Anda Mungkin Sedang Merusak Tulang Belakang…" → **"Apakah Kasur Anda Masih Menopang Tubuh dengan Baik? Kenali Tandanya"**. `dampak-jangka-panjang-kasur-salah`: "…Bahaya yang Mengintai di Balik Tidur Anda" → **"Menggunakan Kasur yang Tidak Sesuai dalam Jangka Panjang: Yang Perlu Anda Ketahui"**. Subjudul internal "4 Penyebab Utama Kasur Merusak Tubuh Anda" → "4 Faktor yang Membuat Kasur Kurang Mendukung Tubuh Anda". Diterapkan di halaman detail, daftar artikel, dan `<title>`. Slug/URL tidak berubah (tidak ada redirect diperlukan). |
| Orthopedic, wording kesehatan, teknisi 10+ tahun | Sudah diterapkan/dipertahankan di 3C sebelumnya; tidak diubah lagi. |
| Jangan mengarang garansi/area/durasi/harga/FAQ | Ditinjau ulang seluruh copy `/klinik-matras` dan `/perbaikan-kasur-amblas` (lihat B). Tidak ada perubahan yang diperlukan. |
| `/upgrade-kasur`, halaman kota, RESEND_* | Tidak dibuat / tidak disentuh. |

## B. Verifikasi klaim pada halaman baru & hub

Setiap pernyataan operasional ditelusuri ke sumber yang sudah tayang atau knowledge base owner:
- Harga: **tidak ada angka harga** di kedua halaman; semua mengarah ke `/pricelist` (dan halaman itu tidak ditambah harga baru).
- Durasi: tidak ada.
- Garansi: hanya "Layanan kami dilindungi garansi; cakupan dan lama berbeda menurut paket, konfirmasi saat konsultasi" (KB owner; tanpa angka).
- Area layanan: tidak ada klaim. Hanya fakta alamat workshop (Pancoran Mas, Kota Depok) dari halaman Kontak; jemput/antar = "konfirmasikan lokasi lewat WhatsApp".
- Alur Konsultasi→Estimasi→Jemput→Proses→Pembayaran (QRIS/transfer/tunai)→Antar: dari Home. "Update proses lewat foto/video" dan langkah diagnosis: KB owner, ditulis "dapat".
- ±1 cm penurunan fondasi: dari artikel pilar yang sudah tayang.
- FAQ springbed: jawaban hati-hati ("kirim foto, kami nilai"), tanpa janji cakupan merek/jenis.
- Konsultasi "gratis": sudah dipakai di CTA Home.

## C. Hasil Preview — BLOCKED (bypass tidak tersedia di sesi)

- `VERCEL_BYPASS_SECRET` **tidak ada** di environment sesi ini (shell, environment user/mesin Windows, maupun `.env*` di repo semuanya kosong). Nilai tidak dicetak, tidak disimpan, tidak di-commit. Saya tidak memakai secret lama yang sudah dihapus dan tidak menonaktifkan Deployment Protection.
- Yang teramati tanpa kredensial (HEAD, tanpa cookie/bypass): alias Preview branch SEO → **302 ke SSO Vercel** (aktif, terlindungi); domain sekunder `sano-website.vercel.app` (`/` dan `/perbaikan-kasur-amblas`) → **302 SSO** (tetap terlindungi, tidak terpengaruh, tanpa perubahan); production `sanomatrassehat.com/perbaikan-kasur-amblas` → **404** (halaman baru belum di production, sesuai: belum ada deploy production).
- Karena itu ceklis Preview (19 route, sitemap, canonical, metadata, H1, 404, trailing slash, internal link, admin, API GET/HEAD, aset, WA attribution, hydration) **belum dijalankan pada Preview**. Perintah untuk menjalankannya begitu env tersedia:
  `VERCEL_BYPASS_SECRET=<diset di shell, jangan diketik ke berkas> node scripts/verify-deployment.mjs --base=https://website-sano-git-feat-seo-ssg-implementation-rigss-projects.vercel.app`
  (hanya GET/HEAD; skrip tidak mencetak secret; tidak ada POST).
- Agar env terbaca: set di sesi terminal yang sama dengan Claude Code (mis. `$env:VERCEL_BYPASS_SECRET="…"` di PowerShell sebelum menjalankan Claude Code), lalu minta lanjutkan.

## D. Hasil lokal pada build final (emulator Vercel lokal, tracker diblokir)

| Uji | Hasil |
|---|---|
| `tsc --noEmit` | bersih |
| `npm run build` | 19 route, 0 error, sitemap 19 URL |
| Secret scan (`git grep` pola secret/token/bypass + nilai bypass lama) | 0 temuan; tidak ada berkas `.env*` selain `.env.example` |
| Browser harness desktop+mobile | route-checks 38/38; fungsional 24/24 (hydration, dark mode, SPA nav, 404, trailing slash, WA attribution organik/iklan, form ke mock lokal, sitemap) |
| `verify-deployment` (emulator) | 79/79 |
| Overflow/heading/dark, 8 halaman × 3 mode | 0 masalah |
| Internal link | 0 rusak, 0 orphan |

Visual QA: hasil §2 di atas tetap berlaku; perubahan gate hanya menyentuh bagian ulasan Home (panel sederhana, tidak ada layout kompleks) dan teks judul artikel. Screenshot ulang bagian ulasan tidak berhasil diposisikan (tangkapan mendarat di galeri produk); keabsahannya didukung hasil overflow/hydration 0 masalah. Verifikasi visual pada Preview tetap disarankan.

## E. Blocker tersisa

1. **Validasi Preview** (butuh `VERCEL_BYPASS_SECRET` di lingkungan sesi). Ini satu-satunya syarat gate yang belum terpenuhi.
2. Terbuka dari sebelumnya, bukan penghalang SEO: cakupan garansi Standard/Premium, dasar harga coret, area jemput/antar (tidak ditulis di situs); testimonial disembunyikan sampai diverifikasi.
3. `RESEND_*` tetap existing issue di luar scope.

## F. Rekomendasi

**BELUM GO — tunggu validasi Preview.** Semua acceptance criteria yang bisa diuji tanpa Preview lulus (kode, klaim, testimonial, headline, tsc, build, routing, sitemap, hydration, layout, tautan, secret scan, domain sekunder tetap terlindungi). Begitu `verify-deployment` pada Preview lulus penuh (79/79 setara) dan browser QA Preview bersih, rekomendasi berubah menjadi **GO**, dan merge ke main tetap menunggu izin eksplisit owner.

---

# FINAL PREVIEW VALIDATION — percobaan ke-2 (26 Sep 2026)

**Status: BLOCKER (lingkungan), Preview tetap belum tervalidasi.** `VERCEL_BYPASS_SECRET` **tidak terbaca** dari proses sesi ini: Bash (`len=0`) dan PowerShell (variabel tidak ada; tidak ada variabel `VERCEL*`/`BYPASS*` sama sekali). Kemungkinan variabel diset setelah Claude Code dijalankan, atau di terminal/sesi lain; proses yang sudah berjalan tidak menerima environment baru. Nilai tidak pernah dicetak/disimpan/di-commit.

- Uji dengan header bypass kosong pada alias Preview `website-sano-git-feat-seo-ssg-implementation-rigss-projects.vercel.app` → tetap **302 SSO** (wajar tanpa secret). Tidak ada konten Preview yang dapat dibaca, sehingga verify-deployment, browser QA Preview, dan verifikasi visual panel "Ulasan Pelanggan di Google" belum dijalankan. Tidak ada percobaan bypass lain dan Deployment Protection tidak diubah.
- **Butir 6 (dapat diverifikasi tanpa secret) LULUS:** `https://sano-website.vercel.app` untuk `/`, `/perbaikan-kasur-amblas`, `/sitemap.xml`, `/admin/` semuanya **302 (15 byte, redirect SSO)**, 0 konten situs bocor (tidak ada "Klinik Matras"/`<h1>` di body). Tetap protected.
- Production `sanomatrassehat.com/perbaikan-kasur-amblas` masih 404 (belum ada deploy production, sesuai).
- Tidak ada POST, tidak ada event Meta, tidak ada merge/deploy production.

**Tindakan korektif minimum (owner):** tutup lalu buka ulang VS Code/Claude Code **setelah** `VERCEL_BYPASS_SECRET` diset (User environment variable di Windows atau `$env:` di terminal yang meluncurkan Claude Code), lalu minta lanjut. Jalankan yang tertunda: `node scripts/verify-deployment.mjs --base=<alias Preview>`, browser QA Preview (`/`, `/klinik-matras`, `/perbaikan-kasur-amblas`, `/pricelist`, `/kontak`, 2 artikel, dark mode, atribusi WA), dan cek visual panel ulasan Home (tanpa testimonial/nama/foto/bintang).

**Rekomendasi: masih BELUM GO** (bukan karena kegagalan kode, tetapi karena bukti Preview belum ada). Hasil lokal pada build final tetap: tsc bersih, 19 route/19 sitemap, harness 38/38 + 24/24, verify-deployment emulator 79/79, 0 orphan/tautan rusak, secret scan bersih.

---

# FINAL PREVIEW QA — cakupan gabungan Fase 3C + 4A (07 Okt 2026)

Commit yang diuji: `4484d15` (branch `feat/seo-ssg-implementation`; `4484d15` adalah commit dokumentasi di atas `8fe0d67`, tidak mengubah kode — diff `8fe0d67..4484d15` hanya menambah `SEO_PHASE_4A_ARTICLE_SCHEMA_REPORT.md`). Working tree bersih, sesuai commit ini.

## Status Preview: BLOCKER (lingkungan) — tetap belum tervalidasi, percobaan ke-3

`VERCEL_BYPASS_SECRET` **tidak terbaca** oleh proses sesi ini, diperiksa lewat tiga jalur sekaligus:
- Bash: `${#VERCEL_BYPASS_SECRET}` = 0.
- PowerShell: `$env:VERCEL_BYPASS_SECRET` tidak ada; `[Environment]::GetEnvironmentVariable('VERCEL_BYPASS_SECRET', 'User'|'Machine'|'Process')` ketiganya `unset`.
- Pencarian file: tidak ada `.env*` selain `.env.example`; tidak ada referensi `VERCEL_BYPASS_SECRET` di berkas konfigurasi sesi.

Kesimpulan teknis: variabel ini belum pernah sampai ke proses yang menjalankan sesi Claude Code saat ini. "Tersedia di environment sesi" kemungkinan merujuk ke terminal/shell lain (mis. tempat Anda mengetik perintah), bukan ke proses yang mewarisi env untuk tool Bash/PowerShell di sesi ini — proses yang sudah berjalan tidak bisa membaca variabel yang di-set setelah ia start, dan variabel yang di-set di satu jendela terminal tidak otomatis ada di jendela/proses lain.

**Tindakan korektif yang benar-benar akan berhasil:** set `VERCEL_BYPASS_SECRET` sebagai **User environment variable Windows** (`setx VERCEL_BYPASS_SECRET "..."` di cmd, atau lewat System Properties → Environment Variables), lalu **tutup total dan buka ulang** aplikasi yang menjalankan Claude Code (bukan hanya tab/jendela terminal di dalamnya) supaya proses barunya mewarisi variabel tersebut. Alternatif: jalankan `verify-deployment.mjs` sendiri di terminal Anda yang sudah punya variabel itu, lalu tempel hasilnya ke saya untuk dimasukkan ke laporan.

Yang **tetap bisa diverifikasi tanpa secret** (GET/HEAD, tanpa cookie/bypass):
- Alias Preview `website-sano-git-feat-seo-ssg-implementation-rigss-projects.vercel.app` untuk `/`, `/perbaikan-kasur-amblas`, `/sitemap.xml`, `/admin/` → semua **302 ke SSO Vercel** (deployment hidup dan terlindungi; konsisten dengan push terakhir ke branch ini).
- Domain sekunder `sano-website.vercel.app` (`/`, `/admin/`) → **302, 263 byte** (redirect SSO), **0 konten situs bocor**. Tetap protected, tidak terpengaruh.
- Production `sanomatrassehat.com`: `/` → 200, `/sitemap.xml` → 200, `/perbaikan-kasur-amblas` → **404** (halaman baru belum ada di production — benar, karena belum ada deploy production).
- Tidak ada POST, tidak ada login CMS, tidak ada event Meta dari aktivitas verifikasi ini.

Karena itu butir 1–3 dan bagian Preview dari butir 9 (acceptance: HTTP status/canonical/metadata/H1/redirect/404/sitemap/hydration/asset/internal-link **di Preview sungguhan**) **belum bisa dinyatakan lulus**, meski seluruh bukti pengganti di bawah (build lokal + emulator yang meniru `vercel.json` yang sama persis) konsisten hijau.

## Hasil lokal final (build dari commit `4484d15`, emulator Vercel lokal, tracker diblokir)

| Area | Hasil |
|---|---|
| `tsc --noEmit` | bersih |
| `npm run build` | 19 route, 0 error, 16 peringatan (panjang title/desc, tidak berubah) |
| Sitemap | 19 URL |
| Schema audit otomatis (19 halaman) | **0 masalah** — lihat detail per-artikel di `SEO_PHASE_4A_ARTICLE_SCHEMA_REPORT.md` §Final QA |
| Testimonial lama di Home | **0 kemunculan** nama/rating/"Based on all reviews"/"Ribuan pelanggan puas" di HTML; panel "Ulasan Pelanggan di Google" + tombol "Lihat & Tulis Ulasan di Google" tampil normal |
| Browser harness desktop+mobile | route-checks **38/38**; fungsional **24/24** (hydration, dark mode, SPA nav, 404, trailing slash, atribusi WA organik/iklan, form ke mock lokal, sitemap XML) |
| `verify-deployment` (emulator lokal, meniru `vercel.json` live) | **79/79** (termasuk `/admin/` noindex, `/api/lead` GET/HEAD, aset, redirect trailing slash, sitemap) |
| Overflow/dark mode, 9 halaman × 3 mode (`/`, `/klinik-matras`, `/perbaikan-kasur-amblas`, `/pricelist`, `/kontak`, 4 artikel) | 0 overflow horizontal di semua kombinasi; 1 H1 di semua kombinasi |
| Heading hierarchy | 1 temuan **pra-eksisting, di luar scope**: artikel `klinik-matras-by-sano-care` punya H1→H3 ("Misi Sano Care") sebelum H2 pertama — bagian dari konten JSX legacy yang tidak disentuh Fase 3C/4A (bukan regresi; bukan BlokPosting/Layanan Terkait yang baru ditambahkan, keduanya sudah di H2 yang benar). Severity **LOW**, tidak diperbaiki (editorial legacy, di luar scope artikel-schema). |
| Internal link | 0 rusak, 0 orphan |
| Secret scan | 0 temuan |

## Rekomendasi (update)

**Masih BELUM GO untuk production**, semata-mata karena validasi Preview sungguhan belum bisa dijalankan (BLOCKER lingkungan, bukan kegagalan produk). Semua acceptance criteria yang *bisa* diuji tanpa akses Preview — build, routing, sitemap, hydration, layout, dark mode, tautan, atribusi WA, testimonial disembunyikan, schema BlogPosting+LocalBusiness, secret scan, perlindungan domain sekunder dan production tidak terpengaruh — **lulus semua**. Begitu `verify-deployment` berhasil dijalankan terhadap Preview sungguhan dan hasilnya sama bersihnya, rekomendasi berubah menjadi **GO untuk merge production**, dan merge tetap menunggu izin eksplisit owner.

---

# PREVIEW TECHNICAL GATE — evidence manual owner (08 Okt 2026)

## Evidence yang diterima

Owner menjalankan sendiri, di luar sesi ini (akses Vercel + `VERCEL_BYPASS_SECRET` miliknya):

```
node scripts/verify-deployment.mjs --base=https://website-sano-git-feat-seo-ssg-implementation-rigss-projects.vercel.app
```

Hasil yang dilaporkan: **79 total / 0 failed**. Branch: `feat/seo-ssg-implementation`. Yang diterima sesi ini hanya angka ringkasan (bukan log baris-per-baris); tidak ada rincian per-check yang dikirim.

## Cara angka ini divalidasi (tanpa mengarang detail yang tidak dikirim)

`scripts/verify-deployment.mjs` adalah skrip deterministik: untuk `dist-ssr/prerender-manifest.json` yang sama, ia selalu menjalankan **jumlah dan jenis check yang persis sama**. Dijalankan ulang sesi ini terhadap emulator lokal (meniru `vercel.json` yang identik) atas commit `d6c9a72` (kode = `8fe0d67`, commit setelahnya hanya dokumentasi): **hasilnya juga 79/79, 0 gagal** — cocok persis dengan laporan owner dari Preview sungguhan. Karena totalnya identik (79) dan skrip yang sama tidak punya jalur yang bisa diam-diam skip check, kecocokan jumlah ini adalah bukti kuat bahwa Preview berperilaku sama dengan yang diverifikasi lokal berkali-kali di fase-fase sebelumnya.

Pemetaan 79 check itu ke acceptance criteria (dibaca langsung dari source `scripts/verify-deployment.mjs`, bukan dugaan):

| Acceptance criteria | Check di `verify-deployment.mjs` | Status |
|---|---|---|
| Route (19 route) | kategori `route`: tiap route → 200, self-canonical, 1 H1, metadata unik, tanpa noindex (1 check/route) | **PASS** (bagian dari 79/0) |
| Canonical | termasuk dalam check `route` di atas + check `sitemap` "setiap `<loc>` dilayani 200 ... self-canonical" | **PASS** |
| Metadata | termasuk dalam check `route` ("metadata unik") | **PASS** |
| H1 | termasuk dalam check `route` ("1 H1") | **PASS** |
| Trailing slash redirect | kategori `redirect`: `{path}/ -> {path}` (301/308 langsung), tanpa loop, akhir 200 di `/klinik-matras` | **PASS** |
| Query preservation | kategori `redirect`: "query dipertahankan", "redirect + query berakhir 200 dan canonical tetap tanpa query" | **PASS** |
| 404 nyata | kategori `404`: URL tak dikenal → 404 (HTML noindex, tanpa canonical); `/url-tidak-ada/` akhirnya 404 bukan 200 | **PASS** |
| Sitemap 19 URL | kategori `sitemap`: isi = manifest (jumlah URL cocok, tanpa duplikat), semua di domain canonical, tanpa admin/api/404, tiap `<loc>` 200 self-canonical | **PASS** (19 URL, sama seperti sitemap lokal) |
| Robots | kategori `robots`: `/robots.txt` 200 memuat `Sitemap:` canonical | **PASS** |
| Admin/noindex | kategori `admin`: `/admin/` 200 HTML Decap + meta robots noindex + `X-Robots-Tag` noindex; `/admin/config.yml` 200 bukan HTML | **PASS** |
| API behavior/noindex | kategori `api`: GET `/api/lead` → 405 JSON + `Allow: POST`; HEAD → 405; `X-Robots-Tag` noindex | **PASS** (dan membuktikan **tidak ada POST** yang dikirim — skrip ini sendiri hanya GET/HEAD) |
| Asset | kategori `aset`: file upload/gambar 200 non-HTML, bundle JS content-type benar, `404.html` ada | **PASS** |

**Kesimpulan gate teknis: PASS**, berdasarkan evidence manual owner (79/0) yang jumlah dan cakupannya cocok persis dengan 79 check yang sudah berkali-kali diverifikasi identik di emulator lokal sepanjang Fase 3C dan 4A.

## Yang BELUM tercakup oleh evidence ini (spesifik, tidak dilebih-lebihkan)

`verify-deployment.mjs` **tidak** memparse konten JSON-LD maupun merender halaman secara visual — docstring-nya sendiri membatasi cakupan ke "status HTTP + canonical + H1 + metadata ... redirect ... 404 ... sitemap ... robots.txt ... admin ... api ... aset". Karena itu, masih kurang (dan **belum** bisa dinyatakan lulus dari evidence ini):

1. **BlogPosting JSON-LD 7/7 di Preview** — field headline/description/datePublished/dateModified/author/publisher/mainEntityOfPage/url/inLanguage/image-absolute belum dicek pada HTML Preview sungguhan (hanya pada build lokal, lihat `SEO_PHASE_4A_ARTICLE_SCHEMA_REPORT.md`).
2. **LocalBusiness tetap ada di Preview** — belum dicek pada HTML Preview sungguhan.
3. **Panel "Ulasan Pelanggan di Google" tampil normal + testimonial lama benar-benar tidak dirender** — ini pemeriksaan visual/konten, bukan status HTTP; belum dicek di Preview sungguhan.

Sesi ini masih tidak punya `VERCEL_BYPASS_SECRET` yang terbaca (dicek ulang: Bash `len=0`, PowerShell `$env:` kosong, `[Environment]::GetEnvironmentVariable(... 'User')` unset) — jadi ketiga poin di atas **tidak bisa saya periksa sendiri** terhadap Preview sungguhan saat ini. Tidak ada tes yang diulang dari yang sudah terbukti; hanya 3 item spesifik ini yang tersisa.

## Rekomendasi (update)

**Preview technical gate (item 2 di atas): GO**, berdasarkan evidence manual 79/0 owner + kecocokan dengan hasil lokal yang identik.

**Rekomendasi keseluruhan: GO BERSYARAT** — bukan GO penuh, karena 3 item Fase 4A di atas (JSON-LD on Preview + panel ulasan) belum terverifikasi langsung di Preview, hanya di build lokal. Risikonya rendah (build lokal dan Preview sudah terbukti identik untuk 79 check lain, dan kode JSON-LD/testimonial tidak bergantung pada environment Vercel), tapi belum 100% dikonfirmasi. Cara tercepat menutup gap ini: owner buka 2-3 halaman artikel + homepage di Preview secara manual (klik kanan → View Page Source, cari `application/ld+json` dan "Ulasan Pelanggan di Google"), atau beri saya `VERCEL_BYPASS_SECRET` yang terbaca di sesi ini. **Belum GO penuh untuk merge/deploy** sampai salah satu dari itu terjadi — dan sekalipun GO penuh tercapai, merge tetap menunggu izin eksplisit owner.

---

# STOP RELEASE — audit root cause BlogPosting hilang di Preview (08 Okt 2026, lanjutan)

Owner melaporkan dua fakta dari QA manual di browser:

**Fakta 1 (screenshot Preview, hero "Spesialis Service & Restorasi Kasur Sehat", tanpa testimonial lama, panel "Ulasan Pelanggan di Google"):** ini **sesuai ekspektasi, bukan bug**. Itu justru bukti visual bahwa perubahan Fase 3B/3C sudah benar ter-deploy ke Preview. Production (`sanomatrassehat.com`) memang **sengaja** belum menunjukkan perubahan ini — belum ada merge/deploy production sampai saat ini, persis sesuai batasan di setiap fase. Jadi Fase 3C **tidak** "belum live" secara tidak sengaja; itu memang belum di-merge atas instruksi berulang "jangan merge/deploy production".

**Fakta 2 (View Page Source 2-3 artikel di Preview, JSON-LD `BlogPosting` tidak ditemukan):** ini **temuan nyata** yang perlu diaudit. Detail audit root cause ada di bawah dan di `SEO_PHASE_4A_ARTICLE_SCHEMA_REPORT.md`.

## Audit root cause (ringkasan; rinci di laporan 4A)

1. **Kode & SSR pipeline: tidak ada bug.** `pages/ArtikelDetail.tsx` membangun objek `BlogPosting` dan merendernya sebagai `<script type="application/ld+json">` di dalam JSX artikel (bukan di `<head>` lewat `useSEO`), jadi ia ikut dirender server-side oleh `entry-server.tsx` (`renderToPipeableStream`, API SSR standar React — tidak ada langkah yang menghapus tag `<script>` dari output). `scripts/prerender.mjs` tidak melakukan sanitasi/strip apa pun terhadap body HTML. Dibuktikan langsung (bukan diasumsikan): file statis `dist/artikel/<slug>/index.html` hasil `npm run build` dibaca lewat Node **di luar browser, tanpa hydration/JS apa pun** — JSON-LD **ada** di RAW HTML untuk **7/7 artikel**, tervalidasi ulang barusan dengan skrip baru `scripts/verify-article-schema.mjs` (105/105 check lulus terhadap build lokal). Ini menutup kemungkinan "hanya client-rendered" — buktinya justru sebaliknya: tag ini murni hasil prerender statis, bahkan sebelum React/hydration jalan sama sekali.
2. **Ancestry commit: tidak ada masalah.** `git merge-base --is-ancestor 8fe0d67 HEAD` = true. `8fe0d67` (commit yang menambahkan BlogPosting) adalah **satu-satunya** commit di rentang ini yang menyentuh `pages/ArtikelDetail.tsx`/`utils/content.ts`/`public/admin/config.yml`, dan ia ada di riwayat setiap commit sesudahnya termasuk `d6c9a72` yang disebut owner.
3. **Kesimpulan**: gap antara "lokal 7/7 PASS" dan "Preview tidak ditemukan" **bukan bug kode**, melainkan **artifact Preview yang dilihat owner belum/tidak mencerminkan build dari commit `8fe0d67` atau setelahnya** — dua kemungkinan paling masuk akal (tidak bisa dipastikan 100% dari sesi ini karena tidak ada akses dashboard Vercel):
   - **(a) Deployment Preview yang di-alias ke URL itu memang lebih lama** dari `8fe0d67` (mis. Preview terakhir yang berhasil ter-build berhenti di sekitar commit `b53214d`/gate Fase 3C, dan build untuk commit-commit sesudahnya -- termasuk `8fe0d67` -- entah gagal, entah di-skip oleh suatu kondisi di sisi Vercel yang tidak terlihat dari sesi ini).
   - **(b) Cache browser/CDN** menyajikan HTML lama untuk tab yang sudah dibuka owner sebelum build terbaru selesai (View Page Source bisa mengambil dari cache HTTP browser, bukan selalu fetch baru).
   Kedua kemungkinan ini **tidak memerlukan perubahan kode** -- source sudah benar dan terbukti ada di artifact build.

## Apakah laporan lokal sebelumnya salah?

**Tidak salah, hanya scope artifact yang berbeda, dan ini sudah ditandai eksplisit.** Baca ulang laporan 4A §"FINAL QA" dan bagian "PREVIEW TECHNICAL GATE" sebelumnya: klaim "BlogPosting 7/7" selalu ditulis dengan embel-embel "dari HTML prerender" / "build lokal", dan di bagian sesudahnya saya eksplisit menulis "Validasi terhadap Vercel Preview **sungguhan** ... masih **BLOCKER**" serta meminta owner cek manual persis dengan cara yang kemudian dilakukan (View Page Source) -- justru untuk menutup gap ini. Temuan owner **mengonfirmasi** gap yang sudah saya tandai sebelumnya, bukan membantahnya.

## Tindakan yang diambil

- **Tidak ada perubahan kode fungsional** (karena tidak ada bug untuk diperbaiki -- lihat §1 di atas). Satu komentar dokumentasi ditambahkan di `pages/ArtikelDetail.tsx` (menjelaskan hasil audit; tidak mengubah output HTML).
- **Skrip baru `scripts/verify-article-schema.mjs`** ditambahkan: memvalidasi `BlogPosting` + `LocalBusiness` langsung dari HTML mentah (fetch GET biasa, tanpa browser/JS) untuk ke-7 artikel sekaligus, dengan 15 pemeriksaan per artikel. Ini alat yang seharusnya dipakai owner (bukan saya menebak) untuk memastikan Preview sungguhan sudah benar -- lihat perintah di bawah.
- **Commit baru di-push** (`785dc68`) ke `feat/seo-ssg-implementation` untuk memaksa Vercel membuat deployment Preview baru (build fresh), menghilangkan kemungkinan (a) di atas untuk build selanjutnya.
- Regresi penuh dijalankan ulang terhadap build ini (lihat §hasil test di bawah): semuanya hijau.

## Hasil test (build dari commit `785dc68`)

| Uji | Hasil |
|---|---|
| `tsc --noEmit` | bersih |
| `npm run build` | 19 route, 0 error |
| Sitemap | 19 URL |
| Schema audit (19 halaman, LocalBusiness + BlogPosting) | 0 masalah |
| **`scripts/verify-article-schema.mjs` (baru, 7 artikel × 15 check)** | **105/105 lulus** |
| `scripts/verify-deployment.mjs` (emulator lokal) | 79/79 |
| Browser harness desktop+mobile | 38/38 route-checks; 24/24 fungsional |
| Internal link | 0 rusak, 0 orphan |
| Secret scan | 0 temuan |

## Cara owner memverifikasi Preview baru (read-only, GET saja, tanpa POST/login CMS/event Meta)

1. **Pastikan deployment baru sudah selesai build** di Vercel dashboard untuk commit `785dc68` pada branch `feat/seo-ssg-implementation` (tunggu status "Ready"), lalu catat/cocokkan SHA commit yang tertera di situ.
2. Di PowerShell (dari folder repo, dengan secret yang **sudah divalidasi Anda sendiri bekerja** -- lihat §"generate ulang" sebelumnya kalau perlu):

```powershell
$env:VERCEL_BYPASS_SECRET = "<secret Anda>"
node scripts/verify-article-schema.mjs --base=https://website-sano-git-feat-seo-ssg-implementation-rigss-projects.vercel.app
```

3. Harapannya: `RINGKASAN ...: 105/105 lulus, 0 gagal`. Kalau masih ada yang `FAIL`, skrip mencetak kategori (slug artikel) dan detail field yang gagal -- kirim outputnya ke saya, itu akan jadi bukti definitif (bukan tebakan) untuk audit lanjutan.
4. (Opsional, silang-cek manual) Buka salah satu artikel di Preview dengan **hard refresh** (Ctrl+Shift+R) atau tab Incognito baru sebelum View Page Source, untuk menyingkirkan kemungkinan cache browser lama.

## Status & rekomendasi

**NO-GO tetap berlaku** sampai butir di atas dikonfirmasi lulus terhadap deployment Preview yang baru. Tidak ada merge ke main, tidak ada deploy production, tidak ada perubahan API lead, tidak ada perubahan desain/copy lain di luar yang disebutkan.
