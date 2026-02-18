import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/');
    } catch {
      setError('La connexion a échouée. Veuillez réessayer.');
    }
  };

  return (
    <div>
      <section className="hero-section">
        <div className="hero-content">
        <img src="sqlock-holmes-logo-removebg-preview.png" alt="Logo SQLock Holmes" className="navbar-logo" />
          <p className="hero-subtitle">Outil de résolution d'enquêtes en exécutant des requêtes SQL</p>
        </div>
      </section>
      <div className="auth-container">
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
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Connexion</button>
      </form>
      <p>
        Pas encore de compte ? <a href="/register">Inscrivez-vous</a>
      </p>
    </div>
    </div>
  );
};

export default Login;