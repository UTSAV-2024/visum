import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

const CATEGORIES = ["All", "Crawlability", "Structured Data", "Performance", "Documentation", "Integration", "Meta", "SEO", "Rendering"];
const SORT_OPTIONS = [
  { key: "priority", label: "Priority" },
  { key: "score", label: "Score Impact" },
  { key: "difficulty", label: "Difficulty" },
  { key: "time", label: "Time" },
];

export function FilterBar({
  searchQuery,
  onSearchChange,
  priorityFilter,
  onPriorityChange,
  categoryFilter,
  onCategoryChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  selectedCount,
  onBulkComplete,
  onBulkReset,
  className,
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={cn(
        "space-y-3 transition-all duration-500",
        isVisible ? "opacity-100" : "opacity-0",
        className
      )}
    >
      {/* Search + View Toggle */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search recommendations..."
            className="w-full h-9 rounded-lg border border-border bg-card pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>

        {/* View toggle */}
        <div className="flex rounded-lg border border-border bg-card p-0.5">
          <button
            onClick={() => onViewModeChange?.("list")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-semibold transition-all",
              viewMode === "list"
                ? "bg-accent/10 text-accent shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M2 3.75A.75.75 0 012.75 3h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 3.75zm0 4.167a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zm0 4.166a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zm0 4.167a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z"
                clipRule="evenodd"
              />
            </svg>
            List
          </button>
          <button
            onClick={() => onViewModeChange?.("kanban")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-semibold transition-all",
              viewMode === "kanban"
                ? "bg-accent/10 text-accent shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 3.75A.75.75 0 012.75 3h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 3.75zm0 4.167a.75.75 0 01.75-.75h5.5a.75.75 0 010 1.5h-5.5a.75.75 0 01-.75-.75zm0 4.166a.75.75 0 01.75-.75h5.5a.75.75 0 010 1.5h-5.5a.75.75 0 01-.75-.75zm8.5 0a.75.75 0 01.75-.75h5.5a.75.75 0 010 1.5h-5.5a.75.75 0 01-.75-.75zm-8.5 4.167a.75.75 0 01.75-.75h5.5a.75.75 0 010 1.5h-5.5a.75.75 0 01-.75-.75zm8.5 0a.75.75 0 01.75-.75h5.5a.75.75 0 010 1.5h-5.5a.75.75 0 01-.75-.75z" />
            </svg>
            Board
          </button>
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Priority filter */}
        <select
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="h-8 rounded-lg border border-border bg-card px-2.5 text-[10px] font-medium text-muted-foreground outline-none focus:border-accent"
          aria-label="Filter by priority"
        >
          <option value="all">All Priorities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {/* Category filter */}
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="h-8 rounded-lg border border-border bg-card px-2.5 text-[10px] font-medium text-muted-foreground outline-none focus:border-accent"
          aria-label="Filter by category"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat === "All" ? "all" : cat}>{cat}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="h-8 rounded-lg border border-border bg-card px-2.5 text-[10px] font-medium text-muted-foreground outline-none focus:border-accent"
          aria-label="Sort by"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>{opt.label}</option>
          ))}
        </select>

        {/* Bulk actions */}
        {selectedCount > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-[10px] text-muted-foreground">{selectedCount} selected</span>
            <button
              onClick={onBulkComplete}
              className="inline-flex items-center gap-1 rounded-lg bg-accent/10 px-2.5 py-1 text-[10px] font-semibold text-accent hover:bg-accent/20 transition-colors"
            >
              Mark done
            </button>
            <button
              onClick={onBulkReset}
              className="inline-flex items-center gap-1 rounded-lg bg-muted/20 px-2.5 py-1 text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
