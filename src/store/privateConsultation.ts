import { create } from "zustand";
import { API_ENDPOINTS } from "@/config/api";
import { authenticatedFetch } from "@/lib/api";

export interface IConsultationMessage {
  _id: string;
  senderId: string;
  senderName: string;
  senderRole: "user" | "instructor" | "admin";
  senderAvatar?: string;
  message: string;
  createdAt: string;
}

export interface IPrivateConsultation {
  _id: string;
  courseId: string;
  courseName: string;
  instructorId: string;
  instructorName?: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar?: string;
  lessonTitle?: string;
  sectionId?: string;
  subject: string;
  messages: IConsultationMessage[];
  status: "open" | "answered" | "closed";
  lastMessageAt: string;
  unreadByStudent: number;
  unreadByInstructor: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConsultationStats {
  total: number;
  open: number;
  answered: number;
  closed: number;
}

export interface CreateConsultationPayload {
  courseId: string;
  lessonTitle?: string;
  sectionId?: string;
  subject: string;
  message: string;
}

interface PrivateConsultationStore {
  myConsultations: IPrivateConsultation[];
  instructorConsultations: IPrivateConsultation[];
  currentConsultation: IPrivateConsultation | null;
  instructorStats: ConsultationStats | null;
  isLoading: boolean;
  error: string | null;

  fetchMyCourseConsultations: (courseId: string, token: string) => Promise<void>;
  fetchAllMyConsultations: (token: string) => Promise<void>;
  createConsultation: (payload: CreateConsultationPayload, token: string) => Promise<IPrivateConsultation>;
  fetchSingleConsultation: (id: string, token: string) => Promise<void>;
  replyToConsultation: (id: string, message: string, token: string) => Promise<void>;
  fetchInstructorConsultations: (
    token: string,
    filters?: { status?: string; courseId?: string }
  ) => Promise<void>;
  updateStatus: (id: string, status: "open" | "answered" | "closed", token: string) => Promise<void>;
  clearCurrentConsultation: () => void;
}

const API_URL = API_ENDPOINTS.privateConsultations;

export const usePrivateConsultationStore = create<PrivateConsultationStore>((set, get) => ({
  myConsultations: [],
  instructorConsultations: [],
  currentConsultation: null,
  instructorStats: null,
  isLoading: false,
  error: null,

  clearCurrentConsultation: () => set({ currentConsultation: null }),

  fetchMyCourseConsultations: async (courseId, token) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authenticatedFetch(`${API_URL}/my-consultations?courseId=${encodeURIComponent(courseId)}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "فشل تحميل الاستشارات");
      set({ myConsultations: data.consultations || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchAllMyConsultations: async (token) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authenticatedFetch(`${API_URL}/my-consultations`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "فشل تحميل الاستشارات");
      set({ myConsultations: data.consultations || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  createConsultation: async (payload, token) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authenticatedFetch(`${API_URL}/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "فشل إرسال الاستشارة");
      const created = data.consultation as IPrivateConsultation;
      set((state) => ({
        myConsultations: [created, ...state.myConsultations.filter((c) => c._id !== created._id)],
        currentConsultation: created,
        isLoading: false,
      }));
      return created;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  fetchSingleConsultation: async (id, token) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authenticatedFetch(`${API_URL}/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "فشل تحميل تفاصيل الاستشارة");
      set({ currentConsultation: data.consultation, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  replyToConsultation: async (id, message, token) => {
    try {
      const res = await authenticatedFetch(`${API_URL}/${id}/reply`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "فشل إرسال الرد");
      const updated = data.consultation as IPrivateConsultation;
      set((state) => ({
        currentConsultation: state.currentConsultation?._id === id ? updated : state.currentConsultation,
        myConsultations: state.myConsultations.map((c) => (c._id === id ? updated : c)),
        instructorConsultations: state.instructorConsultations.map((c) => (c._id === id ? updated : c)),
      }));
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },

  fetchInstructorConsultations: async (token, filters) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append("status", filters.status);
      if (filters?.courseId) params.append("courseId", filters.courseId);

      const res = await authenticatedFetch(`${API_URL}/instructor/all?${params.toString()}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "فشل تحميل استشارات المدرب");
      set({
        instructorConsultations: data.consultations || [],
        instructorStats: data.stats || null,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  updateStatus: async (id, status, token) => {
    try {
      const res = await authenticatedFetch(`${API_URL}/${id}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "فشل تحديث الحالة");
      const updated = data.consultation as IPrivateConsultation;
      set((state) => ({
        currentConsultation: state.currentConsultation?._id === id ? updated : state.currentConsultation,
        instructorConsultations: state.instructorConsultations.map((c) => (c._id === id ? updated : c)),
      }));
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },
}));
