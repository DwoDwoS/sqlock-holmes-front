import { useState } from 'react';
import { HintsService } from '../services/hintsService';
import type { Hint, HintCount } from '../types/investigation';
import { getMockHints } from '../utils/investigationUtils';
import { useToast } from './useToast';

export const useHints = (investigationId: number | undefined) => {
  const toast = useToast();
  const [hints, setHints] = useState<Hint[]>([]);
  const [hintCount, setHintCount] = useState<HintCount | null>(null);
  const [loading, setLoading] = useState(false);

  const loadHints = async () => {
    if (!investigationId) return;

    const token = localStorage.getItem('token');
    if (!token) {
      const mockData = getMockHints(investigationId);
      setHints(mockData.map(hint => ({ ...hint, locked: false })));
      setHintCount({ unlocked: mockData.length, total: mockData.length, remaining: 0 });
      return;
    }

    setLoading(true);
    try {
      const [hintsData, countData] = await Promise.all([
        HintsService.getHints(investigationId),
        HintsService.getHintCount(investigationId)
      ]);
      
      type ApiHintData = Hint & { text?: string };
      
      const normalizedHints: Hint[] = hintsData.map((hint: ApiHintData) => ({
        id: hint.id,
        content: hint.content || hint.text || '',
        locked: hint.locked || false
      }));
      
      setHints(normalizedHints);
      setHintCount(countData);
    } catch (error) {
      console.error('Erreur lors du chargement des indices depuis le back-end, utilisation des données mockées:', error);
      const mockData = getMockHints(investigationId);
      setHints(mockData.map(hint => ({ ...hint, locked: false })));
      setHintCount({ unlocked: mockData.length, total: mockData.length, remaining: 0 });
    } finally {
      setLoading(false);
    }
  };

  const unlockNextHintHandler = async () => {
    if (!investigationId || !hintCount || hintCount.remaining === 0) return;

    try {
      const unlockedHint = await HintsService.unlockNextHint(investigationId);
      const hintWithText = unlockedHint as Hint & { text?: string };
      setHints(prev => prev.map(hint =>
        hint.id === unlockedHint.id
          ? { ...hint, content: unlockedHint.content || hintWithText.text || '', locked: false }
          : hint
      ));
      setHintCount(prev => prev ? { ...prev, unlocked: prev.unlocked + 1, remaining: prev.remaining - 1 } : null);
    } catch (error) {
      console.error('Erreur lors du déblocage du prochain indice:', error);
      
      let errorMessage = 'Erreur lors du déblocage de l\'indice.';
      const axiosError = error as { response?: { status?: number; data?: { message?: string; error?: string } } };
      
      if (axiosError.response?.status === 403) {
        const backendMessage = axiosError.response?.data?.message || axiosError.response?.data?.error;
        errorMessage = backendMessage || 'Accès refusé. Vous n\'avez peut-être pas démarré cette enquête ou votre session a expiré.';
      } else if (axiosError.response?.status === 404) {
        errorMessage = 'Aucun indice supplémentaire disponible.';
      } else if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message;
      }
      
      toast.error(`${errorMessage}\n\nSi le problème persiste, essayez de vous reconnecter ou vérifiez que vous avez démarré l'enquête.`, 6000);
    }
  };

  return {
    hints,
    hintCount,
    loading,
    loadHints,
    unlockNextHint: unlockNextHintHandler
  };
};