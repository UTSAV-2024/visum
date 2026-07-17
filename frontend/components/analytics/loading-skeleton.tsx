import { cn } from "../../lib/utils";

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl bg-card border border-border overflow-hidden relative", className)}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
    </div>
  );
}

function SkeletonLine({ className }: { className?: string }) {
  return (
    <div className={cn("h-3 rounded-md bg-muted/20 relative overflow-hidden", className)}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
    </div>
  );
}

export function AnalyticsSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <SkeletonLine className="h-5 w-48 mb-2" />
          <SkeletonLine className="h-3 w-64" />
        </div>
        <SkeletonBlock className="h-10 w-44 rounded-xl" />
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <SkeletonBlock key={i} className="h-20" />
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <SkeletonBlock className="h-72" />
        <SkeletonBlock className="h-72" />
      </div>

      {/* Full-width timeline */}
      <SkeletonBlock className="h-56" />

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <SkeletonBlock className="h-64" />
        <SkeletonBlock className="h-64" />
      </div>

      {/* Charts row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <SkeletonBlock className="h-64" />
        <SkeletonBlock className="h-64" />
      </div>

      {/* Full width comparison */}
      <SkeletonBlock className="h-72" />

      {/* Full width trends */}
      <SkeletonBlock className="h-64" />

      {/* Insights */}
      <SkeletonBlock className="h-80" />
    </div>
  );
}
