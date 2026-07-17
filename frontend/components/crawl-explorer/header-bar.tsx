"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  RefreshCw,
  Download,
  GitCompare,
  Globe,
  Clock,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { EngineSelector } from "./engine-selector";

interface HeaderBarProps {
  selectedEngine: string;
  onEngineChange: (id: string) => void;
  onSearch: (query: string) => void;
  onRunCrawl: () => void;
}

export function HeaderBar({
  selectedEngine,
  onEngineChange,
  onSearch,
  onRunCrawl,
}: HeaderBarProps) {
  const [compareMode, setCompareMode] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-3"
    >
      {/* Top row: Site + Time + Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Website selector */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border">
            <Globe className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs font-semibold text-foreground">acme.com</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground/40" />
          </div>

          {/* Time selector */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border">
            <Clock className="h-3.5 w-3.5 text-muted-foreground/50" />
            <span className="text-xs text-muted-foreground">Last crawl</span>
            <span className="text-xs font-semibold text-foreground">Today</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground/40" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/30" />
            <input
              type="text"
              placeholder="Search pages..."
              onChange={(e) => onSearch(e.target.value)}
              className="w-40 lg:w-52 bg-card border border-border rounded-lg pl-8 pr-3 py-1.5 text-[11px] text-foreground placeholder:text-muted-foreground/30 outline-none focus:border-accent/50 transition-colors"
            />
          </div>

          {/* Compare toggle */}
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[10px] font-semibold transition-all",
              compareMode
                ? "border-accent/50 bg-accent/10 text-accent"
                : "border-border text-muted-foreground hover:text-foreground hover:bg-muted/20"
            )}
          >
            <GitCompare className="h-3.5 w-3.5" />
            Compare
          </button>

          {/* Run crawl */}
          <button
            onClick={onRunCrawl}
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-accent/90 transition-colors shadow-sm"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Run Crawl
          </button>

          {/* Export */}
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-[10px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-all">
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
        </div>
      </div>

      {/* Engine selector */}
      <EngineSelector selected={selectedEngine} onSelect={onEngineChange} />
    </motion.div>
  );
}
