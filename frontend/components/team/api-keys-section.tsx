import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { API_KEYS } from "./data";

export function ApiKeysSection({ className }) {
  const [isVisible, setIsVisible] = useState(false);
  const [revealed, setRevealed] = useState({});

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const toggleReveal = (id) => setRevealed((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className={cn("relative rounded-2xl border border-border bg-card transition-all duration-500", isVisible ? "opacity-100" : "opacity-0", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none rounded-2xl" />
      <div className="relative z-10 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a.75.75 0 01.294 1.02l-3.75 6.5a.75.75 0 01-1.06.23l-2.5-1.75a.75.75 0 01.872-1.22l1.784 1.249 3.345-5.795a.75.75 0 011.015-.234z" clipRule="evenodd" />
            </svg>
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground">API Keys</p>
          </div>
          <button className="inline-flex items-center gap-1 rounded-lg bg-accent/10 px-2.5 py-1.5 text-[10px] font-semibold text-accent hover:bg-accent/20 transition-all">
            <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" /></svg>
            New Key
          </button>
        </div>

        <div className="space-y-2">
          {API_KEYS.map((key) => (
            <div key={key.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-muted/10 transition-colors group">
              <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", key.active ? "bg-accent/10 text-accent" : "bg-muted/10 text-muted-foreground")}>
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a.75.75 0 01.294 1.02l-3.75 6.5a.75.75 0 01-1.06.23l-2.5-1.75a.75.75 0 01.872-1.22l1.784 1.249 3.345-5.795a.75.75 0 011.015-.234z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-semibold text-foreground">{key.name}</p>
                  <span className={cn("rounded px-1 py-px text-[8px] font-medium", key.active ? "bg-green-500/10 text-green-500" : "bg-muted/20 text-muted-foreground")}>
                    {key.active ? "Active" : "Disabled"}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <code className="text-[9px] font-mono text-muted-foreground/60 bg-muted/10 rounded px-1 py-px">
                    {revealed[key.id] ? key.key : `${key.key.slice(0, 12)}...`}
                  </code>
                  <button onClick={() => toggleReveal(key.id)} className="text-[9px] text-muted-foreground/40 hover:text-muted-foreground transition-colors">
                    {revealed[key.id] ? "Hide" : "Show"}
                  </button>
                </div>
                <p className="text-[8px] text-muted-foreground/40 mt-0.5">
                  Created {key.created} · Last used {key.lastUsed} · Permissions: {key.permissions.join(", ")}
                </p>
              </div>
              <button className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted/20">
                <svg className="h-3.5 w-3.5 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 4.5a2.5 2.5 0 11.702 1.737L6.97 9.604a2.518 2.518 0 010 .792l6.733 3.367a2.5 2.5 0 11-.671 1.341l-6.733-3.367a2.5 2.5 0 110-3.475l6.733-3.366A2.5 2.5 0 0113 4.5z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
