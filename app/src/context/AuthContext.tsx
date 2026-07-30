import { createContext, useContext, useState, ReactNode } from 'react';
import client from '../api/client';

// Définit la forme de tout ce que le contexte va exposer aux composants
interface AuthContextType {
  token: string | null;           // le token JWT actuel, ou null si pas connecté
  isAuthenticated: boolean;       // raccourci pratique : true/false selon qu'on a un token
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, pseudo: string) => Promise<void>;
  logout: () => void;
}

// Le contexte React lui-même. "undefined" par défaut = pas encore initialisé.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Le Provider : un composant qui "enveloppe" toute l'app (ou une partie)
// et rend l'authentification disponible partout à l'intérieur.
export function AuthProvider({ children }: { children: ReactNode }) {
  // Au premier chargement, on regarde si un token existait déjà dans le
  // navigateur (localStorage) — ça évite de déconnecter l'utilisateur
  // à chaque fois qu'il recharge la page.
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('vezra_token')
  );

  // Se connecter : envoie email/password à Symfony, récupère un token JWT
  const login = async (email: string, password: string) => {
    const response = await client.post('/login_check', {
      username: email, // Lexik attend "username", même si chez nous c'est un email
      password: password,
    });

    const newToken = response.data.token;

    // On sauvegarde le token à deux endroits :
    // - localStorage : pour qu'il survive à un rechargement de page
    // - l'état React (setToken) : pour que l'interface se mette à jour immédiatement
    localStorage.setItem('vezra_token', newToken);
    setToken(newToken);
  };

  // S'inscrire : crée le compte, puis connecte automatiquement
  // (évite à l'utilisateur de retaper ses identifiants juste après inscription)
  const register = async (email: string, password: string, pseudo: string) => {
    await client.post('/register', { email, password, pseudo });
    await login(email, password);
  };

  // Se déconnecter : on efface le token des deux côtés
  const logout = () => {
    localStorage.removeItem('vezra_token');
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated: !!token, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook personnalisé pour utiliser facilement le contexte dans n'importe
// quel composant, sans avoir à réécrire useContext(AuthContext) partout.
// Exemple d'usage : const { login, isAuthenticated } = useAuth();
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // Cette erreur signale un bug de code (composant utilisé hors du Provider),
    // pas une erreur utilisateur normale.
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
}