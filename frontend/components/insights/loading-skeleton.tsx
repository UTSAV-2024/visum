import { cn } from "../../lib/utils";

function SkeletonBlock({ className }) {
  return (
    <div className={cn("rounded-2xl bg-card border border-border overflow-hidden relative", className)}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
    </div>
  );
}

function ShimmerLine({ className }) {
  return (
    <div className={cn("rounded-md bg-muted/20 relative overflow-hidden", className)}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
    </div>
  );
}

export function InsightsSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <ShimmerLine className="h-5 w-48 mb-2" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SkeletonBlock className="h-36" />
        <SkeletonBlock className="h-36" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <SkeletonBlock className="h-96 lg:col-span-2" />
        <SkeletonBlock className="h-96" />
      </div>
      <SkeletonBlock className="h-48" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <SkeletonBlock className="h-48" />
        <SkeletonBlock className="h-48" />
      </div>
    </div>
  );
}
