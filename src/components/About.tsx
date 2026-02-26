import React from 'react';
import './About.css';

const About: React.FC = () => {
  return (
    <div className="about-container">
      <div className="about-hero">
        <h1>À propos de SQLock Holmes</h1>
        <p className="hero-subtitle">Apprenez SQL de manière ludique en résolvant des enquêtes captivantes</p>
      </div>

      <section className="about-section">
        <div className="about-card">
          <div className="section-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <h2>Notre Mission</h2>
          <p>
            SQLock Holmes est une plateforme d'apprentissage qui transforme l'apprentissage du SQL 
            en une aventure passionnante. Plongez dans des enquêtes policières captivantes où vos compétences 
            en SQL sont la clé pour résoudre des mystères.
          </p>
          <p>
            Mon objectif est de rendre l'apprentissage du SQL accessible, ludique et engageant pour tous, 
            du débutant au développeur expérimenté cherchant à perfectionner ses compétences.
          </p>
        </div>
      </section>

      <section className="about-section">
        <div className="about-card">
          <div className="section-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4"/>
              <path d="M12 8h.01"/>
            </svg>
          </div>
          <h2>Comment ça marche ?</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Choisissez une enquête</h3>
              <p>Parcourez notre catalogue d'enquêtes policières et sélectionnez celle qui vous intrigue le plus.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Analysez les indices</h3>
              <p>Lisez attentivement le contexte de l'enquête et les indices disponibles pour comprendre le mystère.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Interrogez la base de données</h3>
              <p>Utilisez l'éditeur SQL intégré pour écrire vos requêtes et explorer les données. Utilisez Ctrl+Entrée pour exécuter rapidement vos requêtes.</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Résolvez le mystère</h3>
              <p>Analysez les résultats, identifiez le coupable et son mobile, puis soumettez votre solution.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="about-card">
          <div className="section-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <line x1="10" y1="9" x2="8" y2="9"/>
            </svg>
          </div>
          <h2>Fonctionnalités</h2>
          <div className="features-list">
            <div className="feature-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <div>
                <h4>Éditeur SQL intégré</h4>
                <p>Éditeur Monaco (VS Code) avec coloration syntaxique</p>
              </div>
            </div>
            <div className="feature-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <div>
                <h4>Système d'indices</h4>
                <p>Débloquez des indices progressifs si vous êtes bloqué</p>
              </div>
            </div>
            <div className="feature-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <div>
                <h4>Historique des requêtes</h4>
                <p>Consultez et rechargez vos requêtes précédentes</p>
              </div>
            </div>
            <div className="feature-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <div>
                <h4>Classement et statistiques</h4>
                <p>Comparez vos performances avec les autres détectives</p>
              </div>
            </div>
            <div className="feature-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <div>
                <h4>Feedback immédiat</h4>
                <p>Vérifiez vos réponses instantanément et apprenez de vos erreurs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="about-card sql-basics-card">
          <div className="section-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6"/>
              <polyline points="8 6 2 12 8 18"/>
            </svg>
          </div>
          <h2>Les bases de SQL</h2>
          <p>Voici les principales commandes SQL que vous utiliserez dans vos enquêtes :</p>
          
          <div className="sql-commands">
            <div className="sql-command-card">
              <h4><code>SELECT</code></h4>
              <p>Récupère des données depuis une table</p>
              <pre><code>{`SELECT nom, prenom 
FROM suspects;`}</code></pre>
            </div>
            
            <div className="sql-command-card">
              <h4><code>WHERE</code></h4>
              <p>Filtre les résultats selon une condition</p>
              <pre><code>{`SELECT * 
FROM suspects 
WHERE age > 30;`}</code></pre>
            </div>
            
            <div className="sql-command-card">
              <h4><code>JOIN</code></h4>
              <p>Combine des données de plusieurs tables</p>
              <pre><code>{`SELECT s.nom, a.lieu 
FROM suspects s 
JOIN alibis a 
  ON s.id = a.suspect_id;`}</code></pre>
            </div>
            
            <div className="sql-command-card">
              <h4><code>GROUP BY</code></h4>
              <p>Regroupe les résultats et applique des fonctions d'agrégation</p>
              <pre><code>{`SELECT lieu, COUNT(*) 
FROM temoignages 
GROUP BY lieu;`}</code></pre>
            </div>
            
            <div className="sql-command-card">
              <h4><code>ORDER BY</code></h4>
              <p>Trie les résultats</p>
              <pre><code>{`SELECT * 
FROM suspects 
ORDER BY nom ASC;`}</code></pre>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="about-card">
          <div className="section-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </div>
          <h2>Ressources SQL</h2>
          <p>Pour approfondir vos connaissances en SQL, voici quelques ressources recommandées :</p>
          <div className="resources-grid">
            <a href="https://www.w3schools.com/sql/" target="_blank" rel="noopener noreferrer" className="resource-card">
              <h4>W3Schools SQL Tutorial</h4>
              <p>Tutoriel interactif complet pour apprendre les bases du SQL avec des exemples pratiques</p>
              <span className="external-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </span>
            </a>
            <a href="https://sql.sh/" target="_blank" rel="noopener noreferrer" className="resource-card">
              <h4>SQL.sh</h4>
              <p>Cours SQL en français avec de nombreux exemples et exercices pratiques</p>
              <span className="external-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </span>
            </a>
            <a href="https://www.postgresql.org/docs/" target="_blank" rel="noopener noreferrer" className="resource-card">
              <h4>PostgreSQL Documentation</h4>
              <p>Documentation officielle de PostgreSQL, une référence complète pour SQL</p>
              <span className="external-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </span>
            </a>
          </div>
        </div>
      </section>

      <section className="about-section cta-section">
        <div className="about-card cta-card">
          <h2>Prêt à devenir un détective SQL ?</h2>
          <p>Commencez votre première enquête dès maintenant et développez vos compétences en SQL !</p>
          <a href="/investigations" className="cta-button">Explorer les enquêtes</a>
        </div>
      </section>
    </div>
  );
};

export default About;