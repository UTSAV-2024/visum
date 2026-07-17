import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { track } from "../../lib/analytics";

export function ExportActions({ onExportPDF, onExportCSV, onShare, className }) {
  const [isVisible, setIsVisible] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const actions = [
    {
      label: "Export PDF",
      icon: "M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75zM3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z",
      onClick: () => { onExportPDF?.(); track("report_export_pdf", {}); },
      primary: true,
    },
    {
      label: "Export CSV",
      icon: "M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zM7 8.75a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75zm0 3a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75z",
      onClick: () => { onExportCSV?.(); track("report_export_csv", {}); },
      primary: false,
    },
    {
      label: shared ? "Link Copied!" : "Share Report",
      icon: "M13 4.5a2.5 2.5 0 11.702 1.737L6.97 9.604a2.518 2.518 0 010 .792l6.733 3.367a2.5 2.5 0 11-.671 1.341l-6.733-3.367a2.5 2.5 0 110-3.475l6.733-3.366A2.5 2.5 0 0113 4.5z",
      onClick: () => {
        onShare?.();
        setShared(true);
        setTimeout(() => setShared(false), 2000);
        track("report_shared", {});
      },
      primary: false,
    },
  ];

  return (
    <div className={cn("transition-all duration-500", isVisible ? "opacity-100" : "opacity-0", className)}>
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-all",
              action.primary
                ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                : "border border-border bg-card text-foreground hover:bg-muted/20"
            )}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d={action.icon} clipRule="evenodd" />
            </svg>
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
