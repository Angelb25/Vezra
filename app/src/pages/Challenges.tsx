import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getChallenges } from '../api/challenges';
import type { Challenge } from '../api/challenges';
import { useAuth } from '../context/AuthContext';

export default function Challenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();

  // Au chargement de la page, on récupère les défis depuis l'API
  useEffect(() => {
    getChallenges()
      .then(setChallenges)
      .catch(() => setError('Impossible de charger tes défis.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>Mes défis</h1>
        <button onClick={logout}>Se déconnecter</button>
      </div>

      <Link to="/challenges/new">+ Créer un défi</Link>

      {challenges.length === 0 ? (
        <p>Tu n'as pas encore de défi. Crée le premier !</p>
      ) : (
        <ul>
          {challenges.map((challenge) => (
            <li key={challenge.id}>
              <Link to={`/challenges/${challenge.id}`}>
                {challenge.titre} — {challenge.objectifValeur} {challenge.unite} — {challenge.statut}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}