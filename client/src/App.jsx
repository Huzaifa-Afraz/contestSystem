import { Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Contests from './pages/Contests';
import ContestDetail from './pages/ContestDetail';
import Play from './pages/Play';
import Leaderboard from './pages/Leaderboard';
import Me from './pages/Me';
import AdminCreate from './pages/AdminCreate';

export default function App() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>
      <Nav />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contests" element={<Contests />} />
        <Route path="/contests/:id" element={<ContestDetail />} />
        <Route path="/contests/:id/leaderboard" element={<Leaderboard />} />
        <Route path="/contests/:id/play" element={<ProtectedRoute><Play /></ProtectedRoute>} />
        <Route path="/me" element={<ProtectedRoute><Me /></ProtectedRoute>} />
        <Route path="/admin/create" element={<ProtectedRoute role="ADMIN"><AdminCreate /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/contests" />} />
        <Route path="*" element={<p>Page not found</p>} />
      </Routes>
    </div>
  );
}