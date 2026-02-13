import React, { useState, useEffect, useRef } from 'react';
import api from '../api/api';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { formatTime, formatDate, getRankClass } from '../utils/formatters';
import './LeaderboardModal.css';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  const [viewMode, setViewMode] = useState<'global' | 'personal'>('global');
  const [selectedInvestigation, setSelectedInvestigation] = useState<number | null>(null);
  const [investigations, setInvestigations] = useState<{id: number, title: string}[]>([]);
  const hasInitializedRef = useRef(false);
  
  const { data, loading } = useLeaderboard({ 
    type: viewMode === 'global' ? 'global' : 'personal',
    investigationId: viewMode === 'personal' ? selectedInvestigation ?? undefined : undefined,
  });

  useEffect(() => {
    const loadInvestigations = async () => {
      try {
        const response = await api.get('/investigations');
        interface InvestigationData { id: number; title: string; }
        const invs = response.data.map((inv: InvestigationData) => ({ id: inv.id, title: inv.title }));
        setInvestigations(invs);
        
        if (invs.length > 0 && !hasInitializedRef.current) {
          setSelectedInvestigation(invs[0].id);
          hasInitializedRef.current = true;
        }
      } catch (error) {
        console.error('Erreur lors du chargement des enquêtes:', error);
      }
    };

    loadInvestigations();
  }, []);

  if (!isOpen) return null;

  return (
    <div className="leaderboard-modal-overlay">
      <div className="leaderboard-modal">
        <div className="leaderboard-modal-header">
          <h2 className="leaderboard-modal-title">🏆 Classement</h2>
          <button
            onClick={onClose}
            className="leaderboard-modal-close"
          >
            ×
          </button>
        </div>

        <div className="leaderboard-modal-content">
          <div className="leaderboard-controls">
            <div className="leaderboard-view-buttons">
              <button
                onClick={() => setViewMode('global')}
                className={`leaderboard-view-btn ${viewMode === 'global' ? 'active' : ''}`}
              >
                Classement Global
              </button>
              <button
                onClick={() => setViewMode('personal')}
                className={`leaderboard-view-btn ${viewMode === 'personal' ? 'active' : ''}`}
              >
                Mes Scores Personnels
              </button>
            </div>
            
            {viewMode === 'personal' && investigations.length > 0 && (
              <select 
                value={selectedInvestigation ?? ''} 
                onChange={(e) => setSelectedInvestigation(Number(e.target.value))}
                className="leaderboard-investigation-select"
              >
                {investigations.map(inv => (
                  <option key={inv.id} value={inv.id}>
                    {inv.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          {loading ? (
            <div className="leaderboard-loading">
              <div className="leaderboard-spinner"></div>
            </div>
          ) : (
            <div className="leaderboard-list-container">
              {viewMode === 'global' ? (
                <div className="leaderboard-entries">
                  {data.length === 0 ? (
                    <p className="leaderboard-empty">Aucun résultat disponible</p>
                  ) : (
                    (data as import('../types/leaderboard').GlobalLeaderboardEntry[]).map((entry, index) => (
                      <div
                        key={entry.username}
                        className={`leaderboard-entry ${index < 3 ? 'top-three' : ''}`}
                      >
                        <div className="leaderboard-entry-left">
                          <div className={`leaderboard-rank-badge ${getRankClass(index + 1)}`}>
                            {index + 1}
                          </div>
                          <div className="leaderboard-entry-info">
                            <p className="leaderboard-username">{entry.username}</p>
                            <p className="leaderboard-stats">
                              {entry.totalInvestigationsCompleted} enquête{entry.totalInvestigationsCompleted > 1 ? 's' : ''} résolue{entry.totalInvestigationsCompleted > 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="leaderboard-entry-right">
                          <p className="leaderboard-score global">{entry.totalScore} pts</p>
                          <p className="leaderboard-date">Moyenne: {entry.averageScore} pts</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="leaderboard-entries">
                  {data.length === 0 ? (
                    <p className="leaderboard-empty">Aucun résultat disponible pour cette enquête</p>
                  ) : (
                    (data as import('../types/leaderboard').LeaderboardEntry[]).map((entry, index) => (
                      <div
                        key={`${entry.username}-${index}`}
                        className={`leaderboard-entry ${index < 3 ? 'top-three' : ''}`}
                      >
                        <div className="leaderboard-entry-left">
                          <div className={`leaderboard-rank-badge ${getRankClass(index + 1)}`}>
                            {index + 1}
                          </div>
                          <div className="leaderboard-entry-info">
                            <p className="leaderboard-username">Tentative #{index + 1}</p>
                            <p className="leaderboard-stats">
                              Temps: {formatTime(entry.timeSpentSeconds)} | Requêtes: {entry.queriesCount} | Indices: {entry.hintsUsed}
                            </p>
                          </div>
                        </div>
                        <div className="leaderboard-entry-right">
                          <p className="leaderboard-score investigation">{entry.score} pts</p>
                          <p className="leaderboard-date">{formatDate(entry.completedAt)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardModal;