import { cn } from "../lib/utils";

const statusConfig = {
  PASS: {
    label: "PASS",
    className: "bg-green-100 text-green-700",
    bar: "bg-green-500",
  },
  PART: {
    label: "PART",
    className: "bg-orange-100 text-orange-700",
    bar: "bg-orange-500",
  },
  FAIL: {
    label: "FAIL",
    className: "bg-red-100 text-red-700",
    bar: "bg-red-500",
  },
};

export function CheckCard({ check }) {
  const status = check.passed ? "PASS" : check.partial ? "PART" : "FAIL";
  const config = statusConfig[status];
  const pct = Math.round((check.score / check.max_score) * 100);

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {/* Status icon */}
          <span
            className={cn(
              "flex size-5 shrink-0 items-center justify-center rounded-full",
              status === "PASS" && "text-green-600",
              status === "PART" && "text-orange-600",
              status === "FAIL" && "text-red-600",
            )}
            aria-hidden="true"
          >
            {status === "PASS" ? (
              <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
            ) : status === "PART" ? (
              <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </span>
          <h3 className="font-medium leading-tight text-slate-900 text-pretty">{check.name}</h3>
        </div>
        <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide", config.className)}>
          {config.label}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-sm font-semibold text-slate-900">
            {check.score}
            <span className="text-slate-400">/{check.max_score}</span>
          </span>
          <span className="text-xs text-slate-400">{pct}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={cn("h-full rounded-full transition-all duration-500", config.bar)}
            style={{ width: `${pct}%` }}
            role="progressbar"
            aria-valuenow={check.score}
            aria-valuemin={0}
            aria-valuemax={check.max_score}
            aria-label={`${check.name} score`}
          />
        </div>
      </div>

      {check.finding && (
        <div className="flex flex-col gap-1 text-sm leading-relaxed">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Finding</span>
          <p className="text-slate-600">{check.finding}</p>
        </div>
      )}

      {!check.passed && check.fix && (
        <div className="rounded-lg bg-brand-50 px-3 py-2 text-sm leading-relaxed text-brand">
          <span className="font-semibold">Fix:</span> {check.fix}
        </div>
      )}
    </article>
  );
}
