import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { COMPETITORS, INDUSTRY_AVG, YOUR_SITE } from "./data";

export function BenchmarkGraph({ className }) {
  const [isVisible, setIsVisible] = useState(false);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  const sorted = [...COMPETITORS].sort((a, b) => b.score - a.score);
  const maxScore = 100;

  return (
    <div className={cn("relative rounded-2xl border border-border bg-card transition-all duration-500", isVisible ? "opacity-100" : "opacity-0", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none rounded-2xl" />
      <div className="relative z-10 p-5">
        <div className="flex items-center gap-2 mb-4">
          <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M1 2.75A.75.75 0 011.75 2h16.5a.75.75 0 010 1.5H1.75A.75.75 0 011 2.75zm0 5A.75.75 0 011.75 7h16.5a.75.75 0 010 1.5H1.75A.75.75 0 011 7.75zm0 5a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H1.75a.75.75 0 01-.75-.75zm0 5a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H1.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
          </svg>
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Market Benchmark</p>
        </div>

        {/* Benchmark bars */}
        <div className="relative h-36 sm:h-40">
          {/* Industry avg line */}
          <div className="absolute inset-x-0 top-0 flex items-center" style={{ top: `${(1 - INDUSTRY_AVG.score / maxScore) * 100}%` }}>
            <div className="flex-1 h-px border-t border-dashed border-orange-500/40" />
            <span className="text-[8px] text-orange-500/60 ml-2 shrink-0">Industry avg: {INDUSTRY_AVG.score}</span>
          </div>

          <div className="flex items-end gap-2 sm:gap-3 h-full">
            {sorted.map((site, idx) => {
              const isYou = site.name === "Your Site";
              const barHeight = animated ? (site.score / maxScore) * 100 : 0;
              const barColor = isYou ? "bg-gradient-to-t from-accent to-accent/70" : "bg-gradient-to-t from-muted-foreground/30 to-muted-foreground/10";

              return (
                <div key={site.name} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <div className="relative w-full flex justify-center">
                    <div
                      className={cn("w-full max-w-[32px] rounded-t-sm transition-all duration-700 ease-out", barColor)}
                      style={{ height: `${barHeight}%`, transitionDelay: `${idx * 100}ms` }}
                    />
                    {/* Score label */}
                    <span className={cn("absolute -top-4 font-mono text-[10px] font-bold tabular-nums", isYou ? "text-accent" : "text-muted-foreground/60")}>
                      {site.score}
                    </span>
                  </div>
                  <span className={cn("text-[8px] text-center leading-tight mt-1 max-w-full truncate", isYou ? "text-accent font-semibold" : "text-muted-foreground/50")}>
                    {site.name === "Your Site" ? "You" : site.name.replace("Competitor ", "C")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Market position text */}
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground/60">
          <span>Your rank: <span className="font-bold text-accent">#{YOUR_SITE.rank}</span> of {COMPETITORS.length}</span>
          <span>Above industry avg by <span className="font-bold text-green-500">+{YOUR_SITE.score - INDUSTRY_AVG.score}</span></span>
        </div>
      </div>
    </div>
  );
}
