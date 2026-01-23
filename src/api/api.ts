import axios from 'axios';

interface Investigation {
  id: number;
  titre: string;
  description: string;
  difficulte: 'Facile' | 'Moyen' | 'Difficile';
  statut: 'Disponible' | 'En cours' | 'Terminée';
  databaseId: string;
}

const API_BASE_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_BASE_URL
  : '/';

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getInvestigations = async (): Promise<Investigation[]> => {
  const response = await axios.get('/api/investigations');
  return Array.isArray(response.data) ? response.data : [];
};

export const startInvestigation = async (investigationId: number, databaseId: string): Promise<void> => {
  await axios.post(`/api/investigations/${investigationId}/start`, { databaseId });
};

export const getInvestigationDetails = async (investigationId: number): Promise<Investigation> => {
  const response = await axios.get(`/api/investigations/${investigationId}`);
  return response.data;
};

export const executeSQL = async (investigationId: number, sql: string): Promise<any> => {
  const response = await axios.post(`/api/investigations/${investigationId}/execute`, { sql });
  return response.data;
};

export const getHints = async (investigationId: number): Promise<string[]> => {
  const response = await axios.get(`/api/investigations/${investigationId}/hints`);
  return response.data;
};