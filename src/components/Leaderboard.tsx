import React, { useState, useEffect } from 'react';
import api from '../api/api';
import type { LeaderboardEntry, GlobalLeaderboardEntry } from '../types/leaderboard';
import './LeaderboardModal.css';

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'global' | number>('global');
  const [globalLeaderboard, setGlobalLeaderboard] = useState<GlobalLeaderboardEntry[]>([]);
  const [investigationLeaderboards, setInvestigationLeaderboards] = useState<{[key: number]: LeaderboardEntry[]}>({});
  const [investigations, setInvestigations] = useState<{id: number, title: string}[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadInvestigations();
      loadGlobalLeaderboard();
    }
  }, [isOpen]);

  const loadInvestigations = async () => {
    try {
      const response = await api.get('/investigations');
      setInvestigations(response.data.map((inv: any) => ({ id: inv.id, title: inv.title })));
    } catch (error) {
      console.error('Erreur lors du chargement des enquêtes:', error);
    }
  };

  const loadGlobalLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await api.get('/leaderboard/global?limit=20');
      setGlobalLeaderboard(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement du leaderboard global:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadInvestigationLeaderboard = async (investigationId: number) => {
    if (investigationLeaderboards[investigationId]) return;

    setLoading(true);
    try {
      const response = await api.get(`/leaderboard/investigation/${investigationId}?limit=20`);
      setInvestigationLeaderboards(prev => ({
        ...prev,
        [investigationId]: response.data
      }));
    } catch (error) {
      console.error('Erreur lors du chargement du leaderboard de l\'enquête:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
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
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'global'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Classement Global
            </button>
            {investigations.map(inv => (
              <button
                key={inv.id}
                onClick={() => {
                  setActiveTab(inv.id);
                  loadInvestigationLeaderboard(inv.id);
                }}
                className={`py-2 px-4 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === inv.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
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
                          <div className={`leaderboard-rank-badge rank-${index === 0 ? '1' : index === 1 ? '2' : index === 2 ? '3' : 'other'}`}>
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
                          <div className={`leaderboard-rank-badge rank-${index === 0 ? '1' : index === 1 ? '2' : index === 2 ? '3' : 'other'}`}>
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