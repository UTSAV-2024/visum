"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  CheckCircle2,
  Target,
  Quote,
  AlertTriangle,
  Book,
  FileText,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { ENGINE_COMPARISONS } from "./data";

const ENGINE_COLORS: Record<string, string> = {
  ChatGPT: "#10a37f",
  Claude: "#6a4fc9",
  Gemini: "#4285f4",
  Perplexity: "#1f1f1f",
  DeepSeek: "#4f46e5",
};

export function EngineComparison() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const metrics = [
    { key: "promptSuccess", label: "Prompt Success", icon: <CheckCircle2 className="h-3 w-3" />, suffix: "%" },
    { key: "avgConfidence", label: "Avg Confidence", icon: <Target className="h-3 w-3" />, suffix: "%" },
    { key: "citationRate", label: "Citation Rate", icon: <Quote className="h-3 w-3" />, suffix: "%" },
    { key: "pagesRetrieved", label: "Pages Retrieved", icon: <Book className="h-3 w-3" />, suffix: "" },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="h-3.5 w-3.5 text-accent" />
        <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground">Engine Comparison</p>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-5 gap-2 px-3 py-2 bg-muted/5 border-b border-border text-[9px] font-medium text-muted-foreground/50 uppercase tracking-wider">
          <span>Engine</span>
          {metrics.map((m) => (
            <span key={m.key} className="text-right">{m.icon} {m.label}</span>
          ))}
        </div>

        {/* Rows */}
        {ENGINE_COMPARISONS.map((eng, i) => (
          <motion.div
            key={eng.engine}
            initial={mounted ? { opacity: 0, y: 6 } : undefined}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 * i }}
            className={cn(
              "grid grid-cols-5 gap-2 px-3 py-2.5 text-[11px] transition-colors hover:bg-muted/10",
              i < ENGINE_COMPARISONS.length - 1 && "border-b border-border/50"
            )}
          >
            {/* Engine name */}
            <div className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: ENGINE_COLORS[eng.engine] || "#888" }}
              />
              <span className="font-medium text-foreground">{eng.engine}</span>
            </div>

            {/* Metrics */}
            {metrics.map((m) => {
              const value = (eng as any)[m.key];
              const isPercentage = m.suffix === "%";
              return (
                <div key={m.key} className="flex items-center justify-end gap-2">
                  <div className="flex-1 max-w-[60px] h-1 rounded-full bg-muted/10 overflow-hidden hidden sm:block">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${isPercentage ? value : Math.min(value / 20 * 100, 100)}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + 0.05 * i, ease: "easeOut" }}
                      className={cn(
                        "h-full rounded-full",
                        isPercentage && value >= 85 ? "bg-green-500/60" :
                        isPercentage && value >= 70 ? "bg-orange-500/60" :
                        isPercentage ? "bg-red-500/60" :
                        "bg-accent/60"
                      )}
                    />
                  </div>
                  <span className="font-mono tabular-nums text-foreground/80 w-8 text-right">
                    {value}{m.suffix}
                  </span>
                </div>
              );
            })}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
