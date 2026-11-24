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

// Ulasan Google asli, dipilih Gilang (SANO_DESIGNER, signage-tv-loop/testimoni). Nama disingkat (nama depan + inisial).
// Teks disalin apa adanya, kecuali salah ketik, spasi, tanda baca dan emoji dirapikan.
export const REVIEWS: Record<'sudarsono' | 'hidajat' | 'rifky', Review> = {
  sudarsono: {
    name: 'Sudarsono S.',
    text: 'Analisa masalahnya dikomunikasikan dengan detail dan terbuka. Hasil pekerjaan memuaskan. Springbed KingKoil berumur 20 tahun saya bisa menjadi nyaman kembali. Sangat recommended untuk coba repair dulu di sini sebelum memutuskan beli yang baru karena lebih ekonomis.',
  },
  hidajat: {
    name: 'Hidajat W.',
    text: 'Servicenya sangat bagus. Respondnya sangat cepat. Pengerjaannya juga cepat sekali, 2 hari kerja sudah kelar. Saya service 4 kasur sekali gus dalam 2 hari kerja kelar semua. Kasurnya sekarang jauh lebih bagus dibandingin yang dulu.',
  },
  rifky: {
    name: 'Rifky M.',
    text: 'Mantap servicenya, kasur ambles saya jadi kaya baru lagi. Bangun tidur rasanya enak gak pada sakit dan pegel, dan bikin tidur jadi nyenyak banget.',
  },
};

export const HEALTH_NOTE =
  'Kasur yang amblas bisa ikut berperan bikin badan pegal, tapi bukan satu-satunya penyebab. Kalau nyerinya berat atau nggak hilang-hilang, tetap periksa ke dokter ya.';

export const FAQ: Array<[string, string]> = [
  ['Berapa lama pengerjaannya?', `Dikerjakan ${FACTS.days}.`],
  ['Antar-jemputnya sampai mana?', `Gratis untuk ${FACTS.freeShipArea}.`],
  ['Garansinya bagaimana?', `Garansi Klinik Matras: Upgrade ${FACTS.warrantyUpgrade}, Service ${FACTS.warrantyService}.`],
  ['Cara mulainya gimana?', 'Chat WA dan kirim foto kasurmu. Kami cek, kasih saran dan harga pastinya.'],
  ['Bisa datang langsung ke workshop?', 'Bisa. Workshop dan kantor kami di Depok. Kabari dulu lewat WA ya.'],
];
