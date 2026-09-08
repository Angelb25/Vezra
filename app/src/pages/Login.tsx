import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/challenges');
    } catch {
      setError('Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Se connecter</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="form-field">
          <label htmlFor="password">Mot de passe</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <p className="text-muted" style={{ marginTop: 16, textAlign: 'center' }}>
        Pas encore de compte ? <Link to="/register">S'inscrire</Link>
      </p>
    </div>
  );
}