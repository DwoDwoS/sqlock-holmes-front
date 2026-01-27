import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getInvestigations } from '../services/investigationService';

interface Investigation {
  id: number;
  title: string;
  description: string;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  status: 'Disponible' | 'En cours' | 'Terminée';
  databaseId: string;
}

const Investigations: React.FC = () => {
  const navigate = useNavigate();
  const [investigations, setInvestigations] = useState<Investigation[]>([
    {
      id: 1,
      title: 'Le vol du musée',
      description: 'Un tableau de valeur inestimable a disparu du musée national. Les caméras de sécurité ont filmé plusieurs personnes suspectes. Analysez les données pour identifier le voleur.',
      difficulty: 'Facile',
      status: 'Disponible',
      databaseId: 'museum_db'
    },
    {
      id: 2,
      title: 'Fraudes corporatives',
      description: 'Des transactions suspectes ont été détectées dans les comptes de l\'entreprise TechCorp. Identifiez l\'employé responsable et découvrez comment il a détourné les fonds.',
      difficulty: 'Moyen',
      status: 'Disponible',
      databaseId: 'corporate_db'
    },
    {
      id: 3,
      title: 'Meurtre au Manoir',
      description: 'Lord Blackwood a été retrouvé mort dans sa bibliothèque. Six personnes étaient présentes ce soir-là. Qui est le meurtrier ? Et pourquoi ?',
      difficulty: 'Difficile',
      status: 'Disponible',
      databaseId: 'manor_db'
    }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvestigations = async () => {
      setLoading(true);
      try {
        const data = await getInvestigations();
        if (Array.isArray(data) && data.length > 0) {
          setInvestigations(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des investigations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInvestigations();
  }, []);

  const getDifficulteColor = (difficulte: string) => {
    switch (difficulte) {
      case 'Facile': return 'difficulty-easy';
      case 'Moyen': return 'difficulty-medium';
      case 'Difficile': return 'difficulty-hard';
      default: return '';
    }
  };

  return (
    <div className="investigations-container">
      <h1>Sélection des Enquêtes</h1>
      <p>Choisissez une enquête à résoudre en utilisant vos compétences SQL. Survolez les enquêtes pour en connaître l'intrigue.</p>

      {loading && <p>Chargement des données depuis le serveur...</p>}

      <div className="investigations-grid">
        {Array.isArray(investigations) && investigations.map((investigation) => {
          let backgroundClass = '';
          if (investigation.id === 1) backgroundClass = 'investigation-museum';
          else if (investigation.id === 2) backgroundClass = 'investigation-corporate';
          else if (investigation.id === 3) backgroundClass = 'investigation-manor';
          
          return (
            <div key={investigation.id} className={`investigation-card ${backgroundClass} ${investigation.status === 'Disponible' ? 'status-available' : 'status-unavailable'}`}>
              <div className="investigation-header">
                <h2>{investigation.title || 'Sans titre'}</h2>
                <div className="investigation-badges">
                  <span className={`badge difficulte ${getDifficulteColor(investigation.difficulty)}`}>
                    {investigation.difficulty || '—'}
                  </span>
                  <div className="status-icon" aria-label={investigation.status}>
                    {investigation.status === 'Disponible' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22,4 12,14.01 9,11.01"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-circle">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="m15 9-6 6"/>
                        <path d="m9 9 6 6"/>
                      </svg>
                    )}
                  </div>
                </div>
              </div>
              <div className="investigation-description">
                <p>{investigation.description}</p>
              </div>
              <Link
                to={`/investigation/${investigation.id}`}
                className={`primary-button ${investigation.status !== 'Disponible' ? 'disabled' : ''}`}
                onClick={(e) => {
                  if (investigation.status !== 'Disponible') {
                    e.preventDefault();
                  }
                }}
              >
                {investigation.status === 'Disponible' ? 'Commencer l\'enquête' :
                 investigation.status === 'En cours' ? 'Continuer' : 'Revoir'}
              </Link>
            </div>
          );
        })}
      </div>

      <div className="investigations-actions">
        <button className="primary-button" onClick={() => navigate('/')}>
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default Investigations;