import { create } from "zustand";
import { API_ENDPOINTS } from "@/config/api";
import { authenticatedFetch } from "@/lib/api";

export interface ITicketReply {
  _id: string;
  senderId: string;
  senderName: string;
  senderRole: "user" | "admin" | "instructor";
  message: string;
  createdAt: string;
}

export interface ITicket {
  _id: string;
  id?: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhone?: string;
  subject: string;
  category: string;
  currentLevel: string;
  goalOrIssue: string;
  preferredTime?: string;
  status: "pending" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  adminNotes?: string;
  replies: ITicketReply[];
  createdAt: string;
  updatedAt: string;
}

export interface ITicketStats {
  total: number;
  pending: number;
  in_progress: number;
  resolved: number;
  closed: number;
}

export interface CreateTicketData {
  subject: string;
  category: string;
  currentLevel: string;
  goalOrIssue: string;
  preferredTime?: string;
  userPhone?: string;
}

interface TicketStore {
  myTickets: ITicket[];
  adminTickets: ITicket[];
  currentTicket: ITicket | null;
  adminStats: ITicketStats | null;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;

  createTicket: (data: CreateTicketData, token: string) => Promise<ITicket>;
  fetchMyTickets: (token: string) => Promise<void>;
  fetchSingleTicket: (id: string, token: string) => Promise<void>;
  addReply: (ticketId: string, message: string, token: string) => Promise<void>;
  fetchAdminTickets: (
    token: string,
    filters?: { status?: string; category?: string; priority?: string; search?: string }
  ) => Promise<void>;
  updateTicketStatus: (
    id: string,
    updateData: { status?: string; priority?: string; adminNotes?: string },
    token: string
  ) => Promise<void>;
  deleteTicket: (id: string, token: string) => Promise<void>;
  clearStatus: () => void;
}

const API_URL = API_ENDPOINTS.tickets;

export const useTicketStore = create<TicketStore>((set, get) => ({
  myTickets: [],
  adminTickets: [],
  currentTicket: null,
  adminStats: null,
  isLoading: false,
  error: null,
  successMessage: null,

  clearStatus: () => set({ error: null, successMessage: null, isLoading: false }),

  createTicket: async (ticketData, token) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const res = await authenticatedFetch(`${API_URL}/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ticketData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || "فشل إرسال التذكرة");
      }

      set((state) => ({
        myTickets: [data.ticket, ...state.myTickets],
        isLoading: false,
        successMessage: data.message || "تم إرسال تذكرتك بنجاح",
      }));

      return data.ticket;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  fetchMyTickets: async (token) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authenticatedFetch(`${API_URL}/my-tickets`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || "فشل جلب التذاكر");
      }

      set({ myTickets: data.tickets || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchSingleTicket: async (id, token) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authenticatedFetch(`${API_URL}/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || "التذكرة غير موجودة");
      }

      set({ currentTicket: data.ticket, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  addReply: async (ticketId, message, token) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authenticatedFetch(`${API_URL}/${ticketId}/reply`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || "فشل إرسال الرد");
      }

      set((state) => ({
        currentTicket: data.ticket,
        myTickets: state.myTickets.map((t) => (t._id === ticketId ? data.ticket : t)),
        adminTickets: state.adminTickets.map((t) => (t._id === ticketId ? data.ticket : t)),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  fetchAdminTickets: async (token, filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const queryParams = new URLSearchParams();
      if (filters.status && filters.status !== "all") queryParams.append("status", filters.status);
      if (filters.category && filters.category !== "all") queryParams.append("category", filters.category);
      if (filters.priority && filters.priority !== "all") queryParams.append("priority", filters.priority);
      if (filters.search) queryParams.append("search", filters.search);

      const url = `${API_URL}/admin/all${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

      const res = await authenticatedFetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || "فشل جلب تذاكر الإدارة");
      }

      set({
        adminTickets: data.tickets || [],
        adminStats: data.stats || null,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  updateTicketStatus: async (id, updateData, token) => {
    try {
      const res = await authenticatedFetch(`${API_URL}/admin/${id}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || "فشل تحديث حالة التذكرة");
      }

      set((state) => ({
        currentTicket: state.currentTicket?._id === id ? data.ticket : state.currentTicket,
        adminTickets: state.adminTickets.map((t) => (t._id === id ? data.ticket : t)),
      }));
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },

  deleteTicket: async (id, token) => {
    try {
      const res = await authenticatedFetch(`${API_URL}/admin/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || "فشل حذف التذكرة");
      }

      set((state) => ({
        adminTickets: state.adminTickets.filter((t) => t._id !== id),
      }));
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },
}));
