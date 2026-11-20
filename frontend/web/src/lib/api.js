import axios from 'axios';

// Vite proxies /api and /sanctum to Laravel while developing locally.
// Sanctum's cookie-based authentication is intended for your first-party React web app.
export const api = axios.create({
  baseURL: '/',
  withCredentials: true,
  withXSRFToken: true,
  headers: { Accept: 'application/json' },
});

export async function fetchFeaturedProducts() {
  const response = await api.get('/api/products');
  return response.data.data ?? response.data;
}

export async function fetchCurrentUser() {
  const response = await api.get('/api/user');
  return response.data;
}

// Use this inside your eventual login page, not on the public homepage.
export async function login({ email, password }) {
  await api.get('/sanctum/csrf-cookie');
  return api.post('/laravel-auth/login', { email, password });
}
