import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const [error, setError] = useState('');

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await registerApi(form.email, form.username, form.password);
      await login(form.email, form.password); // auto-login after register
      navigate('/contests');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email </label>
          <input value={form.email} onChange={update('email')} type="email" required />
        </div>
        <div>
          <label>Username </label>
          <input value={form.username} onChange={update('username')} required />
        </div>
        <div>
          <label>Password </label>
          <input value={form.password} onChange={update('password')} type="password" required />
        </div>
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}