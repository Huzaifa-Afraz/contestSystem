import { Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>
      <Nav />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contests" element={<p>Contests page coming next</p>} />
        <Route path="/" element={<Navigate to="/contests" />} />
      </Routes>
    </div>
  );
}