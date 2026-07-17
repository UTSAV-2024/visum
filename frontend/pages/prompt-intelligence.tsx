"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";
import { track } from "../lib/analytics";
import { CONVERSATIONS, CATEGORIES } from "../components/prompt-intelligence/data";
import { HeaderBar } from "../components/prompt-intelligence/header-bar";
import { CategorySidebar } from "../components/prompt-intelligence/category-sidebar";
import { ConversationCard } from "../components/prompt-intelligence/conversation-card";
import { InsightsPanel } from "../components/prompt-intelligence/insights-panel";
import { LiveActivity } from "../components/prompt-intelligence/live-activity";
import { EngineComparison } from "../components/prompt-intelligence/engine-comparison";
import { ContentGaps } from "../components/prompt-intelligence/content-gaps";

// ── Skeleton ───────────────────────────────────────────────────

function PromptIntelligenceSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-10 bg-card border border-border rounded-xl w-full" />
      <div className="flex gap-4">
        <div className="hidden lg:block w-56 space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-8 bg-card border border-border rounded-lg" />
          ))}
        </div>
        <div className="flex-1 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-28 bg-card border border-border rounded-xl" />
          ))}
        </div>
        <div className="hidden xl:block w-72 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 bg-card border border-border rounded-lg" />
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
          <Sparkles className="h-8 w-8 text-accent" />
        </div>
        <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 shadow-lg">
          <span className="text-[10px] font-bold text-white">AI</span>
        </div>
      </div>
      <h2 className="text-lg font-bold text-foreground">Welcome to Prompt Intelligence</h2>
      <p className="text-sm text-muted-foreground mt-2 max-w-md leading-relaxed">
        Visum monitors what questions AI systems are asking about your website, which pages they use to answer, and whether those answers are accurate.
      </p>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg">
        {[
          { label: "Track Prompts", desc: "See every question AI asks about your business" },
          { label: "Detect Gaps", desc: "Find missing content AI needs to answer correctly" },
          { label: "Improve Accuracy", desc: "Fix answers that hurt your brand" },
        ].map((step) => (
          <div key={step.label} className="rounded-xl border border-border bg-card p-4 text-left">
            <p className="text-xs font-bold text-foreground">{step.label}</p>
            <p className="text-[10px] text-muted-foreground/70 mt-1">{step.desc}</p>
          </div>
        ))}
      </div>
      <button className="mt-8 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent/90 transition-all shadow-lg shadow-accent/20">
        Connect Your Website
      </button>
      <p className="text-[10px] text-muted-foreground/40 mt-3">Tracks ChatGPT, Claude, Gemini, Perplexity, DeepSeek and more</p>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
//  MAIN PAGE
// ═════════════════════════════════════════════════════════════════

export default function PromptIntelligence() {
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEngine, setSelectedEngine] = useState("all");
  const [selectedView, setSelectedView] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loading) track("prompt_intelligence_viewed", {});
  }, [loading]);

  // Filter conversations
  const filteredConversations = useMemo(() => {
    return CONVERSATIONS.filter((conv) => {
      if (selectedCategory && conv.category !== selectedCategory) return false;
      if (selectedEngine !== "all" && conv.engine !== selectedEngine) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          conv.question.toLowerCase().includes(q) ||
          conv.answer.toLowerCase().includes(q) ||
          conv.retrievedPages.some((p) => p.includes(q)) ||
          conv.category.includes(q)
        );
      }
      return true;
    });
  }, [selectedCategory, selectedEngine, searchQuery]);

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const hasData = CONVERSATIONS.length > 0;

  return (
    <>
      <Head>
        <title>Prompt Intelligence - Visum</title>
        <meta name="description" content="Monitor what conversations AI systems are having about your business. Track prompts, detect hallucinations, and improve AI answer accuracy." />
      </Head>

      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {loading ? (
            <PromptIntelligenceSkeleton />
          ) : !hasData ? (
            <EmptyState />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-4 sm:space-y-5"
            >
              {/* ── Header ──────────────────────────────────── */}
              <HeaderBar
                selectedEngine={selectedEngine}
                onEngineChange={setSelectedEngine}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedView={selectedView}
                onViewChange={setSelectedView}
                isMenuOpen={sidebarOpen}
                onMenuToggle={() => setSidebarOpen(true)}
              />

              {/* ── Main Content Grid ──────────────────────── */}
              <div className="relative flex gap-4 sm:gap-5">
                {/* ── Mobile Sidebar Overlay ─────────────────── */}
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
                      onClick={() => setSidebarOpen(false)}
                    />
                  )}
                </AnimatePresence>

                {/* ── Left Sidebar: Categories ──────────────── */}
                <motion.aside
                  className={cn(
                    "w-56 shrink-0 overflow-y-auto scrollbar-thin",
                    // Mobile: fixed overlay drawer
                    "fixed left-0 top-0 bottom-0 z-50 bg-background border-r border-border p-4 transform transition-transform duration-300 lg:relative lg:inset-auto lg:z-auto lg:border-none lg:p-0 lg:transform-none",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                  )}
                  aria-label="Prompt categories"
                >
                  {/* Close button (mobile) */}
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground mb-4 transition-colors"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Close
                  </button>

                  <CategorySidebar
                    selected={selectedCategory}
                    onSelect={(id) => {
                      setSelectedCategory(id);
                      setSidebarOpen(false);
                    }}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                  />
                </motion.aside>

                {/* ── Center: Conversations ───────────────── */}
                <div className="flex-1 min-w-0 space-y-3">
                  {/* Stats bar */}
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground/60 px-1">
                    <span>
                      <span className="font-semibold text-foreground">{filteredConversations.length}</span> conversations
                    </span>
                    {selectedEngine !== "all" && (
                      <span className="flex items-center gap-1">
                        Engine: <span className="font-medium text-foreground capitalize">{selectedEngine}</span>
                        <button onClick={() => setSelectedEngine("all")} className="hover:text-foreground transition-colors">
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </span>
                    )}
                    {selectedCategory && (
                      <span className="flex items-center gap-1">
                        Category: <span className="font-medium text-foreground">{selectedCategory}</span>
                        <button onClick={() => setSelectedCategory(null)} className="hover:text-foreground transition-colors">
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </span>
                    )}
                    {searchQuery && (
                      <span className="flex items-center gap-1">
                        Search: &ldquo;{searchQuery}&rdquo;
                        <button onClick={() => setSearchQuery("")} className="hover:text-foreground transition-colors">
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </span>
                    )}
                  </div>

                  {/* Conversation list */}
                  {filteredConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/10 mb-3">
                        <Sparkles className="h-5 w-5 text-muted-foreground/30" />
                      </div>
                      <p className="text-sm font-medium text-foreground">No conversations found</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">Try adjusting your filters or search query</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredConversations.map((conv, i) => (
                        <motion.div
                          key={conv.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.03 * i }}
                        >
                          <ConversationCard
                            conversation={conv}
                            isExpanded={expandedId === conv.id}
                            onToggle={() => handleToggleExpand(conv.id)}
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── Right Panel: Insights + Activity ────── */}
                <aside className="hidden xl:block w-72 shrink-0 space-y-6 overflow-y-auto scrollbar-thin" aria-label="Insights and activity">
                  {/* AI Observations */}
                  <div className="rounded-xl border border-border bg-card p-4">
                    <InsightsPanel />
                  </div>

                  {/* Content Gaps */}
                  <div className="rounded-xl border border-border bg-card p-4">
                    <ContentGaps />
                  </div>

                  {/* Engine Comparison */}
                  <div className="rounded-xl border border-border bg-card p-4">
                    <EngineComparison />
                  </div>

                  {/* Live Activity */}
                  <div className="rounded-xl border border-border bg-card p-4">
                    <LiveActivity />
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
