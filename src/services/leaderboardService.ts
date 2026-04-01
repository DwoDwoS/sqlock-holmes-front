import api from '../api/api';
import type { LeaderboardEntry, GlobalLeaderboardEntry } from '../types/leaderboard';

class LeaderboardService {
  private api = api;

  async getInvestigationLeaderboard(investigationId: number, limit: number = 10): Promise<LeaderboardEntry[]> {
    try {
      const response = await this.api.get(`/leaderboard/investigation/${investigationId}`, {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching investigation leaderboard:', error);
      throw error;
    }
  }

  async getGlobalLeaderboard(limit: number = 10): Promise<GlobalLeaderboardEntry[]> {
    try {
      const response = await this.api.get('/leaderboard/global', {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching global leaderboard:', error);
      throw error;
    }
  }

  async getPersonalInvestigationLeaderboard(investigationId: number, limit: number = 10): Promise<LeaderboardEntry[]> {
    try {
      const response = await this.api.get(`/leaderboard/investigation/${investigationId}/personal`, {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching personal investigation leaderboard:', error);
      throw error;
    }
  }
}

export const leaderboardService = new LeaderboardService();