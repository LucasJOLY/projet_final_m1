import { useState, useEffect } from 'react';

export const useLanguage = () => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || 'fr';
  });

  const changeLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  useEffect(() => {
    // Émettre un événement personnalisé pour notifier le changement de langue
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language } }));
  }, [language]);

  return { language, changeLanguage };
};
