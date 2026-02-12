import api from '../api/api';
import type { LeaderboardEntry, GlobalLeaderboardEntry, LeaderboardResponse } from '../types/leaderboard';

export class LeaderboardService {
  static async getInvestigationLeaderboard(investigationId: number, limit: number = 10): Promise<LeaderboardEntry[]> {
    try {
      const response = await api.get<LeaderboardEntry[]>(`/leaderboard/investigation/${investigationId}`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement du leaderboard de l\'enquête:', error);
      throw error;
    }
  }

  static async getGlobalLeaderboard(limit: number = 10): Promise<GlobalLeaderboardEntry[]> {
    try {
      const response = await api.get<GlobalLeaderboardEntry[]>('/leaderboard/global', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement du leaderboard global:', error);
      throw error;
    }
  }
}

export const getLeaderboard = async (limit: number = 10): Promise<LeaderboardResponse> => {
  try {
    const response = await api.get<LeaderboardResponse>(`/leaderboard?limit=${limit}`);
    return response.data;
  } catch {
    console.warn('Leaderboard API not implemented yet, using mock data');
    return {
      leaderboard: Array.from({ length: Math.min(10, limit) }, (_, i) => ({
        rank: i + 1,
        username: `Détective${i + 1}`,
        score: Math.max(1000 - i * 100, 0),
        timeSpentSeconds: 3600 + i * 300,
        queriesCount: 10 + i * 2,
        hintsUsed: i,
        completedAt: new Date(Date.now() - i * 86400000).toISOString(),
      })),
      totalUsers: 100,
    };
  }
};
