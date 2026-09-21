import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Theme } from '../types';

const ThemeToggle: React.FC = () => {
  // Render awal HARUS sama dengan HTML hasil prerender (server tidak punya
  // localStorage), jadi selalu mulai dari LIGHT. Preferensi tersimpan dibaca
  // di effect sesudah hydration. Class `dark` di <html> sudah dipasang lebih
  // awal oleh skrip inline di index.html supaya tidak ada kilatan terang.
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem('theme');
    } catch {
      // localStorage bisa diblokir (mode privat) -- pakai default terang.
    }
    if (stored === Theme.DARK) setTheme(Theme.DARK);
  }, []);

  const applyTheme = (next: Theme) => {
    const root = window.document.documentElement;
    if (next === Theme.DARK) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('theme', next);
    } catch {
      // abaikan -- tema tetap berlaku untuk sesi ini.
    }
  };

  const toggleTheme = () => {
    const next = theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
    setTheme(next);
    applyTheme(next);
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative h-10 w-20 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-bg-dark
        ${theme === Theme.DARK ? 'bg-bg-surface border border-gray-700' : 'bg-blue-100 border border-blue-200'}
      `}
      aria-label="Toggle Dark Mode"
    >
      <div className="flex h-full w-full items-center justify-between px-2">
        <Sun size={14} className="text-yellow-500" />
        <Moon size={14} className="text-primary-light" />
      </div>
      
      <span
        className={`
          absolute left-1 top-1 h-8 w-8 rounded-full shadow-md transition-transform duration-300 flex items-center justify-center
          ${theme === Theme.DARK ? 'translate-x-10 bg-primary' : 'translate-x-0 bg-white'}
        `}
      >
        {theme === Theme.DARK ? (
          <Moon size={16} className="text-white" />
        ) : (
          <Sun size={16} className="text-yellow-500" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;