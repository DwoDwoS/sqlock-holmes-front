import { useCallback, useEffect, useRef, useState } from 'react';
import { AxiosError } from 'axios';
import { sendMessage as sendMessageApi, getStatus as getStatusApi } from '../services/watsonService';
import type {
  AiMessage,
  AiStatusResponse,
  AiRateLimitError,
  ChatMessage,
} from '../types/watson';

const HISTORY_LIMIT = 10;

const createId = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

interface UseWatsonChat {
  messages: ChatMessage[];
  isLoading: boolean;
  status: AiStatusResponse | null;
  error: string | null;
  rateLimitResetAt: string | null;
  sendMessage: (text: string, investigationId?: number) => void;
  clearHistory: () => void;
  dismissError: () => void;
  refreshStatus: () => void;
}

export const useWatsonChat = (enabled: boolean = true): UseWatsonChat => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<AiStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitResetAt, setRateLimitResetAt] = useState<string | null>(null);
  const inFlight = useRef(false);

  const refreshStatus = useCallback(async () => {
    if (!enabled) return;
    try {
      const data = await getStatusApi();
      setStatus(data);
    } catch {
      // Silently ignore status errors — the chatbox still works for sending.
    }
  }, [enabled]);

  useEffect(() => {
    if (enabled) refreshStatus();
  }, [enabled, refreshStatus]);

  const buildHistory = useCallback((current: ChatMessage[]): AiMessage[] => {
    const last = current.slice(-HISTORY_LIMIT);
    return last.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      content: m.content,
    }));
  }, []);

  const sendMessage = useCallback(
    async (text: string, investigationId?: number) => {
      const trimmed = text.trim();
      if (!trimmed || inFlight.current) return;
      if (trimmed.length > 1000) {
        setError('Message trop long (1000 caractères max).');
        return;
      }

      inFlight.current = true;
      setError(null);
      setRateLimitResetAt(null);

      const userMessage: ChatMessage = {
        id: createId(),
        role: 'user',
        content: trimmed,
        timestamp: new Date(),
      };

      const historySnapshot = buildHistory(messages);
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const res = await sendMessageApi(trimmed, investigationId, historySnapshot);
        const watsonMessage: ChatMessage = {
          id: createId(),
          role: 'watson',
          content: res.reply,
          fromCache: res.fromCache,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, watsonMessage]);
        setStatus((prev) =>
          prev
            ? {
                ...prev,
                tokensRemainingThisHour: res.tokensRemainingThisHour,
                requestsRemainingThisHour: res.requestsRemainingThisHour,
              }
            : prev
        );
        refreshStatus();
      } catch (err) {
        const axiosErr = err as AxiosError<AiRateLimitError & { message?: string }>;
        if (axiosErr.response?.status === 429) {
          const data = axiosErr.response.data;
          setRateLimitResetAt(data?.resetAt ?? null);
          setError(data?.message || 'Limite horaire atteinte.');
          if (data) {
            setStatus((prev) =>
              prev
                ? {
                    ...prev,
                    tokensRemainingThisHour: data.tokensRemainingThisHour,
                    requestsRemainingThisHour: data.requestsRemainingThisHour,
                    resetAt: data.resetAt,
                  }
                : prev
            );
          }
        } else {
          const backendMessage = axiosErr.response?.data?.message;
          setError(backendMessage || 'Erreur lors de l\'envoi du message.');
        }
      } finally {
        setIsLoading(false);
        inFlight.current = false;
      }
    },
    [messages, buildHistory, refreshStatus]
  );

  const clearHistory = useCallback(() => {
    setMessages([]);
    setError(null);
    setRateLimitResetAt(null);
  }, []);

  const dismissError = useCallback(() => {
    setError(null);
    setRateLimitResetAt(null);
  }, []);

  return {
    messages,
    isLoading,
    status,
    error,
    rateLimitResetAt,
    sendMessage,
    clearHistory,
    dismissError,
    refreshStatus,
  };
};