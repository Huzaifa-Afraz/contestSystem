import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  // Wait for the session check before deciding — avoids bouncing a logged-in user.
  if (loading) return <p>Loading...</p>;

  // Not logged in -> go to login.
  if (!user) return <Navigate to="/login" replace />;

  // Logged in but wrong role -> block.
  if (role && user.role !== role) return <Navigate to="/contests" replace />;

  return children;
}