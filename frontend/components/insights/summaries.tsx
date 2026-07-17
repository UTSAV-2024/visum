import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { DAILY_SUMMARY, WEEKLY_SUMMARY } from "./data";

export function Summaries({ className }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 transition-all duration-500", isVisible ? "opacity-100" : "opacity-0", className)}>
      {/* Daily Summary */}
      <div className="relative rounded-2xl border border-border bg-card p-5 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
            </svg>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground">Daily Summary</p>
            <span className="text-[8px] text-muted-foreground/50">{DAILY_SUMMARY.date}</span>
          </div>

          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="font-mono text-3xl font-bold tabular-nums text-foreground">{DAILY_SUMMARY.score}</span>
            <span className="flex items-center gap-0.5 text-[11px] font-semibold text-green-500">
              <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.563a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-3.95V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
              </svg>
              +{DAILY_SUMMARY.change}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Scans", value: DAILY_SUMMARY.scans, color: "text-accent" },
              { label: "Issues", value: DAILY_SUMMARY.issuesFound, color: "text-red-500" },
              { label: "Resolved", value: DAILY_SUMMARY.issuesResolved, color: "text-green-500" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className={cn("font-mono text-sm font-bold tabular-nums", item.color)}>{item.value}</p>
                <p className="text-[8px] text-muted-foreground/60 uppercase tracking-wider">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-2 border-t border-border flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <svg className="h-3 w-3 text-accent" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 1a4.5 4.5 0 00-4.5 4.5v2.5a2 2 0 00-2 2v4a2 2 0 002 2h9a2 2 0 002-2v-4a2 2 0 00-2-2v-2.5A4.5 4.5 0 0010 1zm-2.5 7V5.5a2.5 2.5 0 015 0V8h-5z" />
            </svg>
            <span>AI visits today: <span className="font-semibold text-foreground">{DAILY_SUMMARY.aiVisits}</span></span>
          </div>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="relative rounded-2xl border border-border bg-card p-5 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M1.693 9.597a.75.75 0 01.21 1.04L2.25 9.5l-.347.137-.001.001-.004.002-.013.007a4.19 4.19 0 01-.215.106 9.86 9.86 0 01-1.765.718.75.75 0 01-.453-1.43 12.39 12.39 0 002.155-.885l.014-.007.004-.002.003-.001.75-.35a.75.75 0 011.04.21l.693 1.02.692-1.02a.75.75 0 011.25.83l-.693 1.02.693-1.02.693 1.02a.75.75 0 01-1.25.83l-.692-1.02-.693 1.02a.75.75 0 01-1.04-.21L3.5 10.5l.347-.137v-.001l.004-.002.013-.007a3.98 3.98 0 01.215-.106 10.53 10.53 0 011.765-.718.75.75 0 01.453 1.43 12.39 12.39 0 00-2.155.885l-.014.007-.004.002-.003.001-.75.35a.75.75 0 01-1.04-.21l-.692-1.02-.693 1.02a.75.75 0 01-1.25-.83l.693-1.02-.693 1.02z" clipRule="evenodd" />
            </svg>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground">Weekly Summary</p>
            <span className="text-[8px] text-muted-foreground/50">{WEEKLY_SUMMARY.week}</span>
          </div>

          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="font-mono text-3xl font-bold tabular-nums text-foreground">{WEEKLY_SUMMARY.avgScore}</span>
            <span className="flex items-center gap-0.5 text-[11px] font-semibold text-green-500">
              <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.563a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-3.95V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
              </svg>
              {WEEKLY_SUMMARY.scoreChange}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Scans", value: WEEKLY_SUMMARY.totalScans, color: "text-accent" },
              { label: "Resolved", value: WEEKLY_SUMMARY.issuesResolved, color: "text-green-500" },
              { label: "New Issues", value: WEEKLY_SUMMARY.newIssues, color: "text-red-500" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className={cn("font-mono text-sm font-bold tabular-nums", item.color)}>{item.value}</p>
                <p className="text-[8px] text-muted-foreground/60 uppercase tracking-wider">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-2 border-t border-border flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <svg className="h-3 w-3 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.563a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-3.95V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
            </svg>
            <span>AI traffic <span className="font-semibold text-green-500">{WEEKLY_SUMMARY.aiTrafficChange}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
