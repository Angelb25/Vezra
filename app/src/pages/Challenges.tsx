import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getChallenges } from '../api/challenges';
import type { Challenge } from '../api/challenges';
import BottomNav from '../components/BottomNav';

export default function Challenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getChallenges()
      .then(setChallenges)
      .catch(() => setError('Impossible de charger tes défis.'))
      .finally(() => setLoading(false));
  }, []);

  const statutLabel: Record<string, string> = {
    en_cours: 'En cours',
    termine: 'Terminé',
    abandonne: 'Abandonné',
    en_pause: 'En pause',
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 style={{ margin: 0 }}>Mes défis</h1>
        <Link to="/challenges/new" className="btn-icon" style={{ fontSize: 22 }}>+</Link>
      </div>

      {loading && <p className="text-muted">Chargement...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && challenges.length === 0 && (
        <div className="card" style={{ textAlign: 'center' }}>
          <p className="text-muted" style={{ marginBottom: 12 }}>Tu n'as pas encore de défi.</p>
          <Link to="/challenges/new" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
            Créer mon premier défi
          </Link>
        </div>
      )}

      {challenges.map((challenge) => (
        <Link key={challenge.id} to={`/challenges/${challenge.id}`} className="card" style={{ display: 'block' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 500 }}>{challenge.titre}</p>
              <p className="text-muted" style={{ margin: '4px 0 0' }}>
                {challenge.objectifValeur} {challenge.unite}
              </p>
            </div>
            <span
              className="text-muted"
              style={{
                fontSize: 12,
                padding: '4px 10px',
                borderRadius: 20,
                background: challenge.statut === 'termine' ? '#E7F5EC' : '#F0EEE9',
                color: challenge.statut === 'termine' ? 'var(--color-success)' : 'var(--color-text-muted)',
              }}
            >
              {statutLabel[challenge.statut]}
            </span>
          </div>
        </Link>
      ))}

      <BottomNav />
    </div>
  );
}