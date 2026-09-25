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
