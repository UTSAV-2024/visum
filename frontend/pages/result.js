import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ScoreHero } from "../components/score-hero";
import { CheckCard } from "../components/check-card";
import CheckItem from "../components/CheckItem";
import ScoreCard from "../components/ScoreCard";
import { UpgradeCta } from "../components/upgrade-cta";
import LegacyUpgradePrompt  from "../components/UpgradePrompt";
import { AIVisibilitySummary } from "../components/ai-visibility-summary";
import { AIVisibilityJourney } from "../components/ai-visibility-journey";
import { PriorityFixRoadmap } from "../components/priority-fix-roadmap";
import { ScoreImprovement } from "../components/score-improvement";
import { WhatThisMeans } from "../components/what-this-means";
import { AiAgentCompatibility } from "../components/ai-agent-compatibility";
import { ScanConfidence } from "../components/scan-confidence";
import { IndustryBenchmarking } from "../components/industry-benchmarking";
import { RadarChart } from "../components/radar-chart";
import { DoNothingConsequences } from "../components/do-nothing-consequences";
import { SuccessStories } from "../components/success-stories";
import { ExecutiveSummary } from "../components/executive-summary";
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

  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClick(e) {
      if (!e.target.closest('[data-dropdown="download"]')) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [dropdownOpen]);

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

  function generateReportContent(format) {
    const checks = result.checks;
    const siteUrl = result.url;
    const score = result.total_score;
    const band = result.band;
    const scanTime = result.scan_time_ms ? (result.scan_time_ms / 1000).toFixed(1) : "N/A";

    const formatDate = () => new Date().toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });

    if (format === "md") {
      return [
        `# AI Readiness Report: ${siteUrl}`,
        ``,
        `**Date:** ${formatDate()}  `,
        `**Score:** ${score}/100 — ${band}  `,
        `**Scan Time:** ${scanTime}s  `,
        ``,
        `---`,
        ``,
        `## Score Breakdown`,
        ``,
        ...checks.map((c) => {
          const status = c.passed ? "✅ PASS" : c.partial ? "⚠️ PART" : "❌ FAIL";
          const pct = Math.round((c.score / c.max_score) * 100);
          return [
            `### ${c.name}`,
            `- **Status:** ${status}`,
            `- **Score:** ${c.score}/${c.max_score} (${pct}%)`,
            c.finding ? `- **Finding:** ${c.finding}` : null,
            !c.passed && c.fix ? `- **Recommendation:** ${c.fix}` : null,
            ``,
          ].filter(Boolean).join("\n");
        }),
        `---`,
        ``,
        `*Report generated by [Visum](https://visum.io) — AI Agent Readiness Scanner*`,
        ``,
      ].join("\n");
    }

    if (format === "doc") {
      const rows = checks.map((c) => {
        const status = c.passed ? "PASS" : c.partial ? "PART" : "FAIL";
        const pct = Math.round((c.score / c.max_score) * 100);
        return `<tr>
          <td style="padding:8px 12px;border:1px solid #ddd;">${c.name}</td>
          <td style="padding:8px 12px;border:1px solid #ddd;text-align:center;"><strong>${status}</strong></td>
          <td style="padding:8px 12px;border:1px solid #ddd;text-align:center;">${c.score}/${c.max_score} (${pct}%)</td>
          <td style="padding:8px 12px;border:1px solid #ddd;">${c.finding || "-"}</td>
        </tr>`;
      }).join("\n");

      return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>AI Readiness Report - ${siteUrl}</title>
<style>
body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 900px; margin: 40px auto; padding: 20px; color: #333; }
h1 { color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 10px; }
h2 { color: #444; margin-top: 30px; }
.score { font-size: 48px; font-weight: bold; color: #7c3aed; }
.badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-weight: 600; font-size: 14px; }
table { width: 100%; border-collapse: collapse; margin-top: 20px; }
th { background: #f5f3ff; padding: 10px 12px; border: 1px solid #ddd; text-align: left; font-weight: 600; }
.footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #888; }
</style>
</head>
<body>
<h1>AI Readiness Report</h1>
<p><strong>Site:</strong> ${siteUrl}</p>
<p><strong>Date:</strong> ${formatDate()}</p>
<p><strong>Scan Time:</strong> ${scanTime}s</p>

<div style="background:#f5f3ff;border-radius:12px;padding:20px;text-align:center;margin:20px 0;">
  <div class="score">${score}<span style="font-size:18px;color:#888;">/100</span></div>
  <div style="font-size:18px;font-weight:600;color:#7c3aed;margin-top:4px;">${band}</div>
</div>

<h2>Score Breakdown</h2>
<table>
<thead>
<tr><th>Check</th><th>Status</th><th>Score</th><th>Finding</th></tr>
</thead>
<tbody>
${rows}
</tbody>
</table>

${checks.filter(c => !c.passed && c.fix).length > 0 ? `
<h2>Recommendations</h2>
<ul>
${checks.filter(c => !c.passed && c.fix).map(c => `<li><strong>${c.name}:</strong> ${c.fix}</li>`).join("\n")}
</ul>` : ""}

<div class="footer">
  Report generated by <a href="https://visum.io">Visum</a> — AI Agent Readiness Scanner
</div>
</body>
</html>`;
    }

    // PDF — generate HTML optimized for print
    const pdfChecks = checks.map((c) => {
      const status = c.passed ? "PASS" : c.partial ? "PART" : "FAIL";
      const pct = Math.round((c.score / c.max_score) * 100);
      return `<tr>
        <td style="padding:6px 10px;border:1px solid #ccc;">${c.name}</td>
        <td style="padding:6px 10px;border:1px solid #ccc;text-align:center;"><strong>${status}</strong></td>
        <td style="padding:6px 10px;border:1px solid #ccc;text-align:center;">${c.score}/${c.max_score}</td>
        <td style="padding:6px 10px;border:1px solid #ccc;">${c.finding || "-"}</td>
      </tr>`;
    }).join("\n");

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>AI Readiness Report - ${siteUrl}</title>
<style>
@media print { @page { margin: 20mm; } body { font-family: 'Segoe UI', Arial, sans-serif; color: #222; } }
body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
h1 { color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 8px; font-size: 24px; }
.score { font-size: 42px; font-weight: bold; color: #7c3aed; text-align: center; }
table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
th { background: #f0f0f0; padding: 8px 10px; border: 1px solid #ccc; text-align: left; }
td { padding: 6px 10px; border: 1px solid #ccc; }
.footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 11px; color: #888; text-align: center; }
.badge { font-size: 16px; font-weight: 600; color: #7c3aed; text-align: center; margin-bottom: 20px; }
.section-title { font-size: 18px; font-weight: bold; margin-top: 24px; margin-bottom: 8px; color: #444; }
.meta { font-size: 13px; color: #666; margin-bottom: 4px; }
.reco { margin: 4px 0; padding: 6px 10px; background: #fafafa; border-left: 3px solid #7c3aed; font-size: 13px; }
</style>
</head>
<body>
<h1>AI Readiness Report</h1>
<p class="meta"><strong>Site:</strong> ${siteUrl}</p>
<p class="meta"><strong>Date:</strong> ${formatDate()}</p>
<p class="meta"><strong>Scan Time:</strong> ${scanTime}s</p>

<div class="score">${score}<span style="font-size:16px;color:#888;"> / 100</span></div>
<div class="badge">${band}</div>

<div class="section-title">Score Breakdown</div>
<table>
<thead><tr><th>Check</th><th>Status</th><th>Score</th><th>Finding</th></tr></thead>
<tbody>${pdfChecks}</tbody>
</table>

${checks.filter(c => !c.passed && c.fix).length > 0 ? `
<div class="section-title">Recommendations</div>
${checks.filter(c => !c.passed && c.fix).map(c => `<div class="reco"><strong>${c.name}:</strong> ${c.fix}</div>`).join("\n")}` : ""}

<div class="footer">
  Report generated by Visum — AI Agent Readiness Scanner (visum.io)
</div>
</body>
</html>`;
  }

  function handleDownload(format) {
    const content = generateReportContent(format);
    const siteHostname = (() => {
      try { return new URL(result.url).hostname; } catch { return "report"; }
    })();
    const filename = `visum-report-${siteHostname}-${Date.now()}`;
    setDropdownOpen(false);

    if (format === "pdf") {
      // Open print-friendly view in a new window
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert("Please allow pop-ups to download the PDF report.");
        return;
      }
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.focus();
      // Wait for fonts to load then print
      setTimeout(() => {
        printWindow.print();
      }, 500);
      track("report_downloaded", { format: "pdf", score: result.total_score });
      return;
    }

    const mimeTypes = {
      md: "text/markdown",
      doc: "application/msword",
    };
    const ext = format === "doc" ? ".doc" : ".md";
    const blob = new Blob([content], { type: mimeTypes[format] });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename + ext;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    track("report_downloaded", { format, score: result.total_score });
  }

  function handleCopySummary() {
    // Get top 3 failed/partial checks
    const failingChecks = result.checks
      .filter((c) => !c.passed)
      .slice(0, 3);

    const summary = [
      `AI Readiness Score: ${result.total_score}`,
      `Band: ${result.band}`,
      `Top Issues:`,
      ...failingChecks.map((c) => `* ${c.name}`),
      "",
      "Generated by Visum",
    ].join("\n");

    navigator.clipboard.writeText(summary).catch(() => {});
    track("copy_summary_clicked", { score: result.total_score });
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

        {/* 2. Executive Summary */}
        <ExecutiveSummary score={result.total_score} checks={result.checks} />

        {/* 3. Scan Confidence */}
        <ScanConfidence checks={result.checks} />

        {/* 4. Score Card */}
        <div className="mt-8">
          <ScoreCard
            score={result.total_score}
            band={result.band}
            message={result.band_message}
          />
        </div>

        {/* 5. Score Improvement */}
        <ScoreImprovement score={result.total_score} checks={result.checks} />

        {/* 6. Industry Benchmarking */}
        <IndustryBenchmarking score={result.total_score} />

        {/* 7. AI Readiness Radar */}
        <RadarChart checks={result.checks} />

        {/* 8. AI Agent Compatibility */}
        <AiAgentCompatibility checks={result.checks} />

        {/* 9. What This Means */}
        <WhatThisMeans score={result.total_score} checks={result.checks} />

        {/* 10. AI Visibility Summary */}
        <AIVisibilitySummary checks={result.checks} />

        {/* 11. AI Visibility Journey */}
        <AIVisibilityJourney checks={result.checks} />

        {/* 12. What Happens If You Do Nothing */}
        <DoNothingConsequences checks={result.checks} />

        {/* 13. Priority Fix Roadmap */}
        <PriorityFixRoadmap checks={result.checks} />

        {/* 14. Success Stories */}
        <SuccessStories />

        {/* 15. Why AI Agents Skip Your Site */}
        <h2 className="text-lg sm:text-xl font-bold text-foreground mb-5">
          Why AI Agents Skip Your Site
        </h2>

        {/* 16. Check Cards */}
        <div className="flex flex-col gap-4">
          {result.checks.map((check, i) => (
            <CheckCard key={`card-${i}`} check={check} />
          ))}
        </div>

        {/* 17. Compact view */}
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

        {/* 18. Upgrade CTA (moved below all report content) */}
        {result.total_score < 85 && (
          <div className="mt-10">
            {result.upgrade_cta ? (
              <LegacyUpgradePrompt cta={result.upgrade_cta} />
            ) : (
              <UpgradeCta />
            )}
          </div>
        )}

        {/* 19. Share & Download */}
        <div className="text-center pb-10">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Download Report — dropdown */}
            <div className="relative" data-dropdown="download">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="inline-flex items-center gap-2 border border-border bg-card text-foreground font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                  <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                </svg>
                Download Report
                <svg className={`h-3 w-3 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 w-40 rounded-lg border border-border bg-card shadow-lg overflow-hidden">
                  {[
                    { format: "pdf", label: "PDF", desc: "Printable report" },
                    { format: "md", label: "Markdown (.md)", desc: "Plain text format" },
                    { format: "doc", label: "Word (.doc)", desc: "Editable document" },
                  ].map((item) => (
                    <button
                      key={item.format}
                      onClick={() => handleDownload(item.format)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-xs hover:bg-secondary transition-colors border-0 bg-transparent cursor-pointer"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent font-bold text-[10px]">
                        {item.format.toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <div className="font-semibold text-foreground">{item.label}</div>
                        <div className="text-[10px] text-muted-foreground">{item.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-2 border border-border bg-card text-foreground font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
                <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
              </svg>
              Copy Summary
            </button>
            <button
              onClick={handleShare}
              className="bg-primary text-primary-foreground font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
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
              className="inline-flex items-center gap-2 bg-[#1DA1F2] text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-lg hover:bg-[#1a8cd8] transition-colors no-underline"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Share on X
            </a>
          </div>
          {copied && (
            <p className="mt-3 text-sm text-green-500 transition-all duration-300">
              Copied to clipboard!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
