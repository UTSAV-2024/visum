import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "../../lib/utils";

type Preset = "7d" | "30d" | "90d" | "custom";

interface DateRangePickerProps {
  value?: { start: string; end: string; preset: Preset };
  onChange?: (range: { start: string; end: string; preset: Preset }) => void;
  className?: string;
}

const presets: { key: Preset; label: string }[] = [
  { key: "7d", label: "Last 7 days" },
  { key: "30d", label: "Last 30 days" },
  { key: "90d", label: "Last 90 days" },
  { key: "custom", label: "Custom" },
];

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function getDateRange(preset: Preset): { start: string; end: string } {
  const now = new Date();
  const end = formatDate(now);
  const start = new Date(now);
  if (preset === "7d") start.setDate(start.getDate() - 7);
  else if (preset === "30d") start.setDate(start.getDate() - 30);
  else if (preset === "90d") start.setDate(start.getDate() - 90);
  else {
    start.setDate(start.getDate() - 30);
  }
  return { start: formatDate(start), end };
}

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [activePreset, setActivePreset] = useState<Preset>(value?.preset || "30d");
  const [startDate, setStartDate] = useState(value?.start || getDateRange("30d").start);
  const [endDate, setEndDate] = useState(value?.end || getDateRange("30d").end);
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  const handlePreset = (preset: Preset) => {
    setActivePreset(preset);
    if (preset !== "custom") {
      const range = getDateRange(preset);
      setStartDate(range.start);
      setEndDate(range.end);
      onChange?.({ ...range, preset });
      setOpen(false);
    } else {
      setActivePreset("custom");
    }
  };

  const handleApply = () => {
    onChange?.({ start: startDate, end: endDate, preset: "custom" });
    setOpen(false);
  };

  const displayLabel = activePreset === "custom"
    ? `${startDate} → ${endDate}`
    : presets.find((p) => p.key === activePreset)?.label || "Select range";

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/20 transition-all"
      >
        <svg className="h-3.5 w-3.5 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
            clipRule="evenodd"
          />
        </svg>
        <span>{displayLabel}</span>
        <svg className={cn("h-3 w-3 text-muted-foreground transition-transform", open && "rotate-180")} viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 w-72 rounded-xl border border-border bg-card shadow-xl p-3">
          {/* Presets */}
          <div className="grid grid-cols-2 gap-1 mb-3">
            {presets.map((p) => (
              <button
                key={p.key}
                onClick={() => handlePreset(p.key)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all",
                  activePreset === p.key
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/10"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Custom date inputs */}
          <div className="space-y-2">
            <div>
              <label className="text-[9px] font-medium text-muted-foreground/60 uppercase tracking-wider">
                Start date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setActivePreset("custom"); }}
                className="w-full mt-1 rounded-lg border border-border bg-muted/20 px-3 py-1.5 text-xs text-foreground outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="text-[9px] font-medium text-muted-foreground/60 uppercase tracking-wider">
                End date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setActivePreset("custom"); }}
                className="w-full mt-1 rounded-lg border border-border bg-muted/20 px-3 py-1.5 text-xs text-foreground outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="rounded-lg bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
