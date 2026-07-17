"use client";

import { motion } from "framer-motion";
import {
  Server,
  Rocket,
  Undo2,
  RefreshCw,
  Settings,
  BookOpen,
  Globe,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { MCP_SERVER } from "./data";

interface HeaderBarProps {
  onDeploy: () => void;
  onRollback: () => void;
  onRestart: () => void;
}

export function HeaderBar({ onDeploy, onRollback, onRestart }: HeaderBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col sm:flex-row items-start sm:items-center gap-3 py-3"
    >
      {/* Project Info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
          <Server className="h-4 w-4 text-accent" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-foreground truncate">Hosted MCP</h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[9px] font-semibold text-green-500">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              {MCP_SERVER.status}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground/50 truncate font-mono">
            {MCP_SERVER.name} · {MCP_SERVER.version} · {MCP_SERVER.region}
          </p>
        </div>
      </div>

      {/* Spacer */}
      <div className="hidden sm:block flex-1" />

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          onClick={onDeploy}
          className="flex items-center gap-1.5 h-8 rounded-lg bg-accent px-3 text-[11px] font-semibold text-white hover:bg-accent/90 transition-all shadow-sm"
        >
          <Rocket className="h-3.5 w-3.5" />
          Deploy
        </button>
        <button
          onClick={onRollback}
          className="flex items-center gap-1.5 h-8 rounded-lg border border-border bg-muted/5 px-2.5 text-[11px] text-muted-foreground hover:text-foreground hover:border-orange-500/40 transition-all"
        >
          <Undo2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Rollback</span>
        </button>
        <button
          onClick={onRestart}
          className="flex items-center gap-1.5 h-8 rounded-lg border border-border bg-muted/5 px-2.5 text-[11px] text-muted-foreground hover:text-foreground hover:border-accent/30 transition-all"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Restart</span>
        </button>
        <button className="flex items-center gap-1.5 h-8 rounded-lg border border-border bg-muted/5 px-2.5 text-[11px] text-muted-foreground hover:text-foreground hover:border-accent/30 transition-all">
          <Settings className="h-3.5 w-3.5" />
        </button>
        <button className="flex items-center gap-1.5 h-8 rounded-lg border border-border bg-muted/5 px-2.5 text-[11px] text-muted-foreground hover:text-foreground hover:border-accent/30 transition-all">
          <BookOpen className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Docs</span>
        </button>
      </div>
    </motion.div>
  );
}
