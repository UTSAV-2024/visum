import { cn } from "../../lib/utils";

const TABS = [
  { id: "issues", label: "Issues", icon: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" },
  { id: "checks", label: "All Checks", icon: "M16.403 4.652a3 3 0 00-4.242 0L4.5 12.31A3 3 0 003.72 14.5l-.824 2.473a.75.75 0 00.928.928l2.473-.824a3 3 0 002.19-.78l7.66-7.662a3 3 0 000-4.242l-.344-.343z" },
  { id: "performance", label: "Performance", icon: "M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" },
  { id: "seo", label: "SEO", icon: "M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5z" },
  { id: "ai-visibility", label: "AI Visibility", icon: "M10 1a4.5 4.5 0 00-4.5 4.5v2.5a2 2 0 00-2 2v4a2 2 0 002 2h9a2 2 0 002-2v-4a2 2 0 00-2-2v-2.5A4.5 4.5 0 0010 1zm-2.5 7V5.5a2.5 2.5 0 015 0V8h-5z" },
];

export function TabGroup({ activeTab, onTabChange, checkCounts, className }) {
  const getCount = (tabId) => {
    if (!checkCounts) return null;
    if (tabId === "issues") return checkCounts.failed + checkCounts.warnings;
    if (tabId === "checks") return checkCounts.total;
    return null;
  };

  return (
    <div className={cn("border-b border-border", className)}>
      <div className="flex gap-0 -mb-px overflow-x-auto scrollbar-none">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = getCount(tab.id);
          return (              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-[11px] sm:text-xs font-semibold whitespace-nowrap border-b-2 transition-all duration-200",
                  isActive
                    ? "border-accent text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
                )}
              >
              <svg className="h-3.5 w-3.5 hidden sm:block" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d={tab.icon} clipRule="evenodd" />
              </svg>
              {tab.label}
              {count !== null && (
                <span className={cn(
                  "rounded-full px-1.5 py-0.5 text-[9px] font-bold",
                  isActive ? "bg-accent/10 text-accent" : "bg-muted/20 text-muted-foreground"
                )}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
