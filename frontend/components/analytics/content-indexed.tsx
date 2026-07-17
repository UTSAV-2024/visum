import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

interface TreeItem {
  label: string;
  value: number;
  color: string;
  description: string;
}

const treeData: TreeItem[] = [
  { label: "Blog Posts", value: 45, color: "#7c3aed", description: "Articles & blog content" },
  { label: "Product Pages", value: 28, color: "#6366f1", description: "Product descriptions & pricing" },
  { label: "Documentation", value: 18, color: "#3b82f6", description: "API docs & guides" },
  { label: "Landing Pages", value: 12, color: "#06b6d4", description: "Homepage & marketing pages" },
  { label: "Images/Media", value: 8, color: "#10b981", description: "Alt text & metadata" },
  { label: "Other", value: 5, color: "#f59e0b", description: "Miscellaneous content" },
];

const totalValue = treeData.reduce((s, t) => s + t.value, 0);

export function ContentIndexed({ className }: { className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Simple treemap layout: split into rows
  // Row 1: 2 items (60/40)
  // Row 2: 2 items (50/50)
  // Row 3: 2 items (60/40)
  const rows = [
    { items: [treeData[0], treeData[1]], splits: [62, 38] },
    { items: [treeData[2], treeData[3]], splits: [60, 40] },
    { items: [treeData[4], treeData[5]], splits: [60, 40] },
  ];

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-border bg-card transition-all duration-500 hover:shadow-[0_0_40px_-16px_rgba(124,58,237,0.12)]",
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
                d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground">
              Content Indexed
            </p>
          </div>
          <span className="text-[10px] text-muted-foreground/60">
            {totalValue} categories
          </span>
        </div>

        {/* Treemap */}
        <div className="space-y-2">
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} className="flex gap-2 h-16 sm:h-20">
              {row.items.map((item, itemIdx) => {
                const globalIdx = rowIdx * 2 + itemIdx;
                const isHovered = hoveredIdx === globalIdx;
                const isEmpty = hoveredIdx !== null && !isHovered;
                return (
                  <div
                    key={item.label}
                    className={cn(
                      "relative rounded-xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer overflow-hidden group"
                    )}
                    style={{
                      flex: row.splits[itemIdx],
                      backgroundColor: `${item.color}15`,
                      border: `1px solid ${item.color}30`,
                      opacity: isEmpty ? 0.3 : 1,
                    }}
                    onMouseEnter={() => setHoveredIdx(globalIdx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                    {/* Background fill */}
                    <div
                      className={cn(
                        "absolute inset-0 transition-all duration-500"
                      )}
                      style={{
                        backgroundColor: `${item.color}`,
                        opacity: isHovered ? 0.12 : 0.05,
                      }}
                    />

                    <div className="relative z-10 text-center px-2">
                      <p className="text-xs sm:text-sm font-bold text-foreground leading-tight">
                        {item.value}%
                      </p>
                      <p className="text-[9px] sm:text-[10px] text-muted-foreground leading-tight mt-0.5 truncate max-w-full">
                        {item.label}
                      </p>
                    </div>

                    {/* Tooltip */}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                      <div className="bg-card border border-border rounded-lg px-2.5 py-1.5 shadow-lg whitespace-nowrap">
                        <p className="text-[10px] font-medium text-foreground">{item.label}</p>
                        <p className="text-[9px] text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Stats footer */}
        <div className="mt-4 pt-3 border-t border-border grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="font-mono text-sm font-bold tabular-nums text-foreground">6</p>
            <p className="text-[9px] text-muted-foreground/60">Categories</p>
          </div>
          <div>
            <p className="font-mono text-sm font-bold tabular-nums text-foreground">2,847</p>
            <p className="text-[9px] text-muted-foreground/60">Pages Indexed</p>
          </div>
          <div>
            <p className="font-mono text-sm font-bold tabular-nums text-green-500">96%</p>
            <p className="text-[9px] text-muted-foreground/60">Index Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}
