import React from 'react';
import { Link } from 'react-router-dom';
import { getDifficultyClass } from '../../utils/formatters';
import type { Investigation } from '../../types/investigation';

const BACKGROUND_CLASS_BY_ID: Record<number, string> = {
  1: 'investigation-museum',
  2: 'investigation-corporate',
  3: 'investigation-manor',
  4: 'investigation-restaurant',
  5: 'investigation-dataleak',
  6: 'investigation-train',
  7: 'investigation-dog',
  8: 'investigation-crypto',
  9: 'investigation-school',
};

interface InvestigationCardProps {
  investigation: Investigation;
  onRestart: (id: number) => void;
}

const InvestigationCard: React.FC<InvestigationCardProps> = ({ investigation, onRestart }) => {
  const backgroundClass = BACKGROUND_CLASS_BY_ID[investigation.id] ?? '';
  const statusClass = investigation.status === 'Disponible' ? 'status-available' : 'status-unavailable';
  const completedClass = investigation.status === 'Terminée' ? 'status-completed' : '';
  const isStartable = investigation.status === 'Disponible' || investigation.status === 'En cours';

  return (
    <div className={`investigation-card ${backgroundClass} ${statusClass} ${completedClass}`}>
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
          onClick={() => onRestart(investigation.id)}
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
          className={`primary-button ${!isStartable ? 'disabled' : ''}`}
          onClick={(e) => {
            if (!isStartable) e.preventDefault();
          }}
        >
          {investigation.status === 'Disponible' ? 'Commencer l\'enquête' : 'Continuer'}
        </Link>
      )}
    </div>
  );
};

export default InvestigationCard;