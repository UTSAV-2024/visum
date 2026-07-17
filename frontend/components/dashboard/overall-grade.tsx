import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { getGrade } from "../../lib/scan-data";

interface OverallGradeProps {
  score: number;
  className?: string;
}

export function OverallGrade({ score, className }: OverallGradeProps) {
  const [isVisible, setIsVisible] = useState(false);
  const grade = getGrade(score);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all duration-500",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none" />

      <div className="relative z-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Overall Grade
        </p>

        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-xl font-extrabold text-xl ring-1 transition-all duration-300 group-hover:ring-2",
              grade.bg,
              grade.ring,
              grade.color
            )}
          >
            {grade.letter}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              {score >= 85
                ? "Excellent"
                : score >= 65
                ? "Good"
                : score >= 40
                ? "Needs Work"
                : "Critical"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
              {grade.label}
            </p>
          </div>
        </div>

        {/* Score bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span>Score</span>
            <span className="font-mono tabular-nums">{score}/100</span>
          </div>
          <div className="h-1.5 rounded-full bg-border overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${isVisible ? score : 0}%`,
                background:
                  score >= 85
                    ? "linear-gradient(90deg, #22c55e, #16a34a)"
                    : score >= 65
                    ? "linear-gradient(90deg, #7c3aed, #6366f1)"
                    : score >= 40
                    ? "linear-gradient(90deg, #f59e0b, #d97706)"
                    : "linear-gradient(90deg, #ef4444, #dc2626)",
              }}
            />
          </div>
          {/* Scale markers */}
          <div className="flex justify-between mt-1">
            {[0, 25, 50, 75, 100].map((mark) => (
              <span key={mark} className="text-[9px] text-muted-foreground/40 font-mono">
                {mark}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
