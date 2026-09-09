<!--
  ============================================================================
  MASTER TEMPLATE ARTIKEL -- Klinik Matras by SANO CARE
  ============================================================================
  Cara pakai: JANGAN edit file ini langsung. Di panel admin (/admin), klik
  "+ Artikel" untuk bikin entri baru, lalu SALIN pola di bawah ini ke
  masing-masing field. File ini sengaja ditaruh di content/_templates/
  (bukan content/artikel/) supaya tidak ikut kebaca sistem sebagai artikel
  sungguhan.

  Komentar HTML seperti ini (<!-- ... -->) TIDAK akan pernah tampil di
  situs -- aman dibiarkan sebagai catatan, tapi kalau mau lebih rapi boleh
  dihapus semua sebelum publish.
  ============================================================================
-->

---
title: "Judul Artikel yang Spesifik & Mengandung Kata Kunci"
<!--
  ATURAN JUDUL:
  - Panjang ideal 50-60 karakter -- lebih dari itu bakal terpotong di hasil
    pencarian Google.
  - Spesifik, bukan judul umum. "Cara Merawat Matras Springbed Agar Awet
    10 Tahun" jauh lebih baik dari "Tips Merawat Matras".
  - Ini otomatis jadi <title> tab browser + judul di hasil pencarian Google
    (lihat hooks/useSEO.ts) -- BUKAN sekadar judul tampilan.
-->

category: "Edukasi"
<!--
  Pakai salah satu kategori yang SUDAH ADA supaya konsisten dengan artikel
  lain: "Edukasi" atau "Klinik Matras by Sano Care". Kategori baru boleh,
  tapi pastikan disengaja, bukan typo.
-->

date: "2026-01-01"
<!--
  Format ISO (YYYY-MM-DD). Di panel admin field ini otomatis keisi tanggal
  hari ini -- biasanya tidak perlu diubah manual. Menentukan urutan artikel
  terbaru di halaman /artikel.
-->

image: "/nama-file-gambar-sampul.jpg"
<!--
  Upload lewat panel admin, JANGAN pakai foto stok/asal. Ini gambar yang
  muncul di kartu daftar artikel DAN jadi preview link saat dibagikan ke
  WhatsApp/Facebook -- pilih yang representatif & menarik perhatian.
-->

desc: "Ringkasan 1-2 kalimat yang bikin orang penasaran klik, sekaligus jadi meta description di Google."
<!--
  ATURAN RINGKASAN:
  - Panjang ideal 120-155 karakter.
  - Ini MUNCUL LANGSUNG di hasil pencarian Google (di bawah judul biru) --
    kalimat lemah di sini = orang skip klik situs Kamu meski rankingnya
    bagus. Tulis seolah-olah ini iklan mini buat artikelnya.
  - Juga tampil sebagai ringkasan di kartu daftar /artikel.
-->
---

Paragraf pembuka. Sebutkan masalah/topik utama dalam 2-3 kalimat pertama --
idealnya kata kunci target artikel muncul secara natural di sini juga,
bukan cuma di judul. Jangan basa-basi kepanjangan sebelum masuk isi.

<!--
  Paragraf ini otomatis dapat styling "lead" yang lebih besar/tebal di
  artikel LAMA (hardcoded) -- untuk artikel CMS, semua paragraf styling-nya
  sama rata, jadi cukup pastikan paragraf pembuka ini kuat isinya.
-->

## Judul Bagian Pertama (H2)

<!--
  ATURAN HEADING:
  - Pakai ## (H2) untuk bagian-bagian utama. JANGAN loncat ke #### (H4)
    tanpa H2/H3 dulu -- search engine baca struktur heading sebagai
    "kerangka" artikel, loncat level bikin strukturnya kacau.
  - Tiap H2 idealnya representasi 1 sub-topik yang jelas, bukan sekadar
    pemisah visual.
-->

Isi paragraf di bawah heading. Usahakan tiap paragraf 3-5 kalimat saja --
paragraf yang terlalu panjang bikin pembaca (dan Google) susah "membaca
cepat" struktur artikelnya.

Kalau relevan, taruh **tautan internal** ke halaman layanan terkait, misal
kalau membahas soal fondasi matras, arahkan ke
[Klinik Matras](/klinik-matras) atau [Klinik Sofa](/klinik-sofa). Ini
belum banyak dipakai di artikel lama -- justru jadi peluang SEO yang bagus
kalau mulai dibiasakan di artikel baru.

### Sub Bagian (H3, kalau perlu)

Pakai H3 kalau ada sub-poin di dalam satu bagian H2 yang butuh
dikelompokkan lagi. Tidak wajib ada di tiap artikel.

- Poin pertama dalam bentuk list
- Poin kedua -- gunakan list kalau memang berupa daftar item/langkah,
  jangan dipaksakan kalau isinya sebenarnya narasi biasa
- Poin ketiga

> Kalimat kutipan atau poin yang mau ditonjolkan secara visual masuk sini
> (pakai tanda `>` di depan baris). Otomatis tampil sebagai kotak highlight
> biru, meniru gaya "Misi Sano Care" di artikel lama. Pakai SEKALI atau
> dua kali per artikel, kalau kebanyakan efek "menonjol"-nya hilang.

![Deskripsikan APA yang ada di foto ini, bukan nama file](/nama-gambar-pendukung.jpg)

<!--
  ATURAN ALT TEXT (teks di dalam kurung siku []):
  - WAJIB deskriptif, contoh yang BENAR: "Teknisi Sano Care mengganti
    lapisan busa matras". Contoh yang SALAH: "gambar 1" atau "IMG_2043".
  - Ini dibaca mesin pencari gambar Google DAN jadi caption otomatis di
    bawah foto (lihat komponen figure/figcaption di ArtikelDetail.tsx) --
    jadi harus enak dibaca manusia juga, bukan cuma keyword.
-->

## Judul Bagian Kedua (H2)

Lanjutan isi artikel. Kalau ada perbandingan (misal Matras A vs Matras B),
bisa pakai tabel:

| Aspek | Opsi A | Opsi B |
|---|---|---|
| Contoh baris | Isi | Isi |
| Contoh baris lain | Isi | Isi |

<!--
  Tabel OPSIONAL -- cuma dipakai kalau memang ada data yang benar-benar
  cocok dibandingkan berdampingan. Jangan dipaksakan.
-->

Paragraf penutup yang merangkum poin utama, sekaligus mengarahkan pembaca
ke langkah berikutnya secara natural (baca artikel lain, atau konsultasi).
Tombol "Chat WhatsApp Sekarang" di akhir halaman SUDAH otomatis muncul
sendiri (bagian dari template halaman, bukan sesuatu yang perlu ditulis
di sini) -- jadi tidak perlu bikin ajakan WA manual di paragraf ini.

<!--
  ============================================================================
  CHECKLIST SEBELUM PUBLISH:
  [ ] Judul spesifik, 50-60 karakter
  [ ] Ringkasan (desc) 120-155 karakter, bikin penasaran
  [ ] Minimal 1 heading H2, urutan heading tidak loncat level
  [ ] Semua gambar punya alt text deskriptif (bukan nama file)
  [ ] Ada minimal 1 tautan internal ke halaman layanan yang relevan
  [ ] Dibaca ulang sekali sebagai pembaca awam, bukan sebagai penulis
  ============================================================================
-->
