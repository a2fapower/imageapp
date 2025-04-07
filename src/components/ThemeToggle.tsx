import { useState, useEffect } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference or stored preference
    const isDark = localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button 
      onClick={toggleTheme}
      className="fixed top-4 right-4 p-3 rounded-full bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-200 z-10"
      aria-label="Toggle dark mode"
    >
      {darkMode ? (
        <SunIcon className="h-5 w-5 text-amber-400" />
      ) : (
        <MoonIcon className="h-5 w-5 text-slate-700" />
      )}
    </button>
  );
};

export default ThemeToggle; 