import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { AuthProvider } from '../contexts/AuthProvider';
import About from '../components/About';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('About', () => {
  it('renders the page title and subtitle', () => {
    renderWithProviders(<About />);
    expect(screen.getByText('À propos de SQLock Holmes')).toBeInTheDocument();
    expect(screen.getByText('Apprenez SQL de manière ludique en résolvant des enquêtes captivantes')).toBeInTheDocument();
  });

  it('renders mission section', () => {
    renderWithProviders(<About />);
    expect(screen.getByText('Notre Mission')).toBeInTheDocument();
    expect(screen.getByText(/SQLock Holmes est une plateforme d'apprentissage qui transforme/i)).toBeInTheDocument();
  });

  it('renders "Comment ça marche" section with 4 steps', () => {
    renderWithProviders(<About />);
    expect(screen.getByText('Comment ça marche ?')).toBeInTheDocument();
    expect(screen.getByText('Choisissez une enquête')).toBeInTheDocument();
    expect(screen.getByText('Analysez les indices')).toBeInTheDocument();
    expect(screen.getByText('Interrogez la base de données')).toBeInTheDocument();
    expect(screen.getByText('Résolvez le mystère')).toBeInTheDocument();
  });

  it('renders features list', () => {
    renderWithProviders(<About />);
    expect(screen.getByText('Fonctionnalités')).toBeInTheDocument();
    expect(screen.getByText('Éditeur SQL intégré')).toBeInTheDocument();
    expect(screen.getByText("Système d'indices")).toBeInTheDocument();
    expect(screen.getByText('Historique des requêtes')).toBeInTheDocument();
    expect(screen.getByText('Classement et statistiques')).toBeInTheDocument();
    expect(screen.getByText('Feedback immédiat')).toBeInTheDocument();
  });

  it('renders SQL resources section with external links', () => {
    renderWithProviders(<About />);
    expect(screen.getByText('Ressources SQL')).toBeInTheDocument();
    
    const w3schoolsLink = screen.getByRole('link', { name: /W3Schools SQL Tutorial/i });
    expect(w3schoolsLink).toBeInTheDocument();
    expect(w3schoolsLink).toHaveAttribute('href', 'https://www.w3schools.com/sql/');
    expect(w3schoolsLink).toHaveAttribute('target', '_blank');
    expect(w3schoolsLink).toHaveAttribute('rel', 'noopener noreferrer');

    const sqlShLink = screen.getByRole('link', { name: /SQL\.sh/i });
    expect(sqlShLink).toBeInTheDocument();
    expect(sqlShLink).toHaveAttribute('href', 'https://sql.sh/');

    const postgresLink = screen.getByRole('link', { name: /PostgreSQL Documentation/i });
    expect(postgresLink).toBeInTheDocument();
    expect(postgresLink).toHaveAttribute('href', 'https://www.postgresql.org/docs/');
  });

  it('renders SQL basics section with commands', () => {
    renderWithProviders(<About />);
    expect(screen.getByText('Les bases de SQL')).toBeInTheDocument();
    
    const selectHeadings = screen.getAllByText(/SELECT/);
    expect(selectHeadings.length).toBeGreaterThan(0);
    
    const whereHeadings = screen.getAllByText(/WHERE/);
    expect(whereHeadings.length).toBeGreaterThan(0);
    
    const joinHeadings = screen.getAllByText(/JOIN/);
    expect(joinHeadings.length).toBeGreaterThan(0);
    
    const groupByHeadings = screen.getAllByText(/GROUP BY/);
    expect(groupByHeadings.length).toBeGreaterThan(0);
    
    const orderByHeadings = screen.getAllByText(/ORDER BY/);
    expect(orderByHeadings.length).toBeGreaterThan(0);
  });

  it('renders SQL code examples', () => {
    renderWithProviders(<About />);
    
    expect(screen.getByText(/Récupère des données depuis une table/)).toBeInTheDocument();
    expect(screen.getByText(/Filtre les résultats selon une condition/)).toBeInTheDocument();
    expect(screen.getByText(/Combine des données de plusieurs tables/)).toBeInTheDocument();
    expect(screen.getByText(/Regroupe les résultats et applique des fonctions d'agrégation/)).toBeInTheDocument();
    expect(screen.getByText(/Trie les résultats/)).toBeInTheDocument();
  });

  it('renders CTA section with button', () => {
    renderWithProviders(<About />);
    expect(screen.getByText('Prêt à devenir un détective SQL ?')).toBeInTheDocument();
    expect(screen.getByText(/Commencez votre première enquête/i)).toBeInTheDocument();
    
    const ctaButton = screen.getByRole('link', { name: /Explorer les enquêtes/i });
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveAttribute('href', '/investigations');
  });

  it('renders all main sections', () => {
    renderWithProviders(<About />);
    
    const sections = screen.getAllByRole('generic').filter(el => 
      el.className.includes('about-section')
    );
    
    expect(sections.length).toBeGreaterThan(0);
  });

  it('has proper structure with container', () => {
    const { container } = renderWithProviders(<About />);
    
    const aboutContainer = container.querySelector('.about-container');
    expect(aboutContainer).toBeInTheDocument();
  });

  it('renders step numbers correctly', () => {
    renderWithProviders(<About />);
    
    const stepCards = screen.getAllByText(/Choisissez une enquête|Analysez les indices|Interrogez la base|Résolvez le mystère/);
    expect(stepCards.length).toBe(4);
  });

  it('renders icons in sections', () => {
    const { container } = renderWithProviders(<About />);
    
    const svgElements = container.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThan(0);
  });

  it('renders feature descriptions', () => {
    renderWithProviders(<About />);
    
    expect(screen.getByText(/Éditeur Monaco \(VS Code\) avec coloration syntaxique/i)).toBeInTheDocument();
    expect(screen.getByText(/Débloquez des indices progressifs/i)).toBeInTheDocument();
    expect(screen.getByText(/Consultez et rechargez vos requêtes précédentes/i)).toBeInTheDocument();
    expect(screen.getByText(/Comparez vos performances avec les autres détectives/i)).toBeInTheDocument();
  });

  it('has accessible structure', () => {
    renderWithProviders(<About />);
    
    const headings = screen.getAllByRole('heading', { level: 2 });
    expect(headings.length).toBeGreaterThan(0);
  });
});