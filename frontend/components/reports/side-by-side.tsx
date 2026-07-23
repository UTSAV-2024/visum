import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

export function SideBySide({ className, scans = [] }) {
  const [isVisible, setIsVisible] = useState(false);
  const [leftScan, setLeftScan] = useState(scans[0]?.id);
  const [rightScan, setRightScan] = useState(scans[1]?.id);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Comparing needs at least two scans.
  if (scans.length < 2) return null;

  const left = scans.find((s) => s.id === leftScan) || scans[0];
  const right = scans.find((s) => s.id === rightScan) || scans[1];

  if (!left || !right) return null;

  const diff = (a, b) => {
    if (a === b) return { text: "0", color: "text-muted-foreground" };
    const val = a - b;
    return { text: (val > 0 ? "+" : "") + val, color: val > 0 ? "text-green-500" : "text-red-500" };
  };

  const scoreDiff = diff(left.score, right.score);
  const issueDiff = diff(left.issues, right.issues);

  const rows = [
    { label: "Score", left: left.score, right: right.score, diff: scoreDiff, fmt: (v) => `${v}/100` },
    { label: "Issues", left: left.issues, right: right.issues, diff: issueDiff, fmt: (v) => `${v}` },
    { label: "Resolved", left: left.resolved, right: right.resolved, diff: diff(left.resolved, right.resolved), fmt: (v) => `${v}` },
  ];

  return (
    <div className={cn("transition-all duration-500", isVisible ? "opacity-100" : "opacity-0", className)}>
      <div className="flex items-center gap-2 mb-3">
        <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd" />
        </svg>
        <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Compare Scans</p>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {/* Selector row */}
        <div className="grid grid-cols-2 gap-0 border-b border-border">
          {["left", "right"].map((side) => (
            <div key={side} className={cn("p-3", side === "left" ? "border-r border-border" : "")}>
              <select
                value={side === "left" ? leftScan : rightScan}
                onChange={(e) => side === "left" ? setLeftScan(e.target.value) : setRightScan(e.target.value)}
                className="w-full rounded-lg border border-border bg-muted/10 px-2.5 py-1.5 text-[10px] font-medium text-foreground outline-none focus:border-accent"
              >
                {scans.map((s) => (
                  <option key={s.id} value={s.id} disabled={s.id === (side === "left" ? rightScan : leftScan)}>
                    {s.date} — Score: {s.score}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Comparison rows */}
        <div className="divide-y divide-border">
          {rows.map((row) => (
            <div key={row.label} className="grid grid-cols-3 gap-0">
              <div className="px-3 py-2.5 text-center">
                <span className="font-mono text-sm font-bold tabular-nums text-foreground">{row.fmt(row.left)}</span>
              </div>
              <div className="px-3 py-2.5 text-center border-x border-border bg-muted/5">
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{row.label}</span>
              </div>
              <div className="px-3 py-2.5 text-center">
                <span className="font-mono text-sm font-bold tabular-nums text-foreground">{row.fmt(row.right)}</span>
              </div>
            </div>
          ))}

          {/* Score diff row */}
          <div className="grid grid-cols-3 gap-0">
            <div className="px-3 py-2.5 text-center col-start-2">
              <span className={cn("font-mono text-sm font-bold tabular-nums", scoreDiff.color)}>
                {scoreDiff.text} pts
              </span>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="px-4 py-3 bg-muted/5 border-t border-border">
          <p className="text-[10px] text-muted-foreground/60 text-center">
            {left.date} vs {right.date} —{" "}
            {left.score > right.score
              ? `Score improved by ${left.score - right.score} points`
              : left.score < right.score
              ? `Score decreased by ${right.score - left.score} points`
              : "Score remained the same"}
          </p>
        </div>
      </div>
    </div>
  );
}
