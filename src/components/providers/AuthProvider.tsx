"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { token, user, getProfile } = useAuthStore();

  useEffect(() => {
    // If we have a token but no user, or just to sync the profile on start
    if (token && !user) {
      getProfile();
    }
  }, []); // Only run once on mount

  return <>{children}</>;
}
