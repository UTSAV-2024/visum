import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { AuthShell } from "../components/auth/auth-shell";
import { GoogleButton, AuthDivider } from "../components/auth/google-button";
import { getSupabaseBrowserClient } from "../lib/supabase/client";
import { isAuthEnabled } from "../lib/config";
import { track } from "../lib/posthog";
import { safeNext } from "../lib/safe-next";

const MIN_PASSWORD = 8;

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  // Carried through sign-up so someone who clicked "Run a scan" lands back on
  // the scan form once their account exists.
  const next = safeNext(router.query.next);

  function validate() {
    if (!email.trim()) return "Email is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return "Enter a valid email address.";
    if (password.length < MIN_PASSWORD)
      return `Password must be at least ${MIN_PASSWORD} characters.`;
    if (password !== confirm) return "Passwords do not match.";
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError("Authentication is not configured yet. Please try again later.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(next)}`
              : undefined,
        },
      });
      if (signUpError) {
        setError(signUpError.message || "Could not create your account.");
        setSubmitting(false);
        return;
      }
      track("signup_success", {});

      // If the project requires email confirmation, there's no session yet.
      if (!data.session) {
        setCheckEmail(true);
        setSubmitting(false);
        return;
      }
      // Auto-confirm enabled → straight into the app.
      router.replace(next);
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  if (checkEmail) {
    return (
      <>
        <Head>
          <title>Confirm your email — Visum</title>
          <meta name="robots" content="noindex" />
        </Head>
        <AuthShell
          title="Check your inbox"
          subtitle={`We sent a confirmation link to ${email.trim()}. Click it to activate your account.`}
          footer={
            <Link href="/login" className="font-medium text-accent hover:underline">
              Back to sign in
            </Link>
          }
        >
          <div className="flex flex-col items-center gap-3 py-2 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
              <svg className="h-6 w-6 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">
              Didn&apos;t get it? Check your spam folder, or{" "}
              <button
                type="button"
                onClick={() => setCheckEmail(false)}
                className="font-medium text-accent hover:underline"
              >
                try a different email
              </button>
              .
            </p>
          </div>
        </AuthShell>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Create your account — Visum</title>
        <meta name="robots" content="noindex" />
      </Head>
      <AuthShell
        title="Create your account"
        subtitle="Start monitoring how AI systems read your site."
        footer={
          <>
            Already have an account?{" "}
            <Link
              href={`/login?next=${encodeURIComponent(next)}`}
              className="font-medium text-accent hover:underline"
            >
              Sign in
            </Link>
          </>
        }
      >
        {!isAuthEnabled && (
          <div className="mb-4 rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
            Authentication isn&apos;t configured on this deployment yet.
          </div>
        )}

        <GoogleButton
          next={next}
          label="Sign up with Google"
          disabled={!isAuthEnabled}
          onError={setError}
        />

        <AuthDivider />

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
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              placeholder={`At least ${MIN_PASSWORD} characters`}
              disabled={submitting}
              className="h-11 w-full rounded-xl border border-border bg-secondary/50 px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div>
            <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium text-foreground">
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
                if (error) setError("");
              }}
              placeholder="Re-enter your password"
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
            {submitting ? "Creating account…" : "Create account"}
          </button>

          <p className="text-center text-[11px] leading-relaxed text-muted-foreground/70">
            By creating an account you agree to our{" "}
            <Link href="/terms" className="hover:underline">Terms</Link> and{" "}
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>.
          </p>
        </form>
      </AuthShell>
    </>
  );
}
