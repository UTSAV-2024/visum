"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ChevronDown,
  Download,
  Users,
  Plus,
  Filter,
  Globe,
  Calendar,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { ORG_STATS, REGIONS, ENVIRONMENTS, GROUP_OPTIONS } from "./data";

interface HeaderBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  groupBy: string;
  onGroupChange: (g: string) => void;
  selectedRegion: string;
  onRegionChange: (r: string) => void;
  selectedEnv: string;
  onEnvChange: (e: string) => void;
  selectedCount: number;
  onBulkAction: (action: string) => void;
}

export function HeaderBar({
  searchQuery,
  onSearchChange,
  groupBy,
  onGroupChange,
  selectedRegion,
  onRegionChange,
  selectedEnv,
  onEnvChange,
  selectedCount,
  onBulkAction,
}: HeaderBarProps) {
  const [showGroup, setShowGroup] = useState(false);
  const [showRegion, setShowRegion] = useState(false);
  const [showEnv, setShowEnv] = useState(false);
  const groupRef = useRef<HTMLDivElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);
  const envRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (groupRef.current && !groupRef.current.contains(e.target as Node)) setShowGroup(false);
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) setShowRegion(false);
      if (envRef.current && !envRef.current.contains(e.target as Node)) setShowEnv(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const groupLabel = GROUP_OPTIONS.find((g) => g.id === groupBy)?.label || "No Grouping";

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col sm:flex-row items-start sm:items-center gap-3 py-3"
    >
      {/* Left: Org + Search */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/5 px-3 py-1.5 text-xs cursor-pointer hover:border-accent/30 transition-colors">
          <Globe className="h-3.5 w-3.5 text-accent" />
          <span className="font-medium text-foreground">Nike Inc.</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground/50" />
        </div>
        <div className="relative flex-1 sm:w-56">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search websites..."
            className="w-full h-8 rounded-lg border border-border bg-muted/5 pl-8 pr-3 text-[11px] text-foreground placeholder:text-muted-foreground/30 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
          />
        </div>
      </div>

      {/* Spacer */}
      <div className="hidden sm:block flex-1" />

      {/* Right: Controls */}
      <div className="flex flex-wrap items-center gap-1.5">
        {/* Group By */}
        <div className="relative" ref={groupRef}>
          <button
            onClick={() => setShowGroup(!showGroup)}
            className="flex items-center gap-1.5 h-8 rounded-lg border border-border bg-muted/5 px-2.5 text-[11px] text-muted-foreground hover:text-foreground hover:border-accent/30 transition-all"
          >
            <Filter className="h-3 w-3" />
            <span className="hidden sm:inline">{groupLabel}</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </button>
          {showGroup && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.96 }}
              className="absolute right-0 top-full mt-1 w-44 rounded-xl border border-border bg-card shadow-xl z-50 py-1"
            >
              {GROUP_OPTIONS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => { onGroupChange(g.id); setShowGroup(false); }}
                  className={cn(
                    "w-full px-3 py-1.5 text-[11px] text-left transition-colors",
                    groupBy === g.id
                      ? "text-accent bg-accent/5 font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/10"
                  )}
                >
                  {g.label}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Region Filter */}
        <div className="relative" ref={regionRef}>
          <button
            onClick={() => setShowRegion(!showRegion)}
            className="flex items-center gap-1.5 h-8 rounded-lg border border-border bg-muted/5 px-2.5 text-[11px] text-muted-foreground hover:text-foreground hover:border-accent/30 transition-all"
            aria-label="Filter by region"
          >
            <Globe className="h-3 w-3" />
            <span className="hidden sm:inline">{selectedRegion === "all" ? "All Regions" : selectedRegion.toUpperCase()}</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </button>
          {showRegion && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.96 }}
              className="absolute right-0 top-full mt-1 w-44 rounded-xl border border-border bg-card shadow-xl z-50 py-1"
            >
              <button
                onClick={() => { onRegionChange("all"); setShowRegion(false); }}
                className={cn(
                  "w-full px-3 py-1.5 text-[11px] text-left transition-colors",
                  selectedRegion === "all" ? "text-accent bg-accent/5 font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted/10"
                )}
              >
                All Regions
              </button>
              {REGIONS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => { onRegionChange(r.id); setShowRegion(false); }}
                  className={cn(
                    "w-full px-3 py-1.5 text-[11px] text-left transition-colors",
                    selectedRegion === r.id ? "text-accent bg-accent/5 font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted/10"
                  )}
                >
                  {r.label}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Environment */}
        <div className="relative" ref={envRef}>
          <button
            onClick={() => setShowEnv(!showEnv)}
            className="flex items-center gap-1.5 h-8 rounded-lg border border-border bg-muted/5 px-2.5 text-[11px] text-muted-foreground hover:text-foreground hover:border-accent/30 transition-all"
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", selectedEnv === "production" ? "bg-green-500" : selectedEnv === "staging" ? "bg-orange-500" : "bg-blue-500")} />
            <span className="hidden sm:inline capitalize">{selectedEnv === "all" ? "All Envs" : selectedEnv}</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </button>
          {showEnv && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.96 }}
              className="absolute right-0 top-full mt-1 w-40 rounded-xl border border-border bg-card shadow-xl z-50 py-1"
            >
              <button
                onClick={() => { onEnvChange("all"); setShowEnv(false); }}
                className={cn(
                  "w-full px-3 py-1.5 text-[11px] text-left transition-colors",
                  selectedEnv === "all" ? "text-accent bg-accent/5 font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted/10"
                )}
              >
                All Environments
              </button>
              {ENVIRONMENTS.map((e) => (
                <button
                  key={e}
                  onClick={() => { onEnvChange(e); setShowEnv(false); }}
                  className={cn(
                    "w-full px-3 py-1.5 text-[11px] text-left capitalize transition-colors",
                    selectedEnv === e ? "text-accent bg-accent/5 font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted/10"
                  )}
                >
                  {e}
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
          <div className="flex items-center gap-1">
            <button
              onClick={() => onBulkAction("scan")}
              className="h-8 rounded-lg bg-accent/10 px-3 text-[11px] font-semibold text-accent hover:bg-accent/20 transition-all"
            >
              Scan ({selectedCount})
            </button>
            <button
              onClick={() => onBulkAction("report")}
              className="h-8 rounded-lg bg-muted/10 px-3 text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-all"
            >
              Report
            </button>
          </div>
        )}

        {/* Invite + Create */}
        <button className="flex items-center gap-1.5 h-8 rounded-lg border border-border bg-muted/5 px-2.5 text-[11px] text-muted-foreground hover:text-foreground hover:border-accent/30 transition-all">
          <Users className="h-3 w-3" />
          <span className="hidden sm:inline">Invite</span>
        </button>
        <button className="flex items-center gap-1.5 h-8 rounded-lg bg-accent px-3 text-[11px] font-semibold text-white hover:bg-accent/90 transition-all shadow-sm">
          <Plus className="h-3 w-3" />
          <span className="hidden sm:inline">Add Site</span>
        </button>
      </div>
    </motion.div>
  );
}
