"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { ENGINES, type EngineInfo } from "./data";
import { StatusDot } from "./shared";

interface EngineSelectorProps {
  selected: string;
  onSelect: (id: string) => void;
}

export function EngineSelector({ selected, onSelect }: EngineSelectorProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap gap-2">
      {ENGINES.map((engine) => {
        const isSelected = engine.id === selected;
        const isHovered = engine.id === hoveredId;

        return (
          <motion.button
            key={engine.id}
            onClick={() => onSelect(engine.id)}
            onMouseEnter={() => setHoveredId(engine.id)}
            onMouseLeave={() => setHoveredId(null)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "relative flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-1 focus-visible:ring-offset-background",
              isSelected
                ? "border-accent/50 bg-accent/[0.06] shadow-[0_0_20px_-12px_rgba(124,58,237,0.3)]"
                : "border-border bg-card hover:border-accent/20 hover:bg-muted/10"
            )}
            aria-pressed={isSelected}
            aria-label={`${engine.name} engine`}
          >
            {/* Engine indicator dot */}
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: engine.color }}
            />

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className={cn("text-xs font-semibold", isSelected ? "text-foreground" : "text-muted-foreground")}>
                  {engine.name}
                </span>
                <StatusDot status={engine.status} size="xs" />
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[9px] text-muted-foreground/50">{engine.lastCrawl}</span>
                <span className="text-[9px] text-muted-foreground/30">·</span>
                <span className="text-[9px] font-mono tabular-nums text-muted-foreground/50">{engine.avgSuccess}%</span>
              </div>
            </div>

            {isSelected && (
              <motion.div
                layoutId="engine-selector-bg"
                className="absolute inset-0 rounded-xl border border-accent/30 pointer-events-none"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
