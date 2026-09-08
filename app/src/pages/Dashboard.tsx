import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getChallenges } from '../api/challenges';
import type { Challenge } from '../api/challenges';
import BottomNav from '../components/BottomNav';

export default function Dashboard() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  // ⚠️ XP, niveau et streak sont en dur pour l'instant — il n'existe pas
  // encore d'endpoint /api/me qui renverrait ces infos utilisateur.
  // À remplacer dès que cet endpoint sera créé.
  const streak = 8;
  const xpTotal = 840;
  const niveau = Math.floor(xpTotal / 200) + 1;
  const xpDansNiveau = xpTotal % 200;

  useEffect(() => {
    getChallenges()
      .then(setChallenges)
      .finally(() => setLoading(false));
  }, []);

  const defisEnCours = challenges.filter((c) => c.statut === 'en_cours');
  const pourcentageMoyen =
    defisEnCours.length > 0
      ? Math.round(
          defisEnCours.reduce((sum) => sum + 50, 0) / defisEnCours.length // placeholder simple
        )
      : 0;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="text-muted" style={{ margin: 0 }}>Bonjour</p>
          <h1 style={{ margin: 0 }}>Léa</h1>
        </div>
        <div className="avatar">L</div>
      </div>

      <div className="card-dark" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 22 }}>🔥</span>
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
          <p style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Niv. {niveau}</p>
          <div className="progress-bar-track" style={{ marginTop: 6 }}>
            <div className="progress-bar-fill" style={{ width: `${(xpDansNiveau / 200) * 100}%` }} />
          </div>
        </div>
      </div>

      <h2>Défis en cours</h2>
      {loading ? (
        <p className="text-muted">Chargement...</p>
      ) : defisEnCours.length === 0 ? (
        <p className="text-muted">Aucun défi en cours pour l'instant.</p>
      ) : (
        defisEnCours.map((challenge) => (
          <Link key={challenge.id} to={`/challenges/${challenge.id}`} className="card" style={{ display: 'block' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>{challenge.titre}</span>
              <span className="text-muted">{challenge.objectifValeur} {challenge.unite}</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: '50%' }} />
            </div>
          </Link>
        ))
      )}

      <BottomNav />
    </div>
  );
}