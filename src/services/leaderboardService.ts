import axios from 'axios';
import type { LeaderboardEntry, GlobalLeaderboardEntry } from '../types/leaderboard';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

class LeaderboardService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getInvestigationLeaderboard(investigationId: number, limit: number = 10): Promise<LeaderboardEntry[]> {
    try {
      const response = await this.api.get(`/leaderboard/investigation/${investigationId}`, {
        params: { limit },
        headers: this.getAuthHeaders(),
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
        headers: this.getAuthHeaders(),
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
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching personal investigation leaderboard:', error);
      throw error;
    }
  }
}

export const leaderboardService = new LeaderboardService();