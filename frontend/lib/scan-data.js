/**
 * Return a letter grade for a given score (A, B, C, D, F).
 * Grades make AI visibility status instantly understandable.
 */
export function getGrade(score) {
  if (score >= 90) return { letter: "A", color: "text-green-500", bg: "bg-green-500/10", ring: "ring-green-500/30", label: "Your website is excellently prepared for AI visibility." };
  if (score >= 80) return { letter: "B", color: "text-green-400", bg: "bg-green-500/5",  ring: "ring-green-500/20", label: "Your website is well-prepared for AI visibility." };
  if (score >= 65) return { letter: "C", color: "text-accent",     bg: "bg-accent/10",    ring: "ring-accent/30",    label: "Your website has room for AI visibility improvement." };
  if (score >= 45) return { letter: "D", color: "text-orange-500", bg: "bg-orange-500/10", ring: "ring-orange-500/30", label: "Your website has significant AI visibility gaps." };
  return { letter: "F", color: "text-red-500",    bg: "bg-red-500/10",    ring: "ring-red-500/30",    label: "Your website has major AI visibility issues." };
}

/**
 * Return styling tokens for a given score band.
 */
export function getBand(score) {
  if (score >= 85) {
    return {
      label: "Excellent — Agent Ready",
      text: "text-green-500",
      pill: "bg-green-500/20",
      pillText: "text-green-500",
    };
  }
  if (score >= 65) {
    return {
      label: "Good — Needs Improvement",
      text: "text-accent",
      pill: "bg-accent/10",
      pillText: "text-accent",
    };
  }
  if (score >= 40) {
    return {
      label: "Fair — Many Gaps",
      text: "text-orange-500",
      pill: "bg-orange-500/20",
      pillText: "text-orange-500",
    };
  }
  return {
    label: "Poor — Not Agent Ready",
    text: "text-red-500",
    pill: "bg-red-500/20",
    pillText: "text-red-500",
  };
}
