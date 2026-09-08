import client from './client';

export interface BadgeItem {
  id: number;
  nom: string;
  description: string;
  icone: string;
  debloque: boolean;
  dateDeblocage: string | null;
}

export async function getBadges(): Promise<BadgeItem[]> {
  const response = await client.get('/badges');
  return response.data;
}