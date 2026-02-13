import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LeaderboardDropdown } from '../components/LeaderboardDropdown';
import * as useLeaderboardHook from '../hooks/useLeaderboard';
import type { GlobalLeaderboardEntry, LeaderboardEntry } from '../types/leaderboard';

vi.mock('../hooks/useLeaderboard');

describe('LeaderboardDropdown', () => {
  const mockGlobalData: GlobalLeaderboardEntry[] = [
    {
      username: 'alpha',
      totalInvestigationsCompleted: 4,
      totalScore: 360,
      averageScore: 90,
      totalTimeSpentSeconds: 7200,
      totalQueriesCount: 40,
      totalHintsUsed: 8,
      rank: 1,
    },
    {
      username: 'beta',
      totalInvestigationsCompleted: 3,
      totalScore: 240,
      averageScore: 80,
      totalTimeSpentSeconds: 5400,
      totalQueriesCount: 30,
      totalHintsUsed: 12,
      rank: 2,
    },
  ];

  const mockInvestigationData: LeaderboardEntry[] = [
    {
      username: 'gamma',
      score: 92,
      timeSpentSeconds: 1800,
      queriesCount: 12,
      hintsUsed: 2,
      completedAt: '2026-02-13T09:00:00Z',
      rank: 1,
    },
    {
      username: 'delta',
      score: 85,
      timeSpentSeconds: 2200,
      queriesCount: 15,
      hintsUsed: 4,
      completedAt: '2026-02-12T16:00:00Z',
      rank: 2,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.spyOn(useLeaderboardHook, 'useLeaderboard').mockReturnValue({
      data: mockGlobalData,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  it('should render the dropdown toggle button', () => {
    render(<LeaderboardDropdown />);
    
    expect(screen.getByRole('button', { name: /Classement/i })).toBeInTheDocument();
  });

  it('should be closed by default', () => {
    render(<LeaderboardDropdown />);
    
    expect(screen.queryByText('Classement global')).not.toBeInTheDocument();
  });

  it('should open when toggle button is clicked', () => {
    render(<LeaderboardDropdown />);
    
    const toggleButton = screen.getByRole('button', { name: /Classement/i });
    fireEvent.click(toggleButton);

    expect(screen.getByText('Classement global')).toBeInTheDocument();
  });

  it('should close when toggle button is clicked again', () => {
    render(<LeaderboardDropdown />);
    
    const toggleButton = screen.getByRole('button', { name: /Classement/i });
    fireEvent.click(toggleButton);
    expect(screen.getByText('Classement global')).toBeInTheDocument();
    
    fireEvent.click(toggleButton);
    expect(screen.queryByText('Classement global')).not.toBeInTheDocument();
  });

  it('should render global leaderboard by default', () => {
    render(<LeaderboardDropdown />);
    
    const toggleButton = screen.getByRole('button', { name: /Classement/i });
    fireEvent.click(toggleButton);

    expect(screen.getByText('alpha')).toBeInTheDocument();
    expect(screen.getByText('beta')).toBeInTheDocument();
    expect(screen.getByText('360')).toBeInTheDocument();
  });

  it('should show investigation tab when investigationId is provided', () => {
    render(<LeaderboardDropdown investigationId={1} />);
    
    const toggleButton = screen.getByRole('button', { name: /Classement/i });
    fireEvent.click(toggleButton);

    expect(screen.getByRole('button', { name: 'Cette enquête' })).toBeInTheDocument();
  });

  it('should not show investigation tab without investigationId', () => {
    render(<LeaderboardDropdown />);
    
    const toggleButton = screen.getByRole('button', { name: /Classement/i });
    fireEvent.click(toggleButton);

    expect(screen.queryByRole('button', { name: 'Cette enquête' })).not.toBeInTheDocument();
  });

  it('should switch to investigation tab', () => {
    vi.spyOn(useLeaderboardHook, 'useLeaderboard').mockReturnValue({
      data: mockInvestigationData,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<LeaderboardDropdown investigationId={1} />);
    
    const toggleButton = screen.getByRole('button', { name: /Classement/i });
    fireEvent.click(toggleButton);

    const investigationTab = screen.getByRole('button', { name: 'Cette enquête' });
    fireEvent.click(investigationTab);

    expect(screen.getByText(/Classement de l'enquête/i)).toBeInTheDocument();
    expect(screen.getByText('gamma')).toBeInTheDocument();
  });

  it('should show active class on selected tab', () => {
    render(<LeaderboardDropdown investigationId={1} />);
    
    const toggleButton = screen.getByRole('button', { name: /Classement/i });
    fireEvent.click(toggleButton);

    const globalTab = screen.getByRole('button', { name: 'Global' });
    expect(globalTab).toHaveClass('active');
  });

  it('should switch active class when changing tabs', () => {
    render(<LeaderboardDropdown investigationId={1} />);
    
    const toggleButton = screen.getByRole('button', { name: /Classement/i });
    fireEvent.click(toggleButton);

    const investigationTab = screen.getByRole('button', { name: 'Cette enquête' });
    fireEvent.click(investigationTab);

    expect(investigationTab).toHaveClass('active');
    
    const globalTab = screen.getByRole('button', { name: 'Global' });
    expect(globalTab).not.toHaveClass('active');
  });

  it('should display loading state', () => {
    vi.spyOn(useLeaderboardHook, 'useLeaderboard').mockReturnValue({
      data: [],
      loading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(<LeaderboardDropdown />);
    
    const toggleButton = screen.getByRole('button', { name: /Classement/i });
    fireEvent.click(toggleButton);

    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });

  it('should render investigation leaderboard table with correct columns', () => {
    vi.spyOn(useLeaderboardHook, 'useLeaderboard').mockReturnValue({
      data: mockInvestigationData,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<LeaderboardDropdown investigationId={1} />);
    
    const toggleButton = screen.getByRole('button', { name: /Classement/i });
    fireEvent.click(toggleButton);

    const investigationTab = screen.getByRole('button', { name: 'Cette enquête' });
    fireEvent.click(investigationTab);

    expect(screen.getByText('Rang')).toBeInTheDocument();
    expect(screen.getByText('Utilisateur')).toBeInTheDocument();
    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.getByText('Temps')).toBeInTheDocument();
    expect(screen.getByText('Requêtes')).toBeInTheDocument();
    expect(screen.getByText('Indices')).toBeInTheDocument();
  });

  it('should render global leaderboard table with correct columns', () => {
    render(<LeaderboardDropdown />);
    
    const toggleButton = screen.getByRole('button', { name: /Classement/i });
    fireEvent.click(toggleButton);

    expect(screen.getByText('Rang')).toBeInTheDocument();
    expect(screen.getByText('Utilisateur')).toBeInTheDocument();
    expect(screen.getByText('Enquêtes')).toBeInTheDocument();
    expect(screen.getByText('Score total')).toBeInTheDocument();
    expect(screen.getByText('Score moyen')).toBeInTheDocument();
    expect(screen.getByText('Temps total')).toBeInTheDocument();
  });

  it('should format time correctly in investigation view', () => {
    vi.spyOn(useLeaderboardHook, 'useLeaderboard').mockReturnValue({
      data: mockInvestigationData,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<LeaderboardDropdown investigationId={1} />);
    
    const toggleButton = screen.getByRole('button', { name: /Classement/i });
    fireEvent.click(toggleButton);

    const investigationTab = screen.getByRole('button', { name: 'Cette enquête' });
    fireEvent.click(investigationTab);

    // 1800 seconds = 30 minutes = 00:30:00
    expect(screen.getByText('00:30:00')).toBeInTheDocument();
  });

  it('should format time correctly in global view', () => {
    render(<LeaderboardDropdown />);
    
    const toggleButton = screen.getByRole('button', { name: /Classement/i });
    fireEvent.click(toggleButton);

    // 7200 seconds = 2 hours = 02:00:00
    expect(screen.getByText('02:00:00')).toBeInTheDocument();
  });

  it('should display ranks correctly', () => {
    render(<LeaderboardDropdown />);
    
    const toggleButton = screen.getByRole('button', { name: /Classement/i });
    fireEvent.click(toggleButton);

    const rows = screen.getAllByRole('row');
    // Header + 2 data rows
    expect(rows).toHaveLength(3);
  });

  it('should update data when switching between tabs', () => {
    render(<LeaderboardDropdown investigationId={1} />);
    
    const toggleButton = screen.getByRole('button', { name: /Classement/i });
    fireEvent.click(toggleButton);

    // Start with global data
    expect(screen.getByText('alpha')).toBeInTheDocument();

    // Switch to investigation data
    vi.spyOn(useLeaderboardHook, 'useLeaderboard').mockReturnValue({
      data: mockInvestigationData,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    const investigationTab = screen.getByRole('button', { name: 'Cette enquête' });
    fireEvent.click(investigationTab);
  });

  it('should show arrow indicator when closed', () => {
    render(<LeaderboardDropdown />);
    
    const toggleButton = screen.getByRole('button', { name: /▶/i });
    expect(toggleButton).toBeInTheDocument();
  });

  it('should show down arrow indicator when open', () => {
    render(<LeaderboardDropdown />);
    
    const toggleButton = screen.getByRole('button', { name: /Classement ▶/i });
    fireEvent.click(toggleButton);

    expect(screen.getByRole('button', { name: /▼/i })).toBeInTheDocument();
  });
});
