/**
 * Compute the score bucket label for a given score.
 * This is shared by all analytics events so bucket labels stay consistent.
 */
export function getScoreBucket(score) {
  if (score >= 85) return "85-100";
  if (score >= 65) return "65-84";
  if (score >= 40) return "40-64";
  return "0-39";
}

/**
 * Track an analytics event.
 * Fire and forget — never blocks the UI.
 */
export function track(event, properties = {}) {
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, properties }),
  }).catch(() => {});
}