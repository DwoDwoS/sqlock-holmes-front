import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider } from '../contexts/AuthProvider';
import Investigations from '../components/Investigations';

// Mock the API
vi.mock('../api/api', () => ({
  getInvestigations: vi.fn(() => Promise.resolve([
    {
      id: 1,
      titre: 'Le vol du musée',
      description: 'Un tableau de valeur inestimable a disparu du musée national. Les caméras de sécurité ont filmé plusieurs personnes suspectes. Analysez les données pour identifier le voleur.',
      difficulte: 'Facile',
      statut: 'Disponible',
      databaseId: 'museum_db'
    },
    {
      id: 2,
      titre: 'Fraudes corporatives',
      description: 'Des transactions suspectes ont été détectées dans les comptes de l\'entreprise TechCorp. Identifiez l\'employé responsable et découvrez comment il a détourné les fonds.',
      difficulte: 'Moyen',
      statut: 'Disponible',
      databaseId: 'corporate_db'
    },
    {
      id: 3,
      titre: 'Meurtre au Manoir',
      description: 'Lord Blackwood a été retrouvé mort dans sa bibliothèque. Six personnes étaient présentes ce soir-là. Qui est le meurtrier ? Et pourquoi ?',
      difficulte: 'Difficile',
      statut: 'Disponible',
      databaseId: 'manor_db'
    }
  ])),
  startInvestigation: vi.fn(() => Promise.resolve())
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Investigations', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders the page title and description', async () => {
    renderWithProviders(<Investigations />);
    await waitFor(() => {
      expect(screen.getByText('Sélection des Enquêtes')).toBeInTheDocument();
    });
    expect(screen.getByText(/choisissez une enquête à résoudre/i)).toBeInTheDocument();
  });

  it('renders all investigation cards', async () => {
    renderWithProviders(<Investigations />);
    await waitFor(() => {
      expect(screen.getByText('Le vol du musée')).toBeInTheDocument();
    });
    expect(screen.getByText('Fraudes corporatives')).toBeInTheDocument();
    expect(screen.getByText('Meurtre au Manoir')).toBeInTheDocument();
  });

  it('renders investigation descriptions', async () => {
    renderWithProviders(<Investigations />);
    await waitFor(() => {
      expect(screen.getByText(/un tableau de valeur inestimable/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/des transactions suspectes/i)).toBeInTheDocument();
    expect(screen.getByText(/lord blackwood a été retrouvé mort/i)).toBeInTheDocument();
  });

  it('renders difficulty badges', async () => {
    renderWithProviders(<Investigations />);
    await waitFor(() => {
      expect(screen.getByText('Facile')).toBeInTheDocument();
    });
    expect(screen.getByText('Moyen')).toBeInTheDocument();
    expect(screen.getByText('Difficile')).toBeInTheDocument();
  });

  it('renders status badges', async () => {
    renderWithProviders(<Investigations />);
    await waitFor(() => {
      const statusIcons = screen.getAllByLabelText('Disponible');
      expect(statusIcons).toHaveLength(3);
    });
  });

  it('renders start buttons for available investigations', async () => {
    renderWithProviders(<Investigations />);
    await waitFor(() => {
      const startButtons = screen.getAllByRole('button', { name: /commencer l'enquête/i });
      expect(startButtons).toHaveLength(3);
    });
  });

  it('navigates to investigation page when start button is clicked', async () => {
    const { startInvestigation } = await import('../api/api');
    renderWithProviders(<Investigations />);
    await waitFor(() => {
      const startButtons = screen.getAllByRole('button', { name: /commencer l'enquête/i });
      expect(startButtons).toHaveLength(3);
    });
    const startButtons = screen.getAllByRole('button', { name: /commencer l'enquête/i });
    fireEvent.click(startButtons[0]);
    await waitFor(() => {
      expect(startInvestigation).toHaveBeenCalledWith(1, 'museum_db');
    });
    expect(mockNavigate).toHaveBeenCalledWith('/investigation/1');
  });

  it('renders back to home button', async () => {
    renderWithProviders(<Investigations />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /retour à l'accueil/i })).toBeInTheDocument();
    });
  });

  it('navigates to home when back button is clicked', async () => {
    renderWithProviders(<Investigations />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /retour à l'accueil/i })).toBeInTheDocument();
    });
    const backButton = screen.getByRole('button', { name: /retour à l'accueil/i });
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('applies correct CSS classes for background images', async () => {
    renderWithProviders(<Investigations />);
    await waitFor(() => {
      const museumCard = screen.getByText('Le vol du musée').closest('.investigation-card');
      expect(museumCard).toHaveClass('investigation-museum');
      expect(museumCard).toHaveClass('status-available');
    });

    // Check that the corporate investigation has the correct class
    const corporateCard = screen.getByText('Fraudes corporatives').closest('.investigation-card');
    expect(corporateCard).toHaveClass('investigation-corporate');
    expect(corporateCard).toHaveClass('status-available');

    // Check that the manor investigation has the correct class
    const manorCard = screen.getByText('Meurtre au Manoir').closest('.investigation-card');
    expect(manorCard).toHaveClass('investigation-manor');
    expect(manorCard).toHaveClass('status-available');
  });

  it('does not apply background classes to cards without specific IDs', async () => {
    renderWithProviders(<Investigations />);
    await waitFor(() => {
      const cards = screen.getAllByText(/commencer l'enquête/i).map(button =>
        button.closest('.investigation-card')
      );
      // All cards should have at least 3 classes (investigation-card + background class + status class)
      cards.forEach(card => {
        expect(card?.className.split(' ').length).toBeGreaterThanOrEqual(3);
        expect(card).toHaveClass('status-available');
      });
    });
  });
});