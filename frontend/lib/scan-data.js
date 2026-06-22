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
