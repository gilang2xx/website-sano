import React, { useState } from 'react';
import { Phone, MapPin, Mail, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { submitConsultationLead } from '../utils/leadTracking';

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const SERVICE_TYPES = [
  { value: 'klinik_matras', label: 'Klinik Matras' },
  { value: 'klinik_sofa', label: 'Klinik Sofa' },
  { value: 'sano_clean', label: 'Sano Clean' },
];

const Kontak: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    serviceType: SERVICE_TYPES[0].value,
    message: '',
  });
  const [status, setStatus] = useState<SubmitStatus>('idle');

  const handleChange = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setStatus('error');
      return;
    }

    setStatus('submitting');

    const result = await submitConsultationLead({
      firstName: form.name.trim().split(' ')[0],
      email: form.email.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
      leadType: 'consultation_form',
      serviceType: form.serviceType,
    });

    if (result.ok) {
      setStatus('success');
      setForm({ name: '', email: '', phone: '', city: '', serviceType: SERVICE_TYPES[0].value, message: '' });
    } else {
      setStatus('error');
    }
  };

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
                       <div><h4 className="font-bold text-lg mb-1">Telepon / WhatsApp</h4><p className="text-blue-100">0851 8728 3900</p></div>
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
                 <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Konsultasi Gratis</h2>
                 <form className="space-y-6" onSubmit={handleSubmit}>
                    <div><label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nama Lengkap</label><input required type="text" value={form.name} onChange={handleChange('name')} className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-bg-surface border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all" /></div>
                    <div><label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email</label><input required type="email" value={form.email} onChange={handleChange('email')} className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-bg-surface border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all" /></div>
                    <div><label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nomor WhatsApp</label><input required type="tel" value={form.phone} onChange={handleChange('phone')} className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-bg-surface border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all" /></div>
                    <div><label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Kota</label><input type="text" value={form.city} onChange={handleChange('city')} className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-bg-surface border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all" /></div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Layanan yang Diminati</label>
                      <select value={form.serviceType} onChange={handleChange('serviceType')} className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-bg-surface border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all">
                        {SERVICE_TYPES.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div><label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Keluhan</label><textarea rows={4} value={form.message} onChange={handleChange('message')} className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-bg-surface border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"></textarea></div>

                    {status === 'success' && (
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-bold"><CheckCircle2 size={18} /> Terima kasih! Tim kami akan segera menghubungi Anda.</div>
                    )}
                    {status === 'error' && (
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-bold"><AlertCircle size={18} /> Mohon lengkapi Nama, Email, dan Nomor WhatsApp, lalu coba lagi.</div>
                    )}

                    <button type="submit" disabled={status === 'submitting'} className="w-full bg-primary hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
                      {status === 'submitting' ? 'Mengirim...' : 'Kirim Konsultasi'} <Send size={18} />
                    </button>
                 </form>
              </div>
           </div>
        </div>
        <div className="mt-12 h-96 w-full rounded-3xl overflow-hidden shadow-lg">
           <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d507510.411991499!2d106.20719207343748!3d-6.403652099999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69e914bf9be9ef%3A0x20b7a81c2eee9782!2sKLINIK%20MATRAS%20by%20SANO%20CARE!5e0!3m2!1sen!2sid!4v1766639164800!5m2!1sen!2sid" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Map Location" className="filter grayscale hover:grayscale-0 transition-all duration-500"></iframe>
        </div>
      </div>
    </div>
  );
};

export default Kontak;
