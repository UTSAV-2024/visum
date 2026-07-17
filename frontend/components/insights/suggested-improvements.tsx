import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

const IMPROVEMENTS = [
  { priority: "critical", text: "Allow GPTBot and Claude-Web in robots.txt", impact: "+15 pts", effort: "5 min" },
  { priority: "critical", text: "Add JSON-LD structured data to homepage", impact: "+12 pts", effort: "30 min" },
  { priority: "high", text: "Optimize page load speed for AI crawlers", impact: "+10 pts", effort: "2 hours" },
  { priority: "medium", text: "Create llms.txt file for AI assistants", impact: "+8 pts", effort: "15 min" },
  { priority: "medium", text: "Implement MCP endpoint for AI agents", impact: "+10 pts", effort: "4 hours" },
  { priority: "low", text: "Improve meta descriptions and OG tags", impact: "+8 pts", effort: "10 min" },
];

const pColors = {
  critical: { dot: "bg-red-500", text: "text-red-500", bg: "bg-red-500/10" },
  high: { dot: "bg-orange-500", text: "text-orange-500", bg: "bg-orange-500/10" },
  medium: { dot: "bg-accent", text: "text-accent", bg: "bg-accent/10" },
  low: { dot: "bg-green-500", text: "text-green-500", bg: "bg-green-500/10" },
};

export function SuggestedImprovements({ className }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={cn("relative rounded-2xl border border-border bg-card p-5 transition-all duration-500", isVisible ? "opacity-100" : "opacity-0", className)}>
      <div className="flex items-center gap-2 mb-3">
        <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.403 4.652a3 3 0 00-4.242 0L4.5 12.31A3 3 0 003.72 14.5l-.824 2.473a.75.75 0 00.928.928l2.473-.824a3 3 0 002.19-.78l7.66-7.662a3 3 0 000-4.242l-.344-.343z" clipRule="evenodd" />
        </svg>
        <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Suggested Improvements</p>
      </div>

      <div className="space-y-1">
        {IMPROVEMENTS.map((imp, idx) => {
          const pc = pColors[imp.priority];
          return (
            <div key={idx} className="flex items-center gap-2.5 py-2 px-2 rounded-lg hover:bg-muted/10 transition-colors">
              <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", pc.dot)} />
              <span className="flex-1 text-[11px] text-foreground">{imp.text}</span>
              <span className={cn("font-mono text-[10px] font-bold shrink-0", pc.text)}>{imp.impact}</span>
              <span className="text-[9px] text-muted-foreground/60 shrink-0 w-12 text-right">{imp.effort}</span>
              <button className="shrink-0 rounded-lg bg-accent/10 px-2 py-1 text-[9px] font-semibold text-accent hover:bg-accent/20 transition-colors opacity-0 group-hover:opacity-100">
                Fix
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
