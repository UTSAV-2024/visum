"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../lib/auth-context";

/**
 * Client-side guard for authenticated app routes. While the session is
 * resolving it shows a lightweight loading state; if there is no user it
 * redirects to /login (preserving the intended destination). When auth is not
 * configured it renders children as-is, so the demo app stays usable.
 */
export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, authEnabled } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authEnabled) return;
    if (loading) return;
    if (!user) {
      const next = encodeURIComponent(router.asPath);
      router.replace(`/login?next=${next}`);
    }
  }, [authEnabled, loading, user, router]);

  // Auth off → behave like before (no gating).
  if (!authEnabled) return <>{children}</>;

  // Resolving session, or about to redirect an unauthenticated visitor.
  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-accent" />
          <p className="text-sm text-muted-foreground">
            {loading ? "Checking your session…" : "Redirecting to sign in…"}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
