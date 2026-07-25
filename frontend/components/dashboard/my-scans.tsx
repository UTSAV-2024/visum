"use client";

import { useRouter } from "next/router";
import { cn } from "../../lib/utils";

type Scan = {
  id: string;
  scan_id: string | null;
  url: string;
  total_score: number;
  band: string | null;
  checks: any;
  scan_time_ms: number | null;
  created_at: string;
};

function scoreStyles(score: number) {
  if (score >= 85) return { text: "text-green-500", bg: "bg-green-500/10", ring: "ring-green-500/20" };
  if (score >= 65) return { text: "text-accent", bg: "bg-accent/10", ring: "ring-accent/20" };
  if (score >= 40) return { text: "text-orange-500", bg: "bg-orange-500/10", ring: "ring-orange-500/20" };
  return { text: "text-red-500", bg: "bg-red-500/10", ring: "ring-red-500/20" };
}

function relativeDate(iso: string) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Date.now() - then;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function MyScans({ scans }: { scans: Scan[] }) {
  const router = useRouter();

  // Open a historical scan in the existing full report UI by re-hydrating the
  // session payload the result page reads.
  function openReport(scan: Scan) {
    try {
      sessionStorage.setItem(
        "visum_result",
        JSON.stringify({
          scan_id: scan.scan_id,
          result: {
            url: scan.url,
            total_score: scan.total_score,
            max_score: 100,
            band: scan.band || "",
            band_message: "",
            checks: scan.checks || [],
            scan_time_ms: scan.scan_time_ms || 0,
            timestamp: scan.created_at,
            upgrade_cta: "",
          },
        })
      );
      router.push("/result");
    } catch {
      /* sessionStorage unavailable — ignore */
    }
  }

  if (!scans || scans.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
          <svg className="h-6 w-6 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-foreground">No scans yet</h3>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
          Run your first scan to see how AI systems read your site. Your results will show up here.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Run your first scan
        </button>
      </div>
    );
  }

  const latest = scans[0];
  const previous = scans[1];
  const delta = previous ? latest.total_score - previous.total_score : null;
  const best = scans.reduce((m, s) => Math.max(m, s.total_score), 0);
  const ls = scoreStyles(latest.total_score);

  return (
    <div className="rounded-2xl border border-border bg-card">
      {/* Header + summary */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-5">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground">Your scans</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {scans.length} {scans.length === 1 ? "scan" : "scans"} · real data from your account
          </p>
        </div>
        <div className="flex items-center gap-5">
          <div className="text-right">
            <div className={cn("font-mono text-2xl font-extrabold leading-none", ls.text)}>
              {latest.total_score}
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">Latest</div>
          </div>
          {delta !== null && (
            <div className="text-right">
              <div
                className={cn(
                  "font-mono text-2xl font-extrabold leading-none",
                  delta > 0 ? "text-green-500" : delta < 0 ? "text-red-500" : "text-muted-foreground"
                )}
              >
                {delta > 0 ? `+${delta}` : delta}
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">Change</div>
            </div>
          )}
          <div className="text-right">
            <div className="font-mono text-2xl font-extrabold leading-none text-foreground">{best}</div>
            <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">Best</div>
          </div>
        </div>
      </div>

      {/* Rows */}
      <ul className="divide-y divide-border">
        {scans.map((scan) => {
          const s = scoreStyles(scan.total_score);
          return (
            <li key={scan.id}>
              <button
                onClick={() => openReport(scan)}
                className="group flex w-full items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-muted/10"
              >
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-bold ring-1",
                    s.bg, s.text, s.ring
                  )}
                >
                  {scan.total_score}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground group-hover:text-accent">
                    {hostOf(scan.url)}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {scan.band || "—"} · {relativeDate(scan.created_at)}
                  </span>
                </span>
                <span className="shrink-0 text-xs font-medium text-muted-foreground group-hover:text-accent">
                  View report →
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-border p-4 text-center">
        <button
          onClick={() => router.push("/")}
          className="text-xs font-semibold text-accent hover:underline"
        >
          Run another scan
        </button>
      </div>
    </div>
  );
}
