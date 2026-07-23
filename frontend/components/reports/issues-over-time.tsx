import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

export function IssuesOverTime({ className, issues = [] }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const unresolved = issues.filter((i) => !i.resolved);
  const resolved = issues.filter((i) => i.resolved);
  const regressions = issues.filter((i) => i.severity === "critical" && !i.resolved);

  return (
    <div
      className={cn(
        "grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 transition-all duration-500",
        isVisible ? "opacity-100" : "opacity-0",
        className
      )}
    >
      {/* Historical Issues */}
      <div className="relative rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <svg className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Historical Issues</p>
          <span className="rounded-full bg-red-500/10 px-1.5 py-0.5 text-[9px] font-bold text-red-500">{unresolved.length}</span>
        </div>
        <div className="space-y-1">
          {unresolved.map((issue) => (
            <div key={issue.id} className="flex items-center gap-2 py-1.5">
              <span className={cn("h-1.5 w-1.5 rounded-full shrink-0",
                issue.severity === "critical" ? "bg-red-500" : issue.severity === "high" ? "bg-orange-500" : issue.severity === "medium" ? "bg-accent" : "bg-green-500"
              )} />
              <span className="text-xs text-foreground flex-1 truncate">{issue.name}</span>
              <span className="text-[9px] text-muted-foreground/60">since {issue.firstSeen}</span>
            </div>
          ))}
          {unresolved.length === 0 && <p className="text-xs text-muted-foreground/60 py-4 text-center">No unresolved issues</p>}
        </div>
      </div>

      {/* Resolved Issues */}
      <div className="relative rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <svg className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
          </svg>
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Resolved Issues</p>
          <span className="rounded-full bg-green-500/10 px-1.5 py-0.5 text-[9px] font-bold text-green-500">{resolved.length}</span>
        </div>
        <div className="space-y-1">
          {resolved.map((issue) => (
            <div key={issue.id} className="flex items-center gap-2 py-1.5">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500/10 shrink-0">
                <svg className="h-2.5 w-2.5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
              </span>
              <span className="text-xs text-foreground flex-1 truncate line-through decoration-green-500/30">{issue.name}</span>
              <span className="text-[9px] text-green-500/60">{issue.resolvedAt}</span>
            </div>
          ))}
          {resolved.length === 0 && <p className="text-xs text-muted-foreground/60 py-4 text-center">No resolved issues yet</p>}
        </div>
      </div>

      {/* Regression Detection */}
      <div className="relative rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <svg className="h-4 w-4 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
          </svg>
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Regression Detection</p>
          {regressions.length > 0 && <span className="rounded-full bg-orange-500/10 px-1.5 py-0.5 text-[9px] font-bold text-orange-500">{regressions.length}</span>}
        </div>
        {regressions.length > 0 ? (
          <div className="space-y-2">
            {regressions.map((issue) => (
              <div key={issue.id} className="rounded-lg bg-orange-500/5 border border-orange-500/10 px-3 py-2">
                <p className="text-xs font-medium text-foreground">{issue.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Unresolved since {issue.firstSeen} — needs attention</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <svg className="h-8 w-8 text-green-500/50 mb-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
            </svg>
            <p className="text-xs font-medium text-muted-foreground">No regressions detected</p>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5">Your scores are consistently improving</p>
          </div>
        )}
      </div>
    </div>
  );
}
