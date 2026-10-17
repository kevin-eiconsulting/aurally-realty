import { supabase, isSupabaseConfigured } from './supabase';

const DEMO_USER_KEY = 'aurally_demo_user';

// Helper to convert phone to internal auth email
export function phoneToEmail(phone) {
  const cleanPhone = phone.replace(/\D/g, '');
  return `${cleanPhone}@aurallyrealty.internal`;
}

// Get currently logged-in user (from Supabase or local storage)
export async function getCurrentUser() {
  if (isSupabaseConfigured()) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user && !error) {
        // Also fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        return {
          id: user.id,
          phone: user.user_metadata?.phone || profile?.phone || '',
          username: user.user_metadata?.username || profile?.username || 'User',
          isAdmin: profile?.is_admin || false,
          isRealSupabase: true
        };
      }
    } catch (e) {
      console.warn('Supabase auth check failed:', e);
    }
  }

  // Fallback to demo local user
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
  const email = phoneToEmail(cleanPhone);

  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          phone: cleanPhone,
          username: username.trim(),
        }
      }
    });

    if (error) throw error;

    // Try creating profile record if trigger didn't handle it
    if (data?.user) {
      try {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          phone: cleanPhone,
          username: username.trim(),
          is_admin: false
        });
      } catch (profileErr) {
        console.warn('Profile creation error (trigger may have run):', profileErr);
      }
    }

    return {
      id: data.user.id,
      phone: cleanPhone,
      username: username.trim(),
      isAdmin: false,
      isRealSupabase: true
    };
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
  const email = phoneToEmail(cleanPhone);

  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Fetch profile
    let profile = null;
    try {
      const { data: p } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      profile = p;
    } catch (_) {}

    return {
      id: data.user.id,
      phone: cleanPhone,
      username: data.user.user_metadata?.username || profile?.username || 'User',
      isAdmin: profile?.is_admin || false,
      isRealSupabase: true
    };
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
  if (isSupabaseConfigured()) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signout failed:', e);
    }
  }
  if (typeof window !== 'undefined') {
    localStorage.removeItem(DEMO_USER_KEY);
  }
}
