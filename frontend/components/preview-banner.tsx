/**
 * The honest "this is sample data" strip.
 *
 * Shown on pages that still render demonstration data because the feature
 * needs a data source Visum doesn't produce yet. AppLayout renders it for the
 * sidebar pages; the standalone full-page views (crawl-explorer, hosted-mcp,
 * org-command-center, optimization-workspace, prompt-intelligence) render it
 * themselves, since they don't go through AppLayout.
 */
export function PreviewBanner() {
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2.5 border-b border-copper/30 bg-copper/10 px-4 py-2 text-center"
    >
      <span className="font-mono text-[11px] text-copper">preview</span>
      <p className="m-0 text-[13px] text-foreground/90">
        This page shows sample data — the feature isn&apos;t live yet.
      </p>
    </div>
  );
}
