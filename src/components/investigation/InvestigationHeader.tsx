import React, { useState } from 'react';
import { Paperclip } from 'lucide-react';

interface Investigation {
  id: number;
  title: string;
  description: string;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  status: 'Disponible' | 'En cours' | 'Terminée';
  databaseId: string;
  image?: string;
}

interface InvestigationHeaderProps {
  investigation: Investigation;
}

type FolderPage = 'dossier' | 'intrigue';

const difficultyMap: Record<string, string> = {
  Facile: 'easy',
  Moyen: 'medium',
  Difficile: 'hard',
};

const InvestigationHeader: React.FC<InvestigationHeaderProps> = ({ investigation }) => {
  const [activePage, setActivePage] = useState<FolderPage>('dossier');

  return (
    <div className="fbi-folder">
      <div className="fbi-folder__tabs">
        <button
          className={`fbi-folder__tab${activePage === 'dossier' ? ' fbi-folder__tab--active' : ''}`}
          onClick={() => setActivePage('dossier')}
        >
          Dossier
        </button>
        <button
          className={`fbi-folder__tab${activePage === 'intrigue' ? ' fbi-folder__tab--active' : ''}`}
          onClick={() => setActivePage('intrigue')}
        >
          Intrigue
        </button>
      </div>

      <div className="fbi-folder__body">
        {activePage === 'dossier' && (
          <div className="fbi-folder__page fbi-folder__page--dossier">
            <div className="fbi-folder__stamp">CONFIDENTIEL</div>
            <p className="fbi-folder__case-number">
              Dossier #{String(investigation.id).padStart(4, '0')}
            </p>
            <h1 className="fbi-folder__title">{investigation.title}</h1>
            <div className="fbi-folder__meta">
              <span
                className={`fbi-folder__badge fbi-folder__badge--${difficultyMap[investigation.difficulty]}`}
              >
                {investigation.difficulty}
              </span>
              <span className="fbi-folder__badge fbi-folder__badge--status">
                {investigation.status}
              </span>
            </div>
          </div>
        )}

        {activePage === 'intrigue' && (
          <div className="fbi-folder__page fbi-folder__page--intrigue">
            {investigation.image && (
              <div className="fbi-folder__polaroid-wrapper">
                <div className="fbi-folder__paperclip">
                  <Paperclip size={34} />
                </div>
                <div className="fbi-folder__polaroid">
                  <img src={investigation.image} alt={investigation.title} />
                  <p className="fbi-folder__polaroid-caption">{investigation.title}</p>
                </div>
              </div>
            )}
            <div className="fbi-folder__intrigue-text">
              <p className="fbi-folder__section-label">Résumé de l'affaire</p>
              <p className="fbi-folder__plot">{investigation.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestigationHeader;