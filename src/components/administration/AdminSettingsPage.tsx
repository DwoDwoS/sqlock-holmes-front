import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useConfirm } from '../../hooks/useConfirm';
import { useToast } from '../../hooks/useToast';
import './AdminSettingsPage.scss';

interface SystemSettings {
  siteName: string;
  maintenance: boolean;
  allowRegistration: boolean;
  maxHintsPerInvestigation: number;
  leaderboardUpdateInterval: number;
  emailNotifications: boolean;
  debugMode: boolean;
}

const AdminSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const toast = useToast();
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: 'SQLock Holmes',
    maintenance: false,
    allowRegistration: true,
    maxHintsPerInvestigation: 3,
    leaderboardUpdateInterval: 60,
    emailNotifications: true,
    debugMode: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
      return;
    }

    const loadSettings = async () => {
      setLoading(true);
      try {
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
        toast.warning('Impossible de charger les paramètres, les valeurs par défaut sont utilisées.');
        setLoading(false);
      }
    };

    loadSettings();
  }, [user, navigate, toast]);

  const handleSaveSettings = async () => {
    setSaving(true);
    setMessage('');
    try {
      // TODO: Appel API pour sauvegarder les paramètres
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('Paramètres sauvegardés avec succès');
      await new Promise(resolve => setTimeout(resolve, 3000));
      setMessage('');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setMessage('Erreur lors de la sauvegarde des paramètres');
    } finally {
      setSaving(false);
    }
  };

  const handleResetSettings = async () => {
    const confirmed = await confirm({
      title: 'Réinitialiser les paramètres ?',
      message: 'Tous les paramètres reviendront à leur valeur par défaut.',
      confirmLabel: 'Réinitialiser',
      danger: true,
    });
    if (!confirmed) return;

    setSettings({
      siteName: 'SQLock Holmes',
      maintenance: false,
      allowRegistration: true,
      maxHintsPerInvestigation: 3,
      leaderboardUpdateInterval: 60,
      emailNotifications: true,
      debugMode: false,
    });
    setMessage('Paramètres réinitialisés');
    await new Promise(resolve => setTimeout(resolve, 3000));
    setMessage('');
  };

  if (loading) {
    return <div className="admin-loading">Chargement...</div>;
  }

  return (
    <div className="admin-settings-page">
      <div className="admin-header">
        <h1>Paramètres du Système</h1>
        <button onClick={() => navigate('/admin')} className="back-button">
          ← Retour au tableau de bord
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes('Erreur') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="settings-grid">
        <div className="settings-section">
          <h2>Configuration Générale</h2>
          <div className="setting-item toggle">
            <div className="toggle-info">
              <label>Mode Maintenance</label>
              <span className="description">
                Désactive l'accès au site pour les utilisateurs non-admin
              </span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.maintenance}
                onChange={(e) => setSettings({ ...settings, maintenance: e.target.checked })}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item toggle">
            <div className="toggle-info">
              <label>Autoriser les inscriptions</label>
              <span className="description">
                Permet aux nouveaux utilisateurs de créer un compte
              </span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.allowRegistration}
                onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h2>Notifications</h2>
          <div className="setting-item toggle">
            <div className="toggle-info">
              <label>Notifications par email</label>
              <span className="description">
                Envoie des emails pour les événements importants
              </span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="settings-footer">
          <button onClick={handleResetSettings} className="reset-button">
            Réinitialiser
          </button>
          <button 
            onClick={handleSaveSettings} 
            className="save-button"
            disabled={saving}
          >
            {saving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;