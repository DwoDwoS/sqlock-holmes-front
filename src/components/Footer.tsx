import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>SQLock Holmes</h3>
            <p>Outil d'analyse et de résolution d'enquêtes SQL</p>
          </div>
          <div className="footer-section">
            <h4>Liens utiles</h4>
            <ul>
              <li><a href="#about">À propos</a></li>
              <li><a href="#help">Aide</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Légal</h4>
            <ul>
              <li><a href="#privacy">Confidentialité</a></li>
              <li><a href="#terms">Conditions d'utilisation</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 SQLock Holmes. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;