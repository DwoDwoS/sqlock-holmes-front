import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider } from '../contexts/AuthProvider';
import Investigations from '../components/Investigations';

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

  it('renders the page title and description', () => {
    renderWithProviders(<Investigations />);
    expect(screen.getByText('Sélection des Enquêtes')).toBeInTheDocument();
    expect(screen.getByText(/choisissez une enquête à résoudre/i)).toBeInTheDocument();
  });

  it('renders all investigation cards', () => {
    renderWithProviders(<Investigations />);
    expect(screen.getByText('Le vol du musée')).toBeInTheDocument();
    expect(screen.getByText('Fraudes corporatives')).toBeInTheDocument();
    expect(screen.getByText('Meurtre au Manoir')).toBeInTheDocument();
  });

  it('renders investigation descriptions', () => {
    renderWithProviders(<Investigations />);
    expect(screen.getByText(/un tableau de valeur inestimable/i)).toBeInTheDocument();
    expect(screen.getByText(/des transactions suspectes/i)).toBeInTheDocument();
    expect(screen.getByText(/lord blackwood a été retrouvé mort/i)).toBeInTheDocument();
  });

  it('renders difficulty badges', () => {
    renderWithProviders(<Investigations />);
    expect(screen.getByText('Facile')).toBeInTheDocument();
    expect(screen.getByText('Moyen')).toBeInTheDocument();
    expect(screen.getByText('Difficile')).toBeInTheDocument();
  });

  it('renders status badges', () => {
    renderWithProviders(<Investigations />);
    const statusBadges = screen.getAllByText('Disponible');
    expect(statusBadges).toHaveLength(3);
  });

  it('renders start buttons for available investigations', () => {
    renderWithProviders(<Investigations />);
    const startButtons = screen.getAllByRole('button', { name: /commencer l'enquête/i });
    expect(startButtons).toHaveLength(3);
  });

  it('navigates to investigation page when start button is clicked', () => {
    renderWithProviders(<Investigations />);
    const startButtons = screen.getAllByRole('button', { name: /commencer l'enquête/i });
    fireEvent.click(startButtons[0]); // Click first investigation
    expect(mockNavigate).toHaveBeenCalledWith('/investigation/1');
  });

  it('renders back to home button', () => {
    renderWithProviders(<Investigations />);
    expect(screen.getByRole('button', { name: /retour à l'accueil/i })).toBeInTheDocument();
  });

  it('navigates to home when back button is clicked', () => {
    renderWithProviders(<Investigations />);
    const backButton = screen.getByRole('button', { name: /retour à l'accueil/i });
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('applies correct CSS classes for background images', () => {
    renderWithProviders(<Investigations />);
    // Check that the museum investigation has the correct class
    const museumCard = screen.getByText('Le vol du musée').closest('.investigation-card');
    expect(museumCard).toHaveClass('investigation-museum');

    // Check that the corporate investigation has the correct class
    const corporateCard = screen.getByText('Fraudes corporatives').closest('.investigation-card');
    expect(corporateCard).toHaveClass('investigation-corporate');

    // Check that the manor investigation has the correct class
    const manorCard = screen.getByText('Meurtre au Manoir').closest('.investigation-card');
    expect(manorCard).toHaveClass('investigation-manor');
  });

  it('does not apply background classes to cards without specific IDs', () => {
    renderWithProviders(<Investigations />);
    const cards = screen.getAllByText(/commencer l'enquête/i).map(button =>
      button.closest('.investigation-card')
    );
    // All cards should have exactly one class (investigation-card + background class)
    cards.forEach(card => {
      expect(card?.className.split(' ').length).toBe(2);
    });
  });
});