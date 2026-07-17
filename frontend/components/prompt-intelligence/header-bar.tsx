"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Clock,
  Download,
  Save,
  Eye,
  ChevronDown,
  Calendar,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { TIME_RANGES, ENGINES, SAVED_VIEWS } from "./data";

interface HeaderBarProps {
  selectedEngine: string;
  onEngineChange: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedView: string;
  onViewChange: (id: string) => void;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
}

export function HeaderBar({
  selectedEngine,
  onEngineChange,
  searchQuery,
  onSearchChange,
  selectedView,
  onViewChange,
  isMenuOpen,
  onMenuToggle,
}: HeaderBarProps) {
  const [timeRange, setTimeRange] = useState("7d");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showViewPicker, setShowViewPicker] = useState(false);
  const timeRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (timeRef.current && !timeRef.current.contains(e.target as Node)) setShowTimePicker(false);
      if (viewRef.current && !viewRef.current.contains(e.target as Node)) setShowViewPicker(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedTimeLabel = TIME_RANGES.find((t) => t.id === timeRange)?.label || "Last 7 days";
  const selectedViewLabel = SAVED_VIEWS.find((v) => v.id === selectedView)?.label || "All Prompts";

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pb-4 border-b border-border/50"
    >
      {/* Left: Workspace + Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuToggle}
          className="lg:hidden flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted/10 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Filter className="h-3.5 w-3.5" />
        </button>
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-foreground truncate">Prompt Intelligence</h1>
          <p className="text-[10px] text-muted-foreground/50 truncate">Acme Inc. · Production</p>
        </div>
      </div>

      {/* Spacer */}
      <div className="hidden sm:block flex-1" />

      {/* Right: Controls */}
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        {/* Search */}
        <div className="relative flex-1 sm:flex-none sm:w-56">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search prompts..."
            className="w-full h-8 rounded-lg border border-border bg-muted/5 pl-8 pr-3 text-[11px] text-foreground placeholder:text-muted-foreground/30 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
          />
        </div>

        {/* Time Range */}
        <div className="relative" ref={timeRef}>
          <button
            onClick={() => setShowTimePicker(!showTimePicker)}
            className="flex items-center gap-1.5 h-8 rounded-lg border border-border bg-muted/5 px-2.5 text-[11px] text-muted-foreground hover:text-foreground hover:border-accent/30 transition-all"
          >
            <Calendar className="h-3 w-3" />
            <span className="hidden sm:inline">{selectedTimeLabel}</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </button>
          {showTimePicker && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.96 }}
              className="absolute right-0 top-full mt-1 w-40 rounded-xl border border-border bg-card shadow-xl z-50 py-1"
            >
              {TIME_RANGES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setTimeRange(t.id); setShowTimePicker(false); }}
                  className={cn(
                    "w-full px-3 py-1.5 text-[11px] text-left transition-colors",
                    timeRange === t.id
                      ? "text-accent bg-accent/5 font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/10"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Engine Selector */}
        <div className="hidden sm:flex items-center gap-1 rounded-lg border border-border bg-muted/5 p-0.5">
          {ENGINES.slice(0, 4).map((eng) => (
            <button
              key={eng.id}
              onClick={() => onEngineChange(eng.id)}
              className={cn(
                "px-2.5 py-1 text-[10px] font-medium rounded-md transition-all",
                selectedEngine === eng.id
                  ? "bg-accent text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {eng.label}
            </button>
          ))}
          {ENGINES.length > 4 && (
            <span className="text-[9px] text-muted-foreground/40 px-1">+{ENGINES.length - 4}</span>
          )}
        </div>

        {/* Saved Views */}
        <div className="relative" ref={viewRef}>
          <button
            onClick={() => setShowViewPicker(!showViewPicker)}
            className="flex items-center gap-1.5 h-8 rounded-lg border border-border bg-muted/5 px-2.5 text-[11px] text-muted-foreground hover:text-foreground hover:border-accent/30 transition-all"
          >
            <Eye className="h-3 w-3" />
            <span className="hidden sm:inline">{selectedViewLabel}</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </button>
          {showViewPicker && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.96 }}
              className="absolute right-0 top-full mt-1 w-44 rounded-xl border border-border bg-card shadow-xl z-50 py-1"
            >
              {SAVED_VIEWS.map((v) => (
                <button
                  key={v.id}
                  onClick={() => { onViewChange(v.id); setShowViewPicker(false); }}
                  className={cn(
                    "w-full px-3 py-1.5 text-[11px] text-left transition-colors",
                    selectedView === v.id
                      ? "text-accent bg-accent/5 font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/10"
                  )}
                >
                  {v.label}
                </button>
              ))}
              <div className="h-px bg-border/50 mx-2 my-1" />
              <button className="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted/10 transition-colors">
                <Save className="h-3 w-3" />
                Save Current View
              </button>
            </motion.div>
          )}
        </div>

        {/* Export */}
        <button className="flex items-center gap-1.5 h-8 rounded-lg border border-border bg-muted/5 px-2.5 text-[11px] text-muted-foreground hover:text-foreground hover:border-accent/30 transition-all">
          <Download className="h-3 w-3" />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>
    </motion.div>
  );
}
