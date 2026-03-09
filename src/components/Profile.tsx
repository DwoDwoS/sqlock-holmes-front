import './Profile.scss';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const updateData: { username?: string; email?: string; password?: string } = { ...formData };
      if (!updateData.password?.trim()) {
        delete updateData.password;
      }

      await updateUser(updateData);
      setIsEditing(false);
      setFormData(prev => ({ ...prev, password: '' }));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    setError('');

    try {
      await authService.deleteUser();
      logout();
      navigate('/login');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      setShowDeleteConfirm(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div>Utilisateur non connecté</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>Mon Profil</h1>

        {error && <div className="error-message">{error}</div>}

        {isEditing ? (
          <form onSubmit={handleUpdate} className="profile-form">
            <div className="form-group">
              <label htmlFor="username">Nom d'utilisateur:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Nouveau mot de passe (optionnel):</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Laissez vide pour ne pas changer"
              />
            </div>
            <div className="form-actions">
              <button type="submit" disabled={isLoading} className="primary-button">
                {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="secondary-button">
                Annuler
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-display">
            <div className="info-item">
              <label>Nom d'utilisateur:</label>
              <span>{user.username}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{user.email}</span>
            </div>
            <button onClick={() => setIsEditing(true)} className="primary-button">
              Modifier le profil
            </button>
          </div>
        )}

        <div className="danger-zone">
          <h3>Supprimer votre compte ?</h3>
          <p>Cette action est irréversible.</p>
          {!showDeleteConfirm ? (
            <button onClick={() => setShowDeleteConfirm(true)} className="danger-button">
              Supprimer mon compte
            </button>
          ) : (
            <div className="delete-confirm">
              <p>Êtes-vous sûr de vouloir supprimer votre compte ?</p>
              <div className="confirm-actions">
                <button onClick={handleDelete} disabled={isLoading} className="danger-button">
                  {isLoading ? 'Suppression...' : 'Oui, supprimer'}
                </button>
                <button onClick={() => setShowDeleteConfirm(false)} className="secondary-button">
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;