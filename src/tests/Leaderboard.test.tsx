import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Leaderboard from '../components/Leaderboard';
import * as useLeaderboardHook from '../hooks/useLeaderboard';
import type { GlobalLeaderboardEntry, LeaderboardEntry } from '../types/leaderboard';

vi.mock('../hooks/useLeaderboard');

describe('Leaderboard', () => {
  const mockGlobalData: GlobalLeaderboardEntry[] = [
    {
      username: 'alice',
      totalInvestigationsCompleted: 7,
      totalScore: 630,
      averageScore: 90,
      totalTimeSpentSeconds: 14400,
      totalQueriesCount: 70,
      totalHintsUsed: 14,
      rank: 1,
    },
    {
      username: 'bob',
      totalInvestigationsCompleted: 5,
      totalScore: 400,
      averageScore: 80,
      totalTimeSpentSeconds: 10800,
      totalQueriesCount: 55,
      totalHintsUsed: 20,
      rank: 2,
    },
  ];

  const mockInvestigationData: LeaderboardEntry[] = [
    {
      username: 'charlie',
      score: 95,
      timeSpentSeconds: 1200,
      queriesCount: 10,
      hintsUsed: 1,
      completedAt: '2026-02-13T10:00:00Z',
      rank: 1,
    },
    {
      username: 'david',
      score: 88,
      timeSpentSeconds: 1500,
      queriesCount: 12,
      hintsUsed: 3,
      completedAt: '2026-02-12T15:30:00Z',
      rank: 2,
    },
  ];

  const mockRefetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.spyOn(useLeaderboardHook, 'useLeaderboard').mockReturnValue({
      data: mockGlobalData,
      loading: false,
      error: null,
      refetch: mockRefetch,
    });
  });

  it('should render leaderboard component', () => {
    render(<Leaderboard />);
    
    expect(screen.getByText('Classements')).toBeInTheDocument();
  });

  it('should render global leaderboard by default', () => {
    const { container } = render(<Leaderboard />);
    
    const heading = container.querySelector('h3');
    expect(heading).toHaveTextContent('Classement Global');
    expect(screen.getByText('alice')).toBeInTheDocument();
    expect(screen.getByText('bob')).toBeInTheDocument();
  });

  it('should display global leaderboard data correctly', () => {
    render(<Leaderboard />);
    
    expect(screen.getByText('630')).toBeInTheDocument();
    expect(screen.getByText('90')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('should show investigation option when investigationId is provided', () => {
    render(<Leaderboard investigationId={1} />);
    
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    const options = Array.from(select.options).map(opt => opt.value);
    
    expect(options).toContain('investigation');
    expect(options).toContain('personal');
  });

  it('should not show investigation options without investigationId', () => {
    render(<Leaderboard />);
    
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    const options = Array.from(select.options).map(opt => opt.value);
    
    expect(options).toContain('global');
    expect(options).not.toContain('investigation');
    expect(options).not.toContain('personal');
  });

  it('should switch to investigation leaderboard type', () => {
    vi.spyOn(useLeaderboardHook, 'useLeaderboard').mockReturnValue({
      data: mockInvestigationData,
      loading: false,
      error: null,
      refetch: mockRefetch,
    });

    const { container } = render(<Leaderboard investigationId={1} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'investigation' } });

    const heading = container.querySelector('h3');
    expect(heading).toHaveTextContent(/Classement de l'Enquête/);
    expect(screen.getByText('charlie')).toBeInTheDocument();
  });

  it('should switch to personal leaderboard type', () => {
    vi.spyOn(useLeaderboardHook, 'useLeaderboard').mockReturnValue({
      data: mockInvestigationData,
      loading: false,
      error: null,
      refetch: mockRefetch,
    });

    render(<Leaderboard investigationId={1} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'personal' } });

    expect(screen.getByText(/Vos Meilleurs Scores/)).toBeInTheDocument();
  });

  it('should call refetch when refresh button is clicked', () => {
    render(<Leaderboard />);
    
    const refreshButton = screen.getByRole('button', { name: /Actualiser/i });
    fireEvent.click(refreshButton);

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('should show loading state', () => {
    vi.spyOn(useLeaderboardHook, 'useLeaderboard').mockReturnValue({
      data: [],
      loading: true,
      error: null,
      refetch: mockRefetch,
    });

    render(<Leaderboard />);
    
    expect(screen.getByText('Chargement du classement...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Chargement.../i })).toBeDisabled();
  });

  it('should display error message when error occurs', () => {
    vi.spyOn(useLeaderboardHook, 'useLeaderboard').mockReturnValue({
      data: [],
      loading: false,
      error: 'Failed to fetch leaderboard',
      refetch: mockRefetch,
    });

    render(<Leaderboard />);
    
    expect(screen.getByText('Failed to fetch leaderboard')).toBeInTheDocument();
  });

  it('should format time correctly (HH:MM:SS)', () => {
    render(<Leaderboard />);
    
    // 14400 seconds = 4 hours = 04:00:00
    expect(screen.getByText('04:00:00')).toBeInTheDocument();
    // 10800 seconds = 3 hours = 03:00:00
    expect(screen.getByText('03:00:00')).toBeInTheDocument();
  });

  it('should format dates correctly', () => {
    vi.spyOn(useLeaderboardHook, 'useLeaderboard').mockReturnValue({
      data: mockInvestigationData,
      loading: false,
      error: null,
      refetch: mockRefetch,
    });

    render(<Leaderboard investigationId={1} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'investigation' } });

    // Vérifie que les dates sont formatées en français (format DD/MM/YYYY)
    expect(screen.getByText(/13\/02\/2026/)).toBeInTheDocument();
  });

  it('should render investigation leaderboard with all columns', () => {
    vi.spyOn(useLeaderboardHook, 'useLeaderboard').mockReturnValue({
      data: mockInvestigationData,
      loading: false,
      error: null,
      refetch: mockRefetch,
    });

    render(<Leaderboard investigationId={1} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'investigation' } });

    expect(screen.getByText('Rang')).toBeInTheDocument();
    expect(screen.getByText('Utilisateur')).toBeInTheDocument();
    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.getByText('Temps')).toBeInTheDocument();
    expect(screen.getByText('Requêtes')).toBeInTheDocument();
    expect(screen.getByText('Indices')).toBeInTheDocument();
  });

  it('should render personal leaderboard without username column', () => {
    vi.spyOn(useLeaderboardHook, 'useLeaderboard').mockReturnValue({
      data: mockInvestigationData,
      loading: false,
      error: null,
      refetch: mockRefetch,
    });

    render(<Leaderboard investigationId={1} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'personal' } });

    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    // Dans le personal leaderboard, pas de colonne "Utilisateur"
  });

  it('should display all global leaderboard columns', () => {
    render(<Leaderboard />);

    expect(screen.getByText('Rang')).toBeInTheDocument();
    expect(screen.getByText('Utilisateur')).toBeInTheDocument();
    expect(screen.getByText('Enquêtes Complétées')).toBeInTheDocument();
    expect(screen.getByText('Score Total')).toBeInTheDocument();
    expect(screen.getByText('Score Moyen')).toBeInTheDocument();
    expect(screen.getByText('Temps Total')).toBeInTheDocument();
    expect(screen.getByText('Requêtes Totales')).toBeInTheDocument();
    expect(screen.getByText('Indices Utilisés')).toBeInTheDocument();
  });

  it('should update hook parameters when switching types', () => {
    render(<Leaderboard investigationId={1} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'investigation' } });

    expect(useLeaderboardHook.useLeaderboard).toHaveBeenCalledWith({
      type: 'investigation',
      investigationId: 1,
    });
  });

  it('should not pass investigationId for global type', () => {
    render(<Leaderboard investigationId={1} />);

    expect(useLeaderboardHook.useLeaderboard).toHaveBeenCalledWith({
      type: 'global',
      investigationId: undefined,
    });
  });
});
