import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './AdminUsersPage.css';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt?: string;
}

const AdminUsersPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'ALL' | 'USER' | 'ADMIN'>('ALL');

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    loadUsers();
  }, [user, navigate]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setUsers([
          { id: '1', username: 'admin', email: 'admin@sqlock.com', role: 'ADMIN', createdAt: '2024-01-15' },
          { id: '2', username: 'detective1', email: 'det1@sqlock.com', role: 'USER', createdAt: '2024-02-20' },
          { id: '3', username: 'sherlock', email: 'sherlock@sqlock.com', role: 'USER', createdAt: '2024-03-10' },
          { id: '4', username: 'watson', email: 'watson@sqlock.com', role: 'USER', createdAt: '2024-03-12' },
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }
    try {
      setUsers(users.filter(u => u.id !== userId));
      alert('Utilisateur supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de l\'utilisateur');
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'USER' | 'ADMIN') => {
    try {
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      alert('Rôle modifié avec succès');
    } catch (error) {
      console.error('Erreur lors de la modification du rôle:', error);
      alert('Erreur lors de la modification du rôle');
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
              <th>Date d'inscription</th>
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
                <td>{u.createdAt || 'N/A'}</td>
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