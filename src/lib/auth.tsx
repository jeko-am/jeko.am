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

    // Simple timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (mounted) {
        setLoading(false);
      }
    }, 1000); // 1 second timeout

    async function initializeAuth() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (mounted) {
          if (error || !session) {
            setSession(null);
            setUser(null);
            setIsAdmin(false);
          } else {
            setSession(session);
            setUser(session.user);
            await checkAdmin(session.user.id);
          }
          setLoading(false);
        }
      } catch {
        if (mounted) {
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
        }
      } finally {
        clearTimeout(timeout);
      }
    }

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        adminCheckRef.current = null;
      } else if (session?.user) {
        setSession(session);
        setUser(session.user);
        await checkAdmin(session.user.id);
      } else {
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        adminCheckRef.current = null;
      }
    });

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
