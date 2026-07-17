import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { AI_INSIGHTS } from "./data";

const typeConfig = {
  prediction: {
    icon: "M10 1a4.5 4.5 0 00-4.5 4.5v2.5a2 2 0 00-2 2v4a2 2 0 002 2h9a2 2 0 002-2v-4a2 2 0 00-2-2v-2.5A4.5 4.5 0 0010 1zm-2.5 7V5.5a2.5 2.5 0 015 0V8h-5z",
    border: "border-l-accent/40 bg-accent/[0.02]",
    badge: "bg-accent/10 text-accent",
    label: "Prediction",
  },
  risk: {
    icon: "M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z",
    border: "border-l-red-500/40 bg-red-500/[0.02]",
    badge: "bg-red-500/10 text-red-500",
    label: "Risk",
  },
  opportunity: {
    icon: "M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z",
    border: "border-l-green-500/40 bg-green-500/[0.02]",
    badge: "bg-green-500/10 text-green-500",
    label: "Opportunity",
  },
};

export function InsightCards({ className }) {
  const [isVisible, setIsVisible] = useState(false);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={cn("space-y-3 transition-all duration-500", isVisible ? "opacity-100" : "opacity-0", className)}>
      <div className="flex items-center gap-2">
        <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
        </svg>
        <p className="text-xs font-semibold uppercase tracking-widest text-foreground">AI-Generated Insights</p>
        <span className="text-[9px] text-muted-foreground/60">· Powered by AI</span>
      </div>

      {AI_INSIGHTS.map((insight) => {
        const config = typeConfig[insight.type];
        const isExpanded = expanded === insight.id;

        return (
          <div
            key={insight.id}
            onClick={() => setExpanded(isExpanded ? null : insight.id)}
            className={cn("relative rounded-xl border-l-2 p-4 cursor-pointer transition-all duration-200 hover:bg-muted/5", config.border)}
          >
            <div className="flex items-start gap-3">                <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", config.badge)}>
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d={config.icon} clipRule="evenodd" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  <span className={cn("rounded px-1.5 py-px text-[9px] font-semibold", config.badge)}>{config.label}</span>
                  <span className="text-[9px] text-muted-foreground/50">{insight.timeLabel}</span>
                  <span className="ml-auto text-[9px] text-muted-foreground/50">{insight.confidence}% confidence</span>
                </div>
                <h4 className="text-xs font-semibold text-foreground">{insight.title}</h4>
                <p className={cn("text-[11px] text-muted-foreground mt-1 leading-relaxed transition-all", isExpanded ? "" : "line-clamp-2")}>
                  {insight.description}
                </p>
                {isExpanded && (
                  <div className="mt-2 pt-2 border-t border-border flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[9px] text-muted-foreground/60">
                      <span className={cn("h-1.5 w-1.5 rounded-full", insight.confidence >= 85 ? "bg-green-500" : insight.confidence >= 70 ? "bg-orange-500" : "bg-accent")} />
                      {insight.confidence}% confidence
                    </span>
                    <button className="ml-auto rounded-lg bg-accent/10 px-2 py-1 text-[9px] font-semibold text-accent hover:bg-accent/20 transition-colors">
                      Apply Insight
                    </button>
                  </div>
                )}
              </div>
              <svg className={cn("h-4 w-4 text-muted-foreground/30 mt-1 transition-transform shrink-0", isExpanded && "rotate-180")} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}
