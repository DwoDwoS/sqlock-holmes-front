import api from '../api/api';
import type { Hint, HintCount } from '../types/investigation';

export class HintsService {
  static async getHints(investigationId: number): Promise<Hint[]> {
    const response = await api.get(`/investigations/${investigationId}/hints`);
    return response.data;
  }

  static async unlockNextHint(investigationId: number): Promise<Hint> {
    const response = await api.post(`/investigations/${investigationId}/hints/unlock`);
    return response.data;
  }

  static async getHintCount(investigationId: number): Promise<HintCount> {
    const response = await api.get(`/investigations/${investigationId}/hints/count`);
    return response.data;
  }
}