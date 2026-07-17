"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  GitBranch,
  Server,
  Wrench,
  Shield,
  FileJson,
  Terminal,
  BarChart3,
  ChartLine,
  TrendingUp,
  Activity,
  Globe,
  ShieldAlert,
  Webhook,
  ScrollText,
} from "lucide-react";
import { cn } from "../../lib/utils";

const ICON_MAP: Record<string, React.ReactNode> = {
  "layout-dashboard": <LayoutDashboard className="h-3.5 w-3.5" />,
  "git-branch": <GitBranch className="h-3.5 w-3.5" />,
  server: <Server className="h-3.5 w-3.5" />,
  wrench: <Wrench className="h-3.5 w-3.5" />,
  shield: <Shield className="h-3.5 w-3.5" />,
  "file-json": <FileJson className="h-3.5 w-3.5" />,
  terminal: <Terminal className="h-3.5 w-3.5" />,
  "bar-chart": <BarChart3 className="h-3.5 w-3.5" />,
  "chart-line": <ChartLine className="h-3.5 w-3.5" />,
  "trending-up": <TrendingUp className="h-3.5 w-3.5" />,
  activity: <Activity className="h-3.5 w-3.5" />,
  globe: <Globe className="h-3.5 w-3.5" />,
  "shield-alert": <ShieldAlert className="h-3.5 w-3.5" />,
  webhook: <Webhook className="h-3.5 w-3.5" />,
  "scroll-text": <ScrollText className="h-3.5 w-3.5" />,
};

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: "layout-dashboard" },
  { id: "deployments", label: "Deployments", icon: "git-branch" },
  { id: "endpoints", label: "Endpoints", icon: "server" },
  { id: "tools", label: "Tools", icon: "wrench" },
  { id: "authentication", label: "Authentication", icon: "shield" },
  { id: "env-vars", label: "Environment Variables", icon: "file-json" },
  { id: "logs", label: "Logs", icon: "terminal" },
  { id: "usage", label: "Usage", icon: "bar-chart" },
  { id: "analytics", label: "Analytics", icon: "chart-line" },
  { id: "scaling", label: "Scaling", icon: "trending-up" },
  { id: "monitoring", label: "Monitoring", icon: "activity" },
  { id: "domains", label: "Domains", icon: "globe" },
  { id: "security", label: "Security", icon: "shield-alert" },
  { id: "webhooks", label: "Webhooks", icon: "webhook" },
  { id: "audit-logs", label: "Audit Logs", icon: "scroll-text" },
];

interface MCPSidebarProps {
  activeSection: string;
  onSectionChange: (id: string) => void;
}

export function MCPSidebar({ activeSection, onSectionChange }: MCPSidebarProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-1 mb-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10">
          <Server className="h-3.5 w-3.5 text-accent" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">MCP Server</p>
          <p className="text-[9px] text-muted-foreground/50 truncate font-mono">Production · us-east-1</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto scrollbar-thin pr-1" aria-label="MCP navigation">
        {NAV_ITEMS.map((item, i) => (
          <motion.button
            key={item.id}
            initial={mounted ? { opacity: 0, x: -8 } : undefined}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15, delay: 0.02 * i }}
            onClick={() => onSectionChange(item.id)}
            className={cn(
              "flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-xs transition-all group",
              activeSection === item.id
                ? "bg-accent/10 text-accent font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/10"
            )}
          >
            <span className="shrink-0">{ICON_MAP[item.icon] || <Server className="h-3.5 w-3.5" />}</span>
            <span className="flex-1 text-left">{item.label}</span>
          </motion.button>
        ))}
      </nav>
    </div>
  );
}
