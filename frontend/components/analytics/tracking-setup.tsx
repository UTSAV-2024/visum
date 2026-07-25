"use client";

import { useState } from "react";
import { cn } from "../../lib/utils";

/**
 * Getting a site connected.
 *
 * Every snippet here runs on the *server*. That is the whole point: AI
 * crawlers largely don't execute JavaScript, so the usual analytics pixel
 * would sit in a page they never run and report almost nothing.
 */

type Site = { id: string; domain: string; ingest_key: string };

function Snippet({ label, code }: { label: string; code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard unavailable — the code is on screen to select by hand. */
    }
  }

  return (
    <div className="rounded-lg border border-border bg-background/60">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
        <button
          type="button"
          onClick={copy}
          className="text-[11px] font-medium text-accent hover:underline"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 text-[11px] leading-relaxed text-foreground">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function TrackingSetup({
  sites,
  onAdd,
  className,
}: {
  sites: Site[];
  onAdd: (domain: string) => Promise<string>;
  className?: string;
}) {
  const [domain, setDomain] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<"vercel" | "cloudflare" | "curl">("vercel");

  const site = sites[0];
  const key = site?.ingest_key ?? "YOUR_INGEST_KEY";
  const endpoint =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/collect`
      : "https://visum-eight.vercel.app/api/collect";

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!domain.trim()) {
      setError("Enter the domain you want to track.");
      return;
    }
    setBusy(true);
    const message = await onAdd(domain.trim());
    if (message) setError(message);
    else setDomain("");
    setBusy(false);
  }

  const SNIPPETS = {
    vercel: `// middleware.ts — runs on every request, before your page does.
import { NextResponse } from "next/server";

export async function middleware(request) {
  const ua = request.headers.get("user-agent") || "";

  // Only report AI crawlers; ordinary traffic never leaves your server.
  if (/GPTBot|ClaudeBot|Claude-User|OAI-SearchBot|PerplexityBot|Google-Extended|CCBot|Bytespider|Amazonbot|Applebot-Extended|meta-externalagent/i.test(ua)) {
    // Fire and forget — never make a crawler wait on our endpoint.
    fetch("${endpoint}", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-visum-key": "${key}" },
      body: JSON.stringify({
        ua,
        path: request.nextUrl.pathname,
        ip: request.headers.get("x-forwarded-for") || "",
      }),
    }).catch(() => {});
  }

  return NextResponse.next();
}`,

    cloudflare: `// Cloudflare Worker — sits in front of any origin, framework agnostic.
export default {
  async fetch(request, env, ctx) {
    const ua = request.headers.get("user-agent") || "";

    if (/GPTBot|ClaudeBot|Claude-User|OAI-SearchBot|PerplexityBot|Google-Extended|CCBot|Bytespider|Amazonbot|Applebot-Extended|meta-externalagent/i.test(ua)) {
      // waitUntil keeps the report alive without delaying the response.
      ctx.waitUntil(
        fetch("${endpoint}", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-visum-key": "${key}" },
          body: JSON.stringify({
            ua,
            path: new URL(request.url).pathname,
            ip: request.headers.get("cf-connecting-ip") || "",
          }),
        }).catch(() => {})
      );
    }

    return fetch(request);
  },
};`,

    curl: `# Any language or a log shipper can post the same shape.
# Send one hit:
curl -X POST ${endpoint} \\
  -H "Content-Type: application/json" \\
  -H "x-visum-key: ${key}" \\
  -d '{"ua":"Mozilla/5.0 (compatible; GPTBot/1.0)","path":"/pricing","ip":"1.2.3.4"}'

# Or batch up to 200 at once, which is what you want from log processing:
curl -X POST ${endpoint} \\
  -H "Content-Type: application/json" \\
  -H "x-visum-key: ${key}" \\
  -d '{"hits":[{"ua":"...","path":"/"},{"ua":"...","path":"/docs"}]}'`,
  };

  return (
    <div className={cn("rounded-xl border border-border bg-card p-4 sm:p-6", className)}>
      <h2 className="text-sm font-semibold text-foreground">Connect your site</h2>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        AI crawlers mostly don&apos;t run JavaScript — the same reason a site that
        needs JS scores badly on our rendering check. So this reports from your
        server, not from the browser. Ordinary visitors are never sent to us:
        the snippet filters to AI crawlers before it calls out.
      </p>

      {!site ? (
        <form onSubmit={handleAdd} className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            value={domain}
            onChange={(e) => {
              setDomain(e.target.value);
              if (error) setError("");
            }}
            placeholder="example.com"
            disabled={busy}
            className="h-10 flex-1 rounded-lg border border-border bg-secondary/50 px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-accent"
          />
          <button
            type="submit"
            disabled={busy}
            className="h-10 shrink-0 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {busy ? "Adding…" : "Add site"}
          </button>
        </form>
      ) : (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-accent/10 px-2.5 py-1 font-medium text-accent">
            {site.domain}
          </span>
          <span className="text-muted-foreground">is ready to receive data</span>
        </div>
      )}

      {error && (
        <p className="mt-2 text-xs font-medium text-destructive" role="alert">
          {error}
        </p>
      )}

      {site && (
        <div className="mt-5">
          <div className="mb-3 flex gap-1">
            {(
              [
                ["vercel", "Next.js / Vercel"],
                ["cloudflare", "Cloudflare"],
                ["curl", "Anything else"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-[11px] font-medium transition-colors",
                  tab === id
                    ? "bg-accent/15 text-accent"
                    : "text-muted-foreground hover:bg-muted/20 hover:text-foreground"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <Snippet label={tab === "curl" ? "Shell" : "JavaScript"} code={SNIPPETS[tab]} />

          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
            Your ingest key is in the snippet above. It can only append visits
            for {site.domain} — it can&apos;t read your account or any data.
            Treat it as low-risk, but don&apos;t publish it: anyone holding it
            could send you junk traffic.
          </p>
        </div>
      )}
    </div>
  );
}
