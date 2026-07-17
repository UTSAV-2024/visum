"use client";

import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Server, Terminal } from "lucide-react";
import { cn } from "../lib/utils";
import { track } from "../lib/analytics";
import { MCP_SERVER, MCP_TOOLS, MCP_ENDPOINTS, LIVE_CONNECTIONS, MCP_LOGS } from "../components/hosted-mcp/data";
import { HeaderBar } from "../components/hosted-mcp/header-bar";
import { MCPSidebar } from "../components/hosted-mcp/mcp-sidebar";
import { ServerStatus } from "../components/hosted-mcp/server-status";
import { DeploymentTimeline } from "../components/hosted-mcp/deployment-timeline";
import { ToolsPanel } from "../components/hosted-mcp/tools-panel";
import { EndpointsPanel } from "../components/hosted-mcp/endpoints-panel";
import { LiveConnections } from "../components/hosted-mcp/live-connections";
import { LogsPanel } from "../components/hosted-mcp/logs-panel";
import { AuthenticationPanel } from "../components/hosted-mcp/authentication-panel";
import { MonitoringPanel } from "../components/hosted-mcp/monitoring-panel";

// ── Skeleton ───────────────────────────────────────────────────

function MCPSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-10 bg-card border border-border rounded-xl" />
      <div className="flex gap-4">
        <div className="hidden lg:block w-44 space-y-1">
          {Array.from({ length: 12 }).map((_, i) => <div key={i} className="h-6 bg-card border border-border rounded-lg" />)}
        </div>
        <div className="flex-1 space-y-3">
          <div className="h-16 bg-card border border-border rounded-xl" />
          <div className="h-48 bg-card border border-border rounded-xl" />
        </div>
        <div className="hidden xl:block w-72 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 bg-card border border-border rounded-lg" />)}
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
//  MAIN PAGE
// ═════════════════════════════════════════════════════════════════

export default function HostedMCP() {
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loading) track("hosted_mcp_viewed", {});
  }, [loading]);

  const handleDeploy = useCallback(() => track("mcp_deploy_clicked", {}), []);
  const handleRollback = useCallback(() => track("mcp_rollback_clicked", {}), []);
  const handleRestart = useCallback(() => track("mcp_restart_clicked", {}), []);

  return (
    <>
      <Head>
        <title>Hosted MCP Console - Visum</title>
        <meta name="description" content="Visum Hosted MCP — Deploy, manage, monitor, and scale production MCP servers for AI agents." />
      </Head>

      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {loading ? (
            <MCPSkeleton />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="space-y-4"
            >
              {/* ── Header ──────────────────────────────────── */}
              <HeaderBar onDeploy={handleDeploy} onRollback={handleRollback} onRestart={handleRestart} />

              {/* ── Main Layout ────────────────────────────── */}
              <div className="relative flex gap-4 sm:gap-5">
                {/* Mobile overlay */}
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
                      onClick={() => setSidebarOpen(false)}
                    />
                  )}
                </AnimatePresence>

                {/* ── Left Sidebar ─────────────────────────── */}
                <motion.aside
                  className={cn(
                    "w-44 shrink-0 overflow-y-auto scrollbar-thin",
                    "fixed left-0 top-0 bottom-0 z-50 bg-background border-r border-border p-4 transform transition-transform duration-300 lg:relative lg:inset-auto lg:z-auto lg:border-none lg:p-0 lg:transform-none",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                  )}
                  aria-label="MCP navigation"
                >
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground mb-4 transition-colors"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Close
                  </button>
                  <MCPSidebar activeSection={activeSection} onSectionChange={(id) => { setActiveSection(id); setSidebarOpen(false); }} />
                </motion.aside>

                {/* ── Center: Main Content ────────────────── */}
                <div className="flex-1 min-w-0 space-y-4">
                  {/* Overview */}
                  {activeSection === "overview" && (
                    <>
                      <div className="rounded-xl border border-border bg-card p-4">
                        <ServerStatus />
                      </div>
                      <div className="rounded-xl border border-border bg-card p-4">
                        <DeploymentTimeline />
                      </div>
                      <div className="rounded-xl border border-border bg-card p-4">
                        <LogsPanel />
                      </div>
                    </>
                  )}

                  {/* Deployments */}
                  {activeSection === "deployments" && (
                    <div className="rounded-xl border border-border bg-card p-4">
                      <DeploymentTimeline />
                    </div>
                  )}

                  {/* Endpoints */}
                  {activeSection === "endpoints" && (
                    <div className="rounded-xl border border-border bg-card p-4">
                      <EndpointsPanel />
                    </div>
                  )}

                  {/* Tools */}
                  {activeSection === "tools" && (
                    <div className="rounded-xl border border-border bg-card p-4">
                      <ToolsPanel />
                    </div>
                  )}

                  {/* Authentication */}
                  {activeSection === "authentication" && (
                    <div className="rounded-xl border border-border bg-card p-4">
                      <AuthenticationPanel />
                    </div>
                  )}

                  {/* Logs */}
                  {activeSection === "logs" && (
                    <div className="rounded-xl border border-border bg-card p-4">
                      <LogsPanel />
                    </div>
                  )}

                  {/* Monitoring */}
                  {activeSection === "monitoring" && (
                    <div className="rounded-xl border border-border bg-card p-4">
                      <MonitoringPanel />
                    </div>
                  )}
                </div>

                {/* ── Right Panel ──────────────────────────── */}
                <aside className="hidden xl:flex xl:flex-col xl:w-80 shrink-0 gap-4">
                  {/* Server Status (minimal) */}
                  <div className="rounded-xl border border-border bg-card p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Server className="h-3.5 w-3.5 text-accent" />
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground">Server Info</p>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px]"><span className="text-muted-foreground/60">Version</span><span className="font-mono font-semibold">{MCP_SERVER.version}</span></div>
                      <div className="flex justify-between text-[10px]"><span className="text-muted-foreground/60">Uptime</span><span className="font-mono font-semibold">{MCP_SERVER.uptime}</span></div>
                      <div className="flex justify-between text-[10px]"><span className="text-muted-foreground/60">Region</span><span className="font-mono font-semibold">{MCP_SERVER.region}</span></div>
                      <div className="flex justify-between text-[10px]"><span className="text-muted-foreground/60">Latency</span><span className="font-mono font-semibold text-green-500">{MCP_SERVER.latency}</span></div>
                      <div className="flex justify-between text-[10px]"><span className="text-muted-foreground/60">Connections</span><span className="font-mono font-semibold">{MCP_SERVER.concurrentConnections}</span></div>
                    </div>
                  </div>

                  {/* Live Connections */}
                  <div className="rounded-xl border border-border bg-card p-4 max-h-[280px] overflow-hidden">
                    <LiveConnections />
                  </div>

                  {/* Quick Stats */}
                  <div className="rounded-xl border border-border bg-card p-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-lg bg-muted/5 border border-border/40 p-2">
                        <span className="text-[8px] text-muted-foreground/50 block">Tools</span>
                        <span className="text-xs font-bold text-foreground font-mono">{MCP_TOOLS.length}</span>
                        <span className="text-[8px] text-muted-foreground/40 block">{MCP_TOOLS.filter(t => t.enabled).length} active</span>
                      </div>
                      <div className="rounded-lg bg-muted/5 border border-border/40 p-2">
                        <span className="text-[8px] text-muted-foreground/50 block">Endpoints</span>
                        <span className="text-xs font-bold text-foreground font-mono">{MCP_ENDPOINTS.length}</span>
                        <span className="text-[8px] text-muted-foreground/40 block">{MCP_ENDPOINTS.filter(e => e.status === "healthy").length} healthy</span>
                      </div>
                      <div className="rounded-lg bg-muted/5 border border-border/40 p-2">
                        <span className="text-[8px] text-muted-foreground/50 block">Clients</span>
                        <span className="text-xs font-bold text-foreground font-mono">{LIVE_CONNECTIONS.filter(c => c.status === "connected").length}</span>
                        <span className="text-[8px] text-muted-foreground/40 block">connected</span>
                      </div>
                      <div className="rounded-lg bg-muted/5 border border-border/40 p-2">
                        <span className="text-[8px] text-muted-foreground/50 block">Logs (24h)</span>
                        <span className="text-xs font-bold text-foreground font-mono">{MCP_LOGS.length}</span>
                        <span className="text-[8px] text-muted-foreground/40 block">{MCP_LOGS.filter(l => l.type === "error").length} errors</span>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
