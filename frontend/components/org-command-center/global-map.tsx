"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Globe, MapPin } from "lucide-react";
import { cn } from "../../lib/utils";
import { WEBSITES, type Website, type HealthStatus } from "./data";

const HEALTH_COLORS: Record<HealthStatus, string> = {
  healthy: "text-green-500",
  warning: "text-orange-500",
  critical: "text-red-500",
  down: "text-red-500",
};

const HEALTH_BG: Record<HealthStatus, string> = {
  healthy: "bg-green-500",
  warning: "bg-orange-500",
  critical: "bg-red-500",
  down: "bg-red-500",
};

interface GlobalMapProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

// Simplified world map using positioned dots
export function GlobalMap({ selectedId, onSelect }: GlobalMapProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Map coordinates to a 2D grid (x: lng mapped to width, y: lat mapped to height)
  const xRange = { min: -130, max: 160 };
  const yRange = { min: -40, max: 65 };

  const toPercent = (value: number, min: number, max: number) =>
    ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Globe className="h-3.5 w-3.5 text-accent" />
        <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground">Global Map</p>
        <span className="text-[9px] text-muted-foreground/40 ml-auto">{WEBSITES.length} sites</span>
      </div>

      <motion.div
        initial={mounted ? { opacity: 0 } : undefined}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-xl border border-border bg-card overflow-hidden"
      >
        {/* Map background */}
        <div className="relative w-full aspect-[2/1] bg-gradient-to-br from-accent/[0.02] via-muted/5 to-accent/[0.01]">
          {/* Subtle grid lines */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />

          {/* Region Labels */}
          <span className="absolute text-[8px] text-muted-foreground/20 font-semibold uppercase tracking-widest" style={{ left: '18%', top: '22%' }}>NA</span>
          <span className="absolute text-[8px] text-muted-foreground/20 font-semibold uppercase tracking-widest" style={{ left: '52%', top: '20%' }}>EU</span>
          <span className="absolute text-[8px] text-muted-foreground/20 font-semibold uppercase tracking-widest" style={{ left: '78%', top: '28%' }}>APAC</span>
          <span className="absolute text-[8px] text-muted-foreground/20 font-semibold uppercase tracking-widest" style={{ left: '28%', top: '62%' }}>LATAM</span>
          <span className="absolute text-[8px] text-muted-foreground/20 font-semibold uppercase tracking-widest" style={{ left: '60%', top: '38%' }}>MEA</span>

          {/* Site dots */}
          {WEBSITES.map((site, i) => (
            <motion.button
              key={site.id}
              initial={mounted ? { opacity: 0, scale: 0 } : undefined}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.02 * i }}
              onClick={() => onSelect(site.id)}
              style={{
                left: `${toPercent(site.lng, xRange.min, xRange.max)}%`,
                top: `${100 - toPercent(site.lat, yRange.min, yRange.max)}%`,
              }}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-200 group z-10",
                selectedId === site.id ? "z-20 scale-125" : "hover:z-20 hover:scale-125"
              )}
              title={`${site.name} (${site.aiVisibilityScore})`}
            >
              {/* Pulse ring for critical sites */}
              {site.health === "critical" && (
                <span className="absolute inset-0 rounded-full animate-ping bg-red-500/30" />
              )}

              <div className={cn(
                "relative flex items-center justify-center w-3 h-3 rounded-full border-2 border-background shadow-sm transition-colors",
                HEALTH_BG[site.health] || "bg-muted-foreground",
                selectedId === site.id && "ring-2 ring-accent/50"
              )}>
                <MapPin className="h-2 w-2 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                <div className="rounded-lg border border-border bg-card px-2 py-1 shadow-lg">
                  <p className="text-[9px] font-semibold text-foreground">{site.name}</p>
                  <p className="text-[8px] text-muted-foreground">{site.aiVisibilityScore} pts · {site.health}</p>
                </div>
              </div>
            </motion.button>
          ))}

          {/* Empty state */}
          {WEBSITES.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-xs text-muted-foreground/40">No websites to display</p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 px-3 py-2 border-t border-border/50 text-[8px] text-muted-foreground/50">
          <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-500" /> Healthy</div>
          <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-orange-500" /> Warning</div>
          <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500" /> Critical</div>
        </div>
      </motion.div>
    </div>
  );
}
