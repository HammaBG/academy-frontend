import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "qa_reply" | "course_activation" | "certificate" | "system";
  link?: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, "id" | "isRead" | "createdAt">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
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

      addNotification: (newNotif) => {
        const notifItem: AppNotification = {
          ...newNotif,
          id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          isRead: false,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          notifications: [notifItem, ...state.notifications],
        }));
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        }));
      },

      deleteNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      clearAll: () => {
        set({ notifications: [] });
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
