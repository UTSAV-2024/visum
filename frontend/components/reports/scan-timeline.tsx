import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

export function ScanTimeline({ onSelectScan, selectedScan, className, scans = [] }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scoreGradient = (score) => {
    if (score >= 85) return { color: "bg-green-500", ring: "ring-green-500/30", text: "text-green-500" };
    if (score >= 65) return { color: "bg-accent", ring: "ring-accent/30", text: "text-accent" };
    if (score >= 40) return { color: "bg-orange-500", ring: "ring-orange-500/30", text: "text-orange-500" };
    return { color: "bg-red-500", ring: "ring-red-500/30", text: "text-red-500" };
  };

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-border bg-card transition-all duration-500",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none rounded-2xl" />
      <div className="relative z-10 p-5">
        <div className="flex items-center gap-2 mb-5">
          <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
          </svg>
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Version History & Timeline</p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-border" />

          {scans.map((scan, idx) => {
            const sg = scoreGradient(scan.score);
            const isSelected = selectedScan === scan.id;
            const isLatest = idx === 0;

            return (
              <button
                key={scan.id}
                onClick={() => onSelectScan?.(scan.id)}
                className={cn(
                  "relative flex items-start gap-4 py-3 w-full text-left transition-all duration-200 group rounded-xl px-2 -mx-2",
                  isSelected ? "bg-accent/5" : "hover:bg-muted/10"
                )}
              >
                {/* Dot */}
                <div className="relative z-10 mt-0.5">
                  <div className={cn(
                    "h-[18px] w-[18px] rounded-full border-2 flex items-center justify-center transition-all",
                    sg.color,
                    isLatest ? `ring-2 ${sg.ring}` : ""
                  )}>
                    <div className="h-2 w-2 rounded-full bg-current" />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={cn("text-xs font-semibold", isLatest ? "text-foreground" : "text-muted-foreground")}>
                      {scan.date}
                      {isLatest && <span className="ml-1.5 text-[9px] text-accent">(Latest)</span>}
                    </p>
                    <span className={cn("font-mono text-sm font-bold tabular-nums", sg.text)}>{scan.score}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground/60">
                    <span>{scan.issues} issues</span>
                    {scan.resolved > 0 && <span className="text-green-500">· {scan.resolved} resolved</span>}
                    {scan.regressions > 0 && <span className="text-red-500">· {scan.regressions} regression</span>}
                  </div>
                  {scan.changes && (
                    <p className="text-[9px] text-muted-foreground/40 mt-0.5 truncate max-w-[250px]">{scan.changes}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
