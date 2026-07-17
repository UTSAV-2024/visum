"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";
import { track } from "../lib/analytics";
import {
  WORK_ITEMS,
  CATEGORY_GROUPS,
  PRIORITY_ORDER,
  DIFFICULTY_ORDER,
  type WorkItem,
} from "../components/optimization-workspace/data";
import { HeaderBar } from "../components/optimization-workspace/header-bar";
import { CategorySidebar } from "../components/optimization-workspace/category-sidebar";
import { WorkspaceList } from "../components/optimization-workspace/workspace-list";
import { KanbanView } from "../components/optimization-workspace/kanban-view";
import { InspectorPanel } from "../components/optimization-workspace/inspector-panel";
import { AIProjectManager } from "../components/optimization-workspace/ai-project-manager";
import { ProgressPanel } from "../components/optimization-workspace/progress-panel";
import { DependencyGraph } from "../components/optimization-workspace/dependency-graph";
import { ActivityFeed } from "../components/optimization-workspace/activity-feed";

// ── Skeleton ───────────────────────────────────────────────────

function WorkspaceSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-10 bg-card border border-border rounded-xl w-full" />
      <div className="flex gap-4">
        <div className="hidden lg:block w-52 space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-7 bg-card border border-border rounded-lg" />
          ))}
        </div>
        <div className="flex-1 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-card border border-border rounded-xl" />
          ))}
        </div>
        <div className="hidden xl:block w-80 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 bg-card border border-border rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Empty State ────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="relative mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20">
          <Sparkles className="h-8 w-8 text-accent" />
        </div>
      </div>
      <h2 className="text-lg font-bold text-foreground">AI Optimization Workspace</h2>
      <p className="text-sm text-muted-foreground mt-2 max-w-md leading-relaxed">
        Run your first scan to generate a prioritized list of optimization tasks. Visum will analyze your site and create actionable work items.
      </p>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg">
        {[
          { label: "Scan & Discover", desc: "AI finds every improvement opportunity" },
          { label: "Prioritize", desc: "Tasks ranked by impact and effort" },
          { label: "Implement", desc: "Track progress, collaborate, and measure" },
        ].map((step) => (
          <div key={step.label} className="rounded-xl border border-border bg-card p-4 text-left">
            <p className="text-xs font-bold text-foreground">{step.label}</p>
            <p className="text-[10px] text-muted-foreground/70 mt-1">{step.desc}</p>
          </div>
        ))}
      </div>
      <button className="mt-8 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent/90 transition-all shadow-lg shadow-accent/20">
        Run Full Scan
      </button>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
//  MAIN PAGE
// ═════════════════════════════════════════════════════════════════

export default function OptimizationWorkspace() {
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [sortBy, setSortBy] = useState("priority");
  const [selectedAssignee, setSelectedAssignee] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [items, setItems] = useState<WorkItem[]>([]);

  useEffect(() => {
    const t = setTimeout(() => {
      setItems(WORK_ITEMS.map((r) => ({ ...r })));
      setLoading(false);
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loading) track("optimization_workspace_viewed", {});
  }, [loading]);

  const filteredItems = useMemo(() => {
    let result = [...items];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
      );
    }
    if (selectedCategory) {
      result = result.filter((r) => r.category === selectedCategory);
    }
    if (selectedAssignee !== "all") {
      if (selectedAssignee === "unassigned") {
        result = result.filter((r) => !r.assignee);
      } else {
        result = result.filter(
          (r) => r.assignee?.toLowerCase() === selectedAssignee
        );
      }
    }

    result.sort((a, b) => {
      if (sortBy === "priority") return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (sortBy === "score") return b.scoreImprovement - a.scoreImprovement;
      if (sortBy === "difficulty") return DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty];
      if (sortBy === "time") {
        const timeOrder: Record<string, number> = { "5 min": 1, "10 min": 2, "15 min": 3, "30 min": 4, "2 hours": 5, "3 hours": 6, "4 hours": 7 };
        return (timeOrder[a.implementationTime] || 99) - (timeOrder[b.implementationTime] || 99);
      }
      if (sortBy === "status") {
        const statusOrder: Record<string, number> = { "in-progress": 0, review: 1, todo: 2, backlog: 3, done: 4 };
        return (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
      }
      return 0;
    });

    return result;
  }, [items, searchQuery, selectedCategory, selectedAssignee, sortBy]);

  const selectedItem = items.find((i) => i.id === selectedItemId) || null;

  const handleSelect = useCallback((id: string) => {
    setSelectedItemId((prev) => (prev === id ? null : id));
  }, []);

  const handleToggleComplete = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed, status: r.completed ? "todo" as const : "done" as const } : r))
    );
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const handleBulkComplete = useCallback(() => {
    setItems((prev) => prev.map((r) => (selectedIds.has(r.id) ? { ...r, completed: true, status: "done" as const } : r)));
    setSelectedIds(new Set());
  }, [selectedIds]);

  const handleGeneratePlan = useCallback(() => {
    track("ai_plan_generated", {});
  }, []);

  const hasData = items.length > 0;

  return (
    <>
      <Head>
        <title>Optimization Workspace - Visum</title>
        <meta
          name="description"
          content="AI Optimization Workspace — Convert technical problems into actionable work items. Track recommendations, dependencies, and team progress."
        />
      </Head>

      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {loading ? (
            <WorkspaceSkeleton />
          ) : !hasData ? (
            <EmptyState />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="space-y-4"
            >
              {/* ── Header ──────────────────────────────────── */}
              <div className="flex items-center gap-3">
                <div className="min-w-0">
                  <h1 className="text-base sm:text-lg font-bold text-foreground truncate">Optimization Workspace</h1>
                  <p className="text-[10px] text-muted-foreground/50 truncate">Acme Inc. · {items.filter((i) => i.completed).length}/{items.length} tasks</p>
                </div>
              </div>
              <HeaderBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                sortBy={sortBy}
                onSortChange={setSortBy}
                selectedAssignee={selectedAssignee}
                onAssigneeChange={setSelectedAssignee}
                selectedCount={selectedIds.size}
                onBulkComplete={handleBulkComplete}
                onGeneratePlan={handleGeneratePlan}
              />

              {/* ── Main Content ───────────────────────────── */}
              <div className="relative flex gap-4 sm:gap-5">
                {/* Mobile overlay */}
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
                      onClick={() => setSidebarOpen(false)}
                    />
                  )}
                </AnimatePresence>

                {/* ── Left Sidebar ─────────────────────────── */}
                <motion.aside
                  className={cn(
                    "w-52 shrink-0 overflow-y-auto scrollbar-thin",
                    "fixed left-0 top-0 bottom-0 z-50 bg-background border-r border-border p-4 transform transition-transform duration-300 lg:relative lg:inset-auto lg:z-auto lg:border-none lg:p-0 lg:transform-none",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                  )}
                  aria-label="Task categories"
                >
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground mb-4 transition-colors"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Close
                  </button>
                  <CategorySidebar
                    selected={selectedCategory}
                    onSelect={(id) => { setSelectedCategory(id); setSidebarOpen(false); }}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                  />
                </motion.aside>

                {/* ── Center: Workspace ───────────────────── */}
                <div className="flex-1 min-w-0 space-y-4">
                  {/* Stats bar */}
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60 px-1">
                    <span>
                      <span className="font-semibold text-foreground">{filteredItems.length}</span> tasks
                    </span>
                    <span>·</span>
                    <span>
                      <span className="font-semibold text-green-500">{filteredItems.filter((i) => i.completed).length}</span> completed
                    </span>
                    <span>·</span>
                    <span>
                      <span className="font-semibold text-accent">
                        +{filteredItems.reduce((s, i) => s + (i.completed ? i.scoreImprovement : 0), 0)}
                      </span> pts gained
                    </span>
                  </div>

                  {/* Table View */}
                  {viewMode === "table" && (
                    <div className="rounded-xl border border-border bg-card overflow-hidden">
                      <WorkspaceList
                        items={filteredItems}
                        selectedId={selectedItemId}
                        onSelect={handleSelect}
                        onToggleComplete={handleToggleComplete}
                      />
                    </div>
                  )}

                  {/* Board View */}
                  {viewMode === "board" && (
                    <KanbanView
                      items={filteredItems}
                      selectedId={selectedItemId}
                      onSelect={handleSelect}
                      onToggleComplete={handleToggleComplete}
                    />
                  )}

                  {/* Roadmap View */}
                  {viewMode === "roadmap" && (
                    <div className="space-y-4">
                      <div className="rounded-xl border border-border bg-card p-5">
                        <ProgressPanel />
                      </div>
                      <div className="rounded-xl border border-border bg-card p-5">
                        <DependencyGraph />
                      </div>
                      {/* Timeline list */}
                      <div className="rounded-xl border border-border bg-card overflow-hidden">
                        <WorkspaceList
                          items={filteredItems.filter((i) => !i.completed).sort((a, b) => {
                            if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
                            if (a.dueDate) return -1;
                            if (b.dueDate) return 1;
                            return 0;
                          })}
                          selectedId={selectedItemId}
                          onSelect={handleSelect}
                          onToggleComplete={handleToggleComplete}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Right Panel ──────────────────────────── */}
                <aside className="hidden xl:flex xl:flex-col xl:w-80 shrink-0 gap-4">
                  {/* Inspector */}
                  <div className="rounded-xl border border-border bg-card p-4 flex-1 min-h-0 max-h-[60vh] overflow-hidden">
                    <InspectorPanel
                      item={selectedItem}
                      onClose={() => setSelectedItemId(null)}
                      onToggleComplete={handleToggleComplete}
                    />
                  </div>

                  {/* AI Project Manager */}
                  <div className="rounded-xl border border-border bg-card p-4 max-h-[300px] overflow-hidden">
                    <AIProjectManager />
                  </div>

                  {/* Progress */}
                  <div className="rounded-xl border border-border bg-card p-4">
                    <ProgressPanel />
                  </div>
                </aside>
              </div>

              {/* ── Bottom Row: Activity + Dependencies ─────── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-xl border border-border bg-card p-4">
                  <ActivityFeed />
                </div>
                <div className="hidden lg:block">
                  <DependencyGraph />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
