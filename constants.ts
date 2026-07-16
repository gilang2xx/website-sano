import { ServiceItem, BeforeAfterItem, TestimonialItem } from './types';

export const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Layanan', path: '/layanan' },
  { name: 'Artikel', path: '/artikel' },
  { name: 'Tentang Kami', path: '/tentang-kami' },
  { name: 'Before & After', path: '/before-after' },
  { name: 'Kontak', path: '/kontak' },
];

export const SERVICES: ServiceItem[] = [
  {
    id: '1',
    title: 'Service & Repair',
    description: 'Perbaikan pegas rusak, ganti kain sobek, dan perbaikan struktur rangka kasur.',
    iconName: 'Wrench',
  },
  {
    id: '2',
    title: 'Upgrade Matras',
    description: 'Ubah tingkat keempukan, tambah lapisan latex, atau ganti busa density tinggi.',
    iconName: 'TrendingUp',
  },
  {
    id: '3',
    title: 'Custom Matras',
    description: 'Buat kasur dengan ukuran khusus (ganjil/besar) sesuai kebutuhan ruangan Anda.',
    iconName: 'Ruler',
  },
  {
    id: '4',
    title: 'Custom Divan/Headboard',
    description: 'Desain divan dan sandaran kepala kasur sesuai selera interior kamar.',
    iconName: 'BedDouble',
  },
  {
    id: '5',
    title: 'Perbaikan Divan',
    description: 'Restorasi divan yang patah, berbunyi, atau kain pelapis yang rusak.',
    iconName: 'Hammer',
  },
  {
    id: '6',
    title: 'Cuci Matras (SANO CARE)',
    description: 'Pembersihan mendalam (deep cleaning) untuk membasmi tungau dan noda.',
    iconName: 'Sparkles',
  },
];

export const MATRAS_SERVICES: ServiceItem[] = [
  {
    id: 'm1',
    title: 'Service & Repair',
    description: 'Perbaikan pegas rusak, ganti kain sobek, dan perbaikan struktur rangka kasur.',
    iconName: 'Wrench',
  },
  {
    id: 'm2',
    title: 'Upgrade Matras',
    description: 'Ubah tingkat keempukan, tambah lapisan latex, atau ganti busa density tinggi.',
    iconName: 'TrendingUp',
  },
  {
    id: 'm3',
    title: 'Custom Matras',
    description: 'Buat kasur dengan ukuran khusus (ganjil/besar) sesuai kebutuhan ruangan Anda.',
    iconName: 'Ruler',
  },
  {
    id: 'm4',
    title: 'Custom Divan/Headboard',
    description: 'Desain divan dan sandaran kepala kasur sesuai selera interior kamar.',
    iconName: 'BedDouble',
  },
  {
    id: 'm5',
    title: 'Perbaikan Divan',
    description: 'Restorasi divan yang patah, berbunyi, atau kain pelapis yang rusak.',
    iconName: 'Hammer',
  },
];

export const SOFA_SERVICES: ServiceItem[] = [
  {
    id: 's1',
    title: 'Service Sofa',
    description: 'Ganti kulit/kain, tambah busa, dan perbaikan rangka sofa agar kembali baru.',
    iconName: 'Armchair',
  },
  {
    id: 's2',
    title: 'Custom Sofa',
    description: 'Wujudkan sofa impian Anda mulai dari nol. Bebas tentukan model, ukuran, jenis kain, hingga tingkat keempukan sesuai selera.',
    iconName: 'PenTool',
  }
];

export const CLEAN_SERVICES: ServiceItem[] = [
  {
    id: 'c1',
    title: 'Cuci Matras & Sofa',
    description: 'Pembersihan mendalam (deep cleaning) untuk membasmi tungau, debu, dan noda membandel.',
    iconName: 'Sparkles',
  },
  {
    id: 'c2',
    title: 'Hydro Allergen Vacuum',
    description: 'Penyedotan debu kering dengan teknologi hydro separator untuk penderita alergi.',
    iconName: 'Wind',
  }
];


export const TESTIMONIALS = [
  {
    id: 1,
    name: "Ratna Gumilang",
    role: "Local Guide",
    desc: "ingin cerita sedikit dari pengalman saya, saya ibu-ibu umur 58 th, awalnya bingung bgn tidur sering sakit pinggang, kemudian leher jg, saya cek ke dokter dan kata dokter penyebabnya adalah kasur yang udah lama, dan fondasinya rusak",
    rating: 5,
    date: "1 months ago", // Tambahan biar mirip
    photoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjWpGZKHRBLe84-GS77JcX1ss56E-pslv7UAI17XgvWst4qCZGc=w72-h72-p-rp-mo-br100" // Ganti foto asli/dummy
  },
  {
    id: 2,
    name: "Farhan A",
    role: "Local Guide",
    desc: "Kasur saya dulu benar-benar amblas — sekarang jauh lebih kokoh, nyaman, dan rasanya bahkan lebih baik dari kasur baru di mall karena saya sempat cari-cari kasur baru di mall dan sempat tergoda kasur in thebox di online tapi ga yakin. sano mantap pokonya, sukses terus.",
    rating: 5,
    date: "1 months ago",
    photoUrl: "https://www.google.com/maps/contrib/109053876835925262176/reviews?hl=en-GB" 
  },
  {
    id: 2,
    name: "Krisna Shanti",
    role: "Local Guide",
    desc: "Sangat bagus sekali, saya sudah mencoba nya dan cocok dg yg dibutuhkan ..sangat membantu .. terima kasih 🙏",
    rating: 5,
    date: "1 months ago",
    photoUrl: "https://lh3.googleusercontent.com/..." 
  },
  {
    id: 2,
    name: "Su Jannah",
    role: "Local Guide",
    desc: "Pekerjaannya rapi dan berkualitas. Sempat berfikir mau ganti spring bed karena ada per yg patah.",
    rating: 5,
    date: "2 months ago",
    photoUrl: "https://lh3.googleusercontent.com/..." 
  },
  
  // ...
];

export const BEFORE_AFTER_DATA: BeforeAfterItem[] = [
  {
    id: '1',
    title: 'Restorasi Spring Bed Rusak',
    description: 'Penggantian pegas patah dan kain cover premium.',
    beforeImg: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=600',
    afterImg: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=600',
    category: 'Repair'
  },
  {
    id: '2',
    title: 'Upgrade ke Latex',
    description: 'Penambahan lapisan natural latex 5cm.',
    beforeImg: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=600',
    afterImg: 'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?auto=format&fit=crop&q=80&w=600',
    category: 'Upgrade'
  },
  {
    id: '3',
    title: 'Ganti Kain Cover Mewah',
    description: 'Peremajaan tampilan dengan kain knitting 3D.',
    beforeImg: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=600',
    afterImg: 'https://images.unsplash.com/photo-1505693416388-b034631ac0f3?auto=format&fit=crop&q=80&w=600',
    category: 'Cosmetic'
  },
  {
    id: '4',
    title: 'Custom Size King',
    description: 'Modifikasi ukuran dari Queen ke King size.',
    beforeImg: 'https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&q=80&w=600',
    afterImg: 'https://images.unsplash.com/photo-1629949009765-4137578b3941?auto=format&fit=crop&q=80&w=600',
    category: 'Custom'
  },
];