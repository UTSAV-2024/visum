"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SearchX,
  TrendingUp,
  ArrowRight,
  Lightbulb,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { CONTENT_GAPS } from "./data";

export function ContentGaps() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <SearchX className="h-3.5 w-3.5 text-orange-500" />
        <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground">Content Gaps</p>
        <span className="text-[9px] text-muted-foreground/40 ml-auto">{CONTENT_GAPS.length} gaps</span>
      </div>

      <div className="space-y-2">
        {CONTENT_GAPS.map((gap, i) => (
          <motion.div
            key={gap.id}
            initial={mounted ? { opacity: 0, y: 8 } : undefined}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.06 * i }}
            className="rounded-xl border border-border bg-card overflow-hidden group hover:border-orange-500/20 hover:bg-orange-500/[0.01] transition-all"
          >
            <div className="p-3">
              {/* Question */}
              <div className="flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground leading-snug">
                    &ldquo;{gap.question}&rdquo;
                  </p>

                  {/* Current Status */}
                  <p className="text-[10px] text-muted-foreground/60 mt-1.5 leading-relaxed">
                    <span className="font-medium text-muted-foreground/80">Status:</span> {gap.currentStatus}
                  </p>

                  {/* Recommendation */}
                  <div className="mt-1.5 flex items-start gap-1.5">
                    <Lightbulb className="h-3 w-3 text-orange-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-muted-foreground/70 leading-relaxed">
                      {gap.recommendation}
                    </p>
                  </div>

                  {/* Impact */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="inline-flex items-center gap-1 rounded-md bg-green-500/10 px-2 py-0.5">
                      <TrendingUp className="h-2.5 w-2.5 text-green-500" />
                      <span className="text-[9px] font-semibold text-green-500">+{gap.estimatedImpact} Visibility</span>
                    </div>
                    <button className="text-[9px] font-medium text-accent hover:text-accent/80 opacity-0 group-hover:opacity-100 transition-opacity">
                      Create Content
                      <ArrowRight className="h-2.5 w-2.5 inline ml-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
