import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fieldErrors, setFieldErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const validateUsername = (username: string): string => {
    if (!username.trim()) return 'Le nom d\'utilisateur est obligatoire';
    if (username.length < 3 || username.length > 50) return 'Le nom d\'utilisateur doit contenir entre 3 et 50 caractères';
    if (!/^[a-zA-ZÀ-ÿ0-9\s-]+$/.test(username)) return 'Le nom d\'utilisateur contient des caractères invalides';
    return '';
  };

  const validatePassword = (password: string): string => {
    if (!password) return 'Le mot de passe est obligatoire';
    if (password.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])/.test(password)) {
      return 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (@#$%^&+=!)';
    }
    return '';
  };

  const validateEmail = (email: string): string => {
    if (!email.trim()) return 'L\'email est obligatoire';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'L\'email doit être valide';
    return '';
  };

  const handleUsernameBlur = () => {
    setFieldErrors(prev => ({ ...prev, username: validateUsername(username) }));
  };

  const handleEmailBlur = () => {
    setFieldErrors(prev => ({ ...prev, email: validateEmail(email) }));
  };

  const handlePasswordBlur = () => {
    setFieldErrors(prev => ({ ...prev, password: validatePassword(password) }));
  };

  const handleConfirmPasswordBlur = () => {
    if (confirmPassword && password !== confirmPassword) {
      setFieldErrors(prev => ({ ...prev, confirmPassword: 'Les mots de passe ne correspondent pas' }));
    } else {
      setFieldErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const usernameError = validateUsername(username);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmPasswordError = password !== confirmPassword ? 'Les mots de passe ne correspondent pas' : '';

    setFieldErrors({
      username: usernameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError
    });

    if (usernameError || emailError || passwordError || confirmPasswordError) {
      return;
    }

    try {
      await register(username, email, password);
      navigate('/login');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "L'inscription a échoué. Veuillez réessayer.");
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
      <h2>Inscrivez-vous !</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Nom d'utilisateur:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={handleUsernameBlur}
            required
          />
          {fieldErrors.username && <p className="field-error">{fieldErrors.username}</p>}
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={handleEmailBlur}
            required
          />
          {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}
        </div>
        <div>
          <label htmlFor="password">Mot de passe :</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={handlePasswordBlur}
            required
          />
          {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirmez le mot de passe :</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={handleConfirmPasswordBlur}
            required
          />
          {fieldErrors.confirmPassword && <p className="field-error">{fieldErrors.confirmPassword}</p>}
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">S'inscrire</button>
      </form>
      <p>
       Vous avez déjà un compte ? <a href="/login">Connexion</a>
      </p>
    </div>
    </div>
  );
};

export default Register;