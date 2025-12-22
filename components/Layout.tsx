import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Menu, X, Phone, MapPin, Mail, Instagram, 
  ChevronDown // <--- Tambahkan Icon Panah Bawah
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
        <div className="bg-white dark:bg-slate-900/95 backdrop-blur-sm rounded-full shadow-xl px-6 py-3 md:px-8 flex items-center justify-between border border-slate-100 dark:border-slate-800">
          
          {/* 1. LOGO LIGHT MODE (Smaller Size) */}
             <NavLink 
            to="/" 
            className="block group select-none shrink-0 cursor-pointer"
            onClick={() => window.scrollTo(0, 0)} // Tambahan: Scroll ke atas saat diklik
          >
             <img
                src="/sanocare-light.png"
                alt="SANO Logo"
                // GANTI JADI INI:
                // h-6 (24px) di HP | h-9 (36px) di Laptop
                className="h-6 md:h-9 w-auto object-contain block dark:hidden" 
              />

              {/* 2. LOGO DARK MODE (Smaller Size) */}
              <img
                src="/sanocare-dark.png"
                alt="SANO Logo Dark"
                // Samakan ukurannya
                className="h-6 md:h-9 w-auto object-contain hidden dark:block"
              />
              </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              
              // --- LOGIKA DROPDOWN KHUSUS MENU "LAYANAN" ---
              if (link.name === 'Layanan') {
                return (
                  <div key={link.path} className="relative group">
                    <button 
                      className="flex items-center gap-1 px-4 py-2 rounded-full font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-all duration-200"
                    >
                      Layanan <ChevronDown size={16} className="mt-0.5" />
                    </button>

                    {/* Dropdown Content */}
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="py-2">
                        <NavLink 
                          to="/klinik-matras" 
                          className="block px-6 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          Klinik Matras
                        </NavLink>
                        <NavLink 
                          to="/klinik-sofa" 
                          className="block px-6 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-slate-700 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                        >
                          Klinik Sofa
                        </NavLink>
                      </div>
                    </div>
                  </div>
                );
              }

              // --- MENU BIASA (SELAIN LAYANAN) ---
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
                
                // --- MOBILE DROPDOWN LAYANAN ---
                if (link.name === 'Layanan') {
                  return (
                    <div key={link.path}>
                      <button 
                        onClick={() => setIsLayananOpen(!isLayananOpen)}
                        className="flex items-center justify-between w-full text-lg font-bold text-slate-800 dark:text-white"
                      >
                        Layanan <ChevronDown size={20} className={`transition-transform ${isLayananOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {/* Submenu Mobile */}
                      {isLayananOpen && (
                        <div className="pl-4 mt-2 space-y-2 border-l-2 border-slate-100 dark:border-slate-800 ml-1">
                          <NavLink 
                            to="/klinik-matras" 
                            className="block py-2 text-slate-600 dark:text-slate-400 font-medium hover:text-blue-600"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Klinik Matras
                          </NavLink>
                          <NavLink 
                            to="/klinik-sofa" 
                            className="block py-2 text-slate-600 dark:text-slate-400 font-medium hover:text-orange-600"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Klinik Sofa
                          </NavLink>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `text-lg font-bold transition-colors ${
                        isActive ? 'text-primary dark:text-primary-light' : 'text-slate-800 dark:text-white'
                      }`
                    }
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
              <img
                src="/sanocare-dark.png" 
                alt="SANO Logo"
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Solusi terbaik untuk kenyamanan tidur Anda. Kami memperbaiki, memodifikasi, dan merawat matras Anda dengan standar kesehatan tertinggi.
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
                <span>+62 895 2801 1264</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-secondary shrink-0" />
                <span>sanocareofficial@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* KOLOM 4: JAM OPERASIONAL */}
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

            <div className="flex gap-4">
               <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors text-white">
                 <Instagram size={20} />
               </a>
            </div>
          </div>

        </div>
        <div className="container mx-auto px-6 mt-16 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} KLINIK MATTRESS by SANO CARE. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;