import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useConfirm } from '../../hooks/useConfirm';
import './AdminInvestigationsPage.scss';

interface Investigation {
  id: number;
  title: string;
  description: string;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  databaseId: string;
  isActive: boolean;
  createdAt?: string;
  completions?: number;
}

const AdminInvestigationsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'Facile' as 'Facile' | 'Moyen' | 'Difficile',
    databaseId: '',
  });

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
      return;
    }

    const loadInvestigations = async () => {
      setLoading(true);
      try {
        setInvestigations([
          {
            id: 1,
            title: 'Le vol du musée',
            description: 'Un tableau de valeur inestimable a disparu du musée national.',
            difficulty: 'Facile',
            databaseId: 'museum_db',
            isActive: true,
            createdAt: '2024-01-10',
            completions: 45
          },
          {
            id: 2,
            title: 'Fraudes corporatives',
            description: 'Des transactions suspectes dans les comptes de TechCorp.',
            difficulty: 'Moyen',
            databaseId: 'corporate_db',
            isActive: true,
            createdAt: '2024-01-15',
            completions: 28
          },
          {
            id: 3,
            title: 'Meurtre au Manoir',
            description: 'Lord Blackwood retrouvé mort dans sa bibliothèque.',
            difficulty: 'Difficile',
            databaseId: 'manor_db',
            isActive: true,
            createdAt: '2024-02-01',
            completions: 12
          },
          {
            id: 4,
            title: 'Le Poison du Chef',
            description: 'Un critique gastronomique empoisonné au restaurant "Le Cygne Doré".',
            difficulty: 'Facile',
            databaseId: 'poison_db',
            isActive: true,
            createdAt: '2024-03-01',
            completions: 0
          },
          {
            id: 5,
            title: 'Fuite de Données',
            description: 'Des dossiers patients vendus sur le dark web. La fuite vient de l\'intérieur.',
            difficulty: 'Moyen',
            databaseId: 'dataleak_db',
            isActive: true,
            createdAt: '2024-03-01',
            completions: 0
          },
          {
            id: 6,
            title: 'Le Mystère du Train de Nuit',
            description: 'Un collectionneur disparu du train de nuit Paris-Nice.',
            difficulty: 'Difficile',
            databaseId: 'train_db',
            isActive: true,
            createdAt: '2024-03-01',
            completions: 0
          },
        ]);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des enquêtes:', error);
        setLoading(false);
      }
    };

    loadInvestigations();
  }, [user, navigate]);

  const handleToggleActive = async (investigationId: number) => {
    try {
      // TODO: Appel API pour activer/désactiver
      setInvestigations(investigations.map(inv => 
        inv.id === investigationId ? { ...inv, isActive: !inv.isActive } : inv
      ));
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
    }
  };

  const handleDeleteInvestigation = async (investigationId: number) => {
    const confirmed = await confirm({
      title: 'Supprimer cette enquête ?',
      message: 'Cette action est irréversible.',
      confirmLabel: 'Supprimer',
      danger: true,
    });
    if (!confirmed) return;

    try {
      // TODO: Appel API pour supprimer
      setInvestigations(investigations.filter(inv => inv.id !== investigationId));
      toast.success('Enquête supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression de l\'enquête');
    }
  };

  const handleCreateInvestigation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Appel API pour créer
      const newInvestigation: Investigation = {
        id: Math.max(...investigations.map(i => i.id)) + 1,
        ...formData,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
        completions: 0
      };
      setInvestigations([...investigations, newInvestigation]);
      setShowCreateForm(false);
      setFormData({ title: '', description: '', difficulty: 'Facile', databaseId: '' });
      toast.success('Enquête créée avec succès');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      toast.error('Erreur lors de la création de l\'enquête');
    }
  };

  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case 'Facile': return 'easy';
      case 'Moyen': return 'medium';
      case 'Difficile': return 'hard';
      default: return '';
    }
  };

  if (loading) {
    return <div className="admin-loading">Chargement...</div>;
  }

  return (
    <div className="admin-investigations-page">
      <div className="admin-header">
        <h1>Gestion des Enquêtes</h1>
        <button onClick={() => navigate('/admin')} className="back-button">
          ← Retour au tableau de bord
        </button>
      </div>

      <div className="investigations-actions">
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="create-button"
        >
          {showCreateForm ? 'Annuler' : '+ Créer une enquête'}
        </button>
      </div>

      {showCreateForm && (
        <div className="create-form-container">
          <h2>Nouvelle Enquête</h2>
          <form onSubmit={handleCreateInvestigation} className="investigation-form">
            <div className="form-group">
              <label>Titre:</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Difficulté:</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'Facile' | 'Moyen' | 'Difficile' })}
                >
                  <option value="Facile">Facile</option>
                  <option value="Moyen">Moyen</option>
                  <option value="Difficile">Difficile</option>
                </select>
              </div>
              <div className="form-group">
                <label>ID Base de données:</label>
                <input
                  type="text"
                  value={formData.databaseId}
                  onChange={(e) => setFormData({ ...formData, databaseId: e.target.value })}
                  required
                />
              </div>
            </div>
            <button type="submit" className="submit-button">Créer l'enquête</button>
          </form>
        </div>
      )}

      <div className="investigations-grid">
        {investigations.map(investigation => (
          <div key={investigation.id} className={`investigation-card ${!investigation.isActive ? 'inactive' : ''}`}>
            <div className="card-header">
              <h3>{investigation.title}</h3>
              <span className={`difficulty-badge ${getDifficultyClass(investigation.difficulty)}`}>
                {investigation.difficulty}
              </span>
            </div>
            <p className="card-description">{investigation.description}</p>
            <div className="card-info">
              <div className="info-item">
                <span className="label">Base de données:</span>
                <span className="value">{investigation.databaseId}</span>
              </div>
              <div className="info-item">
                <span className="label">Complétions:</span>
                <span className="value">{investigation.completions || 0}</span>
              </div>
              <div className="info-item">
                <span className="label">Créée le:</span>
                <span className="value">{investigation.createdAt || 'N/A'}</span>
              </div>
            </div>
            <div className="card-actions">
              <button 
                onClick={() => handleToggleActive(investigation.id)}
                className={`toggle-button ${investigation.isActive ? 'active' : 'inactive'}`}
              >
                {investigation.isActive ? 'Désactiver' : 'Activer'}
              </button>
              <button 
                onClick={() => navigate(`/investigation/${investigation.id}`)}
                className="view-button"
              >
                Voir
              </button>
              <button 
                onClick={() => handleDeleteInvestigation(investigation.id)}
                className="delete-button"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {investigations.length === 0 && (
        <div className="no-results">
          Aucune enquête disponible
        </div>
      )}
    </div>
  );
};

export default AdminInvestigationsPage;