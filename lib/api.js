const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  // If token is stored in localStorage, include it as Bearer token
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('aurally_auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const config = {
    ...options,
    headers,
    credentials: 'include' // Send cookies for cross-origin requests
  };

  try {
    const res = await fetch(url, config);

    // Try to parse json
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg = data?.error || data?.message || `Request failed with status ${res.status}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    // If the Express server is offline or unreachable, log warning and rethrow
    console.warn(`[Aurally API] Error connecting to ${url}:`, err.message);
    throw err;
  }
}
