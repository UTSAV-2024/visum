import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

export function RecCard({ rec, onToggleComplete, onApplyFix, onSelectToggle, isSelected, viewMode }) {
  const [isVisible, setIsVisible] = useState(false);
  const [fixApplied, setFixApplied] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const priorityColors = {
    critical: { dot: "bg-red-500", bg: "bg-red-500/10", text: "text-red-500", border: "border-l-red-500/40", badge: "bg-red-500/15 text-red-500" },
    high: { dot: "bg-orange-500", bg: "bg-orange-500/10", text: "text-orange-500", border: "border-l-orange-500/40", badge: "bg-orange-500/15 text-orange-500" },
    medium: { dot: "bg-accent", bg: "bg-accent/10", text: "text-accent", border: "border-l-accent/40", badge: "bg-accent/15 text-accent" },
    low: { dot: "bg-green-500", bg: "bg-green-500/10", text: "text-green-500", border: "border-l-green-500/40", badge: "bg-green-500/15 text-green-500" },
  };

  const pc = priorityColors[rec.priority];

  const difficultyIcons = {
    easy: (
      <div className="flex items-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
        <span className="text-[10px] text-green-500 font-medium">Easy</span>
      </div>
    ),
    medium: (
      <div className="flex items-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
        <span className="text-[10px] text-orange-500 font-medium">Medium</span>
      </div>
    ),
    hard: (
      <div className="flex items-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        <span className="text-[10px] text-red-500 font-medium">Hard</span>
      </div>
    ),
  };

  if (viewMode === "kanban") {
    return (
      <div
        className={cn(
          "rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:border-accent/30 hover:shadow-[0_0_20px_-8px_rgba(124,58,237,0.1)] group",
          rec.completed && "opacity-60",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}
      >
        {/* Kanban card compact */}
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={isSelected || rec.completed}
            onChange={() => {
              if (onSelectToggle) onSelectToggle(rec.id);
              else onToggleComplete?.(rec.id);
            }}
            className="mt-0.5 h-4 w-4 rounded border-border bg-muted text-accent focus:ring-accent shrink-0 cursor-pointer"
            aria-label={rec.completed ? "Mark as incomplete" : "Select for bulk action"}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span className={cn("rounded px-1.5 py-0.5 text-[9px] font-semibold", pc.badge)}>
                {rec.priority}
              </span>
              <span className="text-[9px] text-muted-foreground bg-muted/20 rounded px-1.5 py-0.5">
                {rec.category}
              </span>
            </div>
            <h4 className={cn("text-xs font-semibold", rec.completed ? "line-through text-muted-foreground" : "text-foreground")}>
              {rec.title}
            </h4>
            <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
              <span className="text-green-500 font-medium">+{rec.scoreImprovement} pts</span>
              <span>·</span>
              {difficultyIcons[rec.difficulty]}
              <span className="ml-auto text-[9px]">{rec.implementationTime}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-border bg-card transition-all duration-500 hover:shadow-[0_0_30px_-12px_rgba(124,58,237,0.12)] group",
        pc.border,
        rec.completed && "opacity-60",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none rounded-2xl" />

      <div className="relative z-10 p-5">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {/* Checkbox */}
            <div className="mt-0.5">
              <input
                type="checkbox"
                checked={isSelected || rec.completed}
                onChange={() => {
                  if (onSelectToggle) onSelectToggle(rec.id);
                  else onToggleComplete?.(rec.id);
                }}
                className="h-4 w-4 rounded border-border bg-muted text-accent focus:ring-accent shrink-0 cursor-pointer"
                aria-label={rec.completed ? "Mark as incomplete" : "Select for bulk action"}
              />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-1">
                <span className={cn("rounded-md px-1.5 py-0.5 text-[9px] font-semibold", pc.badge)}>
                  {rec.priority}
                </span>
                <span className="text-[9px] text-muted-foreground bg-muted/20 rounded-md px-1.5 py-0.5">
                  {rec.category}
                </span>
                {!rec.fixAvailable && (
                  <span className="text-[9px] text-muted-foreground bg-muted/20 rounded-md px-1.5 py-0.5">
                    Manual fix
                  </span>
                )}
              </div>

              <h3 className={cn("text-sm font-semibold leading-snug", rec.completed ? "line-through text-muted-foreground" : "text-foreground")}>
                {rec.title}
              </h3>

              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
                {rec.description}
              </p>
            </div>
          </div>

          {/* Priority dot */}
          <span className={cn("h-2 w-2 rounded-full shrink-0 mt-1.5", pc.dot)} />
        </div>

        {/* Metrics row */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.563a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-3.95V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
            </svg>
            <span className="text-[10px] text-muted-foreground">
              Score: <span className="font-mono font-bold text-green-500">+{rec.scoreImprovement}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-accent" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 1a4.5 4.5 0 00-4.5 4.5v2.5a2 2 0 00-2 2v4a2 2 0 002 2h9a2 2 0 002-2v-4a2 2 0 00-2-2v-2.5A4.5 4.5 0 0010 1zm-2.5 7V5.5a2.5 2.5 0 015 0V8h-5z" />
            </svg>
            <span className="text-[10px] text-muted-foreground">
              Traffic: <span className="font-mono font-bold text-accent">+{rec.trafficImprovement}%</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 1a4.5 4.5 0 00-4.5 4.5v2.5a2 2 0 00-2 2v4a2 2 0 002 2h9a2 2 0 002-2v-4a2 2 0 00-2-2v-2.5A4.5 4.5 0 0010 1z" />
            </svg>
            {difficultyIcons[rec.difficulty]}
          </div>

          <div className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
            </svg>
            <span className="text-[10px] text-muted-foreground">{rec.implementationTime}</span>
          </div>
        </div>

        {/* Dependencies */}
        {rec.dependencies.length > 0 && !rec.completed && (
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            <span className="text-[9px] text-muted-foreground/60">Needs:</span>
            {rec.dependencies.map((dep) => (
              <span key={dep} className="text-[9px] text-muted-foreground bg-muted/10 rounded px-1.5 py-0.5">
                {dep}
              </span>
            ))}
          </div>
        )}

        {/* Action button */}
        {!rec.completed && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => {
                setFixApplied(true);
                onApplyFix?.(rec.id);
              }}
              disabled={fixApplied}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all",
                fixApplied
                  ? "bg-green-500/10 text-green-500"
                  : rec.fixAvailable
                  ? "bg-accent/10 text-accent hover:bg-accent/20"
                  : "bg-muted/20 text-muted-foreground cursor-not-allowed"
              )}
            >
              {fixApplied ? (
                <>
                  <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  Fix Applied
                </>
              ) : rec.fixAvailable ? (
                <>
                  <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.403 4.652a3 3 0 00-4.242 0L4.5 12.31A3 3 0 003.72 14.5l-.824 2.473a.75.75 0 00.928.928l2.473-.824a3 3 0 002.19-.78l7.66-7.662a3 3 0 000-4.242l-.344-.343z" clipRule="evenodd" />
                  </svg>
                  One-Click Fix
                </>
              ) : (
                "Requires manual setup"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
