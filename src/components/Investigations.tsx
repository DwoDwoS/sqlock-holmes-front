import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getInvestigations, restartInvestigation } from '../services/investigationService';
import { getDifficultyClass } from '../utils/formatters';
import type { Investigation } from '../types/investigation';

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

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (!document.hidden) {
        try {
          const data = await getInvestigations();
          if (Array.isArray(data) && data.length > 0) {
            setInvestigations(data);
          }
        } catch (error) {
          console.error('Erreur lors du rafraîchissement:', error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleRestart = async (investigationId: number) => {
    try {
      await restartInvestigation(investigationId);
      navigate(`/investigation/${investigationId}`);
    } catch (error) {
      console.error('Erreur lors du redémarrage de l\'enquête:', error);
      alert('Erreur lors du redémarrage de l\'enquête.');
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
            <div key={investigation.id} className={`investigation-card ${backgroundClass} ${investigation.status === 'Disponible' ? 'status-available' : 'status-unavailable'} ${investigation.status === 'Terminée' ? 'status-completed' : ''}`}>
              <div className="investigation-header">
                <h2>{investigation.title || 'Sans titre'}</h2>
                <div className="investigation-badges">
                  {investigation.status === 'Terminée' && (
                    <span className="badge badge-resolved">
                      ✓ Résolue
                    </span>
                  )}
                  <span className={`badge difficulte ${getDifficultyClass(investigation.difficulty)}`}>
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
              {investigation.status === 'Terminée' ? (
                <button
                  className="primary-button"
                  onClick={() => handleRestart(investigation.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}>
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                    <path d="M21 3v5h-5"/>
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                    <path d="M3 21v-5h5"/>
                  </svg>
                  Rejouer l'enquête
                </button>
              ) : (
                <Link
                  to={`/investigation/${investigation.id}`}
                  className={`primary-button ${investigation.status !== 'Disponible' && investigation.status !== 'En cours' ? 'disabled' : ''}`}
                  onClick={(e) => {
                    if (investigation.status !== 'Disponible' && investigation.status !== 'En cours') {
                      e.preventDefault();
                    }
                  }}
                >
                  {investigation.status === 'Disponible' ? 'Commencer l\'enquête' : 'Continuer'}
                </Link>
              )}
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