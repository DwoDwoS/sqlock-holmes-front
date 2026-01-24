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
    
    console.log('Requête API:', config.method?.toUpperCase(), config.url, 
                'Headers:', config.headers);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erreur API:', {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    if (error.response?.status === 403) {
      console.error('Accès refusé (403) - Vérifiez votre authentification et vos permissions');
    }

    return Promise.reject(error);
  }
);

export default api;