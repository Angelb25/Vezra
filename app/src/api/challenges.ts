import client from './client';

// Types TypeScript correspondant à ce que retourne le backend
export interface Challenge {
  id: number;
  titre: string;
  type: 'distance' | 'repetition' | 'frequence' | 'occurrence';
  objectifValeur: string;
  unite: string;
  statut: 'en_cours' | 'termine' | 'abandonne' | 'en_pause';
  dateCreation: string;
  dateLimite: string | null;
  sport: string | null;
}

export interface ProgressEntry {
  id: number;
  valeur: string;
  date: string;
  note: string | null;
}

export interface AddProgressResponse {
  id: number;
  valeur: string;
  date: string;
  progressionActuelle: number;
  objectif: number;
  pourcentage: number;
  statutDefi: string;
}

// Récupère la liste des défis de l'utilisateur connecté
export async function getChallenges(): Promise<Challenge[]> {
  const response = await client.get('/challenges');
  return response.data;
}

// Récupère le détail d'un défi précis
export async function getChallenge(id: number): Promise<Challenge> {
  const response = await client.get(`/challenges/${id}`);
  return response.data;
}

// Crée un nouveau défi
export async function createChallenge(data: {
  titre: string;
  type: string;
  objectifValeur: number;
  unite: string;
  dateLimite?: string;
  sportId?: number;
}): Promise<Challenge> {
  const response = await client.post('/challenges', data);
  return response.data;
}

export async function updateChallenge(
  id: number,
  data: {
    titre?: string;
    dateLimite?: string | null;
    statut?: Challenge['statut'];
  }
): Promise<Challenge> {
  const response = await client.put(`/challenges/${id}`, data);
  return response.data;
}

export async function deleteChallenge(id: number): Promise<void> {
  await client.delete(`/challenges/${id}`);
}

// Récupère l'historique de progression d'un défi
export async function getProgressHistory(challengeId: number): Promise<ProgressEntry[]> {
  const response = await client.get(`/challenges/${challengeId}/progress`);
  return response.data;
}

// Ajoute une entrée de progression à un défi
export async function addProgress(
  challengeId: number,
  valeur: number,
  note?: string
): Promise<AddProgressResponse> {
  const response = await client.post(`/challenges/${challengeId}/progress`, { valeur, note });
  return response.data;
}