import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useInvestigationData } from '../hooks/useInvestigationData';
import * as investigationService from '../services/investigationService';
import { AxiosError } from 'axios';

vi.mock('../services/investigationService');

describe('useInvestigationData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return null investigation when id is undefined', async () => {
    const { result } = renderHook(() => useInvestigationData(undefined));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.investigation).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should load investigation successfully from backend', async () => {
    const mockInvestigation = {
      id: 1,
      title: 'Test Investigation',
      description: 'Test Description',
      difficulty: 'Facile' as const,
      status: 'En cours' as const,
      databaseId: 'test_db',
      image: '/test.png'
    };

    vi.spyOn(investigationService, 'getInvestigationDetails').mockResolvedValue(mockInvestigation);

    const { result } = renderHook(() => useInvestigationData('1'));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.investigation).toBeTruthy();
    expect(result.current.investigation?.title).toBe('Test Investigation');
    expect(result.current.error).toBeNull();
  });

  it('should handle 500 error and show appropriate message', async () => {
    const error = {
      response: {
        status: 500,
        data: {}
      }
    } as AxiosError;

    vi.spyOn(investigationService, 'getInvestigationDetails').mockRejectedValue(error);

    const { result } = renderHook(() => useInvestigationData('1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.investigation).toBeTruthy(); // Mock data fallback
    expect(result.current.error).toBe('Le serveur rencontre des difficultés. Vous utilisez des données de démonstration.');
  });

  it('should handle 404 error and show appropriate message', async () => {
    const error = {
      response: {
        status: 404,
        data: {}
      }
    } as AxiosError;

    vi.spyOn(investigationService, 'getInvestigationDetails').mockRejectedValue(error);

    const { result } = renderHook(() => useInvestigationData('2'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.investigation).toBeTruthy(); // Mock data fallback
    expect(result.current.error).toBe('Cette enquête n\'est pas encore disponible sur le serveur. Vous utilisez des données de démonstration.');
  });

  it('should handle generic error and show appropriate message', async () => {
    const error = new Error('Network error');

    vi.spyOn(investigationService, 'getInvestigationDetails').mockRejectedValue(error);

    const { result } = renderHook(() => useInvestigationData('3'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.investigation).toBeTruthy(); // Mock data fallback
    expect(result.current.error).toBe('Impossible de se connecter au serveur. Vous utilisez des données de démonstration.');
  });

  it('should use mock data as fallback when backend fails', async () => {
    const error = {
      response: {
        status: 500,
        data: {}
      }
    } as AxiosError;

    vi.spyOn(investigationService, 'getInvestigationDetails').mockRejectedValue(error);

    const { result } = renderHook(() => useInvestigationData('1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.investigation).toEqual(expect.objectContaining({
      id: 1,
      title: 'Le vol du musée',
      databaseId: 'museum_db'
    }));
  });
});
