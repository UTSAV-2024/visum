import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { getBand } from "../../lib/scan-data";

interface VisibilityScoreProps {
  score: number;
  previousScore?: number;
  url?: string;
  className?: string;
}

export function VisibilityScore({
  score,
  previousScore,
  url,
  className,
}: VisibilityScoreProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const band = getBand(score);
  const gradientId = `vis-grad-${score}`;

  const circumference = 2 * Math.PI * 90;
  const offset = circumference - (animatedScore / 100) * circumference;

  const trend =
    previousScore !== undefined ? score - previousScore : null;
  const isUp = trend !== null && trend > 0;
  const isDown = trend !== null && trend < 0;
  const trendAbs = trend !== null ? Math.abs(trend) : 0;

  useEffect(() => {
    setIsVisible(true);
    const timeout = setTimeout(() => setAnimatedScore(score), 300);
    return () => clearTimeout(timeout);
  }, [score]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8 transition-all duration-500",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.03] to-transparent pointer-events-none" />

      {/* Corner accent */}
      <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Label row */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              AI Visibility Score
            </p>
            {url && (
              <p className="text-[10px] text-muted-foreground/60 mt-0.5 truncate max-w-[200px] sm:max-w-[280px]">
                {url}
              </p>
            )}
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold",
              band.pill,
              band.pillText
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                score >= 85
                  ? "bg-green-500"
                  : score >= 65
                  ? "bg-accent"
                  : score >= 40
                  ? "bg-orange-500"
                  : "bg-red-500"
              )}
            />
            {band.label}
          </span>
        </div>

        {/* Score ring */}
        <div className="flex items-center gap-6 sm:gap-8">
          <div className="relative shrink-0">
            <svg
              className="h-32 w-32 sm:h-40 sm:w-40 transform -rotate-90"
              viewBox="0 0 200 200"
            >
              <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="50%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              {/* Background ring */}
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                className="text-border"
              />
              {/* Score ring */}
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className={cn(
                  "font-mono text-4xl sm:text-5xl font-bold leading-none tabular-nums transition-colors duration-500",
                  band.text
                )}
              >
                {Math.round(animatedScore)}
              </span>
              <span className="text-[11px] text-muted-foreground mt-0.5">
                / 100
              </span>
            </div>
          </div>

          {/* Score details */}
          <div className="flex flex-col gap-2 min-w-0">
            {/* Trend */}
            {trend !== null && (
              <div
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold",
                  isUp
                    ? "bg-green-500/10 text-green-500"
                    : isDown
                    ? "bg-red-500/10 text-red-500"
                    : "bg-muted/30 text-muted-foreground"
                )}
              >
                {isUp ? (
                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.563a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-3.95V16.25A.75.75 0 0110 17z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : isDown ? (
                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 3a.75.75 0 01.75.75v10.638l3.96-3.96a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 3.95V3.75A.75.75 0 0110 3z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <span>
                  {isUp ? "+" : isDown ? "-" : ""}
                  {trendAbs}
                  {isUp ? " improvement" : isDown ? " decline" : " unchanged"}
                </span>
              </div>
            )}

            {/* Quick stats */}
            <div className="flex flex-wrap gap-2 mt-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <svg className="h-3.5 w-3.5 text-accent" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 1a4.5 4.5 0 00-4.5 4.5v2.5a2 2 0 00-2 2v4a2 2 0 002 2h9a2 2 0 002-2v-4a2 2 0 00-2-2v-2.5A4.5 4.5 0 0010 1zm-2.5 7V5.5a2.5 2.5 0 015 0V8h-5z" />
                </svg>
                <span>Last scanned today</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
