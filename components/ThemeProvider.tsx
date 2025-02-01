'use client';

import { useEffect, useState } from "react";
import MatrixRain from "./MatrixRain";

const ThemeProvider = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Initialisation
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    // Écouter les changements de thème
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme') {
        setTheme(e.newValue || 'light');
      }
    };

    // Pour les changements dans le même onglet
    const handleCustomThemeChange = (e: CustomEvent) => {
      setTheme(e.detail || 'light');
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('themeChange', handleCustomThemeChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themeChange', handleCustomThemeChange as EventListener);
    };
  }, []);

  return theme === 'hacker' ? <MatrixRain /> : null;
};

export default ThemeProvider; 