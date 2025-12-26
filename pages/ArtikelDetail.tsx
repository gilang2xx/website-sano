import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MessageCircle } from 'lucide-react';

const ArtikelDetail: React.FC = () => {
  const { slug } = useParams();

  // Scroll ke atas saat halaman dibuka
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // --- DATABASE KONTEN ARTIKEL ---
  // Gunakan type 'any' agar tidak error saat mengambil data
  const articleDatabase: any = {

    // ARTIKEL 1: DAMPAK KASUR RUSAK
    "dampak-kasur-rusak": {
      title: "Waspada! 3 Tanda Fatal Tubuh Anda Menolak Matras",
      date: "26 Des 2023",
      readTime: "5 Menit Baca",
      image: "/dampak-kasur-slpunggung.png",
      content: (
        <>
          <p className="lead text-xl font-medium text-slate-700 dark:text-slate-200 mb-6">
            Pernahkah Anda bangun tidur bukannya segar, malah merasa seperti habis dipukuli? Leher kaku, pinggang nyeri, atau bahkan kesemutan menjalar?
          </p>
          <hr className="border-slate-200 dark:border-slate-700 my-8"/>
          
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Fase Awal: Leher Kaku & Pusing</h2>
          <p className="mb-4 text-slate-600 dark:text-slate-300">
            Saat matras terlalu empuk, bahu Anda tenggelam, membuat leher tertekuk ke atas. Ini memicu ketegangan otot.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 mt-8">2. Fase Lanjut: Sakit Pinggang</h2>
          <p className="mb-4 text-slate-600 dark:text-slate-300">
            Pinggul adalah bagian terberat tubuh. Jika pegas tengah lemah, pinggul akan jatuh (Hammocking), memaksa tulang belakang melengkung.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 mt-8">3. Fase Bahaya: Saraf Kejepit (HNP)</h2>
          <p className="mb-4 text-slate-600 dark:text-slate-300">
            Bantalan tulang belakang bisa menonjol dan menekan saraf. Jangan tidur di lantai keras, Anda butuh matras yang Firm tapi nyaman (Latex/Memory Foam).
          </p>
        </>
      )
    },

    // --- ARTIKEL 2: MATRAS SEHAT (UPDATED: SCIENTIFIC APPROACH) ---
    "konsep-matras-sehat": {
      title: "Bedah Anatomi Matras: Mengapa 'Empuk' Saja Tidak Cukup?",
      date: "27 Des 2025",
      readTime: "7 Menit Baca",
      image: "/sano-matras.jpg", 
      content: (
        <>
          <p className="lead text-xl font-medium text-slate-700 dark:text-slate-200 mb-6">
            Banyak orang mengira "Matras Sehat" adalah matras yang keras seperti papan, atau sebaliknya, matras yang sangat empuk seperti awan. Faktanya? <strong>Keduanya salah.</strong>
          </p>

          <div className="bg-slate-100 dark:bg-slate-800 p-4 border-l-4 border-blue-500 mb-8 italic text-slate-600 dark:text-slate-400">
            "Kualitas tidur Anda ditentukan oleh seberapa baik matras menjaga tulang belakang tetap dalam posisi netral (Neutral Spine Alignment) saat Anda tidak sadar."
          </div>

          <p className="mb-8">
            Mari kita bedah secara ilmiah 3 kondisi matras dan dampaknya terhadap anatomi tubuh manusia:
          </p>

          <hr className="border-slate-200 dark:border-slate-700 my-8"/>

          {/* 1. TERLALU EMPUK */}
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            1. Matras Terlalu Empuk (The Hammock Effect)
          </h2>
          <div className="w-full aspect-video bg-gray-200 rounded-2xl overflow-hidden mb-4 shadow-md">
             {/* Gunakan gambar ilustrasi tenggelam jika ada, atau placeholder */}
             <img src="/konsep-terlaluempuk.jpg" alt="Matras Terlalu Empuk" className="w-full h-full object-cover" />
          </div>
          
          <h4 className="font-bold text-red-500 mb-2">Analisis Masalah:</h4>
          <p className="mb-4">
            Tubuh manusia tidak rata; bagian panggul (pelvis) adalah bagian terberat. Pada matras yang terlalu empuk atau pegasnya sudah lemah, hukum gravitasi akan menarik panggul jauh ke bawah.
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-6 text-slate-700 dark:text-slate-300">
            <li><strong>Dampak Ortopedi:</strong> Tulang belakang melengkung (Kyphosis/Scoliosis buatan) sepanjang malam.</li>
            <li><strong>Respon Tubuh:</strong> Otot punggung bawah (Lumbar) akan tegang berusaha menahan posisi agar tidak patah. Inilah sebabnya Anda bangun dengan rasa pegal di pinggang.</li>
            <li><strong>Sirkulasi Udara:</strong> Tubuh yang "tertelan" matras akan memerangkap panas, membuat tidur tidak nyenyak (gerah).</li>
          </ul>

          <hr className="border-slate-200 dark:border-slate-700 my-8"/>

          {/* 2. TERLALU KERAS */}
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            2. Matras Terlalu Keras (The Board Effect)
          </h2>
          <div className="w-full aspect-video bg-gray-200 rounded-2xl overflow-hidden mb-4 shadow-md">
             <img src="/konsep-terlalukeras.jpg" alt="Matras Terlalu Keras" className="w-full h-full object-cover" />
          </div>

          <h4 className="font-bold text-orange-500 mb-2">Analisis Masalah:</h4>
          <p className="mb-4">
            Sering disarankan untuk penderita saraf kejepit zaman dulu, namun ini mitos yang kurang tepat. Matras yang terlalu keras (seperti lantai/batu) melawan lekukan alami tubuh.
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-6 text-slate-700 dark:text-slate-300">
            <li><strong>Pressure Points:</strong> Bahu dan Panggul menerima tekanan ekstrem karena tidak bisa masuk ke dalam matras.</li>
            <li><strong>Sirkulasi Darah:</strong> Tekanan tinggi pada titik tumpu menghambat aliran darah kapiler, menyebabkan kesemutan dan mati rasa (numbness).</li>
            <li><strong>Kualitas Tidur:</strong> Anda akan sering bolak-balik (tossing and turning) secara tidak sadar untuk mencari posisi nyaman, merusak fase Deep Sleep.</li>
          </ul>

          <hr className="border-slate-200 dark:border-slate-700 my-8"/>

          {/* 3. MATRAS SEHAT */}
          <div className="bg-gradient-to-br from-blue-50 to-white dark:from-slate-800 dark:to-slate-900 p-8 rounded-[2rem] border border-blue-200 dark:border-blue-900 shadow-xl">
            <h2 className="text-3xl font-black text-blue-800 dark:text-blue-400 mb-6 text-center">
              3. Konsep Matras Sehat (The Goldilocks Zone)
            </h2>
            
            <p className="mb-6 text-center">
              Matras sehat menggabungkan dua elemen yang sering dianggap berlawanan: <strong>Kekokohan (Support)</strong> dan <strong>Kenyamanan (Comfort)</strong>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
               <div className="bg-white dark:bg-slate-700 p-6 rounded-2xl shadow-sm">
                  <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">A. Fondasi Bawah (Support Layer)</h4>
                  <p className="text-sm">
                    Harus <strong>FIRM (Kokoh)</strong>. Menggunakan pegas berkualitas atau High Density Foam untuk menahan berat badan dan menjaga tulang belakang tetap lurus.
                  </p>
               </div>
               <div className="bg-white dark:bg-slate-700 p-6 rounded-2xl shadow-sm">
                  <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">B. Lapisan Atas (Comfort Layer)</h4>
                  <p className="text-sm">
                    Harus <strong>SOFT & CONTOURING</strong>. Menggunakan Latex atau Memory Foam setebal 3-5cm untuk memeluk bahu dan pinggul, menghilangkan titik tekan.
                  </p>
               </div>
            </div>

            <h3 className="text-xl font-bold text-center mb-4">Mengapa SANO CARE Berbeda?</h3>
            <p className="mb-6 text-center">
              Kami tidak menjual "satu matras untuk semua". Kami merestorasi matras Anda dengan menyesuaikan <strong>Berat Badan</strong> dan <strong>Posisi Tidur</strong> Anda.
            </p>

            <div className="text-center">
              <a 
                href="https://wa.me/6285166662896?text=Halo%20Sano,%20saya%20ingin%20upgrade%20matras%20saya%20menjadi%20Matras%20Sehat"
                target="_blank"
                rel="noreferrer" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all hover:scale-105"
              >
                <MessageCircle size={0} /> Upgrade Matras Saya Sekarang
              </a>
            </div>
          </div>

        </>
      )
    },
  }; 

  // --- LOGIKA RENDER HALAMAN ---

  const article = articleDatabase[slug || ""];

  // Jika artikel tidak ditemukan (Slug salah)
  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-center px-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Artikel Tidak Ditemukan</h1>
        <Link to="/artikel" className="text-blue-600 hover:underline">Kembali ke Daftar Artikel</Link>
      </div>
    );
  }

  // Jika artikel ditemukan
  return (
    <div className="pt-32 pb-24 min-h-screen bg-white dark:bg-slate-900 transition-colors">
      <article className="container mx-auto px-6 max-w-3xl">
        
        {/* Tombol Kembali */}
        <Link to="/artikel" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 transition-colors">
          <ArrowLeft size={20} /> Kembali ke Daftar
        </Link>

        {/* Header Artikel */}
        <div className="mb-10 text-center">
          <div className="flex justify-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
             <span className="flex items-center gap-1"><Calendar size={14}/> {article.date}</span>
             <span className="flex items-center gap-1"><Clock size={14}/> {article.readTime}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-8 leading-tight">
            {article.title}
          </h1>
          
          <div className="w-full aspect-video rounded-3xl overflow-hidden mb-8 shadow-xl">
             <img src={article.image} className="w-full h-full object-cover" alt={article.title} />
          </div>
        </div>

        {/* Isi Artikel */}
        <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed">
           {article.content}
        </div>

        {/* CTA Box */}
        <div className="mt-16 bg-blue-600 rounded-3xl p-8 text-center text-white shadow-xl">
           <h3 className="text-2xl font-bold mb-2">Konsultasi Gratis?</h3>
           <p className="mb-6 opacity-90">Tanyakan solusi untuk matras Anda sekarang.</p>
           <a href="https://wa.me/6285166662896" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-full font-bold hover:scale-105 transition-transform">
              <MessageCircle size={20} /> Chat WhatsApp
           </a>
        </div>

      </article>
    </div>
  );
};

export default ArtikelDetail;