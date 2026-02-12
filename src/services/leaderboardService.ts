import api from '../api/api';
import type { LeaderboardEntry, GlobalLeaderboardEntry } from '../types/leaderboard';

export class LeaderboardService {
  static async getInvestigationLeaderboard(
    investigationId: number, 
    limit: number = 10
  ): Promise<LeaderboardEntry[]> {
    try {
      const response = await api.get<LeaderboardEntry[]>(
        `/leaderboard/investigation/${investigationId}`, 
        { params: { limit } }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement du leaderboard de l\'enquête:', error);
      throw error;
    }
  }

  static async getGlobalLeaderboard(limit: number = 10): Promise<GlobalLeaderboardEntry[]> {
    try {
      const response = await api.get<GlobalLeaderboardEntry[]>(
        '/leaderboard/global', 
        { params: { limit } }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement du leaderboard global:', error);
      throw error;
    }
  }
}