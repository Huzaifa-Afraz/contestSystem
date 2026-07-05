import { createContext, useContext, useState, useEffect } from 'react';
import { loginApi } from '../api/auth';
import { getMe } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true until we've checked for an existing session

  // On first load: if a token exists, fetch the user so a refresh keeps you logged in.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    getMe()
      .then((u) => setUser(u))
      .catch(() => localStorage.removeItem('token')) // stale/expired token -> clear it
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { token, user } = await loginApi(email, password);
    localStorage.setItem('token', token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Small hook so components do: const { user, login } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}