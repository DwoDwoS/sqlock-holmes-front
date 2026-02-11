export interface Investigation {
  id: number;
  title: string;
  description: string;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  status: 'Disponible' | 'En cours' | 'Terminée';
  databaseId: string;
  image?: string;
}

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