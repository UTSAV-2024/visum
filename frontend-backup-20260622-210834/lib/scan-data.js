/**
 * Return styling tokens for a given score band.
 */
export function getBand(score) {
  if (score >= 85) {
    return {
      label: "Excellent — Agent Ready",
      text: "text-green-600",
      ring: "ring-4 ring-green-200",
      pill: "bg-green-100",
      pillText: "text-green-700",
    };
  }
  if (score >= 65) {
    return {
      label: "Good — Needs Improvement",
      text: "text-brand",
      ring: "ring-4 ring-brand-200",
      pill: "bg-brand-100",
      pillText: "text-brand-700",
    };
  }
  if (score >= 40) {
    return {
      label: "Fair — Many Gaps",
      text: "text-orange-600",
      ring: "ring-4 ring-orange-200",
      pill: "bg-orange-100",
      pillText: "text-orange-700",
    };
  }
  return {
    label: "Poor — Not Agent Ready",
    text: "text-red-600",
    ring: "ring-4 ring-red-200",
    pill: "bg-red-100",
    pillText: "text-red-700",
  };
}
