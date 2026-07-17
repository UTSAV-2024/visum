"use client";

import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { PRIORITY_CONFIG, type WorkItem, type Priority, PRIORITY_ORDER } from "./data";
import { CheckCircle2, Circle } from "lucide-react";

interface KanbanViewProps {
  items: WorkItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

const PRIORITY_HEADERS: { key: Priority; label: string }[] = [
  { key: "critical", label: "Critical" },
  { key: "high", label: "High" },
  { key: "medium", label: "Medium" },
  { key: "low", label: "Low" },
];

export function KanbanView({ items, selectedId, onSelect, onToggleComplete }: KanbanViewProps) {
  const grouped: Record<string, WorkItem[]> = {};
  for (const p of PRIORITY_HEADERS) {
    grouped[p.key] = items.filter((i) => i.priority === p.key);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {PRIORITY_HEADERS.map((ph) => {
        const pc = PRIORITY_CONFIG[ph.key];
        const columnItems = grouped[ph.key] || [];
        return (
          <div key={ph.key} className="rounded-2xl border border-border bg-card/50 p-3">
            {/* Column header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", pc.color)} />
                <span className="text-[11px] font-semibold text-foreground">{ph.label}</span>
              </div>
              <span className={cn("text-[10px] font-mono font-bold px-1.5 py-0.5 rounded", pc.bg, pc.text)}>
                {columnItems.length}
              </span>
            </div>

            {/* Cards */}
            <div className={cn("space-y-2 min-h-[100px]", columnItems.length === 0 && "flex items-center justify-center")}>
              {columnItems.length === 0 ? (
                <p className="text-[10px] text-muted-foreground/40 text-center py-8">Empty</p>
              ) : (
                columnItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, delay: 0.02 * i }}
                  >
                    <div
                      onClick={() => onSelect(item.id)}
                      className={cn(
                        "rounded-xl border p-3 cursor-pointer transition-all group",
                        selectedId === item.id
                          ? "border-accent/40 bg-accent/[0.03]"
                          : "border-border bg-card hover:border-accent/30 hover:shadow-sm",
                        item.completed && "opacity-60"
                      )}
                    >
                      {/* Checkbox + Title */}
                      <div className="flex items-start gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); onToggleComplete(item.id); }}
                          className="mt-0.5 shrink-0 outline-none"
                          aria-label={item.completed ? "Mark as incomplete" : "Mark as complete"}
                        >
                          {item.completed ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <Circle className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors" />
                          )}
                        </button>
                        <p className={cn(
                          "text-[11px] font-semibold leading-snug",
                          item.completed ? "line-through text-muted-foreground" : "text-foreground"
                        )}>
                          {item.title}
                        </p>
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-2 mt-2 ml-5">
                        <span className="text-[9px] font-mono font-semibold text-green-500">+{item.scoreImprovement}</span>
                        <span className="text-muted-foreground/20">·</span>
                        <span className="text-[9px] text-muted-foreground/60">{item.implementationTime}</span>
                      </div>

                      {/* Assignee */}
                      {item.assignee && (
                        <div className="flex items-center gap-1.5 mt-1.5 ml-5">
                          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/10 text-[7px] font-semibold text-accent">
                            {item.assignee[0]}
                          </div>
                          <span className="text-[8px] text-muted-foreground/50">{item.assignee}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
