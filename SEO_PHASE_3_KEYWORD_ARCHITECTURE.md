# SEO_PHASE_3_KEYWORD_ARCHITECTURE — Strategi keyword & arsitektur halaman transaksional

Tanggal: 2026-09-24 · Situs: https://sanomatrassehat.com · Repo: `gilang2xx/website-sano` (konten = `main` @ `2c24cc8`)
Sifat dokumen: **audit dan perencanaan saja.** Tidak ada perubahan kode, konten, Vercel, CMS, atau API lead. Tidak ada merge/push ke `main`, tidak ada deployment production (dokumen disimpan di branch kerja `feat/seo-ssg-implementation`).

## Cara membaca label data

| Label | Arti |
|---|---|
| **[TERVERIFIKASI-KODE]** | Diukur langsung dari source/HTML hasil build (18 route) — bukan dugaan |
| **[LAPORAN-OWNER]** | Dinyatakan owner, belum saya verifikasi (mis. status indeks di Search Console) |
| **[HIPOTESIS]** | Asumsi strategi keyword/intent. **Bukan data performa** |
| **NOT AVAILABLE** | Data tidak tersedia bagi saya: kueri/impresi/klik/posisi GSC, volume keyword, ranking kompetitor, review Google |

**Tidak ada** angka volume, ranking, traffic, review, atau data kompetitor di dokumen ini. Semua prioritas keyword bersifat hipotesis sampai data GSC dan Google Ads diberikan (§8).

---

## 1. Executive summary

**Kesimpulan utama.** Secara teknis situs sudah siap (SSG, canonical, sitemap 18 URL, 404, redirect). Masalahnya sekarang **konten komersialnya belum menargetkan keyword transaksional**:

1. **Keyword transaksional utama hampir tidak ada di isi halaman [TERVERIFIKASI-KODE]:** "service kasur" 0×, "servis kasur" 0×, "service springbed" 0× ("springbed" 1× di seluruh situs), "perbaikan kasur" 0×, "cuci kasur" 0× di isi (hanya di title beranda), "reparasi" 1×, "kasur amblas" 4×. Bandingkan dengan "upgrade" 41×, "restorasi" 23×, "matras sehat" 43×, "kasur sehat" 28×.
2. **H1 beranda adalah kalimat keluhan** ("Bangun Tidur Bukannya Segar, Malah Sakit Semua?…"), bukan pernyataan layanan. H1 halaman komersial lain generik: "Layanan Kami", "Pricelist", "Layanan Klinik Matras".
3. **Halaman komersial tipis:** `/layanan` 111 kata, `/pricelist` 105, `/klinik-sofa` 78, `/sano-clean` 78, `/kontak` 80, `/klinik-matras` 264 kata (16 kartu berdeskripsi satu kalimat, 0 H2). Hampir tidak ada link internal kontekstual: halaman layanan **0** link internal di isi; tiap artikel hanya menaut "Kembali ke Daftar".
4. **Vocabulary tidak sinkron dengan cara orang mencari [HIPOTESIS]:** halaman komersial memakai "matras" hampir sama banyak dengan "kasur" (beranda 18:14, `/klinik-matras` 10:9), sementara pencari umumnya menulis "kasur/springbed" — lihat catatan brand di §4.

**Rekomendasi inti (disingkat).**

| # | Rekomendasi | Alasan |
|---|---|---|
| 1 | **Jangan membuat halaman terpisah untuk "service / servis / reparasi / springbed / per kota".** Semuanya satu intent; jadikan **`/klinik-matras`** (sudah terindeks [LAPORAN-OWNER]) sebagai halaman utama "Service Kasur & Springbed" | Menghindari kanibalisasi dan halaman tipis/doorway |
| 2 | **Reposisi beranda** dari "keluhan" ke "spesialis diagnosis, perbaikan, restorasi, penguatan fondasi, dan upgrade kasur sehat" (cuci kasur tetap pendukung lewat Sano Clean) | Sesuai positioning brand; beranda sudah terindeks jadi risiko rendah bila dilakukan hati-hati |
| 3 | **Satu halaman baru bernilai tinggi: `/perbaikan-kasur-amblas`** (intent masalah→solusi yang berbeda dari katalog layanan) | Keluhan utama pelanggan; satu-satunya intent yang layak URL sendiri sejak awal |
| 4 | **Optimasi `/pricelist` (harga) dan `/kontak` (Local SEO)**; bangun internal linking (artikel→layanan, beranda→layanan/harga/bukti) | Dampak besar, biaya rendah, tanpa URL baru |
| 5 | **`/upgrade-kasur` bersyarat data GSC** (jangan dibuat dulu) | Berisiko tumpang tindih dengan `/klinik-matras` dan `/pricelist` |
| 6 | **Local SEO: tanpa halaman per kota.** Wilayah layanan di luar alamat workshop (Depok) **belum terkonfirmasi** | Aturan tugas: tidak mengarang wilayah/cabang; fokus pada Google Business Profile dan halaman `/kontak` |
| 7 | **Moderasi klaim kesehatan dan garansi** sebelum memperluas konten (sudah ada klaim "Saraf Kejepit (HNP)", "Garansi 20 Tahun", "teknisi 10+ tahun" tanpa bukti/ketentuan di halaman) | Risiko YMYL/kepercayaan; halaman baru tidak boleh menambah klaim tanpa dasar |

**Yang dibutuhkan sebelum implementasi:** data GSC (kueri/halaman 28 hari), Search terms Google Ads, dan konfirmasi owner atas wilayah layanan, harga, garansi, bukti (§8).

---

## 2. Audit struktur dan konten website existing

### 2.1 Sumber data
Route manifest + sitemap: **18 URL** (11 halaman statis, 6 artikel lama, 1 artikel CMS). HTML hasil prerender diaudit; nav/footer dikeluarkan dari hitungan keyword. Status indeks: beranda dan `/klinik-matras` terindeks (crawl terakhir sebelum rilis SEO) dan sitemap diproses **[LAPORAN-OWNER]**; artikel masih diproses **[LAPORAN-OWNER]**; halaman lain **NOT AVAILABLE**.

### 2.2 Inventaris halaman [TERVERIFIKASI-KODE]

| Route | Kata (isi) | H1 | H2 / H3 | Link internal di isi | CTA WhatsApp | Catatan |
|---|---|---|---|---|---|---|
| `/` | 780 | "Bangun Tidur Bukannya Segar, Malah Sakit Semua?…" | 8 / 20 | 9 (3 kartu gejala **semuanya** ke `/artikel/dampak-kasur-rusak`; 1 ke `/klinik-matras`) | 3 | 3 gambar tanpa alt |
| `/layanan` | 111 | "Layanan Kami" | 1 / 2 | 0 | 2 | Hub tipis, tumpang tindih peran dengan `/klinik-matras` |
| `/klinik-matras` | 264 | "Layanan Klinik Matras" | **0** / 16 | 0 | 1 | 16 layanan, deskripsi 1 kalimat; "Best Seller" |
| `/pricelist` | 105 | "Pricelist" | 0 / 4 | 0 | 4 | 3 paket berharga (Rp 990.000 / 1.490.000 / 2.390.000); tanpa dasar harga |
| `/klinik-sofa` | 78 | "Klinik Sofa" | 2 / 1 | 0 | 3 | Tipis |
| `/sano-clean` | 78 | "Sano Clean" | 2 / 1 | 0 | 3 | Tipis; "cuci kasur" 0× di isi |
| `/tentang-kami` | 427 | "Tentang Kami" | 2 / 11 | 0 | 0 | Klaim pengalaman/garansi |
| `/before-after` | 208 | "Galeri Transformasi" | 0 / 10 | 0 | 0 | 10 kasus (gambar), tanpa teks per kasus |
| `/kontak` | 80 | "Hubungi Kami" | 2 / 0 | 0 | 0 | Form + peta; NAP; hanya 1 nomor tampil |
| `/artikel` | 259 | "Artikel & Edukasi" | 0 / 7 | 7 | 0 | Daftar |
| 6 artikel lama | 221–625 | = judul artikel | 2–4 | 1 ("Kembali ke Daftar") | 1–2 | Deskripsi meta dua artikel **tertukar** |
| Artikel CMS "Panduan Lengkap Kasur Sehat" | 2 448 | = judul | 15 / 10 | 1 | 1 | Pilar informasional "kasur sehat" |

### 2.3 Metadata [TERVERIFIKASI-KODE]
- **Title:** 16 dari 17 title publik >60 karakter (beranda 95 karakter karena suffix brand ganda; artikel 102–122). Title beranda: "…Servis, Upgrade & Cuci Kasur di Depok" (frasa "service kasur" tidak utuh); `/klinik-matras`: "Layanan Klinik Matras — Service, Upgrade & Custom Kasur".
- **Description:** beranda 198 dan `/klinik-matras` 163 karakter (>160). Artikel `klinik-matras-by-sano-care` memakai deskripsi "Dampak kasur amblas…", sedangkan `dampak-kasur-rusak` memakai "Klinik Matras… Hadir untuk Menolong…" → **tertukar** (dua artikel).
- **Peta di `/kontak`:** embed Google Maps merujuk place "KLINIK MATRAS by SANO CARE" (ada feature ID) — indikasi listing Maps ada, **belum diverifikasi**; atribut iframe `title="Map Location"` generik.

### 2.4 Internal linking [TERVERIFIKASI-KODE]
- Halaman layanan (`/layanan`, `/klinik-matras`, `/pricelist`, `/klinik-sofa`, `/sano-clean`, `/kontak`, `/tentang-kami`, `/before-after`): **0 link internal di isi** — hanya nav/footer.
- Footer memiliki 7 label layanan ("Service Fondasi Matras", "Upgrade Fondasi", dst.) yang **semuanya menuju 2 URL** (`/klinik-matras`, `/klinik-sofa`).
- Artikel tidak menaut ke halaman layanan/harga (hanya tombol WA). Beranda menaut ke `/klinik-matras` sekali di isi dan **tidak** ke `/pricelist` maupun `/before-after` dari isi.
- Akibat: tidak ada klaster topikal, sinyal anchor komersial lemah, artikel yatim dari sisi konversi.

### 2.5 CTA [TERVERIFIKASI-KODE]
Konversi utama = **WhatsApp** (`buildWaHref`, tag atribusi iklan tersembunyi) dan form `/kontak` (`/api/lead`). Teks CTA beragam ("Konsultasi Gratis", "Chat WhatsApp Sekarang", "Diagnosa Gratis", "Cek Kondisi Kasur Saya"). Nomor: JSON-LD dan tautan WA memakai **0851 8728 3900 (CS 2)**; footer menampilkan CS 1 dan CS 2; `/kontak` hanya CS 2. Belum ada CTA "kirim foto kasur untuk estimasi" di halaman layanan meskipun beranda menyebut langkah "Chat kami & kirim foto".

### 2.6 Klaim yang perlu bukti/moderasi [TERVERIFIKASI-KODE: teks ada; **kebenarannya bukan penilaian saya**]

| Jenis | Teks di situs | Risiko | Tindakan yang disarankan |
|---|---|---|---|
| **Kesehatan** | Kartu beranda "Saraf Kejepit (HNP)" ("BAHAYA! Nyeri menjalar parah"), "Cek ke Dokter? Dokter mengobati gejala tubuh, tapi apakah penyebab utamanya (tempat tidur) diperbaiki?", "(Khusus kasus Saraf Kejepit / Sakit Punggung)" pada paket, judul artikel "Awas! Kasur Anda Mungkin Sedang Merusak Tulang Belakang", "Terapi Tidur" | Klaim sebab-akibat medis tanpa referensi (YMYL); dapat dinilai menyesatkan | Ubah ke bahasa non-kausal ("dapat memengaruhi kenyamanan tidur"), tambah disclaimer "bukan pengganti diagnosis medis" (artikel CMS baru sudah punya), tambahkan referensi atau hapus; **jangan menambah klaim baru di halaman baru** |
| **Garansi** | "Garansi Ketahanan (Amblas) 10 Tahun / 20 Tahun", "Garansi Busa 5/10 Tahun", "Fondasi Standar 20 Tahun", "Bergaransi Resmi" | Klaim berbobot tanpa syarat & ketentuan di halaman | Tampilkan hanya bila S&K resmi dari owner; tautkan ke halaman/bagian syarat |
| **Pengalaman** | "Teknisi berpengalaman lebih dari 10 tahun" (juga di meta) | Perlu bukti (E-E-A-T) | Sertakan profil/kredensial atau ubah menjadi klaim yang bisa dibuktikan |
| **Alergi/kebersihan** | "Cocok untuk penderita alergi", latex "anti-alergi", "membasmi tungau" | Klaim kesehatan produk | Batasi pada deskripsi teknis metode/material, tanpa janji hasil kesehatan |
| **Review** | Rating "5.0" dan testimoni hard-coded di beranda | Tidak tertaut ke sumber; tidak boleh dijadikan `aggregateRating` | Tautkan ke Google review asli atau hapus angka statis |

---

## 3. Keyword map

**Seluruh baris = HIPOTESIS.** Volume dan kesulitan: **NOT AVAILABLE**. "Cakupan saat ini" = fakta dari kode (mention di isi/title). Prioritas: P0 = minggu 1–2, P1 = minggu 3–5, P2 = minggu 6–8, P3 = setelah data GSC.

### 3.1 Cakupan keyword yang diminta saat ini [TERVERIFIKASI-KODE]

| Keyword | Cakupan saat ini |
|---|---|
| service kasur / servis kasur | **Tidak ditargetkan.** 0× di isi. Hanya kata "Servis"/"Service" terpisah di title beranda dan `/klinik-matras` |
| service springbed | **Tidak ditargetkan.** "springbed" 1× (`/layanan`) |
| perbaikan kasur amblas | **Tidak ada halaman.** "kasur amblas" 4× (artikel, meta artikel `klinik-matras-by-sano-care`); "perbaikan kasur" 0× |
| reparasi kasur | 1× ("Reparasi rangka kayu divan", `/klinik-matras`) |
| restorasi kasur | 23× total (beranda 4–5×); belum di title/H1 halaman kasur mana pun ("Restorasi" hanya di meta `/klinik-sofa`) |
| upgrade kasur | 41× total; ada di title beranda dan `/klinik-matras`, katalog 10+ layanan, `/pricelist` — **relatif tercakup** |
| klinik matras | 26× (brand); di title beranda ✓ |
| kasur sehat / matras sehat | 28× / 43×; pilar artikel baru + 3 artikel + bagian beranda |

### 3.2 Peta keyword → halaman

| Keyword utama | Search intent | Halaman target | Status halaman | Keyword pendukung | CTA utama | Prioritas | Alasan pemetaan |
|---|---|---|---|---|---|---|---|
| klinik matras / klinik matras sano | Navigasional (brand) | `/` | Existing — **perlu optimasi** | sano care, klinik matras depok | Konsultasi gratis (WA) | **P0** | Brand sudah terindeks; pertahankan sebagai halaman brand + ringkasan layanan |
| service kasur, servis kasur, jasa service kasur | Komersial/transaksional | **`/klinik-matras`** (dioptimasi menjadi "Service Kasur & Springbed") | Existing — **perlu optimasi berat** | perbaikan kasur, restorasi kasur, ganti busa kasur, penguatan fondasi | Kirim foto kasur + konsultasi (WA) | **P0** | Sudah terindeks dan memuat katalog; menambah URL hanya untuk variasi ejaan = kanibalisasi |
| service springbed, servis springbed, perbaikan springbed | Komersial | `/klinik-matras` (bagian + FAQ "Springbed") | Existing — **perlu optimasi** (bagian baru) | springbed pegas, bonnel/pocket spring (bila layanan mencakup) | WA | P1 | Intent sama dengan "service kasur" pada jenis kasur tertentu; bukan halaman sendiri |
| perbaikan kasur amblas, kasur amblas diperbaiki, service kasur amblas | Komersial (masalah→solusi) dengan sisi informasional | **`/perbaikan-kasur-amblas`** (baru) | **Perlu dibuat** | kasur bergelombang, kasur miring, busa kempes, ganti busa kasur | "Kirim foto kasur untuk estimasi" (WA) | **P1** | Keluhan utama pelanggan; intent masalah spesifik berbeda dari katalog; layak URL sendiri |
| reparasi kasur, reparasi springbed | Komersial (varian) | `/klinik-matras` (satu penyebutan natural di H2/FAQ) | Existing — varian | reparasi divan | WA | P2 | Varian kata; tidak layak halaman |
| restorasi kasur | Komersial/pembeda brand | `/klinik-matras` + `/` | Existing — perlu optimasi | restorasi fondasi, restorasi lapisan | WA | P1 | Istilah pembeda Sano ("restorasi") sudah dominan di konten |
| upgrade kasur, upgrade kasur springbed, tambah lapisan latex / memory foam | Komersial | `/klinik-matras` (katalog) + `/pricelist` (paket); **`/upgrade-kasur` bersyarat** | Existing — cukup; halaman baru **bersyarat data** | latex, memory foam, rebonded, ubah tekstur | WA | P2 → P3 (data) | Mudah tumpang tindih dengan dua halaman existing |
| harga service kasur, biaya service kasur, harga upgrade kasur | Komersial (harga) | `/pricelist` | Existing — **perlu optimasi** | estimasi biaya, paket fondasi | WA "Minta estimasi" | **P1** | H1 saat ini "Pricelist" (tanpa keyword), 105 kata, tanpa dasar harga |
| service kasur Depok, servis kasur Depok | Lokal komersial | `/klinik-matras` (title/H1 memuat Depok) + `/kontak` + Google Business Profile | Existing — perlu optimasi | workshop Depok, Pancoran Mas | Telepon/WA, petunjuk arah | **P1** | Alamat workshop terverifikasi; **tanpa** halaman per kota |
| service kasur panggilan / jasa jemput kasur | Komersial (logistik) | `/klinik-matras` bagian "Cara kerja" | Existing — perlu bagian baru | jemput antar kasur | WA | P2 (**tunggu konfirmasi area**) | Situs menyebut "Jemput/Antar" tetapi **area belum terkonfirmasi** |
| kasur sehat, cara memilih kasur, apa itu kasur sehat | Informasional | `/artikel/panduan-lengkap-kasur-sehat-…` (pilar) | Existing | matras sehat, kasur pas, fondasi dan lapisan | Cek kondisi kasur (WA) | P0 (tautan) | Artikel pilar baru (2 448 kata) |
| matras sehat, konsep matras sehat | Informasional/brand | `/artikel/konsep-matras-sehat` + bagian beranda | Existing — **risiko kanibalisasi** dengan pilar | konsep SANO | WA | P1 (diferensiasi) | Lihat §7 |
| kasur orthopedic vs kasur sehat | Informasional | `/artikel/kasur-ortopedik-untuk-tidur-sehat` | Existing | perbedaan kasur ortopedik | WA | P3 | Sudah ada; moderasi klaim kesehatan |
| cuci kasur, cuci matras, deep cleaning kasur | Komersial (bukan inti positioning) | `/sano-clean` | Existing — perlu optimasi ringan | sterilisasi tungau | Booking (WA) | P3 | Sano Clean = layanan pendukung |
| service sofa | Komersial (di luar daftar) | `/klinik-sofa` | Existing — tipis | custom sofa | WA | P3 | Di luar lingkup permintaan, dicatat karena tipis |
| kasur amblas penyebab / cara memperbaiki (informasional) | Informasional | **Belum dibuat**; putuskan setelah data | Bersyarat | penyebab, cara memeriksa | — | P3 (data) | Risiko kanibalisasi dengan `/perbaikan-kasur-amblas` |

---

## 4. Rekomendasi halaman existing yang perlu dioptimasi

**Catatan brand/istilah.** Pertahankan "Klinik Matras", "Matras Sehat", "Sano Clean" sebagai nama brand/produk. Untuk **teks layanan (title, H1, H2, anchor)** gunakan "kasur" dan "springbed" sebagai istilah utama, dengan "matras" sebagai istilah pendamping/teknis — [HIPOTESIS: pencari umumnya menulis "kasur/springbed"; validasi dengan kueri GSC]. Pakai "service" dan "servis" secara natural di satu halaman (mis. title "Service…", H2/FAQ "servis…"), bukan di dua halaman.

| Halaman | Masalah terverifikasi | Rekomendasi | Prioritas |
|---|---|---|---|
| **`/` Beranda** | H1 keluhan; title 95 karakter; 3 kartu gejala menaut URL yang sama; hanya 1 link ke `/klinik-matras`; tidak menaut `/pricelist`, `/before-after`; klaim kesehatan/garansi | H1 = pernyataan layanan + brand (mis. pola "Service & Restorasi Kasur Sehat di Depok"), keluhan dijadikan sub-headline; title ≤60 karakter, description 150–160; blok ringkasan layanan (Diagnosis → Perbaikan fondasi → Restorasi → Upgrade) dengan link ke `/klinik-matras`, `/perbaikan-kasur-amblas`, `/pricelist`, `/before-after`; kartu gejala menaut ke halaman relevan (amblas → halaman baru); moderasi klaim (§2.6); "Cuci" tidak di depan title | **P0** |
| **`/klinik-matras`** | 0 H2; deskripsi 1 kalimat; 0 link internal; keyword transaksional 0× | Jadikan **hub "Service Kasur & Springbed"**: H1 dengan "Service Kasur & Springbed"; H2: masalah yang ditangani, layanan (dikelompokkan: Perbaikan & Restorasi / Upgrade / Ukuran & Custom / Perawatan), cara kerja (jemput→diagnosis→pengerjaan→antar), harga (link), bukti (link before-after), FAQ (springbed, durasi, jemput — hanya yang terkonfirmasi), CTA foto-kasur; heading H3 per layanan tetap | **P0** |
| **`/pricelist`** | H1 "Pricelist"; 105 kata; harga tanpa dasar | H1 "Harga Service & Upgrade Kasur"; jelaskan dasar harga (ukuran/kondisi), isi paket, catatan "estimasi", link syarat garansi (bila ada), FAQ harga, CTA estimasi — **hanya angka yang dikonfirmasi owner** | **P1** |
| **`/kontak`** | 80 kata; 1 nomor; title iframe generik | Blok Local SEO: NAP konsisten dengan GBP, jam, petunjuk arah/patokan (dari owner), area layanan (terkonfirmasi), link ke layanan; `title` iframe deskriptif; tetap form | **P1** |
| **`/layanan`** | 111 kata; peran tumpang tindih dengan `/klinik-matras` | Pertahankan sebagai **hub navigasi** (bukan target keyword): 3 kartu ke `/klinik-matras`, `/klinik-sofa`, `/sano-clean` dengan deskripsi peran; title generik "Semua Layanan…" | P1 |
| **`/before-after`** | Gambar tanpa teks per kasus | Keterangan per kasus (masalah, tindakan, hasil, ukuran kasur) **dengan izin pelanggan**; tautan ke halaman layanan terkait | P2 |
| **`/tentang-kami`** | Klaim pengalaman/garansi tanpa bukti | Profil/kredensial, foto workshop/tim, S&K garansi | P2 |
| **`/sano-clean`, `/klinik-sofa`** | 78 kata masing-masing | Perluas moderat (proses, bahan/metode, FAQ, CTA); pertahankan Sano Clean sebagai pendukung | P3 |
| **Artikel lama (6)** | Deskripsi tertukar (2 artikel); title 102–122 karakter; hanya "Kembali ke Daftar" | Perbaiki deskripsi, persingkat title, tambah 2–3 link kontekstual ke `/klinik-matras`, `/perbaikan-kasur-amblas`, `/pricelist`, dan artikel pilar; moderasi klaim | **P0** (deskripsi+link) |
| **Artikel pilar "kasur sehat"** | Hanya link "Kembali" | Link ke layanan (bagian "Kapan kasur perlu diperbaiki…" → halaman perbaikan/service) dan ke artikel `konsep-matras-sehat` (diferensiasi) | P0 |
| **Footer/nav** | 7 label layanan → 2 URL | Setelah halaman baru ada, arahkan anchor ke URL yang sesuai | P1 |

---

## 5. Rekomendasi halaman baru

**Prinsip:** halaman baru hanya bila intent-nya berbeda **dan** ada konten/bukti unik. Semua keputusan di bawah bersifat hipotesis sampai data GSC ada.

### 5.1 `/perbaikan-kasur-amblas` — **DIREKOMENDASIKAN (P1)**

| Aspek | Rincian |
|---|---|
| **Butuh halaman sendiri?** | **Ya.** Intent "masalah spesifik → perbaikan" berbeda dari katalog `/klinik-matras`; keluhan paling dekat dengan positioning (diagnosis + penguatan fondasi) |
| **Target & intent** | perbaikan kasur amblas, kasur amblas, service kasur amblas — komersial dengan sisi edukasi. Pendukung: kasur bergelombang, kasur miring, busa kempes (hanya bila layanan mencakup) |
| **H1 (usulan)** | "Perbaikan Kasur Amblas: Diagnosis, Penguatan Fondasi & Restorasi" (tambahkan "di Depok" hanya setelah wilayah dikonfirmasi) |
| **Outline** | H2 Ciri kasur amblas · H2 Apa yang menyebabkannya (fondasi/per, lapisan busa, kain — sesuai standar Sano; "penurunan fondasi maks ±1 cm" sudah ada di artikel) · H2 Cara kami mendiagnosis · H2 Pilihan penanganan (Service Fondasi / Upgrade Fondasi / Full Upgrade — harga hanya setelah konfirmasi) · H2 Proses & durasi · H2 Bukti (before-after kasus amblas) · H2 Kapan sebaiknya kasur diganti (jujur) · H2 FAQ · CTA |
| **Konten & bukti yang dibutuhkan** | Foto before-after dengan izin (kasus "kasur bergelombang, amblas" sudah ada di galeri), penjelasan teknis dari teknisi, durasi pengerjaan, dasar harga, S&K garansi resmi, kredensial teknisi |
| **Link masuk** | Kartu gejala beranda; `/klinik-matras` (kartu Service/Upgrade Fondasi); `/pricelist`; `/before-after` (kasus amblas); artikel `dampak-kasur-rusak`, `klinik-matras-by-sano-care`, pilar kasur sehat; footer |
| **Link keluar** | `/pricelist`, `/klinik-matras`, `/before-after`, `/kontak`, artikel `mengenal-struktur-kasur` dan pilar |
| **CTA** | WA dengan pesan awal khusus ("kasur saya amblas…") dan ajakan **kirim foto kasur untuk estimasi**; atribusi iklan tetap dipertahankan |
| **Guardrail** | Tidak ada klaim bahwa kasur amblas menyebabkan kondisi medis tertentu; bahasa non-kausal + disclaimer; tanpa `aggregateRating`/review buatan |

### 5.2 `/upgrade-kasur` — **BERSYARAT (P3, keputusan setelah data)**

| Aspek | Rincian |
|---|---|
| **Butuh halaman sendiri?** | **Belum.** Konten upgrade sudah ada di `/klinik-matras` (katalog) dan `/pricelist` (paket). Buat hanya jika GSC menunjukkan kueri "upgrade kasur/ganti busa/latex/memory foam" **dan** ada konten unik |
| **Bila dibuat** | Intent: "kasur saya masih layak, ingin lebih nyaman/sehat". H1 "Upgrade Kasur: Fondasi, Lapisan Latex & Memory Foam". Outline: kapan upgrade tepat; opsi fondasi vs lapisan; latex vs memory foam vs rebonded (fungsi, bukan klaim medis); ketebalan busa menurut berat badan (formulasi Sano; nyatakan "bukan standar universal" seperti di artikel); paket & harga; before-after; FAQ. Link masuk dari `/klinik-matras`, `/pricelist`, artikel pilar; keluar ke `/pricelist`, `/kontak` |
| **Risiko** | Tumpang tindih dengan `/klinik-matras` dan `/pricelist` (§7) |

### 5.3 Halaman yang **tidak** direkomendasikan

| Usulan | Keputusan | Alasan |
|---|---|---|
| `/service-kasur`, `/servis-kasur`, `/reparasi-kasur` | **Jangan dibuat** | Intent identik dengan `/klinik-matras`; hanya beda ejaan → kanibalisasi + konten tipis |
| `/service-springbed` | **Jangan dibuat sekarang** | Bagian + FAQ di `/klinik-matras`. Tinjau lagi hanya bila GSC menunjukkan kueri springbed berbeda dan ada konten unik (mis. jenis pegas yang benar-benar dilayani) |
| Halaman per merek springbed (King Koil, Serta, Lady Americana, Florence, Elite, Spring Air — logo tampil di beranda) | **Jangan dibuat** | Doorway/konten tipis dan risiko klaim merek; cukup satu bagian "merek yang bisa diservis" **bila terkonfirmasi** |
| `/service-kasur-depok` atau halaman per kota | **Jangan dibuat** | Doorway pages; wilayah selain alamat workshop belum terkonfirmasi. Local SEO ditangani `/kontak` + Google Business Profile |
| `/area-layanan` | **Bersyarat** | Hanya jika owner mengonfirmasi ≥2 area layanan nyata dengan informasi logistik berbeda (ongkos/jadwal jemput) — bukan daftar kota generik |
| Halaman per kasus before-after | **Tidak sekarang** | Cukup keterangan per kasus di galeri; pertimbangkan bila kasus banyak dan ditulis substantif |

### 5.4 Konten pendukung (artikel) — opsional, setelah halaman inti

| Usulan artikel | Intent | Catatan kanibalisasi |
|---|---|---|
| "Kapan kasur perlu diperbaiki, di-upgrade, atau diganti?" | Investigasi komersial | Sudah ada sebagai **bagian** di artikel pilar; pisahkan hanya bila data menunjukkan permintaan; wajib menaut ke halaman layanan |
| "Bonnel vs pocket spring: mana yang lebih mudah diperbaiki?" | Informasional untuk springbed | Menutup celah "springbed" tanpa halaman tipis; hanya bila layanan mencakup |
| "Faktor yang memengaruhi biaya service kasur" | Informasional-komersial | Jangan menduplikasi `/pricelist`; tunggu kebijakan harga |
| "Penyebab kasur amblas" | Informasional | **Tunda** sampai `/perbaikan-kasur-amblas` live dan ada data; risiko bersaing dengannya |

---

## 6. Prioritas pengerjaan dan estimasi timeline

Estimasi **hari kerja** (asumsi satu developer + satu penulis; **bergantung pada input owner §8**). Tiap tahap dirilis lewat branch + Preview, lalu verifikasi dengan `scripts/verify-production.mjs`.

| Tahap | Cakupan | Estimasi | Ketergantungan |
|---|---|---|---|
| **0. Baseline** | Ekspor GSC (28 hari, sebelum/sesudah 24 Sep 2026), Google Ads *Search terms*, konfirmasi §8 | 2–3 hari (owner) | Blocker untuk keputusan berbasis data |
| **P0 (minggu 1–2)** | Beranda (H1/title/description/blok layanan/link); `/klinik-matras` menjadi hub service; perbaiki deskripsi artikel tertukar + link kontekstual artikel → layanan; moderasi klaim yang tidak terbukti | 5–7 hari | Konfirmasi wilayah, jenis layanan, klaim (§8 no. 1–6) |
| **P1 (minggu 3–5)** | `/perbaikan-kasur-amblas` (baru); `/pricelist`; `/kontak` (Local SEO); peran `/layanan`; anchor footer/nav; skema `Service`/`BreadcrumbList` | 8–10 hari | Harga, bukti before-after, S&K garansi, GBP |
| **P2 (minggu 6–8)** | Keterangan before-after; `/tentang-kami` (bukti); 1–2 artikel pendukung; jasa jemput (bila area terkonfirmasi) | 5–8 hari | Izin pelanggan, kredensial, area |
| **P3 (setelah 4 minggu data)** | Evaluasi `/upgrade-kasur`, `/service-springbed`, `/area-layanan`; konsolidasi artikel yang berebut kueri; `/sano-clean`, `/klinik-sofa` | 4–6 hari | Data GSC pasca-P0/P1 |

**Pengukuran (NOT AVAILABLE saat ini):** kueri/impresi/klik/posisi per kelompok keyword di GSC, klik WhatsApp (GTM), lead formulir, dan (bila ada) *Search terms* Google Ads. Tinjau 28 hari setelah tiap rilis; minta indeks ulang URL yang diubah (beranda, `/klinik-matras`) **setelah** konten final tayang.

---

## 7. Risiko cannibalization dan thin content

### 7.1 Kanibalisasi

| Risiko | Halaman | Tingkat | Mitigasi |
|---|---|---|---|
| "service kasur" antara beranda dan `/klinik-matras` | `/` vs `/klinik-matras` | Sedang | Beranda = brand + ringkasan + bukti; `/klinik-matras` = katalog, proses, FAQ. Pola title berbeda. Pantau kueri per halaman di GSC |
| "kasur sehat" vs "matras sehat" | Pilar `panduan-lengkap-kasur-sehat…`, `konsep-matras-sehat`, bagian beranda, `kasur-ortopedik…` | **Tinggi** | Diferensiasikan: pilar = cara memilih; konsep = definisi/brand; saling menaut; **putuskan konsolidasi** (gabung/redirect) setelah data GSC, bukan sekarang |
| "dampak kasur salah" | `dampak-kasur-rusak`, `dampak-jangka-panjang-kasur-salah`, `klinik-matras-by-sano-care` (deskripsi amblas) | Sedang–Tinggi | Perbaiki deskripsi tertukar; tetapkan satu artikel utama, lainnya menaut ke sana; tinjau setelah data |
| "kasur amblas" antara halaman baru dan artikel | `/perbaikan-kasur-amblas` vs `dampak-kasur-rusak` | Sedang | Halaman = transaksional, artikel = edukasi; artikel menaut ke halaman dengan anchor "perbaikan kasur amblas" |
| Harga/paket | `/pricelist` vs `/klinik-matras` | Rendah–Sedang | `/pricelist` = harga; `/klinik-matras` = cakupan; tanpa duplikasi teks |
| `/layanan` vs `/klinik-matras` | Keduanya "layanan" | Sedang | `/layanan` = hub navigasi tanpa target keyword |
| Varian ejaan ("service/servis/reparasi/springbed") | — | **Dicegah** | Satu halaman; variasi sebagai H2/FAQ/anchor natural |

### 7.2 Thin content dan doorway

- Halaman komersial <300 kata saat ini: `/layanan`, `/pricelist`, `/klinik-sofa`, `/sano-clean`, `/kontak`, `/klinik-matras` (dari kartu). **Ukuran bukan target;** yang dibutuhkan adalah informasi unik: proses, dasar harga, durasi, bukti, FAQ yang benar-benar dijawab.
- Doorway: **dilarang** — halaman per kota, per merek, per ejaan.
- Risiko over-optimization: jangan mengulang keyword; satu penyebutan natural di title, H1, intro, dan H2 yang relevan.
- Risiko kepercayaan/YMYL: klaim medis dan garansi (§2.6). Halaman baru **tidak boleh** memuat klaim kesehatan/hasil tanpa referensi atau S&K resmi.
- Skema: gunakan `FAQPage` hanya bila FAQ tampil nyata; jangan `aggregateRating` tanpa sumber review terverifikasi.

---

## 8. Informasi/data yang perlu dikonfirmasi owner

**A. Data performa (menggantikan seluruh NOT AVAILABLE)**
1. Ekspor GSC → Performance: kueri dan halaman, 28 hari terakhir (dan pembanding sebelum rilis 24 Sep 2026); laporan Pages (indeks per URL, termasuk 7 artikel); status sitemap.
2. Google Ads → *Search terms* dan keyword planner (situs memakai atribusi Search/PMax) untuk kueri nyata dan volume.
3. Google Business Profile → Insights: kueri, panggilan, arah, klik situs; jumlah dan rating review **asli**.
4. Daftar pesaing yang Anda anggap relevan (kami tidak akan menebak).

**B. Wilayah dan operasional**
5. **Wilayah layanan yang benar-benar dilayani** (kota/kecamatan), radius jemput-antar, biaya jemput, jadwal; apakah pelanggan boleh datang ke workshop (walk-in).
6. Jenis kasur/merek yang **bisa dan tidak bisa** diservis (springbed pegas bonnel/pocket, latex, foam; merek); layanan yang benar-benar aktif dari 16 item katalog.
7. **Durasi pengerjaan** tiap layanan dan kapasitas.

**C. Harga dan garansi**
8. Dasar harga: apakah Rp 990.000 / 1.490.000 / 2.390.000 berlaku semua ukuran, "mulai dari", apa saja yang termasuk; boleh mencantumkan rentang harga per layanan?
9. **Syarat & ketentuan garansi resmi** (amblas 10/20 tahun, busa 5/10 tahun, "Fondasi Standar 20 Tahun"): dokumen, cakupan, pengecualian.

**D. Bukti dan otoritas**
10. Foto before-after dengan **izin pelanggan** (tanggal, ukuran kasur, masalah, tindakan); testimoni asli dan tautan review Google.
11. Kredensial/profil teknisi (dasar klaim "10+ tahun"), foto workshop/tim.
12. Siapa yang meninjau klaim kesehatan (adakah rujukan/tenaga medis); apakah disclaimer standar disetujui.

**E. Brand dan Local SEO**
13. Nama resmi untuk NAP/GBP: "KLINIK MATRAS by SANO CARE" (footer copyright memakai ejaan **"KLINIK MATTRESS by SANO CARE"** — inkonsistensi); nomor utama (CS 1 atau CS 2 — JSON-LD dan WA memakai CS 2); URL GBP, kategori utama/tambahan, area layanan di GBP; pastikan pin peta `/kontak` menunjuk alamat workshop.
14. Profil sosial resmi untuk `sameAs` (Instagram/Facebook/TikTok yang tertaut di footer).
15. Prioritas bisnis: layanan mana yang margin/kapasitasnya paling penting (mis. perbaikan fondasi vs upgrade vs cuci).

**F. Keputusan yang perlu disetujui**
16. Setuju **tidak** membuat halaman servis/reparasi/springbed/per-kota terpisah; setuju `/klinik-matras` sebagai hub service; setuju `/perbaikan-kasur-amblas` sebagai halaman baru pertama.
17. Setuju pola istilah: "kasur/springbed" untuk teks layanan, "Matras Sehat/Klinik Matras" untuk brand.

---

## 9. Ringkasan status data

| Data | Status |
|---|---|
| Struktur, metadata, heading, konten, link, CTA 18 halaman | **Terverifikasi dari kode/build** |
| Beranda dan `/klinik-matras` terindeks; sitemap diproses; artikel dalam proses | **Laporan owner** |
| Kueri, impresi, klik, posisi, CTR | **NOT AVAILABLE** |
| Volume/kesulitan keyword | **NOT AVAILABLE** |
| Ranking/kompetitor | **NOT AVAILABLE** (tidak diasumsikan) |
| Review/rating Google | **NOT AVAILABLE** (angka 5.0 di beranda hard-coded, tidak diverifikasi) |
| Wilayah layanan selain Depok (alamat) | **Tidak terkonfirmasi** |
| Intent, pemetaan, prioritas | **Hipotesis** — divalidasi lewat GSC/Ads setelah P0–P1 |

---
*Perencanaan saja. Tidak ada perubahan pada kode, konten, CMS, API lead, atau Vercel. Menunggu persetujuan owner sebelum implementasi.*
