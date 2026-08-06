import { useAuthStore } from '@/store/auth';

/**
 * A wrapper around the native fetch API that automatically checks for 
 * 401 Unauthorized responses to trigger a logout and clear the expired token.
 */
export async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const res = await fetch(url, options);
  
  if (res.status === 401) {
    // If the request gets an Unauthorized response, token is invalid/expired.
    // We clear the store session so that the UI updates and redirects to login.
    useAuthStore.getState().logout();
  }
  
  return res;
}
