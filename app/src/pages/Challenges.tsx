import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteChallenge, getChallenges, updateChallenge } from '../api/challenges';
import type { Challenge } from '../api/challenges';
import { useAuth } from '../context/AuthContext';

export default function Challenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ titre: '', dateLimite: '', statut: 'en_cours' as Challenge['statut'] });
  const [savingId, setSavingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { logout } = useAuth();

  const loadChallenges = () => {
    getChallenges()
      .then(setChallenges)
      .catch(() => setError('Impossible de charger tes défis.'))
      .finally(() => setLoading(false));
  };

  // Au chargement de la page, on récupère les défis depuis l'API
  useEffect(() => {
    loadChallenges();
  }, []);

  const startEditing = (challenge: Challenge) => {
    setEditingId(challenge.id);
    setEditForm({
      titre: challenge.titre,
      dateLimite: challenge.dateLimite ?? '',
      statut: challenge.statut,
    });
  };

  const handleSave = async (id: number) => {
    setSavingId(id);
    setError(null);

    try {
      const updatedChallenge = await updateChallenge(id, {
        titre: editForm.titre.trim(),
        dateLimite: editForm.dateLimite || undefined,
        statut: editForm.statut,
      });

      setChallenges((current) =>
        current.map((challenge) =>
          challenge.id === id
            ? {
                ...challenge,
                titre: updatedChallenge.titre ?? challenge.titre,
                dateLimite: updatedChallenge.dateLimite ?? challenge.dateLimite,
                statut: updatedChallenge.statut ?? challenge.statut,
              }
            : challenge
        )
      );
      setEditingId(null);
    } catch {
      setError('Impossible de modifier ce défi.');
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Supprimer ce défi ?');
    if (!confirmed) return;

    setDeletingId(id);
    setError(null);

    try {
      await deleteChallenge(id);
      setChallenges((current) => current.filter((challenge) => challenge.id !== id));
      if (editingId === id) {
        setEditingId(null);
      }
    } catch {
      setError('Impossible de supprimer ce défi.');
    } finally {
      setDeletingId(null);
    }
  };

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
          {challenges.map((challenge) => {
            const isEditing = editingId === challenge.id;

            return (
              <li key={challenge.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
                {isEditing ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <input
                      type="text"
                      value={editForm.titre}
                      onChange={(event) => setEditForm((current) => ({ ...current, titre: event.target.value }))}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="date"
                        value={editForm.dateLimite}
                        onChange={(event) => setEditForm((current) => ({ ...current, dateLimite: event.target.value }))}
                      />
                      <select
                        value={editForm.statut}
                        onChange={(event) =>
                          setEditForm((current) => ({
                            ...current,
                            statut: event.target.value as Challenge['statut'],
                          }))
                        }
                      >
                        <option value="en_cours">En cours</option>
                        <option value="termine">Terminé</option>
                        <option value="abandonne">Abandonné</option>
                        <option value="en_pause">En pause</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button type="button" onClick={() => handleSave(challenge.id)} disabled={savingId === challenge.id}>
                        {savingId === challenge.id ? 'Enregistrement...' : 'Enregistrer'}
                      </button>
                      <button type="button" onClick={() => setEditingId(null)}>
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link to={`/challenges/${challenge.id}`} style={{ flex: 1 }}>
                    {challenge.titre} — {challenge.objectifValeur} {challenge.unite} — {challenge.statut}
                  </Link>
                )}

                {!isEditing && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="button" onClick={() => startEditing(challenge)}>
                      Modifier
                    </button>
                    <button type="button" onClick={() => handleDelete(challenge.id)} disabled={deletingId === challenge.id}>
                      {deletingId === challenge.id ? 'Suppression...' : 'Supprimer'}
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}