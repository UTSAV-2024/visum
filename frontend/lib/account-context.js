"use client";

/**
 * The signed-in user's live account state — plan, quota, storage, profile.
 *
 * One fetch, shared by everything that displays real numbers (the sidebar
 * meter, the user card, the upgrade modal). Protected pages deliver it with
 * the page itself; everywhere else it is fetched once per session. Callers
 * hand it the fresh state after a scan or an upgrade, so the UI never shows a
 * stale allowance.
 */
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./auth-context";
import { fetchAccount } from "./api";

// The default shape is what type inference reads, so the no-op signatures have
// to match the real ones.
const AccountContext = createContext({
  /** @type {any} */
  account: null,
  loading: false,
  refresh: async () => /** @type {any} */ (null),
  /** @param {any} _next */
  applyAccount: (_next) => {},
});

/**
 * @param {{children: any, initialAccount?: any}} props
 *   `initialAccount` comes from a protected page's getServerSideProps, so the
 *   first paint already has the real plan and usage.
 */
export function AccountProvider({ children, initialAccount = null }) {
  const { user, loading: authLoading, authEnabled } = useAuth();
  const [account, setAccount] = useState(initialAccount);

  const refresh = useCallback(async () => {
    if (!authEnabled) return null;
    try {
      const next = await fetchAccount();
      setAccount(next);
      return next;
    } catch {
      return null;
    }
  }, [authEnabled]);

  /** Adopt an account snapshot the server already returned (e.g. with a scan). */
  const applyAccount = useCallback((next) => {
    if (next) setAccount(next);
  }, []);

  const userId = user?.id ?? null;

  // Adjust state during render rather than in an effect, so a navigation never
  // paints one frame of the previous page's numbers before correcting itself.
  // (https://react.dev/learn/you-might-not-need-an-effect)
  const [seen, setSeen] = useState({ initialAccount, userId });
  if (seen.initialAccount !== initialAccount || seen.userId !== userId) {
    setSeen({ initialAccount, userId });
    if (initialAccount) {
      // A page that server-rendered the account arrives already correct.
      setAccount(initialAccount);
    } else if (!userId) {
      // Signed out — drop the previous user's figures immediately.
      setAccount(null);
    }
  }

  useEffect(() => {
    if (!authEnabled || authLoading) return;
    // Signed out, or already delivered with the page — nothing to fetch.
    if (!userId || initialAccount) return;
    void refresh();
  }, [authEnabled, authLoading, userId, refresh, initialAccount]);

  // Derived rather than tracked: we're waiting exactly when there's a user but
  // no figures yet. One less piece of state to keep honest.
  const loading = authEnabled && !!userId && !account;

  return (
    <AccountContext.Provider value={{ account, loading, refresh, applyAccount }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  return useContext(AccountContext);
}
