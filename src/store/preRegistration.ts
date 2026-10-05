import { create } from "zustand";
import { API_ENDPOINTS } from "@/config/api";

export interface IPreRegistrationItem {
  _id: string;
  courseId: {
    _id: string;
    id?: string;
    name: string;
    thumbnail?: { url: string; public_id?: string };
    price: number;
    estimated_price?: number;
    ready: boolean;
    status: boolean;
    url?: string;
    categories?: string;
    short_description?: string;
    preregistration_discount?: number;
  } | string;
  courseName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  status: "pending" | "notified" | "converted";
  notifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface PreRegistrationState {
  myPreRegistrations: IPreRegistrationItem[];
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;

  registerPreRegistration: (data: {
    courseId: string;
    courseName: string;
    fullName: string;
    email: string;
    phoneNumber: string;
  }, token?: string) => Promise<{ success: boolean; message: string; alreadyRegistered?: boolean }>;

  checkStatus: (
    courseId: string,
    email?: string,
    token?: string
  ) => Promise<{ isRegistered: boolean; data?: IPreRegistrationItem | null }>;
  fetchMyPreRegistrations: (token: string) => Promise<void>;
  clearStatus: () => void;
}

export const usePreRegistrationStore = create<PreRegistrationState>((set, get) => ({
  myPreRegistrations: [],
  isLoading: false,
  error: null,
  successMessage: null,

  clearStatus: () => set({ error: null, successMessage: null, isLoading: false }),

  registerPreRegistration: async (data, token) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(API_ENDPOINTS.preRegistrations, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "فشل تسجيل الحجز المسبق");
      }

      set({
        isLoading: false,
        successMessage: resData.message || "تم تسجيل حجزك المسبق بنجاح!",
      });

      return {
        success: true,
        message: resData.message,
        alreadyRegistered: resData.alreadyRegistered,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ غير متوقع";
      set({ isLoading: false, error: msg });
      throw new Error(msg);
    }
  },

  checkStatus: async (courseId, email, token) => {
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      let url = `${API_ENDPOINTS.preRegistrations}/status/${courseId}`;
      if (email) {
        url += `?email=${encodeURIComponent(email)}`;
      }

      const res = await fetch(url, { headers });
      if (!res.ok) return { isRegistered: false, data: null };
      const data = await res.json();
      return {
        isRegistered: !!data.isRegistered,
        data: data.data || null,
      };
    } catch {
      return { isRegistered: false, data: null };
    }
  },

  fetchMyPreRegistrations: async (token) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_ENDPOINTS.preRegistrations}/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("فشل تحميل الدورات المحجوزة مسبقاً");
      }

      const data = await res.json();
      set({ myPreRegistrations: data.data || [], isLoading: false });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ أثناء التحميل";
      set({ error: msg, isLoading: false });
    }
  },
}));
