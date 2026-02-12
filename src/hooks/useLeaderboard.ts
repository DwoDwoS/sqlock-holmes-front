import { useState, useEffect, useCallback } from 'react';
import { LeaderboardService } from '../services/leaderboardService';
import type { LeaderboardEntry, GlobalLeaderboardEntry } from '../types/leaderboard';

interface UseLeaderboardOptions {
  enabled?: boolean;
  investigationId?: number;
}

export const useLeaderboard = ({ enabled = true, investigationId }: UseLeaderboardOptions = {}) => {
  const [globalLeaderboard, setGlobalLeaderboard] = useState<GlobalLeaderboardEntry[]>([]);
  const [investigationLeaderboards, setInvestigationLeaderboards] = useState<{[key: number]: LeaderboardEntry[]}>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadGlobalLeaderboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await LeaderboardService.getGlobalLeaderboard(20);
      setGlobalLeaderboard(data);
    } catch (err) {
      const errorMessage = 'Erreur lors du chargement du leaderboard global';
      console.error(errorMessage, err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadInvestigationLeaderboard = useCallback(async (invId: number) => {
    if (investigationLeaderboards[invId]) return;

    setLoading(true);
    setError(null);
    try {
      const data = await LeaderboardService.getInvestigationLeaderboard(invId, 20);
      setInvestigationLeaderboards(prev => ({
        ...prev,
        [invId]: data
      }));
    } catch (err) {
      const errorMessage = 'Erreur lors du chargement du leaderboard de l\'enquête';
      console.error(errorMessage, err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [investigationLeaderboards]);

  useEffect(() => {
    if (enabled) {
      loadGlobalLeaderboard();
      if (investigationId) {
        loadInvestigationLeaderboard(investigationId);
      }
    }
  }, [enabled, investigationId, loadGlobalLeaderboard, loadInvestigationLeaderboard]);

  return {
    globalLeaderboard,
    investigationLeaderboards,
    loading,
    error,
    loadGlobalLeaderboard,
    loadInvestigationLeaderboard,
  };
};