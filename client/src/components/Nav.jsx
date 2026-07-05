import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Nav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ borderBottom: '1px solid #ccc', paddingBottom: 8, marginBottom: 16 }}>
      <Link to="/contests" style={{ marginRight: 8 }}>Contests</Link>
      {user && <Link to="/me" style={{ marginRight: 8 }}>My Activity</Link>}
      {user?.role === 'ADMIN' && <Link to="/admin/create" style={{ marginRight: 8 }}>Create Contest</Link>}
      <span style={{ float: 'right' }}>
        {user ? (
          <>
            <span style={{ marginRight: 8 }}>{user.email} ({user.role})</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: 8 }}>Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </span>
    </nav>
  );
}