const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function scanUrl(url) {
  const response = await fetch(`${API_URL}/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Scan failed");
  }

  return response.json();
}

/**
 * Persist a completed scan so it shows up in the signed-in user's history.
 *
 * The server route resolves the user from the session cookies and stamps
 * user_id itself — we never send a user id from the browser. Fire-and-forget:
 * a persistence failure must never break the scan experience.
 *
 * @param {{scan_id?: string, result: object}} data - the /scan API response
 * @param {string} [email] - optional email (used by the anonymous email gate)
 */
export async function persistScan(data, email) {
  try {
    const result = data?.result;
    if (!result || typeof result.total_score !== "number") return;

    await fetch("/api/save-scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin", // send auth cookies so the server can attribute the scan
      body: JSON.stringify({
        scan_id: data.scan_id,
        url: result.url,
        email,
        total_score: result.total_score,
        band: result.band,
        checks: result.checks,
        scan_time_ms: result.scan_time_ms,
      }),
    });
  } catch {
    // Non-fatal by design.
  }
}
