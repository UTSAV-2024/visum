import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ScanHeader } from "../components/scan-results/scan-header";
import { ScoreSection } from "../components/scan-results/score-section";
import { StatsStrip } from "../components/scan-results/stats-strip";
import { TabGroup } from "../components/scan-results/tab-group";
import { IssuesSection } from "../components/scan-results/issues-section";
import { SectionGroup } from "../components/scan-results/section-group";
import { ExplanationPanel } from "../components/scan-results/explanation-panel";
import { Timeline } from "../components/scan-results/timeline";
import { ScanResultsSkeleton } from "../components/scan-results/loading-skeleton";
import { cn } from "../lib/utils";
import { track, getScoreBucket } from "../lib/analytics";

// ── Check categorization helpers ────────────────────────────────

const PERFORMANCE_CHECKS = ["Page Load Speed"];
const SEO_CHECKS = ["Meta Tags and Open Graph", "Sitemap.xml"];
const AI_VISIBILITY_CHECKS = ["AI Bot Permissions (robots.txt)", "JSON-LD Structured Data", "llms.txt File", "MCP Endpoint", "JavaScript Rendering"];

function categorizeChecks(checks) {
  return {
    performance: checks.filter((c) => PERFORMANCE_CHECKS.includes(c.name)),
    seo: checks.filter((c) => SEO_CHECKS.includes(c.name)),
    aiVisibility: checks.filter((c) => AI_VISIBILITY_CHECKS.includes(c.name)),
  };
}

// ── Error State ─────────────────────────────────────────────────

function ErrorState({ message }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 mb-4">
          <svg className="h-8 w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Something went wrong</h2>
        <p className="text-sm text-muted-foreground mb-6">{message}</p>
        <Link href="/" className="inline-block bg-primary text-primary-foreground font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-colors no-underline">
          Try Again
        </Link>
        <div className="mt-4">
          <Link href="/" className="text-sm text-accent hover:text-accent/80 font-medium no-underline">
            Scan a new site
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Email Capture ───────────────────────────────────────────────

function EmailCapture({ result }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) { setError("Enter your email."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/save-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scan_id: result.scan_id || crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          url: result.url, email: trimmed,
          total_score: result.total_score, band: result.band,
          checks: result.checks,
          scan_time_ms: result.scan_time_ms || 0,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSaved(true);
      track("email_captured", { url: result.url, score: result.total_score, source: "result_page" });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (saved) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 mb-3">
          <svg className="h-6 w-6 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-foreground">Report Saved</h3>
        <p className="text-xs text-muted-foreground mt-1">We'll send your report and future monitoring updates to your email.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-foreground">Save Your Report</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Get premium features — free. Save reports, weekly monitoring, PDF export.</p>
        </div>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0">
          <input
            type="email" value={email}
            onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
            placeholder="you@example.com" disabled={saving}
            className="h-9 w-full sm:w-48 rounded-lg border border-border bg-secondary/50 px-3 text-xs text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent"
            aria-invalid={!!error}
          />
          <button
            type="submit" disabled={saving || !email.trim()}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-60"
          >
            {saving ? (
              <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : "Save"}
          </button>
          {error && <p className="w-full text-xs font-medium text-destructive" role="alert">{error}</p>}
        </form>
      </div>
    </div>
  );
}

// ── Section icons ───────────────────────────────────────────────

const SECTION_ICONS = {
  performance: (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
    </svg>
  ),
  seo: (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5z" clipRule="evenodd" />
    </svg>
  ),
  aiVisibility: (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 1a4.5 4.5 0 00-4.5 4.5v2.5a2 2 0 00-2 2v4a2 2 0 002 2h9a2 2 0 002-2v-4a2 2 0 00-2-2v-2.5A4.5 4.5 0 0010 1zm-2.5 7V5.5a2.5 2.5 0 015 0V8h-5z" />
    </svg>
  ),
};

// ── Main Page ───────────────────────────────────────────────────

export default function Result() {
  const router = useRouter();
  const [state, setState] = useState({ type: "loading" });
  const [activeTab, setActiveTab] = useState("issues");
  const [copied, setCopied] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Read sessionStorage only on client
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        const stored = sessionStorage.getItem("visum_result");
        if (!stored) {
          setState({ type: "redirect" });
          return;
        }
        const parsed = JSON.parse(stored);
        if (!parsed.result || typeof parsed.result.total_score !== "number") {
          setState({ type: "error", message: "Invalid scan data received. Please scan again." });
          return;
        }
        setState({ type: "loaded", data: parsed });
      } catch {
        setState({ type: "error", message: "Failed to load scan results. Please scan again." });
      }
    }, 0);
    return () => clearTimeout(id);
  }, []);

  // Side effects
  useEffect(() => {
    if (state.type === "redirect") {
      router.replace("/");
      return;
    }
    if (state.type === "loaded") {
      track("result_viewed", {
        score: state.data.result.total_score,
        band: state.data.result.band,
        url: state.data.result.url,
        score_bucket: getScoreBucket(state.data.result.total_score),
      });
    }
  }, [state, router]);

  const handleScanAgain = useCallback(() => {
    track("scan_again_clicked", { from: "result" });
    router.push("/");
  }, [router]);

  if (state.type === "redirect" || state.type === "loading") return null;
  if (state.type === "error") return <ErrorState message={state.message} />;

  const { result } = state.data;
  const categories = categorizeChecks(result.checks);
  const totalFailed = result.checks.filter((c) => !c.passed && !c.partial).length;
  const totalWarnings = result.checks.filter((c) => c.partial).length;

  const checkCounts = {
    total: result.checks.length,
    passed: result.checks.filter((c) => c.passed).length,
    failed: totalFailed,
    warnings: totalWarnings,
  };

  function handleShare() {
    const text = `My site scored ${result.total_score}/100 on Visum's AI Agent Readiness scanner. Is your site visible to ChatGPT and Claude? Check free at visum.io`;
    navigator.clipboard.writeText(text).catch(() => {});
    track("share_clicked", { score: result.total_score });
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function handleCopySummary() {
    const failing = result.checks.filter((c) => !c.passed).slice(0, 3);
    const summary = [
      `AI Readiness Score: ${result.total_score}`,
      `Band: ${result.band}`,
      `Top Issues:`,
      ...failing.map((c) => `* ${c.name}`),
      "",
      "Generated by Visum",
    ].join("\n");
    navigator.clipboard.writeText(summary).catch(() => {});
    track("copy_summary_clicked", { score: result.total_score });
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "issues":
        return <IssuesSection checks={result.checks} />;

      case "checks":
        return (
          <div className="space-y-4">
            <ExplanationPanel checkName={result.checks[0]?.name} className="lg:hidden" />
            {result.checks.map((check, idx) => (
              <SectionGroup
                key={check.name}
                title={check.name}
                checks={[check]}
                icon={<span className="text-[10px] font-mono font-bold">{idx + 1}</span>}
              />
            ))}
          </div>
        );

      case "performance":
        return (
          <div className="space-y-4">
            <SectionGroup title="Performance" checks={categories.performance} icon={SECTION_ICONS.performance} />
            {categories.performance[0] && <ExplanationPanel checkName={categories.performance[0].name} />}
            <Timeline scanTimeMs={result.scan_time_ms} />
          </div>
        );

      case "seo":
        return (
          <div className="space-y-4">
            <SectionGroup title="SEO" checks={categories.seo} icon={SECTION_ICONS.seo} />
            {categories.seo.map((c) => (
              <ExplanationPanel key={c.name} checkName={c.name} />
            ))}
          </div>
        );

      case "ai-visibility":
        return (
          <div className="space-y-4">
            <SectionGroup title="AI Visibility" checks={categories.aiVisibility} icon={SECTION_ICONS.aiVisibility} />
            {categories.aiVisibility.map((c) => (
              <ExplanationPanel key={c.name} checkName={c.name} />
            ))}
          </div>
        );

      default:
        return <IssuesSection checks={result.checks} />;
    }
  };

  return (
    <>
      <Head>
        <title>Scan Results — Visum</title>
        <meta name="description" content={`AI Readiness scan results for ${result.url}. Score: ${result.total_score}/100.`} />
      </Head>

      <div>
        {/* ── Main ──────────────────────────────────────────────── */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-8">
          <div className="animate-fadeIn space-y-4 sm:space-y-6">
            {/* Scan Header */}
            <ScanHeader
              url={result.url}
              score={result.total_score}
              scanTimeMs={result.scan_time_ms}
              onScanAgain={handleScanAgain}
            />

            {/* Score Section */}
            <ScoreSection
              score={result.total_score}
              url={result.url}
              checks={result.checks}
            />

            {/* Stats Strip */}
            <StatsStrip checks={result.checks} />

            {/* Tab Navigation */}
            <TabGroup
              activeTab={activeTab}
              onTabChange={setActiveTab}
              checkCounts={checkCounts}
              className="mt-2"
            />

            {/* Tab Content */}
            <div className="min-h-[200px]">
              {renderTabContent()}
            </div>

            {/* Passed Checks (collapsible) */}
            {result.checks.filter((c) => c.passed).length > 0 && (
              <details className="group rounded-2xl border border-border bg-card overflow-hidden">
                <summary className="flex cursor-pointer items-center justify-between px-5 py-3 text-sm font-semibold text-foreground list-none hover:bg-muted/10 transition-colors">
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    Passed Checks ({result.checks.filter((c) => c.passed).length})
                  </span>
                  <svg className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 space-y-3">
                  {result.checks.filter((c) => c.passed).map((check) => (
                    <div key={check.name} className="flex items-center gap-3 rounded-xl bg-green-500/5 border border-green-500/10 px-4 py-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground">{check.name}</p>
                        {check.finding && (
                          <p className="text-[10px] text-muted-foreground mt-0.5">{check.finding}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            )}

            {/* Email capture */}
            <EmailCapture result={result} />

            {/* Bottom actions */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pb-8">
              {/* Download Report */}
              <button
                onClick={() => {
                  track("report_downloaded", { format: "pdf", score: result.total_score });
                  window.print();
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted/20 transition-all"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                  <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                </svg>
                Download PDF
              </button>
              <button
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted/20 transition-all"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
                  <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
                </svg>
                {copiedSummary ? "Copied!" : "Copy Summary"}
              </button>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 4.5a2.5 2.5 0 11.702 1.737L6.97 9.604a2.518 2.518 0 010 .792l6.733 3.367a2.5 2.5 0 11-.671 1.341l-6.733-3.367a2.5 2.5 0 110-3.475l6.733-3.366A2.5 2.5 0 0113 4.5z" />
                </svg>
                {copied ? "Copied!" : "Share Score"}
              </button>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  `My site scored ${result.total_score}/100 on Visum's AI Agent Readiness Scanner. Is your site visible to ChatGPT and Claude?`
                )}&url=${encodeURIComponent("https://visum-eight.vercel.app")}`}
                target="_blank" rel="noopener noreferrer"
                onClick={() => track("tweet_clicked", { score: result.total_score })}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#1DA1F2] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#1a8cd8] transition-all no-underline"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Share on X
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
