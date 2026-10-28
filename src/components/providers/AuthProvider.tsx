"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { useChatStore } from "@/store/chat";
import { useNotificationStore } from "@/store/notification";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { token, user, getProfile, isAuthenticated } = useAuthStore();
  const { initializeSocket, disconnectSocket } = useChatStore();
  const { fetchNotifications } = useNotificationStore();

  useEffect(() => {
    // If we have a token but no user, or just to sync the profile on start
    if (token && !user) {
      getProfile();
    }
  }, [token, user, getProfile]);

  useEffect(() => {
    if (token && isAuthenticated) {
      initializeSocket(token);
      fetchNotifications(token);
    } else if (!isAuthenticated) {
      disconnectSocket();
    }
  }, [token, isAuthenticated, initializeSocket, disconnectSocket, fetchNotifications]);

  return <>{children}</>;
}
