import { useState, useEffect } from 'react';
import { getInvestigations } from '../services/investigationService';
import type { Investigation } from '../types/investigation';

export const useInvestigations = () => {
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadInvestigations = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const data = await getInvestigations();
        setInvestigations(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Erreur lors du chargement des investigations:', error);
        setLoadError('Impossible de charger les enquêtes. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    loadInvestigations();
  }, []);

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (!document.hidden) {
        try {
          const data = await getInvestigations();
          if (Array.isArray(data)) {
            setInvestigations(data);
          }
        } catch (error) {
          console.error('Erreur lors du rafraîchissement:', error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return { investigations, loading, loadError };
};