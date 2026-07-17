import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

interface Insight {
  id: string;
  type: "positive" | "negative" | "neutral" | "anomaly";
  title: string;
  description: string;
  metric?: string;
  value?: string;
}

const insightsData: Insight[] = [
  {
    id: "1",
    type: "positive",
    title: "Retrieval success rate improving",
    description: "Your content retrieval rate has increased by 14% over the past 7 days, with GPT-4o showing the highest success rate at 94%.",
    metric: "Retrieval Rate",
    value: "+14%",
  },
  {
    id: "2",
    type: "anomaly",
    title: "Unusual crawl pattern detected",
    description: "Claude-Web crawled 2.3x more pages than usual on July 14. This may indicate increased interest in your content or a re-indexing event.",
    metric: "Crawl Activity",
    value: "2.3x",
  },
  {
    id: "3",
    type: "positive",
    title: "AI traffic growing steadily",
    description: "AI bot visits have grown 18% week-over-week. PerplexityBot showed the largest increase at 22%, suggesting your content is gaining traction.",
    metric: "Traffic Growth",
    value: "+18%",
  },
  {
    id: "4",
    type: "negative",
    title: "Token consumption trending up",
    description: "Token usage increased 23% this month. While this indicates more AI engagement, it may also signal inefficient content retrieval patterns.",
    metric: "Token Usage",
    value: "+23%",
  },
  {
    id: "5",
    type: "neutral",
    title: "Structured data coverage 68%",
    description: "Only 68% of your pages have complete JSON-LD structured data. Adding schema markup to the remaining pages could improve AI understanding by up to 40%.",
    metric: "Coverage",
    value: "68%",
  },
];

const typeStyles = {
  positive: {
    icon: (
      <svg className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
          clipRule="evenodd"
        />
      </svg>
    ),
    bg: "bg-green-500/5 border-l-green-500/40",
    badge: "bg-green-500/10 text-green-500",
    label: "Improvement",
  },
  negative: {
    icon: (
      <svg className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
    bg: "bg-red-500/5 border-l-red-500/40",
    badge: "bg-red-500/10 text-red-500",
    label: "Warning",
  },
  neutral: {
    icon: (
      <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
          clipRule="evenodd"
        />
      </svg>
    ),
    bg: "bg-accent/5 border-l-accent/40",
    badge: "bg-accent/10 text-accent",
    label: "Insight",
  },
  anomaly: {
    icon: (
      <svg className="h-4 w-4 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M10 1a9 9 0 100 18 9 9 0 000-18zm.75 5.25a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5zM10 13a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
    bg: "bg-orange-500/5 border-l-orange-500/40",
    badge: "bg-orange-500/10 text-orange-500",
    label: "Anomaly",
  },
};

export function InsightsPanel({ className }: { className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-border bg-card transition-all duration-500",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none rounded-2xl" />

      <div className="relative z-10 p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 1a4.5 4.5 0 00-4.5 4.5v2.5a2 2 0 00-2 2v4a2 2 0 002 2h9a2 2 0 002-2v-4a2 2 0 00-2-2v-2.5A4.5 4.5 0 0010 1zm-2.5 7V5.5a2.5 2.5 0 015 0V8h-5z"
              />
            </svg>
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground">
              AI-Generated Insights
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse-dot" />
            Updated just now
          </div>
        </div>

        {/* Insight cards */}
        <div className="space-y-3">
          {insightsData.map((insight) => {
            const styles = typeStyles[insight.type];
            const isExpanded = expandedId === insight.id;

            return (
              <div
                key={insight.id}
                className={cn(
                  "rounded-xl border-l-2 p-4 transition-all duration-200 cursor-pointer",
                  styles.bg,
                  "hover:bg-muted/10"
                )}
                onClick={() => setExpandedId(isExpanded ? null : insight.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">{styles.icon}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-xs font-semibold text-foreground">
                        {insight.title}
                      </h4>
                      <span className={cn("rounded-md px-1.5 py-0.5 text-[9px] font-semibold", styles.badge)}>
                        {styles.label}
                      </span>
                    </div>

                    <p className={cn(
                      "text-[11px] text-muted-foreground leading-relaxed transition-all duration-200",
                      isExpanded ? "" : "line-clamp-2"
                    )}>
                      {insight.description}
                    </p>

                    {insight.metric && insight.value && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[9px] text-muted-foreground/60 uppercase tracking-wider">
                          {insight.metric}:
                        </span>
                        <span className={cn(
                          "font-mono text-[11px] font-bold",
                          insight.type === "positive" ? "text-green-500" :
                          insight.type === "negative" ? "text-red-500" :
                          insight.type === "anomaly" ? "text-orange-500" :
                          "text-accent"
                        )}>
                          {insight.value}
                        </span>
                      </div>
                    )}

                    <p className={cn(
                      "text-[9px] text-muted-foreground/40 mt-2 transition-opacity",
                      isExpanded ? "opacity-100" : "opacity-0"
                    )}>
                      {isExpanded ? "Click to collapse" : "Click to expand"}
                    </p>
                  </div>

                  <svg
                    className={cn(
                      "h-4 w-4 text-muted-foreground/40 mt-1 transition-transform duration-200 shrink-0",
                      isExpanded && "rotate-180"
                    )}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground/60">
          <span>5 insights generated from your scan data</span>
          <span>Powered by AI analysis</span>
        </div>
      </div>
    </div>
  );
}
