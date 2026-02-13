import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { formatTime, formatDate, getRankClass } from '../utils/formatters';
import './LeaderboardModal.css';

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'global' | number>('global');
  const [investigations, setInvestigations] = useState<{id: number, title: string}[]>([]);
  
  const { 
    globalLeaderboard, 
    investigationLeaderboards, 
    loading, 
    loadInvestigationLeaderboard 
  } = useLeaderboard({ enabled: isOpen });

  const loadInvestigations = async () => {
    try {
      const response = await api.get('/investigations');
      interface InvestigationData { id: number; title: string; }
      setInvestigations(response.data.map((inv: InvestigationData) => ({ id: inv.id, title: inv.title })));
    } catch (error) {
      console.error('Erreur lors du chargement des enquêtes:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadInvestigations();
    }
  }, [isOpen]);

  const handleInvestigationTabClick = (investigationId: number) => {
    setActiveTab(investigationId);
    loadInvestigationLeaderboard(investigationId);
  };

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
          <div className="leaderboard-tabs-container">
            <button
              onClick={() => setActiveTab('global')}
              className={`leaderboard-tab ${activeTab === 'global' ? 'active' : ''}`}
            >
              Classement Global
            </button>
            {investigations.map(inv => (
              <button
                key={inv.id}
                onClick={() => handleInvestigationTabClick(inv.id)}
                className={`leaderboard-tab ${activeTab === inv.id ? 'active' : ''}`}
              >
                {inv.title}
              </button>
            ))}
          </div>
          {loading ? (
            <div className="leaderboard-loading">
              <div className="leaderboard-spinner"></div>
            </div>
          ) : (
            <div className="leaderboard-list-container">
              {activeTab === 'global' ? (
                <div className="leaderboard-entries">
                  {globalLeaderboard.length === 0 ? (
                    <p className="leaderboard-empty">Aucun résultat disponible</p>
                  ) : (
                    globalLeaderboard.map((entry, index) => (
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
                  {investigationLeaderboards[activeTab]?.length === 0 ? (
                    <p className="leaderboard-empty">Aucun résultat disponible pour cette enquête</p>
                  ) : (
                    investigationLeaderboards[activeTab]?.map((entry, index) => (
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

export default Leaderboard;