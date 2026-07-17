import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { getBand, getGrade } from "../../lib/scan-data";

export function ScoreSection({ score, url, checks, className }) {
  const [isVisible, setIsVisible] = useState(false);
  const [animated, setAnimated] = useState(false);
  const band = getBand(score);
  const grade = getGrade(score);
  const gradientId = `result-score-grad-${score}`;

  const totalChecks = checks?.length || 0;
  const passedChecks = checks?.filter((c) => c.passed).length || 0;
  const failedChecks = checks?.filter((c) => !c.passed && !c.partial).length || 0;
  const partialChecks = checks?.filter((c) => c.partial).length || 0;

  const circumference = 2 * Math.PI * 80;

  useEffect(() => {
    setIsVisible(true);
    const t = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(t);
  }, []);

  const offset = circumference - (animated ? score / 100 : 0) * circumference;

  return (
    <div
      className={cn(
        "grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 transition-all duration-500",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
    >
      {/* Large score card - spans 3 cols */}
      <div className="lg:col-span-3 relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.03] to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
          {/* Score gauge */}
          <div className="relative shrink-0">
            <svg className="h-40 w-40 sm:h-48 sm:w-48 -rotate-90" viewBox="0 0 200 200">
              <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="50%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="8" className="text-border" />
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn("font-mono text-5xl sm:text-6xl font-bold leading-none tabular-nums", band.text)}>
                {score}
              </span>
              <span className="text-xs text-muted-foreground mt-1">/ 100</span>
            </div>
          </div>

          {/* Score details */}
          <div className="flex flex-col gap-3 min-w-0">
            {/* Grade */}
            <div className="flex items-center gap-2">
              <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl font-extrabold text-lg ring-1", grade.bg, grade.ring, grade.color)}>
                {grade.letter}
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{band.label}</p>
                <p className="text-xs text-muted-foreground">{grade.label}</p>
              </div>
            </div>

            {/* URL */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <svg className="h-3.5 w-3.5 text-accent" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.937 0-1.95.84-2.637 3.109A18.81 18.81 0 007.93 9h4.14a18.81 18.81 0 00-.567-1.891C11.95 4.84 10.937 4 10 4zm0 12c.937 0 1.95-.84 2.637-3.109.136-.463.257-.983.394-1.891H7.93a18.81 18.81 0 00.567 1.891C8.05 15.16 9.063 16 10 16zm-2.17-6a16.716 16.716 0 01.387-2.768A11.094 11.094 0 0110 6.001c.683 0 1.448.356 2.17 1.232.359.434.628.957.835 1.518.108.307.188.631.248.985l.014.006v.518l-.014.006a6.516 6.516 0 01-.248.985 6.62 6.62 0 01-.835 1.518C11.448 13.644 10.683 14 10 14s-1.448-.356-2.17-1.232a6.62 6.62 0 01-.835-1.518 6.516 6.516 0 01-.248-.985L6.732 10v-.518l.014-.006c.06-.354.14-.678.248-.985zm4.083 0h-1.946c-.089 1.546-.383 2.97-.837 4.118A6.004 6.004 0 0015.917 9z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="truncate max-w-[200px] sm:max-w-[300px]">{url}</span>
            </div>

            {/* Score breakdown bars */}
            <div className="mt-2 space-y-2">
              {[{ label: "Passed", count: passedChecks, color: "bg-green-500" },
                { label: "Warnings", count: partialChecks, color: "bg-orange-500" },
                { label: "Failed", count: failedChecks, color: "bg-red-500" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground w-16">{item.label}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-muted/20 overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-700", item.color)}
                      style={{ width: `${totalChecks > 0 ? (item.count / totalChecks) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="font-mono text-[11px] font-bold tabular-nums text-foreground w-6 text-right">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Website preview card - spans 2 cols */}
      <div className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-border bg-card p-5">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none" />
        <div className="relative z-10 h-full flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm5.917 7A6.004 6.004 0 0013.38 4.882c.454 1.148.748 2.572.837 4.118h1.946z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Website Preview
            </p>
          </div>

          {/* Preview mockup */}
          <div className="flex-1 rounded-xl border border-border bg-muted/20 overflow-hidden flex flex-col">
            {/* Browser bar */}
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border bg-muted/10">
              <span className="h-2 w-2 rounded-full bg-red-500/50" />
              <span className="h-2 w-2 rounded-full bg-orange-500/50" />
              <span className="h-2 w-2 rounded-full bg-green-500/50" />
              <span className="ml-2 flex-1 h-4 rounded-md bg-muted/20 flex items-center px-2">
                <span className="text-[8px] text-muted-foreground/60 truncate">{url}</span>
              </span>
            </div>
            {/* Preview content */}
            <div className="flex-1 p-3 space-y-2">
              <div className="h-3 rounded bg-muted/20 w-3/4" />
              <div className="h-2 rounded bg-muted/20 w-1/2" />
              <div className="h-2 rounded bg-muted/20 w-5/6" />
              <div className="h-2 rounded bg-muted/20 w-2/3" />
              <div className="flex gap-2 mt-3">
                <div className="h-12 flex-1 rounded-lg bg-muted/20" />
                <div className="h-12 flex-1 rounded-lg bg-muted/20" />
              </div>
              <div className="flex gap-2">
                <div className="h-2 rounded bg-muted/20 w-1/4" />
                <div className="h-2 rounded bg-muted/20 w-1/4" />
              </div>
            </div>
          </div>

          {/* Preview status */}
          <div className="flex items-center gap-2 mt-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span className="text-[10px] text-muted-foreground/60">
              Site accessible — scan completed successfully
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
