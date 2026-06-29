export const createSafeStorage = () => {
  if (typeof window !== 'undefined') {
    return localStorage as any;
  }
  return {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  };
};
