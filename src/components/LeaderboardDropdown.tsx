import React, { useState, useEffect } from 'react';
import { LeaderboardService } from '../services/leaderboardService';
import type { LeaderboardEntry, GlobalLeaderboardEntry } from '../types/leaderboard';
import './LeaderboardDropdown.css';

interface LeaderboardDropdownProps {
  investigationId?: number;
}

export const LeaderboardDropdown: React.FC<LeaderboardDropdownProps> = ({ investigationId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [investigationLeaderboard, setInvestigationLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [globalLeaderboard, setGlobalLeaderboard] = useState<GlobalLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'investigation' | 'global'>('global');

  useEffect(() => {
    if (isOpen) {
      loadLeaderboards();
    }
  }, [isOpen, investigationId]);

  const loadLeaderboards = async () => {
    setLoading(true);
    try {
      if (investigationId) {
        const invData = await LeaderboardService.getInvestigationLeaderboard(investigationId);
        setInvestigationLeaderboard(invData);
      }
      const globalData = await LeaderboardService.getGlobalLeaderboard();
      setGlobalLeaderboard(globalData);
    } catch (error) {
      console.error('Erreur lors du chargement du leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderInvestigationLeaderboard = () => (
    <div className="leaderboard-table">
      <h4>Classement de l'enquête</h4>
      <table>
        <thead>
          <tr>
            <th>Rang</th>
            <th>Utilisateur</th>
            <th>Score</th>
            <th>Temps</th>
            <th>Requêtes</th>
            <th>Indices</th>
          </tr>
        </thead>
        <tbody>
          {investigationLeaderboard.map((entry) => (
            <tr key={entry.username}>
              <td>{entry.rank}</td>
              <td>{entry.username}</td>
              <td>{entry.score}</td>
              <td>{formatTime(entry.timeSpentSeconds)}</td>
              <td>{entry.queriesCount}</td>
              <td>{entry.hintsUsed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderGlobalLeaderboard = () => (
    <div className="leaderboard-table">
      <h4>Classement global</h4>
      <table>
        <thead>
          <tr>
            <th>Rang</th>
            <th>Utilisateur</th>
            <th>Enquêtes</th>
            <th>Score total</th>
            <th>Score moyen</th>
            <th>Temps total</th>
          </tr>
        </thead>
        <tbody>
          {globalLeaderboard.map((entry) => (
            <tr key={entry.username}>
              <td>{entry.rank}</td>
              <td>{entry.username}</td>
              <td>{entry.totalInvestigationsCompleted}</td>
              <td>{entry.totalScore}</td>
              <td>{entry.averageScore}</td>
              <td>{formatTime(entry.totalTimeSpentSeconds)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="leaderboard-dropdown">
      <button
        className="leaderboard-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        🏆  Classement {isOpen ? '▼' : '▶'}
      </button>

      {isOpen && (
        <div className="leaderboard-content">
          {loading ? (
            <div className="loading">Chargement...</div>
          ) : (
            <>
              <div className="leaderboard-tabs">
                <button
                  className={activeTab === 'global' ? 'active' : ''}
                  onClick={() => setActiveTab('global')}
                >
                  Global
                </button>
                {investigationId && (
                  <button
                    className={activeTab === 'investigation' ? 'active' : ''}
                    onClick={() => setActiveTab('investigation')}
                  >
                    Cette enquête
                  </button>
                )}
              </div>

              {activeTab === 'investigation' && investigationId
                ? renderInvestigationLeaderboard()
                : renderGlobalLeaderboard()
              }
            </>
          )}
        </div>
      )}
    </div>
  );
};