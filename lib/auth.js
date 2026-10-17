import { apiFetch } from './api';

const DEMO_USER_KEY = 'aurally_demo_user';
const TOKEN_KEY = 'aurally_auth_token';

// Helper to convert phone to internal auth email
export function phoneToEmail(phone) {
  const cleanPhone = phone.replace(/\D/g, '');
  return `${cleanPhone}@aurallyrealty.internal`;
}

// Get currently logged-in user
export async function getCurrentUser() {
  // 1. Try to fetch from Express API
  try {
    const data = await apiFetch('/auth/me');
    if (data && data.user) {
      return data.user;
    }
  } catch (err) {
    // If not authenticated or API down, check localStorage
  }

  // 2. Fallback to demo local user
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(DEMO_USER_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
  }
  return null;
}

// Sign up with phone, username, and password
export async function signUpUser({ phone, username, password }) {
  const cleanPhone = phone.replace(/\D/g, '');

  try {
    const data = await apiFetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        phone: cleanPhone,
        username: username.trim(),
        password
      })
    });

    if (data?.token && typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, data.token);
    }
    if (data?.user) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(data.user));
      }
      return data.user;
    }
  } catch (err) {
    console.warn('API signup failed, falling back to local demo:', err.message);
    if (!err.message.includes('fetch') && !err.message.includes('network')) {
      // Re-throw server validation errors (e.g. "Account already exists")
      throw err;
    }
  }

  // Demo fallback
  const demoUser = {
    id: 'demo_' + Date.now(),
    phone: cleanPhone,
    username: username.trim(),
    isAdmin: username.toLowerCase().includes('admin'),
    isDemo: true
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
  }
  return demoUser;
}

// Sign in with phone and password
export async function signInUser({ phone, password }) {
  const cleanPhone = phone.replace(/\D/g, '');

  try {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        phone: cleanPhone,
        password
      })
    });

    if (data?.token && typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, data.token);
    }
    if (data?.user) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(data.user));
      }
      return data.user;
    }
  } catch (err) {
    console.warn('API signin failed, falling back to demo check:', err.message);
    if (!err.message.includes('fetch') && !err.message.includes('network') && !err.message.includes('Failed to fetch')) {
      throw err;
    }
  }

  // Demo fallback: accept demo credentials
  const demoUser = {
    id: 'demo_' + cleanPhone,
    phone: cleanPhone,
    username: 'User_' + cleanPhone.slice(-4),
    isAdmin: cleanPhone === '9876543210',
    isDemo: true
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
  }
  return demoUser;
}

// Sign out
export async function signOutUser() {
  try {
    await apiFetch('/auth/logout', { method: 'POST' });
  } catch (_) {}

  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(DEMO_USER_KEY);
  }
}
