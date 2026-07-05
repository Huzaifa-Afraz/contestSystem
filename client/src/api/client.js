const BASE_URL = 'http://localhost:5000';

export async function apiFetch(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (auth) {
    const token = localStorage.getItem('token');
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Try to parse JSON either way (errors come back as JSON too).
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    // Your backend sends { error: "..." } — surface that message.
    throw new Error(data?.error || `Request failed (${res.status})`);
  }

  return data;
}