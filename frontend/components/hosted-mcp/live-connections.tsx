"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Bot,
  Sparkles,
  Code2,
  Wind,
  Terminal,
  Zap,
  Shield,
  Plug,
  Wifi,
  WifiOff,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { LIVE_CONNECTIONS } from "./data";

const CLIENT_ICONS: Record<string, React.ReactNode> = {
  brain: <Brain className="h-3 w-3" />,
  bot: <Bot className="h-3 w-3" />,
  sparkles: <Sparkles className="h-3 w-3" />,
  code: <Code2 className="h-3 w-3" />,
  wind: <Wind className="h-3 w-3" />,
  terminal: <Terminal className="h-3 w-3" />,
  zap: <Zap className="h-3 w-3" />,
  shield: <Shield className="h-3 w-3" />,
};

const CLIENT_COLORS: Record<string, string> = {
  ChatGPT: "#10a37f",
  Claude: "#6a4fc9",
  Gemini: "#4285f4",
  Cursor: "#6c47ff",
  Windsurf: "#0284c7",
  "VS Code": "#007acc",
  "OpenAI API": "#10a37f",
  "Anthropic API": "#6a4fc9",
};

export function LiveConnections() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const connected = LIVE_CONNECTIONS.filter((c) => c.status === "connected");

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Plug className="h-3.5 w-3.5 text-accent" />
        <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground">Live Connections</p>
        <span className="ml-auto flex items-center gap-1 text-[9px] text-green-500">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          {connected.length} connected
        </span>
      </div>

      <div className="space-y-1.5">
        {LIVE_CONNECTIONS.map((conn, i) => {
          const color = CLIENT_COLORS[conn.client] || "#888";
          return (
            <motion.div
              key={conn.id}
              initial={mounted ? { opacity: 0, y: 4 } : undefined}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: 0.03 * i }}
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted/10 transition-colors"
            >
              <div
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
                style={{ backgroundColor: `${color}15`, color }}
              >
                {CLIENT_ICONS[conn.icon] || <Bot className="h-3 w-3" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-foreground" style={{ color }}>{conn.client}</span>
                  {conn.status === "connected" ? (
                    <Wifi className="h-2.5 w-2.5 text-green-500" />
                  ) : (
                    <WifiOff className="h-2.5 w-2.5 text-muted-foreground/40" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-[8px] text-muted-foreground/50 mt-0.5">
                  <span className="font-mono">{conn.requests.toLocaleString()} req</span>
                  <span>·</span>
                  <span>{conn.sessionDuration}</span>
                  <span>·</span>
                  <code className="font-mono">{conn.currentTool}</code>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
