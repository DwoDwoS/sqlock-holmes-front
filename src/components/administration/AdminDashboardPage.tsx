'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { adminService } from '../../services/adminService';
import type { UserStats } from '../../types/admin';
import './AdminDashboardPage.css';

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
    
  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getUsersStats();
      setStats(data);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
      setError('Impossible de charger les statistiques.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/login');
      return;
    }

    loadStats();
  }, [user, navigate]);

  const handleRefresh = () => {
    loadStats();
  };

  if (loading) {
    return <div className="admin-loading">Chargement des statistiques...</div>;
  }

  if (error) {
    return (
      <div className="admin-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Réessayer</button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Tableau de bord administrateur SQLock Holmes</h1>
        <div className="header-actions">
          {lastRefresh && (
            <span className="last-refresh">
              Dernière mise à jour : {lastRefresh.toLocaleTimeString()}
            </span>
          )}
          <button 
            onClick={handleRefresh} 
            className="refresh-button"
            disabled={loading}
          >
            {loading ? '🔄 Chargement...' : '🔄 Rafraîchir'}
          </button>
        </div>
      </div>
      
      <p>Bienvenue sur le tableau de bord administrateur. Ici, vous pouvez gérer les utilisateurs, les enquêtes et les paramètres du système.</p>
      
      {stats && (
        <div className="admin-stats">
          <h2>Statistiques des utilisateurs</h2>
          <div className="stats-grid">
            <div className="stat-card primary">
              <h3>Total utilisateurs</h3>
              <p className="stat-value">{stats.totalUsers}</p>
            </div>
            <div className="stat-card success">
              <h3>Utilisateurs actifs</h3>
              <p className="stat-value">{stats.activeUsers}</p>
            </div>
            <div className="stat-card warning">
              <h3>Utilisateurs inactifs</h3>
              <p className="stat-value">{stats.inactiveUsers}</p>
            </div>
            <div className="stat-card info">
              <h3>Administrateurs</h3>
              <p className="stat-value">{stats.admins}</p>
            </div>
            <div className="stat-card">
              <h3>Utilisateurs réguliers</h3>
              <p className="stat-value">{stats.regularUsers}</p>
            </div>
            <div className="stat-card accent">
              <h3>Actifs récemment</h3>
              <p className="stat-value">{stats.recentlyActiveUsers}</p>
              <p className="stat-subtitle">7 derniers jours</p>
            </div>
          </div>

          <h2>Statistiques de performance</h2>
          <div className="stats-grid">
            <div className="stat-card highlight">
              <h3>Total soumissions</h3>
              <p className="stat-value">{stats.totalSubmissions}</p>
            </div>
            <div className="stat-card highlight">
              <h3>Enquêtes résolues</h3>
              <p className="stat-value">{stats.totalSolvedInvestigations}</p>
            </div>
            <div className="stat-card highlight">
              <h3>Score moyen</h3>
              <p className="stat-value">{stats.averageScore?.toFixed(1) ?? '0.0'}%</p>
            </div>
            <div className="stat-card highlight">
              <h3>Utilisateurs avec activité</h3>
              <p className="stat-value">{stats.usersWithActivity ?? 0}</p>
              <p className="stat-subtitle">
                {stats.totalUsers > 0 && stats.usersWithActivity != null
                  ? `${((stats.usersWithActivity / stats.totalUsers) * 100).toFixed(1)}% du total`
                  : 'N/A'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="admin-actions">
        <button onClick={() => navigate('/admin/users')}>Gérer les utilisateurs</button>
        <button onClick={() => navigate('/admin/investigations')}>Gérer les enquêtes</button>
        <button onClick={() => navigate('/admin/settings')}>Paramètres du système</button>
      </div>
    </div>
  );
};

export default AdminDashboardPage;