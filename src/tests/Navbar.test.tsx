import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { AuthProvider } from '../contexts/AuthProvider';
import { LeaderboardRefreshProvider } from '../contexts/LeaderboardRefreshContext';
import Navbar from '../components/Navbar';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <AuthProvider>
      <LeaderboardRefreshProvider>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </LeaderboardRefreshProvider>
    </AuthProvider>
  );
};

describe('Navbar', () => {
  it('renders navbar with hamburger menu', () => {
    renderWithProviders(<Navbar />);
    const hamburgerButton = screen.getByRole('button', { name: /ouvrir le menu/i });
    expect(hamburgerButton).toBeInTheDocument();
  });

  it('renders mobile navbar', () => {
    renderWithProviders(<Navbar />);
    const mobileNav = screen.getByRole('navigation', { name: /navigation mobile/i });
    expect(mobileNav).toBeInTheDocument();
  });

  it('toggles menu when hamburger is clicked', () => {
    renderWithProviders(<Navbar />);
    const hamburgerButton = screen.getByRole('button', { name: /ouvrir le menu/i });

    // Menu should be closed initially
    expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');

    // Click to open
    fireEvent.click(hamburgerButton);
    expect(hamburgerButton).toHaveAttribute('aria-expanded', 'true');

    // Click to close
    fireEvent.click(hamburgerButton);
    expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders navigation links', () => {
    renderWithProviders(<Navbar />);
    // Check that links exist (may be duplicated between desktop and mobile nav)
    const accueilLinks = screen.getAllByRole('link', { name: /accueil/i });
    const accountLinks = screen.getAllByRole('link', { name: /mon compte/i });
    const investigationsLinks = screen.getAllByRole('link', { name: /enquêtes/i });
    const logoutLinks = screen.getAllByRole('link', { name: /déconnexion/i });

    expect(accueilLinks.length).toBeGreaterThan(0);
    expect(accountLinks.length).toBeGreaterThan(0);
    expect(investigationsLinks.length).toBeGreaterThan(0);
    expect(logoutLinks.length).toBeGreaterThan(0);
  });

  it('renders mobile navigation icons', () => {
    renderWithProviders(<Navbar />);
    // Check that mobile navigation links exist by aria-label
    const homeLinks = screen.getAllByRole('link', { name: 'Accueil' });
    const accountLinks = screen.getAllByRole('link', { name: 'Mon compte' });
    const investigationsLinks = screen.getAllByRole('link', { name: 'Enquêtes' });
    const logoutLinks = screen.getAllByRole('link', { name: 'Déconnexion' });

    expect(homeLinks.length).toBeGreaterThan(0);
    expect(accountLinks.length).toBeGreaterThan(0);
    expect(investigationsLinks.length).toBeGreaterThan(0);
    expect(logoutLinks.length).toBeGreaterThan(0);
  });
});