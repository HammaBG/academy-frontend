import { create } from 'zustand';

// Update these types based on your actual backend response
export interface User {
  id: string;
  email: string;
  // add other fields if necessary
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  signup: (email: string, password: string, firstName: string, lastName: string, phone?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getProfile: () => Promise<void>;
  clearError: () => void;
}

const API_URL = 'http://localhost:5000/api/auth';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null, // Note: For production, you may want to persist this in localStorage or cookies
  isAuthenticated: false,
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  signup: async (email, password, firstName, lastName, phone) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName, phone }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Signup failed');
      }

      // If signup is successful, we don't automatically log them in unless the backend returns a token here.
      // Usually, they need to log in next, or the token is returned.
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Login failed');
      }

      // Backend returns a JWT inside data.data.session.access_token (Supabase format)
      const token = data.data?.session?.access_token; 
      if (token) {
        set({ 
          token, 
          isAuthenticated: true, 
          isLoading: false 
        });
        
        // Optionally fetch the profile right after login:
        await get().getProfile();
      } else {
        throw new Error('No token received');
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  getProfile: async () => {
    const { token } = get();
    if (!token) return;

    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to fetch profile');
      }

      set({ user: data.user || data, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
        // If getting profile fails (e.g. invalid token), log them out
      set({ error: err.message, isLoading: false, isAuthenticated: false, token: null, user: null });
    }
  },
}));
