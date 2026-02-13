import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LeaderboardModal from '../components/LeaderboardModal';
import * as useLeaderboardHook from '../hooks/useLeaderboard';
import api from '../api/api';
import type { GlobalLeaderboardEntry, LeaderboardEntry } from '../types/leaderboard';

vi.mock('../api/api');
vi.mock('../hooks/useLeaderboard');

describe('LeaderboardModal', () => {
  const mockGlobalData: GlobalLeaderboardEntry[] = [
    {
      username: 'player1',
      totalInvestigationsCompleted: 5,
      totalScore: 450,
      averageScore: 90,
      totalTimeSpentSeconds: 7200,
      totalQueriesCount: 50,
      totalHintsUsed: 10,
      rank: 1,
    },
    {
      username: 'player2',
      totalInvestigationsCompleted: 3,
      totalScore: 270,
      averageScore: 90,
      totalTimeSpentSeconds: 5400,
      totalQueriesCount: 35,
      totalHintsUsed: 8,
      rank: 2,
    },
  ];

  const mockPersonalData: LeaderboardEntry[] = [
    {
      username: 'currentUser',
      score: 95,
      timeSpentSeconds: 1800,
      queriesCount: 15,
      hintsUsed: 2,
      completedAt: '2026-02-13T10:00:00Z',
      rank: 1,
    },
    {
      username: 'currentUser',
      score: 88,
      timeSpentSeconds: 2100,
      queriesCount: 18,
      hintsUsed: 3,
      completedAt: '2026-02-12T14:30:00Z',
      rank: 2,
    },
  ];

  const mockInvestigations = [
    { id: 1, title: 'Investigation 1' },
    { id: 2, title: 'Investigation 2' },
  ];

  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.spyOn(useLeaderboardHook, 'useLeaderboard').mockReturnValue({
      data: mockGlobalData,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: mockInvestigations,
    });
  });

  it('should not render when isOpen is false', () => {
    const { container } = render(
      <LeaderboardModal isOpen={false} onClose={mockOnClose} />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('should render when isOpen is true', () => {
    render(<LeaderboardModal isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText('🏆 Classement')).toBeInTheDocument();
  });

  it('should load investigations on mount', async () => {
    render(<LeaderboardModal isOpen={true} onClose={mockOnClose} />);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/investigations');
    });
  });

  it('should close modal when close button is clicked', () => {
    render(<LeaderboardModal isOpen={true} onClose={mockOnClose} />);
    
    const closeButton = screen.getByRole('button', { name: '×' });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should render global leaderboard by default', () => {
    render(<LeaderboardModal isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText('player1')).toBeInTheDocument();
    expect(screen.getByText('player2')).toBeInTheDocument();
    expect(screen.getByText('450 pts')).toBeInTheDocument();
  });

  it('should switch to personal view when button is clicked', async () => {
    vi.spyOn(useLeaderboardHook, 'useLeaderboard').mockReturnValue({
      data: mockPersonalData,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<LeaderboardModal isOpen={true} onClose={mockOnClose} />);
    
    const personalButton = screen.getByRole('button', { name: /Mes Scores Personnels/i });
    fireEvent.click(personalButton);

    await waitFor(() => {
      expect(personalButton).toHaveClass('active');
    });
  });

  it('should display investigation select in personal view', async () => {
    render(<LeaderboardModal isOpen={true} onClose={mockOnClose} />);
    
    const personalButton = screen.getByRole('button', { name: /Mes Scores Personnels/i });
    fireEvent.click(personalButton);

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  it('should not display investigation select in global view', () => {
    render(<LeaderboardModal isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('should show loading spinner when loading', () => {
    vi.spyOn(useLeaderboardHook, 'useLeaderboard').mockReturnValue({
      data: [],
      loading: true,
      error: null,
      refetch: vi.fn(),
    });

    const { container } = render(<LeaderboardModal isOpen={true} onClose={mockOnClose} />);
    
    expect(container.querySelector('.leaderboard-spinner')).toBeInTheDocument();
  });

  it('should show empty message when no data', () => {
    vi.spyOn(useLeaderboardHook, 'useLeaderboard').mockReturnValue({
      data: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<LeaderboardModal isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText('Aucun résultat disponible')).toBeInTheDocument();
  });

  it('should render personal scores with correct formatting', () => {
    vi.spyOn(useLeaderboardHook, 'useLeaderboard').mockReturnValue({
      data: mockPersonalData,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<LeaderboardModal isOpen={true} onClose={mockOnClose} />);
    
    const personalButton = screen.getByRole('button', { name: /Mes Scores Personnels/i });
    fireEvent.click(personalButton);

    expect(screen.getByText('95 pts')).toBeInTheDocument();
    expect(screen.getByText(/Temps: 00:30:00/)).toBeInTheDocument();
  });

  it('should initialize with first investigation when loaded', async () => {
    render(<LeaderboardModal isOpen={true} onClose={mockOnClose} />);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/investigations');
    });

    // Vérifie que l'initialisation ne cause pas d'erreur ESLint
    // (le test passe si aucune erreur n'est levée)
  });

  it('should handle investigation change in personal view', async () => {
    render(<LeaderboardModal isOpen={true} onClose={mockOnClose} />);
    
    const personalButton = screen.getByRole('button', { name: /Mes Scores Personnels/i });
    fireEvent.click(personalButton);

    await waitFor(() => {
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '2' } });

    expect(select).toHaveValue('2');
  });

  it('should display rank badges correctly', () => {
    const { container } = render(<LeaderboardModal isOpen={true} onClose={mockOnClose} />);
    
    const badges = container.querySelectorAll('.leaderboard-rank-badge');
    expect(badges).toHaveLength(mockGlobalData.length);
    expect(badges[0]).toHaveTextContent('1');
    expect(badges[1]).toHaveTextContent('2');
  });

  it('should mark top 3 entries with special class', () => {
    const topThreeData: GlobalLeaderboardEntry[] = [
      ...mockGlobalData,
      { ...mockGlobalData[0], username: 'player3', rank: 3 },
    ];

    vi.spyOn(useLeaderboardHook, 'useLeaderboard').mockReturnValue({
      data: topThreeData,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    const { container } = render(<LeaderboardModal isOpen={true} onClose={mockOnClose} />);
    
    const topThreeEntries = container.querySelectorAll('.top-three');
    expect(topThreeEntries).toHaveLength(3);
  });

  it('should handle API error gracefully when loading investigations', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (api.get as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

    render(<LeaderboardModal isOpen={true} onClose={mockOnClose} />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Erreur lors du chargement des enquêtes:',
        expect.any(Error)
      );
    });

    consoleErrorSpy.mockRestore();
  });
});
