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
  it('renders login page by default when not authenticated', () => {
    renderWithProviders(<App />);
    expect(screen.getByRole('heading', { name: /Connexion/i })).toBeInTheDocument();
  });
});