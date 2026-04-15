import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Course } from './course';

interface CartItem {
  course: Course;
  addedAt: string;
}

interface CartStore {
  items: CartItem[];
  addToCart: (course: Course) => boolean;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  isInCart: (courseId: string) => boolean;
  itemCount: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (course) => {
        const exists = get().items.some(
          (item) => item.course.id === course.id
        );
        if (exists) {
          return false;
        }

        set((state) => ({
          items: [
            ...state.items,
            { course, addedAt: new Date().toISOString() },
          ],
        }));
        return true;
      },

      removeFromCart: (courseId) => {
        set((state) => ({
          items: state.items.filter((item) => item.course.id !== courseId),
        }));
      },

      clearCart: () => set({ items: [] }),

      isInCart: (courseId) => {
        return get().items.some((item) => item.course.id === courseId);
      },

      itemCount: () => get().items.length,

      totalPrice: () => {
        return get().items.reduce(
          (sum, item) => sum + item.course.price,
          0
        );
      },
    }),
    {
      name: 'benaa-cart-storage',
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);
