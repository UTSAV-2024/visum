"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Users,
  FolderKanban,
  Cloud,
  Server,
  CreditCard,
  ScrollText,
  Shield,
  KeyRound,
  Settings,
  Activity,
  Building2,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { ORG_STATS } from "./data";

const NAV_ITEMS = [
  { id: "websites", label: "Websites", icon: Globe, count: ORG_STATS.totalSites },
  { id: "teams", label: "Teams", icon: Users, count: ORG_STATS.teams },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "environments", label: "Environments", icon: Cloud },
  { id: "hosted-mcp", label: "Hosted MCP", icon: Server },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "audit-logs", label: "Audit Logs", icon: ScrollText },
  { id: "security", label: "Security", icon: Shield },
  { id: "api-keys", label: "API Keys", icon: KeyRound },
  { id: "settings", label: "Settings", icon: Settings },
];

interface OrgSidebarProps {
  activeSection: string;
  onSectionChange: (id: string) => void;
}

export function OrgSidebar({ activeSection, onSectionChange }: OrgSidebarProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-1 mb-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10">
          <Building2 className="h-3.5 w-3.5 text-accent" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">Nike Inc.</p>
          <p className="text-[9px] text-muted-foreground/50 truncate">Enterprise</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto scrollbar-thin pr-1" aria-label="Organization navigation">
        {NAV_ITEMS.map((item, i) => (
          <motion.button
            key={item.id}
            initial={mounted ? { opacity: 0, x: -8 } : undefined}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.03 * i }}
            onClick={() => onSectionChange(item.id)}
            className={cn(
              "flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-xs transition-all group",
              activeSection === item.id
                ? "bg-accent/10 text-accent font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/10"
            )}
          >
            <item.icon className="h-3.5 w-3.5 shrink-0" />
            <span className="flex-1 text-left">{item.label}</span>
            {item.count !== undefined && (
              <span className="font-mono text-[10px] tabular-nums text-muted-foreground/50">{item.count}</span>
            )}
          </motion.button>
        ))}
      </nav>

      {/* Stats footer */}
      <div className="mt-auto pt-3 border-t border-border/50">
        <div className="px-3 py-2 space-y-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground/50">Health</span>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-green-500" /> {ORG_STATS.healthySites}</span>
              <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-orange-500" /> {ORG_STATS.warningSites}</span>
              <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-red-500" /> {ORG_STATS.criticalSites}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground/50">Avg Score</span>
            <span className="font-mono tabular-nums text-foreground font-semibold">{ORG_STATS.avgScore}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
