import './Investigations.scss';
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { restartInvestigation } from '../services/investigationService';
import { useInvestigations } from '../hooks/useInvestigations';
import { useToast } from '../hooks/useToast';
import { getErrorMessage } from '../utils/errorMessage';
import { InvestigationCard, InvestigationFilters, ScoringInfoButton } from './investigation';
import type { DifficultyFilter, StatusFilter } from '../types/investigation';

const Investigations: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { investigations, loading, loadError } = useInvestigations();

  const [filterDifficulty, setFilterDifficulty] = useState<DifficultyFilter>('ALL');
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('ALL');

  const filteredInvestigations = useMemo(() => {
    return investigations.filter((investigation) => {
      const matchesDifficulty =
        filterDifficulty === 'ALL' || investigation.difficulty === filterDifficulty;
      const matchesStatus =
        filterStatus === 'ALL' ||
        (filterStatus === 'SOLVED' && investigation.status === 'Terminée') ||
        (filterStatus === 'UNSOLVED' && investigation.status !== 'Terminée');
      return matchesDifficulty && matchesStatus;
    });
  }, [investigations, filterDifficulty, filterStatus]);

  const handleRestart = async (investigationId: number) => {
    if (loading) return;

    try {
      await restartInvestigation(investigationId);
      navigate(`/investigation/${investigationId}`);
    } catch (error) {
      console.error('Erreur lors du redémarrage de l\'enquête:', error);
      const message = getErrorMessage(error, 'Erreur lors du redémarrage de l\'enquête.');
      toast.error(`${message}\n\nSi le problème persiste, vérifiez que le backend autorise cette fonctionnalité.`, 6000);
    }
  };

  const hasInvestigations = investigations.length > 0;
  const showEmptyFromFilter =
    !loading && !loadError && hasInvestigations && filteredInvestigations.length === 0;
  const showEmptyFromLoad = !loading && !loadError && !hasInvestigations;

  return (
    <div className="investigations-container">
      <div className="investigations-header">
        <div className="investigations-title-row">
          <h1>Sélection des Enquêtes</h1>
          <ScoringInfoButton />
        </div>
        <p>Choisissez une enquête à résoudre en utilisant vos compétences SQL. Survolez les enquêtes pour en connaître l'intrigue.</p>
      </div>

      {loading && <p>Chargement des données depuis le serveur...</p>}

      {!loading && loadError && (
        <div className="investigations-empty">{loadError}</div>
      )}

      {showEmptyFromLoad && (
        <div className="investigations-empty">
          Aucune enquête disponible pour le moment.
        </div>
      )}

      {hasInvestigations && (
        <InvestigationFilters
          investigations={investigations}
          difficulty={filterDifficulty}
          status={filterStatus}
          onDifficultyChange={setFilterDifficulty}
          onStatusChange={setFilterStatus}
        />
      )}

      {showEmptyFromFilter ? (
        <div className="investigations-empty">
          Aucune enquête ne correspond aux filtres sélectionnés.
        </div>
      ) : (
        hasInvestigations && (
          <div className="investigations-grid">
            {filteredInvestigations.map((investigation) => (
              <InvestigationCard
                key={investigation.id}
                investigation={investigation}
                onRestart={handleRestart}
              />
            ))}
          </div>
        )
      )}

      <div className="investigations-actions">
        <button className="primary-button" onClick={() => navigate('/')}>
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default Investigations;