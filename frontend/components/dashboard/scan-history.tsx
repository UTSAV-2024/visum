import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

interface ScanEntry {
  id: string;
  date: string;
  score: number;
  status: "completed" | "in_progress" | "failed";
  changes: number;
}

const scanHistory: ScanEntry[] = [
  { id: "1", date: "Jul 17, 2026, 10:30 AM", score: 78, status: "completed", changes: 3 },
  { id: "2", date: "Jul 16, 2026, 2:15 PM", score: 73, status: "completed", changes: 0 },
  { id: "3", date: "Jul 15, 2026, 9:00 AM", score: 71, status: "completed", changes: 1 },
  { id: "4", date: "Jul 13, 2026, 4:45 PM", score: 68, status: "completed", changes: 0 },
  { id: "5", date: "Jul 10, 2026, 11:20 AM", score: 65, status: "completed", changes: 2 },
];

interface ScanHistoryProps {
  className?: string;
}

export function ScanHistory({ className }: ScanHistoryProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const displayed = expanded ? scanHistory : scanHistory.slice(0, 3);

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-border bg-card transition-all duration-500 hover:border-accent/30 group",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none rounded-2xl" />

      <div className="relative z-10 p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm4.75 6.75a.75.75 0 011.5 0v2.546l.943-1.048a.75.75 0 011.114 1.004l-2.25 2.5a.75.75 0 01-1.114 0l-2.25-2.5a.75.75 0 111.114-1.004l.943 1.048V8.75z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground">
              Scan History
            </p>
          </div>
          <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-bold text-accent">
            +5 pts
          </span>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />

          <div className="space-y-0">
            {displayed.map((scan, idx) => {
              const isLatest = idx === 0;
              const scoreChange =
                idx < scanHistory.length - 1
                  ? scan.score - scanHistory[idx + 1].score
                  : null;

              return (
                <div
                  key={scan.id}
                  className="relative flex items-start gap-3 py-2.5 group/row"
                >
                  {/* Dot */}
                  <div className="relative z-10 mt-1">
                    <div
                      className={cn(
                        "h-3.5 w-3.5 rounded-full border-2 transition-all duration-300",
                        scan.status === "completed"
                          ? "border-accent bg-card group-hover/row:bg-accent"
                          : scan.status === "in_progress"
                          ? "border-orange-500 bg-card animate-pulse"
                          : "border-red-500 bg-card",
                        isLatest && "ring-2 ring-accent/20"
                      )}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="font-mono text-sm font-bold tabular-nums text-foreground">
                          {scan.score}
                        </span>
                        <span className="text-xs text-muted-foreground/60">
                          /100
                        </span>
                      </div>
                      {scoreChange !== null && scoreChange !== 0 && (
                        <span
                          className={cn(
                            "text-[10px] font-semibold",
                            scoreChange > 0
                              ? "text-green-500"
                              : "text-red-500"
                          )}
                        >
                          {scoreChange > 0 ? "+" : ""}
                          {scoreChange}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-muted-foreground/60">
                        {scan.date}
                      </span>
                      {scan.changes > 0 && (
                        <span className="rounded-full bg-accent/10 px-1.5 py-[1px] text-[9px] font-medium text-accent">
                          {scan.changes} change{scan.changes !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Show more */}
        {scanHistory.length > 3 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 w-full rounded-lg py-2 text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-all"
          >
            {expanded
              ? "Show less"
              : `Show all ${scanHistory.length} scans`}
          </button>
        )}

        {/* Empty state */}
        {scanHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <svg
              className="h-8 w-8 text-muted-foreground/30 mb-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-xs font-medium text-muted-foreground">
              No scans yet
            </p>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5">
              Scan your website to start tracking
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
