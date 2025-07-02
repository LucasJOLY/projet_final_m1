import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('isDarkMode');
    return saved === 'true';
  });

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('isDarkMode', newDarkMode.toString());
  };

  useEffect(() => {
    // Émettre un événement personnalisé pour notifier le changement de thème
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { isDarkMode } }));
  }, [isDarkMode]);

  return { isDarkMode, toggleTheme };
};
