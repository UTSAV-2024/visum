"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GitBranch, ArrowDown, CheckCircle2, Circle } from "lucide-react";
import { cn } from "../../lib/utils";
import { WORK_ITEMS, DEPENDENCY_EDGES } from "./data";

export function DependencyGraph() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Build a simple visual tree from dependency edges
  const renderNode = (id: string, depth: number) => {
    const item = WORK_ITEMS.find((w) => w.id === id);
    if (!item) return null;

    const children = DEPENDENCY_EDGES.filter((e) => e.source === id).map((e) => e.target);

    return (
      <div key={id} className="relative" style={{ marginLeft: depth * 24 }}>
        <div className="flex items-center gap-2 py-1.5">
          {/* Connection line */}
          {depth > 0 && (
            <div className="absolute -left-3 top-0 bottom-1/2 w-3 border-l border-b border-border/40 rounded-bl" />
          )}

          {/* Node indicator */}
          {item.completed ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
          ) : (
            <Circle className="h-3.5 w-3.5 shrink-0" style={{ color: `var(--${item.priority}-color, hsl(var(--muted-foreground)))` }} />
          )}

          {/* Label */}
          <span className={cn(
            "text-[10px] leading-snug",
            item.completed ? "line-through text-muted-foreground/50" : "text-muted-foreground/80"
          )}>
            {item.title}
          </span>

          {/* Score */}
          {!item.completed && (
            <span className="text-[8px] font-mono font-semibold text-green-500/70">+{item.scoreImprovement}</span>
          )}
        </div>

        {/* Children */}
        {children.map((childId) => renderNode(childId, depth + 1))}
      </div>
    );
  };

  // Find root nodes (sources that are not targets)
  const targetIds = new Set(DEPENDENCY_EDGES.map((e) => e.target));
  const rootNodes = WORK_ITEMS
    .filter((w) => !targetIds.has(w.id))
    .map((w) => w.id);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <GitBranch className="h-3.5 w-3.5 text-accent" />
        <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground">Dependency Graph</p>
        <span className="text-[9px] text-muted-foreground/40 ml-auto">{DEPENDENCY_EDGES.length} dependencies</span>
      </div>

      <motion.div
        initial={mounted ? { opacity: 0 } : undefined}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl border border-border bg-card p-4 overflow-x-auto"
      >
        {rootNodes.length === 0 ? (
          <p className="text-[10px] text-muted-foreground/40 text-center py-4">No dependencies defined</p>
        ) : (
          <div className="space-y-0.5 min-w-[400px]">
            {rootNodes.map((id) => renderNode(id, 0))}
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border/50 text-[8px] text-muted-foreground/50">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="h-2.5 w-2.5 text-green-500" />
            Completed
          </div>
          <div className="flex items-center gap-1">
            <Circle className="h-2.5 w-2.5 text-muted-foreground/50" />
            Pending
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[8px] font-mono text-green-500/70">+8</span>
            Score impact
          </div>
        </div>
      </motion.div>
    </div>
  );
}
