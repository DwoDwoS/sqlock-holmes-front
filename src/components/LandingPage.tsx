import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './LandingPage.scss';

const LandingPage: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="landing-loading" role="status" aria-live="polite">
        <div>Chargement...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="landing-page">
      <a href="#main-content" className="landing-skip-link">Aller au contenu principal</a>
      <header className="landing-header">
        <nav className="landing-header-nav" aria-label="Navigation principale">
          <Link to="/about" className="landing-nav-link">À propos</Link>
          <Link to="/login" className="landing-btn-secondary">Connexion</Link>
          <Link to="/register" className="landing-btn-primary">S'inscrire</Link>
        </nav>
      </header>

      <main id="main-content">
        <section className="landing-hero" aria-labelledby="hero-title">
          <div className="landing-hero-card">
            <img
              src="/SQLock_Holmes_Logo.webp"
              alt="SQLock Holmes"
              className="landing-hero-logo"
              width="280"
              height="152"
            />
            <p className="landing-hero-tagline">
              Outil de résolution d'enquêtes en exécutant des requêtes SQL
            </p>
            <h1 id="hero-title" className="landing-hero-title">
              Devenez Détective <span className="landing-hero-highlight">SQL</span>
            </h1>
            <p className="landing-hero-subtitle">
              Résolvez des enquêtes policières en utilisant vos compétences en SQL.
              Apprenez le langage de requête des bases de données en vous amusant.
            </p>
            <div className="landing-hero-actions">
              <Link to="/register" className="landing-btn-primary landing-btn-large">
                Commencer l'aventure
              </Link>
              <Link to="/login" className="landing-btn-outline landing-btn-large">
                Déjà détective ? Se connecter
              </Link>
            </div>
          </div>
        </section>

        <section className="landing-features" aria-labelledby="features-title">
          <h2 id="features-title" className="landing-section-title">Comment ça fonctionne ?</h2>
          <ul className="landing-features-grid">
            <li className="landing-feature-card">
              <div className="landing-feature-icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 18a2 2 0 0 0-4 0"/>
                  <path d="m19 11-2.11-6.657a2 2 0 0 0-2.752-1.148l-1.276.61A2 2 0 0 1 12 4H8.5a2 2 0 0 0-1.925 1.456L5 11"/>
                  <path d="M2 11h20"/>
                  <circle cx="17" cy="18" r="3"/>
                  <circle cx="7" cy="18" r="3"/>
                </svg>
              </div>
              <h3>Choisissez une enquête</h3>
              <p>Parcourez notre catalogue d'affaires criminelles à résoudre. Chaque enquête vous plonge dans un scénario unique avec ses propres données.</p>
            </li>

            <li className="landing-feature-card">
              <div className="landing-feature-icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m13 13.5 2-2.5-2-2.5"/>
                  <path d="m21 21-4.3-4.3"/>
                  <path d="M9 8.5 7 11l2 2.5"/>
                  <circle cx="11" cy="11" r="8"/>
                </svg>
              </div>
              <h3>Interrogez la base de données</h3>
              <p>Utilisez des requêtes SQL pour fouiller les indices, identifier les suspects et percer les mystères. Des indices sont disponibles si vous bloquez.</p>
            </li>

            <li className="landing-feature-card">
              <div className="landing-feature-icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                  <path d="M4 22h16"/>
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
                </svg>
              </div>
              <h3>Grimpez au classement</h3>
              <p>Comparez vos performances à celles des autres détectives. Plus vous résolvez d'affaires rapidement et sans indices, plus vous montez dans le classement.</p>
            </li>
          </ul>
        </section>

        <section className="landing-cta" aria-labelledby="cta-title">
          <div className="landing-cta-content">
            <h2 id="cta-title">Prêt à mener l'enquête ?</h2>
            <p>Rejoignez la communauté de détectives SQL et commencez à résoudre des affaires dès maintenant. C'est gratuit.</p>
            <Link to="/register" className="landing-btn-primary landing-btn-large">
              Créer un compte gratuitement
            </Link>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <nav aria-label="Liens du pied de page">
          <Link to="/about">À propos</Link>
          <span aria-hidden="true"> · </span>
          <Link to="/privacy">Confidentialité</Link>
          <span aria-hidden="true"> · </span>
          <Link to="/terms">Conditions d'utilisation</Link>
        </nav>
        <p className="landing-footer-copy">© {new Date().getFullYear()} SQLock Holmes. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default LandingPage;