import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "../lib/utils";
import { track } from "../lib/analytics";
import { withAuthRequired } from "../lib/auth-guard";
import { deriveCompetitors } from "../lib/competitors";
import { scanCompetitor, removeCompetitor, ScanRefusedError } from "../lib/api";
import { useAccount } from "../lib/account-context";
import { OutOfScansModal } from "../components/quota/out-of-scans-modal";

// ── Access control + real data ──────────────────────────────────
export const getServerSideProps = withAuthRequired(async (ctx, { supabase }) => {
  const [ownRes, compRes] = await Promise.all([
    supabase
      .from("scans")
      .select("id, scan_id, url, total_score, band, checks, created_at")
      .eq("kind", "primary")
      .order("created_at", { ascending: false })
      .limit(1),
    supabase
      .from("scans")
      .select("id, scan_id, url, total_score, band, checks, created_at")
      .eq("kind", "competitor")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  if (ownRes.error) console.error("[competitors] own scan load:", ownRes.error.message);
  if (compRes.error) console.error("[competitors] competitor load:", compRes.error.message);

  const data = deriveCompetitors(ownRes.data?.[0] ?? null, compRes.data ?? []);
  return { props: { data } };
});

// ── Small building blocks ────────────────────────────────────────

function scoreTone(score) {
  if (score >= 85) return "text-green-500";
  if (score >= 65) return "text-accent";
  if (score >= 40) return "text-orange-500";
  return "text-red-500";
}

function PassDot({ passes }) {
  return passes ? (
    <svg className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-label="Pass">
      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
    </svg>
  ) : (
    <svg className="h-4 w-4 text-muted-foreground/40" viewBox="0 0 20 20" fill="currentColor" aria-label="Fail">
      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
    </svg>
  );
}

// ── Page ─────────────────────────────────────────────────────────

export default function CompetitorIntelligence({ data }) {
  const router = useRouter();
  const { account, refresh } = useAccount();
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [removing, setRemoving] = useState("");
  const [quotaModal, setQuotaModal] = useState(null);

  const { hasOwnScan, you, leaderboard, competitors, yourRank, competitorCount, gapToLeader, featureComparison, gaps, wins } = data;

  async function handleAdd(e) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Enter a competitor's URL.");
      return;
    }
    setError("");
    setScanning(true);
    track("competitor_scan_started", {});
    try {
      const res = await scanCompetitor(trimmed);
      track("competitor_scan_completed", { host: res.host });
      setUrl("");
      void refresh(); // usage changed
      router.replace(router.asPath, undefined, { scroll: false }); // re-fetch derived props
    } catch (err) {
      if (err instanceof ScanRefusedError && err.status === 402) {
        setQuotaModal(err.quota);
      } else if (err instanceof ScanRefusedError && err.status === 401) {
        router.push("/login?next=%2Fcompetitors");
      } else {
        setError(err.message || "Couldn't scan that site.");
      }
    } finally {
      setScanning(false);
    }
  }

  async function handleRemove(host) {
    setRemoving(host);
    try {
      await removeCompetitor(host);
      router.replace(router.asPath, undefined, { scroll: false });
    } catch {
      /* non-fatal */
    } finally {
      setRemoving("");
    }
  }

  return (
    <>
      <Head>
        <title>Competitors — Visum</title>
        <meta name="description" content="Compare your AI readiness against competitors, check by check, on real scans." />
      </Head>

      <div>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
          <div className="animate-fadeIn space-y-4 sm:space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground">Competitors</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Scan a competitor and compare, check by check, against {you ? you.host : "your site"} — on the same 8 signals.
              </p>
            </div>

            {/* You need your own scan first */}
            {!hasOwnScan ? (
              <div className="rounded-2xl border border-border bg-card p-8 text-center">
                <h2 className="text-base font-semibold text-foreground">Scan your own site first</h2>
                <p className="mx-auto mt-1.5 max-w-md text-sm text-muted-foreground">
                  Competitor comparison is measured against your own latest scan. Run one, then
                  come back to line rivals up beside it.
                </p>
                <Link
                  href="/#scan"
                  className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground no-underline transition-colors hover:bg-primary/90"
                >
                  Run your first scan
                </Link>
              </div>
            ) : (
              <>
                {/* Add competitor */}
                <form onSubmit={handleAdd} className="rounded-2xl border border-border bg-card p-4 sm:p-5">
                  <label htmlFor="competitor-url" className="text-xs font-semibold uppercase tracking-widest text-foreground">
                    Add a competitor
                  </label>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Scanning a competitor uses one of your scans
                    {account?.usage ? ` — ${account.usage.scansRemaining} left` : ""}.
                  </p>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <input
                      id="competitor-url"
                      type="text"
                      inputMode="url"
                      value={url}
                      onChange={(e) => { setUrl(e.target.value); if (error) setError(""); }}
                      placeholder="competitor.com"
                      disabled={scanning}
                      className="h-11 flex-1 rounded-xl border border-border bg-secondary/50 px-4 font-mono text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-accent disabled:opacity-60"
                    />
                    <button
                      type="submit"
                      disabled={scanning}
                      className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
                    >
                      {scanning ? "Scanning…" : "Scan & compare"}
                    </button>
                  </div>
                  {error && <p className="mt-2 text-sm font-medium text-destructive" role="alert">{error}</p>}
                </form>

                {/* Summary stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {[
                    { label: "Your Rank", value: competitorCount > 0 ? `#${yourRank}` : "—", sub: competitorCount > 0 ? `of ${leaderboard.length}` : "add a rival", color: "text-accent" },
                    { label: "Your Score", value: you.score, sub: `${you.band}`, color: "text-foreground" },
                    { label: "Gap to Leader", value: gapToLeader > 0 ? `-${gapToLeader}` : "0", sub: gapToLeader > 0 ? "behind #1" : "you lead", color: gapToLeader > 0 ? "text-orange-500" : "text-green-500" },
                    { label: "Competitors", value: competitorCount, sub: "tracked", color: "text-foreground" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl border border-border bg-card p-3">
                      <p className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">{s.label}</p>
                      <p className={cn("font-mono text-lg sm:text-xl font-bold tabular-nums mt-0.5", s.color)}>{s.value}</p>
                      <p className="text-[9px] text-muted-foreground/60 mt-0.5 truncate">{s.sub}</p>
                    </div>
                  ))}
                </div>

                {competitorCount === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      No competitors yet. Add one above to see the leaderboard and a check-by-check comparison.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Leaderboard */}
                    <div className="rounded-2xl border border-border bg-card">
                      <div className="flex items-center gap-2 border-b border-border p-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Leaderboard</p>
                      </div>
                      <ul className="divide-y divide-border">
                        {leaderboard.map((e) => (
                          <li key={e.id} className={cn("flex items-center gap-4 px-4 py-3", e.isYou && "bg-accent/5")}>
                            <span className="w-6 shrink-0 font-mono text-sm font-bold text-muted-foreground">#{e.rank}</span>
                            <span className="min-w-0 flex-1">
                              <span className="flex items-center gap-2">
                                <span className="truncate text-sm font-medium text-foreground">{e.host}</span>
                                {e.isYou && <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[9px] font-bold uppercase text-accent">You</span>}
                              </span>
                              <span className="text-[11px] text-muted-foreground">{e.band}</span>
                            </span>
                            <span className={cn("font-mono text-lg font-bold tabular-nums", scoreTone(e.score))}>{e.score}</span>
                            {!e.isYou && (
                              <button
                                onClick={() => handleRemove(e.host)}
                                disabled={removing === e.host}
                                className="shrink-0 rounded-md p-1.5 text-muted-foreground/50 transition-colors hover:bg-muted/20 hover:text-foreground disabled:opacity-40"
                                aria-label={`Remove ${e.host}`}
                                title="Stop tracking"
                              >
                                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                                </svg>
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Gaps & Wins */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      <div className="rounded-2xl border border-border bg-card p-5">
                        <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Where you're losing</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">Checks a competitor passes that you don't.</p>
                        <div className="mt-3 space-y-2">
                          {gaps.length === 0 ? (
                            <p className="py-4 text-center text-xs text-muted-foreground/60">No gaps — you pass everything a rival does.</p>
                          ) : (
                            gaps.map((g) => (
                              <div key={g.check} className="flex items-start gap-2.5">
                                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                                <div className="min-w-0">
                                  <p className="text-xs font-medium text-foreground">{g.label}</p>
                                  <p className="text-[10px] text-muted-foreground/60 truncate">passed by {g.passedBy.join(", ")}</p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-border bg-card p-5">
                        <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Where you're ahead</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">Checks you pass that a competitor misses.</p>
                        <div className="mt-3 space-y-2">
                          {wins.length === 0 ? (
                            <p className="py-4 text-center text-xs text-muted-foreground/60">No clear leads yet.</p>
                          ) : (
                            wins.map((w) => (
                              <div key={w.check} className="flex items-start gap-2.5">
                                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                                <div className="min-w-0">
                                  <p className="text-xs font-medium text-foreground">{w.label}</p>
                                  <p className="text-[10px] text-muted-foreground/60 truncate">missed by {w.missedBy.join(", ")}</p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Feature comparison matrix */}
                    <div className="rounded-2xl border border-border bg-card overflow-hidden">
                      <div className="border-b border-border p-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Check-by-check</p>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[520px] text-left">
                          <thead>
                            <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground/60">
                              <th className="px-4 py-2 font-medium">Check</th>
                              <th className="px-3 py-2 text-center font-medium text-accent">{you.host}</th>
                              {competitors.map((c) => (
                                <th key={c.id} className="px-3 py-2 text-center font-medium">{c.host}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {featureComparison.map((row) => (
                              <tr key={row.check} className="border-b border-border/50 last:border-0">
                                <td className="px-4 py-2.5 text-xs text-foreground">{row.label}</td>
                                <td className="px-3 py-2.5">
                                  <span className="flex justify-center"><PassDot passes={row.yours} /></span>
                                </td>
                                {row.competitors.map((c) => (
                                  <td key={c.host} className="px-3 py-2.5">
                                    <span className="flex justify-center"><PassDot passes={c.passes} /></span>
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <OutOfScansModal open={!!quotaModal} quota={quotaModal} onClose={() => setQuotaModal(null)} />
    </>
  );
}
