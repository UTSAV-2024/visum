import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

const botData = [
  { name: "GPTBot", visits: 2843, color: "#7c3aed", change: "+12%" },
  { name: "Claude-Web", visits: 1950, color: "#6366f1", change: "+8%" },
  { name: "Google-Extended", visits: 1521, color: "#3b82f6", change: "+15%" },
  { name: "PerplexityBot", visits: 987, color: "#06b6d4", change: "+22%" },
  { name: "Cohere", visits: 534, color: "#10b981", change: "+5%" },
  { name: "Gemini", visits: 423, color: "#f59e0b", change: "-3%" },
];

const timeFilters = ["7d", "30d", "90d"] as const;

export function AiBotVisits({ className }: { className?: string }) {
  const [activeFilter, setActiveFilter] = useState<string>("30d");
  const [isVisible, setIsVisible] = useState(false);
  const [animated, setAnimated] = useState(false);
  const [sortBy, setSortBy] = useState<"visits" | "name">("visits");

  useEffect(() => {
    setIsVisible(true);
    const t = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(t);
  }, []);

  const maxVisits = Math.max(...botData.map((b) => b.visits));
  const sorted = [...botData].sort((a, b) =>
    sortBy === "visits" ? b.visits - a.visits : a.name.localeCompare(b.name)
  );

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-border bg-card transition-all duration-500 hover:shadow-[0_0_40px_-16px_rgba(124,58,237,0.12)]",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none rounded-2xl" />

      <div className="relative z-10 p-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 1a4.5 4.5 0 00-4.5 4.5v2.5a2 2 0 00-2 2v4a2 2 0 002 2h9a2 2 0 002-2v-4a2 2 0 00-2-2v-2.5A4.5 4.5 0 0010 1zm-2.5 7V5.5a2.5 2.5 0 015 0V8h-5z" />
              </svg>
              <p className="text-xs font-semibold uppercase tracking-widest text-foreground">
                AI Bot Visits
              </p>
            </div>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5">
              Total: {botData.reduce((s, b) => s + b.visits, 0).toLocaleString()} visits
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Sort toggle */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "visits" | "name")}
              className="rounded-lg border border-border bg-muted/20 px-2 py-1 text-[10px] font-medium text-muted-foreground outline-none focus:border-accent"
              aria-label="Sort by"
            >
              <option value="visits">Sort: Visits</option>
              <option value="name">Sort: Name</option>
            </select>
            {/* Time filter */}
            <div className="flex rounded-lg bg-muted/20 p-0.5">
              {timeFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-[10px] font-semibold transition-all",
                    activeFilter === f
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bar chart */}
        <div className="space-y-3">
          {sorted.map((bot, idx) => (
            <div key={bot.name} className="group relative">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: bot.color }} />
                  <span className="text-xs font-medium text-foreground truncate">{bot.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-xs font-bold tabular-nums text-foreground">
                    {bot.visits.toLocaleString()}
                  </span>
                  <span className={cn(
                    "text-[10px] font-semibold",
                    bot.change.startsWith("+") ? "text-green-500" : "text-red-500"
                  )}>
                    {bot.change}
                  </span>
                </div>
              </div>
              <div className="h-2 rounded-full bg-muted/20 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: animated ? `${(bot.visits / maxVisits) * 100}%` : "0%",
                    backgroundColor: bot.color,
                    transitionDelay: `${idx * 80}ms`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground/60">
          <span>Updated today at 10:30 AM</span>
          <span>Showing {activeFilter} period</span>
        </div>
      </div>
    </div>
  );
}
