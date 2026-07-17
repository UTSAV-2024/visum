import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { cn } from "../lib/utils";
import { track } from "../lib/analytics";
import { AI_INSIGHTS } from "../components/insights/data";
import { ChatInterface } from "../components/insights/chat-interface";
import { InsightCards } from "../components/insights/insight-cards";
import { Summaries } from "../components/insights/summaries";
import { TrafficForecast } from "../components/insights/traffic-forecast";
import { QuestionsSection } from "../components/insights/questions-section";
import { SuggestedImprovements } from "../components/insights/suggested-improvements";
import { RecentConversations } from "../components/insights/recent-conversations";
import { InsightsSkeleton } from "../components/insights/loading-skeleton";

export default function AIInsights() {
  const [loading, setLoading] = useState(true);
  const [externalInput, setExternalInput] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loading) track("insights_viewed", {});
  }, [loading]);

  const handleQuestionClick = useCallback((question) => {
    setExternalInput(question);
  }, []);

  const insightsCount = AI_INSIGHTS.length;
  const criticalCount = AI_INSIGHTS.filter((i) => i.type === "risk").length;
  const predictionsCount = AI_INSIGHTS.filter((i) => i.type === "prediction").length;

  return (
    <>
      <Head>
        <title>AI Insights - Visum</title>
        <meta name="description" content="AI-powered insights, predictions, and recommendations for your website's AI visibility." />
      </Head>

      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex h-14 sm:h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-foreground no-underline">
              <svg className="h-6 w-6 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
              </svg>
              Visum
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/" className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[11px] sm:text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 no-underline">
                New Scan
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
          {loading ? (
            <InsightsSkeleton />
          ) : (
            <div className="animate-fadeIn space-y-4 sm:space-y-6">
              {/* Page Header */}
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">AI Insights</h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  {insightsCount} insights generated · {criticalCount} risks detected · {predictionsCount} predictions
                </p>
              </div>

              {/* Daily + Weekly Summaries */}
              <Summaries />

              {/* Chat + Insight Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2">
                  <ChatInterface onExternalInput={externalInput} />
                </div>
                <div className="space-y-3">
                  <InsightCards />
                </div>
              </div>

              {/* Traffic Forecast */}
              <TrafficForecast />

              {/* Questions + Recent Conversations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-4">
                  <QuestionsSection onQuestionClick={handleQuestionClick} />
                  <SuggestedImprovements />
                </div>
                <RecentConversations onSelectConversation={(id) => track("conversation_selected", { conversation_id: id })} />
              </div>

              {/* Empty state for when no insights */}
              {insightsCount === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 mb-4">
                    <svg className="h-8 w-8 text-accent" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 1a4.5 4.5 0 00-4.5 4.5v2.5a2 2 0 00-2 2v4a2 2 0 002 2h9a2 2 0 002-2v-4a2 2 0 00-2-2v-2.5A4.5 4.5 0 0010 1zm-2.5 7V5.5a2.5 2.5 0 015 0V8h-5z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-foreground">No insights yet</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                    Run a scan first to generate AI-powered insights about your website's visibility.
                  </p>
                  <Link href="/" className="mt-4 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors no-underline">
                    Scan Your Site
                  </Link>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-border mt-8">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Visum</p>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Home</Link>
              <Link href="/dashboard" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
              <Link href="/analytics" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Analytics</Link>
              <Link href="/reports" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Reports</Link>
              <Link href="/team" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Team</Link>
              <Link href="/competitors" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Competitors</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
