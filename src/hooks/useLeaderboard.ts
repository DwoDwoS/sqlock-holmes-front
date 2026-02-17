import { useState, useEffect, useCallback } from 'react';
import { leaderboardService } from '../services/leaderboardService';
import { useLeaderboardRefresh } from '../contexts/LeaderboardRefreshContext';
import type { LeaderboardEntry, GlobalLeaderboardEntry, LeaderboardType } from '../types/leaderboard';

interface UseLeaderboardProps {
  type: LeaderboardType;
  investigationId?: number;
  limit?: number;
}

interface UseLeaderboardReturn {
  data: LeaderboardEntry[] | GlobalLeaderboardEntry[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useLeaderboard = ({ type, investigationId, limit = 10 }: UseLeaderboardProps): UseLeaderboardReturn => {
  const [data, setData] = useState<LeaderboardEntry[] | GlobalLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refreshToken } = useLeaderboardRefresh();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let result;
      switch (type) {
        case 'global':
          result = await leaderboardService.getGlobalLeaderboard(limit);
          break;
        case 'investigation':
          if (!investigationId) throw new Error('Investigation ID required');
          result = await leaderboardService.getInvestigationLeaderboard(investigationId, limit);
          break;
        case 'personal':
          if (!investigationId) throw new Error('Investigation ID required');
          result = await leaderboardService.getPersonalInvestigationLeaderboard(investigationId, limit);
          break;
        default:
          throw new Error('Invalid leaderboard type');
      }
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [type, investigationId, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshToken]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};