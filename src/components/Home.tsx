import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './Home.scss';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <main className="home-page">
      <section className="home-card" aria-labelledby="home-heading">
        <img
          src="sqlock-holmes-logo.webp"
          alt="Logo SQLock Holmes"
          className="home-card-logo"
          fetchPriority="high"
          width="240"
          height="130"
        />
        <h1 id="home-heading">Bienvenue, Détective {user?.username} !</h1>
        <p>Vous êtes maintenant connecté à votre plateforme d'investigation numérique.</p>
        <p>Utilisez les outils à votre disposition pour résoudre les mystères des bases de données.</p>
        <p>
          Si vous n'êtes pas familier avec les requêtes SQL, n'hésitez pas à consulter notre section{' '}
          <a href="/about">À propos</a> pour en savoir plus.
        </p>
        <div className="home-card-actions" role="group" aria-label="Actions principales">
          <button type="button" className="home-card-btn-primary" onClick={() => navigate('/investigations')}>
            Trouver une enquête
          </button>
          <button type="button" className="home-card-btn-secondary" onClick={logout}>
            Déconnexion
          </button>
        </div>
      </section>
    </main>
  );
};

export default Home;