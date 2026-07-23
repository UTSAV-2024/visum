import { useState, useEffect } from "react";
import { cn } from "../../lib/utils";

interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  message: string;
  time: string;
}

const alertIcons = {
  critical: (
    <svg className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
        clipRule="evenodd"
      />
    </svg>
  ),
  warning: (
    <svg className="h-4 w-4 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
        clipRule="evenodd"
      />
    </svg>
  ),
  info: (
    <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

const alertColors = {
  critical: "border-l-red-500/50 bg-red-500/5",
  warning: "border-l-orange-500/50 bg-orange-500/5",
  info: "border-l-accent/50 bg-accent/5",
};

interface AlertsPanelProps {
  className?: string;
  /** Real alerts derived from the latest scan's open issues. */
  alerts?: Alert[];
}

export function AlertsPanel({ className, alerts = [] }: AlertsPanelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const visibleAlerts = alerts.filter((a) => !dismissed.has(a.id));

  function handleDismiss(id: string) {
    setDismissed((prev) => new Set(prev).add(id));
  }

  function handleDismissAll() {
    setDismissed(new Set(alerts.map((a) => a.id)));
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-500",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-2">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-9.25a.75.75 0 00-1.5 0v.5a.75.75 0 001.5 0v-.5zm0 3.5a.75.75 0 00-1.5 0v.5a.75.75 0 001.5 0v-.5z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground">
            Alerts
          </p>
          {visibleAlerts.length > 0 && (
            <span className="inline-flex items-center justify-center h-5 min-w-[20px] rounded-full bg-orange-500/20 px-1.5 text-[10px] font-bold text-orange-500">
              {visibleAlerts.length}
            </span>
          )}
        </div>
        {visibleAlerts.length > 0 && (
          <button
            onClick={handleDismissAll}
            className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Dismiss all
          </button>
        )}
      </div>

      {/* Alerts list */}
      <div className="px-3 pb-3 space-y-1.5 max-h-[280px] overflow-y-auto scrollbar-thin">
        {visibleAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <svg
              className="h-8 w-8 text-green-500/50 mb-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-xs font-medium text-muted-foreground">
              No active alerts
            </p>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5">
              Everything looks good
            </p>
          </div>
        ) : (
          visibleAlerts.map((alert) => (
            <div
              key={alert.id}
              className={cn(
                "group relative flex items-start gap-2.5 rounded-xl border-l-2 p-3 transition-all duration-200 hover:bg-muted/20",
                alertColors[alert.type]
              )}
            >
              <div className="mt-0.5 shrink-0">{alertIcons[alert.type]}</div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground">
                  {alert.title}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                  {alert.message}
                </p>
                <p className="text-[10px] text-muted-foreground/50 mt-1">
                  {alert.time}
                </p>
              </div>
              <button
                onClick={() => handleDismiss(alert.id)}
                className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-md hover:bg-muted/30 text-muted-foreground hover:text-foreground"
                aria-label={`Dismiss ${alert.title}`}
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
