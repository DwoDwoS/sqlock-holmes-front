import api from '../api/api';

type ApiDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'Facile' | 'Moyen' | 'Difficile';
type ApiStatus = 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED' | 'Disponible' | 'En cours' | 'Terminée';

export interface Investigation {
  id: number;
  title: string;
  description: string;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  status: 'Disponible' | 'En cours' | 'Terminée';
  databaseId: string;
  image?: string;
}

const mapDifficulty = (d: ApiDifficulty | undefined): Investigation['difficulty'] => {
  switch (d) {
    case 'EASY': return 'Facile';
    case 'MEDIUM': return 'Moyen';
    case 'HARD': return 'Difficile';
    case 'Facile':
    case 'Moyen':
    case 'Difficile':
      return d;
    default:
      return 'Moyen';
  }
};

const mapStatus = (s: ApiStatus | undefined): Investigation['status'] => {
  switch (s) {
    case 'AVAILABLE': return 'Disponible';
    case 'IN_PROGRESS': return 'En cours';
    case 'COMPLETED': return 'Terminée';
    case 'Disponible':
    case 'En cours':
    case 'Terminée':
      return s;
    default:
      return 'Disponible';
  }
};

const mapInvestigation = (apiItem: Record<string, unknown>): Investigation => ({
  id: Number(apiItem?.id ?? apiItem?.investigationId),
  title: (apiItem?.title as string) ?? 'Sans titre',
  description: (apiItem?.description as string) ?? '',
  difficulty: mapDifficulty(apiItem?.difficulty as ApiDifficulty),
  status: mapStatus(apiItem?.statut as ApiStatus),
  databaseId: (apiItem?.databaseId as string) ?? (apiItem?.dbId as string) ?? (apiItem?.database_id as string) ?? '',
  image: (apiItem?.image as string) ?? undefined
});

export async function getInvestigations(): Promise<Investigation[]> {
  const res = await api.get('/investigations');
  const data = res.data;
  const list = Array.isArray(data) ? data : data?.items ?? data?.data ?? [];
  return list.map(mapInvestigation);
}

export interface ExecuteSQLRequest {
  investigationId: number;
  sql: string;
}

export interface ExecuteSQLResponse {
  columns?: string[];
  rows?: unknown[];
  affectedRows?: number;
  error?: string;
}

export async function executeSQL(payload: ExecuteSQLRequest): Promise<ExecuteSQLResponse> {
  const res = await api.post('/sql/execute', payload);
  return res.data;
}

export interface Hint {
  id: number;
  text: string;
}

export async function getHints(investigationId: number): Promise<Hint[]> {
  const res = await api.get(`/investigations/${investigationId}/hints`);
  return res.data;
}

export async function getInvestigationDetails(id: number): Promise<Investigation> {
  const res = await api.get(`/investigations/${id}`);
  return mapInvestigation(res.data);
}

export async function startInvestigation(id: number): Promise<void> {
  await api.post(`/investigations/${id}/start`);
}