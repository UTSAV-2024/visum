"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  User,
  ChevronRight,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { WORK_ITEMS, PRIORITY_CONFIG, type WorkItem } from "./data";
import { track } from "../../lib/analytics";

interface WorkspaceListProps {
  items: WorkItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

const DIFFICULTY_ICONS: Record<string, { label: string; color: string }> = {
  easy: { label: "Easy", color: "text-green-500" },
  medium: { label: "Medium", color: "text-orange-500" },
  hard: { label: "Hard", color: "text-red-500" },
};

const STATUS_PILLS: Record<string, { label: string; color: string }> = {
  backlog: { label: "Backlog", color: "bg-muted/20 text-muted-foreground" },
  todo: { label: "Todo", color: "bg-blue-500/10 text-blue-500" },
  "in-progress": { label: "In Progress", color: "bg-orange-500/10 text-orange-500" },
  review: { label: "Review", color: "bg-accent/10 text-accent" },
  done: { label: "Done", color: "bg-green-500/10 text-green-500" },
};

export function WorkspaceList({ items, selectedId, onSelect, onToggleComplete }: WorkspaceListProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="space-y-0.5">
      {/* Column Headers */}
      <div className="hidden sm:grid grid-cols-12 gap-3 px-4 py-2 text-[9px] font-medium uppercase tracking-widest text-muted-foreground/40 border-b border-border/50">
        <span className="col-span-5 pl-7">Task</span>
        <span className="col-span-1 text-center">Priority</span>
        <span className="col-span-1 text-center">Impact</span>
        <span className="col-span-1 text-center">Difficulty</span>
        <span className="col-span-1 text-center">Time</span>
        <span className="col-span-1 text-center">Status</span>
        <span className="col-span-2 text-center">Assignee</span>
      </div>

      {/* Rows */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/10 mb-3">
            <CheckCircle2 className="h-5 w-5 text-muted-foreground/30" />
          </div>
          <p className="text-sm font-medium text-foreground">All tasks completed!</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Run a new scan to find more optimization opportunities.</p>
        </div>
      ) : (
        items.map((item, i) => {
          const pc = PRIORITY_CONFIG[item.priority];
          const diff = DIFFICULTY_ICONS[item.difficulty];
          const status = STATUS_PILLS[item.status];
          const isSelected = selectedId === item.id;

          return (
            <motion.div
              key={item.id}
              initial={mounted ? { opacity: 0, y: 4 } : undefined}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.02 * i }}
            >
              <div
                onClick={() => onSelect(item.id)}
                className={cn(
                  "grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 px-3 sm:px-4 py-3 rounded-xl transition-all cursor-pointer group border",
                  isSelected
                    ? "border-accent/30 bg-accent/[0.03]"
                    : "border-transparent hover:border-border hover:bg-muted/10",
                  item.completed && "opacity-60"
                )}
              >
                {/* Title + Checkbox (spans 5) */}
                <div className="flex items-start gap-2.5 sm:col-span-5 min-w-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleComplete(item.id); }}
                    className="mt-0.5 shrink-0 focus-visible:ring-2 focus-visible:ring-accent/50 outline-none rounded-full"
                    aria-label={item.completed ? "Mark as incomplete" : "Mark as complete"}
                  >
                    {item.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors" />
                    )}
                  </button>
                  <div className="min-w-0">
                    <p className={cn(
                      "text-xs font-semibold leading-snug truncate",
                      item.completed ? "line-through text-muted-foreground" : "text-foreground"
                    )}>
                      {item.title}
                    </p>
                    {/* Labels (mobile only) */}
                    <div className="flex items-center gap-1 mt-1 sm:hidden">
                      <span className={cn("text-[8px] font-semibold px-1 py-0.5 rounded", pc.bg, pc.text)}>
                        {pc.label}
                      </span>
                      <span className={cn("text-[8px] font-semibold", diff.color)}>{diff.label}</span>
                    </div>
                  </div>
                </div>

                {/* Priority */}
                <div className="hidden sm:flex sm:col-span-1 items-center justify-center">
                  <div className="flex items-center gap-1.5">
                    <span className={cn("h-2 w-2 rounded-full shrink-0", pc.color)} />
                    <span className={cn("text-[10px] font-medium", pc.text)}>{item.priority}</span>
                  </div>
                </div>

                {/* Impact */}
                <div className="hidden sm:flex sm:col-span-1 items-center justify-center">
                  <span className="text-[11px] font-mono font-semibold text-green-500 tabular-nums">
                    +{item.scoreImprovement}
                  </span>
                </div>

                {/* Difficulty */}
                <div className="hidden sm:flex sm:col-span-1 items-center justify-center">
                  <div className="flex items-center gap-1">
                    <span className={cn("text-[10px] font-medium", diff.color)}>{diff.label}</span>
                  </div>
                </div>

                {/* Time */}
                <div className="hidden sm:flex sm:col-span-1 items-center justify-center">
                  <span className="text-[10px] text-muted-foreground/70">{item.implementationTime}</span>
                </div>

                {/* Status */}
                <div className="hidden sm:flex sm:col-span-1 items-center justify-center">
                  <span className={cn("text-[9px] font-medium px-1.5 py-0.5 rounded-full", status.color)}>
                    {status.label}
                  </span>
                </div>

                {/* Assignee */}
                <div className="hidden sm:flex sm:col-span-2 items-center justify-center">
                  {item.assignee ? (
                    <div className="flex items-center gap-1.5">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/10 text-[9px] font-semibold text-accent">
                        {item.assignee[0]}
                      </div>
                      <span className="text-[10px] text-muted-foreground/70">{item.assignee}</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-muted-foreground/30">—</span>
                  )}
                </div>

                {/* Chevron indicator */}
                <ChevronRight className={cn(
                  "hidden sm:block h-3.5 w-3.5 text-muted-foreground/20 self-center transition-colors",
                  isSelected ? "text-accent/60" : "group-hover:text-muted-foreground/40"
                )} />
              </div>
            </motion.div>
          );
        })
      )}
    </div>
  );
}
