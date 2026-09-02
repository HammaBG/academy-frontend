import { create } from 'zustand';

export interface IEnrollmentCode {
  id: string;
  name: string;
  courses: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  coursePrices: Array<{
    courseId: string;
    price: number;
    course?: {
      name: string;
      price: number;
    };
  }>;
  usageLimit: number;
  usedBy: Array<{
    id: string;
    name: string;
    email: string;
    avatar: string;
  }>;
  used: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EnrollmentCodeStore {
  enrollmentCodes: IEnrollmentCode[];
  isLoading: boolean;
  error: string | null;
  success: boolean;
  useCode: (code: string, token: string) => Promise<void>;
  fetchEnrollmentCodes: (token: string) => Promise<void>;
  createEnrollmentCode: (data: { name: string; courses: string[]; usageLimit?: number }, token: string) => Promise<void>;
  deleteEnrollmentCode: (id: string, token: string) => Promise<void>;
  clearStatus: () => void;
}

import { API_ENDPOINTS } from '@/config/api';

const API_URL = API_ENDPOINTS.enrollmentCodes;


export const useEnrollmentCodeStore = create<EnrollmentCodeStore>((set, get) => ({
  enrollmentCodes: [],
  isLoading: false,
  error: null,
  success: false,

  clearStatus: () => set({ isLoading: false, error: null, success: false }),

  useCode: async (code, token) => {
    set({ isLoading: true, error: null, success: false });
    try {
      const response = await fetch(`${API_URL}/use`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to redeem enrollment code');
      }

      set({ success: true, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Something went wrong', isLoading: false });
      throw err;
    }
  },

  fetchEnrollmentCodes: async (token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(API_URL, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch enrollment codes');
      }

      set({ enrollmentCodes: result.enrollmentCodes || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Something went wrong', isLoading: false });
    }
  },

  createEnrollmentCode: async (codeData, token) => {
    set({ isLoading: true, error: null, success: false });
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(codeData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create enrollment code');
      }

      set((state) => ({
        enrollmentCodes: [result.enrollmentCode, ...state.enrollmentCodes],
        success: true,
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.message || 'Something went wrong', isLoading: false });
      throw err;
    }
  },

  deleteEnrollmentCode: async (id, token) => {
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
        throw new Error(result.error || 'Failed to delete enrollment code');
      }

      set((state) => ({
        enrollmentCodes: state.enrollmentCodes.filter((c) => c.id !== id),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.message || 'Something went wrong', isLoading: false });
      throw err;
    }
  },
}));
