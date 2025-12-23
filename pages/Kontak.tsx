import React from 'react';
import { Phone, MapPin, Mail, Clock, Send } from 'lucide-react';

const Kontak: React.FC = () => {
  return (
    <div className="pb-24">
      <section className="bg-bg-surface text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Hubungi Kami</h1>
          <p className="text-slate-300 text-lg">Kami siap membantu mengembalikan kenyamanan tidur Anda.</p>
        </div>
      </section>

      <div className="container mx-auto px-6 -mt-10">
        <div className="bg-white dark:bg-bg-dark rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
           <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-10 lg:p-16 bg-primary text-white">
                 <h2 className="text-3xl font-bold mb-8">Informasi Kontak</h2>
                 <p className="mb-10 text-blue-100">Silakan hubungi kami melalui WhatsApp untuk respon cepat, atau kunjungi workshop kami.</p>
                 <div className="space-y-8">
                    <div className="flex items-start gap-4">
                       <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0"><MapPin size={24} /></div>
                       <div><h4 className="font-bold text-lg mb-1">Alamat</h4><p className="text-blue-100">Jl. Raya Keadilan, Gg Asrama Polri, No. 81, RT 5/12, Pancoran Mas, Kota Depok, Jawa Barat</p></div>
                    </div>
                    <div className="flex items-start gap-4">
                       <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0"><Phone size={24} /></div>
                       <div><h4 className="font-bold text-lg mb-1">Telepon / WhatsApp</h4><p className="text-blue-100">+62 895 2801 1264</p></div>
                    </div>
                    <div className="flex items-start gap-4">
                       <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0"><Mail size={24} /></div>
                       <div><h4 className="font-bold text-lg mb-1">Email</h4><p className="text-blue-100">sanocareofficial@gmail.com</p></div>
                    </div>
                    <div className="flex items-start gap-4">
                       <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0"><Clock size={24} /></div>
                       <div><h4 className="font-bold text-lg mb-1">Jam Operasional</h4><p className="text-blue-100">Senin - Jumat: 08:00 - 17:00</p><p className="text-blue-100">Sabtu: 08:00 - 15:00</p></div>
                    </div>
                 </div>
              </div>
              <div className="p-10 lg:p-16 bg-white dark:bg-bg-dark">
                 <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Kirim Keluhan</h2>
                 <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div><label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nama Lengkap</label><input type="text" className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-bg-surface border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all" /></div>
                    <div><label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nomor WhatsApp</label><input type="tel" className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-bg-surface border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all" /></div>
                    <div><label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Keluhan</label><textarea rows={4} className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-bg-surface border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"></textarea></div>
                    <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">Kirim Keluhan <Send size={18} /></button>
                 </form>
              </div>
           </div>
        </div>
        <div className="mt-12 h-96 w-full rounded-3xl overflow-hidden shadow-lg">
           <iframe src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d991.2311852704305!2d106.78333276966158!3d-6.403697499599185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNsKwMjQnMTMuMyJTIDEwNsKwNDcnMDIuMyJF!5e0!3m2!1sen!2sid!4v1766138288503!5m2!1sen!2sid" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Map Location" className="filter grayscale hover:grayscale-0 transition-all duration-500"></iframe>
        </div>
      </div>
    </div>
  );
};

export default Kontak;