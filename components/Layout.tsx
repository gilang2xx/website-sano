import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Menu, X, Phone, MapPin, Mail, Instagram, ChevronDown,
  Facebook // Pastikan ini ada
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { NAV_LINKS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State untuk Dropdown Mobile
  const [isLayananOpen, setIsLayananOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 dark:text-text-dark bg-bg-light dark:bg-bg-dark transition-colors duration-300 overflow-x-hidden">
      
      {/* Floating Pill Navbar */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 transition-all duration-300">
        <div className="bg-white dark:bg-slate-900/95 backdrop-blur-sm rounded-full shadow-xl px-6 py-3 md:px-8 flex items-center gap-4 border border-slate-100 dark:border-slate-800">
          
          {/* LOGO */}
          <NavLink 
            to="/" 
            className="block group select-none shrink-0 cursor-pointer"
            onClick={() => window.scrollTo(0, 0)}
          >
             {/* 1. LOGO LIGHT MODE */}
             <img
                src="/klinikmatras-light.png"
                alt="SANO Logo"
                className="h-9 md:h-12 w-auto object-contain block dark:hidden" 
              />
              {/* 2. LOGO DARK MODE */}
              <img
                src="/klinikmatras-dark.png"
                alt="SANO Logo Dark"
                className="h-9 md:h-12 w-auto object-contain hidden dark:block"
              />
          </NavLink>

          {/* Desktop Nav (Rata Kanan dengan ml-auto) */}
          <nav className="hidden md:flex items-center gap-1 ml-auto">
            {NAV_LINKS.map((link) => {
              
              if (link.name === 'Layanan') {
                return (
                  <div key={link.path} className="relative group">
                    <button className="flex items-center gap-1 px-4 py-2 rounded-full font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-all duration-200">
                      Layanan <ChevronDown size={16} className="mt-0.5" />
                    </button>
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="py-2">
                        <NavLink to="/klinik-matras" className="block px-6 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          Klinik Matras
                        </NavLink>
                        <NavLink to="/klinik-sofa" className="block px-6 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-slate-700 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                          Klinik Sofa
                        </NavLink>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200 ${
                      isActive
                        ? 'text-primary bg-blue-50 dark:bg-white/10 dark:text-primary-light'
                        : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button 
              className="md:hidden text-slate-600 dark:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full mt-4 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 flex flex-col gap-4">
              {NAV_LINKS.map((link) => {
                if (link.name === 'Layanan') {
                  return (
                    <div key={link.path}>
                      <button 
                        onClick={() => setIsLayananOpen(!isLayananOpen)}
                        className="flex items-center justify-between w-full text-lg font-bold text-slate-800 dark:text-white"
                      >
                        Layanan <ChevronDown size={20} className={`transition-transform ${isLayananOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {isLayananOpen && (
                        <div className="pl-4 mt-2 space-y-2 border-l-2 border-slate-100 dark:border-slate-800 ml-1">
                          <NavLink to="/klinik-matras" className="block py-2 text-slate-600 dark:text-slate-400 font-medium hover:text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>Klinik Matras</NavLink>
                          <NavLink to="/klinik-sofa" className="block py-2 text-slate-600 dark:text-slate-400 font-medium hover:text-orange-600" onClick={() => setIsMobileMenuOpen(false)}>Klinik Sofa</NavLink>
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) => `text-lg font-bold transition-colors ${isActive ? 'text-primary dark:text-primary-light' : 'text-slate-800 dark:text-white'}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </NavLink>
                );
              })}
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-bg-surface text-white py-16 border-t border-slate-800">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* KOLOM 1: LOGO */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <img src="/klinikmatras-dark.png" alt="SANO Logo" className="h-12 w-auto object-contain"/>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Solusi terbaik untuk kenyamanan tidur Kamu. Kami memperbaiki, memodifikasi, dan merawat matras Kamu dengan standar kesehatan tertinggi.
            </p>
          </div>

          {/* KOLOM 2: LINK LAYANAN */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-primary-light">Layanan Kami</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><NavLink to="/klinik-matras" className="hover:text-white transition-colors">Service Fondasi Matras</NavLink></li>
              <li><NavLink to="/klinik-matras" className="hover:text-white transition-colors">Upgrade Fondasi</NavLink></li>
              <li><NavLink to="/klinik-matras" className="hover:text-white transition-colors">Upgrade Lapisan Matras</NavLink></li>
              <li><NavLink to="/klinik-matras" className="hover:text-white transition-colors">Paket Upgrade Fondasi + Lapisan</NavLink></li>
              <li><NavLink to="/klinik-matras" className="hover:text-white transition-colors">Full Upgrade Matras (All in)</NavLink></li>
              <li><NavLink to="/klinik-matras" className="hover:text-white transition-colors">Penyesuaian Tekstur</NavLink></li>
              <li><NavLink to="/klinik-matras" className="hover:text-white transition-colors">Upgrade Latex</NavLink></li>
              <li><NavLink to="/klinik-sofa" className="hover:text-white transition-colors">Klinik Sofa</NavLink></li>
            </ul>
          </div>

          {/* KOLOM 3: KONTAK */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-primary-light">Kontak</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-secondary shrink-0 mt-0.5" />
                <span>Jl. Raya Keadilan, Gg Asrama Polri, No. 81, RT 5/12, Pancoran Mas, Kota Depok, Jawa Barat</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-secondary shrink-0" />
                <span>0851 8728 3900</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-secondary shrink-0" />
                <span>sanocareofficial@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* KOLOM 4: JAM OPERASIONAL & SOSMED */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-primary-light">Jam Operasional</h4>
            
            <div className="mb-6">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Workshop</p>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li className="flex justify-between"><span>Senin - Jumat</span><span>08:00 - 17:00</span></li>
                <li className="flex justify-between"><span>Sabtu</span><span>08:00 - 15:00</span></li>
                <li className="flex justify-between"><span>Minggu</span><span className="text-red-400">Tutup</span></li>
              </ul>
            </div>

            <div className="mb-6">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Konsultasi Online</p>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/10">
                  <span>Setiap Hari</span>
                  <span className="font-bold text-green-400">08:00 - 22:00</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-4 mt-6">
               <a href="https://www.instagram.com/klinikmatras" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 transition-colors text-white group" title="Instagram">
                 <Instagram size={20} className="group-hover:scale-110 transition-transform" />
               </a>
               <a href="https://www.facebook.com/profile.php?id=61585849820810" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors text-white group" title="Facebook">
                 <Facebook size={20} className="group-hover:scale-110 transition-transform" />
               </a>
               <a href="https://www.tiktok.com/@sanocare" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-black hover:border hover:border-slate-600 transition-colors text-white group" title="TikTok">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
               </a>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="container mx-auto px-6 mt-16 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} KLINIK MATTRESS by SANO CARE. All rights reserved.
        </div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON (STILL / TANPA ANIMASI GERAK) */}
      <div 
        className="fixed bottom-6 right-6 z-[100] group cursor-pointer"
        onClick={() => {
          // 1. LAPOR KE GOOGLE ADS
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'conversion', {
                'send_to': 'AW-123456789/LabelKonversiAnda' 
            });
          }
          // 2. BUKA WHATSAPP
          window.open("https://wa.me/6285187283900?text=Halo%20Sano,%20saya%20tertarik%20konsultasi", "_blank");
        }}
      >
        {/* HAPUS: Span animate-ping yang bikin berdenyut */}
        
        {/* Efek Glow Halus (Hanya muncul saat kursor diarahkan/Hover) */}
        <div className="absolute inset-0 rounded-full bg-green-400 blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>

        {/* Tombol Utama (Diam/Still) */}
        <div className="relative bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform group-hover:scale-110 flex items-center justify-center border-2 border-white/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white" className="fill-current">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
        </div>
      </div>

    </div>
  );
};

export default Layout;