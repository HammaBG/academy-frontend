import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Article TypeScript Interface based on your backend controller
export interface Article {
    id: string;
    title: string;
    content: string;
    status: 'draft' | 'published';
    excerpt?: string;
    image_url?: string;
    created_at?: string;
}

interface ArticleData {
    articles: Article[];
    currentArticle: Article | null;
    isLoading: boolean;
    error: string | null;
}

interface ArticleActions {
    // We use FormData for create/update because of the image upload
    createArticle: (formData: FormData, token: string) => Promise<void>;
    getAllArticles: (token: string) => Promise<void>;
    getPublicArticles: () => Promise<void>;
    getArticleById: (id: string, token: string) => Promise<void>;
    getPublicArticleById: (id: string) => Promise<void>;


    updateArticle: (id: string, formData: FormData, token: string) => Promise<void>;
    deleteArticle: (id: string, token: string) => Promise<void>;
    clearError: () => void;
    clearCurrentArticle: () => void;
}

export type ArticleStore = ArticleData & ArticleActions;

const API_URL = 'http://localhost:5000/api/articles';

export const useArticleStore = create<ArticleStore>()(
    persist(
        (set, get) => ({
            // State
            articles: [],
            currentArticle: null,
            isLoading: false,
            error: null,

            // Actions
            clearError: () => set({ error: null }),
            clearCurrentArticle: () => set({ currentArticle: null }),

            createArticle: async (formData, token) => {
                set({ isLoading: true, error: null });
                try {
                    const res = await fetch(`${API_URL}/`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            // Note: Don't set Content-Type header when sending FormData; 
                            // the browser will set it automatically with the boundary string.
                        },
                        body: formData,
                    });

                    const data = await res.json();
                    if (!res.ok) {
                        throw new Error(data.error || 'Failed to create article');
                    }

                    // Refresh list after creation
                    await get().getAllArticles(token);
                    set({ isLoading: false });
                } catch (err: any) {
                    set({ error: err.message, isLoading: false });
                }
            },
            
            getPublicArticles: async () => {
                set({ isLoading: true, error: null });
                try {
                    const res = await fetch(`${API_URL}/public`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    const data = await res.json();
                    if (!res.ok) {
                        throw new Error(data.error || 'Failed to fetch public articles');
                    }

                    set({ articles: data.data || [], isLoading: false });
                } catch (err: any) {
                    set({ error: err.message, isLoading: false });
                }
            },

            getAllArticles: async (token) => {

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
                        throw new Error(data.error || 'Failed to fetch articles');
                    }

                    set({ articles: data.data || [], isLoading: false });
                } catch (err: any) {
                    set({ error: err.message, isLoading: false });
                }
            },

            getPublicArticleById: async (id: string) => {

                set({ isLoading: true, error: null });
                try {
                    const res = await fetch(`${API_URL}/public/${id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    const data = await res.json();
                    if (!res.ok) {
                        throw new Error(data.error || 'Article not found');
                    }

                    set({ currentArticle: data.data, isLoading: false });
                } catch (err: any) {
                    set({ error: err.message, isLoading: false });
                }
            },

            getArticleById: async (id, token) => {

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
                        throw new Error(data.error || 'Article not found');
                    }

                    set({ currentArticle: data.data, isLoading: false });
                } catch (err: any) {
                    set({ error: err.message, isLoading: false });
                }
            },

            updateArticle: async (id, formData, token) => {
                set({ isLoading: true, error: null });
                try {
                    const res = await fetch(`${API_URL}/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            // No Content-Type for FormData
                        },
                        body: formData,
                    });

                    const data = await res.json();
                    if (!res.ok) {
                        throw new Error(data.error || 'Failed to update article');
                    }

                    // Refresh list and current article
                    await get().getAllArticles(token);
                    set({ currentArticle: data.data, isLoading: false });
                } catch (err: any) {
                    set({ error: err.message, isLoading: false });
                }
            },

            deleteArticle: async (id, token) => {
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
                        throw new Error(data.error || 'Failed to delete article');
                    }

                    // Update local state by filtering out the deleted article
                    set((state) => ({
                        articles: state.articles.filter((a) => a.id !== id),
                        isLoading: false,
                    }));
                } catch (err: any) {
                    set({ error: err.message, isLoading: false });
                }
            },
        }),
        {
            name: 'benaa-article-storage',
            partialize: (state) => ({
                // You might only want to persist the list or specific flags
                articles: state.articles,
            }),
        }
    )
);
