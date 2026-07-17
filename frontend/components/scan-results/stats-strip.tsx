import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

export function StatsStrip({ checks, className }) {
  const [isVisible, setIsVisible] = useState(false);

  const total = checks?.length || 0;
  const passed = checks?.filter((c) => c.passed).length || 0;
  const failed = checks?.filter((c) => !c.passed && !c.partial).length || 0;
  const warnings = checks?.filter((c) => c.partial).length || 0;

  const avgScore = total > 0
    ? Math.round(checks.reduce((s, c) => s + (c.score / c.max_score) * 100, 0) / total)
    : 0;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    {
      label: "Total Checks",
      value: total,
      color: "text-foreground",
      icon: (
        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" />
        </svg>
      ),
      bg: "bg-accent/10",
    },
    {
      label: "Passed",
      value: passed,
      color: "text-green-500",
      icon: (
        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
        </svg>
      ),
      bg: "bg-green-500/10",
    },
    {
      label: "Warnings",
      value: warnings,
      color: "text-orange-500",
      icon: (
        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
        </svg>
      ),
      bg: "bg-orange-500/10",
    },
    {
      label: "Failed",
      value: failed,
      color: "text-red-500",
      icon: (
        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
        </svg>
      ),
      bg: "bg-red-500/10",
    },
    {
      label: "Avg Score",
      value: `${avgScore}%`,
      color: avgScore >= 70 ? "text-green-500" : avgScore >= 40 ? "text-orange-500" : "text-red-500",
      icon: (
        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5v2.5a2 2 0 00-2 2v4a2 2 0 002 2h9a2 2 0 002-2v-4a2 2 0 00-2-2v-2.5A4.5 4.5 0 0010 1zm-2.5 7V5.5a2.5 2.5 0 015 0V8h-5z" />
        </svg>
      ),
      bg: "bg-accent/10",
    },
  ];

  return (
    <div
      className={cn(
        "transition-all duration-500",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
    >
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="relative rounded-xl border border-border bg-card p-2.5 sm:p-3 transition-all duration-200 hover:border-accent/30"
          >
            <div className="flex items-center gap-2">
              <div className={cn("flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg shrink-0", stat.bg, stat.color)}>
                {stat.icon}
              </div>
              <div className="min-w-0">
                <p className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
                  {stat.label}
                </p>
                <p className={cn("font-mono text-sm sm:text-base font-bold tabular-nums", stat.color)}>
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
