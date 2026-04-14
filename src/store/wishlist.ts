import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Course } from './course';

interface WishlistStore {
  wishlist: Course[];
  isLoading: boolean;
  error: string | null;
  toggleFavorite: (courseId: string, token: string) => Promise<boolean>;
  fetchWishlist: (token: string) => Promise<void>;
  isInWishlist: (courseId: string) => boolean;
  clearError: () => void;
}

const API_URL = 'http://localhost:5000/api/wishlist';

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      wishlist: [],
      isLoading: false,
      error: null,

      clearError: () => set({ error: null }),

      fetchWishlist: async (token) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch(`${API_URL}/me`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || 'Failed to fetch wishlist');
          }

          set({ wishlist: data.courses || [], isLoading: false });
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
        }
      },

      toggleFavorite: async (courseId, token) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch(`${API_URL}/toggle`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ courseId }),
          });

          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || 'Failed to toggle favorite');
          }

          // Refetch wishlist to sync state
          await get().fetchWishlist(token);
          set({ isLoading: false });
          return data.isFavorited;
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
          return false;
        }
      },

      isInWishlist: (courseId) => {
        return get().wishlist.some((course) => course.id === courseId);
      },
    }),
    {
      name: 'benaa-wishlist-storage',
      partialize: (state) => ({
        wishlist: state.wishlist,
      }),
    }
  )
);
