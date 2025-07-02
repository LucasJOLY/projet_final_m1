import axios from 'axios';
import { getTokens, isTokenExpired, refreshToken } from '../auth/service';

export const configAPI = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token à chaque requête
configAPI.interceptors.request.use(
  async (config) => {
    const { access_token } = getTokens();
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer le rafraîchissement automatique du token
configAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si l'erreur est 401 et que nous n'avons pas déjà tenté de rafraîchir le token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isTokenExpired()) {
        originalRequest._retry = true;

        try {
          const newAccessToken = await refreshToken();
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return configAPI(originalRequest);
        } catch (refreshError) {
          // Si le rafraîchissement échoue, on déconnecte l'utilisateur
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);
