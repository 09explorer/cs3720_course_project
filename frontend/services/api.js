// All network access lives here. Screens never call fetch() directly, so
// wiring the real backend means changing this one file (or the .env values).
import { Platform } from 'react-native';
import mockRoutes from '../assets/data/routes.json';

// Android emulators reach the host machine at 10.0.2.2, not localhost.
const DEFAULT_HOST =
  Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';

// NOTE: EXPO_PUBLIC_* variables must be read with this exact static syntax.
export const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL || DEFAULT_HOST).replace(/\/$/, '');
export const USE_MOCK_DATA = process.env.EXPO_PUBLIC_USE_MOCK_DATA !== 'false';

const REQUEST_TIMEOUT_MS = 10000;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Generic JSON request with timeout and readable errors.
async function request(path, { method = 'GET', body, params } = {}) {
  const query = params
    ? '?' + new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
      ).toString()
    : '';

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${path}${query}`, {
      method,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`Server responded ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('The server took too long to respond.');
    throw new Error(err.message || 'Could not reach the server.');
  } finally {
    clearTimeout(timer);
  }
}

// ---- Endpoints the FastAPI backend should provide --------------------------

// GET /health -> { status: "ok" }
export async function checkHealth() {
  if (USE_MOCK_DATA) { await wait(300); return { status: 'ok (mock)' }; }
  return request('/health');
}

// GET /routes?q=<search>&sort=recent|name -> Route[]
export async function getRoutes({ search = '', sort = 'recent' } = {}) {
  if (USE_MOCK_DATA) {
    await wait(400);
    const q = search.trim().toLowerCase();
    const list = mockRoutes.filter(
      (r) => !q || r.name.toLowerCase().includes(q) || String(r.team).toLowerCase().includes(q)
    );
    return list.sort((a, b) =>
      sort === 'name' ? a.name.localeCompare(b.name) : new Date(b.updatedAt) - new Date(a.updatedAt)
    );
  }
  return request('/routes', { params: { q: search, sort } });
}

// GET /routes/{id} -> Route
export async function getRoute(id) {
  if (USE_MOCK_DATA) {
    await wait(300);
    const found = mockRoutes.find((r) => String(r.id) === String(id));
    if (!found) throw new Error('Route not found.');
    return found;
  }
  return request(`/routes/${id}`);
}

// POST /routes  body: Route (without id)  -> Route
export async function saveRoute(route) {
  if (USE_MOCK_DATA) { await wait(400); return { ...route, id: Date.now() }; }
  return request('/routes', { method: 'POST', body: route });
}

// POST /feedback  body: { name, email, message } -> { received: true }
export async function submitFeedback(payload) {
  if (USE_MOCK_DATA) { await wait(600); return { received: true }; }
  return request('/feedback', { method: 'POST', body: payload });
}