import { useEffect, useState, FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getChallenge, getProgressHistory, addProgress, updateChallenge, deleteChallenge } from '../api/challenges';
import type { Challenge, ProgressEntry } from '../api/challenges';

export default function ChallengeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [history, setHistory] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [valeur, setValeur] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [xpToast, setXpToast] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;
    try {
      const [challengeData, historyData] = await Promise.all([
        getChallenge(Number(id)),
        getProgressHistory(Number(id)),
      ]);
      setChallenge(challengeData);
      setHistory(historyData);
    } catch {
      setError('Impossible de charger ce défi.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProgress = async (e: FormEvent) => {
    e.preventDefault();
    if (!id || !valeur) return;
    setSubmitting(true);
    try {
      const res = await addProgress(Number(id), parseFloat(valeur));
      setValeur('');
      setXpToast(`+${res.xpGagne} XP`);
      setTimeout(() => setXpToast(null), 2000);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.error ?? "Erreur lors de l'ajout.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm('Supprimer ce défi et tout son historique ?')) return;
    await deleteChallenge(Number(id));
    navigate('/challenges');
  };

  if (loading) return <div className="page"><p className="text-muted">Chargement...</p></div>;
  if (error) return <div className="page"><p className="error-message">{error}</p></div>;
  if (!challenge) return <div className="page"><p className="text-muted">Défi introuvable.</p></div>;

  const objectif = parseFloat(challenge.objectifValeur);
  const progressionActuelle = history.reduce((sum, entry) => {
    if (challenge.type === 'distance' || challenge.type === 'repetition') {
      return sum + parseFloat(entry.valeur);
    }
    return sum + 1;
  }, 0);
  const pourcentage = Math.min(100, Math.round((progressionActuelle / objectif) * 100));

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/challenges" className="btn-icon">←</Link>
        <h1 style={{ margin: 0, fontSize: 18 }}>{challenge.titre}</h1>
        <div style={{ width: 24 }} />
      </div>

      {xpToast && (
        <div className="card-dark" style={{ textAlign: 'center', fontWeight: 600 }}>
          ⚡ {xpToast}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <div
          style={{
            position: 'relative',
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: `conic-gradient(var(--color-primary) 0% ${pourcentage}%, var(--color-border) ${pourcentage}% 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 112,
              height: 112,
              borderRadius: '50%',
              background: 'var(--color-bg)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <p style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>{pourcentage}%</p>
            <p className="text-muted" style={{ margin: 0 }}>
              {progressionActuelle} / {objectif} {challenge.unite}
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <div className="card" style={{ flex: 1, textAlign: 'center' }}>
          <p className="text-muted" style={{ margin: 0 }}>Statut</p>
          <p style={{ margin: '4px 0 0', fontWeight: 500 }}>{challenge.statut}</p>
        </div>
        {challenge.dateLimite && (
          <div className="card" style={{ flex: 1, textAlign: 'center' }}>
            <p className="text-muted" style={{ margin: 0 }}>Échéance</p>
            <p style={{ margin: '4px 0 0', fontWeight: 500 }}>{challenge.dateLimite}</p>
          </div>
        )}
      </div>

      {challenge.statut === 'en_cours' && (
        <form onSubmit={handleAddProgress} style={{ marginTop: 16 }}>
          <p className="text-muted" style={{ marginBottom: 8 }}>Ajouter une progression ({challenge.unite})</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="number"
              step="0.01"
              value={valeur}
              onChange={(e) => setValeur(e.target.value)}
              required
              style={{
                flex: 1,
                padding: '12px 14px',
                border: '1px solid var(--color-border)',
                borderRadius: 10,
                fontSize: 14,
              }}
            />
            <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '0 20px' }} disabled={submitting}>
              {submitting ? '...' : 'Ajouter'}
            </button>
          </div>
        </form>
      )}

      <h2>Historique</h2>
      {history.length === 0 ? (
        <p className="text-muted">Aucune progression enregistrée pour l'instant.</p>
      ) : (
        <div className="card">
          {history.map((entry) => (
            <div key={entry.id} className="list-item">
              <span className="text-muted">{entry.date}</span>
              <span style={{ fontWeight: 500 }}>+{entry.valeur} {challenge.unite}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'space-between' }}>
        <button className="btn-secondary" onClick={() => navigate(`/challenges/${id}/edit`)}>
          Modifier
        </button>
        <button className="btn-danger" onClick={handleDelete}>
          Supprimer le défi
        </button>
      </div>
    </div>
  );
}