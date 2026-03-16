import { render, screen } from '@testing-library/react';
import { AuthProvider } from '../contexts/AuthProvider';
import App from '../App';
import { describe, it, expect } from 'vitest';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <AuthProvider>
      {component}
    </AuthProvider>
  );
};

describe('App', () => {
  it('renders landing page by default when not authenticated', async () => {
    renderWithProviders(<App />);
    // La route / affiche la LandingPage pour les visiteurs non connectés
    expect(await screen.findByRole('link', { name: /connexion/i })).toBeInTheDocument();
  });
});