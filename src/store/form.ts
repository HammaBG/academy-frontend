import { create } from 'zustand';

export interface INote {
  text: string;
  createdAt: string;
}

export interface IForm {
  id: string;
  fullName: string;
  address: string;
  phoneNumber: string;
  email?: string;
  courseName: string;
  coursePrice: number;
  courseId: string;
  status:
  | 'pending'
  | 'contacted'
  | 'completed'
  | 'not-interested'
  | 'not-available'
  | 'callback'
  | 'delivered'
  | 'not-delivered';
  notes?: INote[];
  createdAt: string;
  updatedAt: string;
}

interface FormStore {
  forms: IForm[];
  stats: any | null;
  isLoading: boolean;
  error: string | null;
  success: boolean;
  submitForm: (data: Omit<IForm, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  fetchForms: (token: string, status?: string, courseId?: string) => Promise<void>;
  fetchStats: (token: string) => Promise<void>;
  updateFormStatus: (id: string, updateData: Partial<IForm>, token: string) => Promise<void>;
  deleteForm: (id: string, token: string) => Promise<void>;
  addNote: (id: string, text: string, token: string) => Promise<void>;
  deleteNote: (id: string, noteId: string, token: string) => Promise<void>;
  clearStatus: () => void;
}

//const API_URL = 'https://academy-backend-8gl3.onrender.com/api/forms';
const API_URL = 'http://localhost:5000/api/forms';

export const useFormStore = create<FormStore>((set, get) => ({
  forms: [],
  stats: null,
  isLoading: false,
  error: null,
  success: false,

  clearStatus: () => set({ isLoading: false, error: null, success: false }),

  submitForm: async (formData) => {
    set({ isLoading: true, error: null, success: false });
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form');
      }

      set({ success: true, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Something went wrong', isLoading: false });
      throw err;
    }
  },

  fetchForms: async (token, status, courseId) => {
    set({ isLoading: true, error: null });
    try {
      let queryParams = '';
      const params: string[] = [];
      if (status) params.push(`status=${status}`);
      if (courseId) params.push(`courseId=${courseId}`);
      if (params.length > 0) {
        queryParams = `?${params.join('&')}`;
      }

      const response = await fetch(`${API_URL}${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch forms');
      }

      set({ forms: result.data || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Something went wrong', isLoading: false });
    }
  },

  fetchStats: async (token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch statistics');
      }

      set({ stats: result.data || null, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Something went wrong', isLoading: false });
    }
  },

  updateFormStatus: async (id, updateData, token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update form');
      }

      const updatedForm = result.data;
      set((state) => ({
        forms: state.forms.map((f) => (f.id === id ? { ...f, ...updatedForm } : f)),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.message || 'Something went wrong', isLoading: false });
      throw err;
    }
  },

  deleteForm: async (id, token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete form');
      }

      set((state) => ({
        forms: state.forms.filter((f) => f.id !== id),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.message || 'Something went wrong', isLoading: false });
      throw err;
    }
  },

  addNote: async (id, text, token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/${id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add note');
      }

      set((state) => ({
        forms: state.forms.map((f) => (f.id === id ? { ...f, notes: result.data || [] } : f)),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.message || 'Something went wrong', isLoading: false });
      throw err;
    }
  },

  deleteNote: async (id, noteId, token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/${id}/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete note');
      }

      set((state) => ({
        forms: state.forms.map((f) => (f.id === id ? { ...f, notes: result.data || [] } : f)),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.message || 'Something went wrong', isLoading: false });
      throw err;
    }
  },
}));
