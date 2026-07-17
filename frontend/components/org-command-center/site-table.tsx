"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  Circle,
  CheckCircle2,
  Globe,
  AlertTriangle,
  Server,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { type Website, type HealthStatus } from "./data";

interface SiteTableProps {
  items: Website[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  groupBy: string;
  selectedIds: Set<string>;
  onSelectToggle: (id: string) => void;
}

function HealthDot({ status, size = "sm" }: { status: HealthStatus; size?: "sm" | "xs" }) {
  const colors: Record<string, string> = {
    healthy: "bg-green-500",
    warning: "bg-orange-500",
    critical: "bg-red-500",
    down: "bg-red-500",
  };
  return (
    <span className={cn("inline-block rounded-full", colors[status] || "bg-muted-foreground", size === "xs" ? "h-1.5 w-1.5" : "h-2 w-2")} />
  );
}

const REGION_LABELS: Record<string, string> = {
  na: "North America",
  eu: "Europe",
  apac: "APAC",
  latam: "LATAM",
  mea: "MEA",
};

function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") return <TrendingUp className="h-3 w-3 text-green-500" />;
  if (trend === "down") return <TrendingDown className="h-3 w-3 text-red-500" />;
  return <Minus className="h-3 w-3 text-muted-foreground/40" />;
}

export function SiteTable({ items, selectedId, onSelect, groupBy, selectedIds, onSelectToggle }: SiteTableProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Group items
  const grouped: Record<string, Website[]> = {};
  if (groupBy !== "none") {
    for (const item of items) {
      const key = String((item as any)[groupBy] || "Other");
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    }
  }

  const renderRow = (site: Website, index: number) => (
    <motion.div
      key={site.id}
      initial={mounted ? { opacity: 0, y: 4 } : undefined}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, delay: 0.01 * index }}
      onClick={() => onSelect(site.id)}
      className={cn(
        "grid grid-cols-10 gap-2 sm:gap-3 px-4 py-2.5 rounded-lg transition-all cursor-pointer group border border-transparent",
        selectedId === site.id
          ? "border-accent/30 bg-accent/[0.03]"
          : "hover:border-border hover:bg-muted/10"
      )}
    >
      {/* Checkbox + Name */}
      <div className="col-span-3 flex items-center gap-2.5 min-w-0">
        <button
          onClick={(e) => { e.stopPropagation(); onSelectToggle(site.id); }}
          className="shrink-0 focus-visible:ring-2 focus-visible:ring-accent/50 outline-none rounded"
          aria-label={`Select ${site.name}`}
        >
          {selectedIds.has(site.id) ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
          ) : (
            <Circle className="h-3.5 w-3.5 text-muted-foreground/20 group-hover:text-muted-foreground/50 transition-colors" />
          )}
        </button>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">{site.name}</p>
          <p className="text-[9px] text-muted-foreground/40 truncate font-mono">{site.domain}</p>
        </div>
      </div>

      {/* Environment */}
      <div className="col-span-1 flex items-center">
        <span className={cn(
          "text-[9px] font-medium px-1.5 py-0.5 rounded-full",
          site.environment === "production" ? "bg-green-500/10 text-green-500" :
          site.environment === "staging" ? "bg-orange-500/10 text-orange-500" :
          "bg-blue-500/10 text-blue-500"
        )}>
          {site.environment === "production" ? "Prod" : site.environment === "staging" ? "Stage" : "Dev"}
        </span>
      </div>

      {/* Score */}
      <div className="col-span-1 flex items-center gap-1.5">
        <span className={cn(
          "text-[11px] font-mono font-bold tabular-nums",
          site.aiVisibilityScore >= 80 ? "text-green-500" :
          site.aiVisibilityScore >= 60 ? "text-orange-500" :
          "text-red-500"
        )}>
          {site.aiVisibilityScore}
        </span>
        <TrendIcon trend={site.trend} />
      </div>

      {/* Health */}
      <div className="col-span-1 flex items-center">
        <div className="flex items-center gap-1.5">
          <HealthDot status={site.health} size="xs" />
          <span className={cn(
            "text-[10px] capitalize hidden sm:inline",
            site.health === "healthy" ? "text-green-500" :
            site.health === "warning" ? "text-orange-500" :
            "text-red-500"
          )}>{site.health}</span>
        </div>
      </div>

      {/* Issues */}
      <div className="col-span-1 flex items-center gap-1">
        {site.criticalIssues > 0 && (
          <AlertTriangle className="h-3 w-3 text-red-500" />
        )}
        <span className={cn(
          "text-[10px] font-mono tabular-nums",
          site.openIssues > 0 ? "text-foreground" : "text-muted-foreground/40"
        )}>
          {site.openIssues}
        </span>
      </div>

      {/* MCP */}
      <div className="col-span-1 flex items-center">
        <div className="flex items-center gap-1.5">
          <HealthDot status={site.mcpStatus} size="xs" />
          <span className={cn(
            "text-[10px] capitalize",
            site.mcpStatus === "healthy" ? "text-green-500" :
            site.mcpStatus === "warning" ? "text-orange-500" :
            "text-red-500"
          )}>{site.mcpStatus}</span>
        </div>
      </div>

      {/* Traffic */}
      <div className="col-span-1 hidden sm:flex items-center">
        <span className="text-[10px] font-mono tabular-nums text-muted-foreground/70">
          {site.traffic >= 1000000
            ? `${(site.traffic / 1000000).toFixed(1)}M`
            : site.traffic >= 1000
            ? `${(site.traffic / 1000).toFixed(0)}k`
            : site.traffic}
        </span>
      </div>

      {/* Chevron */}
      <ChevronRight className="col-span-1 hidden sm:block h-3.5 w-3.5 text-muted-foreground/20 self-center justify-self-end group-hover:text-muted-foreground/50 transition-colors" />
    </motion.div>
  );

  const renderGroup = (key: string, sites: Website[]) => (
    <div key={key} className="mb-4">
      <div className="flex items-center gap-2 px-4 py-1.5 mb-1">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">{key}</span>
        <span className="text-[9px] text-muted-foreground/30">{sites.length} sites</span>
      </div>
      {sites.map((site, i) => renderRow(site, i))}
    </div>
  );

  return (
    <div>
      {/* Column Headers */}
      <div className="grid grid-cols-10 gap-2 sm:gap-3 px-4 py-2 text-[9px] font-medium uppercase tracking-widest text-muted-foreground/40 border-b border-border/50">
        <span className="col-span-3 pl-7">Website</span>
        <span className="col-span-1">Env</span>
        <span className="col-span-1">Score</span>
        <span className="col-span-1">Health</span>
        <span className="col-span-1">Issues</span>
        <span className="col-span-1">MCP</span>
        <span className="col-span-1 hidden sm:block">Traffic</span>
        <span className="col-span-1" />
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Globe className="h-10 w-10 text-muted-foreground/20 mb-3" />
          <p className="text-sm font-medium text-foreground">No websites found</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Try adjusting your filters</p>
        </div>
      ) : groupBy !== "none" ? (
        Object.entries(grouped).map(([key, sites]) => renderGroup(key, sites))
      ) : (
        <div className="space-y-0.5">
          {items.map((site, i) => renderRow(site, i))}
        </div>
      )}
    </div>
  );
}
