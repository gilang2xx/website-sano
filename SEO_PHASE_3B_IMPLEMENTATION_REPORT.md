# SEO Fase 3B — Laporan Implementasi P0

Branch: `feat/seo-ssg-implementation` (turunan `origin/main` 2c24cc8). **Tidak di-merge, tidak di-deploy.**
Acuan: `SEO_PHASE_3_KEYWORD_ARCHITECTURE.md`. Sumber klaim "terverifikasi" = konten yang sudah tayang di repo atau knowledge base owner (skill `sano-care-matras-sehat-knowledge`, di luar repo).

Keputusan owner yang dipatuhi: tidak ada halaman terpisah untuk service kasur / servis kasur / reparasi kasur / service springbed / variasi kota; `/klinik-matras` menjadi hub; hanya **satu** halaman baru `/perbaikan-kasur-amblas`; `/upgrade-kasur` tidak dibuat; tidak ada klaim operasional/medis/rating/garansi/area/volume yang belum terverifikasi.

---

## 1. Perubahan halaman

| File | Perubahan |
|---|---|
| `seo/routes.ts`, `App.tsx`, `vercel.json` | Route `/perbaikan-kasur-amblas` didaftarkan di registry tunggal → otomatis prerender + sitemap; loader di `PAGE_LOADERS`; grup redirect trailing-slash di `vercel.json` diperbarui (guard prerender mewajibkan sama dengan `STATIC_ROUTES`). |
| `pages/PerbaikanKasurAmblas.tsx` (BARU) | Problem→solution: ciri-ciri, kemungkinan penyebab (fondasi/per/busa, dinyatakan sebagai kemungkinan yang dikonfirmasi lewat diagnosis), cara diperiksa, pilihan perbaikan (dari katalog yang ada, **tanpa harga**), kapan cukup diperbaiki vs diganti, alur (langkah dari Home), FAQ 6 pertanyaan, disclaimer non-medis, CTA WhatsApp (`buildWaHref`) + `/kontak`. 1 H1, 8 H2, tanpa kota. |
| `pages/KlinikMatras.tsx` | Menjadi hub "Service Kasur & Springbed". 16 layanan lama dipertahankan, dikelompokkan di 3 H2 (Fondasi / Lapisan & Kenyamanan / Ukuran-Perawatan-Pendukung); ditambah tabel masalah→layanan, cara kerja, harga/bukti/bacaan, FAQ (5), CTA. Kartu kini punya link WhatsApp nyata (sebelumnya "Info Detail" tanpa link). Sano Clean/sterilisasi diposisikan sebagai layanan pendukung. |
| `pages/Home.tsx` | H1 dan bagian utama direposisi (lihat §3); pain-point diturunkan menjadi H2 dan dilunakkan; tautan cepat ke amblas/harga/before-after/Sano Clean; klaim medis dilunakkan (§5). |
| `pages/Pricelist.tsx` | Judul/H1 dan paragraf yang menjelaskan bahwa harga = estimasi paket utama, penawaran akhir mengikuti diagnosis; link ke hub dan amblas. **Tidak ada harga baru/diubah.** |
| `pages/Kontak.tsx` | Copy H1/sub-copy/deskripsi untuk konsultasi service; petunjuk kirim foto + berat badan; label "Keluhan" → "Kondisi Kasur / Keluhan"; link ke hub & harga. **Logika form, `submitConsultationLead`, `/api/lead`, env tidak disentuh.** |
| `pages/ArtikelDetail.tsx` | Blok "Layanan Terkait" berbasis slug (legacy + CMS) dengan anchor & kalimat pembuka berbeda per artikel; 2 deskripsi meta yang tertukar diperbaiki; kalimat CTA "Jangan tunggu hingga menjadi saraf kejepit" diganti. |
| `pages/Artikel.tsx` | Dua `desc` di daftar artikel yang tertukar diperbaiki (konsisten dengan detail). |
| `pages/TentangKami.tsx` | "5. Fondasi Standar 20 Tahun" → "5. Fondasi Standar Kokoh & Tahan Lama". |
| `components/GoogleReviewSection.tsx` | Angka "5.0", bintang agregat, "Based on all reviews", dan "Ribuan pelanggan puas" dihapus/dinetralkan. |

Tidak diubah: `api/*`, `utils/attribution.ts`, `utils/leadTracking.ts`, admin/CMS, env, DNS, Vercel.

## 2. Pemetaan keyword → halaman (final)

| Intent | Halaman utama | Catatan |
|---|---|---|
| service kasur, servis kasur, service springbed, reparasi/restorasi kasur | `/klinik-matras` (hub) | Satu halaman, tidak ada halaman variasi. Variasi ejaan muncul alami di H1/H2/FAQ. |
| perbaikan kasur amblas, kasur amblas/bergelombang/miring | `/perbaikan-kasur-amblas` | Satu-satunya halaman baru. |
| brand + positioning + "kasur sehat" + Depok | `/` | Diposisikan sebagai spesialis diagnosis/service/restorasi/upgrade. |
| harga service/upgrade kasur | `/pricelist` | Menautkan ke hub & amblas. |
| konsultasi/kontak/lokasi | `/kontak` | |
| edukasi (struktur, konsep, ortopedik, panduan) | artikel | Kini menaut ke hub/amblas dengan anchor beragam. |
| cuci/sterilisasi kasur | `/sano-clean` (+ satu baris di hub) | Layanan pendukung, tidak menjadi positioning utama. |
| upgrade kasur | dilayani hub | `/upgrade-kasur` belum dibuat (sesuai keputusan). |

Tidak ada volume/ranking yang diklaim; semua tetap menunggu data GSC (§7).

## 3. Sebelum / sesudah (H1, title, meta description)

Title akhir = teks di bawah + " | KLINIK MATRAS by SANO CARE" (suffix global `useSEO`).

| Halaman | Sebelum | Sesudah |
|---|---|---|
| `/` H1 | "Bangun Tidur Bukannya Segar, Malah Sakit Semua? Itu Tanda Dampak Kasur Tidak Sehat!" | "Spesialis Service & Restorasi Kasur Sehat" + subjudul "Diagnosis, perbaikan, penguatan fondasi, dan upgrade kasur, tanpa harus beli baru" |
| `/` title | Klinik Matras by SANO CARE — Servis, Upgrade & Cuci Kasur di Depok | Service & Restorasi Kasur Sehat di Depok |
| `/` meta | "Kembalikan kenyamanan tidur tanpa beli kasur baru… cuci kasur profesional di Depok…" (198) | "Spesialis diagnosis, service kasur dan springbed, restorasi, penguatan fondasi, dan upgrade kasur sehat di Depok, tanpa beli baru. Konsultasi via WhatsApp." (≤160) |
| `/klinik-matras` H1 | Layanan Klinik Matras | Service Kasur & Springbed: Perbaikan, Restorasi & Upgrade |
| `/klinik-matras` title | Layanan Klinik Matras — Service, Upgrade & Custom Kasur | Service Kasur & Springbed: Perbaikan, Restorasi & Upgrade |
| `/klinik-matras` meta | "16 layanan perbaikan matras: upgrade fondasi, ganti lapisan, sterilisasi tungau, hingga potong/tambah ukuran…" | "Service kasur dan springbed: perbaikan fondasi, ganti lapisan, restorasi, dan upgrade tanpa beli baru di Klinik Matras by SANO CARE. Konsultasi via WhatsApp." |
| `/perbaikan-kasur-amblas` H1 / title | (baru) | H1 "Perbaikan Kasur Amblas: Diagnosis, Penguatan Fondasi & Restorasi"; title "Perbaikan Kasur Amblas: Diagnosis & Penguatan Fondasi" |
| `/perbaikan-kasur-amblas` meta | (baru) | "Kasur amblas, bergelombang, atau miring? Kenali penyebabnya (fondasi, per, busa) dan pilihan perbaikannya. Kirim foto kasur untuk konsultasi via WhatsApp." |
| `/pricelist` H1 | Pricelist | Harga Service & Upgrade Kasur |
| `/pricelist` title | Daftar Harga Layanan Matras & Sofa | Harga Service & Upgrade Kasur |
| `/pricelist` meta | "…Transparan sejak awal, tanpa biaya tersembunyi." | "…Harga transparan di awal; penawaran sesuai kondisi kasur." ("tanpa biaya tersembunyi" tidak ada sumbernya; "transparan di awal" ada di KB) |
| `/kontak` H1 | Hubungi Kami | Konsultasi Service & Perbaikan Kasur |
| `/kontak` title | Hubungi Kami — Konsultasi Gratis | Konsultasi Service & Perbaikan Kasur |
| `/kontak` meta | "Hubungi Klinik Matras… konsultasi gratis, atau kunjungi workshop kami di Depok, Jawa Barat." | "Konsultasi service dan perbaikan kasur… kirim foto kasur via WhatsApp atau kunjungi workshop kami di Pancoran Mas, Depok." |
| Artikel `klinik-matras-by-sano-care` meta | "Dampak kasur amblas terhadap posisi tulang belakang…" (tertukar) | "Klinik Matras by SANO CARE — Hadir untuk Menolong Banyak Orang dari Dampak Kasur yang Salah." |
| Artikel `dampak-kasur-rusak` meta | "Klinik Matras by SANO CARE — Hadir untuk Menolong…" (tertukar) | "Dampak kasur amblas terhadap posisi tulang belakang dan saraf tubuh…" |

Panjang title: seluruh title >60 karakter *termasuk suffix global* (16 peringatan prerender, sebelumnya 20 karena 4 deskripsi >160 sudah dipangkas). Memperpendek semuanya berarti mengubah suffix brand, yaitu keputusan branding owner, jadi tidak dilakukan. Judul artikel lama yang 100+ karakter dibiarkan (butuh keputusan owner/konten).

## 4. Peta internal linking (dari HTML prerender, di luar header/footer)

| Dari | Ke (anchor) |
|---|---|
| `/` | `/klinik-matras` (Lihat Layanan Service Kasur; kartu "Service Kasur & Springbed (Klinik Matras)"); `/perbaikan-kasur-amblas` (Kasur Amblas? Cek di Sini; kartu Sakit Pinggang; Kasur amblas? Pelajari perbaikannya); `/pricelist` (Lihat estimasi harga…); `/before-after`; `/sano-clean` (Perlu pembersihan?) |
| `/klinik-matras` | `/perbaikan-kasur-amblas`, `/pricelist` (2), `/before-after`, `/kontak` (2), `/sano-clean`, artikel `mengenal-struktur-kasur` & pilar |
| `/perbaikan-kasur-amblas` | `/klinik-matras` (3 anchor berbeda), `/pricelist`, `/before-after`, `/kontak`, artikel struktur & pilar |
| `/pricelist` | `/perbaikan-kasur-amblas` (panduan perbaikan kasur amblas), `/klinik-matras` (seluruh layanan service kasur & springbed) |
| `/kontak` | `/klinik-matras`, `/pricelist` |
| `klinik-matras-by-sano-care` | hub (daftar layanan service kasur), `/pricelist` |
| `konsep-matras-sehat` | hub (layanan upgrade kasur…), amblas |
| `dampak-kasur-rusak` | amblas (cara mengenali dan memperbaiki…), hub |
| `dampak-jangka-panjang-kasur-salah` | amblas (tanda-tanda kasur amblas…), hub |
| `mengenal-struktur-kasur` | amblas (perbaikan kasur amblas), hub (layanan restorasi fondasi dan lapisan…) |
| `kasur-ortopedik-untuk-tidur-sehat` | hub (opsi upgrade fondasi dan lapisan), `/pricelist` |
| pilar (CMS) | hub, amblas, `/pricelist` |

Semua tautan lolos guard prerender (setiap `<a href="/…">` cocok dengan route/aset). Catatan: menu navigasi header belum memuat `/perbaikan-kasur-amblas` (halaman didapat lewat Home, hub, artikel, pricelist). Menambahkannya = keputusan desain untuk owner.

## 5. Klaim: diperbaiki / diblokir

| Klaim | Temuan & tindakan | Status |
|---|---|---|
| "Saraf Kejepit (HNP)" kartu Home ("BAHAYA! … Akibat fatal…") | Sumber KB hanya menyebut "dampak yang sering dilaporkan (HNP fungsional)", bukan bukti medis. Diganti "Nyeri Menjalar (Keluhan Saraf)" + "Bila nyeri berat atau menetap, konsultasikan dengan dokter…". Kartu Premium "(Khusus kasus Saraf Kejepit / Sakit Punggung)" dilunakkan dengan saran ke dokter. Kalimat CTA artikel "Jangan tunggu hingga menjadi saraf kejepit" diganti. | DIPERBAIKI. Artikel yang memuat klaim kesehatan berat (`dampak-kasur-rusak`, `dampak-jangka-panjang…`) **isinya belum ditinjau ulang** → BLOCKED-BY-OWNER (butuh review konten/medis). |
| Kartu Home "Dokter / Pijat / Kasur Mahal / Kasur Keras" | Kalimat kausal/absolut dilunakkan (mis. "Sakitnya akan kembali" → "keluhan bisa terulang"; "puluhan juta bisa bikin sakit pinggang" → "bisa terasa tidak nyaman"; "Mitos lama… menghambat aliran darah" → "Keras tidak otomatis nyaman…"). | DIPERBAIKI |
| "Label Orthopedic hanya gimmick marketing" (Home) | Klaim komparatif tentang pasar, tidak ada bukti di repo. Belum diubah agar tidak mengubah suara brand sepihak. | BLOCKED-BY-OWNER |
| Banner Home "Kembalikan Kesehatan dan Kenyamanan Tidur" | "Kesehatan" dihapus → "Kembalikan Kenyamanan Tidur Kamu Tanpa Perlu Beli Kasur Baru". | DIPERBAIKI |
| "Teknisi berpengalaman lebih dari 10 tahun" (TentangKami, meta) | Didukung KB owner ("Teknisi berpengalaman >10 tahun… King Koil, Serta, Lady Americana"). Tidak diubah, tidak diperkuat. | DIPERTAHANKAN (sumber: KB) |
| "Fondasi Standar 20 Tahun" (TentangKami) | KB: jangan sebut "garansi 20 tahun" secara flat; itu khusus Paket Premium. Judul dinetralkan. Kartu Premium Home ("garansi ketahanan amblas 20 th") berada dalam konteks paket Premium sehingga dipertahankan. | DIPERBAIKI (judul); cakupan garansi Premium/Standard perlu konfirmasi tertulis → OWNER |
| Rating 5.0 hardcoded + "Based on all reviews" + "Ribuan pelanggan puas" | Tidak ada sumber di repo. Dihapus; link "Tulis Review di Google" dipertahankan. | DIPERBAIKI; testimonial individual di `constants` belum diverifikasi → BLOCKED-BY-OWNER |
| Klaim baru di halaman baru | Tidak ada harga, durasi, garansi berangka, area layanan, hasil pelanggan, atau klaim medis. Garansi ditulis "sesuai paket, konfirmasi saat konsultasi"; jemput/antar "konfirmasikan lokasi lewat WhatsApp"; springbed dijawab hati-hati (kirim foto). Angka "penurunan maks. ±1 cm" berasal dari standar SANO di artikel pilar/KB. | OK |

Perubahan klaim dicatat di sini; tidak ada klaim penting yang dihapus tanpa catatan.

## 6. Hasil uji

Lingkungan: Windows, build lokal, emulator Vercel lokal (`vercel.json` asli), Chrome headless dengan host tracker diblokir. Tidak ada POST ke produksi, tidak ada event iklan, tidak menyentuh env/API.

- `npx tsc --noEmit`: bersih.
- `npm run build`: sukses; **19 route** ter-prerender, 0 error, 16 peringatan (semua panjang title/description, lihat §3), 404.html dibuat.
- Guard prerender lolos: 1 `<h1>`/halaman, title & canonical unik, link internal valid, redirect `vercel.json` = `STATIC_ROUTES`, tanpa catch-all rewrite.
- Sitemap: **19 URL**, unik, termasuk `/perbaikan-kasur-amblas`.
- Canonical: setiap halaman self-canonical di `https://sanomatrassehat.com…`.
- `scripts/verify-deployment.mjs` terhadap emulator lokal: **79/79 lulus** (status, canonical, H1, redirect trailing-slash, 404 noindex, sitemap, robots, /admin, /api GET, aset).
- Browser smoke desktop + mobile (semua 19 route): **38/38** (1 H1, 1 title, 1 canonical); fungsional **24/24** (hydration tanpa error termasuk dark mode, navigasi SPA & back, 404 dan pemulihan, atribusi WA: organik tanpa tag, dari iklan bertag, `sano_ref` tersimpan, form kontak memanggil `/api/lead` **mock lokal**, sitemap valid). Satu penyesuaian harness: kontrol "mismatch disengaja" memakai teks H1 lama `/kontak`; diarahkan ke H1 baru (bukan perubahan aplikasi).
- Admin/API/atribusi WA: `api/`, `utils/attribution.ts`, `utils/leadTracking.ts`, admin tidak berubah (`git diff` hanya menyentuh berkas di §1).
- Belum dilakukan: inspeksi visual manual (screenshot) halaman baru/hub di berbagai lebar; hanya diuji hydration & struktur. Belum ada uji di Vercel Preview.

## 7. Masih membutuhkan data GSC / owner

GSC: kueri & impresi aktual untuk "service kasur", "servis kasur", "service springbed", "kasur amblas", "perbaikan kasur amblas", "upgrade kasur" (menentukan perlu/tidaknya `/upgrade-kasur` nanti); CTR/posisi halaman hub setelah rilis; pemantauan kanibalisasi `/` vs `/klinik-matras`.

Owner:
1. Konfirmasi springbed (merek/tipe yang dapat dikerjakan) supaya FAQ bisa lebih spesifik.
2. Area jemput/antar dan area layanan di luar Depok (belum ditulis).
3. Cakupan garansi Standard vs Premium (dokumen `02-harga-layanan.md` tidak tersedia bagi kami).
4. Dasar harga coret (Rp1.450.000 / 2.150.000 / 3.450.000): harga normal asli atau strategi promo? Apakah "mulai dari" bergantung ukuran kasur? Harga untuk layanan di luar 3 paket utama.
5. Peninjauan artikel dengan klaim kesehatan berat dan testimonial `constants`; klaim "Orthopedic gimmick".
6. Ejaan brand di footer ("KLINIK MATTRESS by SANO CARE") dan apakah `/perbaikan-kasur-amblas` masuk menu navigasi.
7. Foto asli kasur amblas (sebelum/sesudah) bila ingin bukti visual di halaman baru; foto workshop yang ada (`/uploads/5.jpg`, `6.jpg`) berlogo merek pihak ketiga dan tidak jelas menunjukkan amblas, jadi tidak dipakai.

## 8. Rekomendasi sebelum produksi

1. Push branch, cek Vercel Preview (website-sano) dengan `verify-deployment.mjs --base=<preview>` + inspeksi visual mobile.
2. Owner meninjau copy halaman baru dan hub (terutama jawaban FAQ springbed & garansi).
3. Selesaikan item §5 yang BLOCKED-BY-OWNER atau terima statusnya secara tertulis.
4. Setelah rilis: kirim ulang sitemap di GSC, minta indexing untuk `/perbaikan-kasur-amblas` dan `/klinik-matras`, pantau 2–4 minggu sebelum memutuskan halaman tambahan.
5. Risiko lama yang masih ada dan di luar cakupan: `RESEND_API_KEY`/`LEAD_NOTIFICATION_EMAIL` belum ada di env Production `website-sano` (form kontak kemungkinan mengembalikan 502); jangan klaim form berfungsi tanpa uji terkontrol.
