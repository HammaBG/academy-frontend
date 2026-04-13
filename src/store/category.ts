import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Category {
    id: string;
    name: string;
    created_at?: string;
}

interface CategoryData {
    categories: Category[];
    currentCategory: Category | null;
    isLoading: boolean;
    error: string | null;
}

interface CategoryActions {
    createCategory: (data: { name: string }, token: string) => Promise<void>;
    getAllCategories: (token: string) => Promise<void>;
    getCategoryById: (id: string, token: string) => Promise<void>;
    updateCategory: (id: string, data: { name: string }, token: string) => Promise<void>;
    deleteCategory: (id: string, token: string) => Promise<void>;
    clearError: () => void;
    clearCurrentCategory: () => void;
}

export type CategoryStore = CategoryData & CategoryActions;

const API_URL = 'http://localhost:5000/api/categories';

export const useCategoryStore = create<CategoryStore>()(
    persist(
        (set, get) => ({
            // State
            categories: [],
            currentCategory: null,
            isLoading: false,
            error: null,

            // Actions
            clearError: () => set({ error: null }),
            clearCurrentCategory: () => set({ currentCategory: null }),

            createCategory: async (categoryData, token) => {
                set({ isLoading: true, error: null });
                try {
                    const res = await fetch(`${API_URL}/`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(categoryData),
                    });

                    const data = await res.json();
                    if (!res.ok) {
                        throw new Error(data.error || 'Failed to create category');
                    }

                    await get().getAllCategories(token);
                    set({ isLoading: false });
                } catch (err: any) {
                    set({ error: err.message, isLoading: false });
                }
            },

            getAllCategories: async (token) => {
                set({ isLoading: true, error: null });
                try {
                    const res = await fetch(`${API_URL}/`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    const data = await res.json();
                    if (!res.ok) {
                        throw new Error(data.error || 'Failed to fetch categories');
                    }

                    set({ categories: data.data || [], isLoading: false });
                } catch (err: any) {
                    set({ error: err.message, isLoading: false });
                }
            },

            getCategoryById: async (id, token) => {
                set({ isLoading: true, error: null });
                try {
                    const res = await fetch(`${API_URL}/${id}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    const data = await res.json();
                    if (!res.ok) {
                        throw new Error(data.error || 'Category not found');
                    }

                    set({ currentCategory: data.data, isLoading: false });
                } catch (err: any) {
                    set({ error: err.message, isLoading: false });
                }
            },

            updateCategory: async (id, categoryData, token) => {
                set({ isLoading: true, error: null });
                try {
                    const res = await fetch(`${API_URL}/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(categoryData),
                    });

                    const data = await res.json();
                    if (!res.ok) {
                        throw new Error(data.error || 'Failed to update category');
                    }

                    await get().getAllCategories(token);
                    set({ currentCategory: data.data, isLoading: false });
                } catch (err: any) {
                    set({ error: err.message, isLoading: false });
                }
            },

            deleteCategory: async (id, token) => {
                set({ isLoading: true, error: null });
                try {
                    const res = await fetch(`${API_URL}/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    const data = await res.json();
                    if (!res.ok) {
                        throw new Error(data.error || 'Failed to delete category');
                    }

                    set((state) => ({
                        categories: state.categories.filter((c) => c.id !== id),
                        isLoading: false,
                    }));
                } catch (err: any) {
                    set({ error: err.message, isLoading: false });
                }
            },
        }),
        {
            name: 'benaa-category-storage',
            partialize: (state) => ({
                categories: state.categories,
            }),
        }
    )
);
