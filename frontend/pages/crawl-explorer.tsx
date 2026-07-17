import { useState, useCallback } from "react";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "../lib/utils";
import { HeaderBar } from "../components/crawl-explorer/header-bar";
import { CrawlGraph } from "../components/crawl-explorer/crawl-graph";
import { Inspector } from "../components/crawl-explorer/inspector";
import { CrawlLogs } from "../components/crawl-explorer/crawl-logs";
import { AIThinking } from "../components/crawl-explorer/ai-thinking";
import { ENGINES, CRAWL_PAGES, type CrawlPage } from "../components/crawl-explorer/data";

export default function CrawlExplorer() {
  const [selectedEngine, setSelectedEngine] = useState("chatgpt");
  const [selectedPage, setSelectedPage] = useState<CrawlPage | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogs, setShowLogs] = useState(true);
  const [fullscreenGraph, setFullscreenGraph] = useState(false);

  const currentEngine = ENGINES.find((e) => e.id === selectedEngine) || ENGINES[0];

  const handleRunCrawl = useCallback(() => {
    // Placeholder — will trigger a new crawl in production
    setSelectedPage(null);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    const match = CRAWL_PAGES.find((p) =>
      p.path.toLowerCase().includes(query.toLowerCase()) ||
      p.title.toLowerCase().includes(query.toLowerCase())
    );
    if (match && query.length > 0) {
      setSelectedPage(match);
    }
  }, []);

  return (
    <>
      <Head>
        <title>AI Crawl Explorer — Visum</title>
        <meta
          name="description"
          content="Interactive visualization of how AI systems crawl, understand, and interact with your website."
        />
      </Head>

      <div className="h-screen flex flex-col bg-background overflow-hidden">
        {/* ── Page Content ─────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header */}
          <div className="shrink-0 px-4 sm:px-6 pt-4 sm:pt-5 pb-2">
            <HeaderBar
              selectedEngine={selectedEngine}
              onEngineChange={setSelectedEngine}
              onSearch={handleSearch}
              onRunCrawl={handleRunCrawl}
            />
          </div>

          {/* Main split layout */}
          <div className="flex-1 flex flex-col lg:flex-row min-h-0 px-4 sm:px-6 pb-4 gap-4">
            {/* Left: Graph area */}
            <div
              className={cn(
                "flex flex-col min-h-0 transition-all duration-300",
                fullscreenGraph
                  ? "flex-1"
                  : selectedPage
                  ? "lg:flex-[3]"
                  : "lg:flex-1"
              )}
            >
              {/* AI Thinking + Graph */}
              <div className="flex flex-col min-h-0 flex-1 gap-3">
                <AIThinking engine={currentEngine} />

                {/* Graph container */}
                <div
                  className={cn(
                    "relative flex-1 min-h-[300px] rounded-xl border border-border bg-card overflow-hidden",
                    fullscreenGraph && "fixed inset-0 z-50 m-4 rounded-2xl"
                  )}
                >
                  <CrawlGraph
                    selectedPage={selectedPage}
                    onSelectPage={setSelectedPage}
                  />

                  {/* Graph controls */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                    <button
                      onClick={() => setFullscreenGraph(!fullscreenGraph)}
                      className="flex items-center justify-center w-7 h-7 rounded-md bg-card/80 backdrop-blur-sm border border-border text-muted-foreground/50 hover:text-foreground transition-colors"
                      aria-label={fullscreenGraph ? "Exit fullscreen" : "Fullscreen"}
                    >
                      {fullscreenGraph ? (
                        <Minimize2 className="h-3.5 w-3.5" />
                      ) : (
                        <Maximize2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Close fullscreen */}
                  {fullscreenGraph && (
                    <button
                      onClick={() => setFullscreenGraph(false)}
                      className="absolute top-3 right-3 z-10 flex items-center justify-center w-7 h-7 rounded-md bg-card/80 backdrop-blur-sm border border-border text-muted-foreground/50 hover:text-foreground transition-colors"
                      aria-label="Close fullscreen"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Inspector */}
            <AnimatePresence>
              {selectedPage && !fullscreenGraph && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 340, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="shrink-0 overflow-hidden"
                >
                  <div className="w-[340px] h-full rounded-xl border border-border bg-card overflow-hidden">
                    <Inspector
                      page={selectedPage}
                      onClose={() => setSelectedPage(null)}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom: Logs */}
          <AnimatePresence>
            {showLogs && !fullscreenGraph && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 240, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="shrink-0 overflow-hidden border-t border-border"
              >
                <div className="h-full px-4 sm:px-6 py-3">
                  <CrawlLogs className="h-full" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle logs button */}
          {!fullscreenGraph && (
            <div className="shrink-0 border-t border-border/50 px-4 sm:px-6 py-1">
              <button
                onClick={() => setShowLogs(!showLogs)}
                className="flex items-center gap-1.5 text-[9px] text-muted-foreground/40 hover:text-muted-foreground transition-colors"
              >
                <span
                  className={cn(
                    "inline-block w-2 h-2 rounded-full",
                    showLogs ? "bg-accent" : "bg-muted-foreground/20"
                  )}
                />
                {showLogs ? "Hide logs" : "Show logs"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
