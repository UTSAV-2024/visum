import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import { BotTraffic, CrawlTimeline, TopPaths } from "../components/analytics/bot-traffic";
import { TrackingSetup } from "../components/analytics/tracking-setup";
import { AnalyticsSkeleton } from "../components/analytics/loading-skeleton";
import { cn } from "../lib/utils";
import { track } from "../lib/analytics";
import { withAuthRequired } from "../lib/auth-guard";

const RANGES = [
  { id: 7, label: "7d" },
  { id: 30, label: "30d" },
  { id: 90, label: "90d" },
];

function StatPill({ label, value, hint, color = "text-foreground" }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 sm:p-4">
      <p className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground/70 sm:text-[10px]">
        {label}
      </p>
      <p className={cn("mt-0.5 font-mono text-sm font-bold tabular-nums sm:text-base", color)}>
        {value}
      </p>
      {hint && <p className="mt-0.5 text-[9px] text-muted-foreground/60 sm:text-[10px]">{hint}</p>}
    </div>
  );
}

export default function AiAnalytics() {
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [sites, setSites] = useState([]);
  const [error, setError] = useState("");

  const load = useCallback(async (range) => {
    setLoading(true);
    setError("");
    try {
      const [botsRes, sitesRes] = await Promise.all([
        fetch(`/api/analytics/bots?days=${range}`, { credentials: "same-origin" }),
        fetch("/api/analytics/sites", { credentials: "same-origin" }),
      ]);
      if (!botsRes.ok) {
        const payload = await botsRes.json().catch(() => ({}));
        setError(payload.error || "Could not load your analytics.");
        return;
      }
      setData(await botsRes.json());
      if (sitesRes.ok) {
        const s = await sitesRes.json();
        setSites(s.sites || []);
      }
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(days);
  }, [days, load]);

  useEffect(() => {
    if (!loading && data) track("analytics_viewed", { days, state: data.state });
  }, [loading, data, days]);

  const addSite = useCallback(
    async (domain) => {
      try {
        const res = await fetch("/api/analytics/sites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ domain }),
        });
        const payload = await res.json().catch(() => ({}));
        if (!res.ok) return payload.error || "Could not add that site.";
        setSites((current) => [...current, payload.site]);
        load(days);
        return "";
      } catch {
        return "Could not reach the server. Please try again.";
      }
    },
    [days, load]
  );

  const totals = data?.totals;
  // "Nothing reported yet" and "zero crawls" are different facts; only the
  // second is a measurement, so the page must not show 0 for the first.
  const hasData = data?.state === "ok";

  return (
    <>
      <Head>
        <title>AI Analytics — Visum</title>
        <meta
          name="description"
          content="See which AI crawlers reach your site, how often, and which pages they read."
        />
      </Head>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {loading ? (
          <AnalyticsSkeleton />
        ) : (
          <div className="animate-fadeIn space-y-4 sm:space-y-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-lg font-bold text-foreground sm:text-xl">AI Analytics</h1>
                <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                  Which AI crawlers reach your site, and what they read
                </p>
              </div>
              <div className="flex gap-1">
                {RANGES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setDays(r.id)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-[11px] font-medium transition-colors",
                      days === r.id
                        ? "bg-accent/15 text-accent"
                        : "text-muted-foreground hover:bg-muted/20 hover:text-foreground"
                    )}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p
                className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                role="alert"
              >
                {error}
              </p>
            )}

            {/* Setup comes first until there's something to show. */}
            {data && data.state !== "ok" && (
              <TrackingSetup sites={sites} onAdd={addSite} />
            )}

            {data && data.state === "no_data" && sites.length > 0 && (
              <p className="rounded-xl border border-border bg-card px-4 py-3 text-xs text-muted-foreground">
                Connected, but nothing has arrived yet. AI crawlers visit on their
                own schedule — it can be hours or days before the first request
                shows up. This page fills in as they come.
              </p>
            )}

            {hasData && (
              <>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                  <StatPill
                    label="Crawler requests"
                    value={totals.visits.toLocaleString()}
                    hint={data.truncated ? "at least — capped for this view" : `last ${days} days`}
                    color="text-accent"
                  />
                  <StatPill
                    label="Distinct crawlers"
                    value={totals.bots}
                    hint={`of ${data.knownBots.length} we recognise`}
                  />
                  <StatPill
                    label="Pages reached"
                    value={data.topPaths.length ? `${data.topPaths.length}+` : "—"}
                    hint="distinct paths seen"
                  />
                  <StatPill
                    label="Verified"
                    value={`${totals.verified}`}
                    hint="IP-confirmed; the rest are UA claims"
                    color={totals.verified ? "text-green-500" : "text-muted-foreground"}
                  />
                </div>

                <CrawlTimeline timeline={data.timeline} />

                <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
                  <BotTraffic byBot={data.byBot} totalVisits={totals.visits} />
                  <TopPaths topPaths={data.topPaths} />
                </div>

                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  A user-agent is a claim, not proof — anything can call itself
                  GPTBot. Rows marked verified had their source address checked
                  against the vendor&apos;s published ranges; the rest are
                  self-reported and should be read as such.
                </p>

                <TrackingSetup sites={sites} onAdd={addSite} />
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export const getServerSideProps = withAuthRequired();
