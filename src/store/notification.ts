import { create } from "zustand";
import { persist } from "zustand/middleware";
import { API_ENDPOINTS } from "@/config/api";
import { authenticatedFetch } from "@/lib/api";

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "qa_reply" | "course_activation" | "certificate" | "system" | "chat_message" | "private_consultation";
  link?: string;
  sender?: {
    id: string;
    name: string;
    role: string;
    roleLabel?: string;
    avatar?: string;
  };
  courseName?: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: AppNotification[];
  isLoading: boolean;
  fetchNotifications: (token: string) => Promise<void>;
  addNotification: (notification: Omit<AppNotification, "id" | "isRead" | "createdAt"> & { id?: string }) => void;
  markAsRead: (id: string, token?: string | null) => Promise<void>;
  markAllAsRead: (token?: string | null) => Promise<void>;
  deleteNotification: (id: string, token?: string | null) => Promise<void>;
  clearAll: (token?: string | null) => Promise<void>;
  getUnreadCount: (userId?: string) => number;
  getUserNotifications: (userId?: string) => AppNotification[];
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [
        {
          id: "sys-welcome",
          userId: "all",
          title: "مرحباً بك في أكاديمية أسس",
          message: "نسعد بانضمامك إلينا! تصفح الكورسات والمقالات المتاحة وابدأ رحلة التعلم اليوم.",
          type: "system",
          link: "/courses",
          isRead: false,
          createdAt: new Date().toISOString(),
        },
      ],
      isLoading: false,

      fetchNotifications: async (token: string) => {
        if (!token) return;
        set({ isLoading: true });
        try {
          const res = await authenticatedFetch(API_ENDPOINTS.notifications, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          if (data.success && Array.isArray(data.notifications)) {
            const serverNotifs: AppNotification[] = data.notifications.map((item: any) => ({
              id: item._id || item.id,
              userId: item.recipientId || "all",
              title: item.title,
              message: item.message,
              type: item.type || "system",
              link: item.link || "",
              courseName: item.courseName || "",
              sender: item.sender,
              isRead: Boolean(item.isRead),
              createdAt: item.createdAt || new Date().toISOString(),
            }));

            // Merge server notifications with local system welcome, avoiding duplicates
            const currentNotifs = get().notifications;
            const welcome = currentNotifs.filter((n) => n.id === "sys-welcome");
            const serverIds = new Set(serverNotifs.map((n) => n.id));
            const uniqueCurrent = currentNotifs.filter((n) => n.id !== "sys-welcome" && !serverIds.has(n.id));

            set({
              notifications: [...serverNotifs, ...uniqueCurrent, ...welcome],
              isLoading: false,
            });
          } else {
            set({ isLoading: false });
          }
        } catch (err) {
          console.error("Failed to fetch notifications from server:", err);
          set({ isLoading: false });
        }
      },

      addNotification: (newNotif) => {
        const id = newNotif.id || `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const existing = get().notifications;
        if (existing.some((n) => n.id === id)) {
          return;
        }

        const notifItem: AppNotification = {
          ...newNotif,
          id,
          isRead: false,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          notifications: [notifItem, ...state.notifications],
        }));
      },

      markAsRead: async (id, token) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        }));

        if (token && !id.startsWith("sys-") && !id.startsWith("notif-")) {
          try {
            await authenticatedFetch(`${API_ENDPOINTS.notifications}/${id}/read`, {
              method: "PUT",
              headers: { Authorization: `Bearer ${token}` },
            });
          } catch (e) {
            console.error("Failed to sync markAsRead with server:", e);
          }
        }
      },

      markAllAsRead: async (token) => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        }));

        if (token) {
          try {
            await authenticatedFetch(`${API_ENDPOINTS.notifications}/read-all`, {
              method: "PUT",
              headers: { Authorization: `Bearer ${token}` },
            });
          } catch (e) {
            console.error("Failed to sync markAllAsRead with server:", e);
          }
        }
      },

      deleteNotification: async (id, token) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));

        if (token && !id.startsWith("sys-") && !id.startsWith("notif-")) {
          try {
            await authenticatedFetch(`${API_ENDPOINTS.notifications}/${id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
          } catch (e) {
            console.error("Failed to sync deleteNotification with server:", e);
          }
        }
      },

      clearAll: async (token) => {
        set({ notifications: [] });

        if (token) {
          try {
            await authenticatedFetch(`${API_ENDPOINTS.notifications}/clear-all`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
          } catch (e) {
            console.error("Failed to sync clearAll with server:", e);
          }
        }
      },

      getUnreadCount: (userId) => {
        const notifs = get().notifications;
        return notifs.filter(
          (n) => (!userId || n.userId === userId || n.userId === "all") && !n.isRead
        ).length;
      },

      getUserNotifications: (userId) => {
        const notifs = get().notifications;
        return notifs.filter(
          (n) => !userId || n.userId === userId || n.userId === "all"
        );
      },
    }),
    {
      name: "ossos-notifications-storage",
    }
  )
);
