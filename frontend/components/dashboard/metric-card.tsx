import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

interface MetricCardProps {
  label: string;
  value: number;
  maxValue?: number;
  icon?: React.ReactNode;
  description?: string;
  status?: "success" | "warning" | "error" | "neutral";
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const statusColors = {
  success: {
    text: "text-green-500",
    bg: "bg-green-500/10",
    bar: "bg-green-500",
    glow: "from-green-500/5",
  },
  warning: {
    text: "text-orange-500",
    bg: "bg-orange-500/10",
    bar: "bg-orange-500",
    glow: "from-orange-500/5",
  },
  error: {
    text: "text-red-500",
    bg: "bg-red-500/10",
    bar: "bg-red-500",
    glow: "from-red-500/5",
  },
  neutral: {
    text: "text-accent",
    bg: "bg-accent/10",
    bar: "bg-accent",
    glow: "from-accent/5",
  },
};

const sizeConfig = {
  sm: {
    padding: "p-4",
    valueSize: "text-2xl",
    iconSize: "h-8 w-8",
  },
  md: {
    padding: "p-5",
    valueSize: "text-3xl",
    iconSize: "h-10 w-10",
  },
  lg: {
    padding: "p-6",
    valueSize: "text-4xl",
    iconSize: "h-12 w-12",
  },
};

export function MetricCard({
  label,
  value,
  maxValue = 100,
  icon,
  description,
  status = "neutral",
  trend,
  trendValue,
  className,
  size = "md",
}: MetricCardProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const colors = statusColors[status];
  const config = sizeConfig[size];

  const percent = Math.min((value / maxValue) * 100, 100);

  useEffect(() => {
    setIsVisible(true);
    const timeout = setTimeout(() => setAnimatedValue(value), 200);
    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-500 hover:border-accent/30 hover:shadow-[0_0_30px_-12px_rgba(124,58,237,0.15)] group",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
        config.padding,
        className
      )}
    >
      {/* Background effect */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br",
          colors.glow,
          "to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        )}
      />

      {/* Icon */}
      {icon && (
        <div
          className={cn(
            "flex items-center justify-center rounded-xl mb-3 transition-colors duration-300",
            colors.bg,
            config.iconSize
          )}
        >
          {icon}
        </div>
      )}

      {/* Label */}
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>

      {/* Value */}
      <div className="flex items-baseline gap-1.5 mt-1">
        <span
          className={cn(
            "font-mono font-bold leading-none tabular-nums transition-colors duration-500",
            colors.text,
            config.valueSize
          )}
        >
          {Math.round(animatedValue)}
        </span>
        <span className="text-xs text-muted-foreground/60">/ {maxValue}</span>
      </div>

      {/* Description */}
      {description && (
        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
          {description}
        </p>
      )}

      {/* Progress bar */}
      <div className="mt-3 h-1 rounded-full bg-border overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out",
            colors.bar
          )}
          style={{ width: `${isVisible ? percent : 0}%` }}
        />
      </div>

      {/* Trend */}
      {trend && (
        <div className="flex items-center gap-1 mt-2">
          {trend === "up" ? (
            <svg
              className="h-3 w-3 text-green-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.563a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-3.95V16.25A.75.75 0 0110 17z"
                clipRule="evenodd"
              />
            </svg>
          ) : trend === "down" ? (
            <svg
              className="h-3 w-3 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a.75.75 0 01.75.75v10.638l3.96-3.96a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 3.95V3.75A.75.75 0 0110 3z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="h-3 w-3 text-muted-foreground"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {trendValue && (
            <span className="text-[10px] font-medium text-muted-foreground">
              {trendValue}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
