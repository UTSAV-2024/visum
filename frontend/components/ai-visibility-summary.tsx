import { cn } from "../lib/utils";
import { generateSwot } from "../lib/swot-generator";

// ── Priority display config ─────────────────────────────────────────
const priorityStyle = {
  critical: {
    dot: "bg-red-500",
    pill: "bg-red-500/10 text-red-500",
  },
  high: {
    dot: "bg-accent",
    pill: "bg-accent/10 text-accent",
  },
  medium: {
    dot: "bg-orange-500",
    pill: "bg-orange-500/10 text-orange-500",
  },
};

// ── Quadrant config ─────────────────────────────────────────────────
const QUADRANTS = [
  {
    key: "strengths",
    label: "Strengths",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
          clipRule="evenodd"
        />
      </svg>
    ),
    iconBg: "bg-green-500/10 text-green-500",
    accentRing: "ring-green-500/20",
    emptyMsg: "No major strengths identified. Focus on fixing weaknesses first.",
  },
  {
    key: "weaknesses",
    label: "Weaknesses",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
          clipRule="evenodd"
        />
      </svg>
    ),
    iconBg: "bg-red-500/10 text-red-500",
    accentRing: "ring-red-500/20",
    emptyMsg: "No critical issues found.",
  },
  {
    key: "opportunities",
    label: "Opportunities",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z"
          clipRule="evenodd"
        />
      </svg>
    ),
    iconBg: "bg-accent/10 text-accent",
    accentRing: "ring-accent/20",
    emptyMsg: "No additional opportunities detected at this time.",
  },
  {
    key: "risks",
    label: "Risks",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
    iconBg: "bg-orange-500/10 text-orange-500",
    accentRing: "ring-orange-500/20",
    emptyMsg: "No immediate risks identified.",
  },
];

// ── Item component ──────────────────────────────────────────────────
function SwotItem({ message, priority }) {
  const style = priorityStyle[priority] || priorityStyle.medium;

  return (
    <li className="flex items-start gap-2.5 text-sm leading-relaxed">
      <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", style.dot)} aria-hidden="true" />
      <span className="text-muted-foreground">{message}</span>
      <span className={cn("ml-auto shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold tracking-wide", style.pill)}>
        {priority}
      </span>
    </li>
  );
}

// ── Quadrant card ──────────────────────────────────────────────────
function QuadrantCard({ quadrant, items }) {
  return (
    <div className="flex flex-col rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={cn("flex h-7 w-7 items-center justify-center rounded-md", quadrant.iconBg)}>
            {quadrant.icon}
          </span>
          <h3 className="text-sm font-semibold text-foreground">{quadrant.label}</h3>
        </div>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {items.length}
        </span>
      </div>

      {/* Items or empty state */}
      {items.length > 0 ? (
        <ul className="flex flex-col gap-2" role="list">
          {items.map((item) => (
            <SwotItem key={item.id} message={item.message} priority={item.priority} />
          ))}
        </ul>
      ) : quadrant.emptyMsg ? (
        <p className="text-xs text-muted-foreground/60 italic leading-relaxed">{quadrant.emptyMsg}</p>
      ) : null}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────
export function AIVisibilitySummary({ checks }) {
  const swot = generateSwot(checks);
  const isEmpty =
    swot.strengths.length === 0 &&
    swot.weaknesses.length === 0 &&
    swot.opportunities.length === 0 &&
    swot.risks.length === 0;

  if (isEmpty) {
    return null;
  }

  return (
    <section aria-label="AI Visibility Summary" className="mt-10">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-foreground">What's Working & What's Not</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Prioritized breakdown of strengths, weaknesses, opportunities, and risks.
        </p>
      </div>

      {/* 2x2 grid — single column on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {QUADRANTS.map((quadrant) => (
          <QuadrantCard
            key={quadrant.key}
            quadrant={quadrant}
            items={swot[quadrant.key]}
          />
        ))}
      </div>
    </section>
  );
}
