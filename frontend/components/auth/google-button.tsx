"use client";

import { useState } from "react";
import { getSupabaseBrowserClient } from "../../lib/supabase/client";

interface GoogleButtonProps {
  /** Where to land after Google sends the user back. */
  next: string;
  label?: string;
  disabled?: boolean;
  onError?: (message: string) => void;
}

/**
 * Google sign-in.
 *
 * The provider returns to our own /api/auth/callback rather than to a page, so
 * the session is established server-side before anything renders. `next` rides
 * along encoded, which is how a visitor who clicked "Run a scan" gets returned
 * to the scan form instead of dumped on the dashboard.
 */
export function GoogleButton({
  next,
  label = "Continue with Google",
  disabled,
  onError,
}: GoogleButtonProps) {
  const [pending, setPending] = useState(false);

  async function handleClick() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      onError?.("Authentication is not configured yet. Please try again later.");
      return;
    }

    setPending(true);
    const redirectTo = `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(
      next
    )}`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    if (error) {
      setPending(false);
      onError?.(error.message || "Could not start Google sign-in.");
    }
    // On success the browser navigates away — leave the button in its pending
    // state so it can't be clicked twice during the handoff.
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || pending}
      className="inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-secondary/40 px-6 text-sm font-semibold text-foreground transition-all hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M23.06 12.25c0-.85-.08-1.67-.22-2.45H12v4.63h6.2a5.3 5.3 0 0 1-2.3 3.48v2.89h3.72c2.18-2 3.44-4.96 3.44-8.55z"
        />
        <path
          fill="#34A853"
          d="M12 23.5c3.11 0 5.72-1.03 7.62-2.8l-3.72-2.89c-1.03.69-2.35 1.1-3.9 1.1-3 0-5.54-2.02-6.45-4.75H1.7v2.98A11.5 11.5 0 0 0 12 23.5z"
        />
        <path
          fill="#FBBC05"
          d="M5.55 14.16a6.9 6.9 0 0 1 0-4.32V6.86H1.7a11.51 11.51 0 0 0 0 10.28l3.85-2.98z"
        />
        <path
          fill="#EA4335"
          d="M12 4.77c1.69 0 3.21.58 4.4 1.72l3.3-3.3C17.72 1.31 15.11.5 12 .5A11.5 11.5 0 0 0 1.7 6.86l3.85 2.98C6.46 7.11 9 4.77 12 4.77z"
        />
      </svg>
      {pending ? "Redirecting…" : label}
    </button>
  );
}

/** "or" rule used between the Google button and the email form. */
export function AuthDivider() {
  return (
    <div className="my-5 flex items-center gap-3" aria-hidden="true">
      <span className="h-px flex-1 bg-border" />
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
        or
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
