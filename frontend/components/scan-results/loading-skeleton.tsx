import { cn } from "../../lib/utils";

function SkeletonBlock({ className }) {
  return (
    <div className={cn("rounded-2xl bg-card border border-border overflow-hidden relative", className)}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
    </div>
  );
}

function SkeletonLine({ className }) {
  return (
    <div className={cn("h-3 rounded-md bg-muted/20 relative overflow-hidden", className)}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
    </div>
  );
}

export function ScanResultsSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <SkeletonLine className="h-5 w-48 mb-2" />
          <SkeletonLine className="h-3 w-64" />
        </div>
        <SkeletonBlock className="h-9 w-24 rounded-xl" />
      </div>

      {/* Score + Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
        <SkeletonBlock className="h-64 lg:col-span-3" />
        <SkeletonBlock className="h-64 lg:col-span-2" />
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <SkeletonBlock key={i} className="h-16" />
        ))}
      </div>

      {/* Tab bar */}
      <SkeletonBlock className="h-10" />

      {/* Check cards */}
      <div className="space-y-3">
        <SkeletonBlock className="h-20" />
        <SkeletonBlock className="h-20" />
        <SkeletonBlock className="h-20" />
      </div>

      {/* Timeline + Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <SkeletonBlock className="h-72" />
        <SkeletonBlock className="h-72" />
      </div>
    </div>
  );
}
