import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import type { LeaderboardEntry, GlobalLeaderboardEntry } from '../types/leaderboard';

// Use vi.hoisted to create the mock in the correct scope
const { mockGet, requestUse, responseUse } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  requestUse: vi.fn(),
  responseUse: vi.fn(),
}));

// Mock axios before importing leaderboardService
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: mockGet,
      interceptors: {
        request: { use: requestUse },
        response: { use: responseUse },
      },
    })),
  },
}));

import { leaderboardService } from '../services/leaderboardService';

describe('leaderboardService', () => {
  let requestInterceptor: (config: any) => any;

  const mockLeaderboardEntry: LeaderboardEntry = {
    username: 'testuser',
    score: 95,
    timeSpentSeconds: 3600,
    queriesCount: 10,
    hintsUsed: 2,
    completedAt: '2026-02-13T10:00:00Z',
    rank: 1,
  };

  const mockGlobalLeaderboardEntry: GlobalLeaderboardEntry = {
    username: 'topuser',
    totalInvestigationsCompleted: 5,
    totalScore: 450,
    averageScore: 90,
    totalTimeSpentSeconds: 7200,
    totalQueriesCount: 50,
    totalHintsUsed: 10,
    rank: 1,
  };

  beforeAll(() => {
    requestInterceptor = requestUse.mock.calls[0]?.[0] as (config: any) => any;
  });

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('getInvestigationLeaderboard', () => {
    it('should fetch investigation leaderboard successfully', async () => {
      const mockData = [mockLeaderboardEntry];
      mockGet.mockResolvedValue({ data: mockData });

      const result = await leaderboardService.getInvestigationLeaderboard(1, 10);

      expect(result).toEqual(mockData);
      expect(mockGet).toHaveBeenCalledWith(
        '/leaderboard/investigation/1',
        expect.objectContaining({
          params: { limit: 10 },
        })
      );
    });

    it('should include auth token in headers when available', () => {
      localStorage.setItem('token', 'test-token');
      const config = { headers: {} };
      const result = requestInterceptor(config);
      expect(result.headers.Authorization).toBe('Bearer test-token');
    });

    it('should throw error when fetch fails', async () => {
      mockGet.mockRejectedValue(new Error('Network error'));

      await expect(leaderboardService.getInvestigationLeaderboard(1)).rejects.toThrow();
    });

    it('should use default limit of 10 when not specified', async () => {
      mockGet.mockResolvedValue({ data: [] });

      await leaderboardService.getInvestigationLeaderboard(1);

      expect(mockGet).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: { limit: 10 },
        })
      );
    });
  });

  describe('getGlobalLeaderboard', () => {
    it('should fetch global leaderboard successfully', async () => {
      const mockData = [mockGlobalLeaderboardEntry];
      mockGet.mockResolvedValue({ data: mockData });

      const result = await leaderboardService.getGlobalLeaderboard(10);

      expect(result).toEqual(mockData);
      expect(mockGet).toHaveBeenCalledWith(
        '/leaderboard/global',
        expect.objectContaining({
          params: { limit: 10 },
        })
      );
    });

    it('should include auth token when available', () => {
      localStorage.setItem('token', 'global-token');
      const config = { headers: {} };
      const result = requestInterceptor(config);
      expect(result.headers.Authorization).toBe('Bearer global-token');
    });

    it('should throw error on failure', async () => {
      mockGet.mockRejectedValue(new Error('Server error'));

      await expect(leaderboardService.getGlobalLeaderboard()).rejects.toThrow();
    });

    it('should work without auth token', () => {
      const config = { headers: {} };
      const result = requestInterceptor(config);
      expect(result.headers.Authorization).toBeUndefined();
    });
  });

  describe('getPersonalInvestigationLeaderboard', () => {
    it('should fetch personal investigation leaderboard successfully', async () => {
      const mockData = [mockLeaderboardEntry, { ...mockLeaderboardEntry, rank: 2, score: 85 }];
      mockGet.mockResolvedValue({ data: mockData });

      const result = await leaderboardService.getPersonalInvestigationLeaderboard(5, 20);

      expect(result).toEqual(mockData);
      expect(mockGet).toHaveBeenCalledWith(
        '/leaderboard/investigation/5/personal',
        expect.objectContaining({
          params: { limit: 20 },
        })
      );
    });

    it('should require authentication token', () => {
      localStorage.setItem('token', 'personal-token');
      const config = { headers: {} };
      const result = requestInterceptor(config);
      expect(result.headers.Authorization).toBe('Bearer personal-token');
    });

    it('should throw error when request fails', async () => {
      mockGet.mockRejectedValue(new Error('Unauthorized'));

      await expect(leaderboardService.getPersonalInvestigationLeaderboard(1)).rejects.toThrow();
    });

    it('should handle empty results', async () => {
      mockGet.mockResolvedValue({ data: [] });

      const result = await leaderboardService.getPersonalInvestigationLeaderboard(1);

      expect(result).toEqual([]);
    });
  });
});