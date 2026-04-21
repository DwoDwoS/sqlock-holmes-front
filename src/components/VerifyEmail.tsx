import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';
import './Login.scss';

type Status = 'loading' | 'success' | 'error';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<Status>(token ? 'loading' : 'error');
  const [message, setMessage] = useState(
    token ? '' : 'Lien de vérification invalide : jeton manquant.'
  );

  useEffect(() => {
    if (!token) return;

    authService
      .verifyEmail(token)
      .then(() => {
        setStatus('success');
      })
      .catch((err: unknown) => {
        const axiosError = err as { response?: { data?: { message?: string; error?: string } } };
        const serverMessage =
          axiosError.response?.data?.message || axiosError.response?.data?.error;
        setStatus('error');
        setMessage(
          serverMessage || 'La vérification a échoué. Le lien est peut-être expiré ou invalide.'
        );
      });
  }, [token]);

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
        {status === 'loading' && (
          <>
            <h1>Vérification en cours...</h1>
            <p className="login-card-tagline">Merci de patienter quelques instants.</p>
          </>
        )}
        {status === 'success' && (
          <>
            <h1>Email vérifié !</h1>
            <p className="login-card-tagline">
              Votre compte est maintenant activé. Vous pouvez vous connecter.
            </p>
            <p className="login-card-footer">
              <a href="/login">Se connecter</a>
            </p>
          </>
        )}
        {status === 'error' && (
          <>
            <h1>Vérification échouée</h1>
            <p className="error">{message}</p>
            <p className="login-card-footer">
              <a href="/login">Retour à la connexion</a>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;