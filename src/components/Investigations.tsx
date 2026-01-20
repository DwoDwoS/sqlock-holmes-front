import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Investigation {
  id: number;
  titre: string;
  description: string;
  difficulte: 'Facile' | 'Moyen' | 'Difficile';
  statut: 'Disponible' | 'En cours' | 'Terminée';
}

const Investigations: React.FC = () => {
  const navigate = useNavigate();

  const investigations: Investigation[] = [
    {
      id: 1,
      titre: 'Le vol du musée',
      description: 'Un tableau de valeur inestimable a disparu du musée national. Les caméras de sécurité ont filmé plusieurs personnes suspectes. Analysez les données pour identifier le voleur.',
      difficulte: 'Facile',
      statut: 'Disponible'
    },
    {
      id: 2,
      titre: 'Fraudes corporatives',
      description: 'Des transactions suspectes ont été détectées dans les comptes de l\'entreprise TechCorp. Identifiez l\'employé responsable et découvrez comment il a détourné les fonds.',
      difficulte: 'Moyen',
      statut: 'Disponible'
    },
    {
      id: 3,
      titre: 'Meurtre au Manoir',
      description: 'Lord Blackwood a été retrouvé mort dans sa bibliothèque. Six personnes étaient présentes ce soir-là. Qui est le meurtrier ? Et pourquoi ?',
      difficulte: 'Difficile',
      statut: 'Disponible'
    }
  ];

  const handleStartInvestigation = (investigationId: number) => {
    navigate(`/investigation/${investigationId}`);
  };

  const getDifficulteColor = (difficulte: string) => {
    switch (difficulte) {
      case 'Facile': return 'difficulte-facile';
      case 'Moyen': return 'difficulte-moyen';
      case 'Difficile': return 'difficulte-difficile';
      default: return '';
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'Disponible': return 'statut-disponible';
      case 'En cours': return 'statut-en-cours';
      case 'Terminée': return 'statut-terminee';
      default: return '';
    }
  };

  return (
    <div className="investigations-container">
      <h1>Sélection des Enquêtes</h1>
      <p>Choisissez une enquête à résoudre en utilisant vos compétences SQL.</p>

      <div className="investigations-grid">
        {investigations.map((investigation) => {
          let backgroundClass = '';
          if (investigation.id === 1) backgroundClass = 'investigation-museum';
          else if (investigation.id === 2) backgroundClass = 'investigation-corporate';
          else if (investigation.id === 3) backgroundClass = 'investigation-manor';
          
          return (
            <div key={investigation.id} className={`investigation-card ${backgroundClass}`}>
            <div className="investigation-header">
              <h2>{investigation.titre}</h2>
              <div className="investigation-badges">
                <span className={`badge difficulte ${getDifficulteColor(investigation.difficulte)}`}>
                  {investigation.difficulte}
                </span>
                <span className={`badge statut ${getStatutColor(investigation.statut)}`}>
                  {investigation.statut}
                </span>
              </div>
            </div>
            <p className="investigation-description">{investigation.description}</p>
            <button
              className="primary-button"
              onClick={() => handleStartInvestigation(investigation.id)}
              disabled={investigation.statut !== 'Disponible'}
            >
              {investigation.statut === 'Disponible' ? 'Commencer l\'enquête' :
               investigation.statut === 'En cours' ? 'Continuer' : 'Revoir'}
            </button>
          </div>
          );
        })}
      </div>

      <div className="investigations-actions">
        <button className="secondary-button" onClick={() => navigate('/')}>
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default Investigations;