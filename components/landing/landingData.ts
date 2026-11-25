// Data & fakta bersama untuk 3 halaman landing sample (noindex).
// Fakta owner (24 Nov 2026) ditulis SATU kali di sini supaya ketiga halaman
// selalu konsisten. DILARANG masuk: trial 30 hari, garansi busa lama, harga
// coret, promo.

export const GOOGLE_MAPS_URL = 'https://share.google/KHN37lWodhSGKPYkY';

export const FACTS = {
  priceUpgrade: 'Rp2.090.000',
  warrantyUpgrade: '20 tahun',
  warrantyService: '10 tahun',
  days: '2-3 hari',
  freeShipArea: 'Jabodetabek dan Bandung',
  hours: '08.00-22.00 WIB, Senin-Minggu',
  rating: '5,0',
  reviewCount: '111',
  ratingDate: '24 Nov 2026',
} as const;

/* Kartu USP tanya-jawab (26 Nov 2026). Klaim persen hemat SENGAJA tidak ada: menunggu bukti harga. */
export interface UspCard { q: string; title: string; body: string; vs: string }

export const USP = {
  harga: {
    q: 'Mahal nggak?',
    title: `Mulai ${FACTS.priceUpgrade}`,
    body: 'Service atau upgrade kasur sehat. Harga bergantung ukuran dan masalah kasur setelah konsultasi. Bandingin sendiri sama harga kasur baru yang kamu incar.',
    vs: 'bayar harga kasur baru penuh.',
  },
  berat: {
    q: 'Cocok buat badanku nggak?',
    title: 'Lapisannya disesuaikan sama berat badanmu',
    body: 'Ada 5 tier lapisan nyaman, dari LIGHT sampai EXTRA HEAVY. Tidur berdua? Kirim berat badan masing-masing.',
    vs: 'label soft, medium, firm, tanpa ukuran berat badan.',
  },
  garansi: {
    q: 'Garansinya berapa lama?',
    title: `Garansi hingga ${FACTS.warrantyUpgrade}`,
    body: `${FACTS.warrantyUpgrade} untuk Upgrade, ${FACTS.warrantyService} untuk Service.`,
    vs: 'cek syaratnya, beda tiap toko dan merek.',
  },
  lama: {
    q: 'Sayang kasurnya, masih bisa dipakai?',
    title: 'Kasur lamamu dipakai lagi, dibuat kokoh',
    body: 'Selama rangkanya masih bisa dipakai, fondasi dan lapisannya kami bikin ulang.',
    vs: 'kasur lama dibuang atau dijual murah.',
  },
  antar: {
    q: 'Ribet nggak ngangkut kasurnya?',
    title: `Dijemput, dikerjakan ${FACTS.days}, diantar lagi`,
    body: `Antar-jemput gratis ${FACTS.freeShipArea}.`,
    vs: 'tanya ongkir dan lama kirimnya dulu.',
  },
  keluhan: {
    q: 'Kenapa bangun tidur badan pegal?',
    title: 'Mulai dari keluhanmu saat bangun tidur',
    body: 'Ceritain keluhanmu dan kirim foto kasur lewat WA. Kami kasih saran service atau upgrade yang pas.',
    vs: 'pilih sendiri di toko, coba rebahan sebentar.',
  },
} satisfies Record<string, UspCard>;

export interface PhotoPair {
  id: number;
  title: string;
  note?: string;
  before: string;
  after: string;
  w: number;
  h: number;
  altBefore: string;
  altAfter: string;
}

// Before-after asli dari deck "SANO-Credentials 2026" (Canva Gilang), slide Hasil Kerja Kami, dipotong per pasangan
// (bagian foto yang tidak tertutup kotak keterangan). Label = tipe kasur, teks = ringkasan penanganan dari slide itu.
export const PAIRS: Record<'world' | 'culm' | 'thera' | 'heir', PhotoPair> = {
  world: {
    id: 1, title: 'King Koil World Edition', note: 'Kain kotor dan permukaan bergelombang. Upgrade Fondasi, Lapisan dan Ganti Kain.',
    before: '/landing/ba-world-before.webp', after: '/landing/ba-world-after.webp', w: 600, h: 456,
    altBefore: 'King Koil World Edition sebelum dikerjakan: kain kotor dan permukaan bergelombang',
    altAfter: 'King Koil World Edition sesudah dikerjakan: kain putih bersih dan permukaan rata',
  },
  culm: {
    id: 2, title: 'King Koil Culmington', note: 'Lapisan atas cekung di bagian tengah. Upgrade Fondasi dan Lapisan Matras Sehat.',
    before: '/landing/ba-culm-before.webp', after: '/landing/ba-culm-after.webp', w: 600, h: 480,
    altBefore: 'King Koil Culmington sebelum dikerjakan: lapisan atas cekung',
    altAfter: 'King Koil Culmington sesudah dikerjakan: permukaan rata dan tegak',
  },
  thera: {
    id: 3, title: 'Therapedic Titanium Spring', note: 'Lapisan atas cekung di bagian tengah. Upgrade Fondasi dan Lapisan Matras Sehat.',
    before: '/landing/ba-thera-before.webp', after: '/landing/ba-thera-after.webp', w: 600, h: 510,
    altBefore: 'Therapedic Titanium Spring sebelum dikerjakan: permukaan cekung',
    altAfter: 'Therapedic Titanium Spring sesudah dikerjakan: permukaan rata',
  },
  heir: {
    id: 4, title: 'Lady Americana Heirloom', note: 'Kasur terlalu empuk, tidur terasa tenggelam. Upgrade Fondasi dan Lapisan Matras Sehat.',
    before: '/landing/ba-heir-before.webp', after: '/landing/ba-heir-after.webp', w: 597, h: 464,
    altBefore: 'Lady Americana Heirloom sebelum dikerjakan',
    altAfter: 'Lady Americana Heirloom sesudah dikerjakan: lapisan baru yang tegak',
  },
};

export interface Review {
  name: string;
  text: string;
  /** Bulan/tahun ulasan, hanya bila datanya ada (jangan dikarang). */
  date?: string;
  /** URL foto profil, hanya dari sumber resmi (Places API) atau dengan izin pelanggan. */
  photo?: string;
  /** Tautan profil Google penulis (wajib ditampilkan bila foto dari Places API). */
  authorUri?: string;
}

// Ulasan Google asli (DRAF pilihan Gilang 25 Nov 2026, masih didiskusikan dengan RWP).
// Sumber: projects/landing-review-kandidat-2026-11-25.md bagian A, urutan sama. Teks VERBATIM
// (typo, emoji, "...", tanda pisah dari customer dibiarkan): jangan dirapikan.
const REVIEWS_BASE: Review[] = [
  {
    name: "Bima Kawindra",
    text: "Saya sangat puas dengan pelayanan Klinik Matras by Sano Care. Matras saya sebelumnya sudah amblas, tidak nyaman dipakai, dan setiap bangun tidur pinggang terasa sakit. Awalnya saya sempat berpikir harus beli matras baru, tapi setelah direstorasi di sini hasilnya benar-benar di luar ekspektasi. Matras kembali terasa padat, nyaman, dan seperti baru lagi. Tidur jadi jauh lebih nyenyak dan bangun pagi sudah tidak pegal-pegal seperti sebelumnya. Proses pengerjaannya juga rapi, profesional, dan hasilnya terlihat berkualitas. Dan yang paling memuaskan free biaya jemput dan antar matrasnya. Suatu solusi maksimal buat yg kasurnya berat dan besar. Apalagi matras saya di lantai 2 😁 Terima kasih untuk tim Klinik Matras by Sano yang sudah membantu mengembalikan kenyamanan tidur saya. Sangat direkomendasikan untuk siapa pun yang punya masalah matras amblas tapi belum ingin beli baru 👍",
  },
  {
    name: "Miftahul Choirriah",
    text: "karna salah beli kasur akhirnya cari tempat service kasur buat tambah busa biar lebih padet, ketemu lah klinik matras sano, tapi karna takut akhirnya nanya boleh liat dlu gak ke workshop, pas ke workshop ketemu langsung sama ownernya super duper profesional jelasin berbagai macam treatment kasur, akhirnya dikasih alternatif perbaikan, dari mulai kurir dateng jemput kasurnya sampai nganter pelayanannya super duper prima, pdhal kurir sempet nyasar tapi gak ada marah-marah kurirnya. pasti di treatment dengan baik nih sama ownernya. Skarang kasurku udh enak nyaman dan gak bikin sakit punggung 😇",
  },
  {
    name: "sari malia",
    text: "Recommended. Walaupun dulu kasur saya dibeli dengan harga lumayan dan brand bagus tapi seiring usia kasur kualitasnya jadi memburuk. Kasur pegas saya sudah \"melesek\" karena usia, setelah direparasi di Sano menjadi lebih nyaman dan tidur lebih berkualitas. Badan tidak lagi melengkung karena kasur menopang dengan baik dan tidak terlalu keras. Biaya yang dikeluarkan lebih ringan daripada beli kasur pegas baru dengan kualitas sama.",
  },
  {
    name: "Christina Halim",
    text: "Service yg diberikan oleh Klinik Matras Sano sangat2 memuaskan...tiap tahap pengerjaan diinfo dgn jelas....setelah service selesai pun kami tetap dimonitor kondisi badan kami setelah kasur tsb digunakan dan kami boleh claim bila service nya belum sempurna... sangat2 responsif👍👍👍sukses terus utk KLINIK MATRAS SANO dan semoga semakin banyak orang yg bisa dibantu utk mendapatkan kualitas tidur yg lbh baik🙏🙏🙏🙏",
  },
  {
    name: "najla rifda",
    text: "CS Fast Respon, Pengerjaan juga cepat dan rapih, selalu ada update disetiap pengerjaannya. Dan yang paling OK pembayaran bisa dibayar setelah kasur reparasinya sudah diterima dengan baik dirumah. Sejauh pemakaian 2 minggu ini alhamdulillah pinggang dan punggung sudah tidak merasakan pegal dan nyeri kalau bangun tidur pagi 🤩 So yang mau reparasi kasurnya Percayakan ke Klinik Matras by SANO 👌",
  },
  {
    name: "HKRI",
    text: "Awalnya saya bingung kasur yang saya beki jutaan amblas dan menjadi bergelombang, trus cari tempat servis matras yang terdekat, dan coba di klinik matras ini, hasilnya top banget! Prosesnya gamain-main mulai dari konsultasi dan diberikan beberapa informasi tentang kasur yang cocok, bahkan sampai disesuaikan sama bentuk dan berat tubuh saya! The best!",
  },
  {
    name: "Hidajat Widjaja",
    text: "Servicenya sangat bagus. Respondnya sangat cepat. Pengerjaannya juga cepat sekali 2 hari kerja sudah kelar. Saya service 4 kasur sekali gus dalam 2 hari kerja kelar semua. Kasurnya sekarang jauh lebih bagus di bandingin yang dulu. Setelah di service kasurnya empuk bikin enak tidurnya. Bangun tidur badan tidak sakit sakit lagi. 👍👍 …",
  },
  {
    name: "rizka anugerahwaty",
    text: "sukaaaa bgt sama pelayanannya, informatif, edukatif bgt juga, dan bisa kasih solusi terbaik buat tidur lebih nyaman, maju mundur buat reborn kasur, tapi ternyata super worth it karna kasurnya bisa custom based on berat badan yang akan tidur dikasur itu, makasih Klinik Matrasss!🫶🏻🫶🏻🫶🏻",
  },
  {
    name: "Farhan. A",
    text: "Kasur saya dulu benar-benar amblas — sekarang jauh lebih kokoh, nyaman, dan rasanya bahkan lebih baik dari kasur baru di mall karena saya sempat cari-cari kasur baru di mall dan sempat tergoda kasur in thebox di online tapi ga yakin. sano mantap pokonya, sukses terus",
  },
];

// Foto penulis dari Places API, diambil saat build (scripts/fetch-review-photos.mjs). Tidak ada file = avatar huruf.
const photoFiles = import.meta.glob('./reviewPhotos.generated.json', { eager: true, import: 'default' }) as Record<string, Record<string, { photo: string; uri: string }>>;
const PHOTOS = Object.values(photoFiles)[0] || {};
export const REVIEWS: Review[] = REVIEWS_BASE.map((r) => {
  const p = PHOTOS[r.name.trim()];
  return p ? { ...r, photo: p.photo, authorUri: p.uri || undefined } : r;
});

export const HEALTH_NOTE =
  'Kasur yang amblas bisa ikut berperan bikin badan pegal, tapi bukan satu-satunya penyebab. Kalau nyerinya berat atau nggak hilang-hilang, tetap periksa ke dokter ya.';

export const FAQ: Array<[string, string]> = [
  ['Berapa lama pengerjaannya?', `Dikerjakan ${FACTS.days}.`],
  ['Antar-jemputnya sampai mana?', `Gratis untuk ${FACTS.freeShipArea}.`],
  ['Garansinya bagaimana?', `Garansi Klinik Matras hingga ${FACTS.warrantyUpgrade} untuk Upgrade Kasur Sehat.`],
  ['Cara mulainya gimana?', 'Chat WA dan kirim foto kasurmu. Kami cek, kasih saran dan harga pastinya.'],
  ['Bisa datang langsung ke workshop?', 'Bisa. Workshop dan kantor kami di Depok. Kabari dulu lewat WA ya.'],
];
