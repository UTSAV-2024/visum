import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { scanUrl, persistScan } from "../lib/api";
import { track, getScoreBucket } from "../lib/analytics";
import { Container } from "./container";
import { EASE_OUT_EXPO } from "./motion";

const progressMessages = [
  { message: "Checking permissions...", pct: 15 },
  { message: "Analyzing structure...", pct: 30 },
  { message: "Testing AI accessibility...", pct: 45 },
  { message: "Evaluating content...", pct: 60 },
  { message: "Measuring speed...", pct: 75 },
  { message: "Calculating score...", pct: 90 },
];

const exampleUrls = ["yourstore.com", "agencywebsite.com", "saasproduct.com"];

/*
  The machine's-eye view: what a crawler reads when it visits a page.
  Typed out line by line like an instrument printing its findings.
*/
const crawlerLines = [
  { text: "GET / HTTP/1.1", tone: "dim" },
  { text: "200 OK · text/html · 84kb", tone: "dim" },
  { text: "robots.txt ............ ALLOW", tone: "pass" },
  { text: "json-ld ............... none", tone: "fail" },
  { text: "llms.txt .............. 404", tone: "fail" },
  { text: "meta/og ............... 4 of 6", tone: "warn" },
  { text: "sitemap.xml ........... ok, 7 urls", tone: "pass" },
  { text: "render check .......... js-locked", tone: "warn" },
  { text: "verdict: partially readable", tone: "verdict" },
];

const toneClass = {
  dim: "text-muted-foreground/70",
  pass: "text-pass",
  warn: "text-warn",
  fail: "text-fail",
  verdict: "text-primary",
};

function MachineEyeView() {
  const reduce = useReducedMotion();
  const [visibleCount, setVisibleCount] = useState(reduce ? crawlerLines.length : 0);

  useEffect(() => {
    if (reduce) return;
    if (visibleCount >= crawlerLines.length) return;
    const t = setTimeout(
      () => setVisibleCount((c) => c + 1),
      visibleCount === 0 ? 900 : 380
    );
    return () => clearTimeout(t);
  }, [visibleCount, reduce]);

  return (
    <div className="scan-sweep relative overflow-hidden rounded-xl border border-border bg-card/80">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="font-mono text-[11px] text-muted-foreground">
          crawler://any-website.com
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-primary">
          <span className="phosphor-pulse inline-block h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
          reading
        </span>
      </div>
      <div className="px-4 py-4 font-mono text-[12.5px] leading-[1.9]" aria-label="Example of how an AI crawler reads a website">
        {crawlerLines.map((line, i) => (
          <div
            key={line.text}
            className={`${toneClass[line.tone]} ${line.tone === "verdict" ? "mt-2 border-t border-border pt-2" : ""} transition-opacity duration-300`}
            style={{ opacity: i < visibleCount ? 1 : 0 }}
          >
            {line.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Hero({ onScanStart, onScanEnd }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progressIndex, setProgressIndex] = useState(0);
  const intervalRef = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const id = setTimeout(() => {
      if (!loading) {
        setProgressIndex(0);
        return;
      }
      intervalRef.current = setInterval(() => {
        setProgressIndex((prev) => (prev + 1) % progressMessages.length);
      }, 3500);
    }, 0);
    return () => clearTimeout(id);
  }, [loading]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function handleExampleClick(example) {
    setUrl(example);
    if (error) setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Enter your domain to get started.");
      return;
    }

    let parsed;
    try {
      parsed = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    } catch {
      setError('That doesn\'t look like a valid URL. Try "yourstore.com."');
      return;
    }

    setError("");
    setLoading(true);
    const scanStartTime = performance.now();
    track("scan_initiated", { url: parsed.href });

    if (onScanStart) onScanStart();

    let data;
    try {
      data = await scanUrl(parsed.href);
      const scanTimeMs = Math.round(performance.now() - scanStartTime);
      track("scan_completed", {
        url: parsed.href,
        score: data.result.total_score,
        band: data.result.band,
        duration_ms: scanTimeMs,
        score_bucket: getScoreBucket(data.result.total_score),
      });
      // Store scan data directly — results page reads this immediately
      sessionStorage.setItem("visum_result", JSON.stringify(data));
      // Persist so it appears in the signed-in user's scan history.
      // Fire-and-forget: never let this block or break the result flow.
      void persistScan(data);
    } catch (err) {
      const message =
        err.message || "Scan failed. This site might be blocking our crawler. Try another URL.";
      setError(message);
      const scanTimeMs = Math.round(performance.now() - scanStartTime);
      track("scan_error", { url: parsed.href, error: message, duration_ms: scanTimeMs });
      track("scan_failed", { url: parsed.href, error: message, duration_ms: scanTimeMs });
    } finally {
      setLoading(false);
    }

    // Navigate outside try/catch — a navigation error must not mask a successful scan
    if (data && onScanEnd) {
      onScanEnd(data);
    }
  }

  const entrance = (delay) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: EASE_OUT_EXPO },
        };

  return (
    <section id="scan" className="relative overflow-hidden py-20 sm:py-28">
      {/* Phosphor grid backdrop — decorative only */}
      <div className="instrument-grid absolute inset-0 pointer-events-none" aria-hidden="true" />

      <Container className="relative">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[7fr_5fr] lg:gap-20">
          {/* Left: the claim + the scanner */}
          <div className="flex flex-col gap-7">
            <motion.h1
              {...entrance(0)}
              className="font-extrabold leading-[1.04] tracking-[-0.025em] text-foreground"
              style={{ fontSize: "var(--text-display)" }}
            >
              AI reads your website.
              <br />
              <span className="text-primary">Badly, probably.</span>
            </motion.h1>

            <motion.p
              {...entrance(0.12)}
              className="max-w-[58ch] text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              When ChatGPT or Perplexity visits your site, it doesn&apos;t see your design —
              it parses your markup. Visum runs the 8 checks machines actually use and shows
              you, in about 20 seconds, exactly what they can and can&apos;t read.
            </motion.p>

            <motion.form
              {...entrance(0.22)}
              onSubmit={handleSubmit}
              noValidate
              className="flex w-full flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="scan-url" className="sr-only">
                Website URL
              </label>
              <div className="relative flex-[2]">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-primary/60"
                >
                  ›
                </span>
                <input
                  id="scan-url"
                  type="text"
                  inputMode="url"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="yourstore.com"
                  disabled={loading}
                  className="h-13 w-full rounded-xl border border-border bg-input py-3.5 pl-9 pr-4 font-mono text-[15px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
                  aria-describedby={error ? "scan-error" : undefined}
                  aria-invalid={!!error}
                />
              </div>
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={reduce ? undefined : { scale: 0.97 }}
                className="inline-flex h-13 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-base font-bold text-primary-foreground transition-colors hover:bg-brand-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Scanning…
                  </>
                ) : (
                  "Run the scan"
                )}
              </motion.button>
            </motion.form>

            <motion.div {...entrance(0.3)} className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[13px] text-muted-foreground">
                <span>Try your own, or scan:</span>
                {exampleUrls.map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => handleExampleClick(example)}
                    disabled={loading}
                    aria-label={`Try scanning ${example}`}
                    className="cursor-pointer border-0 bg-transparent p-0 font-mono text-[13px] text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {example}
                  </button>
                ))}
              </div>

              {loading && (
                <div className="flex flex-col gap-2" aria-live="polite">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-muted-foreground">
                      {progressMessages[progressIndex].message}
                    </span>
                    <span className="font-mono text-[13px] text-primary">
                      {progressMessages[progressIndex].pct}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-700"
                      style={{
                        width: `${progressMessages[progressIndex].pct}%`,
                        transitionTimingFunction: "cubic-bezier(0.25, 1, 0.5, 1)",
                      }}
                      role="progressbar"
                      aria-valuenow={progressMessages[progressIndex].pct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Scan progress"
                    />
                  </div>
                </div>
              )}

              {error && (
                <p id="scan-error" className="text-sm font-medium text-fail" role="alert">
                  {error}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] text-muted-foreground">
                <span>Free</span>
                <span aria-hidden="true" className="text-border">·</span>
                <span>No account needed</span>
                <span aria-hidden="true" className="text-border">·</span>
                <span>Results in ~20 seconds</span>
              </div>
            </motion.div>
          </div>

          {/* Right: the machine's-eye view */}
          <motion.div
            {...(reduce
              ? {}
              : {
                  initial: { opacity: 0, y: 36 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.9, delay: 0.35, ease: EASE_OUT_EXPO },
                })}
            className="w-full lg:justify-self-end"
          >
            <MachineEyeView />
            <p className="mt-3 text-center font-mono text-[11px] text-muted-foreground/70">
              what the crawler sees — not your design, your markup
            </p>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
