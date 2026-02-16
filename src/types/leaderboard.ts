export interface LeaderboardEntry {
  username: string;
  score: number;
  timeSpentSeconds: number;
  queriesCount: number;
  hintsUsed: number;
  completedAt: string;
  rank: number;
}

export interface GlobalLeaderboardEntry {
  username: string;
  totalInvestigationsCompleted: number;
  totalScore: number;
  averageScore: number;
  totalTimeSpentSeconds: number;
  totalQueriesCount: number;
  totalHintsUsed: number;
  rank: number;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  totalUsers: number;
}

export type LeaderboardType = 'global' | 'investigation' | 'personal';