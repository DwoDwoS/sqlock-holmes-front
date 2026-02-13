import React, { useState } from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import type { LeaderboardEntry, GlobalLeaderboardEntry, LeaderboardType } from '../types/leaderboard';
import './Leaderboard.css';

interface LeaderboardProps {
  investigationId?: number;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ investigationId }) => {
  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>('global');
  const { data, loading, error, refetch } = useLeaderboard({
    type: leaderboardType,
    investigationId: leaderboardType !== 'global' ? investigationId : undefined,
  });

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const renderGlobalLeaderboard = () => {
    const globalData = data as GlobalLeaderboardEntry[];
    return (
      <div className="leaderboard-table">
        <h3>Classement Global</h3>
        <table>
          <thead>
            <tr>
              <th>Rang</th>
              <th>Utilisateur</th>
              <th>Enquêtes Complétées</th>
              <th>Score Total</th>
              <th>Score Moyen</th>
              <th>Temps Total</th>
              <th>Requêtes Totales</th>
              <th>Indices Utilisés</th>
            </tr>
          </thead>
          <tbody>
            {globalData.map((entry) => (
              <tr key={entry.rank}>
                <td>{entry.rank}</td>
                <td>{entry.username}</td>
                <td>{entry.totalInvestigationsCompleted}</td>
                <td>{entry.totalScore}</td>
                <td>{entry.averageScore}</td>
                <td>{formatTime(entry.totalTimeSpentSeconds)}</td>
                <td>{entry.totalQueriesCount}</td>
                <td>{entry.totalHintsUsed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderInvestigationLeaderboard = () => {
    const invData = data as LeaderboardEntry[];
    return (
      <div className="leaderboard-table">
        <h3>Classement de l'Enquête {investigationId}</h3>
        <table>
          <thead>
            <tr>
              <th>Rang</th>
              <th>Utilisateur</th>
              <th>Score</th>
              <th>Temps</th>
              <th>Requêtes</th>
              <th>Indices</th>
              <th>Date de Complétion</th>
            </tr>
          </thead>
          <tbody>
            {invData.map((entry) => (
              <tr key={entry.rank}>
                <td>{entry.rank}</td>
                <td>{entry.username}</td>
                <td>{entry.score}</td>
                <td>{formatTime(entry.timeSpentSeconds)}</td>
                <td>{entry.queriesCount}</td>
                <td>{entry.hintsUsed}</td>
                <td>{formatDate(entry.completedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderPersonalLeaderboard = () => {
    const personalData = data as LeaderboardEntry[];
    return (
      <div className="leaderboard-table">
        <h3>Vos Meilleurs Scores - Enquête {investigationId}</h3>
        <table>
          <thead>
            <tr>
              <th>Rang</th>
              <th>Score</th>
              <th>Temps</th>
              <th>Requêtes</th>
              <th>Indices</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {personalData.map((entry) => (
              <tr key={entry.rank}>
                <td>{entry.rank}</td>
                <td>{entry.score}</td>
                <td>{formatTime(entry.timeSpentSeconds)}</td>
                <td>{entry.queriesCount}</td>
                <td>{entry.hintsUsed}</td>
                <td>{formatDate(entry.completedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="leaderboard-container">
      <h2>Classements</h2>

      <div className="leaderboard-controls">
        <select
          value={leaderboardType}
          onChange={(e) => setLeaderboardType(e.target.value as LeaderboardType)}
        >
          <option value="global">Classement Global</option>
          {investigationId && <option value="investigation">Classement de l'Enquête</option>}
          {investigationId && <option value="personal">Mes Scores Personnels</option>}
        </select>
        <button onClick={refetch} disabled={loading}>
          {loading ? 'Chargement...' : 'Actualiser'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Chargement du classement...</div>
      ) : (
        <>
          {leaderboardType === 'global' && renderGlobalLeaderboard()}
          {leaderboardType === 'investigation' && renderInvestigationLeaderboard()}
          {leaderboardType === 'personal' && renderPersonalLeaderboard()}
        </>
      )}
    </div>
  );
};

export default Leaderboard;