"use client";

import { cn } from "../../lib/utils";

type BotRow = { name: string; count: number; vendor: string; purpose: string };

// Purpose decides how a number should be read, so it is labelled rather than
// left for the viewer to infer from the bot's name.
const PURPOSE_COPY: Record<string, string> = {
  training: "Training corpus",
  search: "Search index",
  "user-triggered": "Fetched for a user's question",
  research: "Research",
};

const VENDOR_COLORS: Record<string, string> = {
  OpenAI: "#10a37f",
  Anthropic: "#d4a27f",
  Google: "#4285f4",
  Perplexity: "#20808d",
  Meta: "#0668e1",
  Apple: "#a2aaad",
  Amazon: "#ff9900",
  ByteDance: "#ff2c55",
};

export function BotTraffic({
  byBot,
  totalVisits,
  className,
}: {
  byBot: BotRow[];
  totalVisits: number;
  className?: string;
}) {
  const max = byBot.length ? Math.max(...byBot.map((b) => b.count)) : 0;

  return (
    <div className={cn("rounded-xl border border-border bg-card p-4 sm:p-5", className)}>
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-foreground">AI crawlers</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Requests your server reported, grouped by crawler
        </p>
      </div>

      {byBot.length === 0 ? (
        <p className="py-6 text-center text-xs text-muted-foreground">
          No AI crawler requests in this period.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {byBot.map((bot) => {
            const share = totalVisits ? Math.round((bot.count / totalVisits) * 100) : 0;
            return (
              <li key={bot.name}>
                <div className="mb-1 flex items-baseline justify-between gap-3">
                  <span className="truncate text-xs font-medium text-foreground">
                    {bot.name}
                    <span className="ml-1.5 text-[10px] font-normal text-muted-foreground">
                      {bot.vendor} · {PURPOSE_COPY[bot.purpose] || bot.purpose}
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-xs tabular-nums text-foreground">
                    {bot.count.toLocaleString()}
                    <span className="ml-1 text-[10px] text-muted-foreground">{share}%</span>
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/30">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: max ? `${(bot.count / max) * 100}%` : "0%",
                      backgroundColor: VENDOR_COLORS[bot.vendor] || "#7c3aed",
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function CrawlTimeline({
  timeline,
  className,
}: {
  timeline: { date: string; visits: number }[];
  className?: string;
}) {
  const max = timeline.length ? Math.max(...timeline.map((d) => d.visits)) : 0;

  return (
    <div className={cn("rounded-xl border border-border bg-card p-4 sm:p-5", className)}>
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-foreground">Crawl activity</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Daily AI crawler requests. Gaps are days with none.
        </p>
      </div>

      {max === 0 ? (
        <p className="py-6 text-center text-xs text-muted-foreground">
          Nothing recorded yet for this period.
        </p>
      ) : (
        <div className="flex h-32 items-end gap-[2px]">
          {timeline.map((day) => (
            <div
              key={day.date}
              className="group relative flex-1 rounded-t bg-accent/70 transition-colors hover:bg-accent"
              style={{ height: `${Math.max((day.visits / max) * 100, day.visits ? 3 : 0)}%` }}
              title={`${day.date}: ${day.visits} request${day.visits === 1 ? "" : "s"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function TopPaths({
  topPaths,
  className,
}: {
  topPaths: { path: string; count: number }[];
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-4 sm:p-5", className)}>
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-foreground">Most crawled pages</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Where AI crawlers spend their time on your site
        </p>
      </div>

      {topPaths.length === 0 ? (
        <p className="py-6 text-center text-xs text-muted-foreground">
          No paths recorded yet — your collector may not be sending them.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {topPaths.map((p) => (
            <li key={p.path} className="flex items-baseline justify-between gap-3">
              <code className="truncate font-mono text-xs text-muted-foreground">{p.path}</code>
              <span className="shrink-0 font-mono text-xs tabular-nums text-foreground">
                {p.count.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
