"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  DollarSign,
  Headphones,
  Truck,
  Undo2,
  Code,
  Book,
  FileText,
  Globe,
  Tag,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Search,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { CATEGORIES, type Category } from "./data";

const ICON_MAP: Record<string, React.ReactNode> = {
  package: <Package className="h-3.5 w-3.5" />,
  dollar: <DollarSign className="h-3.5 w-3.5" />,
  headphones: <Headphones className="h-3.5 w-3.5" />,
  truck: <Truck className="h-3.5 w-3.5" />,
  undo: <Undo2 className="h-3.5 w-3.5" />,
  code: <Code className="h-3.5 w-3.5" />,
  book: <Book className="h-3.5 w-3.5" />,
  "file-text": <FileText className="h-3.5 w-3.5" />,
  globe: <Globe className="h-3.5 w-3.5" />,
  tag: <Tag className="h-3.5 w-3.5" />,
};

function getIcon(iconName: string): React.ReactNode {
  return ICON_MAP[iconName] || <HelpCircle className="h-3.5 w-3.5" />;
}

interface CategorySidebarProps {
  selected: string | null;
  onSelect: (id: string | null) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function CategorySidebar({ selected, onSelect, searchQuery, onSearchChange }: CategorySidebarProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const totalPrompts = CATEGORIES.reduce((sum, c) => sum + c.count, 0);

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

      {/* All Prompts */}
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
          <span className="text-[9px] font-mono font-bold">∑</span>
        </div>
        <span className="flex-1 text-left">All Prompts</span>
        <span className="font-mono text-[10px] tabular-nums text-muted-foreground/60">{totalPrompts}</span>
      </button>

      {/* Divider */}
      <div className="h-px bg-border/50 mx-2 my-2" />

      {/* Categories */}
      <div className="flex-1 space-y-0.5 overflow-y-auto scrollbar-thin pr-1">
        {CATEGORIES.map((cat, i) => (
          <motion.button
            key={cat.id}
            initial={mounted ? { opacity: 0, x: -8 } : undefined}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: 0.05 * i }}
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
                "flex h-5 w-5 shrink-0 items-center justify-center rounded transition-colors",
                selected === cat.id ? "text-accent" : "text-muted-foreground/50 group-hover:text-foreground/70"
              )}
            >
              {getIcon(cat.icon)}
            </div>

            {/* Label + Count */}
            <span className="flex-1 text-left truncate">{cat.label}</span>
            <span className="font-mono text-[10px] tabular-nums text-muted-foreground/60">{cat.count}</span>

            {/* Growth indicator */}
            <div className="flex items-center gap-0.5">
              {cat.growth > 0 ? (
                <TrendingUp className="h-2.5 w-2.5 text-green-500/60" />
              ) : (
                <TrendingDown className="h-2.5 w-2.5 text-red-500/60" />
              )}
              <span
                className={cn(
                  "text-[9px] font-mono tabular-nums",
                  cat.growth > 0 ? "text-green-500/60" : "text-red-500/60"
                )}
              >
                {cat.growth > 0 ? "+" : ""}
                {cat.growth}%
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Confidence summary */}
      <div className="mt-auto pt-3 border-t border-border/50">
        <div className="px-3 py-2">
          <p className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground/40 mb-2">
            Average Confidence
          </p>
          <div className="space-y-1.5">
            {CATEGORIES.slice(0, 5).map((cat) => (
              <div key={cat.id} className="flex items-center gap-2 text-[10px]">
                <span className="w-16 truncate text-muted-foreground/60">{cat.label}</span>
                <div className="flex-1 h-1.5 rounded-full bg-muted/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.avgConfidence}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + 0.1 * CATEGORIES.indexOf(cat), ease: "easeOut" }}
                    className={cn(
                      "h-full rounded-full",
                      cat.avgConfidence >= 85
                        ? "bg-green-500/60"
                        : cat.avgConfidence >= 70
                        ? "bg-orange-500/60"
                        : "bg-red-500/60"
                    )}
                  />
                </div>
                <span className="w-8 text-right font-mono tabular-nums text-muted-foreground/60">
                  {cat.avgConfidence}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
