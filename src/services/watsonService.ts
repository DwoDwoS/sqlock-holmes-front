import api from '../api/api';
import type {
  AiChatRequest,
  AiChatResponse,
  AiMessage,
  AiStatusResponse,
} from '../types/watson';

export async function sendMessage(
  message: string,
  investigationId?: number,
  history?: AiMessage[]
): Promise<AiChatResponse> {
  const payload: AiChatRequest = { message };
  if (investigationId !== undefined) payload.investigationId = investigationId;
  if (history && history.length > 0) payload.history = history;

  const res = await api.post<AiChatResponse>('/ai/chat', payload);
  return res.data;
}

export async function getStatus(): Promise<AiStatusResponse> {
  const res = await api.get<AiStatusResponse>('/ai/status');
  return res.data;
}