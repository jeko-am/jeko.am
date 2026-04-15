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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const adminCheckRef = useRef<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // Use onAuthStateChange exclusively — Supabase fires INITIAL_SESSION
    // on subscribe, which reads from localStorage without acquiring the
    // internal auth lock. Calling getSession() can deadlock the client
    // on hard refresh, blocking all subsequent REST API calls.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT' || !session?.user) {
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        adminCheckRef.current = null;
        setLoading(false);
      } else {
        // Verify the user completed signup (has a pet_profiles row).
        // Skip this check during the signup callback flow itself.
        const isCallbackPage = typeof window !== 'undefined' && window.location.pathname.startsWith('/auth/callback');
        if (!isCallbackPage && event !== 'USER_UPDATED') {
          const { data: petRow } = await supabase
            .from('pet_profiles')
            .select('user_id')
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (!petRow) {
            // User has no pet profile — incomplete signup. Sign them out.
            await supabase.auth.signOut({ scope: 'local' }).catch(() => {});
            setSession(null);
            setUser(null);
            setIsAdmin(false);
            adminCheckRef.current = null;
            setLoading(false);
            // Redirect to login with error if not already there
            if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth/') && !window.location.pathname.startsWith('/login')) {
              window.location.href = '/login?error=not_signed_up';
            }
            return;
          }
        }

        setSession(session);
        setUser(session.user);
        // Check admin in the background — don't block loading
        checkAdmin(session.user.id).finally(() => {
          if (mounted) setLoading(false);
        });
      }
    });

    // Safety timeout — if onAuthStateChange never fires
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
    // Skip if we already checked this user
    if (adminCheckRef.current === userId) return;
    adminCheckRef.current = userId;
    try {
      const { data } = await supabase
        .from("admin_users")
        .select("role")
        .eq("user_id", userId)
        .eq("is_active", true)
        .maybeSingle();
      setIsAdmin(!!data && ["super_admin", "admin", "editor"].includes(data.role));
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
    // Clear state first so UI updates instantly
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
