import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { logout } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Tu es connecté !</p>
      <button onClick={logout}>Se déconnecter</button>
    </div>
  );
}