import React from 'react';
import type {
  DifficultyFilter,
  Investigation,
  InvestigationDifficulty,
  StatusFilter,
} from '../../types/investigation';

interface InvestigationFiltersProps {
  investigations: Investigation[];
  difficulty: DifficultyFilter;
  status: StatusFilter;
  onDifficultyChange: (value: DifficultyFilter) => void;
  onStatusChange: (value: StatusFilter) => void;
}

const InvestigationFilters: React.FC<InvestigationFiltersProps> = ({
  investigations,
  difficulty,
  status,
  onDifficultyChange,
  onStatusChange,
}) => {
  const countByDifficulty = (d: InvestigationDifficulty) =>
    investigations.filter((i) => i.difficulty === d).length;
  const solvedCount = investigations.filter((i) => i.status === 'Terminée').length;
  const unsolvedCount = investigations.length - solvedCount;

  return (
    <div className="investigations-filters">
      <div className="filter-group">
        <label>Difficulté :</label>
        <div className="filter-buttons">
          <button
            className={difficulty === 'ALL' ? 'active' : ''}
            onClick={() => onDifficultyChange('ALL')}
          >
            Toutes ({investigations.length})
          </button>
          <button
            className={difficulty === 'Facile' ? 'active' : ''}
            onClick={() => onDifficultyChange('Facile')}
          >
            Facile ({countByDifficulty('Facile')})
          </button>
          <button
            className={difficulty === 'Moyen' ? 'active' : ''}
            onClick={() => onDifficultyChange('Moyen')}
          >
            Moyen ({countByDifficulty('Moyen')})
          </button>
          <button
            className={difficulty === 'Difficile' ? 'active' : ''}
            onClick={() => onDifficultyChange('Difficile')}
          >
            Difficile ({countByDifficulty('Difficile')})
          </button>
        </div>
      </div>
      <div className="filter-group">
        <label>Statut :</label>
        <div className="filter-buttons">
          <button
            className={status === 'ALL' ? 'active' : ''}
            onClick={() => onStatusChange('ALL')}
          >
            Toutes ({investigations.length})
          </button>
          <button
            className={status === 'UNSOLVED' ? 'active' : ''}
            onClick={() => onStatusChange('UNSOLVED')}
          >
            Non résolues ({unsolvedCount})
          </button>
          <button
            className={status === 'SOLVED' ? 'active' : ''}
            onClick={() => onStatusChange('SOLVED')}
          >
            Résolues ({solvedCount})
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestigationFilters;