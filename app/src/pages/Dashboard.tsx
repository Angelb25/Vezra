import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getChallenges } from '../api/challenges';
import type { Challenge } from '../api/challenges';
import { getMe } from '../api/user';
import type { Me } from '../api/user';

import BottomNav from '../components/BottomNav';
import { FlameIcon } from '../components/icons';

export default function Dashboard() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  // ⚠️ Le streak reste en dur — pas encore de logique backend pour le calculer.
  const streak = 0;

  useEffect(() => {
    Promise.all([getChallenges(), getMe()])
      .then(([challengesData, meData]) => {
        setChallenges(challengesData);
        setMe(meData);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !me) {
    return (
      <div className="page">
        <p className="text-muted">Chargement...</p>
      </div>
    );
  }

  const defisEnCours = challenges.filter((c) => c.statut === 'en_cours');
  const xpDansNiveau = me.xpTotal % 200;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="text-muted" style={{ margin: 0 }}>Bonjour</p>
          <h1 style={{ margin: 0 }}>{me.pseudo}</h1>
        </div>
        <div className="avatar">{me.pseudo.charAt(0).toUpperCase()}</div>
      </div>

      <div className="card-dark" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <FlameIcon size={22} />
        <div>
          <p style={{ margin: 0, fontWeight: 500 }}>Série de {streak} jours</p>
          <p className="muted" style={{ margin: 0, fontSize: 12 }}>Continue comme ça</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <div className="card" style={{ flex: 1, marginBottom: 0 }}>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>{defisEnCours.length}</p>
          <p className="text-muted" style={{ margin: 0 }}>défis en cours</p>
        </div>
        <div className="card" style={{ flex: 1, marginBottom: 0 }}>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Niv. {me.niveau}</p>
          <div className="progress-bar-track" style={{ marginTop: 6 }}>
            <div className="progress-bar-fill" style={{ width: `${(xpDansNiveau / 200) * 100}%` }} />
          </div>
        </div>
      </div>

      <h2>Défis en cours</h2>
      {defisEnCours.length === 0 ? (
        <p className="text-muted">Aucun défi en cours pour l'instant.</p>
      ) : (
        defisEnCours.map((challenge) => (
          <Link key={challenge.id} to={`/challenges/${challenge.id}`} className="card" style={{ display: 'block' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{challenge.titre}</span>
              <span className="text-muted">{challenge.objectifValeur} {challenge.unite}</span>
            </div>
          </Link>
        ))
      )}

      <BottomNav />
    </div>
  );
}