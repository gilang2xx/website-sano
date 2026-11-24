// Data & fakta bersama untuk 3 halaman landing sample (noindex).
// Fakta owner (24 Nov 2026) ditulis SATU kali di sini supaya ketiga halaman
// selalu konsisten. DILARANG masuk: trial 30 hari, garansi busa lama, harga
// coret, promo.

export const GOOGLE_MAPS_URL = 'https://share.google/KHN37lWodhSGKPYkY';

export const FACTS = {
  priceService: 'Rp1.500.000',
  warrantyUpgrade: '20 tahun',
  warrantyService: '10 tahun',
  days: '2-3 hari',
  freeShipArea: 'Jabodetabek dan Bandung',
  hours: '08.00-22.00 WIB, Senin-Minggu',
  rating: '5,0',
  reviewCount: '111',
  ratingDate: '24 Nov 2026',
} as const;

export interface PhotoPair {
  id: number;
  title: string;
  before: string;
  after: string;
  w: number;
  h: number;
  altBefore: string;
  altAfter: string;
}

// Foto asli SANO (public/before-N.jpg & after-N.jpg) yang sudah dikecilkan ke
// WebP 640 px (19-37 KB per foto). Judul = judul resmi di content/before-after.
export const PAIRS: Record<'p10' | 'p11' | 'p6' | 'p7', PhotoPair> = {
  p10: {
    id: 10, title: 'Full Upgrade All-in-One',
    before: '/landing/before-10.webp', after: '/landing/after-10.webp', w: 640, h: 404,
    altBefore: 'Kasur pelanggan sebelum dikerjakan: kain kusam dan bernoda',
    altAfter: 'Kasur yang sama setelah Full Upgrade: rapi, bersih dan tegak',
  },
  p11: {
    id: 11, title: 'Full Upgrade dengan Kain Knitting 3D',
    before: '/landing/before-11.webp', after: '/landing/after-11.webp', w: 640, h: 404,
    altBefore: 'Kasur bermotif bunga sebelum dikerjakan, kain sudah lusuh',
    altAfter: 'Kasur yang sama setelah upgrade dengan kain knitting 3D, rata dan bersih',
  },
  p6: {
    id: 6, title: 'Full Upgrade Kasur 2 in 1',
    before: '/landing/before-6.webp', after: '/landing/after-6.webp', w: 640, h: 640,
    altBefore: 'Kasur lama dengan busa dan kain yang sobek',
    altAfter: 'Kasur 2 in 1 abu-abu yang rapi setelah Full Upgrade',
  },
  p7: {
    id: 7, title: 'Full Upgrade All-in-One',
    before: '/landing/before-7.webp', after: '/landing/after-7.webp', w: 640, h: 640,
    altBefore: 'Kasur pelanggan sebelum Full Upgrade',
    altAfter: 'Kasur yang sama setelah Full Upgrade, lebih tebal dan rapi',
  },
};

export interface Review {
  name: string;
  text: string;
}

// Teks dari ulasan Google yang sudah ada di constants.ts (ejaan dirapikan)
// (TESTIMONIALS). Pilihan 3 ulasan final = keputusan owner; ini pilihan
// sementara untuk sample. Hanya nama depan.
export const REVIEWS: Record<'farhan' | 'ratna' | 'jannah', Review> = {
  farhan: {
    name: 'Farhan',
    text: 'Kasur saya dulu benar-benar amblas, sekarang jauh lebih kokoh, nyaman, dan rasanya bahkan lebih baik dari kasur baru di mall karena saya sempat cari-cari kasur baru di mall dan sempat tergoda kasur in thebox di online tapi ga yakin. sano mantap pokonya, sukses terus.',
  },
  ratna: {
    name: 'Ratna',
    text: 'Awalnya bingung bangun tidur sering sakit pinggang, kemudian leher juga. Saya cek ke dokter dan kata dokter penyebabnya adalah kasur yang sudah lama, dan fondasinya rusak.',
  },
  jannah: {
    name: 'Su',
    text: 'Pekerjaannya rapi dan berkualitas. Sempat berfikir mau ganti spring bed karena ada per yang patah.',
  },
};

export const HEALTH_NOTE =
  'Kasur yang amblas bisa ikut berperan bikin badan pegal, tapi bukan satu-satunya penyebab. Kalau nyerinya berat atau nggak hilang-hilang, tetap periksa ke dokter ya.';
