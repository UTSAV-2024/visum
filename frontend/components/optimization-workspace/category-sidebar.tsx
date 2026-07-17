"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  FileJson,
  Zap,
  FileText,
  Tag,
  Search,
  TrendingUp,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { CATEGORY_GROUPS, type CategoryGroup } from "./data";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Schema: <FileJson className="h-3.5 w-3.5" />,
  "AI Crawling": <Search className="h-3.5 w-3.5" />,
  Performance: <Zap className="h-3.5 w-3.5" />,
  Content: <FileText className="h-3.5 w-3.5" />,
  Metadata: <Tag className="h-3.5 w-3.5" />,
  "Technical SEO": <TrendingUp className="h-3.5 w-3.5" />,
  "Hosted MCP": <Shield className="h-3.5 w-3.5" />,
  Security: <Shield className="h-3.5 w-3.5" />,
};

interface CategorySidebarProps {
  selected: string | null;
  onSelect: (id: string | null) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function CategorySidebar({ selected, onSelect, searchQuery, onSearchChange }: CategorySidebarProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const totalOpen = CATEGORY_GROUPS.reduce((s, c) => s + c.openTasks, 0);
  const totalCompleted = CATEGORY_GROUPS.reduce((s, c) => s + c.completed, 0);
  const totalScore = CATEGORY_GROUPS.reduce((s, c) => s + c.estimatedScoreGain, 0);

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search categories..."
          className="w-full h-8 rounded-lg border border-border bg-muted/5 pl-8 pr-3 text-[11px] text-foreground placeholder:text-muted-foreground/30 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
        />
      </div>

      {/* All Items */}
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "flex items-center gap-2 w-full rounded-lg px-3 py-2 text-xs transition-all mb-1",
          selected === null
            ? "bg-accent/10 text-accent font-semibold"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/10"
        )}
      >
        <div className="flex h-5 w-5 items-center justify-center rounded bg-muted/20">
          <Clock className="h-3 w-3" />
        </div>
        <span className="flex-1 text-left">All Tasks</span>
        <span className="font-mono text-[10px] tabular-nums text-muted-foreground/60">{totalOpen + totalCompleted}</span>
      </button>

      <div className="h-px bg-border/50 mx-2 my-2" />

      {/* Category List */}
      <div className="flex-1 space-y-0.5 overflow-y-auto scrollbar-thin pr-1">
        {CATEGORY_GROUPS.map((cat, i) => (
          <motion.button
            key={cat.id}
            initial={mounted ? { opacity: 0, x: -8 } : undefined}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: 0.04 * i }}
            onClick={() => onSelect(cat.id === selected ? null : cat.id)}
            className={cn(
              "flex items-center gap-2 w-full rounded-lg px-3 py-2 text-xs transition-all group",
              selected === cat.id
                ? "bg-accent/10 text-accent font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/10"
            )}
          >
            {/* Icon */}
            <div
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded transition-colors",
                selected === cat.id ? "bg-accent/10" : "bg-muted/10 group-hover:bg-muted/20"
              )}
            >
              {CATEGORY_ICONS[cat.id] || <FileText className="h-3 w-3" />}
            </div>

            <span className="flex-1 text-left truncate">{cat.label}</span>

            {/* Progress bar */}
            <div className="w-12 h-1 rounded-full bg-muted/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: cat.openTasks + cat.completed > 0
                    ? `${(cat.completed / (cat.openTasks + cat.completed)) * 100}%`
                    : 0,
                }}
                transition={{ duration: 0.6, delay: 0.2 + 0.05 * i }}
                className={cn("h-full rounded-full", cat.color)}
              />
            </div>

            {/* Count */}
            <span className="font-mono text-[10px] tabular-nums text-muted-foreground/60">
              {cat.openTasks}/{cat.openTasks + cat.completed}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-auto pt-3 border-t border-border/50">
        <div className="px-3 py-2 space-y-1.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground/60">Open Tasks</span>
            <span className="font-mono tabular-nums text-foreground">{totalOpen}</span>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground/60">Completed</span>
            <span className="font-mono tabular-nums text-green-500">{totalCompleted}</span>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground/60">Potential Score</span>
            <span className="font-mono tabular-nums text-accent font-semibold">+{totalScore} pts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
