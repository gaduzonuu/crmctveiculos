import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { MessageSquare } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function Login() {
  const { login, signed } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (signed) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.error || 'Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-logo">
          <MessageSquare size={26} fill="white" />
        </div>
        <h1 className="login-title">CRM CTVeiculos</h1>
        <p className="login-subtitle">Faça login para acessar o painel</p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label className="login-label">E-mail</label>
          <input
            className="login-input"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="seu@email.com"
          />
          <label className="login-label">Senha</label>
          <input
            className="login-input"
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
