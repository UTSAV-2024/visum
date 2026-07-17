import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { ORG_ANALYTICS } from "./data";

export function OrgAnalytics({ className }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { label: "Total Scans", value: ORG_ANALYTICS.totalScans.toLocaleString(), icon: "M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39l.001-.001z", color: "text-accent" },
    { label: "This Week", value: ORG_ANALYTICS.scansThisWeek, icon: "M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z", color: "text-green-500" },
    { label: "Active Members", value: ORG_ANALYTICS.activeMembers, icon: "M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z", color: "text-blue-500" },
    { label: "Avg Score", value: ORG_ANALYTICS.avgScore, icon: "M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z", color: "text-accent" },
    { label: "Issues Resolved", value: ORG_ANALYTICS.totalIssuesResolved, icon: "M10 1a4.5 4.5 0 00-4.5 4.5v2.5a2 2 0 00-2 2v4a2 2 0 002 2h9a2 2 0 002-2v-4a2 2 0 00-2-2v-2.5A4.5 4.5 0 0010 1zm-2.5 7V5.5a2.5 2.5 0 015 0V8h-5z", color: "text-green-500" },
  ];

  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 transition-all duration-500", isVisible ? "opacity-100" : "opacity-0", className)}>
      {stats.map((stat) => (
        <div key={stat.label} className="relative rounded-xl border border-border bg-card p-3 transition-all duration-200 hover:border-accent/30">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent/10 shrink-0">
              <svg className={cn("h-3.5 w-3.5", stat.color)} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d={stat.icon} clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground/70">{stat.label}</p>
          </div>
          <p className={cn("font-mono text-sm sm:text-base font-bold tabular-nums", stat.color)}>{stat.value}</p>
        </div>
      ))}
      {/* Top performer card spans 2 on lg */}
      <div className="relative rounded-xl border border-border bg-card p-3 col-span-2 sm:col-span-3 lg:col-span-2">
        <p className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground/70 mb-1">Top Performer</p>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10 text-[10px] font-bold text-amber-500">
            {ORG_ANALYTICS.topPerformer.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">{ORG_ANALYTICS.topPerformer.name}</p>
            <p className="text-[9px] text-muted-foreground/60">{ORG_ANALYTICS.topPerformer.scans} scans completed</p>
          </div>
          <span className="ml-auto rounded-full bg-amber-500/10 px-2 py-0.5 text-[9px] font-bold text-amber-500">🏆</span>
        </div>
      </div>
    </div>
  );
}
