import { useState, useEffect, useRef } from "react";
import { scanUrl } from "../lib/api";
import { track } from "../lib/posthog";
import { Container } from "./container";

const progressMessages = [
  { message: "Crawling site...", pct: 15 },
  { message: "Checking AI bot permissions...", pct: 30 },
  { message: "Analysing structured data...", pct: 45 },
  { message: "Testing MCP endpoint...", pct: 60 },
  { message: "Measuring page speed...", pct: 75 },
  { message: "Scoring 8 checks...", pct: 90 },
];

const aiFacts = [
  "Most websites do not expose llms.txt.",
  "AI agents cannot reliably read JavaScript-only content.",
  "Structured data helps AI understand your website.",
  "A well-formed sitemap.xml is essential for AI crawlers.",
  "Robots.txt directives directly control AI bot access.",
  "Semantic HTML improves machine readability.",
];

const exampleUrls = [
  "anthropic.com",
  "shopify.com",
  "woocommerce.com",
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
  const [factIndex, setFactIndex] = useState(0);
  const intervalRef = useRef(null);
  const factIntervalRef = useRef(null);

  // Rotate progress messages every 3.5 seconds while loading
  useEffect(() => {
    // Clear any existing interval when loading state changes
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (factIntervalRef.current) {
      clearInterval(factIntervalRef.current);
      factIntervalRef.current = null;
    }

    const id = setTimeout(() => {
      if (!loading) {
        setProgressIndex(0);
        setFactIndex(0);
        return;
      }
      intervalRef.current = setInterval(() => {
        setProgressIndex((prev) => (prev + 1) % progressMessages.length);
      }, 3500);
      factIntervalRef.current = setInterval(() => {
        setFactIndex((prev) => (prev + 1) % aiFacts.length);
      }, 5000);
    }, 0);
    return () => clearTimeout(id);
  }, [loading]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (factIntervalRef.current) {
        clearInterval(factIntervalRef.current);
      }
    };
  }, []);

  function handleExampleClick(example) {
    setUrl(example);
    if (error) setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Please enter a website URL");
      return;
    }

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
      {/* Grid background — pointer-events-none so it doesn't intercept clicks on the form/button */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
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
              AI visibility scanner
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance text-foreground leading-[1.1]">
              See Your AI{" "}
              <span className="text-accent">Visibility Score.</span>
              <br />
              Fix It in 10 Minutes.
            </h1>

            <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-lg">
              Find out why ChatGPT, Claude, Perplexity, and AI agents ignore your website&mdash;and get actionable fixes instantly.
            </p>

            <form onSubmit={handleSubmit} noValidate className="flex w-full flex-col gap-3 sm:flex-row">
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
                disabled={loading}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 shrink-0 flex-1 sm:flex-none cursor-pointer"
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
                  "Scan My Website"
                )}
              </button>
            </form>

            {/* Example URLs */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-muted-foreground">
              <span className="font-medium">Try:</span>
              {exampleUrls.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => handleExampleClick(example)}
                  disabled={loading}
                  aria-label={`Try scanning ${example}`}
                  className="cursor-pointer border-0 bg-transparent px-0 py-0 text-xs text-accent underline underline-offset-2 decoration-accent/40 hover:decoration-accent transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {example}
                </button>
              ))}
            </div>

            {loading && (
              <div className="flex flex-col gap-3">
                {/* Progress bar */}
                <div className="w-full">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-muted-foreground">{progressMessages[progressIndex].message}</span>
                    <span className="text-xs font-mono text-muted-foreground">{progressMessages[progressIndex].pct}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-accent to-brand-400 transition-all duration-700 ease-out"
                      style={{ width: `${progressMessages[progressIndex].pct}%` }}
                      role="progressbar"
                      aria-valuenow={progressMessages[progressIndex].pct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Scan progress"
                    />
                  </div>
                </div>
                {/* AI fact */}
                <p className="text-xs text-muted-foreground/60 italic text-center">
                  Did you know? {aiFacts[factIndex]}
                </p>
              </div>
            )}

            {error && (
              <p id="scan-error" className="text-sm font-medium text-destructive" role="alert">{error}</p>
            )}

            {/* Secondary CTA */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setUrl("anthropic.com");
                  if (error) setError("");
                  // Scroll to scanner and focus
                  const input = document.getElementById("scan-url");
                  if (input) {
                    input.scrollIntoView({ behavior: "smooth", block: "center" });
                    requestAnimationFrame(() => {
                      input.focus({ preventScroll: true });
                    });
                  }
                }}
                className="inline-flex items-center gap-2 text-xs text-muted-foreground border border-border rounded-lg px-4 py-2 hover:bg-secondary transition-colors cursor-pointer bg-transparent"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 002 4.25v2.5A2.25 2.25 0 004.25 9h2.5A2.25 2.25 0 009 6.75v-2.5A2.25 2.25 0 006.75 2h-2.5zm0 9A2.25 2.25 0 002 13.25v2.5A2.25 2.25 0 004.25 18h2.5A2.25 2.25 0 009 15.75v-2.5A2.25 2.25 0 006.75 11h-2.5zm9-9A2.25 2.25 0 0011 4.25v2.5A2.25 2.25 0 0013.25 9h2.5A2.25 2.25 0 0018 6.75v-2.5A2.25 2.25 0 0015.75 2h-2.5zm0 9A2.25 2.25 0 0011 13.25v2.5A2.25 2.25 0 0013.25 18h2.5A2.25 2.25 0 0018 15.75v-2.5A2.25 2.25 0 0015.75 11h-2.5z" clipRule="evenodd" />
                </svg>
Try an example
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
              {[
                { text: "Free scan", icon: "check" },
                { text: "No signup required to start", icon: "check" },
                { text: "Results in ~20 seconds", icon: "clock" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
                  {item.icon === "check" ? (
                    <svg className="h-3.5 w-3.5 shrink-0 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
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
