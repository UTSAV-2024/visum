import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  primary?: boolean;
  onClick?: () => void;
}

interface QuickActionsProps {
  onScanAgain?: () => void;
  className?: string;
}

export function QuickActions({ onScanAgain, className }: QuickActionsProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const actions: QuickAction[] = [
    {
      id: "scan",
      label: "Scan Again",
      description: "Run a fresh scan",
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zM10 7.75a.75.75 0 01.75.75v2.546l.943-1.048a.75.75 0 111.114 1.004l-2.25 2.5a.75.75 0 01-1.114 0l-2.25-2.5a.75.75 0 111.114-1.004l.943 1.048V8.5a.75.75 0 01.75-.75z"
            clipRule="evenodd"
          />
        </svg>
      ),
      primary: true,
      onClick: onScanAgain,
    },
    {
      id: "export",
      label: "Export PDF",
      description: "Download report",
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
          <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
        </svg>
      ),
    },
    {
      id: "share",
      label: "Share Report",
      description: "Copy share link",
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13 4.5a2.5 2.5 0 11.702 1.737L6.97 9.604a2.518 2.518 0 010 .792l6.733 3.367a2.5 2.5 0 11-.671 1.341l-6.733-3.367a2.5 2.5 0 110-3.475l6.733-3.366A2.5 2.5 0 0113 4.5z" />
        </svg>
      ),
    },
    {
      id: "configure",
      label: "Configure",
      description: "Alert settings",
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 3.75a2 2 0 10-4 0 2 2 0 004 0zM17.25 4.5a.75.75 0 000-1.5h-5.5a.75.75 0 000 1.5h5.5zM5 3.75a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 01.75.75zM4.25 17a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5h1.5zM17.25 17a.75.75 0 000-1.5h-5.5a.75.75 0 000 1.5h5.5zM9 10a.75.75 0 01-.75.75h-5.5a.75.75 0 010-1.5h5.5A.75.75 0 019 10zM17.25 10.75a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5h1.5zM14 10a2 2 0 10-4 0 2 2 0 004 0zM10 16.25a2 2 0 10-4 0 2 2 0 004 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div
      className={cn(
        "transition-all duration-500",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M3 4.75A2.75 2.75 0 015.75 2h8.5A2.75 2.75 0 0117 4.75v5.5A2.75 2.75 0 0114.25 13h-1.878l-2.512 2.512A1.5 1.5 0 018 14.378V13H5.75A2.75 2.75 0 013 10.25v-5.5z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-xs font-semibold uppercase tracking-widest text-foreground">
          Quick Actions
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className={cn(
              "group relative flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all duration-200",
              action.primary
                ? "border-accent/50 bg-accent/5 hover:bg-accent/10 hover:border-accent hover:shadow-[0_0_30px_-8px_rgba(124,58,237,0.3)]"
                : "border-border bg-card hover:border-accent/30 hover:bg-muted/20 hover:shadow-[0_0_20px_-12px_rgba(124,58,237,0.15)]"
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 group-hover:scale-110",
                action.primary
                  ? "bg-accent/20 text-accent group-hover:bg-accent/30"
                  : "bg-muted/20 text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent"
              )}
            >
              {action.icon}
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">
                {action.label}
              </p>
              <p className="text-[9px] text-muted-foreground/60 mt-0.5">
                {action.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
