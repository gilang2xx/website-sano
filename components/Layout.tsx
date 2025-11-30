import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MapPin, Mail, Instagram } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { NAV_LINKS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
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
          <NavLink to="/" className="block group select-none shrink-0 -ml-3 md:-ml-4">
  <div className="h-8 md:h-10 flex items-center">
    
    {/* 1. LOGO LIGHT MODE (Muncul saat terang, Hilang saat gelap) */}
    <img
      src="/sano-light.png"   // Pastikan ada garis miring di depan
      alt="SANO Logo"
      className="h-8 md:h-14 w-auto object-contain block dark:hidden" 
    />

    {/* 2. LOGO DARK MODE (Hilang saat terang, Muncul saat gelap) */}
    <img
      src="/sano-dark.png"    // Pastikan file ini ada di folder public
      alt="SANO Logo Dark"
      className="h-8 md:h-14 w-auto object-contain hidden dark:block"
    />
  </div>
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
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
            ))}
            
            {/* Vertical Divider */}
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-4"></div>
            
            {/* Theme Toggle */}
            <ThemeToggle />
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl transform transition-transform duration-300 ease-in-out pt-32 px-6 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
      >
        <div className="flex flex-col gap-6 text-center">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-xl font-bold py-3 border-b border-slate-100 dark:border-slate-800 ${
                  isActive ? 'text-primary dark:text-primary-light' : 'text-slate-600 dark:text-slate-400'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <div className="flex justify-center mt-6">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* FLOATING WHATSAPP BUTTON */}
      <a 
        href="https://wa.me/6289528011264?text=Halo,%20saya%20butuh%20bantuan%20seputar%20layanan%20Sano%20Care."
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        aria-label="Chat WhatsApp"
      >
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75 group-hover:opacity-100 duration-1000"></span>
        <div className="relative">
          {/* SVG WhatsApp Logo */}
          <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
             <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </div>
      </a>

      {/* Footer */}
      <footer className="bg-bg-surface text-white py-16 border-t border-slate-800">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
             <div className="flex items-center gap-2 mb-4">
              {/* BRAND LOGO FOR FOOTER */}
              <img
              src="/sano-dark.png"  // Gunakan logo yang teksnya PUTIH
              // alt="SANO Logo"
              // className="h-8 w-auto object-contain"
              />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Solusi terbaik untuk kenyamanan tidur Anda. Kami memperbaiki, memodifikasi, dan merawat matras Anda dengan standar kesehatan tertinggi.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-primary-light">Layanan Kami</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li><NavLink to="/layanan" className="hover:text-white transition-colors">Service & Repair</NavLink></li>
              <li><NavLink to="/layanan" className="hover:text-white transition-colors">Upgrade Matras</NavLink></li>
              <li><NavLink to="/layanan" className="hover:text-white transition-colors">Custom Size</NavLink></li>
              <li><NavLink to="/layanan" className="hover:text-white transition-colors">Cuci Matras</NavLink></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-primary-light">Kontak</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-secondary shrink-0 mt-0.5" />
                <span>Jl. Raya Keadilan No. 63, Rangakapan Jaya Baru, Kota Depok, Jawa Barat</span>
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
          
           <div>
            <h4 className="text-lg font-bold mb-6 text-primary-light">Jam Operasional</h4>
             <ul className="space-y-2 text-slate-400 text-sm">
                <li className="flex justify-between"><span>Senin - Jumat</span> <span className="text-white">08:00 - 17:00</span></li>
                <li className="flex justify-between"><span>Sabtu</span> <span className="text-white">08:00 - 15:00</span></li>
                <li className="flex justify-between"><span>Minggu</span> <span className="text-secondary">Tutup</span></li>
             </ul>
             <div className="mt-6 flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors text-white">
                  <Instagram size={20} />
                </a>
             </div>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-16 pt-8 border-t border-slate-800 text-center text-slate-500 text-xs">
          &copy; {new Date().getFullYear()} KLINIK MATTRESS by SANO CARE. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;