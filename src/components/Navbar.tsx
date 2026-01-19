import { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className="navbar" role="navigation" aria-label="Navigation principale">
        <div className="navbar-container">
          <button
            className={`hamburger ${isMenuOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-label="Ouvrir le menu"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
          <h2 className="navbar-title">SQLock Holmes</h2>
        </div>
        <ul className={`navbar-menu ${isMenuOpen ? 'open' : ''}`} role="menu">
          <li role="menuitem"><a href="#accueil">Accueil</a></li>
          <li role="menuitem"><a href="#compte">Mon compte</a></li>
          <li role="menuitem"><a href="#enquetes">Enquêtes</a></li>
          <li role="menuitem"><a href="#deconnexion">Déconnexion</a></li>
        </ul>
      </nav>

      <nav className="mobile-navbar" role="navigation" aria-label="Navigation mobile">
        <ul className="mobile-navbar-menu">
          <li><a href="#accueil" aria-label="Accueil"><span>Accueil</span></a></li>
          <li><a href="#compte" aria-label="Mon compte"><span>Mon compte</span></a></li>
          <li><a href="#enquetes" aria-label="Enquêtes"><span>Enquêtes</span></a></li>
          <li><a href="#deconnexion" aria-label="Déconnexion"><span>Déconnexion</span></a></li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;