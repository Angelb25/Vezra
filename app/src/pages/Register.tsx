import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  // Un state par champ du formulaire — simple et suffisant pour ce petit formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pseudo, setPseudo] = useState('');

  // Pour afficher un message d'erreur si l'inscription échoue
  const [error, setError] = useState<string | null>(null);

  // Pour désactiver le bouton pendant l'appel réseau (évite les doubles clics)
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate(); // permet de rediriger l'utilisateur après inscription

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // empêche le rechargement de page par défaut du formulaire
    setError(null);
    setLoading(true);

    try {
      await register(email, password, pseudo);
      navigate('/dashboard'); // redirige vers le dashboard une fois inscrit et connecté
    } catch (err: any) {
      // Le backend renvoie un message d'erreur précis (ex: "email déjà utilisé")
      // dans err.response.data.error si la requête échoue
      const message = err.response?.data?.error ?? 'Une erreur est survenue.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <h1>Créer un compte</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="pseudo">Pseudo</label>
          <input
            id="pseudo"
            type="text"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Création...' : 'Créer mon compte'}
        </button>
      </form>

      <p>
        Déjà un compte ? <Link to="/login">Se connecter</Link>
      </p>
    </div>
  );
}