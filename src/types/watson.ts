export interface AiMessage {
  role: 'user' | 'model';
  content: string;
}

export interface AiChatRequest {
  message: string;
  investigationId?: number;
  history?: AiMessage[];
}

export interface AiChatResponse {
  reply: string;
  tokensUsed: number;
  tokensRemainingThisHour: number;
  requestsRemainingThisHour: number;
  fromCache: boolean;
}

export interface AiStatusResponse {
  tokensRemainingThisHour: number;
  requestsRemainingThisHour: number;
  maxTokensPerHour: number;
  maxRequestsPerHour: number;
  resetAt: string;
}

export interface AiRateLimitError {
  message: string;
  tokensRemainingThisHour: number;
  requestsRemainingThisHour: number;
  resetAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'watson';
  content: string;
  fromCache?: boolean;
  timestamp: Date;
}