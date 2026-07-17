import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

interface FixedIssue {
  id: string;
  title: string;
  category: string;
  fixedAt: string;
}

const recentlyFixed: FixedIssue[] = [
  {
    id: "1",
    title: "Added sitemap.xml reference",
    category: "Crawlability",
    fixedAt: "2 hours ago",
  },
  {
    id: "2",
    title: "Updated meta description",
    category: "Meta Tags",
    fixedAt: "Yesterday",
  },
  {
    id: "3",
    title: "Fixed Open Graph image URL",
    category: "Meta Tags",
    fixedAt: "2 days ago",
  },
  {
    id: "4",
    title: "Improved page load speed (3.2s → 1.8s)",
    category: "Performance",
    fixedAt: "3 days ago",
  },
];

interface RecentlyFixedProps {
  className?: string;
}

export function RecentlyFixed({ className }: RecentlyFixedProps) {
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
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/[0.02] to-transparent pointer-events-none rounded-2xl" />

      <div className="relative z-10 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground">
              Recently Fixed
            </p>
          </div>
          <span className="text-[10px] text-muted-foreground">
            {recentlyFixed.length} fixes
          </span>
        </div>

        <div className="space-y-1">
          {recentlyFixed.map((item, idx) => (
            <div
              key={item.id}
              className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-muted/20"
              style={{
                animationDelay: `${idx * 50}ms`,
              }}
            >
              {/* Checkmark */}
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-foreground group-hover:text-green-500 transition-colors line-clamp-1">
                  {item.title}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="rounded-md bg-green-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-green-500">
                  {item.category}
                </span>
                <span className="text-[10px] text-muted-foreground/60">
                  {item.fixedAt}
                </span>
              </div>
            </div>
          ))}
        </div>

        {recentlyFixed.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <svg
              className="h-8 w-8 text-muted-foreground/30 mb-2"
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
              No recently fixed issues
            </p>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5">
              Fixes will appear here as you resolve them
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
