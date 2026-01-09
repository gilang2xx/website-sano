import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Clock, MessageCircle, 
  CheckCircle2, ShieldCheck, Zap, HeartPulse 
} from 'lucide-react';

const ArtikelDetail: React.FC = () => {
  const { slug } = useParams();

  // Scroll ke atas saat halaman dibuka
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // --- DATABASE KONTEN ARTIKEL (FULL 6 ARTIKEL) ---
  const articleDatabase: any = {

    // =================================================================
    // ARTIKEL 1: MISI & VISI SANO CARE
    // =================================================================
    "klinik-matras-by-sano-care": {
      title: "Klinik Matras by SANO CARE: Hadir untuk Menolong dari Dampak Kasur yang Salah",
      date: "26 Des 2025",
      readTime: "5 Menit Baca",
      image: "/foto-karyawan.jpg", // Gambar Utama
      content: (
        <>
          <p className="lead text-xl font-medium text-slate-700 dark:text-slate-200 mb-6">
            Banyak orang mengira pegal-pegal, sakit pinggang, nyeri punggung, leher kaku, hingga kualitas tidur yang buruk disebabkan usia, kelelahan, atau aktivitas harian. Padahal, dalam banyak kasus, <strong>akar masalahnya adalah kasur yang salah</strong> dan tidak sesuai dengan tubuh.
          </p>

          <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg my-8">
            <h3 className="text-xl font-bold mb-2">Misi Sano Care:</h3>
            <p className="italic opacity-90">
              "Menolong banyak orang agar terhindar dari kerusakan tubuh akibat kasur yang salah, dan membantu memulihkan kenyamanan tidur melalui konsep Matras Sehat yang benar."
            </p>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Mengapa Kasur Bisa Menjadi Penyebab Masalah?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-red-50 dark:bg-red-900/10 p-5 rounded-xl border-l-4 border-red-500">
              <h4 className="font-bold text-red-600 mb-2">Ciri Kasur Salah:</h4>
              <ul className="list-disc pl-5 text-sm space-y-1 text-slate-700 dark:text-slate-300">
                <li>Terlalu empuk dan cepat amblas.</li>
                <li>Terlalu keras dan tidak adaptif.</li>
                <li>Fondasi tidak stabil.</li>
                <li>Lapisan tidak presisi dengan berat badan.</li>
                <li>Materialnya menekan saraf & aliran darah.</li>
              </ul>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/10 p-5 rounded-xl border-l-4 border-orange-500">
              <h4 className="font-bold text-orange-600 mb-2">Dampaknya:</h4>
              <ul className="list-disc pl-5 text-sm space-y-1 text-slate-700 dark:text-slate-300">
                <li>Sakit punggung & pinggang.</li>
                <li>Saraf kejepit (HNP fungsional).</li>
                <li>Skoliosis fungsional.</li>
                <li>Tidur tidak berkualitas & mudah lelah.</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Fokus Kami: Matras Sehat, Bukan Sekadar Empuk</h2>
          <p className="mb-4">
            Banyak kasur dipasarkan berdasarkan kenyamanan sesaat. Di Klinik Matras Sano Care, kami tidak hanya memperbaiki kasur, tetapi menganalisa kondisi tubuh, fondasi, lapisan, dan keluhan Anda secara spesifik.
          </p>
          <p className="mb-4">
            Melalui layanan <strong>Upgrade Fondasi, Lapisan, Kain, hingga Paket Restorasi Total</strong>, kami menghadirkan solusi nyata tanpa harus membeli kasur baru.
          </p>

          <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-2xl text-center font-medium mt-8">
            "Tujuan kami satu: Membantu Anda tidur lebih sehat, bangun lebih segar, dan hidup lebih produktif."
          </div>
        </>
      )
    },

    // ARTIKEL 2: KONSEP MATRAS SEHAT (UPDATED CONTENT)
    "konsep-matras-sehat": {
      title: "Apa Definisi 'Matras Sehat' yang Sebenarnya?",
      date: "27 Des 2025",
      readTime: "6 Menit Baca",
      image: "/sano-matras.jpg", // Gambar Utama Artikel
      content: (
        <>
          {/* INTRO */}
          <p className="lead text-xl font-medium text-slate-700 dark:text-slate-200 mb-6">
            Banyak orang terjebak dalam mitos bahwa kasur yang nyaman adalah kasur yang sangat empuk atau berharga mahal. Padahal, kenyamanan sesaat seringkali menipu dan justru menjadi penyebab utama masalah kesehatan jangka panjang seperti nyeri punggung dan leher kaku.
          </p>
          <p className="mb-6 text-slate-600 dark:text-slate-300">
            Di <strong>Klinik Matras by Sano Care</strong>, kami mendefinisikan ulang standar kualitas tidur. Bagi kami, Matras Sehat adalah investasi kesehatan jangka panjang, bukan sekadar perabot rumah tangga biasa.
          </p>

          {/* GAMBAR 1 */}
          <figure className="my-10 w-full rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
             {/* Menggunakan video konsep sehat sebagai ilustrasi tulang belakang lurus */}
          </figure>

          <hr className="border-slate-200 dark:border-slate-800 my-10"/>

          {/* DEFINISI */}
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Definisi Matras Sehat
          </h2>
          <p className="mb-4 text-slate-600 dark:text-slate-300 leading-relaxed">
            Menurut SANO CARE, <strong>Matras Sehat</strong> adalah kasur yang mampu menjaga bentuk tubuh dan struktur tulang secara stabil. Kasur ini dirancang khusus untuk menjaga posisi tulang belakang tetap netral dan memberikan kenyamanan tanpa memberikan tekanan berlebih pada sistem saraf maupun aliran darah dalam jangka waktu panjang.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border-l-4 border-blue-500 mb-8 italic text-slate-700 dark:text-slate-300">
            "Tujuan utamanya adalah memastikan tubuh Anda melakukan proses pemulihan (restorasi) total selama Anda terlelap."
          </div>

          {/* 3 PRINSIP DASAR */}
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6">
            3 Prinsip Dasar Matras Sehat
          </h2>
          <p className="mb-6 text-slate-600 dark:text-slate-300">SANO CARE menggunakan tiga pilar utama dalam setiap proses pengerjaan upgrade dan restorasi matras:</p>

          <div className="space-y-6 mb-12">
            {/* Prinsip 1 */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                Fondasi Harus Kuat & Stabil
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Fondasi adalah jantung dari sebuah kasur. Matras sehat tidak boleh mudah amblas atau terasa goyang. Fondasi yang kuat memastikan tulang belakang Anda tidak melengkung secara tidak alami saat tidur selama berjam-jam.
              </p>
            </div>

            {/* Prinsip 2 */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                Lapisan Presisi & Adaptif
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Lapisan kasur harus mampu mengikuti lekuk tubuh (adaptif) dan elastisitasnya harus sesuai dengan berat tubuh individu. Tujuannya agar tidak ada bagian tubuh yang tertekan, namun juga tidak boleh mengambang; tubuh harus menyentuh fondasi seminimal mungkin.
              </p>
            </div>

            {/* Prinsip 3 */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                Kain Permukaan Sejuk & Nyaman
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Permukaan tidur sangat mempengaruhi sirkulasi udara. Kami menggunakan kain yang memiliki sirkulasi udara baik (adem) agar suhu tubuh tetap stabil dan tidak mengganggu saraf permukaan kulit.
              </p>
            </div>
          </div>

          {/* GAMBAR 2 (INFOGRAFIS PLACEHOLDER) */}
          <figure className="my-10 w-full rounded-3xl overflow-hidden shadow-lg">
 <img src="/prinsip-matras-sehat.jpg" alt="3 Prinsip Matras S" className="w-full object-cover" />             <figcaption className="text-center text-xs text-slate-400 mt-2 italic">3 Pilar utama Matras Sehat Sano Care.</figcaption>
          </figure>

          {/* KRITERIA */}
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6">
            Kriteria Matras Sehat Versi SANO CARE
          </h2>
          <p className="mb-4 text-slate-600 dark:text-slate-300">Bagaimana memastikan kasur Anda memenuhi standar kesehatan? Berikut adalah kriteria ketat yang kami terapkan:</p>
          <ul className="list-disc pl-5 space-y-3 mb-10 text-slate-700 dark:text-slate-300">
            <li><strong>Menjaga Tulang Belakang Tetap Netral:</strong> Posisi punggung tetap pada kurva alaminya.</li>
            <li><strong>Distribusi Tekanan Merata:</strong> Tidak menimbulkan titik tekan pada bahu atau pinggul.</li>
            <li><strong>Keamanan Saraf & Tendon:</strong> Material tidak menekan aliran darah dan saraf.</li>
            <li><strong>Mendukung Recovery Otot:</strong> Membantu otot rileks sempurna untuk pemulihan energi.</li>
            <li><strong>Solusi Nyeri & Skoliosis:</strong> Sangat aman bagi penderita nyeri punggung bawah dan skoliosis fungsional.</li>
          </ul>

          <hr className="border-slate-200 dark:border-slate-800 my-10"/>

          {/* KESIMPULAN */}
          <div className="bg-slate-900 text-white p-8 rounded-[2rem] text-center shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Kesimpulan</h2>
            <p className="text-lg font-medium mb-6 text-blue-200">
              Matras Sehat = Fondasi Kuat + Lapisan Presisi + Permukaan Nyaman + Aman bagi Tubuh.
            </p>
            <p className="text-slate-300 text-sm">
              Inilah standar profesional yang digunakan oleh Klinik Matras by SANO CARE. Kami tidak hanya sekadar memperbaiki kasur, kami akan membuat kasur Anda berfungsi untuk menjaga kesehatan Anda.
            </p>
          </div>

          {/* GAMBAR 3 (HASIL JADI) */}
          <figure className="my-12 w-full rounded-3xl overflow-hidden shadow-lg">
             <img src="/restoras-kasur.jpg" alt="Hasil Restorasi Sano Care" className="w-full object-cover" />
             <figcaption className="text-center text-xs text-slate-400 mt-2 italic">Hasil restorasi matras sehat profesional Sano Care.</figcaption>
          </figure>

          {/* HUBUNGI KAMI CTA */}
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
              Apakah Kasur Anda Sudah Sehat?
            </h3>
            <p className="mb-8 text-slate-600 dark:text-slate-300">
              Jangan biarkan tubuh Anda menanggung dampak dari kasur yang salah. Segera konsultasikan kondisi kasur Anda kepada ahli kami.
            </p>
            
            <a 
              href="https://wa.me/6285187283900?text=Halo%20Sano,%20saya%20ingin%20konsultasi%20tentang%20konsep%20Matras%20Sehat."
              target="_blank"
              rel="noreferrer" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-green-500 text-white rounded-full font-bold shadow-lg hover:bg-green-600 transition-all hover:scale-105"
            >
              <MessageCircle size={20} /> Konsultasi WhatsApp
            </a>
          </div>
        </>
      )
    },

    // ARTIKEL: AWAS KASUR MERUSAK TULANG BELAKANG
    "dampak-kasur-rusak": {
      title: "Awas! Kasur Anda Mungkin Sedang Merusak Tulang Belakang: Inilah Alasannya",
      date: "28 Des 2025",
      readTime: "7 Menit Baca",
      image: "/kasur-merusak-tulang.jpg", // Gambar cover yang relevan
      content: (
        <>
          {/* INTRO */}
          <p className="lead text-xl font-medium text-slate-700 dark:text-slate-200 mb-6">
            Banyak orang menganggap bahwa kasur hanyalah tempat untuk memejamkan mata. Namun, tahukah Anda bahwa selama 6 hingga 8 jam setiap malam, kasur adalah <strong>"lingkungan"</strong> yang menentukan kesehatan anatomi tubuh Anda?
          </p>
          <p className="mb-6 text-slate-600 dark:text-slate-300">
            Seringkali, tanpa disadari, kita tidur di atas kasur yang sudah tidak layak: sudah amblas, busa melemah, atau fondasi yang patah. Bahkan ada juga kasur layak secara fisik tetapi secara fungsi atau tekstur tidak sesuai dengan berat badan Anda—intinya dari awal beli teksturnya tenggelam, bukan empuk.
          </p>
          <p className="mb-8 text-slate-600 dark:text-slate-300">
            Alih-alih beristirahat, tubuh Anda justru dipaksa bekerja keras beradaptasi dengan posisi yang salah sepanjang malam. Di sinilah <strong>Klinik Matras by Sano Care</strong> hadir untuk menyelamatkan kesehatan tulang belakang Anda tanpa Anda harus selalu membeli kasur baru.
          </p>

          {/* GAMBAR 1 */}
          <figure className="my-10 w-full rounded-3xl overflow-hidden shadow-lg">
             <img src="/artikel-3-sub1.jpg" alt="Ilustrasi Tulang Belakang Melengkung" className="w-full object-cover" />
             <figcaption className="text-center text-xs text-slate-400 mt-2 italic">Ilustrasi: Dampak kasur amblas terhadap posisi tulang belakang dan saraf.</figcaption>
          </figure>

          <hr className="border-slate-200 dark:border-slate-800 my-10"/>

          {/* BAGIAN 1: 4 PENYEBAB UTAMA */}
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6">
            4 Penyebab Utama Kasur Merusak Tubuh Anda
          </h2>
          <p className="mb-8 text-slate-600 dark:text-slate-300">
            Mengapa kasur yang terlihat "baik-baik saja" di permukaan bisa menjadi sumber malapetaka bagi kesehatan? Berikut adalah faktor teknisnya:
          </p>

          <div className="space-y-6 mb-12">
            
            {/* Poin 1 */}
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border-l-4 border-red-500">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">1. Fondasi Lemah & Tenggelam</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                Jika fondasi kasur sudah tidak rata, tulang belakang Anda akan melengkung secara perlahan menuju permanen. Ini adalah salah satu penyebab utama ketegangan otot yang terus-menerus. Jika fondasi sudah tenggelam, busa apapun di atasnya menjadi sia-sia; posisi tidur akan tenggelam dan merusak tubuh jangka panjang.
              </p>
            </div>

            {/* Poin 2 */}
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border-l-4 border-orange-500">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">2. Lapisan Terlalu Empuk / Keras</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                Keempukan yang berlebihan membuat tubuh "tenggelam" dan mengunci posisi sendi. Sebaliknya, kasur yang terlalu keras menciptakan titik tekan (pressure points) yang menghambat sirkulasi darah dan menekan saraf.
              </p>
            </div>

            {/* Poin 3 */}
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border-l-4 border-yellow-500">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">3. Material Tidak Sesuai Berat Badan</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                Setiap individu unik. Kasur dengan elastisitas yang tidak seimbang dibandingkan beban pemakainya akan mengakibatkan distribusi berat badan yang kacau. Proses ini dipercepat dari dua sisi: Kasur mengalami deformasi plastis & <em>fatigue</em>, dan tubuh yang tidur mungkin mengalami peningkatan berat badan.
              </p>
            </div>

            {/* Poin 4 */}
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border-l-4 border-blue-500">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">4. Ketidaktahuan Pengguna</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                Ketidaktahuan dampak kasur sangatlah wajar karena kasur dinikmati saat tidak sadarkan diri. Namun dampaknya nyata saat bangun tidur. Ketika terasa pegal, sakit pinggang, atau sakit badan berulang dalam periode tertentu, patut dicurigai kasur adalah penyebab utamanya, bukan sekadar faktor umur atau kelelahan aktivitas.
              </p>
            </div>
          </div>

          <hr className="border-slate-200 dark:border-slate-800 my-10"/>

          {/* BAGIAN 2: DAMPAK KESEHATAN */}
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6">
            Dampak Kesehatan: Lebih dari Sekadar Pegal
          </h2>
          <p className="mb-6 text-slate-600 dark:text-slate-300">
            Mengabaikan kondisi kasur yang salah bukan hanya soal kenyamanan, tapi soal risiko medis jangka panjang. Berikut adalah dampak yang sering dilaporkan pasien di Klinik Matras Sano Care:
          </p>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 mb-8">
             <ul className="space-y-3 list-disc pl-5 marker:text-red-500 text-slate-700 dark:text-slate-300">
                <li><strong>Terasa Pegal & Sakit Leher</strong></li>
                <li><strong>Kepala Pusing</strong></li>
                <li><strong>Lemas & Kurang Bersemangat</strong></li>
                <li><strong>Sakit Pinggang & Punggung Kronis:</strong> Rasa nyeri yang tajam atau tumpul setiap pagi.</li>
                <li><strong>Saraf Kejepit (HNP Fungsional):</strong> Penekanan pada diskus tulang belakang akibat posisi tidur salah.</li>
                <li><strong>Skoliosis Fungsional:</strong> Perubahan kelengkungan tulang belakang karena tumpuan tidak rata.</li>
                <li><strong>Kualitas Tidur Buruk:</strong> Bangun dengan perasaan lelah (badan "remuk").</li>
             </ul>
          </div>

          {/* GAMBAR 2 */}
          <figure className="my-10 w-full rounded-3xl overflow-hidden shadow-lg">
             <img src="/dampak-kasur-mood.png" alt="Infografis Gejala Nyeri" className="w-full object-cover" />
             <figcaption className="text-center text-xs text-slate-400 mt-2 italic">Gejala saraf kejepit dan sakit pinggang akibat kasur salah.</figcaption>
          </figure>

          {/* BAGIAN 3: SOLUSI SANO CARE */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-3xl shadow-xl text-white my-12 relative overflow-hidden">
             <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">Sano Care: Solusi Restorasi Matras Sehat Anda</h2>
                <p className="mb-6 text-blue-100">
                  Jangan terburu-buru membuang kasur lama Anda. Di Klinik Matras by Sano Care, kami memiliki metode unik untuk mengembalikan fungsi kesehatan tempat tidur Anda:
                </p>
                <ol className="space-y-4 list-decimal pl-5 text-blue-50 font-medium">
                  <li><strong>Upgrade Fondasi:</strong> Memperkuat struktur utama agar tulang belakang tetap pada posisi netral.</li>
                  <li><strong>Upgrade Lapisan:</strong> Mengganti material lama dengan lapisan yang presisi, adaptif, dan sesuai dengan kebutuhan berat badan Anda.</li>
                  <li><strong>Paket Restorasi Matras Sehat:</strong> Transformasi total kasur lama Anda menjadi "Matras Sehat" standar medis Sano Care.</li>
                </ol>
             </div>
             {/* Hiasan background */}
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          </div>

          {/* KESIMPULAN */}
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Kesimpulan: Kembalikan Hak Tubuh Anda untuk Sehat</h2>
          <p className="mb-6 leading-relaxed text-slate-600 dark:text-slate-300">
            Tidur adalah cara tubuh menyembuhkan diri. Jangan biarkan kasur yang salah justru menjadi penyebab kerusakan tubuh Anda. 
          </p>
          <p className="mb-8 leading-relaxed font-medium text-slate-800 dark:text-slate-200">
            Sano Care hadir bukan sekadar jasa perbaikan, melainkan klinik yang memahami anatomi tubuh manusia dan cara kerja material matras. Sempurnakan kualitas tidur Anda, karena tulang belakang yang sehat adalah kunci hidup produktif.
          </p>

          {/* GAMBAR 3 */}
          <figure className="my-8 w-full rounded-3xl overflow-hidden shadow-lg">
             <img src="/foto-karyawan.jpg" alt="Hasil Restorasi Kasur" className="w-full object-cover" />
             <figcaption className="text-center text-xs text-slate-400 mt-2 italic">Layanan restorasi matras sehat profesional Sano Care.</figcaption>
          </figure>

          {/* CTA KHUSUS */}
          <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-[2rem] text-center border-2 border-blue-100 dark:border-slate-700 mt-12">
            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">Konsultasikan Keluhan Anda Sekarang!</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Apakah Anda sering bangun dengan rasa nyeri? Jangan tunggu hingga menjadi saraf kejepit. Hubungi tim ahli kami untuk analisa kasur dan tubuh Anda secara profesional.
            </p>
            <a 
              href="https://wa.me/6285187283900?text=Halo%20Sano,%20saya%20ingin%20analisa%20kasur%20karena%20ada%20keluhan%20sakit."
              target="_blank"
              rel="noreferrer" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all hover:scale-105"
            >
              <MessageCircle size={20} /> Chat WhatsApp Sekarang
            </a>
          </div>
        </>
      )
    },

    // ARTIKEL 4: DAMPAK JANGKA PANJANG (UPDATED CONTENT)
    "dampak-jangka-panjang-kasur-salah": {
      title: "Dampak Jangka Panjang Menggunakan Kasur yang Salah: Bahaya yang Mengintai di Balik Tidur Anda",
      date: "28 Des 2025",
      readTime: "7 Menit Baca",
      image: "/dampak-kasur-salah.jpg",
      content: (
        <>
          {/* INTRO */}
          <p className="lead text-xl font-medium text-slate-700 dark:text-slate-200 mb-6">
            Banyak orang mengabaikan kondisi kasur yang sudah mulai amblas atau tidak stabil dengan alasan "masih bisa dipakai". Padahal, kasur adalah satu-satunya benda yang menyangga tubuh Anda selama 6 hingga 8 jam setiap hari.
          </p>
          <p className="mb-6 text-slate-600 dark:text-slate-300">
            Tanpa disadari, tidur bertahun-tahun di atas kasur yang salah bukan hanya soal tidur yang tidak nyenyak, melainkan tiket menuju <strong>gangguan muskuloskeletal jangka panjang</strong>. Di Klinik Matras by Sano Care, kami sering menemukan kasus di mana kerusakan postur bermula dari tempat tidur yang tidak lagi mampu menjalankan fungsinya.
          </p>

          {/* GAMBAR 1 */}
          <figure className="my-10 w-full rounded-3xl overflow-hidden shadow-lg">
             <img src="/artikel-3-sub1.jpg" alt="Ilustrasi Tulang Belakang Melengkung" className="w-full object-cover" />
             <figcaption className="text-center text-xs text-slate-400 mt-2 italic">Ilustrasi: Perbandingan tulang belakang lurus vs melengkung saat tidur.</figcaption>
          </figure>

          <hr className="border-slate-200 dark:border-slate-800 my-10"/>

          {/* BAGIAN 1: DAMPAK FISIK */}
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6">
            Dampak Kesehatan: Dari Nyeri Hingga Perubahan Struktur Tulang
          </h2>
          <p className="mb-6 text-slate-600 dark:text-slate-300">
            Kerusakan struktur kasur yang dibiarkan bertahun-tahun akan memaksa tubuh beradaptasi secara tidak alami. Berikut adalah dampak serius yang mungkin terjadi:
          </p>
          
          <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-2xl border-l-4 border-red-500 mb-8">
             <ul className="space-y-3 list-disc pl-5 text-sm md:text-base text-slate-700 dark:text-slate-300 marker:text-red-500">
                <li><strong>Pegal & Dehidrasi Otot:</strong> Otot tidak benar-benar istirahat, sirkulasi darah kurang optimal.</li>
                <li><strong>Sakit Bahu & Leher:</strong> Tekanan tidak tepat membuat otot tegang dan saraf terjepit.</li>
                <li><strong>Sakit Kepala:</strong> Aliran darah dan oksigen ke otak terganggu selama tidur.</li>
                <li><strong>Nyeri Pinggang Kronis:</strong> Rasa sakit menetap akibat otot pinggang bekerja keras menahan tubuh.</li>
                <li><strong>Postur Tubuh Tidak Simetris:</strong> Akibat terbiasa tidur di kasur miring/amblas.</li>
                <li><strong>Skoliosis Fungsional:</strong> Tulang belakang bengkok mengikuti bentuk kasur rusak.</li>
                <li><strong>Saraf Kejepit (HNP) Berulang:</strong> Risiko tinggi akibat penekanan diskus tulang belakang.</li>
                <li><strong>Gangguan Sirkulasi Darah:</strong> Kesemutan akibat kasur terlalu keras menekan pembuluh darah.</li>
             </ul>
          </div>

          {/* BAGIAN 2: DAMPAK PSIKOLOGIS */}
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6">
            Dampak Psikologis: Kualitas Hidup Terganggu
          </h2>
          <p className="mb-6 text-slate-600 dark:text-slate-300">
            Kesehatan fisik dan mental saling berkaitan. Saat kualitas tidur terganggu, Anda juga akan merasakan dampak psikologis seperti:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
             <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-100 dark:border-orange-800">
                <h4 className="font-bold text-orange-600 mb-2">Mental & Emosi</h4>
                <ul className="list-disc pl-5 text-sm space-y-1">
                   <li>Mudah stres & cemas (Kortisol naik).</li>
                   <li>Emosi sensitif / mudah marah.</li>
                   <li>Sulit konsentrasi & mudah lupa.</li>
                </ul>
             </div>
             <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                <h4 className="font-bold text-blue-600 mb-2">Fisik & Performa</h4>
                <ul className="list-disc pl-5 text-sm space-y-1">
                   <li>Berat badan mudah naik (Hormon lapar).</li>
                   <li>Risiko mengantuk saat berkendara.</li>
                   <li>Pemulihan otot terganggu (Stamina drop).</li>
                </ul>
             </div>
          </div>

          {/* GAMBAR 2 */}
          <figure className="my-10 w-full rounded-3xl overflow-hidden shadow-lg">
             <img src="/artikel-4-kurangtidur.jpg" alt="Kelelahan Akibat Tidur Buruk" className="w-full object-cover" />
             <figcaption className="text-center text-xs text-slate-400 mt-2 italic">Dampak kualitas tidur buruk terhadap produktivitas kerja.</figcaption>
          </figure>

          <hr className="border-slate-200 dark:border-slate-800 my-10"/>

          {/* BAGIAN 3: SOLUSI SANO */}
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6">
            Sano Care: Memperbaiki Sebelum Terlambat
          </h2>
          <p className="mb-4 text-slate-600 dark:text-slate-300">
            Mencegah kerusakan permanen pada tulang belakang jauh lebih baik daripada mengobatinya. Layanan restorasi kami difokuskan untuk:
          </p>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border-l-4 border-green-500 mb-8">
             <ul className="space-y-3">
               {[
                 "Memperkuat fondasi hingga 5-10x lipat.",
                 "Upgrade lapisan sehat sesuai standar berat badan.",
                 "Mencegah kerusakan postur lebih lanjut.",
                 "Menjaga fungsi tulang belakang pada posisi netral.",
                 "Memastikan Anda mendapatkan Deep Sleep setiap malam."
               ].map((item, idx) => (
                 <li key={idx} className="flex gap-3 items-start text-slate-700 dark:text-slate-300">
                    <span className="bg-green-100 text-green-600 rounded-full p-1 mt-0.5 shrink-0"><CheckCircle2 size={14} /></span>
                    {item}
                 </li>
               ))}
             </ul>
          </div>

          {/* KESIMPULAN */}
          <div className="bg-slate-900 text-white p-8 rounded-[2rem] text-center shadow-xl">
             <h3 className="text-xl font-bold mb-4">Kesimpulan: Jangan Pertaruhkan Kesehatan Anda</h3>
             <p className="text-blue-200 mb-6 leading-relaxed">
               Kasur Anda adalah fondasi kesehatan Anda. Jika Anda mulai merasa sering pegal saat bangun tidur atau melihat kasur sudah mulai amblas, itu adalah sinyal bahaya.
             </p>
             <p className="text-white text-sm opacity-90 mb-8">
               Sano Care membantu Anda memiliki Matras Sehat tanpa harus membeli baru. Kembalikan kenyamanan tidur Anda dan lindungi tulang belakang Anda untuk masa depan yang lebih sehat.
             </p>
             
             {/* CTA Button */}
             <a href="https://wa.me/6285187283900?text=Halo%20Sano,%20saya%20ingin%20cek%20kondisi%20kasur%20saya" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-900 rounded-full font-bold hover:scale-105 transition-transform shadow-lg">
                <MessageCircle size={20} /> Cek Kondisi Kasur Saya
             </a>
          </div>

          {/* GAMBAR 3 */}
          <figure className="my-12 w-full rounded-3xl overflow-hidden shadow-lg">
             <img src="/pelayanan-matras.png" alt="Teknisi Sano Care" className="w-full object-cover" />
             <figcaption className="text-center text-xs text-slate-400 mt-2 italic">Proses pengecekan dan restorasi oleh tim ahli Sano Care.</figcaption>
          </figure>

        </>
      )
    },

    // =================================================================
    // ARTIKEL 5: STRUKTUR KASUR (UPDATED: TECHNICAL DEEP DIVE)
    // =================================================================
    "mengenal-struktur-kasur": {
      title: "Mengenal Struktur Kasur dari Dalam: Mengapa Komponen Matras Menentukan Kesehatan Anda?",
      date: "29 Des 2025",
      readTime: "8 Menit Baca",
      image: "/komponen-kasur.jpg", // Gambar Cover
      content: (
        <>
          {/* INTRO */}
          <p className="lead text-xl font-medium text-slate-700 dark:text-slate-200 mb-6">
            Bagi kebanyakan orang, kasur hanyalah sebuah benda besar empuk yang dibungkus kain indah. Namun, di <strong>Klinik Matras by Sano Care</strong>, kami melihat lebih jauh ke dalam.
          </p>
          <p className="mb-6 text-slate-600 dark:text-slate-300">
            Sebuah kasur adalah sistem rekayasa yang kompleks di mana setiap lapisan dan komponennya memiliki peran vital bagi kesehatan tubuh Anda karena akan menentukan <strong>tekstur & menjaga bentuk tubuh</strong>. Memahami apa yang ada di dalam kasur Anda adalah langkah pertama untuk menyadari mengapa kasur yang salah/rusak bisa berdampak buruk bagi kesehatan.
          </p>

          {/* GAMBAR 1 */}
          <figure className="my-10 w-full rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
             <img src="/hero-section.png" alt="Struktur komponen dalam kasur: fondasi, lapisan kenyamanan, dan kain" className="w-full object-cover" />
             <figcaption className="text-center text-xs text-slate-400 mt-2 italic">Ilustrasi: Potongan lapisan kasur (Cross-Section).</figcaption>
          </figure>

          <hr className="border-slate-200 dark:border-slate-800 my-10"/>

          {/* BAGIAN 1: FONDASI */}
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
            1. Fondasi / Support System (Jantung Kasur)
          </h2>
          <p className="mb-4 text-slate-600 dark:text-slate-300">
            Ini adalah bagian paling krusial. Fondasi menentukan kekuatan, stabilitas, dan daya topang terhadap berat badan Anda. Kesehatan tubuh & tulang Anda ditentukan oleh umur fondasi kasur. Jika bagian ini bermasalah, maka kesehatan tulang belakang Anda taruhannya.
          </p>
          
          <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 mb-6">
            <h4 className="font-bold text-slate-800 dark:text-white mb-3">Komponen Fondasi Umum:</h4>
            <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li><strong>Per / Spring System:</strong> Bonnel Spring (per sambung) atau Pocket Spring (per bungkus). Memberikan daya balik (bounce) dan gaya dorong.</li>
              <li><strong>High-Density (HD) Foam:</strong> Penopang utama kasur busa. Standar MJ untuk fondasi: Busa standar min density 26, Rebonded min density 50, Latex min density 80.</li>
              <li><strong>PE Encasement:</strong> Memberikan kekuatan pinggiran namun tetap memberikan sedikit daya balik.</li>
            </ul>
          </div>

          <div className="bg-blue-100 dark:bg-blue-900/30 p-4 border-l-4 border-blue-600 rounded-r-xl text-sm mb-10">
            <strong>Standar Sano Care:</strong> Fondasi tidak boleh "lembek", "ngeper" berlebih, "fleksibel", atau "patah". Fondasi harus mampu menahan tulang belakang pada posisi netral dengan batas penurunan maksimal <strong>1cm</strong> saat diberi beban.
          </div>

          {/* BAGIAN 2: LAPISAN PENAHAN */}
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
            2. Lapisan Penahan
          </h2>
          <p className="mb-10 text-slate-600 dark:text-slate-300">
            Lapisan ini sangat penting karena berfungsi sebagai pelindung busa jika fondasinya Per/Spring agar tidak mudah robek dan jebol. Material yang biasa digunakan adalah <em>cotton sheet</em>, <em>hard pad</em>, dan serabut kelapa.
          </p>

          {/* BAGIAN 3: COMFORT LAYER */}
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
            3. Lapisan / Comfort Layer
          </h2>
          <p className="mb-6 text-slate-600 dark:text-slate-300">
            Berada tepat di atas fondasi, lapisan ini berfungsi untuk mengatur tingkat kenyamanan dan distribusi tekanan (pressure relief). Lapisan inilah yang membuat Anda merasa rileks saat berbaring.
          </p>

          <div className="grid grid-cols-1 gap-4 mb-6">
            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
               <strong className="text-blue-600 block mb-1">Foam Standard</strong>
               <span className="text-sm text-slate-500">Busa dengan density D12 hingga D50. Semakin padat semakin keras, kecuali ILD-nya rendah maka teksturnya soft.</span>
            </div>
            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
               <strong className="text-green-600 block mb-1">Latex</strong>
               <span className="text-sm text-slate-500">Material alami yang sangat kenyal dan sirkulasi udara baik, namun harus dijaga dari benda asing agar tidak mudah rusak.</span>
            </div>
            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
               <strong className="text-purple-600 block mb-1">Memory Foam</strong>
               <span className="text-sm text-slate-500">Material paling adaptif, mengikuti panas tubuh dan lekuk tubuh secara presisi untuk mengurangi titik tekan.</span>
            </div>
            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
               <strong className="text-orange-600 block mb-1">Rebonded Foam</strong>
               <span className="text-sm text-slate-500">Busa potongan yang dipadatkan (Press). Keras sedikit kenyal. Minimal density 50 untuk pemakaian normal.</span>
            </div>
          </div>

          <p className="mb-6 text-slate-600 dark:text-slate-300 italic">
            "Kombinasi material di atas akan memberikan tekstur dan ketahanan yang berbeda-beda. Ini adalah <strong>resep kunci</strong> dari kenyamanan tidur."
          </p>

          <div className="bg-orange-100 dark:bg-orange-900/30 p-4 border-l-4 border-orange-500 rounded-r-xl text-sm mb-10">
            <strong>Standar Sano Care:</strong> Lapisan tidak boleh terlalu empuk hingga menenggelamkan tubuh, namun tidak boleh terlalu keras hingga menekan saraf dan pembuluh darah.
          </div>

          {/* GAMBAR 2 */}
          <figure className="my-10 w-full rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
             <img src="/artikel-5-lapisan.jpg" alt="Material lapisan kenyamanan matras sehat" className="w-full object-cover h-84" /> 
             {/* Note: Menggunakan video/gambar yang ada sebagai placeholder */}
             <figcaption className="text-center text-xs text-slate-400 mt-2 italic">Ilustrasi: Material lapisan kenyamanan matras sehat Sano Care.</figcaption>
          </figure>

          {/* BAGIAN 4: KAIN */}
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
            4. Kain / Fabric System
          </h2>
          <p className="mb-4 text-slate-600 dark:text-slate-300">
            Kain adalah bagian yang bersentuhan langsung dengan kulit Anda. Perannya jauh lebih besar daripada sekadar estetika. Sistem kain yang baik memberikan:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-10 text-slate-700 dark:text-slate-300">
             <li><strong>Kenyamanan Permukaan:</strong> Kelembutan yang menjaga kulit tidak iritasi.</li>
             <li><strong>Sirkulasi Udara (Breathability):</strong> Memastikan suhu tubuh sejuk, mencegah tungau/jamur.</li>
             <li><strong>Sensasi Tidur:</strong> Teknologi kain masa kini membantu meredakan stres saraf permukaan kulit.</li>
          </ul>

          <hr className="border-slate-200 dark:border-slate-800 my-10"/>

          {/* KESIMPULAN & SOLUSI */}
          <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">Sano Care: Memahami Setiap Detail</h3>
                <p className="text-blue-100 mb-6 leading-relaxed">
                  Mengapa kami menjelaskan ini semua? Karena di Klinik Matras by Sano Care, kami tidak hanya "memperbaiki" penampilan luar. Kami memahami setiap komponen ini secara teknis dan medis.
                </p>
                <div className="bg-white/10 p-4 rounded-xl mb-8 text-left">
                  <ul className="space-y-2 text-sm font-medium">
                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-green-400"/> Fondasi diperkuat agar stabil.</li>
                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-green-400"/> Lapisan disesuaikan presisi dengan berat badan.</li>
                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-green-400"/> Kain diganti untuk higienitas maksimal.</li>
                  </ul>
                </div>
                <p className="font-bold">Jangan biarkan kasur Anda hanya menjadi tumpukan material yang salah.</p>
             </div>
          </div>

          {/* GAMBAR 3 */}
          <figure className="my-10 w-full rounded-3xl overflow-hidden shadow-lg">
             <img src="/after-2.jpg" alt="Teknisi Sano Care Sedang Merakit" className="w-full object-cover" />
             <figcaption className="text-center text-xs text-slate-400 mt-2 italic">Proses restorasi komponen kasur profesional di Sano Care.</figcaption>
          </figure>

          {/* CTA */}
          <div className="text-center mt-12">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Cek Kondisi Dalam Kasur Anda Sekarang!</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
               Apakah kasur Anda sudah terasa tenggelam? Itu tandanya ada komponen di dalamnya yang mengalami kelelahan material.
            </p>
            <a href="https://wa.me/6285187283900?text=Halo%20Sano,%20saya%20ingin%20cek%20komponen%20dalam%20kasur%20saya" 
               className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all hover:scale-105">
               <MessageCircle size={20} /> Diagnosa Gratis
            </a>
          </div>

        </>
      )
    },

    // =================================================================
    // ARTIKEL 6: ORTHOPEDIC VS MATRAS SEHAT (UPDATED CONTENT)
    // =================================================================
    "kasur-ortopedik-untuk-tidur-sehat": {
      title: "Perbedaan Kasur Ortopedik dan Matras Sehat: Mana yang Lebih Baik untuk Tidur Sehat?",
      date: "30 Des 2025",
      readTime: "7 Menit Baca",
      image: "/ortomedic-vs-sehat.jpg", // Gambar cover
      content: (
        <>
          {/* INTRO */}
          <p className="lead text-xl font-medium text-slate-700 dark:text-slate-200 mb-6">
            Di pasaran, banyak kasur dipasarkan sebagai "Kasur Orthopedic" dan diklaim baik untuk tulang belakang. Namun, tidak semua produk tersebut benar-benar dirancang dengan konsep kesehatan tubuh yang tepat.
          </p>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 border-l-4 border-red-500 mb-8 italic text-slate-700 dark:text-slate-300">
            "Mayoritas orang (dari pabrik hingga sales) memahami Kasur Orthopedic = KERAS. Padahal, Kasur Keras ≠ Otomatis Sehat."
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Apa Itu Kasur Orthopedic?</h2>
          <p className="mb-4 text-slate-600 dark:text-slate-300">
            Secara umum, ini merujuk pada kasur yang lebih keras. Tujuannya baik: menopang tulang belakang dan mencegah tubuh tenggelam. Namun, banyak produk hanya menggunakan busa keras tanpa memperhitungkan:
          </p>
          <ul className="list-disc pl-5 space-y-1 mb-6 text-sm text-slate-700 dark:text-slate-300">
             <li>Berat badan pengguna</li>
             <li>Elastisitas yang aman</li>
             <li>Ketepatan tekstur sesuai berat badan</li>
             <li>Aliran darah & saraf permukaan</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Apa Itu Matras Sehat Menurut SANO CARE?</h2>
          <p className="mb-4 text-slate-600 dark:text-slate-300">
            Menurut kami, Matras Sehat bukan soal Keras atau Empuk, tapi <strong>PAS dan PRESISI</strong>. Kami memisahkan fungsi:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
             <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                <strong className="text-blue-600 block mb-1">1. Fondasi (Bawah)</strong>
                <span className="text-sm">Harus Kokoh/Keras untuk keamanan dan fungsi penopangan tubuh jangka panjang.</span>
             </div>
             <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                <strong className="text-green-600 block mb-1">2. Lapisan (Atas)</strong>
                <span className="text-sm">Harus disesuaikan dengan tekanan tubuh untuk mencapai kenyamanan sempurna (Lembut tapi tidak amblas).</span>
             </div>
          </div>

          {/* TABEL PERBANDINGAN */}
          <h3 className="text-xl font-bold mb-4">Perbandingan Head-to-Head</h3>
          <div className="overflow-x-auto mb-10 shadow-lg rounded-2xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white uppercase font-bold">
                <tr>
                  <th className="p-4">Aspek</th>
                  <th className="p-4 text-red-500">Orthopedic Umum</th>
                  <th className="p-4 text-green-500">Matras Sehat SANO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-slate-600 dark:text-slate-300">
                <tr><td className="p-4 font-medium">Konsep</td><td className="p-4">Keras / Padat</td><td className="p-4">Stabil + Adaptif</td></tr>
                <tr><td className="p-4 font-medium">Fokus</td><td className="p-4">Support Permukaan</td><td className="p-4">Menopang Tanpa Menekan</td></tr>
                <tr><td className="p-4 font-medium">Efek Saraf</td><td className="p-4">Berisiko Tekanan Lokal</td><td className="p-4">Terapi Tidur, Minim Tekanan</td></tr>
                <tr><td className="p-4 font-medium">Kenyamanan</td><td className="p-4">Sering Kaku</td><td className="p-4">Nyaman & Aman</td></tr>
              </tbody>
            </table>
          </div>

          {/* MASALAH UMUM */}
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Masalah Kasur Orthopedic Salah Konsep</h2>
          <p className="mb-4 text-slate-600 dark:text-slate-300">
            Banyak pelanggan kami mengeluh: tidur terasa kaku, bahu sakit, pinggang tertekan, dan sering kesemutan. Hal ini terjadi karena kasur keras tanpa distribusi tekanan membuat tubuh bekerja menahan beban semalaman.
          </p>
          <div className="bg-orange-100 dark:bg-orange-900/30 p-4 border-l-4 border-orange-500 mb-8 italic text-slate-700 dark:text-slate-300 font-medium">
            "Padahal saat tidur, tubuh seharusnya beristirahat, bukan bekerja menahan tekanan."
          </div>

          {/* KESIMPULAN */}
          <div className="bg-slate-900 text-white p-8 rounded-[2rem] text-center shadow-xl">
             <h3 className="text-xl font-bold mb-4">Kesimpulan</h3>
             <ul className="text-left list-disc pl-6 space-y-2 mb-6 opacity-90 text-sm md:text-base">
               <li>Kasur orthopedic belum tentu sehat jika hanya mengandalkan kekerasan.</li>
               <li>Matras Sehat SANO CARE memastikan keseimbangan antara <strong>Fondasi Kuat</strong> dan <strong>Lapisan Adaptif</strong>.</li>
               <li>Matras Sehat bukan keras atau empuk — tetapi <strong>TEPAT & PRESISI</strong> sesuai berat tubuh.</li>
             </ul>
             <a href="https://wa.me/6285187283900?text=Halo%20Sano,%20saya%20ingin%20konsultasi%20matras%20sehat" 
                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-900 rounded-full font-bold hover:scale-105 transition-transform shadow-lg">
                <MessageCircle size={20} /> Konsultasi Gratis
             </a>
          </div>
        </>
      )
    }

  };

  // --- LOGIKA RENDER (TETAP SAMA) ---
  const article = articleDatabase[slug || ""];

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-center px-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Artikel Tidak Ditemukan</h1>
        <Link to="/artikel" className="text-blue-600 hover:underline">Kembali ke Daftar</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white dark:bg-slate-900 transition-colors">
      <article className="container mx-auto px-6 max-w-3xl">
        <Link to="/artikel" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 transition-colors">
          <ArrowLeft size={20} /> Kembali ke Daftar
        </Link>
        <div className="mb-10 text-center">
          <div className="flex justify-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
             <span className="flex items-center gap-1"><Calendar size={14}/> {article.date}</span>
             <span className="flex items-center gap-1"><Clock size={14}/> {article.readTime}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-8 leading-tight">{article.title}</h1>
          <div className="w-full aspect-video rounded-3xl overflow-hidden mb-8 shadow-xl">
             <img src={article.image} className="w-full h-full object-cover" alt={article.title} />
          </div>
        </div>
        <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed">
           {article.content}
        </div>
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-8 text-center text-white shadow-xl">
           <h3 className="text-2xl font-bold mb-2">Konsultasikan Keluhan Anda!</h3>
           <p className="mb-6 opacity-90">Jangan tunggu hingga menjadi saraf kejepit. Hubungi kami untuk analisa profesional.</p>
           <a href="https://wa.me/6289528011264" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-full font-bold hover:scale-105 transition-transform">
              <MessageCircle size={20} /> Chat WhatsApp Sekarang
           </a>
        </div>
      </article>
    </div>
  );
};

export default ArtikelDetail;