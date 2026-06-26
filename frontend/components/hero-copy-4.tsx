import { useState, useEffect, useRef } from "react";
import { scanUrl } from "../lib/api";
import { track } from "../lib/posthog";
import { Container } from "./container";

const progressMessages = [
  "Crawling site...",
  "Checking AI bot permissions...",
  "Analysing structured data...",
  "Testing MCP endpoint...",
  "Measuring page speed...",
  "Scoring 8 checks...",
];

function HeroPreviewCard() {
  const checks = [
    { name: "AI Bot Permissions (robots.txt)", pass: true },
    { name: "JSON-LD Structured Data", pass: true },
    { name: "llms.txt File", pass: null },
    { name: "MCP Endpoint", pass: null },
    { name: "JavaScript Rendering", pass: null },
    { name: "Meta Tags & Open Graph", pass: false },
    { name: "Sitemap.xml", pass: false },
    { name: "Page Load Speed", pass: false },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide">AI Visibility Preview</h3>
        <span className="text-[10px] text-muted-foreground">8 checks</span>
      </div>
      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-border">
        <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
          <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted opacity-20" />
            <circle cx="20" cy="20" r="17" fill="none" stroke="url(#hp-grad)" strokeWidth="2" strokeDasharray="48.1 58.7" />
            <defs>
              <linearGradient id="hp-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute text-[10px] font-bold text-foreground">45</span>
        </div>
        <div className="text-left min-w-0">
          <p className="text-xs font-medium text-foreground truncate">Fair — Many Gaps</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Your site needs work</p>
        </div>
      </div>
      <div className="space-y-1.5">
        {checks.map((check) => (
          <div key={check.name} className="flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground truncate mr-2">{check.name}</span>
            <span
              className={
                check.pass === true
                  ? "text-green-500 shrink-0"
                  : check.pass === null
                  ? "text-orange-500 shrink-0"
                  : "text-red-500 shrink-0"
              }
            >
              {check.pass === true ? "PASS" : check.pass === null ? "PART" : "FAIL"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Hero({ onScanStart, onScanEnd }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progressIndex, setProgressIndex] = useState(0);
  const intervalRef = useRef(null);

  // Rotate progress messages every 3.5 seconds while loading
  useEffect(() => {
    // Clear any existing interval when loading state changes
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const id = setTimeout(() => {
      if (!loading) {
        setProgressIndex(0);
        return;
      }
      intervalRef.current = setInterval(() => {
        setProgressIndex((prev) => (prev + 1) % progressMessages.length);
      }, 3500);
    }, 0);
    return () => clearTimeout(id);
  }, [loading]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;

    let parsed;
    try {
      parsed = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    } catch {
      setError("Please enter a valid URL (e.g., https://yourstore.com)");
      return;
    }

    setError("");
    setLoading(true);
    track("scan_initiated", { url: parsed.href });

    if (onScanStart) onScanStart();

    let data;
    try {
      data = await scanUrl(parsed.href);
      track("scan_completed", {
        url: parsed.href,
        score: data.result.total_score,
        band: data.result.band,
      });
      // Store scan data under a pending key — only moved to visum_result after email submission
      sessionStorage.setItem("visum_pending_result", JSON.stringify(data));
    } catch (err) {
      const message = err.message || "Scan failed. Please try again.";
      setError(message);
      track("scan_error", { url: parsed.href, error: message });
    } finally {
      setLoading(false);
    }

    // Navigate to email gate outside try/catch — a navigation error must not mask a successful scan
    if (data && onScanEnd) {
      onScanEnd(data);
    }
  }

  return (
    <section id="scan" className="relative bg-gradient-to-b from-background to-secondary/5 py-24">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="h-full w-full" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-20 items-center">
          {/* Left column: content — 60% */}
          <div className="flex flex-col gap-6">
            <div className="inline-flex self-start rounded-full bg-accent/10 px-3 py-1 text-xs text-accent">
              AI agent readiness scanner
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance text-foreground leading-[1.1]">
              Is your website{" "}
              <span className="text-accent">AI-Ready?</span>
            </h1>

            <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-lg">
              AI assistants and autonomous agents are the new front door to your business. Visum scans your site in
              seconds and shows exactly how machines see, read, and act on it.
            </p>

            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 sm:flex-row">
              <label htmlFor="scan-url" className="sr-only">Website URL</label>
              <div className="relative flex-[2]">
                <input
                  id="scan-url"
                  type="text"
                  inputMode="url"
                  value={url}
                  onChange={(e) => { setUrl(e.target.value); if (error) setError(""); }}
                  placeholder="yourwebsite.com"
                  disabled={loading}
                  className="h-12 w-full rounded-xl border border-border bg-secondary/50 px-4 text-base text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-60"
                  aria-describedby={error ? "scan-error" : undefined}
                  aria-invalid={!!error}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 shrink-0 flex-1 sm:flex-none"
              >
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Scanning...
                  </>
                ) : (
                  "Scan my site"
                )}
              </button>
            </form>

            {loading && (
              <p className="text-sm text-muted-foreground text-center">
                {progressMessages[progressIndex]}
              </p>
            )}

            {error && (
              <p id="scan-error" className="text-sm font-medium text-destructive" role="alert">{error}</p>
            )}

            <p className="text-xs text-muted-foreground">
              Free instant report &middot; No signup required &middot; 8 readiness checks
            </p>
          </div>

          {/* Right column: preview card — 40% */}
          <div className="hidden lg:block justify-self-end w-full max-w-sm">
            <HeroPreviewCard />
          </div>
        </div>
      </Container>
    </section>
  );
}
