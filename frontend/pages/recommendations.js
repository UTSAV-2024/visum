import { useEffect, useState, useMemo, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "../lib/utils";
import { track } from "../lib/analytics";
import { ALL_RECS, PRIORITY_ORDER, DIFFICULTY_ORDER } from "../components/recommendations/data";
import { RecCard } from "../components/recommendations/rec-card";
import { ProgressTracker } from "../components/recommendations/progress-tracker";
import { FilterBar } from "../components/recommendations/filter-bar";
import { AchievementSystem } from "../components/recommendations/achievement-system";
import { RecsSkeleton } from "../components/recommendations/loading-skeleton";

export default function Recommendations() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("priority");
  const [viewMode, setViewMode] = useState("list");
  const [selectedIds, setSelectedIds] = useState(new Set());

  useEffect(() => {
    const t = setTimeout(() => {
      setRecommendations(ALL_RECS.map((r) => ({ ...r })));
      setLoading(false);
    }, 1400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loading) track("recommendations_viewed", { total: ALL_RECS.length });
  }, [loading]);

  const completionPct = recommendations.length > 0
    ? Math.round((recommendations.filter((r) => r.completed).length / recommendations.length) * 100)
    : 0;

  // Filter + sort
  const filtered = useMemo(() => {
    let result = [...recommendations];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
      );
    }
    if (priorityFilter !== "all") {
      result = result.filter((r) => r.priority === priorityFilter);
    }
    if (categoryFilter !== "all") {
      result = result.filter((r) => r.category === categoryFilter);
    }

    result.sort((a, b) => {
      if (sortBy === "priority") return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (sortBy === "score") return b.scoreImprovement - a.scoreImprovement;
      if (sortBy === "difficulty") return DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty];
      if (sortBy === "time") {
        const timeOrder = { "5 min": 1, "10 min": 2, "15 min": 3, "30 min": 4, "2 hours": 5, "3 hours": 6, "4 hours": 7 };
        return (timeOrder[a.implementationTime] || 99) - (timeOrder[b.implementationTime] || 99);
      }
      return 0;
    });

    return result;
  }, [recommendations, searchQuery, priorityFilter, categoryFilter, sortBy]);

  const grouped = useMemo(() => {
    if (viewMode !== "kanban") return null;
    const groups = { critical: [], high: [], medium: [], low: [] };
    filtered.forEach((r) => groups[r.priority]?.push(r));
    return groups;
  }, [filtered, viewMode]);

  const toggleComplete = useCallback((id) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const handleApplyFix = useCallback((id) => {
    track("recommendation_fix_applied", { rec_id: id });
    setTimeout(() => {
      setRecommendations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, completed: true } : r))
      );
    }, 800);
  }, []);

  const handleSelectToggle = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleBulkComplete = useCallback(() => {
    setRecommendations((prev) =>
      prev.map((r) => (selectedIds.has(r.id) ? { ...r, completed: true } : r))
    );
    setSelectedIds(new Set());
  }, [selectedIds]);

  const handleBulkReset = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const priorityHeaders = [
    { key: "critical", label: "Critical", color: "bg-red-500", bg: "bg-red-500/10", text: "text-red-500", border: "border-red-500/30" },
    { key: "high", label: "High", color: "bg-orange-500", bg: "bg-orange-500/10", text: "text-orange-500", border: "border-orange-500/30" },
    { key: "medium", label: "Medium", color: "bg-accent", bg: "bg-accent/10", text: "text-accent", border: "border-accent/30" },
    { key: "low", label: "Low", color: "bg-green-500", bg: "bg-green-500/10", text: "text-green-500", border: "border-green-500/30" },
  ];

  return (
    <>
      <Head>
        <title>Recommendations - Visum</title>
        <meta name="description" content="AI-powered recommendations to improve your website's visibility to AI systems." />
      </Head>

      <div>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-8">
          {loading ? (
            <RecsSkeleton />
          ) : (
            <div className="animate-fadeIn space-y-4 sm:space-y-6">
              {/* Page Header */}
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">Recommendations</h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  AI-powered fixes to improve your visibility to GPT, Claude, Gemini, and Perplexity
                </p>
              </div>

              {/* Progress + Achievements */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2">
                  <ProgressTracker recommendations={recommendations} />
                </div>
                <AchievementSystem completionPct={completionPct} />
              </div>

              {/* Filter Bar */}
              <FilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                priorityFilter={priorityFilter}
                onPriorityChange={setPriorityFilter}
                categoryFilter={categoryFilter}
                onCategoryChange={setCategoryFilter}
                sortBy={sortBy}
                onSortChange={setSortBy}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                selectedCount={selectedIds.size}
                onBulkComplete={handleBulkComplete}
                onBulkReset={handleBulkReset}
              />

              {/* Grouped count */}
              <div className="text-[10px] text-muted-foreground/60">
                Showing {filtered.length} of {recommendations.length} recommendations
                {searchQuery && ` matching "${searchQuery}"`}
              </div>

              {/* List View */}
              {viewMode === "list" && (
                <div className="space-y-3">
                  {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <svg className="h-12 w-12 text-muted-foreground/30 mb-3" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-sm font-medium text-muted-foreground">No recommendations match your filters</p>
                      <button
                        onClick={() => { setSearchQuery(""); setPriorityFilter("all"); setCategoryFilter("all"); }}
                        className="mt-2 text-xs text-accent hover:text-accent/80"
                      >
                        Clear all filters
                      </button>
                    </div>
                  ) : (
                    filtered.map((rec) => (
                      <RecCard
                        key={rec.id}
                        rec={rec}
                        onToggleComplete={toggleComplete}
                        onApplyFix={handleApplyFix}
                        onSelectToggle={handleSelectToggle}
                        isSelected={selectedIds.has(rec.id)}
                        viewMode="list"
                      />
                    ))
                  )}
                </div>
              )}

              {/* Kanban / Board View */}
              {viewMode === "kanban" && grouped && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {priorityHeaders.map((ph) => {
                    const items = grouped[ph.key] || [];
                    return (
                      <div key={ph.key} className="rounded-2xl border border-border bg-card/50 p-3">
                        <div className="flex items-center justify-between mb-3 px-1">
                          <div className="flex items-center gap-2">
                            <span className={cn("h-2 w-2 rounded-full", ph.color)} />
                            <span className="text-[11px] font-semibold text-foreground">{ph.label}</span>
                          </div>
                          <span className={cn("text-[10px] font-mono font-bold px-1.5 py-0.5 rounded", ph.bg, ph.text)}>
                            {items.length}
                          </span>
                        </div>
                        <div className={cn("space-y-2 min-h-[120px]", items.length === 0 && "flex items-center justify-center")}>
                          {items.length === 0 ? (
                            <p className="text-[10px] text-muted-foreground/40 text-center py-8">No items</p>
                          ) : (
                            items.map((rec) => (
                              <RecCard
                                key={rec.id}
                                rec={rec}
                                onToggleComplete={toggleComplete}
                                onApplyFix={handleApplyFix}
                                onSelectToggle={handleSelectToggle}
                                isSelected={selectedIds.has(rec.id)}
                                viewMode="kanban"
                              />
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Roadmap section */}
              <div className="relative rounded-2xl border border-border bg-card overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none" />
                <div className="relative z-10 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Roadmap</p>
                  </div>

                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />

                    {recommendations
                      .filter((r) => !r.completed)
                      .slice(0, 5)
                      .map((rec, idx) => (
                        <div key={rec.id} className="relative flex items-start gap-3 py-2 group">
                          <div className={cn(
                            "relative z-10 mt-0.5 h-3.5 w-3.5 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                            idx === 0 ? "border-accent bg-accent/20" : "border-border bg-card",
                            idx === 0 && "ring-2 ring-accent/20"
                          )}>
                            {idx === 0 && <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-dot" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={cn("text-xs font-medium", idx === 0 ? "text-foreground" : "text-muted-foreground")}>
                              {rec.title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className={cn(
                                "text-[9px] font-medium",
                                rec.priority === "critical" ? "text-red-500" : rec.priority === "high" ? "text-orange-500" : rec.priority === "medium" ? "text-accent" : "text-green-500"
                              )}>
                                {rec.priority}
                              </span>
                              <span className="text-[9px] text-muted-foreground/60">·</span>
                              <span className="text-[9px] text-muted-foreground/60">+{rec.scoreImprovement} pts</span>
                              <span className="text-[9px] text-muted-foreground/60">·</span>
                              <span className="text-[9px] text-muted-foreground/60">{rec.implementationTime}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {recommendations.filter((r) => !r.completed).length === 0 && (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <svg className="h-8 w-8 text-green-500/50 mb-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      <p className="text-xs font-medium text-muted-foreground">All recommendations completed!</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-0.5">Run a new scan to get updated recommendations.</p>
                    </div>
                  )}

                  {recommendations.filter((r) => !r.completed).length > 5 && (
                    <p className="text-[10px] text-muted-foreground/40 text-center mt-3">
                      +{recommendations.filter((r) => !r.completed).length - 5} more recommendations
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
