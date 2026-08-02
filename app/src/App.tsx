import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Challenges from './pages/Challenges';
import ProtectedRoute from './components/ProtectedRoute';
import CreateChallenge from './pages/CreateChallenge';
import ChallengeDetail from './pages/ChallengeDetail';
function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/challenges"
        element={
          <ProtectedRoute>
            <Challenges />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/challenges" />} />
      <Route
        path="/challenges/new"
        element={
          <ProtectedRoute>
            <CreateChallenge />
          </ProtectedRoute>
        }
      />
      <Route
        path="/challenges/:id"
        element={
          <ProtectedRoute>
            <ChallengeDetail />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;