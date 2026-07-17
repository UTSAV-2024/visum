"use client";

import { Sparkles, TrendingUp, Globe, AlertTriangle, Server } from "lucide-react";
import { cn } from "../../lib/utils";
import { EXECUTIVE_SUMMARY, ORG_STATS } from "./data";

export function ExecutiveSummary() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-3.5 w-3.5 text-accent" />
        <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground">Executive Summary</p>
      </div>

      {/* AI-generated summary */}
      <div className="relative rounded-xl border border-accent/10 bg-gradient-to-br from-accent/[0.03] to-transparent p-4 mb-3">
        <div className="absolute top-3 right-3">
          <Sparkles className="h-3 w-3 text-accent/30" />
        </div>
        <p className="text-xs text-muted-foreground/80 leading-relaxed pr-6">
          {EXECUTIVE_SUMMARY}
        </p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-border/60 bg-muted/5 p-2.5">
          <div className="flex items-center gap-1.5 text-[8px] text-muted-foreground/50 mb-0.5">
            <TrendingUp className="h-2.5 w-2.5" /> Score Trend
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-green-500 font-mono">+{ORG_STATS.scoreTrend}%</span>
          </div>
          <p className="text-[8px] text-muted-foreground/40 mt-0.5">this week</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/5 p-2.5">
          <div className="flex items-center gap-1.5 text-[8px] text-muted-foreground/50 mb-0.5">
            <AlertTriangle className="h-2.5 w-2.5" /> Critical Sites
          </div>
          <p className="text-sm font-bold text-red-500 font-mono">{ORG_STATS.criticalSites}</p>
          <p className="text-[8px] text-muted-foreground/40 mt-0.5">need attention</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/5 p-2.5">
          <div className="flex items-center gap-1.5 text-[8px] text-muted-foreground/50 mb-0.5">
            <Globe className="h-2.5 w-2.5" /> Regions
          </div>
          <p className="text-sm font-bold text-foreground font-mono">{ORG_STATS.regions}</p>
          <p className="text-[8px] text-muted-foreground/40 mt-0.5">deployed</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/5 p-2.5">
          <div className="flex items-center gap-1.5 text-[8px] text-muted-foreground/50 mb-0.5">
            <Server className="h-2.5 w-2.5" /> Sites
          </div>
          <p className="text-sm font-bold text-foreground font-mono">{ORG_STATS.totalSites}</p>
          <p className="text-[8px] text-muted-foreground/40 mt-0.5">monitored</p>
        </div>
      </div>
    </div>
  );
}
