import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ScoreHero } from "../components/score-hero";
import { CheckCard } from "../components/check-card";
import CheckItem from "../components/CheckItem";
import ScoreCard from "../components/ScoreCard";
import { UpgradeCta } from "../components/upgrade-cta";
import LegacyUpgradePrompt  from "../components/UpgradePrompt";
import { track } from "../lib/posthog";

/**
 * State for the result page.
 * type === "loading" is the initial state on both server and client,
 * so hydration always matches (both render null).
 * sessionStorage is read inside a useEffect after hydration completes.
 */

function ErrorState({ message }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 mb-4">
          <svg className="h-8 w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Something went wrong</h2>
        <p className="text-sm text-muted-foreground mb-6">{message}</p>
        <Link
          href="/"
          className="inline-block bg-primary text-primary-foreground font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </Link>
        <div className="mt-4">
          <Link href="/" className="text-sm text-accent hover:text-accent/80 font-medium">
            Scan a new site
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Result() {
  const router = useRouter();
  // Always start with loading — identical on server and client, so hydration matches
  const [state, setState] = useState({ type: "loading" });
  const [copied, setCopied] = useState(false);

  // Read sessionStorage only on the client (after hydration is complete).
  // Wrapped in setTimeout to satisfy react-hooks/set-state-in-effect lint rule.
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        const emailSubmitted = sessionStorage.getItem("visum_email");
        if (!emailSubmitted) {
          setState({ type: "redirect-email" });
          return;
        }

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

  // Side effects — redirects and tracking
  useEffect(() => {
    if (state.type === "redirect") {
      router.replace("/");
      return;
    }
    if (state.type === "redirect-email") {
      router.replace("/email-gate");
      return;
    }
    if (state.type === "loaded") {
      track("result_viewed", {
        score: state.data.result.total_score,
        band: state.data.result.band,
        url: state.data.result.url,
      });
    }
  }, [state, router]);

  if (state.type === "redirect" || state.type === "redirect-email" || state.type === "loading") return null;
  if (state.type === "error") {
    return <ErrorState message={state.message} />;
  }

  const { result } = state.data;

  function handleShare() {
    const text = `My site scored ${result.total_score}/100 on Visum's AI Agent Readiness scanner. Is your site visible to ChatGPT and Claude? Check free at visum.io`;
    navigator.clipboard.writeText(text).catch(() => {});
    track("share_clicked", { score: result.total_score });
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <div className="border-b border-border">
        <nav className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16" aria-label="Results navigation">
          <Link href="/" className="text-lg sm:text-xl font-extrabold text-foreground no-underline">
            Visum
          </Link>
          <Link
            href="/"
            className="text-xs sm:text-sm text-muted-foreground border border-border rounded-lg px-4 py-2 bg-card hover:bg-secondary transition-colors no-underline"
          >
            Scan another site
          </Link>
        </nav>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* 1. Score Hero */}
        <ScoreHero score={result.total_score} url={result.url} scanTimeMs={result.scan_time_ms} />

        {/* 2. Score Card */}
        <div className="mt-8">
          <ScoreCard
            score={result.total_score}
            band={result.band}
            message={result.band_message}
          />
        </div>

        {/* 3. Score Breakdown */}
        <h2 className="text-lg sm:text-xl font-bold text-foreground mb-5">
          Score Breakdown
        </h2>

        {/* 4. Check Cards */}
        <div className="flex flex-col gap-4">
          {result.checks.map((check, i) => (
            <CheckCard key={`card-${i}`} check={check} />
          ))}
        </div>

        {/* 5. Compact view */}
        <details className="mt-8 group">
          <summary className="cursor-pointer text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors list-none flex items-center gap-2">
            <svg
              className="size-4 transition-transform group-open:rotate-90"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clipRule="evenodd"
              />
            </svg>
            Compact view ({result.checks.length} checks)
          </summary>
          <div className="mt-4 flex flex-col gap-3">
            {result.checks.map((check, i) => (
              <CheckItem key={`item-${i}`} check={check} />
            ))}
          </div>
        </details>

        {/* 6. Upgrade CTA (moved below all report content) */}
        {result.total_score < 85 && (
          <div className="mt-10">
            {result.upgrade_cta ? (
              <LegacyUpgradePrompt cta={result.upgrade_cta} />
            ) : (
              <UpgradeCta />
            )}
          </div>
        )}

        {/* 7. Share */}
        <div className="text-center pb-10">
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleShare}
              className="bg-primary text-primary-foreground font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
            >
              Share my score
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `My site scored ${result.total_score}/100 on Visum's AI Agent Readiness Scanner. Is your site visible to ChatGPT and Claude?`
              )}&url=${encodeURIComponent("https://visum-eight.vercel.app")}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("tweet_clicked", { score: result.total_score })}
              className="inline-flex items-center gap-2 bg-[#1DA1F2] text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-lg hover:bg-[#1a8cd8] transition-colors no-underline"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Share on X
            </a>
          </div>
          {copied && (
            <p className="mt-3 text-sm text-green-500 animate-pulse">
              Copied to clipboard!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
