import { apiFetch } from './client';

export const joinContest = (id) =>
  apiFetch(`/api/contests/${id}/join`, { method: 'POST', auth: true });

export const submitAnswers = (id, answers) =>
  apiFetch(`/api/contests/${id}/submit`, { method: 'POST', body: { answers }, auth: true });