"use client";

// Auth context: exposes the current Supabase user/session to the whole app and
// keeps it in sync via onAuthStateChange. When auth is not configured
// (isAuthEnabled === false) it resolves to a signed-out, non-loading state so
// the app behaves exactly as it did before auth existed.
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getSupabaseBrowserClient } from "./supabase/client";
import { isAuthEnabled } from "./config";

const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  authEnabled: false,
  signOut: async () => {},
});

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(isAuthEnabled);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      // Auth not configured — settle into a signed-out, non-loading state.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (supabase) await supabase.auth.signOut();
    setSession(null);
  }, []);

  const value = {
    user: session?.user ?? null,
    session,
    loading,
    authEnabled: isAuthEnabled,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
