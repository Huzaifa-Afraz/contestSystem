import { apiFetch } from './client';

export const registerApi = (email, username, password) =>
  apiFetch('/api/auth/register', { method: 'POST', body: { email, username, password } });

export const loginApi = (email, password) =>
  apiFetch('/api/auth/login', { method: 'POST', body: { email, password } });

export const getMe = () =>
  apiFetch('/api/auth/me', { auth: true });