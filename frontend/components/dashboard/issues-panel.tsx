import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

interface Issue {
  id: string;
  name: string;
  severity: "critical" | "major" | "minor";
  category: string;
  fixed?: boolean;
}

interface IssuesPanelProps {
  className?: string;
}

const defaultIssues: Issue[] = [
  { id: "1", name: "Robots.txt blocks GPTBot", severity: "critical", category: "Crawlability" },
  { id: "2", name: "Missing JSON-LD structured data", severity: "critical", category: "Structured Data" },
  { id: "3", name: "No llms.txt file found", severity: "major", category: "Documentation" },
  { id: "4", name: "Slow page load time (4.2s)", severity: "major", category: "Performance" },
  { id: "5", name: "Incomplete meta tags", severity: "minor", category: "Meta" },
  { id: "6", name: "Missing Open Graph images", severity: "minor", category: "Meta" },
];

const severityColors = {
  critical: {
    dot: "bg-red-500",
    bg: "bg-red-500/10",
    text: "text-red-500",
    badge: "bg-red-500/15 text-red-500",
  },
  major: {
    dot: "bg-orange-500",
    bg: "bg-orange-500/10",
    text: "text-orange-500",
    badge: "bg-orange-500/15 text-orange-500",
  },
  minor: {
    dot: "bg-accent",
    bg: "bg-accent/10",
    text: "text-accent",
    badge: "bg-accent/15 text-accent",
  },
};

export function IssuesPanel({ className }: IssuesPanelProps) {
  const [activeTab, setActiveTab] = useState<"issues" | "recommendations">("issues");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const issues = defaultIssues;
  const criticalCount = issues.filter((i) => i.severity === "critical").length;
  const majorCount = issues.filter((i) => i.severity === "major").length;

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-border bg-card transition-all duration-500 hover:border-accent/30",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none rounded-2xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="p-5 pb-3">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground">
              Issues & Recommendations
            </p>
            <span className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-0.5 text-[10px] font-bold text-red-500">
              {issues.length} issues
            </span>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 rounded-lg bg-muted/20 p-0.5">              {(["issues", "recommendations"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  aria-selected={activeTab === tab}
                  role="tab"
                  className={cn(
                    "flex-1 rounded-md px-3 py-1.5 text-[11px] font-semibold transition-all duration-200",
                    activeTab === tab
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                {tab === "issues" ? "Issues" : "Recommendations"}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-3 pb-3">
          {activeTab === "issues" ? (
            <div className="space-y-1">
              {/* Severity summary */}
              <div className="flex gap-3 px-2 py-2 mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-[10px] text-muted-foreground">
                    {criticalCount} critical
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-orange-500" />
                  <span className="text-[10px] text-muted-foreground">
                    {majorCount} major
                  </span>
                </div>
              </div>

              {issues.map((issue) => {
                const colors = severityColors[issue.severity];
                return (
                  <div
                    key={issue.id}
                    className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-muted/20 cursor-pointer"
                  >
                    <span
                      className={cn("h-2 w-2 shrink-0 rounded-full", colors.dot)}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-foreground group-hover:text-accent transition-colors">
                        {issue.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {issue.category}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-md px-2 py-0.5 text-[9px] font-semibold",
                        colors.badge
                      )}
                    >
                      {issue.severity}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-1.5 px-2 py-3">
              {[
                {
                  title: 'Add "Allow: GPTBot" to robots.txt',
                  impact: "High",
                  effort: "Low",
                },
                {
                  title: "Implement JSON-LD structured data",
                  impact: "High",
                  effort: "Medium",
                },
                {
                  title: "Create an llms.txt file",
                  impact: "Medium",
                  effort: "Low",
                },
                {
                  title: "Optimize page load speed",
                  impact: "Medium",
                  effort: "Medium",
                },
                {
                  title: "Add Open Graph meta tags",
                  impact: "Low",
                  effort: "Low",
                },
              ].map((rec, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-muted/20"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent/10 text-[10px] font-bold text-accent">
                      {idx + 1}
                    </span>
                    <p className="text-xs font-medium text-foreground truncate">
                      {rec.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="rounded-md bg-green-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-green-500">
                      {rec.impact} impact
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {rec.effort}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
