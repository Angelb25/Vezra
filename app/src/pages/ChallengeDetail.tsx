import { useEffect, useState, FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getChallenge,
  getProgressHistory,
  addProgress,
} from '../api/challenges';
import type { Challenge, ProgressEntry } from '../api/challenges';

export default function ChallengeDetail() {
  // Récupère l'ID du défi depuis l'URL (ex: /challenges/3 -> id = "3")
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [history, setHistory] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Champs du formulaire d'ajout de progression
  const [valeur, setValeur] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Charge le défi et son historique au montage de la page
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
      await addProgress(Number(id), parseFloat(valeur));
      setValeur('');
      await loadData(); // recharge le défi + historique pour voir la progression à jour
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Erreur lors de l\'ajout.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!challenge) return <p>Défi introuvable.</p>;

  const objectif = parseFloat(challenge.objectifValeur);
  const progressionActuelle = history.reduce((sum, entry) => {
    // Pour distance/repetition on additionne les valeurs, sinon on compte les entrées
    if (challenge.type === 'distance' || challenge.type === 'repetition') {
      return sum + parseFloat(entry.valeur);
    }
    return sum + 1;
  }, 0);
  const pourcentage = Math.min(100, Math.round((progressionActuelle / objectif) * 100));

  return (
    <div>
      <Link to="/challenges">← Retour</Link>
      <h1>{challenge.titre}</h1>

      <p>Statut : {challenge.statut}</p>
      <p>
        Progression : {progressionActuelle} / {objectif} {challenge.unite} ({pourcentage}%)
      </p>
      <div style={{ background: '#eee', height: 10, borderRadius: 5 }}>
        <div
          style={{
            width: `${pourcentage}%`,
            background: '#FF6B35',
            height: '100%',
            borderRadius: 5,
          }}
        />
      </div>

      {challenge.dateLimite && <p>Date limite : {challenge.dateLimite}</p>}
      {challenge.sport && <p>Sport : {challenge.sport}</p>}

      {challenge.statut === 'en_cours' && (
        <form onSubmit={handleAddProgress}>
          <label htmlFor="valeur">Ajouter une progression ({challenge.unite})</label>
          <input
            id="valeur"
            type="number"
            step="0.01"
            value={valeur}
            onChange={(e) => setValeur(e.target.value)}
            required
          />
          <button type="submit" disabled={submitting}>
            {submitting ? 'Ajout...' : 'Ajouter'}
          </button>
        </form>
      )}

      <h2>Historique</h2>
      {history.length === 0 ? (
        <p>Aucune progression enregistrée pour l'instant.</p>
      ) : (
        <ul>
          {history.map((entry) => (
            <li key={entry.id}>
              {entry.date} — +{entry.valeur} {challenge.unite}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}