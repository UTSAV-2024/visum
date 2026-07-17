import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { cn } from "../lib/utils";
import { track } from "../lib/analytics";
import { Leaderboard } from "../components/competitors/leaderboard";
import { RadarChart } from "../components/competitors/radar-chart";
import { GapAnalysis } from "../components/competitors/gap-analysis";
import { BenchmarkGraph } from "../components/competitors/benchmark-graph";
import { FeatureComparison } from "../components/competitors/feature-comparison";
import { RecommendationComparison } from "../components/competitors/recommendation-comparison";
import { CompetitorsSkeleton } from "../components/competitors/loading-skeleton";
import { YOUR_SITE, INDUSTRY_AVG, COMPETITORS } from "../components/competitors/data";

export default function CompetitorIntelligence() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loading) track("competitors_viewed", {});
  }, [loading]);

  return (
    <>
      <Head>
        <title>Competitor Intelligence - Visum</title>
        <meta name="description" content="Compare your AI visibility against competitors with leaderboards, gap analysis, and benchmarks." />
      </Head>

      <div>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
          {loading ? (
            <CompetitorsSkeleton />
          ) : (
            <div className="animate-fadeIn space-y-4 sm:space-y-6">
              {/* Page Header */}
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">Competitor Intelligence</h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Compare your AI visibility against competitors and industry benchmarks
                </p>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {[
                  { label: "Your Rank", value: `#${YOUR_SITE.rank}`, sub: `of ${COMPETITORS.length}`, color: "text-accent" },
                  { label: "Your Score", value: YOUR_SITE.score, sub: `vs avg ${INDUSTRY_AVG.score}`, color: "text-foreground" },
                  { label: "Competition Gap", value: `-${COMPETITORS[0].score - YOUR_SITE.score}`, sub: "to market leader", color: "text-orange-500" },
                  { label: "Industry Avg", value: INDUSTRY_AVG.score, sub: `${COMPETITORS.filter((c) => c.score > INDUSTRY_AVG.score).length} above avg`, color: "text-green-500" },
                ].map((stat) => (
                  <div key={stat.label} className="relative rounded-xl border border-border bg-card p-3">
                    <p className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">{stat.label}</p>
                    <p className={cn("font-mono text-lg sm:text-xl font-bold tabular-nums mt-0.5", stat.color)}>{stat.value}</p>
                    <p className="text-[9px] text-muted-foreground/60 mt-0.5">{stat.sub}</p>
                  </div>
                ))}
              </div>

              {/* Leaderboard + Radar Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <Leaderboard />
                <RadarChart />
              </div>

              {/* Gap Analysis */}
              <GapAnalysis />

              {/* Benchmark Graph */}
              <BenchmarkGraph />

              {/* Feature Comparison */}
              <FeatureComparison />

              {/* Recommendation Comparison */}
              <RecommendationComparison />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
