import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { GROWTH_DATA } from "./data";

export function AIVisibilityGrowth({ className }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const metrics = [
    { key: "aiVisits", label: "AI Visits", current: GROWTH_DATA.aiVisits.current.toLocaleString(), prev: GROWTH_DATA.aiVisits.previous.toLocaleString(), change: GROWTH_DATA.aiVisits.change, icon: "M10 1a4.5 4.5 0 00-4.5 4.5v2.5a2 2 0 00-2 2v4a2 2 0 002 2h9a2 2 0 002-2v-4a2 2 0 00-2-2v-2.5A4.5 4.5 0 0010 1zm-2.5 7V5.5a2.5 2.5 0 015 0V8h-5z" },
    { key: "tokens", label: "Tokens Consumed", current: GROWTH_DATA.tokensConsumed.current, prev: GROWTH_DATA.tokensConsumed.previous, change: GROWTH_DATA.tokensConsumed.change, icon: "M10.362 1.093a.75.75 0 00-.724 0L2.523 5.018 10 9.143l7.477-4.125-7.115-3.925zM18 6.443l-7.25 4v8.25l6.862-3.786A.75.75 0 0018 14.25V6.443zm-8.75 12.25v-8.25l-7.25-4v7.807a.75.75 0 00.388.657l6.862 3.786z" },
    { key: "pagesIndexed", label: "Pages Indexed", current: GROWTH_DATA.pagesIndexed.current.toLocaleString(), prev: GROWTH_DATA.pagesIndexed.previous.toLocaleString(), change: GROWTH_DATA.pagesIndexed.change, icon: "M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5z" },
    { key: "retrieval", label: "Retrieval Rate", current: GROWTH_DATA.retrievalRate.current, prev: GROWTH_DATA.retrievalRate.previous, change: GROWTH_DATA.retrievalRate.change, icon: "M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" },
    { key: "prompt", label: "Prompt Success", current: GROWTH_DATA.promptSuccess.current, prev: GROWTH_DATA.promptSuccess.previous, change: GROWTH_DATA.promptSuccess.change, icon: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" },
  ];

  return (
    <div className={cn("transition-all duration-500", isVisible ? "opacity-100" : "opacity-0", className)}>
      <div className="flex items-center gap-2 mb-3">
        <svg className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.563a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-3.95V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
        </svg>
        <p className="text-xs font-semibold uppercase tracking-widest text-foreground">AI Visibility Growth</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
        {metrics.map((m) => (
          <div key={m.key} className="relative rounded-xl border border-border bg-card p-3 transition-all duration-200 hover:border-accent/30">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d={m.icon} clipRule="evenodd" /></svg>
              </div>
              <span className="text-[9px] font-medium text-muted-foreground/70 uppercase tracking-wider">{m.label}</span>
            </div>
            <p className="font-mono text-sm sm:text-base font-bold tabular-nums text-foreground">{m.current}</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[9px] text-green-500 font-medium">{m.change}</span>
              <span className="text-[8px] text-muted-foreground/40">vs {m.prev}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
