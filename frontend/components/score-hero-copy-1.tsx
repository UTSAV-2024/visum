import { cn } from "../lib/utils";
import { getBand } from "../lib/scan-data";

export function ScoreHero({ score, url }) {
  const band = getBand(score);
  const gradientId = `score-grad-${score}`;

  return (
    <section className="flex flex-col items-center gap-6 text-center">
      <p className="text-sm text-muted-foreground">
        AI readiness report for{" "}
        <span className="font-medium text-foreground break-all">{url}</span>
      </p>

      <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted opacity-20"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="3"
            strokeDasharray={`${(score / 100) * 282.7} 282.7`}
            className="transition-all duration-1000"
          />
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute text-center">
          <span
            className={cn(
              "font-mono text-5xl font-bold leading-none tabular-nums sm:text-6xl",
              band.text,
            )}
          >
            {score}
          </span>
          <div className="text-xs text-muted-foreground mt-1">/ 100</div>
        </div>
      </div>

      <span
        className={cn(
          "rounded-full px-5 py-1.5 text-sm font-semibold",
          band.pill,
          band.pillText,
        )}
      >
        {band.label}
      </span>
    </section>
  );
}
