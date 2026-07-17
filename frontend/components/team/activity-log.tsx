import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { ACTIVITY_LOG } from "./data";

const typeStyles = {
  scan: { icon: "M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39l.001-.001z", bg: "bg-accent/10", text: "text-accent" },
  export: { icon: "M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z", bg: "bg-green-500/10", text: "text-green-500" },
  settings: { icon: "M10 3.75a2 2 0 10-4 0 2 2 0 004 0zM17.25 4.5a.75.75 0 000-1.5h-5.5a.75.75 0 000 1.5h5.5zM5 3.75a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 01.75.75zM4.25 17a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5h1.5zM17.25 17a.75.75 0 000-1.5h-5.5a.75.75 0 000 1.5h5.5z", bg: "bg-orange-500/10", text: "text-orange-500" },
  invite: { icon: "M10.362 1.093a.75.75 0 00-.724 0L2.523 5.018 10 9.143l7.477-4.125-7.115-3.925zM18 6.443l-7.25 4v8.25l6.862-3.786A.75.75 0 0018 14.25V6.443zm-8.75 12.25v-8.25l-7.25-4v7.807a.75.75 0 00.388.657l6.862 3.786z", bg: "bg-accent/10", text: "text-accent" },
  comparison: { icon: "M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z", bg: "bg-blue-500/10", text: "text-blue-500" },
  system: { icon: "M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z", bg: "bg-muted/20", text: "text-muted-foreground" },
};

export function ActivityLog({ className }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={cn("relative rounded-2xl border border-border bg-card transition-all duration-500", isVisible ? "opacity-100" : "opacity-0", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none rounded-2xl" />
      <div className="relative z-10 p-5">
        <div className="flex items-center gap-2 mb-4">
          <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Activity Log</p>
          <span className="text-[9px] text-muted-foreground/60">Audit trail</span>
        </div>

        <div className="space-y-1">
          {ACTIVITY_LOG.map((entry) => {
            const style = typeStyles[entry.type] || typeStyles.system;
            return (
              <div key={entry.id} className="flex items-start gap-3 py-2 group">
                <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", style.bg)}>
                  <svg className={cn("h-3.5 w-3.5", style.text)} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d={style.icon} clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground">
                    <span className="font-semibold">{entry.user}</span> {entry.action} <span className="text-muted-foreground">{entry.target}</span>
                  </p>
                  <p className="text-[9px] text-muted-foreground/50 mt-0.5">{entry.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
