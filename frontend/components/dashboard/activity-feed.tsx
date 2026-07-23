import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

interface Activity {
  id: string;
  type: "scan" | "fix" | "alert" | "improvement" | "degradation";
  title: string;
  description: string;
  timestamp: string;
}

const activityConfig = {
  scan: {
    icon: (
      <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5z"
          clipRule="evenodd"
        />
      </svg>
    ),
    bg: "bg-accent/10",
    text: "text-accent",
  },
  fix: {
    icon: (
      <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
          clipRule="evenodd"
        />
      </svg>
    ),
    bg: "bg-green-500/10",
    text: "text-green-500",
  },
  alert: {
    icon: (
      <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
    bg: "bg-orange-500/10",
    text: "text-orange-500",
  },
  improvement: {
    icon: (
      <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.563a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-3.95V16.25A.75.75 0 0110 17z"
          clipRule="evenodd"
        />
      </svg>
    ),
    bg: "bg-blue-500/10",
    text: "text-blue-500",
  },
  degradation: {
    icon: (
      <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M10 3a.75.75 0 01.75.75v10.638l3.96-3.96a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 3.95V3.75A.75.75 0 0110 3z"
          clipRule="evenodd"
        />
      </svg>
    ),
    bg: "bg-red-500/10",
    text: "text-red-500",
  },
};

interface ActivityFeedProps {
  className?: string;
  /** Real events reconstructed from the account's scan trail. */
  activities?: Activity[];
}

export function ActivityFeed({ className, activities = [] }: ActivityFeedProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-border bg-card transition-all duration-500 hover:border-accent/30",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none rounded-2xl" />

      <div className="relative z-10 p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground">
              Activity Feed
            </p>
          </div>
          <span className="text-[10px] text-muted-foreground">Live</span>
        </div>

        {/* Feed */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[17px] top-3 bottom-3 w-px bg-border" />

          <div className="space-y-0">
            {activities.map((activity, idx) => {
              const config = activityConfig[activity.type];
              return (
                <div
                  key={activity.id}
                  className="relative flex items-start gap-3 py-2 group/activity"
                  style={{
                    animationDelay: `${idx * 30}ms`,
                  }}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-200",
                      config.bg,
                      config.text,
                      "group-hover/activity:scale-110"
                    )}
                  >
                    {config.icon}
                  </div>

                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-xs font-semibold text-foreground">
                      {activity.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                      {activity.description}
                    </p>
                    <p className="text-[9px] text-muted-foreground/50 mt-0.5">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Empty state */}
        {activities.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <svg
              className="h-8 w-8 text-muted-foreground/30 mb-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-xs font-medium text-muted-foreground">
              No recent activity
            </p>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5">
              Activity will appear here as changes happen
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
