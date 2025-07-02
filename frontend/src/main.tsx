import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import App from './App';
import { theme, darkTheme } from './theme/theme';
import { store } from './store';
import { messages } from './language/config/translation';
import { IntlProvider } from 'react-intl';

const AppWrapper = () => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'fr');
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('isDarkMode') === 'true');

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      setLanguage(event.detail.language);
    };

    const handleThemeChange = (event: CustomEvent) => {
      setIsDarkMode(event.detail.isDarkMode);
    };

    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    window.addEventListener('themeChanged', handleThemeChange as EventListener);

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
      window.removeEventListener('themeChanged', handleThemeChange as EventListener);
    };
  }, []);

  return (
    <Provider store={store}>
      <IntlProvider locale={language} messages={messages[language as keyof typeof messages]}>
        <BrowserRouter>
          <ThemeProvider theme={isDarkMode ? darkTheme : theme}>
            <CssBaseline />
            <ToastContainer
              position='top-right'
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme={isDarkMode ? 'dark' : 'light'}
              style={
                {
                  fontFamily: 'Nunito',
                  '--toastify-color-dark': '#1b2431',
                  '--toastify-bg-color-dark': '#1b2431',
                  '--toastify-color-progress-dark': '#4780ff',
                  '--toastify-border-radius': '20px',
                } as React.CSSProperties
              }
            />
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </IntlProvider>
    </Provider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<AppWrapper />);
