export type InvestigationDifficulty = 'Facile' | 'Moyen' | 'Difficile';
export type InvestigationStatus = 'Disponible' | 'En cours' | 'Terminée';

export interface Investigation {
  id: number;
  title: string;
  description: string;
  difficulty: InvestigationDifficulty;
  status: InvestigationStatus;
  databaseId: string;
  image?: string;
}

export type DifficultyFilter = 'ALL' | InvestigationDifficulty;
export type StatusFilter = 'ALL' | 'SOLVED' | 'UNSOLVED';

export interface SQLResult {
  columns?: string[];
  rows?: unknown[];
  error?: string;
  message?: string;
}

export interface Hint {
  id?: number;
  content: string;
  locked?: boolean;
}

export interface HintCount {
  unlocked: number;
  total: number;
  remaining: number;
}