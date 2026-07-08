/**
 * Return a letter grade for a given score (A, B, C, D, F).
 * Grades make AI visibility status instantly understandable.
 */
export function getGrade(score) {
  if (score >= 85) return { letter: "A", color: "text-green-500", bg: "bg-green-500/10", ring: "ring-green-500/30", label: "In great shape. Minor tweaks recommended." };
  if (score >= 65) return { letter: "B", color: "text-accent",     bg: "bg-accent/10",    ring: "ring-accent/30",    label: "Solid foundation. Several improvements available." };
  if (score >= 40) return { letter: "C", color: "text-orange-500", bg: "bg-orange-500/10", ring: "ring-orange-500/30", label: "Significant gaps. Major improvements needed." };
  return { letter: "D", color: "text-red-500",    bg: "bg-red-500/10",    ring: "ring-red-500/30",    label: "Critical issues. Most AI systems can't read your site." };
}

/**
 * Return styling tokens for a given score band.
 */
export function getBand(score) {
  if (score >= 85) {
    return {
      label: "Excellent — AI Optimized",
      text: "text-green-500",
      pill: "bg-green-500/20",
      pillText: "text-green-500",
    };
  }
  if (score >= 65) {
    return {
      label: "Good — Needs Work",
      text: "text-accent",
      pill: "bg-accent/10",
      pillText: "text-accent",
    };
  }
  if (score >= 40) {
    return {
      label: "Warning — Visibility Gaps",
      text: "text-orange-500",
      pill: "bg-orange-500/20",
      pillText: "text-orange-500",
    };
  }
  return {
    label: "Critical — Invisible to AI",
    text: "text-red-500",
    pill: "bg-red-500/20",
    pillText: "text-red-500",
  };
}
