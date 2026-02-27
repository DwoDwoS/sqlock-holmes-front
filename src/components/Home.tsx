import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <section className="welcome-section" aria-labelledby="welcome-heading">
        <div className="welcome-card">
          <h2 id="welcome-heading">Bienvenue, Détective {user?.username} !</h2>
          <p>Vous êtes maintenant connecté à votre plateforme d'investigation numérique.</p>
          <p>Utilisez les outils à votre disposition pour résoudre les mystères des bases de données.</p>
          <p>Si vous n'êtes pas familier avec les requêtes SQL, n'hésitez pas à consulter notre section <a href="/about">À propos</a> pour en savoir plus.</p>

          <div className="features-grid" role="list">
            <article className="feature-item" role="listitem">
              <div className="feature-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hat-glasses-icon lucide-hat-glasses"><path d="M14 18a2 2 0 0 0-4 0"/><path d="m19 11-2.11-6.657a2 2 0 0 0-2.752-1.148l-1.276.61A2 2 0 0 1 12 4H8.5a2 2 0 0 0-1.925 1.456L5 11"/><path d="M2 11h20"/><circle cx="17" cy="18" r="3"/><circle cx="7" cy="18" r="3"/></svg></div>
              <h3>Enquêtes SQL</h3>
              <p>Accédez à des enquêtes policières que vous devrez résoudre en exécutant des requêtes SQL</p>
            </article>
            <article className="feature-item" role="listitem">
              <div className="feature-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chart-column-decreasing-icon lucide-chart-column-decreasing"><path d="M13 17V9"/><path d="M18 17v-3"/><path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M8 17V5"/></svg></div>
              <h3>Statistiques</h3>
              <p>Consultez vos performances d'investigation et comparez-vous aux autres détectives. Elles arrivent prochainement.</p>
            </article>
            <article className="feature-item" role="listitem">
              <div className="feature-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-pen-icon lucide-user-pen"><path d="M11.5 15H7a4 4 0 0 0-4 4v2"/><path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/><circle cx="10" cy="7" r="4"/></svg></div>
              <h3>Mon compte</h3>
              <p>Accédez à votre profil</p>
            </article>
          </div>

          <div className="action-buttons">
            <button className="primary-button" onClick={() => navigate('/investigations')}>Trouver une enquête</button>
            <button className="secondary-button" onClick={logout}>Déconnexion</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;