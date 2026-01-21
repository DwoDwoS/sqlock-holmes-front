import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    if (path === '#accueil' && location.pathname === '/') {
      return true;
    }
    return false;
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
          />
        </div>
        <ul className={`navbar-menu ${isMenuOpen ? 'open' : ''}`} role="menu">
          <li role="menuitem"><a href="#accueil" className={isActive('#accueil') ? 'active' : ''}>Accueil</a></li>
          <li role="menuitem"><a href="#compte">Mon compte</a></li>
          <li role="menuitem"><a href="#enquetes">Enquêtes</a></li>
          <li role="menuitem"><a href="#deconnexion">Déconnexion</a></li>
        </ul>
      </nav>

      <nav className="mobile-navbar" role="navigation" aria-label="Navigation mobile">
        <ul className="mobile-navbar-menu">
          <li><a href="#accueil" aria-label="Accueil" className={isActive('#accueil') ? 'active' : ''}><span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house-icon lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></span></a></li>
          <li><a href="#compte" aria-label="Mon compte"><span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hat-glasses-icon lucide-hat-glasses"><path d="M14 18a2 2 0 0 0-4 0"/><path d="m19 11-2.11-6.657a2 2 0 0 0-2.752-1.148l-1.276.61A2 2 0 0 1 12 4H8.5a2 2 0 0 0-1.925 1.456L5 11"/><path d="M2 11h20"/><circle cx="17" cy="18" r="3"/><circle cx="7" cy="18" r="3"/></svg></span></a></li>
          <li><a href="#enquetes" aria-label="Enquêtes"><span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search-code-icon lucide-search-code"><path d="m13 13.5 2-2.5-2-2.5"/><path d="m21 21-4.3-4.3"/><path d="M9 8.5 7 11l2 2.5"/><circle cx="11" cy="11" r="8"/></svg></span></a></li>
          <li><a href="#deconnexion" aria-label="Déconnexion"><span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out-icon lucide-log-out"><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></svg></span></a></li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;