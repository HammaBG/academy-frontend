import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createSafeStorage } from "@/lib/storage";
import { API_ENDPOINTS } from "@/config/api";
import { authenticatedFetch } from "@/lib/api";

const API_URL = API_ENDPOINTS.coupons;

export interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usedCount: number;
  expiresAt?: string | null;
  active: boolean;
  courses?: string[];
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppliedCoupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  description?: string;
  discountAmount: number;
  finalTotal: number;
}

interface CouponState {
  coupons: Coupon[];
  appliedCoupon: AppliedCoupon | null;
  isLoading: boolean;
  isValidating: boolean;
  error: string | null;
  successMessage: string | null;

  // Checkout actions
  applyCoupon: (code: string, cartTotal: number, courseIds: string[]) => Promise<boolean>;
  removeAppliedCoupon: () => void;
  clearMessages: () => void;

  // Admin actions
  fetchCoupons: (token: string) => Promise<void>;
  createCoupon: (data: Partial<Coupon>, token: string) => Promise<boolean>;
  updateCoupon: (id: string, data: Partial<Coupon>, token: string) => Promise<boolean>;
  deleteCoupon: (id: string, token: string) => Promise<boolean>;
}

export const useCouponStore = create<CouponState>()(
  persist(
    (set, get) => ({
      coupons: [],
      appliedCoupon: null,
      isLoading: false,
      isValidating: false,
      error: null,
      successMessage: null,

      clearMessages: () => set({ error: null, successMessage: null }),

      removeAppliedCoupon: () => {
        set({ appliedCoupon: null, successMessage: null, error: null });
      },

      applyCoupon: async (code: string, cartTotal: number, courseIds: string[]) => {
        set({ isValidating: true, error: null, successMessage: null });
        try {
          const res = await fetch(`${API_URL}/validate`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              code,
              cartTotal,
              courseIds,
            }),
          });

          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.message || data.error || "كود الخصم غير صالح");
          }

          set({
            appliedCoupon: {
              id: data.coupon.id,
              code: data.coupon.code,
              discountType: data.coupon.discountType,
              discountValue: data.coupon.discountValue,
              description: data.coupon.description,
              discountAmount: data.discountAmount,
              finalTotal: data.finalTotal,
            },
            successMessage: `تم تطبيق كود الخصم (${data.coupon.code}) بنجاح!`,
            isValidating: false,
            error: null,
          });
          return true;
        } catch (err: any) {
          set({
            error: err.message || "حدث خطأ أثناء التحقق من الكود",
            isValidating: false,
            appliedCoupon: null,
          });
          return false;
        }
      },

      fetchCoupons: async (token: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authenticatedFetch(`${API_URL}/all`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.message || "فشل تحميل الكوبونات");
          }
          set({
            coupons: (data.coupons || []).map((c: any) => ({
              ...c,
              id: c._id ? c._id.toString() : c.id,
            })),
            isLoading: false,
          });
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
        }
      },

      createCoupon: async (data: Partial<Coupon>, token: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authenticatedFetch(`${API_URL}/create`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          });
          const resData = await res.json();
          if (!res.ok) {
            throw new Error(resData.message || "فشل إنشاء الكوبون");
          }
          const newCoupon = {
            ...resData.coupon,
            id: resData.coupon._id ? resData.coupon._id.toString() : resData.coupon.id,
          };
          set((state) => ({
            coupons: [newCoupon, ...state.coupons],
            isLoading: false,
          }));
          return true;
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
          return false;
        }
      },

      updateCoupon: async (id: string, data: Partial<Coupon>, token: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authenticatedFetch(`${API_URL}/update/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          });
          const resData = await res.json();
          if (!res.ok) {
            throw new Error(resData.message || "فشل تحديث الكوبون");
          }
          const updated = {
            ...resData.coupon,
            id: resData.coupon._id ? resData.coupon._id.toString() : resData.coupon.id,
          };
          set((state) => ({
            coupons: state.coupons.map((c) => (c.id === id ? updated : c)),
            isLoading: false,
          }));
          return true;
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
          return false;
        }
      },

      deleteCoupon: async (id: string, token: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authenticatedFetch(`${API_URL}/delete/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.message || "فشل حذف الكوبون");
          }
          set((state) => ({
            coupons: state.coupons.filter((c) => c.id !== id),
            isLoading: false,
          }));
          return true;
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
          return false;
        }
      },
    }),
    {
      name: "benaa-coupon-storage",
      storage: createJSONStorage(() => createSafeStorage()),
      partialize: (state) => ({
        appliedCoupon: state.appliedCoupon,
      }),
    }
  )
);
