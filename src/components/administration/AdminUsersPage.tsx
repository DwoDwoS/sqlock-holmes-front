import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { adminService } from '../../services/adminService';
import type { AdminUserDTO } from '../../types/admin';
import './AdminUsersPage.css';

const AdminUsersPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'ALL' | 'USER' | 'ADMIN'>('ALL');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
      return;
    }

    const loadUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await adminService.getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        setError('Impossible de charger les utilisateurs.');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [user, navigate]);

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }
    try {
      await adminService.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      alert('Utilisateur supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de l\'utilisateur');
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'USER' | 'ADMIN') => {
    try {
      const updatedUser = await adminService.updateUserRole(userId, newRole);
      setUsers(users.map(u => u.id === userId ? updatedUser : u));
      alert('Rôle modifié avec succès');
    } catch (error) {
      console.error('Erreur lors de la modification du rôle:', error);
      alert('Erreur lors de la modification du rôle');
    }
  };

  const handleToggleActive = async (userId: string) => {
    try {
      const updatedUser = await adminService.toggleUserActive(userId);
      setUsers(users.map(u => u.id === userId ? updatedUser : u));
    } catch (error) {
      console.error('Erreur lors de la modification du statut:', error);
      alert('Erreur lors de la modification du statut de l\'utilisateur');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'ALL' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return <div className="admin-loading">Chargement...</div>;
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
    <div className="admin-users-page">
      <div className="admin-header">
        <h1>Gestion des Utilisateurs</h1>
        <button onClick={() => navigate('/admin')} className="back-button">
          ← Retour au tableau de bord
        </button>
      </div>

      <div className="users-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          <button 
            className={filterRole === 'ALL' ? 'active' : ''}
            onClick={() => setFilterRole('ALL')}
          >
            Tous ({users.length})
          </button>
          <button 
            className={filterRole === 'USER' ? 'active' : ''}
            onClick={() => setFilterRole('USER')}
          >
            Utilisateurs ({users.filter(u => u.role === 'USER').length})
          </button>
          <button 
            className={filterRole === 'ADMIN' ? 'active' : ''}
            onClick={() => setFilterRole('ADMIN')}
          >
            Admins ({users.filter(u => u.role === 'ADMIN').length})
          </button>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom d'utilisateur</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Date d'inscription</th>
              <th>Statistiques</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>
                  <select 
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value as 'USER' | 'ADMIN')}
                    className={`role-select ${u.role.toLowerCase()}`}
                  >
                    <option value="USER">Utilisateur</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
                <td>
                  <button
                    onClick={() => handleToggleActive(u.id)}
                    className={`status-button ${u.isActive ? 'active' : 'inactive'}`}
                  >
                    {u.isActive ? 'Actif' : 'Inactif'}
                  </button>
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString('fr-FR')}</td>
                <td>
                  <div className="user-stats">
                    <span title="Soumissions">{u.totalSubmissions || 0} 📝</span>
                    <span title="Résolu">{u.solvedInvestigations || 0} ✓</span>
                    <span title="Score moyen">{u.averageScore?.toFixed(1) || 'N/A'} ⭐</span>
                  </div>
                </td>
                <td>
                  <button 
                    onClick={() => handleDeleteUser(u.id)}
                    className="delete-button"
                    disabled={u.id === user?.id}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="no-results">
          Aucun utilisateur trouvé
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;