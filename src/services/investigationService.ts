import api from '../api/api';
import type { Investigation } from '../types/investigation';

type ApiDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'Facile' | 'Moyen' | 'Difficile';
type ApiStatus = 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED' | 'Disponible' | 'En cours' | 'Terminée';

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
  status: mapStatus((apiItem?.status ?? apiItem?.statut) as ApiStatus),
  databaseId: (apiItem?.databaseId as string) ?? (apiItem?.dbId as string) ?? (apiItem?.database_id as string) ?? '',
  image: (apiItem?.image as string) ?? undefined
});

export async function getInvestigations(): Promise<Investigation[]> {
  const res = await api.get('/investigations');
  const data = res.data;
  const list = Array.isArray(data) ? data : data?.items ?? data?.data ?? [];
  return list.map(mapInvestigation);
}

export async function getInvestigationDetails(id: number): Promise<Investigation> {
  const res = await api.get(`/investigations/${id}`);
  return mapInvestigation(res.data);
}

export async function startInvestigation(id: number): Promise<void> {
  try {
    const response = await api.post(`/investigations/${id}/start`, {}, {
      validateStatus: () => true,
    });
    return response.data;
  } catch {
    // Silently fail - investigation might already be started
  }
}

export async function restartInvestigation(id: number): Promise<void> {
  try {
    await api.post(`/investigations/${id}/restart`);
  } catch (error) {
    const axiosError = error as { response?: { status?: number; data?: { message?: string; error?: string } } };
    const backendMessage = axiosError.response?.data?.message || axiosError.response?.data?.error;
    
    if (axiosError.response?.status === 403) {
      const message = backendMessage || 'Accès refusé. Vérifiez que vous êtes connecté et que cette fonctionnalité est activée sur le serveur.';
      throw new Error(message);
    } else if (axiosError.response?.status === 404) {
      const message = backendMessage || 'Enquête non trouvée.';
      throw new Error(message);
    }
    
    const message = backendMessage || 'Erreur lors du redémarrage de l\'enquête.';
    throw new Error(message);
  }
}

export interface SubmitSolutionResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function submitSolution(
  investigationId: number, 
  culprit: string, 
  motive: string
): Promise<SubmitSolutionResponse> {
  const payload = { culprit, motive };
  const res = await api.post(`/investigations/${investigationId}/submit-solution`, payload);
  return res.data;
}