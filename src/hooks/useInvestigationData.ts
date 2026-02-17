import { useState, useEffect } from 'react';
import { getInvestigationDetails } from '../services/investigationService';
import type { Investigation } from '../types/investigation';
import { getMockInvestigationData } from '../utils/investigationUtils';
import { AxiosError } from 'axios';

export const useInvestigationData = (id: string | undefined) => {
  const [investigation, setInvestigation] = useState<Investigation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInvestigation = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      const investigationId = parseInt(id);
      const mockData = getMockInvestigationData(investigationId);

      try {
        const data = await getInvestigationDetails(investigationId);
        setInvestigation({ ...mockData, ...data, image: data.image || mockData.image });
        setError(null);
      } catch (err) {
        const axiosError = err as AxiosError;
        if (axiosError.response?.status === 500) {
          setError('Le serveur rencontre des difficultés. Vous utilisez des données de démonstration.');
        } else if (axiosError.response?.status === 404) {
          setError('Cette enquête n\'est pas encore disponible sur le serveur. Vous utilisez des données de démonstration.');
        } else {
          setError('Impossible de se connecter au serveur. Vous utilisez des données de démonstration.');
        }
        setInvestigation(mockData);
      }

      setLoading(false);
    };

    loadInvestigation();
  }, [id]);

  return { investigation, loading, error };
};