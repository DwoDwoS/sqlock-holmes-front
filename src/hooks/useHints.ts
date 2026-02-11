import { useState } from 'react';
import { getHints, unlockNextHint, getHintCount } from '../services/investigationService';
import type { Hint, HintCount } from '../types/investigation';
import { getMockHints } from '../utils/investigationUtils';

export const useHints = (investigationId: number | undefined) => {
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
        getHints(investigationId),
        getHintCount(investigationId)
      ]);
      setHints(hintsData.map((hint: { id: number; content?: string; text?: string; locked?: boolean }) => ({
        id: hint.id,
        content: hint.content || hint.text || '',
        locked: hint.locked || false
      })));
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
      const unlockedHint = await unlockNextHint(investigationId);
      setHints(prev => prev.map(hint =>
        hint.id === unlockedHint.id
          ? { ...hint, content: unlockedHint.content || unlockedHint.text || '', locked: false }
          : hint
      ));
      setHintCount(prev => prev ? { ...prev, unlocked: prev.unlocked + 1, remaining: prev.remaining - 1 } : null);
    } catch (error) {
      console.error('Erreur lors du déblocage du prochain indice:', error);
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