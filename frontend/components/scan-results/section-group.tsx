import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

function CheckBar({ check }) {
  const measured = check.measured !== false;
  const pct = Math.round((check.score / check.max_score) * 100);
  const isPassed = measured && check.passed;
  const isPartial = measured && check.partial;

  return (
    <div className="group flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/10 transition-colors cursor-pointer">
      <span className={cn(
        "flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
        !measured ? "bg-muted/20 text-muted-foreground" :
        isPassed ? "bg-green-500/10 text-green-500" :
        isPartial ? "bg-orange-500/10 text-orange-500" :
        "bg-red-500/10 text-red-500"
      )}>
        {!measured ? (
          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        ) : isPassed ? (
          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
          </svg>
        ) : isPartial ? (
          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
          </svg>
        )}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground truncate group-hover:text-accent transition-colors">
          {check.name}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {measured ? (
          <>
            <div className="w-16 sm:w-24 h-1.5 rounded-full bg-muted/20 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  isPassed ? "bg-green-500" : isPartial ? "bg-orange-500" : "bg-red-500"
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="font-mono text-[10px] font-bold tabular-nums text-foreground w-10 text-right">
              {pct}%
            </span>
          </>
        ) : (
          <span className="font-mono text-[10px] font-semibold tabular-nums text-muted-foreground w-10 text-right">
            n/a
          </span>
        )}
      </div>
    </div>
  );
}

export function SectionGroup({ title, checks, icon, className }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!checks || checks.length === 0) return null;

  const passed = checks.filter((c) => c.passed).length;
  const total = checks.length;

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-border bg-card transition-all duration-500",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none rounded-2xl" />

      <div className="relative z-10 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {icon && <span className="text-accent">{icon}</span>}
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground">
              {title}
            </p>
          </div>
          <span className="text-[10px] text-muted-foreground/60">
            {passed}/{total} passed
          </span>
        </div>

        {/* Checks */}
        <div className="divide-y divide-border/50">
          {checks.map((check) => (
            <CheckBar key={check.name} check={check} />
          ))}
        </div>
      </div>
    </div>
  );
}
