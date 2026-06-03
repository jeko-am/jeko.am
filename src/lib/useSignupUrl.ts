import { useAuth } from './auth';
import { useEffect, useState } from 'react';

/**
 * Returns '/profile' when the user is already logged in,
 * otherwise returns the given URL (defaulting to '/auth/signup').
 */
export function useSignupUrl(fallback = '/auth/signup'): string {
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading) return fallback;
  return user ? '/profile' : fallback;
}
