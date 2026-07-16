import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Theme } from '../types';

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || Theme.LIGHT;
    }
    return Theme.LIGHT;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === Theme.DARK) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === Theme.LIGHT ? Theme.DARK : Theme.LIGHT));
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