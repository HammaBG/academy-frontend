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
        localStorage.setItem(name, value);
      }
    },
    removeItem: (name: string) => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(name);
      }
    },
  };
};
