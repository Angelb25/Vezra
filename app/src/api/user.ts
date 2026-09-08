import client from './client';

export interface Me {
  id: number;
  email: string;
  pseudo: string;
  avatarUrl: string | null;
  niveau: number;
  xpTotal: number;
  dateInscription: string;
}

export async function getMe(): Promise<Me> {
  const response = await client.get('/me');
  return response.data;
}