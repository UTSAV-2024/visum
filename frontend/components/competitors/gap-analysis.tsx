import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { COMPETITORS, INDUSTRY_AVG, METRICS, METRIC_LABELS, YOUR_SITE } from "./data";

export function GapAnalysis({ className }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const gaps = METRICS.map((m) => {
    const yours = YOUR_SITE[m];
    const best = Math.max(...COMPETITORS.map((c) => c[m]));
    const avg = INDUSTRY_AVG[m];
    const gapToBest = best - yours;
    return {
      metric: METRIC_LABELS[m],
      yours,
      best,
      avg,
      gapToBest,
      aboveAvg: yours >= avg,
      key: m,
    };
  });

  const strengths = gaps.filter((g) => g.yours >= g.avg).sort((a, b) => b.yours - a.yours);
  const weaknesses = gaps.filter((g) => g.yours < g.avg).sort((a, b) => a.yours - b.yours);

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 transition-all duration-500", isVisible ? "opacity-100" : "opacity-0", className)}>
      {/* Strengths */}
      <div className="relative rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <svg className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.563a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-3.95V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
          </svg>
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Strengths</p>
          <span className="text-[9px] text-muted-foreground bg-muted/10 rounded px-1.5 py-0.5">Above industry avg</span>
        </div>
        <div className="space-y-2">
          {strengths.map((s) => (
            <div key={s.key} className="flex items-center gap-3">
              <span className="text-xs text-foreground w-24 shrink-0">{s.metric}</span>
              <div className="flex-1 h-2 rounded-full bg-muted/20 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400" style={{ width: `${s.yours}%` }} />
              </div>
              <span className="font-mono text-[11px] font-bold tabular-nums text-green-500 w-8 text-right">{s.yours}</span>
              <span className="text-[9px] text-muted-foreground/60">+{s.yours - s.avg} vs avg</span>
            </div>
          ))}
          {strengths.length === 0 && <p className="text-xs text-muted-foreground/60 py-4 text-center">No strengths above industry average</p>}
        </div>
      </div>

      {/* Weaknesses */}
      <div className="relative rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <svg className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-3.96a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 3.95V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
          </svg>
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Weaknesses</p>
          <span className="text-[9px] text-muted-foreground bg-muted/10 rounded px-1.5 py-0.5">Below industry avg</span>
        </div>
        <div className="space-y-2">
          {weaknesses.map((w) => (
            <div key={w.key} className="flex items-center gap-3">
              <span className="text-xs text-foreground w-24 shrink-0">{w.metric}</span>
              <div className="flex-1 h-2 rounded-full bg-muted/20 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-400" style={{ width: `${w.yours}%` }} />
              </div>
              <span className="font-mono text-[11px] font-bold tabular-nums text-red-500 w-8 text-right">{w.yours}</span>
              <span className="text-[9px] text-red-500/60">{w.avg - w.yours} below avg</span>
            </div>
          ))}
          {weaknesses.length === 0 && <p className="text-xs text-muted-foreground/60 py-4 text-center">No weaknesses — all metrics above average!</p>}
        </div>
        {/* Gap meter */}
        {weaknesses.length > 0 && (
          <div className="mt-4 pt-3 border-t border-border">
            <p className="text-[9px] text-muted-foreground/60 mb-1">Gap to best performer</p>
            {weaknesses.slice(0, 2).map((w) => (
              <div key={w.key} className="flex items-center gap-2 text-[10px]">
                <span className="text-muted-foreground w-24 truncate">{w.metric}</span>
                <span className="font-mono font-bold text-orange-500">-{w.gapToBest}</span>
                <span className="text-muted-foreground/60">points behind leader</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
