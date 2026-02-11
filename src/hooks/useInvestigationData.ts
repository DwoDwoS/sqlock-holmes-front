import { useState, useEffect } from 'react';
import { getInvestigationDetails } from '../services/investigationService';
import type { Investigation } from '../types/investigation';
import { getMockInvestigationData } from '../utils/investigationUtils';

export const useInvestigationData = (id: string | undefined) => {
  const [investigation, setInvestigation] = useState<Investigation | null>(null);
  const [loading, setLoading] = useState(true);

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
      } catch {
        setInvestigation(mockData);
      }

      setLoading(false);
    };

    loadInvestigation();
  }, [id]);

  return { investigation, loading };
};