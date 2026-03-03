import { Link } from 'react-router-dom';
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
              <li><Link to="/about">À propos</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Légal</h4>
            <ul>
              <li><Link to="/privacy">Confidentialité</Link></li>
              <li><Link to="/terms">Conditions d'utilisation</Link></li>
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