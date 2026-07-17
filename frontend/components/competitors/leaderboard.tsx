import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { COMPETITORS } from "./data";

export function Leaderboard({ className }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const sorted = [...COMPETITORS].sort((a, b) => b.score - a.score);

  return (
    <div className={cn("relative rounded-2xl border border-border bg-card transition-all duration-500", isVisible ? "opacity-100" : "opacity-0", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none rounded-2xl" />
      <div className="relative z-10 p-5">
        <div className="flex items-center gap-2 mb-4">
          <svg className="h-4 w-4 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5v2.5a2 2 0 00-2 2v4a2 2 0 002 2h9a2 2 0 002-2v-4a2 2 0 00-2-2v-2.5A4.5 4.5 0 0010 1zm-2.5 7V5.5a2.5 2.5 0 015 0V8h-5z" />
          </svg>
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Leaderboard</p>
          <span className="text-[10px] text-muted-foreground/60">by AI Visibility Score</span>
        </div>

        <div className="space-y-1">
          {sorted.map((site, idx) => {
            const isYou = site.name === "Your Site";
            const medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : null;
            return (
              <div key={site.name} className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200",
                isYou ? "bg-accent/5 border border-accent/20" : "hover:bg-muted/10"
              )}>
                <span className="font-mono text-[11px] font-bold tabular-nums text-muted-foreground w-5 text-center">
                  {medal || `#${idx + 1}`}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={cn("text-xs font-semibold truncate", isYou ? "text-accent" : "text-foreground")}>
                      {site.name}
                    </span>
                    {isYou && <span className="rounded bg-accent/10 px-1 py-px text-[8px] font-bold text-accent">YOU</span>}
                  </div>
                  <p className="text-[9px] text-muted-foreground/60 truncate">{site.domain}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-sm font-bold tabular-nums text-foreground">{site.score}</span>
                  <span className={cn(
                    "text-[10px] font-semibold", site.change.startsWith("+") ? "text-green-500" : site.change.startsWith("-") ? "text-red-500" : "text-muted-foreground"
                  )}>{site.change}</span>
                  <div className="w-12 h-1.5 rounded-full bg-muted/20 overflow-hidden">
                    <div className={cn("h-full rounded-full", isYou ? "bg-accent" : "bg-muted/30")} style={{ width: `${site.score}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
