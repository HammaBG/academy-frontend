import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Update these types based on your actual backend response
export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role?: 'user' | 'instructor' | 'admin';
  avatar_url?: string;
  title?: string;
}

interface AuthData {
  user: User | null;
  users: User[];
  instructors: User[];
  token: string | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  isDataLoading: boolean;
  error: string | null;
}

interface AuthActions {
  signup: (email: string, password: string, firstName: string, lastName: string, phone?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getProfile: () => Promise<void>;
  getAllUsers: () => Promise<void>;
  getInstructors: () => Promise<void>;
  updateProfile: (data: { title?: string; avatar_url?: string }, token: string) => Promise<void>;
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
  clearError: () => void;
}

export type AuthStore = AuthData & AuthActions;

const API_URL = 'http://localhost:5000/api/auth';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      users: [],
      instructors: [],
      token: null,
      isAuthenticated: false,
      isAuthLoading: false,
      isDataLoading: false,
      error: null,

      // Actions
      clearError: () => set({ error: null }),

      signup: async (email, password, firstName, lastName, phone) => {
        set({ isAuthLoading: true, error: null });
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

          set({ isAuthLoading: false });
        } catch (err: any) {
          set({ error: err.message, isAuthLoading: false });
        }
      },

      login: async (email, password) => {
        set({ isAuthLoading: true, error: null });
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

          const token = data.data?.session?.access_token;
          if (token) {
            set({
              token,
              isAuthenticated: true,
              isAuthLoading: false
            });

            await get().getProfile();
          } else {
            throw new Error('No token received');
          }
        } catch (err: any) {
          set({ error: err.message, isAuthLoading: false });
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

        set({ isAuthLoading: true, error: null });
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

          let fetchedUser = data.user || data;
          if (fetchedUser.user_metadata) {
            fetchedUser = { ...fetchedUser, ...fetchedUser.user_metadata };
          }

          set({ user: fetchedUser, isAuthenticated: true, isAuthLoading: false });
        } catch (err: any) {
          set({
            error: err.message,
            isAuthLoading: false,
            isAuthenticated: false,
            token: null,
            user: null
          });
        }
      },

      getAllUsers: async () => {
        const { token } = get();
        if (!token) return;

        set({ isDataLoading: true, error: null });
        try {
          const res = await fetch(`${API_URL}/users`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.message || data.error || 'Failed to fetch users');
          }

          set({ users: data.users || [], isDataLoading: false });
        } catch (err: any) {
          set({ error: err.message, isDataLoading: false });
        }
      },

      getInstructors: async () => {
        set({ isDataLoading: true, error: null });
        try {
          const res = await fetch(`${API_URL}/instructors`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });

          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.message || data.error || 'Failed to fetch instructors');
          }

          set({ instructors: data.instructors || [], isDataLoading: false });
        } catch (err: any) {
          set({ error: err.message, isDataLoading: false });
        }
      },

      updateProfile: async (profileData, token) => {
        set({ isDataLoading: true, error: null });
        try {
          const res = await fetch(`${API_URL}/update-profile`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData),
          });

          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || 'Failed to update profile');
          }

          // Update local user state
          set((state) => ({
            user: state.user ? { ...state.user, ...profileData, avatar_url: data.user?.user_metadata?.avatar_url || profileData.avatar_url } : null,
            isDataLoading: false,
          }));
        } catch (err: any) {
          set({ error: err.message, isDataLoading: false });
          throw err;
        }
      },

      updateUser: async (id, userData) => {
        const { token } = get();
        if (!token) return;

        set({ isDataLoading: true, error: null });
        try {
          const res = await fetch(`${API_URL}/users/${id}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });

          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.message || data.error || 'Failed to update user');
          }

          await get().getAllUsers();
        } catch (err: any) {
          set({ error: err.message, isDataLoading: false });
          throw err;
        }
      },
    }),
    {
      name: 'benaa-auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
