import React from 'react';
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

const language = localStorage.getItem('language') || 'fr';
const isDarkMode = localStorage.getItem('isDarkMode') === 'true';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
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
              theme='light'
            />
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </IntlProvider>
    </Provider>
  </React.StrictMode>
);
