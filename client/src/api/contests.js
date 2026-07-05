import { apiFetch } from './client';

export const listContests = (page = 1, limit = 10) =>
  apiFetch(`/api/contests?page=${page}&limit=${limit}`);

export const getContest = (id) =>
  apiFetch(`/api/contests/${id}`);

export const getLeaderboard = (id, page = 1, limit = 10) =>
  apiFetch(`/api/contests/${id}/leaderboard?page=${page}&limit=${limit}`);

export const createContest = (data) =>
  apiFetch('/api/contests', { method: 'POST', body: data, auth: true });