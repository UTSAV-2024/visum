import { cn } from "../lib/utils";
import { getBand } from "../lib/scan-data";

export function ScoreHero({ score, url }) {
  const band = getBand(score);

  return (
    <section className="flex flex-col items-center gap-5 text-center">
      <p className="text-sm text-slate-500">
        AI readiness report for{" "}
        <span className="font-medium text-slate-900 break-all">{url}</span>
      </p>

      <div
        className={cn(
          "flex size-44 flex-col items-center justify-center rounded-full sm:size-52",
          band.ring,
        )}
      >
        <span
          className={cn(
            "font-mono text-6xl font-bold leading-none tabular-nums sm:text-7xl",
            band.text,
          )}
        >
          {score}
        </span>
        <span className="mt-1 text-sm font-medium text-slate-400">/ 100</span>
      </div>

      <span
        className={cn(
          "rounded-full px-4 py-1.5 text-sm font-semibold",
          band.pill,
          band.pillText,
        )}
      >
        {band.label}
      </span>
    </section>
  );
}
