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
