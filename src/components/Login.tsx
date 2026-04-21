import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import './Login.scss';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [resendMessage, setResendMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailNotVerified(false);
    setResendStatus('idle');
    setResendMessage('');
    try {
      await login(username, password);
      navigate('/home');
    } catch (err: unknown) {
      const axiosError = err as {
        response?: { status?: number; data?: { error?: string; message?: string } };
      };
      const status = axiosError.response?.status;
      const errorCode = axiosError.response?.data?.error;

      if (status === 403 && errorCode === 'EMAIL_NOT_VERIFIED') {
        setEmailNotVerified(true);
      } else {
        setError('La connexion a échouée. Veuillez réessayer.');
      }
    }
  };

  const handleResend = async () => {
    if (!username.trim()) {
      setResendStatus('error');
      setResendMessage("Veuillez saisir votre nom d'utilisateur avant de renvoyer l'email.");
      return;
    }
    setResendStatus('sending');
    setResendMessage('');
    try {
      await authService.resendVerification(username);
      setResendStatus('sent');
      setResendMessage('Email de vérification renvoyé. Consultez votre boîte de réception.');
    } catch {
      setResendStatus('error');
      setResendMessage("L'envoi a échoué. Veuillez réessayer dans quelques instants.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <img
          src="SQLock_Holmes_Logo.webp"
          alt="Logo SQLock Holmes"
          className="login-card-logo"
          fetchPriority="high"
          width="280"
          height="152"
        />
        <p className="login-card-tagline">
          Outil de résolution d'enquêtes en exécutant des requêtes SQL
        </p>
        <h1>Connexion</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Nom d'utilisateur :</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password">Mot de passe :</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {error && <p className="error">{error}</p>}
          {emailNotVerified && (
            <div className="email-not-verified">
              <p className="error">
                Vérifiez votre email pour activer votre compte avant de vous connecter.
              </p>
              <button
                type="button"
                className="resend-button"
                onClick={handleResend}
                disabled={resendStatus === 'sending' || resendStatus === 'sent'}
              >
                {resendStatus === 'sending'
                  ? 'Envoi en cours...'
                  : resendStatus === 'sent'
                    ? 'Email renvoyé'
                    : "Renvoyer l'email"}
              </button>
              {resendMessage && (
                <p className={resendStatus === 'sent' ? 'field-success' : 'field-error'}>
                  {resendMessage}
                </p>
              )}
            </div>
          )}
          <button type="submit">Connexion</button>
        </form>
        <p className="login-card-footer">
          Pas encore de compte ? <a href="/register">Inscrivez-vous</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
