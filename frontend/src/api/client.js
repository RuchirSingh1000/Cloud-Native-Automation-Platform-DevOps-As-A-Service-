const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

export async function login(payload) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function submitDeployment(payload, token) {
  const res = await fetch(`${API_URL}/deployments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Deployment submission failed');
  return res.json();
}

export async function fetchDeployments(token) {
  const res = await fetch(`${API_URL}/deployments`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to load deployments');
  return res.json();
}
