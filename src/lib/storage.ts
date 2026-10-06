export const createSafeStorage = () => {
  return {
    getItem: (name: string) => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(name);
      }
      return null;
    },
    setItem: (name: string, value: string) => {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(name, value);
        } catch (e: any) {
          // If storage quota exceeded (QuotaExceededError), clear large course cache or ignore safely
          console.warn(`[SafeStorage] Failed to setItem for ${name}:`, e?.message || e);
          try {
            // Remove heavy cache entry so the app never crashes
            localStorage.removeItem(name);
          } catch (_) {}
        }
      }
    },
    removeItem: (name: string) => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(name);
      }
    },
  };
};
