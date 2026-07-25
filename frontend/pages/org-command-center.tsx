"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Head from "next/head";
import { PreviewBanner } from "../components/preview-banner";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Building2, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";
import { track } from "../lib/analytics";
import { WEBSITES, ORG_STATS, type Website } from "../components/org-command-center/data";
import { HeaderBar } from "../components/org-command-center/header-bar";
import { OrgSidebar } from "../components/org-command-center/org-sidebar";
import { SiteTable } from "../components/org-command-center/site-table";
import { SiteInspector } from "../components/org-command-center/site-inspector";
import { GlobalMap } from "../components/org-command-center/global-map";
import { ActivityTimeline } from "../components/org-command-center/activity-timeline";
import { ExecutiveSummary } from "../components/org-command-center/executive-summary";
import { withAuthRequired } from "../lib/auth-guard";

// ── Skeleton ───────────────────────────────────────────────────

function OrgSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-10 bg-card border border-border rounded-xl w-full" />
      <div className="flex gap-4">
        <div className="hidden lg:block w-48 space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-7 bg-card border border-border rounded-lg" />
          ))}
        </div>
        <div className="flex-1 space-y-1">
          <div className="h-8 bg-card border border-border rounded-lg w-full" />
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-10 bg-card border border-border rounded-lg" />
          ))}
        </div>
        <div className="hidden xl:block w-80 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 bg-card border border-border rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Empty State ────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="relative mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20">
          <Building2 className="h-8 w-8 text-accent" />
        </div>
      </div>
      <h2 className="text-lg font-bold text-foreground">Organization Command Center</h2>
      <p className="text-sm text-muted-foreground mt-2 max-w-md leading-relaxed">
        Manage all your websites, brands, and environments from a single control plane. Monitor AI visibility, hosted MCP infrastructure, and team activity across your entire organization.
      </p>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg">
        {[
          { label: "Add Websites", desc: "Connect all your domains and subdomains" },
          { label: "Monitor Health", desc: "Track AI visibility across every site" },
          { label: "Manage Teams", desc: "Assign owners and control access" },
        ].map((step) => (
          <div key={step.label} className="rounded-xl border border-border bg-card p-4 text-left">
            <p className="text-xs font-bold text-foreground">{step.label}</p>
            <p className="text-[10px] text-muted-foreground/70 mt-1">{step.desc}</p>
          </div>
        ))}
      </div>
      <button className="mt-8 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent/90 transition-all shadow-lg shadow-accent/20">
        Add First Website
      </button>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
//  MAIN PAGE
// ═════════════════════════════════════════════════════════════════

export default function OrgCommandCenter() {
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("websites");
  const [searchQuery, setSearchQuery] = useState("");
  const [groupBy, setGroupBy] = useState("none");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedEnv, setSelectedEnv] = useState("all");
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loading) track("org_command_center_viewed", {});
  }, [loading]);

  const filteredSites = useMemo(() => {
    let result = [...WEBSITES];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.domain.toLowerCase().includes(q) ||
          s.owner.toLowerCase().includes(q) ||
          s.country.toLowerCase().includes(q)
      );
    }
    if (selectedRegion !== "all") {
      result = result.filter((s) => s.region === selectedRegion);
    }
    if (selectedEnv !== "all") {
      result = result.filter((s) => s.environment === selectedEnv);
    }

    return result;
  }, [searchQuery, selectedRegion, selectedEnv]);

  const selectedSite = WEBSITES.find((s) => s.id === selectedSiteId) || null;

  const handleSelect = useCallback((id: string) => {
    setSelectedSiteId((prev) => (prev === id ? null : id));
  }, []);

  const handleSelectToggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleBulkAction = useCallback((action: string) => {
    track("org_bulk_action", { action, count: selectedIds.size });
  }, [selectedIds]);

  const hasData = WEBSITES.length > 0;

  return (
    <>
      <Head>
        <title>Organization Command Center - Visum</title>
        <meta
          name="description"
          content="Enterprise command center — manage AI visibility, MCP infrastructure, and team activity across your entire organization."
        />
      </Head>

      <PreviewBanner />

      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {loading ? (
            <OrgSkeleton />
          ) : !hasData ? (
            <EmptyState />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="space-y-4"
            >
              {/* ── Header ──────────────────────────────────── */}
              <div className="flex items-center gap-3">
                <div className="min-w-0">
                  <h1 className="text-base sm:text-lg font-bold text-foreground truncate">Organization Command Center</h1>
                  <p className="text-[10px] text-muted-foreground/50 truncate">
                    {WEBSITES.filter((s) => s.health === "healthy").length} healthy · {WEBSITES.filter((s) => s.health === "critical").length} critical · Avg {ORG_STATS.avgScore}
                  </p>
                </div>
              </div>

              <HeaderBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                groupBy={groupBy}
                onGroupChange={setGroupBy}
                selectedRegion={selectedRegion}
                onRegionChange={setSelectedRegion}
                selectedEnv={selectedEnv}
                onEnvChange={setSelectedEnv}
                selectedCount={selectedIds.size}
                onBulkAction={handleBulkAction}
              />

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
                    "w-48 shrink-0 overflow-y-auto scrollbar-thin",
                    "fixed left-0 top-0 bottom-0 z-50 bg-background border-r border-border p-4 transform transition-transform duration-300 lg:relative lg:inset-auto lg:z-auto lg:border-none lg:p-0 lg:transform-none",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                  )}
                  aria-label="Organization navigation"
                >
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground mb-4 transition-colors"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Close
                  </button>
                  <OrgSidebar activeSection={activeSection} onSectionChange={(id) => { setActiveSection(id); setSidebarOpen(false); }} />
                </motion.aside>

                {/* ── Center: Site Table ──────────────────── */}
                <div className="flex-1 min-w-0 space-y-4">
                  {/* Global Map */}
                  <GlobalMap selectedId={selectedSiteId} onSelect={handleSelect} />

                  {/* Stats bar */}
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60 px-1">
                    <span>
                      <span className="font-semibold text-foreground">{filteredSites.length}</span> websites
                    </span>
                    <span>·</span>
                    <span>
                      <span className="font-semibold text-green-500">{filteredSites.filter((s) => s.health === "healthy").length}</span> healthy
                    </span>
                    <span>·</span>
                    <span>
                      <span className="font-semibold text-red-500">{filteredSites.filter((s) => s.health === "critical").length}</span> critical
                    </span>
                    <span>·</span>
                    <span className="font-mono tabular-nums">
                      Avg: <span className="font-semibold text-foreground">{Math.round(filteredSites.reduce((s, w) => s + w.aiVisibilityScore, 0) / filteredSites.length)}</span>
                    </span>
                  </div>

                  {/* Site Table */}
                  {activeSection === "websites" && (
                    <div className="rounded-xl border border-border bg-card overflow-hidden">
                      <SiteTable
                        items={filteredSites}
                        selectedId={selectedSiteId}
                        onSelect={handleSelect}
                        groupBy={groupBy}
                        selectedIds={selectedIds}
                        onSelectToggle={handleSelectToggle}
                      />
                    </div>
                  )}

                  {/* Activity Timeline */}
                  {activeSection === "audit-logs" && (
                    <div className="rounded-xl border border-border bg-card p-4">
                      <ActivityTimeline />
                    </div>
                  )}
                </div>

                {/* ── Right Panel ──────────────────────────── */}
                <aside className="hidden xl:flex xl:flex-col xl:w-80 shrink-0 gap-4">
                  {/* Executive Summary */}
                  <div className="rounded-xl border border-border bg-card p-4">
                    <ExecutiveSummary />
                  </div>

                  {/* Site Inspector */}
                  <div className="rounded-xl border border-border bg-card p-4 flex-1 min-h-0 max-h-[50vh] overflow-hidden">
                    <SiteInspector site={selectedSite} onClose={() => setSelectedSiteId(null)} />
                  </div>

                  {/* Activity (always visible) */}
                  <div className="rounded-xl border border-border bg-card p-4 max-h-[280px] overflow-hidden">
                    <ActivityTimeline />
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

// ── Access control ──────────────────────────────────────────────
// Verified server-side: this page never reaches an unauthenticated browser,
// with or without a direct URL.
export const getServerSideProps = withAuthRequired();
