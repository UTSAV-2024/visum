import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { AuthShell } from "../components/auth/auth-shell";
import { getSupabaseBrowserClient } from "../lib/supabase/client";
import { isAuthEnabled } from "../lib/config";
import { track } from "../lib/posthog";

function safeNext(next) {
  // Only allow same-origin relative paths — never an absolute/external URL.
  if (typeof next !== "string") return "/dashboard";
  if (!next.startsWith("/") || next.startsWith("//")) return "/dashboard";
  return next;
}

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError("Authentication is not configured yet. Please try again later.");
      return;
    }

    setSubmitting(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) {
        setError(signInError.message || "Could not sign you in. Check your details.");
        setSubmitting(false);
        return;
      }
      track("login_success", {});
      router.replace(safeNext(router.query.next));
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <>
      <Head>
        <title>Sign in — Visum</title>
        <meta name="robots" content="noindex" />
      </Head>
      <AuthShell
        title="Welcome back"
        subtitle="Sign in to your Visum dashboard."
        footer={
          <>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-accent hover:underline">
              Create one
            </Link>
          </>
        }
      >
        {!isAuthEnabled && (
          <div className="mb-4 rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
            Authentication isn&apos;t configured on this deployment yet.
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              placeholder="you@example.com"
              disabled={submitting}
              className="h-11 w-full rounded-xl border border-border bg-secondary/50 px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-60"
              autoFocus
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              placeholder="••••••••"
              disabled={submitting}
              className="h-11 w-full rounded-xl border border-border bg-secondary/50 px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {error && (
            <p className="text-sm font-medium text-destructive" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !isAuthEnabled}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </AuthShell>
    </>
  );
}
