import { cn } from "../../lib/utils";

function SkeletonBlock({ className }) {
  return <div className={cn("rounded-2xl bg-card border border-border overflow-hidden relative", className)}><div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" /></div>;
}

function SkeletonLine({ className }) {
  return <div className={cn("h-3 rounded-md bg-muted/20 relative overflow-hidden", className)}><div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" /></div>;
}

export function CompetitorsSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div><SkeletonLine className="h-5 w-56 mb-2" /><SkeletonLine className="h-3 w-72" /></div>
        <SkeletonBlock className="h-9 w-24 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <SkeletonBlock className="h-64" /><SkeletonBlock className="h-64" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <SkeletonBlock className="h-48" /><SkeletonBlock className="h-48" />
      </div>
      <SkeletonBlock className="h-72" />
      <SkeletonBlock className="h-64" />
    </div>
  );
}
