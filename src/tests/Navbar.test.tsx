import { render, screen } from '@testing-library/react';
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

describe('Navbar (visiteur non connecté)', () => {
  it('renders public navbar without hamburger menu', () => {
    renderWithProviders(<Navbar />);
    // La navbar publique n'a pas de bouton hamburger
    expect(screen.queryByRole('button', { name: /ouvrir le menu/i })).not.toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /navigation principale/i })).toBeInTheDocument();
  });

  it('renders mobile navbar', () => {
    renderWithProviders(<Navbar />);
    const mobileNav = screen.getByRole('navigation', { name: /navigation mobile/i });
    expect(mobileNav).toBeInTheDocument();
  });

  it('renders public navigation links', () => {
    renderWithProviders(<Navbar />);
    const accueilLinks = screen.getAllByRole('link', { name: /accueil/i });
    const aboutLinks = screen.getAllByRole('link', { name: /à propos/i });
    const loginLinks = screen.getAllByRole('link', { name: /connexion/i });
    const registerLinks = screen.getAllByRole('link', { name: /s'inscrire/i });

    expect(accueilLinks.length).toBeGreaterThan(0);
    expect(aboutLinks.length).toBeGreaterThan(0);
    expect(loginLinks.length).toBeGreaterThan(0);
    expect(registerLinks.length).toBeGreaterThan(0);
  });

  it('does not render authenticated links', () => {
    renderWithProviders(<Navbar />);
    expect(screen.queryByRole('link', { name: /mon compte/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /enquêtes/i })).not.toBeInTheDocument();
  });

  it('renders mobile navigation icons', () => {
    renderWithProviders(<Navbar />);
    const homeLinks = screen.getAllByRole('link', { name: 'Accueil' });
    const aboutLinks = screen.getAllByRole('link', { name: 'À propos' });

    expect(homeLinks.length).toBeGreaterThan(0);
    expect(aboutLinks.length).toBeGreaterThan(0);
  });
});