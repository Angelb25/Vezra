import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(email, password, pseudo);
      navigate('/challenges');
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Créer un compte</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="pseudo">Pseudo</label>
          <input id="pseudo" type="text" value={pseudo} onChange={(e) => setPseudo(e.target.value)} required />
        </div>

        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="form-field">
          <label htmlFor="password">Mot de passe</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Création...' : 'Créer mon compte'}
        </button>
      </form>

      <p className="text-muted" style={{ marginTop: 16, textAlign: 'center' }}>
        Déjà un compte ? <Link to="/login">Se connecter</Link>
      </p>
    </div>
  );
}