/**
 * Raised when the scan was refused rather than failed: the user is signed out,
 * or their allowance is spent. The UI reacts to these differently from a
 * crawler error — one sends you to sign in, the other opens the upgrade modal.
 */
export class ScanRefusedError extends Error {
  constructor(message, { code, status, quota } = {}) {
    super(message);
    this.name = "ScanRefusedError";
    this.code = code;
    this.status = status;
    this.quota = quota || null;
  }
}

/**
 * Run a scan.
 *
 * This goes through our own API route rather than straight to the scanner:
 * authentication, quota and usage tracking all happen server-side, where the
 * browser can't reach them.
 *
 * @returns {Promise<{scan_id: string, result: object, account: object|null}>}
 */
export async function scanUrl(url) {
  const response = await fetch("/api/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin", // carry the session cookie
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    if (response.status === 401 || response.status === 402) {
      throw new ScanRefusedError(payload.error || "Scan refused", {
        code: payload.code,
        status: response.status,
        quota: payload.quota,
      });
    }
    throw new Error(payload.error || "Scan failed");
  }

  return response.json();
}

/** Fetch the signed-in user's plan and usage. Returns null when signed out. */
export async function fetchAccount() {
  const response = await fetch("/api/account", { credentials: "same-origin" });
  if (!response.ok) return null;
  return response.json();
}
