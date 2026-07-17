"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Calendar,
  ChevronDown,
  Download,
  Sparkles,
  User,
  Columns,
  List,
  ArrowUpDown,
  X,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { VIEW_OPTIONS, SORT_OPTIONS, ASSIGNEES } from "./data";

interface HeaderBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  viewMode: string;
  onViewModeChange: (mode: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  selectedAssignee: string;
  onAssigneeChange: (id: string) => void;
  selectedCount: number;
  onBulkComplete: () => void;
  onGeneratePlan: () => void;
}

export function HeaderBar({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  selectedAssignee,
  onAssigneeChange,
  selectedCount,
  onBulkComplete,
  onGeneratePlan,
}: HeaderBarProps) {
  const [showSort, setShowSort] = useState(false);
  const [showAssignee, setShowAssignee] = useState(false);
  const [showView, setShowView] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const assigneeRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setShowSort(false);
      if (assigneeRef.current && !assigneeRef.current.contains(e.target as Node)) setShowAssignee(false);
      if (viewRef.current && !viewRef.current.contains(e.target as Node)) setShowView(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedSort = SORT_OPTIONS.find((s) => s.id === sortBy)?.label || "Priority";
  const selectedAssigneeName = ASSIGNEES.find((a) => a.id === selectedAssignee)?.label || "All Assignees";

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col sm:flex-row items-start sm:items-center gap-3 py-3"
    >
      {/* Left: Search */}
      <div className="relative flex-1 w-full sm:max-w-xs">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search recommendations..."
          className="w-full h-8 rounded-lg border border-border bg-muted/5 pl-8 pr-3 text-[11px] text-foreground placeholder:text-muted-foreground/30 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
        />
      </div>

      {/* Spacer */}
      <div className="hidden sm:block flex-1" />

      {/* Right: Controls */}
      <div className="flex flex-wrap items-center gap-1.5">
        {/* View Mode */}
        <div className="flex items-center rounded-lg border border-border bg-muted/5 p-0.5">
          {VIEW_OPTIONS.map((v) => (
            <button
              key={v.id}
              onClick={() => onViewModeChange(v.id)}
              className={cn(
                "px-2.5 py-1 text-[10px] font-medium rounded-md transition-all",
                viewMode === v.id
                  ? "bg-accent text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {v.id === "table" && <List className="h-3 w-3 inline mr-1" />}
              {v.id === "board" && <Columns className="h-3 w-3 inline mr-1" />}
              {v.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="relative" ref={sortRef}>
          <button
            onClick={() => setShowSort(!showSort)}
            className="flex items-center gap-1.5 h-8 rounded-lg border border-border bg-muted/5 px-2.5 text-[11px] text-muted-foreground hover:text-foreground hover:border-accent/30 transition-all"
            aria-label="Sort by"
          >
            <ArrowUpDown className="h-3 w-3" />
            <span className="hidden sm:inline">{selectedSort}</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </button>
          {showSort && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.96 }}
              className="absolute right-0 top-full mt-1 w-40 rounded-xl border border-border bg-card shadow-xl z-50 py-1"
            >
              {SORT_OPTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { onSortChange(s.id); setShowSort(false); }}
                  className={cn(
                    "w-full px-3 py-1.5 text-[11px] text-left transition-colors",
                    sortBy === s.id
                      ? "text-accent bg-accent/5 font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/10"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Assignee */}
        <div className="relative" ref={assigneeRef}>
          <button
            onClick={() => setShowAssignee(!showAssignee)}
            className="flex items-center gap-1.5 h-8 rounded-lg border border-border bg-muted/5 px-2.5 text-[11px] text-muted-foreground hover:text-foreground hover:border-accent/30 transition-all"
            aria-label="Filter by assignee"
          >
            <User className="h-3 w-3" />
            <span className="hidden sm:inline">{selectedAssigneeName}</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </button>
          {showAssignee && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.96 }}
              className="absolute right-0 top-full mt-1 w-44 rounded-xl border border-border bg-card shadow-xl z-50 py-1"
            >
              {ASSIGNEES.map((a) => (
                <button
                  key={a.id}
                  onClick={() => { onAssigneeChange(a.id); setShowAssignee(false); }}
                  className={cn(
                    "w-full px-3 py-1.5 text-[11px] text-left transition-colors",
                    selectedAssignee === a.id
                      ? "text-accent bg-accent/5 font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/10"
                  )}
                >
                  {a.label}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Export */}
        <button className="flex items-center gap-1.5 h-8 rounded-lg border border-border bg-muted/5 px-2.5 text-[11px] text-muted-foreground hover:text-foreground hover:border-accent/30 transition-all">
          <Download className="h-3 w-3" />
          <span className="hidden sm:inline">Export</span>
        </button>

        {/* Bulk Actions */}
        {selectedCount > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onBulkComplete}
            className="flex items-center gap-1.5 h-8 rounded-lg bg-accent/10 px-3 text-[11px] font-semibold text-accent hover:bg-accent/20 transition-all"
          >
            <X className="h-3 w-3" />
            Complete {selectedCount}
          </motion.button>
        )}

        {/* Generate AI Plan */}
        <button
          onClick={onGeneratePlan}
          className="flex items-center gap-1.5 h-8 rounded-lg bg-accent px-3 text-[11px] font-semibold text-white hover:bg-accent/90 transition-all shadow-sm"
        >
          <Sparkles className="h-3 w-3" />
          <span className="hidden sm:inline">AI Plan</span>
        </button>
      </div>
    </motion.div>
  );
}
