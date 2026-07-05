import { apiFetch } from './client';

export const myParticipations = () => apiFetch('/api/me/participations', { auth: true });
export const myPrizes = () => apiFetch('/api/me/prizes', { auth: true });