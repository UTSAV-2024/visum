import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { COMPETITORS, RECOMMENDATIONS_COMPARISON } from "./data";

export function RecommendationComparison({ className }) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedComp, setSelectedComp] = useState(COMPETITORS[0].name);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const competitorRecs = RECOMMENDATIONS_COMPARISON.competitors[selectedComp] || [];

  return (
    <div className={cn("relative rounded-2xl border border-border bg-card transition-all duration-500", isVisible ? "opacity-100" : "opacity-0", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none rounded-2xl" />
      <div className="relative z-10 p-5">
        <div className="flex items-center gap-2 mb-4">
          <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.403 4.652a3 3 0 00-4.242 0L4.5 12.31A3 3 0 003.72 14.5l-.824 2.473a.75.75 0 00.928.928l2.473-.824a3 3 0 002.19-.78l7.66-7.662a3 3 0 000-4.242l-.344-.343z" clipRule="evenodd" />
          </svg>
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Recommendation Comparison</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Your recommendations */}
          <div>
            <p className="text-[10px] font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Your Recommendations
              <span className="text-muted-foreground/60 font-normal">({RECOMMENDATIONS_COMPARISON.yours.length})</span>
            </p>
            <div className="space-y-1">
              {RECOMMENDATIONS_COMPARISON.yours.map((r, idx) => (
                <div key={idx} className="flex items-center gap-2 rounded-lg bg-accent/5 px-3 py-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-accent/10 text-[9px] font-bold text-accent">{idx + 1}</span>
                  <span className="text-[10px] text-foreground flex-1">{r.text}</span>
                  <span className={cn("text-[9px] font-semibold", r.priority === "critical" ? "text-red-500" : r.priority === "high" ? "text-orange-500" : "text-accent")}>
                    +{r.gain}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Competitor recommendations */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-[#6366f1]" />
              <div className="flex-1">
                <select value={selectedComp} onChange={(e) => setSelectedComp(e.target.value)}
                  className="text-[10px] font-semibold text-foreground bg-transparent border-none outline-none cursor-pointer">
                  {COMPETITORS.filter((c) => c.name !== "Your Site").map((c) => (
                    <option key={c.name} value={c.name}>{c.name} Recommendations</option>
                  ))}
                </select>
              </div>
              <span className="text-muted-foreground/60 text-[9px]">({competitorRecs.length})</span>
            </div>
            <div className="space-y-1">
              {competitorRecs.length > 0 ? competitorRecs.map((r, idx) => (
                <div key={idx} className="flex items-center gap-2 rounded-lg bg-[#6366f1]/5 px-3 py-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#6366f1]/10 text-[9px] font-bold text-[#6366f1]">{idx + 1}</span>
                  <span className="text-[10px] text-foreground flex-1">{r.text}</span>
                  <span className={cn("text-[9px] font-semibold", r.priority === "critical" ? "text-red-500" : r.priority === "high" ? "text-orange-500" : "text-[#6366f1]")}>
                    +{r.gain}
                  </span>
                </div>
              )) : (
                <p className="text-[10px] text-muted-foreground/60 py-4 text-center">No data available</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-border text-[9px] text-muted-foreground/40 text-center">
          {RECOMMENDATIONS_COMPARISON.yours.length > competitorRecs.length
            ? "You have more improvement opportunities available"
            : competitorRecs.length > RECOMMENDATIONS_COMPARISON.yours.length
            ? `${selectedComp} has more improvement opportunities`
            : "Similar number of improvements needed"}
        </div>
      </div>
    </div>
  );
}
