"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  TrendingUp,
  TrendingDown,
  Globe,
  AlertTriangle,
  Server,
  Clock,
  BarChart3,
  FileText,
  Shield,
  ExternalLink,
  Lightbulb,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { type Website } from "./data";

interface SiteInspectorProps {
  site: Website | null;
  onClose: () => void;
}

export function SiteInspector({ site, onClose }: SiteInspectorProps) {
  if (!site) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/10 mb-3">
          <Globe className="h-5 w-5 text-muted-foreground/30" />
        </div>
        <p className="text-sm font-medium text-foreground">Select a website</p>
        <p className="text-xs text-muted-foreground/60 mt-1 max-w-[200px] leading-relaxed">
          Click any site in the table to inspect its AI visibility details, issues, and recommendations
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={cn(
              "h-2 w-2 rounded-full",
              site.health === "healthy" ? "bg-green-500" : site.health === "warning" ? "bg-orange-500" : "bg-red-500"
            )} />
            <span className={cn(
              "text-[9px] font-semibold capitalize",
              site.health === "healthy" ? "text-green-500" : site.health === "warning" ? "text-orange-500" : "text-red-500"
            )}>{site.health}</span>
            <span className="text-[9px] text-muted-foreground/40 bg-muted/10 px-1.5 py-0.5 rounded">{site.environment}</span>
          </div>
          <h3 className="text-sm font-bold text-foreground truncate">{site.name}</h3>
          <p className="text-[10px] text-muted-foreground/50 font-mono truncate">{site.domain}</p>
        </div>
        <button
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-muted/10 text-muted-foreground hover:text-foreground transition-colors shrink-0"
          aria-label="Close inspector"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Scrollable */}
      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-4 pr-1">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-border/60 bg-muted/5 p-2.5">
            <div className="flex items-center gap-1.5 text-[8px] text-muted-foreground/50 mb-0.5">
              <BarChart3 className="h-2.5 w-2.5" /> Score
            </div>
            <p className={cn(
              "text-sm font-bold font-mono tabular-nums",
              site.aiVisibilityScore >= 80 ? "text-green-500" : site.aiVisibilityScore >= 60 ? "text-orange-500" : "text-red-500"
            )}>{site.aiVisibilityScore}</p>
            <div className="flex items-center gap-1 mt-0.5">
              {site.trend === "up" ? <TrendingUp className="h-2.5 w-2.5 text-green-500" /> : site.trend === "down" ? <TrendingDown className="h-2.5 w-2.5 text-red-500" /> : null}
              <span className={cn("text-[9px]", site.trend === "up" ? "text-green-500" : site.trend === "down" ? "text-red-500" : "text-muted-foreground/50")}>{site.trend}</span>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/5 p-2.5">
            <div className="flex items-center gap-1.5 text-[8px] text-muted-foreground/50 mb-0.5">
              <Server className="h-2.5 w-2.5" /> MCP Status
            </div>
            <p className={cn(
              "text-sm font-bold capitalize",
              site.mcpStatus === "healthy" ? "text-green-500" : site.mcpStatus === "warning" ? "text-orange-500" : "text-red-500"
            )}>{site.mcpStatus}</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/5 p-2.5">
            <div className="flex items-center gap-1.5 text-[8px] text-muted-foreground/50 mb-0.5">
              <AlertTriangle className="h-2.5 w-2.5" /> Open Issues
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-foreground font-mono">{site.openIssues}</p>
              {site.criticalIssues > 0 && (
                <span className="text-[9px] font-semibold text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded">{site.criticalIssues} critical</span>
              )}
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/5 p-2.5">
            <div className="flex items-center gap-1.5 text-[8px] text-muted-foreground/50 mb-0.5">
              <Globe className="h-2.5 w-2.5" /> Region
            </div>
            <p className="text-sm font-bold text-foreground">{site.region.toUpperCase()}</p>
            <p className="text-[9px] text-muted-foreground/50">{site.country}</p>
          </div>
        </div>

        {/* Info rows */}
        <div className="space-y-2">
          <div className="flex items-center justify-between py-1.5 border-b border-border/30">
            <span className="text-[10px] text-muted-foreground/60">Owner</span>
            <span className="text-[10px] font-medium text-foreground">{site.owner}</span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-border/30">
            <span className="text-[10px] text-muted-foreground/60">Team</span>
            <span className="text-[10px] font-medium text-foreground">{site.team}</span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-border/30">
            <span className="text-[10px] text-muted-foreground/60">Business Unit</span>
            <span className="text-[10px] font-medium text-foreground">{site.businessUnit}</span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-border/30">
            <span className="text-[10px] text-muted-foreground/60">Technology</span>
            <span className="text-[10px] font-medium text-foreground">{site.technology}</span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-border/30">
            <span className="text-[10px] text-muted-foreground/60">Last Scan</span>
            <span className="text-[10px] text-foreground">{site.lastScan}</span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-border/30">
            <span className="text-[10px] text-muted-foreground/60">Last Deployment</span>
            <span className="text-[10px] text-foreground">{site.lastDeployment}</span>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-[10px] text-muted-foreground/60">AI Requests</span>
            <span className="text-[10px] font-mono tabular-nums text-foreground">{site.aiRequests.toLocaleString()}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-1.5 pt-2">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-2">Actions</p>
          <button className="flex items-center gap-2 w-full rounded-lg bg-accent/10 px-3 py-2 text-[11px] font-semibold text-accent hover:bg-accent/20 transition-colors">
            <BarChart3 className="h-3.5 w-3.5" />
            View Analytics
          </button>
          <button className="flex items-center gap-2 w-full rounded-lg border border-border bg-muted/5 px-3 py-2 text-[11px] text-muted-foreground hover:text-foreground hover:border-accent/30 transition-colors">
            <FileText className="h-3.5 w-3.5" />
            View Scan History
          </button>
          <button className="flex items-center gap-2 w-full rounded-lg border border-border bg-muted/5 px-3 py-2 text-[11px] text-muted-foreground hover:text-foreground hover:border-accent/30 transition-colors">
            <Lightbulb className="h-3.5 w-3.5" />
            View Recommendations
          </button>
          <button className="flex items-center gap-2 w-full rounded-lg border border-border bg-muted/5 px-3 py-2 text-[11px] text-muted-foreground hover:text-foreground hover:border-accent/30 transition-colors">
            <ExternalLink className="h-3.5 w-3.5" />
            Open Website
          </button>
        </div>
      </div>
    </motion.div>
  );
}
