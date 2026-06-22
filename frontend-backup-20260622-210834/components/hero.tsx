import { useState } from "react";
import { scanUrl } from "../lib/api";
import { track } from "../lib/posthog";

export function Hero({ onScanStart, onScanEnd }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;

    // Validate URL
    let parsed;
    try {
      parsed = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    } catch {
      setError("Please enter a valid URL (e.g., https://yourstore.com)");
      return;
    }

    setError("");
    setLoading(true);
    track("scan_initiated", { url: parsed.href });

    if (onScanStart) onScanStart();

    try {
      const data = await scanUrl(parsed.href);
      track("scan_completed", {
        url: parsed.href,
        score: data.result.total_score,
        band: data.result.band,
      });
      sessionStorage.setItem("visum_result", JSON.stringify(data));
      if (onScanEnd) onScanEnd(data);
    } catch (err) {
      const message = err.message || "Scan failed. Please try again.";
      setError(message);
      track("scan_error", { url: parsed.href, error: message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="scan" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-50/40 to-transparent"
      />
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            AI agent readiness scanner
          </span>

          <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight text-navy sm:text-5xl lg:text-6xl">
            Is your site visible to AI agents?
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-slate-600">
            AI assistants and autonomous agents are the new front door to your business. Visum scans your site in
            seconds and shows exactly how machines see, read, and act on it.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-10 flex w-full max-w-xl flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="scan-url" className="sr-only">
              Website URL
            </label>
            <div className="relative flex-1">
              <input
                id="scan-url"
                type="text"
                inputMode="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit(e);
                }}
                placeholder="yourwebsite.com"
                disabled={loading}
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-60"
                aria-describedby={error ? "scan-error" : undefined}
                aria-invalid={!!error}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-6 text-base font-semibold text-white shadow-sm transition-all hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Scanning...
                </>
              ) : (
                "Scan my site"
              )}
            </button>
          </form>

          {error && (
            <p id="scan-error" className="mt-4 text-sm font-medium text-red-600" role="alert">
              {error}
            </p>
          )}

          <p className="mt-4 text-xs text-slate-400">
            Free instant report · No signup required · 8 readiness checks
          </p>
        </div>
      </div>
    </section>
  );
}
