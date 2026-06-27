import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Logo } from "../components/logo";
import { track } from "../lib/posthog";

function getScanData() {
  try {
    const stored = sessionStorage.getItem("visum_pending_result");
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

      // Store scan data under visum_result so the result page can find it
      sessionStorage.setItem("visum_result", JSON.stringify(scanData));
      sessionStorage.setItem("visum_email", "true");
      // Clear the pending data
      sessionStorage.removeItem("visum_pending_result");
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

  // Determine score band styling for teaser
  function getScoreStyles(score) {
    if (score >= 85) return { color: "text-green-500", bg: "bg-green-500/10", ring: "ring-green-500/30", label: "Excellent" };
    if (score >= 65) return { color: "text-accent", bg: "bg-accent/10", ring: "ring-accent/30", label: "Good" };
    if (score >= 40) return { color: "text-orange-500", bg: "bg-orange-500/10", ring: "ring-orange-500/30", label: "Fair" };
    return { color: "text-red-500", bg: "bg-red-500/10", ring: "ring-red-500/30", label: "Poor" };
  }

  const scoreStyles = getScoreStyles(result.total_score);

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

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {saved ? (
            /* Success state — reveal report content on email gate */
            <div className="transition-all duration-500">
              <div className="text-center mb-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 mb-4">
                  <svg className="h-8 w-8 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-foreground">Report Unlocked!</h2>
              </div>

              {/* Revealed score */}
              <div className={`${scoreStyles.bg} rounded-xl p-5 mb-4 ring-1 ${scoreStyles.ring} border border-border text-center`}>
                <div className={`text-5xl font-extrabold ${scoreStyles.color}`}>
                  {result.total_score}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">out of 100</div>
                <div className={`text-base font-semibold mt-1 ${scoreStyles.color}`}>
                  {result.band || scoreStyles.label}
                </div>
              </div>

              {/* Revealed check summary */}
              <div className="rounded-xl border border-border bg-card p-4 mb-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Check Results</h3>
                <div className="flex flex-col gap-2">
                  {result.checks.slice(0, 4).map((check, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground truncate mr-2">{check.name}</span>
                      <span className={
                        check.passed
                          ? "text-green-500 font-semibold shrink-0"
                          : check.partial
                          ? "text-orange-500 font-semibold shrink-0"
                          : "text-red-500 font-semibold shrink-0"
                      }>
                        {check.passed ? "PASS" : check.partial ? "PART" : "FAIL"}
                      </span>
                    </div>
                  ))}
                </div>
                {result.checks.length > 4 && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">+{result.checks.length - 4} more checks</p>
                )}
              </div>

              <div className="text-center">
                <Link
                  href="/result"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 no-underline"
                >
                  View Full Report
                  <svg className="size-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </Link>
                <p className="mt-3 text-xs text-muted-foreground">Redirecting to full report in a moment...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Scan complete state with score teaser */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-500 mb-4">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  Scan Complete
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance text-foreground">
                  Your AI Readiness Report is Ready
                </h1>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Unlock the full report to see detailed findings and recommendations.
                </p>
              </div>

              {/* Score teaser — visible but simple */}
              <div className={`${scoreStyles.bg} rounded-xl p-5 mb-6 ring-1 ${scoreStyles.ring} border border-border text-center`}>
                <div className={`text-4xl font-extrabold ${scoreStyles.color}`}>
                  {result.total_score}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">out of 100</div>
                <div className={`text-sm font-semibold mt-1 ${scoreStyles.color}`}>
                  {result.band || scoreStyles.label}
                </div>
              </div>

              {/* Blurred preview — shows results are detailed but gated */}
              <div className="relative mb-6 overflow-hidden rounded-xl border border-border bg-card">
                <div className="p-5 space-y-3 blur-sm select-none">
                  <div className="h-4 w-2/3 rounded bg-muted/30" />
                  <div className="h-3 w-full rounded bg-muted/20" />
                  <div className="h-3 w-5/6 rounded bg-muted/20" />
                  <div className="h-3 w-4/6 rounded bg-muted/20" />
                  <div className="mt-3 flex gap-2">
                    <div className="h-8 w-20 rounded-lg bg-muted/30" />
                    <div className="h-8 w-20 rounded-lg bg-muted/30" />
                  </div>
                </div>
                {/* Blur overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/5 to-background/40" />
              </div>

              {/* Email form */}
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
                    "Unlock My Full Report"
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-xs text-muted-foreground">
                Your email will never be shared. We&rsquo;ll send you a copy of your report.
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
