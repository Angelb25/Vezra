import axios from 'axios';

const client = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ajoute automatiquement le token JWT à chaque requête, s'il existe
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('vezra_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;