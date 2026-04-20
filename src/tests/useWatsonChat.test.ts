import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { AxiosError, AxiosHeaders, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { useWatsonChat } from '../hooks/useWatsonChat';
import * as watsonService from '../services/watsonService';
import type { AiChatResponse, AiStatusResponse } from '../types/watson';

vi.mock('../services/watsonService');

const baseStatus: AiStatusResponse = {
  tokensRemainingThisHour: 5000,
  requestsRemainingThisHour: 15,
  maxTokensPerHour: 5000,
  maxRequestsPerHour: 15,
  resetAt: '15:00',
};

const makeChatResponse = (overrides: Partial<AiChatResponse> = {}): AiChatResponse => ({
  reply: 'Réponse de Watson',
  tokensUsed: 10,
  tokensRemainingThisHour: 4990,
  requestsRemainingThisHour: 14,
  fromCache: false,
  ...overrides,
});

const makeAxios429 = (body: { message?: string; tokensRemainingThisHour: number; requestsRemainingThisHour: number; resetAt: string }) => {
  const config = { headers: new AxiosHeaders() } as InternalAxiosRequestConfig;
  const response: AxiosResponse = {
    status: 429,
    statusText: 'Too Many Requests',
    data: body,
    headers: {},
    config,
  };
  return new AxiosError('Too Many Requests', '429', config, null, response);
};

describe('useWatsonChat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(watsonService, 'getStatus').mockResolvedValue(baseStatus);
  });

  it('fetches status on mount when enabled', async () => {
    const { result } = renderHook(() => useWatsonChat(true));

    await waitFor(() => expect(result.current.status).toEqual(baseStatus));
    expect(watsonService.getStatus).toHaveBeenCalledTimes(1);
  });

  it('does not fetch status when disabled (unauthenticated)', async () => {
    const { result } = renderHook(() => useWatsonChat(false));

    // Wait a tick to let any queued effects run.
    await waitFor(() => expect(result.current.status).toBeNull());
    expect(watsonService.getStatus).not.toHaveBeenCalled();
  });

  it('appends user message immediately and Watson reply on success', async () => {
    (watsonService.sendMessage as Mock).mockResolvedValue(makeChatResponse());
    const { result } = renderHook(() => useWatsonChat(true));
    await waitFor(() => expect(result.current.status).toEqual(baseStatus));

    await act(async () => {
      result.current.sendMessage('Bonjour', 1);
    });

    await waitFor(() => expect(result.current.messages).toHaveLength(2));
    expect(result.current.messages[0]).toMatchObject({ role: 'user', content: 'Bonjour' });
    expect(result.current.messages[1]).toMatchObject({
      role: 'watson',
      content: 'Réponse de Watson',
      fromCache: false,
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('passes trimmed message, investigationId and last-10 history to the service', async () => {
    (watsonService.sendMessage as Mock).mockResolvedValue(makeChatResponse());
    const { result } = renderHook(() => useWatsonChat(true));
    await waitFor(() => expect(result.current.status).toEqual(baseStatus));

    // Send 11 messages to exceed the history cap of 10.
    for (let i = 0; i < 11; i += 1) {
      await act(async () => {
        result.current.sendMessage(`  msg-${i}  `, 42);
      });
      await waitFor(() => expect(result.current.messages.length).toBe(2 * (i + 1)));
    }

    // 12th call: history sent to the server should contain only the last 10 prior messages.
    await act(async () => {
      result.current.sendMessage('dernier', 42);
    });

    const calls = (watsonService.sendMessage as Mock).mock.calls;
    const [msg, investigationId, history] = calls[calls.length - 1];

    expect(msg).toBe('dernier');
    expect(investigationId).toBe(42);
    expect(history).toHaveLength(10);
    // First message ("msg-0") should have dropped out of the window.
    expect(history.some((m: { content: string }) => m.content === 'msg-0')).toBe(false);
    // Roles are mapped to API shape ('user' | 'model').
    for (const entry of history) {
      expect(['user', 'model']).toContain(entry.role);
    }
  });

  it('rejects empty or whitespace-only messages without calling the API', async () => {
    const { result } = renderHook(() => useWatsonChat(true));
    await waitFor(() => expect(result.current.status).toEqual(baseStatus));

    await act(async () => {
      result.current.sendMessage('   ');
    });

    expect(watsonService.sendMessage).not.toHaveBeenCalled();
    expect(result.current.messages).toHaveLength(0);
  });

  it('surfaces a length error for messages above 1000 characters', async () => {
    const { result } = renderHook(() => useWatsonChat(true));
    await waitFor(() => expect(result.current.status).toEqual(baseStatus));

    await act(async () => {
      result.current.sendMessage('a'.repeat(1001));
    });

    expect(watsonService.sendMessage).not.toHaveBeenCalled();
    expect(result.current.error).toMatch(/1000/);
  });

  it('handles 429 rate-limit errors by exposing resetAt and a specific message', async () => {
    const err = makeAxios429({
      message: 'Quota dépassé',
      tokensRemainingThisHour: 0,
      requestsRemainingThisHour: 0,
      resetAt: '16:00',
    });
    (watsonService.sendMessage as Mock).mockRejectedValue(err);

    const { result } = renderHook(() => useWatsonChat(true));
    await waitFor(() => expect(result.current.status).toEqual(baseStatus));

    await act(async () => {
      result.current.sendMessage('test', 1);
    });

    await waitFor(() => expect(result.current.rateLimitResetAt).toBe('16:00'));
    expect(result.current.error).toBe('Quota dépassé');
    expect(result.current.status?.tokensRemainingThisHour).toBe(0);
    // User message is kept so user can see what they sent.
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].role).toBe('user');
  });

  it('falls back to a generic error message on non-429 failures', async () => {
    const config = { headers: new AxiosHeaders() } as InternalAxiosRequestConfig;
    const response500: AxiosResponse = {
      status: 500,
      statusText: 'Internal Server Error',
      data: {},
      headers: {},
      config,
    };
    const err = new AxiosError('boom', '500', config, null, response500);
    (watsonService.sendMessage as Mock).mockRejectedValue(err);

    const { result } = renderHook(() => useWatsonChat(true));
    await waitFor(() => expect(result.current.status).toEqual(baseStatus));

    await act(async () => {
      result.current.sendMessage('test');
    });

    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.error).toMatch(/Erreur/);
    expect(result.current.rateLimitResetAt).toBeNull();
  });

  it('clearHistory empties messages and dismisses errors', async () => {
    (watsonService.sendMessage as Mock).mockResolvedValue(makeChatResponse());
    const { result } = renderHook(() => useWatsonChat(true));
    await waitFor(() => expect(result.current.status).toEqual(baseStatus));

    await act(async () => {
      result.current.sendMessage('a', 1);
    });
    await waitFor(() => expect(result.current.messages).toHaveLength(2));

    act(() => {
      result.current.clearHistory();
    });

    expect(result.current.messages).toHaveLength(0);
    expect(result.current.error).toBeNull();
    expect(result.current.rateLimitResetAt).toBeNull();
  });

  it('dismissError clears both the error and rate-limit banner', async () => {
    const err = makeAxios429({
      tokensRemainingThisHour: 0,
      requestsRemainingThisHour: 0,
      resetAt: '16:00',
    });
    (watsonService.sendMessage as Mock).mockRejectedValue(err);

    const { result } = renderHook(() => useWatsonChat(true));
    await waitFor(() => expect(result.current.status).toEqual(baseStatus));

    await act(async () => {
      result.current.sendMessage('hi');
    });
    await waitFor(() => expect(result.current.rateLimitResetAt).toBe('16:00'));

    act(() => {
      result.current.dismissError();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.rateLimitResetAt).toBeNull();
  });
});