import { useAuth } from './auth';

/**
 * Returns '/profile' when the user is already logged in,
 * otherwise returns the given URL (defaulting to '/auth/signup').
 */
export function useSignupUrl(fallback = '/auth/signup'): string {
  const { user, loading } = useAuth();
  if (loading) return fallback;
  return user ? '/profile' : fallback;
}
