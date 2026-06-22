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

function getInitialState() {
  try {
    const stored = sessionStorage.getItem("visum_result");
    if (!stored) return { type: "redirect" };
    const parsed = JSON.parse(stored);
    if (!parsed.result || typeof parsed.result.total_score !== "number") {
      return { type: "error", message: "Invalid scan data received. Please scan again." };
    }
    return { type: "loaded", data: parsed };
  } catch {
    return { type: "error", message: "Failed to load scan results. Please scan again." };
  }
}

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
  const [state] = useState(getInitialState);

  // Only side effects (redirect, tracking) — no setState calls
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
      });
    }
  }, [state, router]);

  if (state.type === "redirect") return null;
  if (state.type === "error") {
    return <ErrorState message={state.message} />;
  }

  const { result } = state.data;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
        {/* Nav */}
        <nav className="flex items-center justify-between mb-6" aria-label="Results navigation">
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

        {/* Score hero — circular score display */}
        <ScoreHero score={result.total_score} url={result.url} />

        {/* Score card — detailed band message */}
        <div className="mt-6">
          <ScoreCard
            score={result.total_score}
            band={result.band}
            message={result.band_message}
          />
        </div>

        {/* Upgrade CTA for low scores */}
        {result.total_score < 85 && (
          <div className="mb-6">
            {result.upgrade_cta ? (
              <LegacyUpgradePrompt cta={result.upgrade_cta} />
            ) : (
              <UpgradeCta />
            )}
          </div>
        )}

        {/* Score Breakdown */}
        <h2 className="text-base sm:text-lg font-bold text-foreground mb-4">
          Score Breakdown
        </h2>

        {/* Detailed check cards for every check */}
        <div className="flex flex-col gap-3">
          {result.checks.map((check, i) => (
            <CheckCard key={`card-${i}`} check={check} />
          ))}
        </div>

        {/* Compact summary list */}
        <details className="mt-6 group">
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
          <div className="mt-3 flex flex-col gap-3">
            {result.checks.map((check, i) => (
              <CheckItem key={`item-${i}`} check={check} />
            ))}
          </div>
        </details>

        {/* Scan time */}
        <p className="text-center text-xs text-muted-foreground/60 mt-6 mb-4">
          Scanned in {(result.scan_time_ms / 1000).toFixed(1)}s
        </p>

        {/* Share */}
        <div className="text-center pb-8">
          <button
            onClick={() => {
              const text = `My site scored ${result.total_score}/100 on Visum's AI Agent Readiness scanner. Is your site visible to ChatGPT and Claude? Check free at visum.io`;
              navigator.clipboard.writeText(text).catch(() => {});
              track("share_clicked", { score: result.total_score });
              alert("Copied to clipboard!");
            }}
            className="bg-primary text-primary-foreground font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Share my score
          </button>
        </div>
      </div>
    </div>
  );
}
