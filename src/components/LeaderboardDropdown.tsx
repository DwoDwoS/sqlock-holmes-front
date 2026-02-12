import React, { useState } from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { formatTime } from '../utils/formatters';
import './LeaderboardDropdown.css';

interface LeaderboardDropdownProps {
  investigationId?: number;
}

export const LeaderboardDropdown: React.FC<LeaderboardDropdownProps> = ({ investigationId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'investigation' | 'global'>('global');

  const { 
    globalLeaderboard, 
    investigationLeaderboards, 
    loading 
  } = useLeaderboard({ 
    enabled: isOpen, 
    investigationId 
  });

  const investigationLeaderboard = investigationId ? investigationLeaderboards[investigationId] || [] : [];

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