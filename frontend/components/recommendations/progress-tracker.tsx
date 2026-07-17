import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

const PRIORITIES = [
  { key: "critical", label: "Critical", color: "bg-red-500", text: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30" },
  { key: "high", label: "High", color: "bg-orange-500", text: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/30" },
  { key: "medium", label: "Medium", color: "bg-accent", text: "text-accent", bg: "bg-accent/10", border: "border-accent/30" },
  { key: "low", label: "Low", color: "bg-green-500", text: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/30" },
];

export function ProgressTracker({ recommendations, className }) {
  const [isVisible, setIsVisible] = useState(false);

  const total = recommendations.length;
  const completed = recommendations.filter((r) => r.completed).length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const priorityCounts = PRIORITIES.map((p) => ({
    ...p,
    total: recommendations.filter((r) => r.priority === p.key).length,
    done: recommendations.filter((r) => r.priority === p.key && r.completed).length,
  }));

  const totalScore = recommendations.reduce((s, r) => s + (r.completed ? r.scoreImprovement : 0), 0);
  const potentialScore = recommendations.reduce((s, r) => s + r.scoreImprovement, 0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground">
              Progress
            </p>
          </div>
          <span className="font-mono text-sm font-bold tabular-nums text-foreground">
            {completed}/{total}
          </span>
        </div>

        {/* Main progress bar */}
        <div className="h-2.5 rounded-full bg-muted/20 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-accent/70 transition-all duration-1000 ease-out"
            style={{ width: `${isVisible ? pct : 0}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-1 text-[10px] text-muted-foreground/60">
          <span>{pct}% complete</span>
          <span>Goal: 100%</span>
        </div>

        {/* Priority breakdown */}
        <div className="mt-4 space-y-2">
          {priorityCounts.map((p) => (
            <div key={p.key} className="flex items-center gap-2">
              <span className={cn("h-2 w-2 rounded-full shrink-0", p.color)} />
              <span className="text-[10px] text-muted-foreground w-14">{p.label}</span>
              <div className="flex-1 h-1.5 rounded-full bg-muted/20 overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-700", p.color)}
                  style={{ width: `${p.total > 0 ? (p.done / p.total) * 100 : 0}%` }}
                />
              </div>
              <span className="font-mono text-[10px] tabular-nums text-muted-foreground w-8 text-right">
                {p.done}/{p.total}
              </span>
            </div>
          ))}
        </div>

        {/* Score impact */}
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Score impact achieved</span>
          <span className="font-mono font-bold text-green-500">
            +{totalScore} / +{potentialScore} pts
          </span>
        </div>
      </div>
    </div>
  );
}
