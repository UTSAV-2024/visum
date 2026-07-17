import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { getBand } from "../../lib/scan-data";

export function ScanHeader({
  url,
  score,
  scanTimeMs,
  onScanAgain,
  className,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const band = getBand(score);
  const scanTime = scanTimeMs ? `${(scanTimeMs / 1000).toFixed(1)}s` : null;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={cn(
        "transition-all duration-500",
        isVisible ? "opacity-100" : "opacity-0",
        className
      )}
    >
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10">
            <svg className="h-5 w-5 text-accent" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-foreground truncate">
              Scan Results
            </h1>
            <p className="text-xs text-muted-foreground truncate">{url}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
              band.pill,
              band.pillText
            )}
          >
            {band.label}
          </span>
          {scanTime && (
            <span className="text-[10px] text-muted-foreground/60">
              {scanTime}
            </span>
          )}
          <button
            onClick={onScanAgain}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39l.001-.001z"
                clipRule="evenodd"
              />
            </svg>
            Rescan
          </button>
        </div>
      </div>
    </div>
  );
}
