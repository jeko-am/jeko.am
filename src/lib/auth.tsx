"use client";

import { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react";
import { supabase } from "./supabase";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: Record<string, unknown>) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: (mode?: 'signup' | 'login') => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAdmin: false,
  loading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

// Cache keys for localStorage — avoids re-querying Supabase on every refresh
const CACHE_KEY_PROFILE = 'jeko-auth-profile-verified';
const CACHE_KEY_ADMIN = 'jeko-auth-admin-role';

function getCachedAuth(userId: string) {
  try {
    const profileRaw = localStorage.getItem(CACHE_KEY_PROFILE);
    const adminRaw = localStorage.getItem(CACHE_KEY_ADMIN);
    const profile = profileRaw ? JSON.parse(profileRaw) : null;
    const admin = adminRaw ? JSON.parse(adminRaw) : null;
    // Only trust cache if it's for the same user
    if (profile?.userId === userId) {
      return {
        profileVerified: profile.verified as boolean,
        isAdmin: admin?.userId === userId ? (admin.isAdmin as boolean) : false,
      };
    }
  } catch { /* ignore corrupt cache */ }
  return null;
}

function setCachedProfile(userId: string, verified: boolean) {
  try { localStorage.setItem(CACHE_KEY_PROFILE, JSON.stringify({ userId, verified })); } catch {}
}

function setCachedAdmin(userId: string, isAdmin: boolean) {
  try { localStorage.setItem(CACHE_KEY_ADMIN, JSON.stringify({ userId, isAdmin })); } catch {}
}

function clearAuthCache() {
  try {
    localStorage.removeItem(CACHE_KEY_PROFILE);
    localStorage.removeItem(CACHE_KEY_ADMIN);
  } catch {}
}

// Read the Supabase session from localStorage synchronously to avoid
// a flash of logged-out UI on hard refresh.
function getInitialAuth(): { user: User | null; session: Session | null; isAdmin: boolean } {
  if (typeof window === 'undefined') return { user: null, session: null, isAdmin: false };
  try {
    // Supabase stores the session under this key
    const raw = localStorage.getItem('sb-dzhtpnskezkrtfinntbi-auth-token');
    if (!raw) return { user: null, session: null, isAdmin: false };
    const parsed = JSON.parse(raw);
    if (!parsed?.user || !parsed?.access_token) return { user: null, session: null, isAdmin: false };
    // Check if token is expired
    if (parsed.expires_at && parsed.expires_at * 1000 < Date.now()) return { user: null, session: null, isAdmin: false };
    const cached = getCachedAuth(parsed.user.id);
    return {
      user: parsed.user as User,
      session: parsed as Session,
      isAdmin: cached?.isAdmin ?? false,
    };
  } catch {
    return { user: null, session: null, isAdmin: false };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const initial = getInitialAuth();
  const [user, setUser] = useState<User | null>(initial.user);
  const [session, setSession] = useState<Session | null>(initial.session);
  const [isAdmin, setIsAdmin] = useState(initial.isAdmin);
  const [loading, setLoading] = useState(!initial.user);
  const adminCheckRef = useRef<string | null>(initial.user?.id ?? null);

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT' || !session?.user) {
        clearAuthCache();
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        adminCheckRef.current = null;
        setLoading(false);
        return;
      }

      const userId = session.user.id;
      const cached = getCachedAuth(userId);

      // ── Fast path: cached and verified → no Supabase queries needed ──
      if (cached && cached.profileVerified) {
        setSession(session);
        setUser(session.user);
        setIsAdmin(cached.isAdmin);
        adminCheckRef.current = userId;
        setLoading(false);
        return;
      }

      // ── Slow path: first login or cache miss → verify profile ──
      const isAuthPage = typeof window !== 'undefined' && (
        window.location.pathname.startsWith('/auth/callback') ||
        window.location.pathname.startsWith('/auth/signup')
      );

      if (!isAuthPage && event !== 'USER_UPDATED') {
        const { data: petRow } = await supabase
          .from('pet_profiles')
          .select('user_id')
          .eq('user_id', userId)
          .maybeSingle();

        if (!petRow) {
          // Quiz data in sessionStorage → redirect to finish signup
          const hasQuizData = typeof sessionStorage !== 'undefined' && !!sessionStorage.getItem('jeko-signup-quiz');
          if (hasQuizData) {
            window.location.href = '/auth/callback/complete?next=signup';
            return;
          }
          // No profile, no quiz → sign out
          clearAuthCache();
          await supabase.auth.signOut({ scope: 'local' }).catch(() => {});
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          adminCheckRef.current = null;
          setLoading(false);
          if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
            window.location.href = '/login?error=not_signed_up';
          }
          return;
        }

        // Profile exists — cache it so we never query again until logout
        setCachedProfile(userId, true);
      }

      setSession(session);
      setUser(session.user);

      // Admin check — use cache or query once
      if (cached && cached.profileVerified) {
        setIsAdmin(cached.isAdmin);
        adminCheckRef.current = userId;
        if (mounted) setLoading(false);
      } else {
        checkAdmin(userId).finally(() => {
          if (mounted) setLoading(false);
        });
      }
    });

    // Safety timeout
    const timeout = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 2000);

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  async function checkAdmin(userId: string) {
    if (adminCheckRef.current === userId) return;
    adminCheckRef.current = userId;
    try {
      const { data } = await supabase
        .from("admin_users")
        .select("role")
        .eq("user_id", userId)
        .eq("is_active", true)
        .maybeSingle();
      const admin = !!data && ["super_admin", "admin", "editor"].includes(data.role);
      setIsAdmin(admin);
      setCachedAdmin(userId, admin);
    } catch {
      setIsAdmin(false);
    }
  }

  async function signInWithGoogle(mode: 'signup' | 'login' = 'signup') {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${mode}`,
      },
    });
  }

  async function signUp(email: string, password: string, metadata?: Record<string, unknown>) {
    const { error } = await supabase.auth.signUp({ email, password, options: { data: metadata } });
    return { error: error as Error | null };
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  }

  async function signOut() {
    clearAuthCache();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    adminCheckRef.current = null;
    try {
      await supabase.auth.signOut({ scope: 'local' });
    } catch {
      // Ignore sign-out errors — state is already cleared
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, loading, signUp, signIn, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
