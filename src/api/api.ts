import axios from 'axios';

const API_BASE_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_BASE_URL
  : '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Ne pas rediriger ni logger si c'est un appel de vérification silencieux
    const isAuthCheck = error.config?.url?.includes('/users/me');
    const isStartInvestigation = error.config?.url?.includes('/start');
    const isSilentCall = isAuthCheck || isStartInvestigation;
    
    if (error.response?.status === 401 && !isSilentCall) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;