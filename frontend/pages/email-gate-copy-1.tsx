import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Logo } from "../components/logo";
import { track } from "../lib/posthog";

function getScanData() {
  try {
    const stored = sessionStorage.getItem("visum_result");
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (!parsed.result || typeof parsed.result.total_score !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

export default function EmailGate() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [scanData, setScanData] = useState(null);

  // Read scan data on the client only — avoids hydration mismatch from sessionStorage access
  useEffect(() => {
    const data = getScanData();
    if (!data) {
      router.replace("/");
      return;
    }
    // setState in effect is required here because sessionStorage is not available during SSR
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setScanData(data);
    track("email_gate_viewed", {
      url: data.result.url,
      score: data.result.total_score,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Both SSR and initial client render produce null — no hydration mismatch
  if (!scanData) return null;

  const { result } = scanData;

  function validateEmail(value) {
    if (!value.trim()) return "Email is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) return "Please enter a valid email address.";
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = email.trim();

    const validationError = validateEmail(trimmed);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setSaving(true);

    try {
      const saveResponse = await fetch("/api/save-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scan_id: result.scan_id || crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          url: result.url,
          email: trimmed,
          total_score: result.total_score,
          band: result.band,
          checks: result.checks,
          scan_time_ms: result.scan_time_ms || 0,
        }),
      });

      if (!saveResponse.ok) {
        throw new Error("Failed to save");
      }

      track("email_submitted", {
        url: result.url,
        score: result.total_score,
      });

      sessionStorage.setItem("visum_email", "true");
      setSaved(true);

      track("report_unlocked", {
        url: result.url,
        score: result.total_score,
      });

      // Brief success state before redirect
      setTimeout(() => {
        router.push("/result");
      }, 800);
    } catch (err) {
      track("email_submission_failed", {
        url: result.url,
        error: err.message,
      });
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Minimal nav */}
      <div className="border-b border-border">
        <nav className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16" aria-label="Navigation">
          <Link href="/" className="flex items-center gap-2 shrink-0 no-underline">
            <Logo className="h-7 w-7 text-accent" />
            <span className="text-lg font-semibold tracking-tight text-foreground">Visum</span>
          </Link>
        </nav>
      </div>

      {/* Email gate content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Score preview pill */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm text-accent">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              Scan complete — Score: {result.total_score}/100
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance text-foreground">
              Your AI Visibility Report is Ready
            </h1>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed">
              Enter your email to unlock your report and receive a copy.
            </p>
          </div>

          {/* Benefits list */}
          <div className="mb-8 space-y-3">
            {[
              "AI Visibility Score",
              "Failed Checks",
              "Actionable Recommendations",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 text-sm text-muted-foreground">
                <svg className="h-5 w-5 shrink-0 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          {saved ? (
            /* Success state */
            <div className="text-center py-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 mb-4">
                <svg className="h-8 w-8 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-foreground">Your report is unlocked!</p>
              <p className="mt-1 text-sm text-muted-foreground">Redirecting you now...</p>
            </div>
          ) : (
            /* Email form */
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
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
                  disabled={saving}
                  className="h-12 w-full rounded-xl border border-border bg-secondary/50 px-4 text-base text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-60"
                  aria-describedby={error ? "email-error" : undefined}
                  aria-invalid={!!error}
                  autoFocus
                />
                {error && (
                  <p id="email-error" className="mt-1.5 text-sm font-medium text-destructive" role="alert">
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={saving || !email.trim()}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Unlocking...
                  </>
                ) : (
                  "View My Report"
                )}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Your email will never be shared. We&rsquo;ll send you a copy of your report.
          </p>
        </div>
      </main>
    </div>
  );
}
