import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { CheckDetailCard } from "./check-detail-card";

export function IssuesSection({ checks, filter, className }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const failedChecks = checks?.filter((c) => !c.passed && !c.partial) || [];
  const warningChecks = checks?.filter((c) => c.partial) || [];

  const all = filter === "failed" ? failedChecks : filter === "warnings" ? warningChecks : [...failedChecks, ...warningChecks];

  if (all.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 mb-3">
          <svg className="h-6 w-6 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-foreground">No issues found</p>
        <p className="text-xs text-muted-foreground mt-1">All checks are passing. Great job!</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "space-y-3 transition-all duration-500",
        isVisible ? "opacity-100" : "opacity-0",
        className
      )}
    >
      {/* Section header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground">
            {filter === "failed" ? "Failed Checks" : filter === "warnings" ? "Warnings" : "All Issues"}
          </p>
          <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[9px] font-bold text-red-500">
            {all.length}
          </span>
        </div>
      </div>

      {all.map((check, idx) => (
        <CheckDetailCard key={check.name} check={check} index={idx} />
      ))}

      <p className="text-[10px] text-muted-foreground/40 text-center pt-2">
        {all.length === 1 ? "1 issue" : `${all.length} issues`} — expand each for detailed fix guidance
      </p>
    </div>
  );
}
